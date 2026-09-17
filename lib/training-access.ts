import { NextRequest, NextResponse } from "next/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getSupabase } from "@/lib/supabase/server";
import {
  getTrainingLicenseExpiry,
  TRAINING_OWNER_EMAIL,
  TRAINING_PRODUCT_SLUG,
} from "@/lib/training-license";

export type TrainingAuthorization = {
  supabase: ReturnType<typeof getSupabase>;
  user: { id: string; email?: string | null };
  access: "administrator" | "owner" | "license";
  expiresAt: string | null;
};

type LicenseCandidate = {
  kind: "purchase" | "gift";
  activatedAt: string;
  expiresAt: Date;
};

export async function authorizeTrainingRequest(request: NextRequest): Promise<TrainingAuthorization | NextResponse> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  const email = data.user.email?.trim().toLowerCase() || "";

  if (isCourseAdministrator(data.user.email)) {
    return { supabase, user: data.user, access: "administrator", expiresAt: null };
  }

  if (email === TRAINING_OWNER_EMAIL) {
    return { supabase, user: data.user, access: "owner", expiresAt: null };
  }

  if (!email) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  const [purchaseResult, giftResult] = await Promise.all([
    supabase
      .from("checkout_orders")
      .select("linked_at,paid_at,immediate_access_requested,withdrawal_acknowledged")
      .eq("linked_user_id", data.user.id)
      .eq("catalog_slug", TRAINING_PRODUCT_SLUG)
      .eq("status", "linked")
      .not("paid_at", "is", null)
      .order("linked_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("training_gift_invites")
      .select("assigned_email,redeemed_at")
      .eq("redeemed_by", data.user.id)
      .eq("assigned_email", email)
      .not("redeemed_at", "is", null)
      .order("redeemed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (purchaseResult.error) {
    console.error("No se pudo comprobar la licencia comprada de Base12 Training", purchaseResult.error);
  }
  if (giftResult.error) {
    console.error("No se pudo comprobar la licencia regalo de Base12 Training", giftResult.error);
  }

  const candidates: LicenseCandidate[] = [];
  const purchase = purchaseResult.data;
  if (purchase?.linked_at || purchase?.paid_at) {
    const activation = new Date(purchase.linked_at || purchase.paid_at);
    const immediate = purchase.immediate_access_requested === true && purchase.withdrawal_acknowledged === true;
    if (!immediate) activation.setUTCDate(activation.getUTCDate() + 14);
    const expiresAt = getTrainingLicenseExpiry(activation);
    if (expiresAt) {
      candidates.push({ kind: "purchase", activatedAt: activation.toISOString(), expiresAt });
    }
  }

  const gift = giftResult.data;
  if (gift?.redeemed_at) {
    const expiresAt = getTrainingLicenseExpiry(gift.redeemed_at);
    if (expiresAt) {
      candidates.push({ kind: "gift", activatedAt: gift.redeemed_at, expiresAt });
    }
  }

  const now = Date.now();
  const active = candidates
    .filter((candidate) => new Date(candidate.activatedAt).getTime() <= now && candidate.expiresAt.getTime() > now)
    .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())[0];

  if (active) {
    return {
      supabase,
      user: data.user,
      access: "license",
      expiresAt: active.expiresAt.toISOString(),
    };
  }

  const latestExpiry = candidates
    .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())[0]?.expiresAt ?? null;

  if (latestExpiry && latestExpiry.getTime() <= now) {
    return NextResponse.json(
      { allowed: false, access: "license_expired", expiresAt: latestExpiry.toISOString() },
      { status: 403 },
    );
  }

  return NextResponse.json({ allowed: false, access: "license_required" }, { status: 403 });
}

export function isTrainingAuthorizationError(value: TrainingAuthorization | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
