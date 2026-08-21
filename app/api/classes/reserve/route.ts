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
  const authorization =
    request.headers.get("authorization");

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
  const desired =
    Date.UTC(year, month - 1, day, hour, minute, 0);

  let timestamp = desired;

  for (let i = 0; i < 3; i += 1) {
    const local =
      getLocalParts(new Date(timestamp));

    const representedAsUtc =
      Date.UTC(
        local.year,
        local.month - 1,
        local.day,
        local.hour,
        local.minute,
        local.second
      );

    const difference =
      desired - representedAsUtc;

    if (difference === 0) {
      break;
    }

    timestamp += difference;
  }

  return new Date(timestamp);
}

function monthIndex(
  year: number,
  month: number
) {
  return year * 12 + month - 1;
}

export async function POST(
  request: NextRequest
) {
  let bookingId: string | null = null;
  let calendarEventId: string | null = null;

  try {
    const accessToken =
      getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json().catch(() => ({}));

    const bonoId =
      typeof body?.bonoId === "string"
        ? body.bonoId.trim()
        : "";

    const date =
      typeof body?.date === "string"
        ? body.date.trim()
        : "";

    const startTime =
      typeof body?.start === "string"
        ? body.start.trim()
        : "";

    const academicLevel =
      typeof body?.academicLevel === "string"
        ? body.academicLevel.trim()
        : "";

    const subject =
      typeof body?.subject === "string"
        ? body.subject.trim()
        : "";

    const topic =
      typeof body?.topic === "string"
        ? body.topic.trim()
        : "";

    const bookPublisher =
      typeof body?.bookPublisher === "string"
        ? body.bookPublisher.trim()
        : "";

    if (!bonoId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No se ha identificado el bono.",
        },
        { status: 400 }
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !/^\d{2}:00$/.test(startTime)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Fecha u hora no v\u00e1lidas.",
        },
        { status: 400 }
      );
    }

    if (
      !academicLevel ||
      !subject ||
      !topic
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Indica el nivel, la asignatura y el tema de la clase.",
        },
        { status: 400 }
      );
    }

    const [year, month, day] =
      date.split("-").map(Number);

    const hour =
      Number(startTime.slice(0, 2));

    const dateCheck =
      new Date(
        Date.UTC(year, month - 1, day)
      );

    if (
      dateCheck.getUTCFullYear() !== year ||
      dateCheck.getUTCMonth() !== month - 1 ||
      dateCheck.getUTCDate() !== day
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Fecha no v\u00e1lida.",
        },
        { status: 400 }
      );
    }

    const weekday =
      dateCheck.getUTCDay();

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
          error:
            "La franja solicitada no es reservable.",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const madridNow =
      getLocalParts(now);

    const currentMonth =
      monthIndex(
        madridNow.year,
        madridNow.month
      );

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
            "Solo se puede reservar el mes actual y los dos siguientes.",
        },
        { status: 400 }
      );
    }

    const slotStart =
      localDateTimeToUtc(
        year,
        month,
        day,
        hour
      );

    const slotEnd =
      localDateTimeToUtc(
        year,
        month,
        day,
        hour + 1
      );

    if (
      slotStart.getTime() -
        now.getTime() <
      MIN_BOOKING_NOTICE_MS
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La reserva debe realizarse con al menos 30 minutos de antelaci\u00f3n.",
        },
        { status: 409 }
      );
    }

    const supabase =
      getSupabase();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser(
        accessToken
      );

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    /*
     * El bono debe pertenecer al usuario.
     */
    const {
      data: bono,
      error: bonoError,
    } =
      await supabase
        .from("class_bonos")
        .select(`
          id,
          user_id,
          class_service,
          status,
          expires_at
        `)
        .eq("id", bonoId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (bonoError) {
      throw bonoError;
    }

    if (!bono) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No se ha encontrado el bono.",
        },
        { status: 404 }
      );
    }

    if (
      bono.status !== "active" ||
      Date.parse(bono.expires_at) <=
        now.getTime()
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El bono no est\u00e1 activo.",
        },
        { status: 409 }
      );
    }

    /*
     * Validamos que la asignatura pertenece
     * al servicio realmente contratado.
     */
    if (
      bono.class_service ===
        "universidad-historia" &&
      subject !== "Historia"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Este bono corresponde a Historia universitaria.",
        },
        { status: 400 }
      );
    }

    if (
      bono.class_service ===
        "eso-bach-historia-filosofia" &&
      subject !== "Historia" &&
      subject !== "Filosof\u00eda"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Selecciona Historia o Filosof\u00eda.",
        },
        { status: 400 }
      );
    }

    /*
     * Comprobaci\u00f3n del calendario real.
     */
    const refreshToken =
      process.env
        .GOOGLE_CALENDAR_REFRESH_TOKEN
        ?.trim();

    if (!refreshToken) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Google Calendar no est\u00e1 configurado.",
        },
        { status: 500 }
      );
    }

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

    const calendarResult =
      await calendar.events.list({
        calendarId:
          getClassesCalendarId(),
        timeMin:
          slotStart.toISOString(),
        timeMax:
          slotEnd.toISOString(),
        singleEvents: true,
        showDeleted: false,
        maxResults: 10,
      });

    if (
      (calendarResult.data.items ?? [])
        .length > 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La hora ya no est\u00e1 disponible.",
        },
        { status: 409 }
      );
    }

    /*
     * Supabase vuelve a comprobar:
     * saldo, caducidad, holds y otras reservas.
     */
    const {
      error: reserveError,
    } =
      await supabase.rpc(
        "reserve_class_from_bono",
        {
          p_bono_id:
            bono.id,

          p_slot_start:
            slotStart.toISOString(),

          p_subject:
            subject,

          p_academic_level:
            academicLevel,

          p_topic:
            topic,
        }
      );

    if (reserveError) {
      const message =
        reserveError.message ?? "";

      if (
        message.includes(
          "SLOT_NOT_AVAILABLE"
        )
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Otra reserva acaba de ocupar esta hora.",
          },
          { status: 409 }
        );
      }

      if (
        message.includes(
          "BONO_EXHAUSTED"
        )
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "No quedan horas disponibles en este bono.",
          },
          { status: 409 }
        );
      }

      throw reserveError;
    }

    /*
     * Localizamos la reserva recién creada
     * sin depender del formato de retorno del RPC.
     */
    const {
      data: booking,
      error: bookingError,
    } =
      await supabase
        .from("class_bookings")
        .select(`
          id,
          slot_start,
          slot_end
        `)
        .eq("bono_id", bono.id)
        .eq("user_id", user.id)
        .eq(
          "slot_start",
          slotStart.toISOString()
        )
        .eq("status", "confirmed")
        .maybeSingle();

    if (
      bookingError ||
      !booking
    ) {
      throw bookingError ??
        new Error(
          "No se pudo recuperar la reserva creada."
        );
    }

    bookingId =
      booking.id;

    /*
     * La editorial es opcional.
     */
    if (bookPublisher) {
      const {
        error: publisherError,
      } =
        await supabase
          .from("class_bookings")
          .update({
            book_publisher:
              bookPublisher,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", booking.id);

      if (publisherError) {
        throw publisherError;
      }
    }

    const {
      data: profile,
    } =
      await supabase
        .from("student_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

    const studentName =
      profile?.full_name?.trim() ||
      user.email ||
      "Alumno Base12";

    /*
     * ID determinista para evitar duplicados
     * si hubiera un reintento.
     */
    calendarEventId =
      `b12${booking.id.replace(
        /-/g,
        ""
      )}`;

    const eventDescription = [
      `Alumno: ${studentName}`,
      `Nivel: ${academicLevel}`,
      `Asignatura: ${subject}`,
      `Tema: ${topic}`,
      bookPublisher
        ? `Editorial: ${bookPublisher}`
        : null,
      "",
      "Clase Online \u00b7 Base12 Academy",
    ]
      .filter(Boolean)
      .join("\n");

    const eventResult =
      await calendar.events.insert({
        calendarId:
          getClassesCalendarId(),

        conferenceDataVersion: 1,

        sendUpdates: "all",

        requestBody: {
          id: calendarEventId,

          summary:
            `Base12 \u00b7 ${studentName} \u00b7 ${subject}`,

          description:
            eventDescription,

          start: {
            dateTime:
              slotStart.toISOString(),
            timeZone:
              TIME_ZONE,
          },

          end: {
            dateTime:
              slotEnd.toISOString(),
            timeZone:
              TIME_ZONE,
          },

          attendees:
            user.email
              ? [
                  {
                    email:
                      user.email,
                  },
                ]
              : undefined,

          conferenceData: {
            createRequest: {
              requestId:
                `meet-${booking.id}`,

              conferenceSolutionKey: {
                type:
                  "hangoutsMeet",
              },
            },
          },
        },
      });

    const meetUrl =
      eventResult.data
        .conferenceData
        ?.entryPoints
        ?.find(
          (entry) =>
            entry.entryPointType ===
            "video"
        )
        ?.uri ??
      eventResult.data.hangoutLink ??
      null;

    const {
      error: calendarLinkError,
    } =
      await supabase
        .from("class_bookings")
        .update({
          google_event_id:
            eventResult.data.id ??
            calendarEventId,

          meet_url:
            meetUrl,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", booking.id);

    if (calendarLinkError) {
      throw calendarLinkError;
    }

    return NextResponse.json(
      {
        ok: true,
        bookingId:
          booking.id,
        slotStart:
          booking.slot_start,
        slotEnd:
          booking.slot_end,
        meetUrl,
      },
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Class bono reservation error",
      error
    );

    /*
     * Si Supabase creó la reserva pero Google Calendar
     * falló, intentamos retirar cualquier evento parcial
     * y devolvemos la hora al bono.
     */
    if (bookingId) {
      try {
        const refreshToken =
          process.env
            .GOOGLE_CALENDAR_REFRESH_TOKEN
            ?.trim();

        if (
          refreshToken &&
          calendarEventId
        ) {
          const oauthClient =
            getCalendarOAuthClient();

          oauthClient.setCredentials({
            refresh_token:
              refreshToken,
          });

          const calendar =
            google.calendar({
              version: "v3",
              auth: oauthClient,
            });

          await calendar.events
            .delete({
              calendarId:
                getClassesCalendarId(),
              eventId:
                calendarEventId,
              sendUpdates: "all",
            })
            .catch(() => undefined);
        }

        const supabase =
          getSupabase();

        await supabase
          .from("class_bookings")
          .update({
            status:
              "cancelled_by_base12",
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", bookingId);
      } catch (cleanupError) {
        console.error(
          "Class reservation cleanup error",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo confirmar la clase.",
      },
      { status: 500 }
    );
  }
}
