import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import {
  hashGiftCode,
  normalizeGiftCode,
  PERIODIC_TABLE_GIFT_CAMPAIGN,
} from "@/lib/chemistry/periodic-table-gift";

export async function GET(req: NextRequest) {
  const code = normalizeGiftCode(req.nextUrl.searchParams.get("codigo"));
  if (!code) return NextResponse.json({ valid: false }, { status: 400 });

  const supabase = getSupabase();
  const { data: invite } = await supabase
    .from("periodic_table_gift_invites")
    .select("expires_at,redeemed_at")
    .eq("campaign_slug", PERIODIC_TABLE_GIFT_CAMPAIGN)
    .eq("code_hash", hashGiftCode(code))
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
