import { refreshClassReminders } from "@/lib/class-reminders";
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

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7);
}

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
  const desired = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    0
  );

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

    if (difference === 0) {
      break;
    }

    timestamp += difference;
  }

  return new Date(timestamp);
}

function monthIndex(year: number, month: number) {
  return year * 12 + month - 1;
}

function errorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(
      (error as { message?: unknown }).message ?? ""
    );
  }

  return "";
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  let bookingId = "";
  let originalStart = "";
  let originalEnd = "";
  let targetStart = "";
  let targetEnd = "";
  let existingEventId: string | null = null;
  let createdEventId: string | null = null;
  let dbMoved = false;
  let userId = "";

  try {
    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));

    bookingId =
      typeof body?.bookingId === "string"
        ? body.bookingId.trim()
        : "";

    const date =
      typeof body?.date === "string"
        ? body.date.trim()
        : "";

    const startTime =
      typeof body?.start === "string"
        ? body.start.trim()
        : "";

    if (
      !bookingId ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !/^\d{2}:00$/.test(startTime)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Reserva, fecha u hora no válidas.",
        },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    userId = user.id;

    const {
      data: booking,
      error: bookingError,
    } = await supabase
      .from("class_bookings")
      .select(`
        id,
        user_id,
        slot_start,
        slot_end,
        status,
        subject,
        academic_level,
        topic,
        book_publisher,
        google_event_id,
        meet_url
      `)
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (bookingError) {
      throw bookingError;
    }

    if (!booking) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se ha encontrado la clase.",
        },
        { status: 404 }
      );
    }

    if (booking.status !== "confirmed") {
      return NextResponse.json(
        {
          ok: false,
          error: "Esta clase no se puede reprogramar.",
        },
        { status: 409 }
      );
    }

    const now = new Date();

    originalStart = booking.slot_start;
    originalEnd = booking.slot_end;
    existingEventId = booking.google_event_id;

    if (
      Date.parse(originalStart) - now.getTime() <
      MIN_BOOKING_NOTICE_MS
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El plazo para cambiar esta clase ha terminado. Solo puede reprogramarse hasta 30 minutos antes.",
        },
        { status: 409 }
      );
    }

    const [year, month, day] =
      date.split("-").map(Number);

    const hour = Number(startTime.slice(0, 2));

    const dateCheck =
      new Date(Date.UTC(year, month - 1, day));

    if (
      dateCheck.getUTCFullYear() !== year ||
      dateCheck.getUTCMonth() !== month - 1 ||
      dateCheck.getUTCDate() !== day
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Fecha no válida.",
        },
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
        {
          ok: false,
          error: "La franja solicitada no es reprogramable.",
        },
        { status: 400 }
      );
    }

    const madridNow = getLocalParts(now);

    const currentMonth =
      monthIndex(madridNow.year, madridNow.month);

    const requestedMonth =
      monthIndex(year, month);

    if (
      requestedMonth < currentMonth ||
      requestedMonth > currentMonth + 2
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Solo se puede elegir el mes actual y los dos siguientes.",
        },
        { status: 400 }
      );
    }

    const slotStart =
      localDateTimeToUtc(year, month, day, hour);

    const slotEnd =
      localDateTimeToUtc(year, month, day, hour + 1);

    targetStart = slotStart.toISOString();
    targetEnd = slotEnd.toISOString();

    if (
      slotStart.getTime() - now.getTime() <
      MIN_BOOKING_NOTICE_MS
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La nueva hora debe comenzar al menos 30 minutos después del momento actual.",
        },
        { status: 409 }
      );
    }

    if (targetStart === originalStart) {
      return NextResponse.json(
        {
          ok: true,
          unchanged: true,
          bookingId: booking.id,
          slotStart: originalStart,
          slotEnd: originalEnd,
          meetUrl: booking.meet_url,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
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

    const oauthClient = getCalendarOAuthClient();

    oauthClient.setCredentials({
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauthClient,
    });

    const calendarResult =
      await calendar.events.list({
        calendarId: getClassesCalendarId(),
        timeMin: targetStart,
        timeMax: targetEnd,
        singleEvents: true,
        showDeleted: false,
        maxResults: 20,
      });

    const blockingEvents =
      (calendarResult.data.items ?? []).filter(
        (item) =>
          !existingEventId ||
          item.id !== existingEventId
      );

    if (blockingEvents.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "La nueva hora ya no está disponible.",
        },
        { status: 409 }
      );
    }

    const {
      error: moveError,
    } = await supabase.rpc(
      "reprogram_class_booking",
      {
        p_booking_id: booking.id,
        p_user_id: user.id,
        p_new_slot_start: targetStart,
      }
    );

    if (moveError) {
      const message = errorMessage(moveError);

      if (message.includes("SLOT_NOT_AVAILABLE")) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Otra reserva acaba de ocupar esa hora. Elige otra franja.",
          },
          { status: 409 }
        );
      }

      if (
        message.includes("REPROGRAM_WINDOW_CLOSED") ||
        message.includes("NEW_SLOT_TOO_CLOSE")
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "La clase ya no puede reprogramarse con menos de 30 minutos de antelación.",
          },
          { status: 409 }
        );
      }

      throw moveError;
    }

    dbMoved = true;

    const secondCalendarResult =
      await calendar.events.list({
        calendarId: getClassesCalendarId(),
        timeMin: targetStart,
        timeMax: targetEnd,
        singleEvents: true,
        showDeleted: false,
        maxResults: 20,
      });

    const secondBlockingEvents =
      (secondCalendarResult.data.items ?? []).filter(
        (item) =>
          !existingEventId ||
          item.id !== existingEventId
      );

    if (secondBlockingEvents.length > 0) {
      throw new Error(
        "TARGET_SLOT_BLOCKED_AFTER_DATABASE_MOVE"
      );
    }

    let eventId = existingEventId;
    let meetUrl = booking.meet_url ?? null;

    if (eventId) {
      const patched =
        await calendar.events.patch({
          calendarId: getClassesCalendarId(),
          eventId,
          sendUpdates: "all",
          requestBody: {
            start: {
              dateTime: targetStart,
              timeZone: TIME_ZONE,
            },
            end: {
              dateTime: targetEnd,
              timeZone: TIME_ZONE,
            },
          },
        });

      meetUrl =
        patched.data.conferenceData
          ?.entryPoints
          ?.find(
            (entry) =>
              entry.entryPointType === "video"
          )
          ?.uri ??
        patched.data.hangoutLink ??
        meetUrl;
    } else {
      const {
        data: profile,
      } = await supabase
        .from("student_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      const studentName =
        profile?.full_name?.trim() ||
        user.email ||
        "Alumno Base12";

      const deterministicId =
        `b12${booking.id.replace(/-/g, "")}`;

      eventId = deterministicId;

      const description = [
        `Alumno: ${studentName}`,
        `Nivel: ${booking.academic_level ?? ""}`,
        `Asignatura: ${booking.subject ?? ""}`,
        `Tema: ${booking.topic ?? ""}`,
        booking.book_publisher
          ? `Editorial: ${booking.book_publisher}`
          : null,
        "",
        "Clase Online · Base12 Academy",
      ]
        .filter(Boolean)
        .join("\n");

      try {
        const inserted =
          await calendar.events.insert({
            calendarId: getClassesCalendarId(),
            conferenceDataVersion: 1,
            sendUpdates: "all",
            requestBody: {
              id: deterministicId,
              summary:
                `Base12 · ${studentName} · ${booking.subject ?? "Clase"}`,
              description,
              start: {
                dateTime: targetStart,
                timeZone: TIME_ZONE,
              },
              end: {
                dateTime: targetEnd,
                timeZone: TIME_ZONE,
              },
              attendees: user.email
                ? [{ email: user.email }]
                : undefined,
              conferenceData: {
                createRequest: {
                  requestId: `meet-${booking.id}`,
                  conferenceSolutionKey: {
                    type: "hangoutsMeet",
                  },
                },
              },
            },
          });

        createdEventId =
          inserted.data.id ?? deterministicId;

        eventId = createdEventId;

        meetUrl =
          inserted.data.conferenceData
            ?.entryPoints
            ?.find(
              (entry) =>
                entry.entryPointType === "video"
            )
            ?.uri ??
          inserted.data.hangoutLink ??
          null;
      } catch (insertError) {
        const code =
          typeof insertError === "object" &&
          insertError !== null &&
          "code" in insertError
            ? Number(
                (insertError as { code?: unknown }).code
              )
            : null;

        if (code !== 409) {
          throw insertError;
        }

        const patched =
          await calendar.events.patch({
            calendarId: getClassesCalendarId(),
            eventId: deterministicId,
            conferenceDataVersion: 1,
            sendUpdates: "all",
            requestBody: {
              start: {
                dateTime: targetStart,
                timeZone: TIME_ZONE,
              },
              end: {
                dateTime: targetEnd,
                timeZone: TIME_ZONE,
              },
            },
          });

        eventId = deterministicId;
        existingEventId = deterministicId;

        meetUrl =
          patched.data.conferenceData
            ?.entryPoints
            ?.find(
              (entry) =>
                entry.entryPointType === "video"
            )
            ?.uri ??
          patched.data.hangoutLink ??
          meetUrl;
      }

    }

    /*
     * Guardamos siempre el vínculo real con Calendar/Meet,
     * tanto si el evento ya existía como si hubo que crearlo.
     */
    const {
      error: linkError,
    } = await supabase
      .from("class_bookings")
      .update({
        google_event_id: eventId,
        meet_url: meetUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id);

    if (linkError) {
      throw linkError;
    }

    await refreshClassReminders(
      booking.id
    ).catch((reminderError) => {
      console.error(
        "Clase reprogramada, pero no se pudieron actualizar sus recordatorios",
        reminderError
      );
    });

    return NextResponse.json(
      {
        ok: true,
        bookingId: booking.id,
        slotStart: targetStart,
        slotEnd: targetEnd,
        meetUrl,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Class reprogram error",
      error
    );

    if (
      dbMoved &&
      bookingId &&
      userId &&
      originalStart
    ) {
      try {
        await supabase.rpc(
          "reprogram_class_booking",
          {
            p_booking_id: bookingId,
            p_user_id: userId,
            p_new_slot_start: originalStart,
          }
        );
      } catch (rollbackError) {
        console.error(
          "No se pudo restaurar la hora original en Supabase",
          rollbackError
        );
      }

      try {
        const refreshToken =
          process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

        if (refreshToken) {
          const oauthClient =
            getCalendarOAuthClient();

          oauthClient.setCredentials({
            refresh_token: refreshToken,
          });

          const calendar =
            google.calendar({
              version: "v3",
              auth: oauthClient,
            });

          if (createdEventId) {
            await calendar.events
              .delete({
                calendarId: getClassesCalendarId(),
                eventId: createdEventId,
                sendUpdates: "all",
              })
              .catch(() => undefined);
          } else if (existingEventId) {
            await calendar.events
              .patch({
                calendarId: getClassesCalendarId(),
                eventId: existingEventId,
                sendUpdates: "all",
                requestBody: {
                  start: {
                    dateTime: originalStart,
                    timeZone: TIME_ZONE,
                  },
                  end: {
                    dateTime: originalEnd,
                    timeZone: TIME_ZONE,
                  },
                },
              })
              .catch(() => undefined);
          }
        }
      } catch (calendarRollbackError) {
        console.error(
          "No se pudo restaurar el evento original de Google Calendar",
          calendarRollbackError
        );
      }
    }

    const message =
      error instanceof Error
        ? error.message
        : "";

    if (
      message.includes(
        "TARGET_SLOT_BLOCKED_AFTER_DATABASE_MOVE"
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La nueva hora acaba de quedar ocupada. Se ha conservado la hora original.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo reprogramar la clase. Se ha intentado conservar la hora original.",
      },
      { status: 500 }
    );
  }
}
