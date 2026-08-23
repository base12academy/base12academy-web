import { NextResponse } from "next/server";
import { google, calendar_v3 } from "googleapis";
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

  // Ajuste iterativo para respetar CET/CEST y los cambios de hora.
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

function addMonths(year: number, month: number, amount: number) {
  const index = year * 12 + (month - 1) + amount;

  return {
    year: Math.floor(index / 12),
    month: (index % 12) + 1,
  };
}

function isoDate(year: number, month: number, day: number) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function eventRange(event: calendar_v3.Schema$Event) {
  if (event.status === "cancelled") return null;

  if (event.start?.dateTime && event.end?.dateTime) {
    return {
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    };
  }

  if (event.start?.date && event.end?.date) {
    const [sy, sm, sd] = event.start.date.split("-").map(Number);
    const [ey, em, ed] = event.end.date.split("-").map(Number);

    return {
      start: localDateTimeToUtc(sy, sm, sd, 0),
      end: localDateTimeToUtc(ey, em, ed, 0),
    };
  }

  return null;
}

export async function GET() {
  try {
    if (process.env.VERCEL_ENV === "preview") {
      const { createHash } = await import("crypto");
      const names = [
        "GOOGLE_CALENDAR_CLIENT_ID",
        "GOOGLE_CALENDAR_CLIENT_SECRET",
        "GOOGLE_CALENDAR_REFRESH_TOKEN",
        "GOOGLE_CLASSES_CALENDAR_ID",
        "GOOGLE_CALENDAR_REDIRECT_URI",
      ];

      console.log(
        "GOOGLE_ENV_FINGERPRINTS",
        Object.fromEntries(
          names.map((name) => {
            const value = process.env[name] ?? "";
            return [
              name,
              {
                length: value.length,
                sha: createHash("sha256")
                  .update(value)
                  .digest("hex")
                  .slice(0, 10),
              },
            ];
          })
        )
      );
    }
    const refreshToken =
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

    if (!refreshToken) {
      return NextResponse.json(
        { ok: false, error: "Google Calendar no está configurado." },
        { status: 500 }
      );
    }

    const oauthClient = getCalendarOAuthClient();

    oauthClient.setCredentials({
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauthClient,
    });

    const now = new Date();
    const madridNow = getLocalParts(now);

    const rangeStart = localDateTimeToUtc(
      madridNow.year,
      madridNow.month,
      1,
      0
    );

    const endMonth = addMonths(
      madridNow.year,
      madridNow.month,
      3
    );

    const rangeEnd = localDateTimeToUtc(
      endMonth.year,
      endMonth.month,
      1,
      0
    );

    const events: calendar_v3.Schema$Event[] = [];
    let pageToken: string | undefined;

    do {
      const result = await calendar.events.list({
        calendarId: getClassesCalendarId(),
        timeMin: rangeStart.toISOString(),
        timeMax: rangeEnd.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        showDeleted: false,
        maxResults: 2500,
        pageToken,
      });

      events.push(...(result.data.items ?? []));
      pageToken = result.data.nextPageToken ?? undefined;
    } while (pageToken);

    const busyRanges = events
      .map(eventRange)
      .filter(
        (
          range
        ): range is {
          start: Date;
          end: Date;
        } => Boolean(range)
      );

    const supabase = getSupabase();

    const { data: activeHolds, error: holdsError } = await supabase
      .from("class_booking_holds")
      .select("slot_start, slot_end, status, expires_at")
      .in("status", ["held", "paid"])
      .lt("slot_start", rangeEnd.toISOString())
      .gt("slot_end", rangeStart.toISOString());

    if (holdsError) {
      throw holdsError;
    }

    const heldRanges = (activeHolds ?? [])
      .filter(
        (hold) =>
          hold.status === "paid" ||
          (
            hold.status === "held" &&
            Date.parse(hold.expires_at) > now.getTime()
          )
      )
      .map((hold) => ({
        start: new Date(hold.slot_start),
        end: new Date(hold.slot_end),
      }));

    const {
      data: confirmedBookings,
      error: bookingsError,
    } = await supabase
      .from("class_bookings")
      .select("slot_start, slot_end")
      .eq("status", "confirmed")
      .lt("slot_start", rangeEnd.toISOString())
      .gt("slot_end", rangeStart.toISOString());

    if (bookingsError) {
      throw bookingsError;
    }

    const bookingRanges = (confirmedBookings ?? []).map(
      (booking) => ({
        start: new Date(booking.slot_start),
        end: new Date(booking.slot_end),
      })
    );

    const blockedRanges = [
      ...busyRanges,
      ...heldRanges,
      ...bookingRanges,
    ];

    const monthFormatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: TIME_ZONE,
      month: "long",
      year: "numeric",
    });

    const weekdayNames = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    const months = [];

    for (let offset = 0; offset < 3; offset += 1) {
      const current = addMonths(
        madridNow.year,
        madridNow.month,
        offset
      );

      const daysInMonth = new Date(
        Date.UTC(current.year, current.month, 0)
      ).getUTCDate();

      const days = [];

      for (let day = 1; day <= daysInMonth; day += 1) {
        const weekday = new Date(
          Date.UTC(current.year, current.month - 1, day)
        ).getUTCDay();

        const isMondayToThursday =
          weekday >= 1 && weekday <= 4;

        const isFriday = weekday === 5;

        const hours = isMondayToThursday
          ? MONDAY_THURSDAY_HOURS
          : isFriday
            ? FRIDAY_HOURS
            : [];

        const slots = hours.map((hour) => {
          const start = localDateTimeToUtc(
            current.year,
            current.month,
            day,
            hour
          );

          const end = localDateTimeToUtc(
            current.year,
            current.month,
            day,
            hour + 1
          );

          const enoughNotice =
            start.getTime() - now.getTime() >=
            MIN_BOOKING_NOTICE_MS;

          const busy = blockedRanges.some(
            (range) =>
              range.start.getTime() < end.getTime() &&
              range.end.getTime() > start.getTime()
          );

          return {
            start: `${String(hour).padStart(2, "0")}:00`,
            end: `${String(hour + 1).padStart(2, "0")}:00`,
            status:
              enoughNotice && !busy
                ? "available"
                : "unavailable",
          };
        });

        days.push({
          date: isoDate(
            current.year,
            current.month,
            day
          ),
          weekday: weekdayNames[weekday],
          open: hours.length > 0,
          slots,
        });
      }

      const monthDate = localDateTimeToUtc(
        current.year,
        current.month,
        1,
        12
      );

      months.push({
        key: `${current.year}-${String(current.month).padStart(
          2,
          "0"
        )}`,
        label: monthFormatter.format(monthDate),
        days,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        timezone: TIME_ZONE,
        minimumBookingNoticeMinutes: 30,
        months,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Classes availability error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo consultar la disponibilidad.",
      },
      { status: 500 }
    );
  }
}
