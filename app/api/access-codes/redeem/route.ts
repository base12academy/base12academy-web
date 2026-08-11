import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  const user = authData.user;
  if (authError || !user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.termsAccepted !== true || body.privacyAcknowledged !== true) {
    return NextResponse.json({ error: "Debes aceptar las condiciones y la privacidad" }, { status: 400 });
  }
  const normalizedCode = String(body.code || "").trim().toUpperCase();
  const codeHash = crypto.createHash("sha256").update(normalizedCode).digest("hex");
  const now = new Date();

  const { data: accessCode, error: codeError } = await supabase
    .from("personal_access_codes")
    .select("*")
    .eq("code_hash", codeHash)
    .is("redeemed_at", null)
    .gte("expires_at", now.toISOString())
    .maybeSingle();

  if (codeError || !accessCode || accessCode.assigned_email.toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json({ error: "La clave no es válida para esta cuenta" }, { status: 400 });
  }

  const orderId = `FREE-${accessCode.id}`;
  const { data: acceptance, error: acceptanceError } = await supabase
    .from("contract_acceptances")
    .insert({
      user_id: user.id,
      order_id: orderId,
      catalog_slug: `${accessCode.course_slug}-${accessCode.plan_slug}`,
      legal_version: "2026-08-11",
      terms_accepted: true,
      privacy_acknowledged: true,
      immediate_access_requested: true,
      withdrawal_acknowledged: false,
      marketing_consent: false,
      contract_snapshot: { accessType: "gratuitous_personal_code", codeHint: accessCode.code_hint },
      user_agent: req.headers.get("user-agent"),
      payment_confirmed_at: now.toISOString(),
    })
    .select("id")
    .single();

  if (acceptanceError || !acceptance) {
    return NextResponse.json({ error: "No se pudo registrar la aceptación" }, { status: 500 });
  }

  const expiresAt = accessCode.access_months ? new Date(now) : null;
  if (expiresAt) expiresAt.setUTCMonth(expiresAt.getUTCMonth() + accessCode.access_months);
  const { error: enrollmentError } = await supabase.from("course_enrollments").upsert({
    user_id: user.id,
    course_slug: accessCode.course_slug,
    plan_slug: accessCode.plan_slug,
    status: "active",
    starts_at: now.toISOString(),
    expires_at: expiresAt?.toISOString() || null,
    payment_order_id: orderId,
    amount_cents: 0,
    consent_id: acceptance.id,
    metadata: { accessType: "gratuitous_personal_code" },
    updated_at: now.toISOString(),
  }, { onConflict: "user_id,course_slug,plan_slug" });

  if (enrollmentError) {
    return NextResponse.json({ error: "No se pudo activar la matrícula" }, { status: 500 });
  }

  const { data: redeemed, error: redeemError } = await supabase
    .from("personal_access_codes")
    .update({ redeemed_by: user.id, redeemed_at: now.toISOString() })
    .eq("id", accessCode.id).is("redeemed_at", null).select("id").single();
  if (redeemError || !redeemed) {
    return NextResponse.json({ error: "La clave ya ha sido utilizada" }, { status: 409 });
  }

  await supabase.from("perfiles").update({ acceso: true }).eq("user_id", user.id);
  return NextResponse.json({ ok: true, courseSlug: accessCode.course_slug, planSlug: accessCode.plan_slug });
}
