import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCalendarAuthUrl } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_COOKIE = "b12_google_calendar_oauth_state";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "OAuth setup is disabled in production." },
      { status: 403 }
    );
  }

  const state = crypto.randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(getCalendarAuthUrl(state));

  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 600,
  });

  return response;
}
