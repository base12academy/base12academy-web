import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AlertCriteria = {
  q?: string;
  territory?: string;
  administration?: string;
  category?: string;
  group?: string;
  status?: string;
  deadline?: string;
  date?: string;
};

type CreateAlertBody = {
  type?: "general" | "convocatoria";
  callId?: string;
  email?: string;
  fullName?: string;
  criteria?: AlertCriteria;
  emailEnabled?: boolean;
  telegramEnabled?: boolean;
  serviceConsent?: boolean;
  commercialConsent?: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function bearer(request: NextRequest) {
  const value = request.headers.get("authorization");
  return value?.startsWith("Bearer ") ? value.slice(7) : null;
}

function clean(value: unknown, max = 120) {
  return typeof value === "string"
    ? value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max)
    : "";
}

function cleanCriteria(criteria: AlertCriteria | undefined) {
  const result: Record<string, string> = {};
  for (const key of [
    "q",
    "territory",
    "administration",
    "category",
    "group",
    "status",
    "deadline",
    "date",
  ] as const) {
    const value = clean(criteria?.[key]);
    if (value) result[key] = value;
  }
  return result;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendConfirmation(input: {
  email: string;
  title: string;
  managementUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: "Tu alerta del Banco de Opositores está activa",
      html: `
        <div style="font-family:Arial,sans-serif;color:#262626;line-height:1.6;max-width:620px;margin:auto">
          <h1 style="color:#6f0718;font-size:24px">Alerta activada</h1>
          <p>Te avisaremos sobre <strong>${escapeHtml(input.title)}</strong> cuando exista una novedad oficial relevante.</p>
          <p><a href="${escapeHtml(input.managementUrl)}" style="display:inline-block;background:#6f0718;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px">Gestionar mis alertas</a></p>
          <p style="font-size:13px;color:#666">Este mensaje corresponde a una alerta de servicio. No implica consentimiento para publicidad.</p>
        </div>`,
    }),
    cache: "no-store",
  });

  return response.ok;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateAlertBody;
    const type = body.type === "convocatoria" ? "convocatoria" : "general";
    const email = clean(body.email, 254).toLowerCase();
    const fullName = clean(body.fullName, 100) || null;
    const emailEnabled = body.emailEnabled !== false;
    const telegramEnabled = body.telegramEnabled === true;

    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Indica un correo electrónico válido." }, { status: 400 });
    }
    if (!body.serviceConsent) {
      return NextResponse.json(
        { error: "Debes aceptar el aviso de servicio para crear la alerta." },
        { status: 400 }
      );
    }
    if (!emailEnabled && !telegramEnabled) {
      return NextResponse.json({ error: "Elige al menos un canal de aviso." }, { status: 400 });
    }
    if (type === "convocatoria" && !body.callId) {
      return NextResponse.json({ error: "Falta la convocatoria que deseas seguir." }, { status: 400 });
    }

    const supabase = getSupabase();
    let userId: string | null = null;
    const accessToken = bearer(request);
    if (accessToken) {
      const { data } = await supabase.auth.getUser(accessToken);
      userId = data.user?.id ?? null;
    }
    if (telegramEnabled && !userId) {
      return NextResponse.json(
        {
          error: "Para recibir avisos por Telegram debes acceder a tu cuenta Base12 y vincular Telegram voluntariamente.",
          requiresLogin: true,
        },
        { status: 401 }
      );
    }

    let callTitle = "nuevas convocatorias que coincidan con tus criterios";
    if (type === "convocatoria") {
      const { data: call } = await supabase
        .from("opposition_calls")
        .select("id,title")
        .eq("id", body.callId!)
        .eq("active", true)
        .maybeSingle();
      if (!call) {
        return NextResponse.json({ error: "La convocatoria ya no está disponible." }, { status: 404 });
      }
      callTitle = call.title;
    }

    const managementToken = randomBytes(32).toString("base64url");
    const tokenHash = hashToken(managementToken);
    const now = new Date().toISOString();
    const { data: existingSubscriber } = await supabase
      .from("opposition_subscribers")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    let subscriberId: string;
    if (existingSubscriber) {
      subscriberId = existingSubscriber.id;
      const { error } = await supabase
        .from("opposition_subscribers")
        .update({
          user_id: userId,
          full_name: fullName,
          management_token_hash: tokenHash,
          active: true,
        })
        .eq("id", subscriberId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("opposition_subscribers")
        .insert({
          user_id: userId,
          email,
          full_name: fullName,
          management_token_hash: tokenHash,
          active: true,
        })
        .select("id")
        .single();
      if (error) throw error;
      subscriberId = data.id;
    }

    const { error: alertError } = await supabase.from("opposition_alerts").insert({
      subscriber_id: subscriberId,
      alert_type: type,
      call_id: type === "convocatoria" ? body.callId : null,
      criteria: type === "general" ? cleanCriteria(body.criteria) : {},
      email_enabled: emailEnabled,
      telegram_enabled: telegramEnabled,
      service_consent_at: now,
      telegram_consent_at: telegramEnabled ? now : null,
      commercial_consent_at: body.commercialConsent ? now : null,
    });
    if (alertError) throw alertError;

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://base12academy.es").replace(/\/$/, "");
    const managementUrl = `${siteUrl}/banco-opositores/alertas?token=${encodeURIComponent(managementToken)}`;
    const emailSent = await sendConfirmation({ email, title: callTitle, managementUrl });

    return NextResponse.json({
      ok: true,
      emailSent,
      managementUrl,
      telegramLinked: telegramEnabled,
    });
  } catch (error) {
    console.error("Error creando alerta de oposiciones", error);
    return NextResponse.json({ error: "No se pudo crear la alerta." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token") ?? "";
    if (token.length < 30) return NextResponse.json({ error: "Enlace no válido." }, { status: 401 });
    const supabase = getSupabase();
    const { data: subscriber } = await supabase
      .from("opposition_subscribers")
      .select("id,email,full_name")
      .eq("management_token_hash", hashToken(token))
      .eq("active", true)
      .maybeSingle();
    if (!subscriber) return NextResponse.json({ error: "Enlace caducado o no válido." }, { status: 401 });

    const { data, error } = await supabase
      .from("opposition_alerts")
      .select("id,alert_type,criteria,email_enabled,telegram_enabled,active,created_at,call:opposition_calls(title,slug)")
      .eq("subscriber_id", subscriber.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ subscriber, alerts: data ?? [] });
  } catch (error) {
    console.error("Error consultando alertas", error);
    return NextResponse.json({ error: "No se pudieron consultar las alertas." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as { token?: string; alertId?: string; active?: boolean };
    if (!body.token || !body.alertId) {
      return NextResponse.json({ error: "Solicitud incompleta." }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data: subscriber } = await supabase
      .from("opposition_subscribers")
      .select("id")
      .eq("management_token_hash", hashToken(body.token))
      .eq("active", true)
      .maybeSingle();
    if (!subscriber) return NextResponse.json({ error: "Enlace no válido." }, { status: 401 });

    const { error } = await supabase
      .from("opposition_alerts")
      .update({ active: body.active !== false })
      .eq("id", body.alertId)
      .eq("subscriber_id", subscriber.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error actualizando alerta", error);
    return NextResponse.json({ error: "No se pudo actualizar la alerta." }, { status: 500 });
  }
}
