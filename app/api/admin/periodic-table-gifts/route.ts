import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import {
  createGiftCode,
  giftErrorMessage,
  hashGiftCode,
  isValidGiftEmail,
  normalizeGiftEmail,
  PERIODIC_TABLE_GIFT_CAMPAIGN,
} from "@/lib/chemistry/periodic-table-gift";

const ADMIN_EMAIL = "base12academy@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendGiftEmail(input: {
  assignedEmail: string;
  claimUrl: string;
  validDays: number;
  codeHash: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.warn("Regalo creado sin correo: faltan RESEND_API_KEY o RESEND_FROM_EMAIL.");
    return false;
  }

  const text = [
    "Hola:",
    "",
    "Base12 Academy te regala el acceso permanente a Tabla Periódica Interactiva.",
    "",
    "Activa tu regalo aquí:",
    input.claimUrl,
    "",
    `El enlace es personal y está reservado para ${input.assignedEmail}.`,
    "Crea una cuenta gratuita o inicia sesión con ese mismo correo para activar la licencia. No es una suscripción.",
    "",
    "Podrás consultar los 118 elementos y sus datos, buscar, comparar tendencias y pedir ayuda a Clara. También podrás instalar la aplicación en la pantalla de inicio de tu móvil.",
    "",
    `Actívalo en un plazo de ${input.validDays} días. Después, el acceso no caduca.`,
    "",
    "Base12 Academy",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `tabla-periodica-regalo-${input.codeHash.slice(0, 32)}`,
    },
    body: JSON.stringify({
      from,
      to: [input.assignedEmail],
      reply_to: ADMIN_EMAIL,
      subject: "Tu Tabla Periódica Interactiva, de regalo",
      text,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#17352d;line-height:1.6">
          <p style="font-size:22px;font-weight:800;color:#0f3f92">Base12 Academy</p>
          <h1 style="font-size:28px;line-height:1.15">Tu Tabla Periódica Interactiva, de regalo</h1>
          <p>Te regalamos el acceso <strong>permanente</strong> a Tabla Periódica Interactiva.</p>
          <p style="margin:28px 0">
            <a href="${escapeHtml(input.claimUrl)}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#d97706;color:#fff;text-decoration:none;font-weight:800">Abrir y activar mi aplicación</a>
          </p>
          <p>Este enlace es personal y está reservado para <strong>${escapeHtml(input.assignedEmail)}</strong>. Crea una cuenta gratuita o inicia sesión con ese mismo correo para activar la licencia. No es una suscripción.</p>
          <p>Tendrás los 118 elementos y sus datos, búsqueda, fichas, tendencias, comparación y el apoyo de Clara. También podrás instalar la aplicación en la pantalla de inicio de tu móvil.</p>
          <p>Actívalo en un plazo de <strong>${input.validDays} días</strong>. Después, el acceso no caduca.</p>
          <p style="margin-top:28px">Base12 Academy</p>
        </div>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend no pudo enviar el regalo de Tabla Periódica", response.status, await response.text());
    return false;
  }
  return true;
}

async function authenticateAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || data.user?.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  return { supabase, user: data.user };
}

export async function GET(req: NextRequest) {
  const auth = await authenticateAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data: campaign, error: campaignError } = await auth.supabase
    .from("periodic_table_gift_campaigns")
    .select("slug,name,max_gifts,active,expires_at")
    .eq("slug", PERIODIC_TABLE_GIFT_CAMPAIGN)
    .maybeSingle();

  if (campaignError || !campaign) {
    return NextResponse.json(
      { error: "La promoción aún no está configurada en Supabase." },
      { status: 503 },
    );
  }

  const now = new Date().toISOString();
  const [{ count: redeemed }, { count: reserved }] = await Promise.all([
    auth.supabase
      .from("periodic_table_gift_invites")
      .select("id", { count: "exact", head: true })
      .eq("campaign_slug", PERIODIC_TABLE_GIFT_CAMPAIGN)
      .not("redeemed_at", "is", null),
    auth.supabase
      .from("periodic_table_gift_invites")
      .select("id", { count: "exact", head: true })
      .eq("campaign_slug", PERIODIC_TABLE_GIFT_CAMPAIGN)
      .is("redeemed_at", null)
      .gt("expires_at", now),
  ]);

  const reservedCount = (redeemed ?? 0) + (reserved ?? 0);
  return NextResponse.json({
    campaign,
    redeemedCount: redeemed ?? 0,
    reservedCount,
    remainingCount: Math.max(campaign.max_gifts - reservedCount, 0),
  });
}
export async function POST(req: NextRequest) {
  const auth = await authenticateAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const assignedEmail = normalizeGiftEmail(body.email);
  if (!isValidGiftEmail(assignedEmail)) {
    return NextResponse.json({ error: "Introduce un correo electrónico válido." }, { status: 400 });
  }

  const validDays = Math.max(1, Math.min(90, Number(body.validDays) || 30));
  const expiresAt = new Date();
  expiresAt.setUTCDate(expiresAt.getUTCDate() + validDays);
  const rawCode = createGiftCode();

  const { data, error } = await auth.supabase.rpc("create_periodic_table_gift_invite", {
    p_campaign_slug: PERIODIC_TABLE_GIFT_CAMPAIGN,
    p_assigned_email: assignedEmail,
    p_code_hash: hashGiftCode(rawCode),
    p_code_hint: rawCode.slice(-6),
    p_expires_at: expiresAt.toISOString(),
    p_created_by: auth.user.id,
  });

  if (error || !data?.[0]) {
    console.error("No se pudo crear la invitación de Tabla Periódica", error);
    const message = giftErrorMessage(error?.message);
    const status = error?.message?.includes("gift_campaign_full") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://base12academy.es").replace(/\/$/, "");
  const claimUrl = `${siteUrl}/apps/tabla-periodica/regalo?codigo=${encodeURIComponent(rawCode)}`;
  const emailSent = await sendGiftEmail({
    assignedEmail,
    claimUrl,
    validDays,
    codeHash: hashGiftCode(rawCode),
  }).catch((emailError) => {
    console.error("Error enviando el regalo de Tabla Periódica", emailError);
    return false;
  });

  return NextResponse.json({
    claimUrl,
    assignedEmail,
    expiresAt: expiresAt.toISOString(),
    emailSent,
    reservedCount: data[0].reserved_count,
    redeemedCount: data[0].redeemed_count,
    remainingCount: data[0].remaining_count,
  });
}
