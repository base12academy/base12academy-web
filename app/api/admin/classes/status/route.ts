import { cancelClassReminders } from "@/lib/class-reminders";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { isCourseAdministrator } from "@/lib/course-access";
import {
  getCalendarOAuthClient,
  getClassesCalendarId,
} from "@/lib/google-calendar";
import { getSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set([
  "completed",
  "no_show",
  "cancelled_by_base12",
]);

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7);
}

async function adminContext(request: NextRequest) {
  const token = bearerToken(request);
  if (!token) return null;

  const supabase = getSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user || !isCourseAdministrator(user.email)) {
    return null;
  }

  return { supabase, user };
}

function rpcMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message ?? "");
  }
  return "";
}

async function deleteCalendarEvent(eventId: string) {
  const refreshToken =
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

  if (!refreshToken) {
    throw new Error("GOOGLE_CALENDAR_REFRESH_TOKEN_MISSING");
  }

  const oauthClient = getCalendarOAuthClient();
  oauthClient.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({
    version: "v3",
    auth: oauthClient,
  });

  try {
    await calendar.events.delete({
      calendarId: getClassesCalendarId(),
      eventId,
      sendUpdates: "all",
    });
  } catch (error) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? Number((error as { code?: unknown }).code)
        : null;

    if (code !== 404) throw error;
  }
}

export async function GET(request: NextRequest) {
  const ctx = await adminContext(request);

  if (!ctx) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const { supabase } = ctx;

  const { data: bookings, error } = await supabase
    .from("class_bookings")
    .select(`
      id,
      bono_id,
      user_id,
      slot_start,
      slot_end,
      status,
      subject,
      academic_level,
      topic,
      book_publisher,
      google_event_id,
      meet_url,
      confirmed_at,
      completed_at,
      cancelled_at,
      created_at,
      updated_at
    `)
    .order("slot_start", { ascending: false })
    .limit(250);

  if (error) {
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar las clases." },
      { status: 500 }
    );
  }

  const userIds = [
    ...new Set((bookings ?? []).map((b) => b.user_id).filter(Boolean)),
  ];

  let profiles: Array<{
    user_id: string;
    full_name: string | null;
    contact_email: string | null;
    phone: string | null;
  }> = [];

  if (userIds.length > 0) {
    const { data } = await supabase
      .from("student_profiles")
      .select("user_id,full_name,contact_email,phone")
      .in("user_id", userIds);

    profiles = data ?? [];
  }

  const profileMap = new Map(
    profiles.map((profile) => [profile.user_id, profile])
  );

  return NextResponse.json(
    {
      ok: true,
      bookings: (bookings ?? []).map((booking) => ({
        ...booking,
        student: profileMap.get(booking.user_id) ?? null,
      })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PATCH(request: NextRequest) {
  const ctx = await adminContext(request);

  if (!ctx) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const { supabase } = ctx;
  const body = await request.json().catch(() => ({}));

  const bookingId =
    typeof body?.bookingId === "string" ? body.bookingId.trim() : "";
  const status =
    typeof body?.status === "string" ? body.status.trim() : "";

  if (!bookingId || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      { ok: false, error: "Reserva o estado no válidos." },
      { status: 400 }
    );
  }

  const { data: current, error: currentError } = await supabase
    .from("class_bookings")
    .select("id,status,slot_start,slot_end,google_event_id")
    .eq("id", bookingId)
    .maybeSingle();

  if (currentError) throw currentError;

  if (!current) {
    return NextResponse.json(
      { ok: false, error: "No se ha encontrado la clase." },
      { status: 404 }
    );
  }

  const { data: updated, error: statusError } = await supabase.rpc(
    "set_class_booking_status",
    {
      p_booking_id: bookingId,
      p_status: status,
    }
  );

  if (statusError) {
    const message = rpcMessage(statusError);

    if (message.includes("CLASS_NOT_FINISHED")) {
      return NextResponse.json(
        { ok: false, error: "La clase todavía no ha terminado." },
        { status: 409 }
      );
    }

    if (message.includes("CLASS_NOT_STARTED")) {
      return NextResponse.json(
        { ok: false, error: "La clase todavía no ha comenzado." },
        { status: 409 }
      );
    }

    if (message.includes("BOOKING_ALREADY_CLOSED")) {
      return NextResponse.json(
        { ok: false, error: "La clase ya tiene un estado definitivo." },
        { status: 409 }
      );
    }

    throw statusError;
  }

  if (
    status === "cancelled_by_base12" &&
    current.google_event_id
  ) {
    try {
      await deleteCalendarEvent(current.google_event_id);
    } catch (calendarError) {
      console.error(
        "No se pudo cancelar el evento de Google Calendar",
        calendarError
      );

      const { error: restoreError } = await supabase
        .from("class_bookings")
        .update({
          status: "confirmed",
          cancelled_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .eq("status", "cancelled_by_base12");

      if (restoreError) {
        console.error(
          "No se pudo restaurar la clase tras fallo de Calendar",
          restoreError
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error:
            "Google Calendar no pudo cancelar la clase. Se ha conservado como confirmada.",
        },
        { status: 502 }
      );
    }
  }

  if (status === "cancelled_by_base12") {
    await cancelClassReminders(
      bookingId
    ).catch((reminderError) => {
      console.error(
        "Clase cancelada, pero no se pudieron cancelar todos sus recordatorios",
        reminderError
      );
    });
  }

  return NextResponse.json(
    {
      ok: true,
      booking: updated,
      balanceRule:
        status === "cancelled_by_base12"
          ? "refunded"
          : "consumed",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
