import type { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { C11000_EXAM_PROFILE, OPO12_TIME_ZONE } from "./config";

export type Opo12AuthorizedRequest = {
  supabase: ReturnType<typeof getSupabase>;
  user: User;
};

export async function authorizeOpo12Request(
  request: NextRequest,
): Promise<Opo12AuthorizedRequest | NextResponse> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "login_required" }, { status: 401 });
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: "login_required" }, { status: 401 });
  }
  return { supabase, user: data.user };
}

export function isOpo12AuthorizationError(
  value: Opo12AuthorizedRequest | NextResponse,
): value is NextResponse {
  return value instanceof NextResponse;
}

export function madridDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: OPO12_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function secondsUntilMadridMidnight(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: OPO12_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const elapsed = Number(value.hour) * 3600 + Number(value.minute) * 60 + Number(value.second);
  return 24 * 3600 - elapsed;
}

export const opo12PublicProfile = {
  ...C11000_EXAM_PROFILE,
  blocks: C11000_EXAM_PROFILE.blocks.map((block) => ({ ...block })),
};
