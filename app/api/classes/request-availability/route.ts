import { requestClientIp, verifyTurnstileToken } from "@/lib/turnstile";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_SUBJECTS = new Set([
  "Matemáticas II",
  "Matemáticas Aplicadas a las CCSS",
  "Lengua y Literatura",
  "Física y Química",
  "Física",
  "Química",
]);

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function requestIp(request: NextRequest) {
  const forwarded =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    forwarded ||
    request.headers.get("x-real-ip")?.trim() ||
    ""
  );
}

function hashIp(ip: string) {
  if (!ip) return null;

  const salt =
    process.env.CHECKOUT_TOKEN_PEPPER ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "base12-classes-request";

  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");
}

function extractEmail(value: string) {
  const match = value.match(/<([^<>@\s]+@[^<>@\s]+)>/);
  return match?.[1] || value.trim();
}

async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    console.warn(
      "Correo de solicitud de Clases Online no enviado: faltan RESEND_API_KEY o RESEND_FROM_EMAIL."
    );
    return false;
  }

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Resend rechazó un correo de solicitud de Clases Online",
      {
        status: response.status,
        detail: await response.text().catch(() => ""),
      }
    );
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body =
      await request.json().catch(() => ({}));

    const turnstileToken = normalize(body?.turnstileToken);

    const turnstileOk = await verifyTurnstileToken({
      token: turnstileToken,
      remoteIp: requestClientIp(request),
    });

    if (!turnstileOk) {
      return NextResponse.json(
        {
          ok: false,
          error: "Completa la verificación anti-bots antes de enviar la solicitud.",
          code: "TURNSTILE_REQUIRED",
        },
        { status: 403 }
      );
    }

    const fullName = normalize(body?.fullName);
    const email = normalize(body?.email).toLowerCase();
    const phone = normalize(body?.phone);
    const autonomousCommunity =
      normalize(body?.autonomousCommunity);
    const academicLevel =
      normalize(body?.academicLevel);
    const subject = normalize(body?.subject);
    const topic = normalize(body?.topic);
    const bookPublisher =
      normalize(body?.bookPublisher);
    const notes = normalize(body?.notes);
    const privacyAccepted =
      body?.privacyAccepted === true;

    if (fullName.length < 3) {
      return NextResponse.json(
        {
          ok: false,
          error: "Indica tu nombre y apellidos.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Indica un correo electrónico válido.",
        },
        { status: 400 }
      );
    }

    if (
      !/^\+\d[\d\s().-]{5,24}$/.test(phone)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Indica un móvil con prefijo internacional, por ejemplo +34 600 000 000.",
        },
        { status: 400 }
      );
    }

    if (!autonomousCommunity) {
      return NextResponse.json(
        {
          ok: false,
          error: "Indica tu comunidad autónoma.",
        },
        { status: 400 }
      );
    }

    if (academicLevel.length < 2) {
      return NextResponse.json(
        {
          ok: false,
          error: "Indica el nivel o curso.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_SUBJECTS.has(subject)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Selecciona una asignatura disponible.",
        },
        { status: 400 }
      );
    }

    if (topic.length < 3) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Indica brevemente el tema o contenido que necesitas trabajar.",
        },
        { status: 400 }
      );
    }

    if (!privacyAccepted) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Debes aceptar el tratamiento de los datos para gestionar la solicitud.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const duplicateSince =
      new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const {
      data: recentRequest,
      error: recentError,
    } = await supabase
      .from("class_availability_requests")
      .select("id")
      .eq("email", email)
      .eq("subject", subject)
      .gte("created_at", duplicateSince)
      .limit(1)
      .maybeSingle();

    if (recentError) {
      throw recentError;
    }

    if (recentRequest) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Ya hemos recibido una solicitud similar hace unos minutos.",
        },
        { status: 429 }
      );
    }

    const {
      data: created,
      error: insertError,
    } = await supabase
      .from("class_availability_requests")
      .insert({
        full_name: fullName,
        email,
        phone,
        autonomous_community: autonomousCommunity,
        academic_level: academicLevel,
        subject,
        topic,
        book_publisher: bookPublisher || null,
        notes: notes || null,
        privacy_accepted: true,
        status: "pending",
        ip_hash: hashIp(requestIp(request)),
        user_agent:
          request.headers.get("user-agent") || null,
      })
      .select("id, created_at")
      .single();

    if (insertError || !created) {
      throw insertError ??
        new Error(
          "No se pudo registrar la solicitud."
        );
    }

    const reference =
      created.id.split("-")[0].toUpperCase();

    const studentText = [
      `Hola ${fullName},`,
      "",
      "Hemos recibido tu solicitud de disponibilidad para Clases Online.",
      "",
      `Referencia: ${reference}`,
      `Asignatura: ${subject}`,
      `Nivel o curso: ${academicLevel}`,
      `Tema: ${topic}`,
      bookPublisher
        ? `Editorial: ${bookPublisher}`
        : "Editorial: no indicada",
      "",
      "Esta solicitud no implica contratación ni pago.",
      "Base12 Academy comprobará manualmente la disponibilidad y se pondrá en contacto contigo.",
      "Solo después de confirmar que podemos atender la asignatura y el horario se habilitará la contratación.",
      "",
      "Base12 Academy",
    ].join("\n");

    const studentHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;line-height:1.55">
        <div style="padding:24px 0 18px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:22px;font-weight:800;color:#0b4fc2">Base12 Academy</div>
        </div>
        <div style="padding:26px 0">
          <p>Hola ${escapeHtml(fullName)},</p>
          <p>Hemos recibido tu solicitud de disponibilidad para <strong>Clases Online</strong>.</p>
          <div style="margin:22px 0;padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px">
            <div><strong>Referencia:</strong> ${escapeHtml(reference)}</div>
            <div><strong>Asignatura:</strong> ${escapeHtml(subject)}</div>
            <div><strong>Nivel o curso:</strong> ${escapeHtml(academicLevel)}</div>
            <div><strong>Tema:</strong> ${escapeHtml(topic)}</div>
            <div><strong>Editorial:</strong> ${escapeHtml(bookPublisher || "No indicada")}</div>
          </div>
          <p><strong>No se ha realizado ninguna contratación ni pago.</strong></p>
          <p>
            Base12 Academy comprobará manualmente la disponibilidad y se pondrá
            en contacto contigo. Solo después de confirmar que podemos atender
            la asignatura y el horario se habilitará la contratación.
          </p>
        </div>
      </div>
    `;

    const studentEmailSent =
      await sendEmail({
        to: email,
        subject:
          "Solicitud recibida · Clases Online · Base12 Academy",
        text: studentText,
        html: studentHtml,
      }).catch(() => false);

    const configuredAdmin =
      process.env.CLASSES_REQUEST_EMAIL?.trim();

    const fallbackAdmin =
      process.env.RESEND_FROM_EMAIL
        ? extractEmail(
            process.env.RESEND_FROM_EMAIL
          )
        : "";

    const adminEmail =
      configuredAdmin || fallbackAdmin;

    let adminEmailSent = false;

    if (adminEmail) {
      const adminText = [
        "Nueva solicitud de disponibilidad para Clases Online.",
        "",
        `Referencia: ${reference}`,
        `Nombre: ${fullName}`,
        `Email: ${email}`,
        `Móvil: ${phone}`,
        `Comunidad autónoma: ${autonomousCommunity}`,
        `Nivel o curso: ${academicLevel}`,
        `Asignatura: ${subject}`,
        `Tema: ${topic}`,
        `Editorial: ${bookPublisher || "No indicada"}`,
        `Observaciones: ${notes || "Sin observaciones"}`,
        "",
        "Estado inicial: pending",
        "La contratación no debe habilitarse hasta confirmar manualmente la disponibilidad.",
      ].join("\n");

      const adminHtml = `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;line-height:1.55">
          <h2>Nueva solicitud de disponibilidad</h2>
          <p><strong>Referencia:</strong> ${escapeHtml(reference)}</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#64748b">Nombre</td><td style="padding:6px 0;font-weight:700">${escapeHtml(fullName)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Móvil</td><td style="padding:6px 0">${escapeHtml(phone)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Comunidad</td><td style="padding:6px 0">${escapeHtml(autonomousCommunity)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Nivel</td><td style="padding:6px 0">${escapeHtml(academicLevel)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Asignatura</td><td style="padding:6px 0;font-weight:700">${escapeHtml(subject)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Tema</td><td style="padding:6px 0">${escapeHtml(topic)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Editorial</td><td style="padding:6px 0">${escapeHtml(bookPublisher || "No indicada")}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Observaciones</td><td style="padding:6px 0">${escapeHtml(notes || "Sin observaciones")}</td></tr>
          </table>
          <p style="margin-top:20px">
            <strong>No habilitar contratación hasta confirmar manualmente la disponibilidad.</strong>
          </p>
        </div>
      `;

      adminEmailSent =
        await sendEmail({
          to: adminEmail,
          subject:
            `Nueva solicitud de Clases Online · ${subject} · ${fullName}`,
          text: adminText,
          html: adminHtml,
        }).catch(() => false);
    }

    return NextResponse.json(
      {
        ok: true,
        requestId: created.id,
        reference,
        studentEmailSent,
        adminEmailSent,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Class availability request error",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo registrar la solicitud. Inténtalo de nuevo.",
      },
      { status: 500 }
    );
  }
}
