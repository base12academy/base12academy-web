import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { requestClientIp, verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MATERIALS = new Map([
  ["syllabus_glossary", { label: "Temario + Glosario", cents: 11900 }],
  ["explanations_ai", { label: "Explicaciones + asistente IA", cents: 15900 }],
  ["simulations", { label: "Simulacros", cents: 2900 }],
  ["tests", { label: "Test · 2.500 preguntas", cents: 4900 }],
  ["complete", { label: "Curso completo", cents: 31900 }],
]);

const REFERENCE_KINDS = new Set(["current", "bank", "latest"]);

function clean(value: unknown, max = 250) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validHttpUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function hashIp(ip: string | null) {
  if (!ip) return null;
  const salt = process.env.CHECKOUT_TOKEN_PEPPER || process.env.SUPABASE_SERVICE_ROLE_KEY || "tehalo-opositores";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function isMissingRequestsTable(error: unknown) {
  const message = error && typeof error === "object" && "message" in error
    ? String((error as { message?: unknown }).message)
    : String(error ?? "");
  return /tehalo_opposition_requests|schema cache|does not exist/i.test(message);
}

function buildReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `TEH-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function sendEmail(input: { to: string; subject: string; text: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.warn("Correo de Tehalo no enviado: faltan RESEND_API_KEY o RESEND_FROM_EMAIL.");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [input.to], subject: input.subject, text: input.text, html: input.html }),
  });

  if (!response.ok) {
    console.error("Resend rechazó un correo de Tehalo", response.status, await response.text().catch(() => ""));
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const remoteIp = requestClientIp(request);
    const turnstileOk = await verifyTurnstileToken({ token: clean(body.turnstileToken, 2048), remoteIp });
    if (!turnstileOk) {
      return NextResponse.json({ ok: false, error: "Completa la verificación anti-bots antes de enviar la solicitud." }, { status: 403 });
    }

    const fullName = clean(body.fullName, 160);
    const email = clean(body.email, 254).toLowerCase();
    const oppositionName = clean(body.opposition, 300);
    const administration = clean(body.administration, 160);
    const positionName = clean(body.position, 160);
    const level = clean(body.level, 80);
    const territory = clean(body.territory, 160);
    const referenceKind = clean(body.referenceKind, 20);
    const officialCallId = clean(body.officialCallId, 80) || null;
    const suppliedOfficialUrl = clean(body.officialUrl, 1000);
    const latestAuthorization = body.latestAuthorization === true;
    const privacyAccepted = body.privacyAccepted === true;
    const physicalPersonConfirmed = body.physicalPersonConfirmed === true;
    const marketingAccepted = body.marketingAccepted === true;
    const requestedMaterials: string[] = Array.isArray(body.materials)
      ? Array.from(new Set<string>(
          (body.materials as unknown[])
            .map((item) => clean(item, 40))
            .filter((item) => MATERIALS.has(item))
        ))
      : [];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Indica un correo electrónico válido." }, { status: 400 });
    }
    if ([oppositionName, administration, positionName, level, territory].some((value) => value.length < 2)) {
      return NextResponse.json({ ok: false, error: "Completa todos los datos de la oposición." }, { status: 400 });
    }
    if (!REFERENCE_KINDS.has(referenceKind) || (referenceKind === "latest" && !latestAuthorization)) {
      return NextResponse.json({ ok: false, error: "Debes indicar y autorizar la convocatoria de referencia." }, { status: 400 });
    }
    if (!validHttpUrl(suppliedOfficialUrl)) {
      return NextResponse.json({ ok: false, error: "El enlace de la convocatoria debe ser una dirección web válida." }, { status: 400 });
    }
    if (!requestedMaterials.length || !privacyAccepted || !physicalPersonConfirmed) {
      return NextResponse.json({ ok: false, error: "Selecciona los materiales y acepta las condiciones necesarias." }, { status: 400 });
    }

    const supabase = getSupabase();
    const ipHash = hashIp(remoteIp);
    let storageReady = true;
    if (ipHash) {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count, error: rateError } = await supabase
        .from("tehalo_opposition_requests")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", since);
      if (rateError) {
        if (isMissingRequestsTable(rateError)) storageReady = false;
        else throw rateError;
      }
      if ((count ?? 0) >= 5) {
        return NextResponse.json({ ok: false, error: "Se han recibido varias solicitudes en poco tiempo. Inténtalo más tarde." }, { status: 429 });
      }
    }

    let officialCall: { id: string; title: string; official_url: string; base12_course_slug: string | null } | null = null;
    if (officialCallId) {
      const { data, error } = await supabase
        .from("opposition_calls")
        .select("id,title,official_url,base12_course_slug")
        .eq("id", officialCallId)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      officialCall = data;
      if (!officialCall) {
        return NextResponse.json({ ok: false, error: "La convocatoria seleccionada ya no está disponible. Vuelve a buscarla." }, { status: 400 });
      }
    }

    const officialUrl = officialCall?.official_url || suppliedOfficialUrl || null;
    const indicativeMinimumCents = requestedMaterials.includes("complete")
      ? MATERIALS.get("complete")!.cents
      : requestedMaterials.reduce((sum: number, id: string) => sum + (MATERIALS.get(id)?.cents ?? 0), 0);
    const materialLabels = requestedMaterials.map((id: string) => MATERIALS.get(id)!.label);
    const reusable = officialCall?.base12_course_slug ? ["Estructura y materiales comunes ya disponibles en Base12"] : [];
    const reference = buildReference();
    const now = new Date().toISOString();

    let requestId: string | null = null;
    if (storageReady) {
      const { data: created, error: insertError } = await supabase
        .from("tehalo_opposition_requests")
        .insert({
        reference,
        full_name: fullName || "No facilitado",
        email,
        person_type: "physical",
        opposition_name: oppositionName,
        official_call_id: officialCall?.id || null,
        official_url: officialUrl,
        administration,
        position_name: positionName,
        level,
        territory,
        reference_kind: referenceKind,
        latest_authorization: latestAuthorization,
        requested_materials: requestedMaterials,
        indicative_minimum_cents: indicativeMinimumCents,
        classification: {
          reusable,
          adaptable: materialLabels,
          new: officialCall ? [] : ["Localización y validación de la convocatoria oficial"],
        },
        supervision: {
          official_call_located: Boolean(officialCall),
          official_url_supplied: Boolean(officialUrl),
          program_review: "pending",
          coherence_review: "pending",
          latest_call_authorized: referenceKind !== "latest" || latestAuthorization,
        },
        status: "received",
        privacy_consent_at: now,
        marketing_consent_at: marketingAccepted ? now : null,
        ip_hash: ipHash,
        user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
        })
        .select("id,reference")
        .single();

      if (insertError) {
        if (isMissingRequestsTable(insertError)) storageReady = false;
        else throw insertError;
      } else if (!created) {
        throw new Error("No se pudo registrar la solicitud.");
      } else {
        requestId = created.id;
      }
    }

    const materialText = materialLabels.join(", ");
    const customerText = [
      "Hemos recibido tu solicitud de Tehalo Pruebas Opositores.", "",
      `Referencia: ${reference}`, `Oposición: ${oppositionName}`, `Material solicitado: ${materialText}`, "",
      "Revisaremos la convocatoria y te enviaremos por correo un presupuesto con el precio final y el plazo de entrega.",
      "Si decides aceptarlo, ese correo incluirá la posibilidad de pagar de forma segura mediante Redsys.",
      "En este formulario no se ha realizado ningún pago.", "", "Tehalo Pruebas Opositores · Editorial EC Libros, S. L.",
    ].join("\n");
    const customerHtml = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:auto;color:#16343a;line-height:1.6"><h2 style="color:#087f83">Solicitud recibida</h2><p>Hemos recibido tu solicitud de <strong>Tehalo Pruebas Opositores</strong>.</p><div style="padding:16px;border:1px solid #b8dede;border-radius:12px;background:#f2fbfa"><div><strong>Referencia:</strong> ${escapeHtml(reference)}</div><div><strong>Oposición:</strong> ${escapeHtml(oppositionName)}</div><div><strong>Material:</strong> ${escapeHtml(materialText)}</div></div><p>Revisaremos la convocatoria y te enviaremos por correo un presupuesto con el precio final y el plazo de entrega.</p><p>Si decides aceptarlo, ese correo incluirá la posibilidad de pagar de forma segura mediante Redsys.</p><p><strong>En este formulario no se ha realizado ningún pago.</strong></p><p style="color:#567176">Tehalo Pruebas Opositores · Editorial EC Libros, S. L.</p></div>`;

    const customerEmailSent = await sendEmail({
      to: email,
      subject: `Solicitud recibida · ${reference} · Tehalo Pruebas Opositores`,
      text: customerText,
      html: customerHtml,
    }).catch(() => false);

    const internalEmail = process.env.TEHALO_REQUEST_EMAIL?.trim() || "eclibros@gmail.com";
    const internalText = [
      "Nueva solicitud de Tehalo Pruebas Opositores.", "", `Referencia: ${reference}`, `Nombre: ${fullName || "No facilitado"}`,
      `Email: ${email}`, `Oposición: ${oppositionName}`, `Administración: ${administration}`, `Puesto: ${positionName}`,
      `Nivel: ${level}`, `Territorio: ${territory}`, `Referencia normativa: ${referenceKind}`,
      `Convocatoria oficial: ${officialUrl || "Pendiente de localizar"}`, `Materiales: ${materialText}`,
      `Importe mínimo orientativo: ${(indicativeMinimumCents / 100).toFixed(2)} €`, "",
      storageReady ? "Registro guardado en la base de datos." : "Registro recibido por correo; pendiente de activar el archivo en la base de datos.",
      "Acción: revisar, preparar el presupuesto y enviar el enlace Redsys únicamente dentro del correo del presupuesto.",
    ].join("\n");
    const internalEmailSent = await sendEmail({
      to: internalEmail,
      subject: `Nueva solicitud Tehalo · ${reference} · ${oppositionName}`,
      text: internalText,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;white-space:pre-wrap">${escapeHtml(internalText)}</div>`,
    }).catch(() => false);

    if (!internalEmailSent && !storageReady) {
      throw new Error("La solicitud no pudo guardarse ni entregarse por correo.");
    }

    return NextResponse.json({ ok: true, requestId, reference, customerEmailSent, internalEmailSent }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Tehalo opposition request error", error);
    return NextResponse.json({ ok: false, error: "No se pudo registrar la solicitud. Inténtalo de nuevo." }, { status: 500 });
  }
}
