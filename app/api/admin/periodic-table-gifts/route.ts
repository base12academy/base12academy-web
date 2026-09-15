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

  return NextResponse.json({
    claimUrl,
    assignedEmail,
    expiresAt: expiresAt.toISOString(),
    reservedCount: data[0].reserved_count,
    redeemedCount: data[0].redeemed_count,
    remainingCount: data[0].remaining_count,
  });
}
