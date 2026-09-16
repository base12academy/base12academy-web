import { NextRequest, NextResponse } from "next/server";
import { refreshUpcomingClassReminders } from "@/lib/class-reminders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();

  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const results = await refreshUpcomingClassReminders();

    return NextResponse.json(
      {
        ok: true,
        checked: results.length,
        results,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Class reminders cron error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudieron preparar los recordatorios.",
      },
      { status: 500 }
    );
  }
}
