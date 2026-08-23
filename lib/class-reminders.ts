import { getSupabase } from "@/lib/supabase/server";

const RESEND_URL = "https://api.resend.com/emails";
const MAX_SCHEDULE_AHEAD_MS = 29 * 24 * 60 * 60 * 1000;
const MIN_SCHEDULE_LEAD_MS = 30 * 1000;

type BookingReminderRow = {
  id: string;
  user_id: string;
  slot_start: string;
  status: string;
  subject: string | null;
  academic_level: string | null;
  topic: string | null;
  meet_url: string | null;
  reminder_60_email_id: string | null;
  reminder_5_email_id: string | null;
  reminders_for_slot_start: string | null;
  reminder_60_handled: boolean;
  reminder_5_handled: boolean;
};

type ProfileRow = {
  full_name: string | null;
  contact_email: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatClassDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function cancelResendEmail(emailId: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) return false;

  try {
    const response = await fetch(
      `${RESEND_URL}/${encodeURIComponent(emailId)}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "Base12Academy/1.0",
        },
      }
    );

    if (!response.ok) {
      console.warn("No se pudo cancelar un recordatorio de Resend", {
        emailId,
        status: response.status,
        detail: await response.text().catch(() => ""),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Error cancelando recordatorio de Resend", error);
    return false;
  }
}

async function scheduleResendEmail(input: {
  bookingId: string;
  offsetMinutes: 60 | 5;
  to: string;
  studentName: string;
  slotStart: string;
  subject: string;
  academicLevel: string;
  topic: string;
  meetUrl: string;
  scheduledAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    console.warn(
      "Recordatorio no programado: faltan RESEND_API_KEY o RESEND_FROM_EMAIL."
    );
    return null;
  }

  const whenText = input.offsetMinutes === 60 ? "1 hora" : "5 minutos";
  const classDate = formatClassDate(input.slotStart);
  const subjectLine =
    `Recordatorio: tu clase de Base12 comienza en ${whenText}`;

  const text = [
    `Hola ${input.studentName}:`,
    "",
    `Tu clase de Base12 Academy comienza en ${whenText}.`,
    `Fecha y hora: ${classDate}`,
    input.academicLevel ? `Nivel: ${input.academicLevel}` : null,
    input.subject ? `Asignatura: ${input.subject}` : null,
    input.topic ? `Tema: ${input.topic}` : null,
    "",
    `Google Meet: ${input.meetUrl}`,
    "",
    "Puedes consultar tus clases desde Â«Mis clasesÂ» en Base12 Academy.",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;line-height:1.55">
      <h2>Tu clase comienza en ${escapeHtml(whenText)}</h2>
      <p>Hola ${escapeHtml(input.studentName)}:</p>
      <p>Te recordamos que tu clase de Base12 Academy comienza en <strong>${escapeHtml(whenText)}</strong>.</p>
      <p>
        <strong>Fecha y hora:</strong> ${escapeHtml(classDate)}<br />
        ${input.academicLevel ? `<strong>Nivel:</strong> ${escapeHtml(input.academicLevel)}<br />` : ""}
        ${input.subject ? `<strong>Asignatura:</strong> ${escapeHtml(input.subject)}<br />` : ""}
        ${input.topic ? `<strong>Tema:</strong> ${escapeHtml(input.topic)}` : ""}
      </p>
      <p>
        <a href="${escapeHtml(input.meetUrl)}" style="display:inline-block;padding:11px 16px;border-radius:9px;background:#0f3f92;color:#fff;text-decoration:none;font-weight:700">
          Entrar en Google Meet
        </a>
      </p>
      <p style="font-size:13px;color:#64748b">TambiÃ©n puedes consultar la reserva desde Â«Mis clasesÂ» en Base12 Academy.</p>
    </div>
  `;

  const idempotencyKey = [
    "b12",
    "class",
    input.bookingId,
    input.offsetMinutes,
    Date.parse(input.slotStart),
  ].join("-");

  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "Base12Academy/1.0",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: subjectLine,
      text,
      html,
      scheduled_at: input.scheduledAt,
      tags: [
        { name: "category", value: "class_reminder" },
        { name: "offset", value: String(input.offsetMinutes) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `RESEND_REMINDER_SCHEDULE_FAILED_${response.status}: ${detail}`
    );
  }

  const data = (await response.json()) as { id?: string };

  if (!data.id) throw new Error("RESEND_REMINDER_WITHOUT_ID");

  return data.id;
}

async function getBooking(bookingId: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("class_bookings")
    .select(`
      id,
      user_id,
      slot_start,
      status,
      subject,
      academic_level,
      topic,
      meet_url,
      reminder_60_email_id,
      reminder_5_email_id,
      reminders_for_slot_start,
      reminder_60_handled,
      reminder_5_handled
    `)
    .eq("id", bookingId)
    .maybeSingle();

  if (error) throw error;

  return (data ?? null) as BookingReminderRow | null;
}

async function getStudent(userId: string) {
  const supabase = getSupabase();

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("full_name,contact_email")
    .eq("user_id", userId)
    .maybeSingle();

  const typedProfile = (profile ?? null) as ProfileRow | null;

  if (typedProfile?.contact_email) {
    return {
      email: typedProfile.contact_email.trim(),
      fullName: typedProfile.full_name?.trim() || "alumno/a",
    };
  }

  const { data: authData } = await supabase.auth.admin.getUserById(userId);

  const email = authData.user?.email?.trim() || "";
  const metadataName =
    typeof authData.user?.user_metadata?.full_name === "string"
      ? authData.user.user_metadata.full_name.trim()
      : "";

  return {
    email,
    fullName:
      typedProfile?.full_name?.trim() || metadataName || "alumno/a",
  };
}

async function resetForNewSlot(booking: BookingReminderRow) {
  const supabase = getSupabase();

  if (booking.reminder_60_email_id) {
    await cancelResendEmail(booking.reminder_60_email_id);
  }

  if (booking.reminder_5_email_id) {
    await cancelResendEmail(booking.reminder_5_email_id);
  }

  const { error } = await supabase
    .from("class_bookings")
    .update({
      reminder_60_email_id: null,
      reminder_5_email_id: null,
      reminders_for_slot_start: booking.slot_start,
      reminder_60_handled: false,
      reminder_5_handled: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", booking.id);

  if (error) throw error;
}

export async function cancelClassReminders(bookingId: string) {
  const booking = await getBooking(bookingId);

  if (!booking) return false;

  const supabase = getSupabase();

  let sixtyCancelled = !booking.reminder_60_email_id;
  let fiveCancelled = !booking.reminder_5_email_id;

  if (booking.reminder_60_email_id) {
    sixtyCancelled = await cancelResendEmail(
      booking.reminder_60_email_id
    );
  }

  if (booking.reminder_5_email_id) {
    fiveCancelled = await cancelResendEmail(
      booking.reminder_5_email_id
    );
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (sixtyCancelled) {
    patch.reminder_60_email_id = null;
    patch.reminder_60_handled = true;
  }

  if (fiveCancelled) {
    patch.reminder_5_email_id = null;
    patch.reminder_5_handled = true;
  }

  const { error } = await supabase
    .from("class_bookings")
    .update(patch)
    .eq("id", bookingId);

  if (error) throw error;

  return sixtyCancelled && fiveCancelled;
}

export async function refreshClassReminders(bookingId: string) {
  let booking = await getBooking(bookingId);

  if (!booking) {
    return { ok: false, reason: "BOOKING_NOT_FOUND" };
  }

  if (booking.status !== "confirmed") {
    await cancelClassReminders(bookingId);
    return { ok: true, reason: "BOOKING_NOT_CONFIRMED" };
  }

  if (!booking.meet_url) {
    return { ok: false, reason: "MEET_NOT_READY" };
  }

  if (booking.reminders_for_slot_start !== booking.slot_start) {
    await resetForNewSlot(booking);
    booking = (await getBooking(bookingId)) ?? booking;
  }

  const student = await getStudent(booking.user_id);

  if (!student.email) {
    return { ok: false, reason: "STUDENT_EMAIL_MISSING" };
  }

  const slotStartMs = Date.parse(booking.slot_start);

  if (!Number.isFinite(slotStartMs)) {
    throw new Error("INVALID_CLASS_SLOT_START");
  }

  const now = Date.now();

  const reminders = [
    {
      offsetMinutes: 60 as const,
      idField: "reminder_60_email_id" as const,
      handledField: "reminder_60_handled" as const,
    },
    {
      offsetMinutes: 5 as const,
      idField: "reminder_5_email_id" as const,
      handledField: "reminder_5_handled" as const,
    },
  ];

  const supabase = getSupabase();

  for (const reminder of reminders) {
    if (booking[reminder.handledField]) continue;

    const scheduledMs =
      slotStartMs - reminder.offsetMinutes * 60 * 1000;

    if (scheduledMs <= now + MIN_SCHEDULE_LEAD_MS) {
      const { error } = await supabase
        .from("class_bookings")
        .update({
          [reminder.handledField]: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id);

      if (error) throw error;

      booking = {
        ...booking,
        [reminder.handledField]: true,
      };

      continue;
    }

    if (scheduledMs - now > MAX_SCHEDULE_AHEAD_MS) continue;

    if (!booking.meet_url) {
      return {
        ok: false,
        reason: "MEET_NOT_READY",
      };
    }

    const emailId = await scheduleResendEmail({
      bookingId: booking.id,
      offsetMinutes: reminder.offsetMinutes,
      to: student.email,
      studentName: student.fullName,
      slotStart: booking.slot_start,
      subject: booking.subject || "",
      academicLevel: booking.academic_level || "",
      topic: booking.topic || "",
      meetUrl: booking.meet_url,
      scheduledAt: new Date(scheduledMs).toISOString(),
    });

    if (!emailId) continue;

    const { error } = await supabase
      .from("class_bookings")
      .update({
        [reminder.idField]: emailId,
        [reminder.handledField]: true,
        reminders_for_slot_start: booking.slot_start,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id);

    if (error) throw error;

    booking = {
      ...booking,
      [reminder.idField]: emailId,
      [reminder.handledField]: true,
      reminders_for_slot_start: booking.slot_start,
    };
  }

  return {
    ok: true,
    reminder60: booking.reminder_60_handled,
    reminder5: booking.reminder_5_handled,
  };
}

export async function refreshUpcomingClassReminders() {
  const supabase = getSupabase();
  const now = new Date();
  const horizon = new Date(
    now.getTime() + 31 * 24 * 60 * 60 * 1000
  );

  const { data: bookings, error } = await supabase
    .from("class_bookings")
    .select("id")
    .eq("status", "confirmed")
    .gt("slot_start", now.toISOString())
    .lte("slot_start", horizon.toISOString())
    .order("slot_start", { ascending: true })
    .limit(500);

  if (error) throw error;

  const results = [];

  for (const row of bookings ?? []) {
    try {
      const result = await refreshClassReminders(row.id);
      results.push({ bookingId: row.id, ...result });
    } catch (error) {
      console.error(
        "No se pudieron preparar los recordatorios de una clase",
        { bookingId: row.id, error }
      );
      results.push({
        bookingId: row.id,
        ok: false,
        reason: "ERROR",
      });
    }
  }

  return results;
}
