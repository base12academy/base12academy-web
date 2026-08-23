import { requestClientIp, verifyTurnstileToken } from "@/lib/turnstile";
﻿import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import {
  getCalendarOAuthClient,
  getClassesCalendarId,
} from "@/lib/google-calendar";
import { getSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIME_ZONE = "Europe/Madrid";
const MIN_BOOKING_NOTICE_MS = 30 * 60 * 1000;

const MONDAY_THURSDAY_HOURS = [15, 16, 17, 18, 19, 20];
const FRIDAY_HOURS = [15, 16, 17, 18];

type LocalParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function getLocalParts(date: Date): LocalParts {
  const values: Record<string, string> = {};

  for (const part of partsFormatter.formatToParts(date)) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function localDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0
) {
  const desired = Date.UTC(year, month - 1, day, hour, minute, 0);
  let timestamp = desired;

  for (let i = 0; i < 3; i += 1) {
    const local = getLocalParts(new Date(timestamp));

    const representedAsUtc = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second
    );

    const difference = desired - representedAsUtc;

    if (difference === 0) break;

    timestamp += difference;
  }

  return new Date(timestamp);
}

function monthIndex(year: number, month: number) {
  return year * 12 + month - 1;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const turnstileToken =
      typeof body.turnstileToken === "string"
        ? body.turnstileToken.trim()
        : "";

    const turnstileOk = await verifyTurnstileToken({
      token: turnstileToken,
      remoteIp: requestClientIp(request),
    });

    if (!turnstileOk) {
      return NextResponse.json(
        {
          ok: false,
          error: "Completa la verificación anti-bots antes de reservar la hora.",
          code: "TURNSTILE_REQUIRED",
        },
        { status: 403 }
      );
    }

    const date =
      typeof body.date === "string" ? body.date.trim() : "";

    const startTime =
      typeof body.start === "string" ? body.start.trim() : "";

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !/^\d{2}:00$/.test(startTime)
    ) {
      return NextResponse.json(
        { ok: false, error: "Fecha u hora no válidas." },
        { status: 400 }
      );
    }

    const [year, month, day] = date.split("-").map(Number);
    const hour = Number(startTime.slice(0, 2));

    const dateCheck = new Date(Date.UTC(year, month - 1, day));

    if (
      dateCheck.getUTCFullYear() !== year ||
      dateCheck.getUTCMonth() !== month - 1 ||
      dateCheck.getUTCDate() !== day
    ) {
      return NextResponse.json(
        { ok: false, error: "Fecha no válida." },
        { status: 400 }
      );
    }

    const weekday = dateCheck.getUTCDay();

    const validHours =
      weekday >= 1 && weekday <= 4
        ? MONDAY_THURSDAY_HOURS
        : weekday === 5
          ? FRIDAY_HOURS
          : [];

    if (!validHours.includes(hour)) {
      return NextResponse.json(
        { ok: false, error: "La franja solicitada no es reservable." },
        { status: 400 }
      );
    }

    const now = new Date();
    const madridNow = getLocalParts(now);

    const currentMonth = monthIndex(madridNow.year, madridNow.month);
    const requestedMonth = monthIndex(year, month);

    if (
      requestedMonth < currentMonth ||
      requestedMonth > currentMonth + 2
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Solo se puede reservar el mes actual y los dos siguientes.",
        },
        { status: 400 }
      );
    }

    const slotStart = localDateTimeToUtc(
      year,
      month,
      day,
      hour
    );

    const slotEnd = localDateTimeToUtc(
      year,
      month,
      day,
      hour + 1
    );

    if (
      slotStart.getTime() - now.getTime() <
      MIN_BOOKING_NOTICE_MS
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La reserva debe realizarse con al menos 30 minutos de antelación.",
        },
        { status: 409 }
      );
    }

    const refreshToken =
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

    if (!refreshToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "Google Calendar no está configurado.",
        },
        { status: 500 }
      );
    }

    /*
     * Primero comprobamos el calendario real.
     * Una reserva provisional nunca puede imponerse sobre
     * una clase o un bloqueo introducido por Base12.
     */
    const oauthClient = getCalendarOAuthClient();

    oauthClient.setCredentials({
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauthClient,
    });

    const calendarResult = await calendar.events.list({
      calendarId: getClassesCalendarId(),
      timeMin: slotStart.toISOString(),
      timeMax: slotEnd.toISOString(),
      singleEvents: true,
      showDeleted: false,
      maxResults: 10,
    });

    const calendarBlocked =
      (calendarResult.data.items ?? []).length > 0;

    if (calendarBlocked) {
      return NextResponse.json(
        {
          ok: false,
          error: "La hora ya no está disponible.",
        },
        { status: 409 }
      );
    }

    /*
     * Generamos un token que solo recibe el navegador.
     * Supabase almacena exclusivamente su hash.
     */
    const holdToken = crypto.randomBytes(32).toString("base64url");

    const holdTokenHash = crypto
      .createHash("sha256")
      .update(holdToken)
      .digest("hex");

    const supabase = getSupabase();

    const { data, error } = await supabase.rpc(
      "acquire_class_booking_hold",
      {
        p_slot_start: slotStart.toISOString(),
        p_hold_token_hash: holdTokenHash,
      }
    );

    if (error) {
      const conflict =
        error.message?.includes("SLOT_NOT_AVAILABLE") ||
        error.details?.includes("SLOT_NOT_AVAILABLE");

      if (conflict) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Otra persona acaba de retener esta hora. Elige otra franja.",
          },
          { status: 409 }
        );
      }

      throw error;
    }

    const hold = Array.isArray(data) ? data[0] : data;

    if (!hold) {
      throw new Error("Supabase no devolvió la reserva provisional.");
    }

    return NextResponse.json(
      {
        ok: true,
        holdId: hold.id,
        holdToken,
        date,
        start: startTime,
        expiresAt: hold.expires_at,
        expiresInMinutes: 60,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Class booking hold error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo crear la reserva provisional.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const holdId =
      typeof body.holdId === "string" ? body.holdId.trim() : "";

    const holdToken =
      typeof body.holdToken === "string" ? body.holdToken.trim() : "";

    if (!holdId || !holdToken) {
      return NextResponse.json(
        { ok: false, error: "Reserva provisional no v?lida." },
        { status: 400 }
      );
    }

    const holdTokenHash = crypto
      .createHash("sha256")
      .update(holdToken)
      .digest("hex");

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("class_booking_holds")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", holdId)
      .eq("hold_token_hash", holdTokenHash)
      .eq("status", "held")
      .select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La reserva provisional ya no existe o ha dejado de estar activa.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Class booking hold release error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo liberar la reserva provisional.",
      },
      { status: 500 }
    );
  }
}
