import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import {
  hashTrainingGiftCode,
  normalizeTrainingGiftCode,
  TRAINING_GIFT_CAMPAIGN,
} from "@/lib/training-gift";

export async function GET(req: NextRequest) {
  const code = normalizeTrainingGiftCode(req.nextUrl.searchParams.get("codigo"));
  if (!code) return NextResponse.json({ valid: false }, { status: 400 });

  const supabase = getSupabase();
  const { data: invite } = await supabase
    .from("training_gift_invites")
    .select("expires_at,redeemed_at")
    .eq("campaign_slug", TRAINING_GIFT_CAMPAIGN)
    .eq("code_hash", hashTrainingGiftCode(code))
    .maybeSingle();

  if (!invite) return NextResponse.json({ valid: false });

  const expired = new Date(invite.expires_at).getTime() <= Date.now();
  return NextResponse.json({
    valid: !expired,
    expired,
    redeemed: Boolean(invite.redeemed_at),
    expiresAt: invite.expires_at,
  });
}
