import { getSupabase } from "@/lib/supabase/server";

const DAY_INDEX: Record<string, number> = {
  domingo: 0,
  domingos: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sabados: 6,
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function parseStudyDays(raw: unknown) {
  const values = Array.isArray(raw) ? raw.map(String) : [String(raw ?? "")];

  return values
    .flatMap((value) => value.split(/[,;]|\s+y\s+/i))
    .map((value) => normalize(value))
    .filter((value, index, all) => value in DAY_INDEX && all.indexOf(value) === index);
}

export function parseSessionDuration(raw: unknown) {
  const match = String(raw ?? "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function parseStudyTime(value: string) {
  const match = value.match(/(?:^|\s)([01]?\d|2[0-3]):([0-5]\d)(?:\s|$|\D)/);

  if (!match) return null;

  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
    label: `${match[1].padStart(2, "0")}:${match[2]}`,
  };
}

function timeZoneOffsetMilliseconds(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );

  return Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  ) - date.getTime();
}

function madridDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number
) {
  const desired = Date.UTC(year, month, day, hours, minutes, 0);
  let result = new Date(desired);

  for (let iteration = 0; iteration < 2; iteration++) {
    result = new Date(desired - timeZoneOffsetMilliseconds(result, "Europe/Madrid"));
  }

  return result;
}

type ScheduleInput = {
  userId: string;
  enrollmentId: string;
  courseSlug: string;
  planSlug: string;
  studyDays: unknown;
  studyTime: string;
  examDate?: string | null;
};

export async function scheduleFernandoTelegramReminders(input: ScheduleInput) {
  const studyDays = parseStudyDays(input.studyDays);
  const time = parseStudyTime(input.studyTime);

  if (!studyDays.length || !time) {
    throw new Error("El plan no contiene días y hora válidos para Telegram");
  }

  const dayIndexes = new Set(studyDays.map((day) => DAY_INDEX[day]));
  const supabase = getSupabase();
  const now = new Date();
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + 90);

  if (input.examDate) {
    const examEnd = new Date(`${input.examDate}T23:59:59Z`);
    if (!Number.isNaN(examEnd.getTime()) && examEnd < horizon && examEnd > now) {
      horizon.setTime(examEnd.getTime());
    }
  }

  const { error: cancelError } = await supabase
    .from("telegram_notifications")
    .update({ status: "cancelled", updated_at: now.toISOString() })
    .eq("enrollment_id", input.enrollmentId)
    .eq("source", "fernando")
    .eq("status", "pending");

  if (cancelError) throw cancelError;

  const rows: Array<Record<string, unknown>> = [];
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  while (cursor <= horizon) {
    if (dayIndexes.has(cursor.getUTCDay())) {
      const sessionStart = madridDateTimeToUtc(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth(),
        cursor.getUTCDate(),
        time.hours,
        time.minutes
      );

      for (const minutesBefore of [30, 5]) {
        const scheduledFor = new Date(sessionStart.getTime() - minutesBefore * 60_000);

        if (scheduledFor > now && scheduledFor <= horizon) {
          rows.push({
            user_id: input.userId,
            enrollment_id: input.enrollmentId,
            source: "fernando",
            notification_type: `study_reminder_${minutesBefore}`,
            title: "Tu sesión de estudio",
            message:
              minutesBefore === 30
                ? `Tu sesión de ${input.courseSlug} · ${input.planSlug} empieza a las ${time.label}. Entra en Base12 Academy y prepara tu siguiente bloque de trabajo.`
                : `Tu sesión de ${input.courseSlug} · ${input.planSlug} comienza en 5 minutos. Fernando te espera para ayudarte a priorizar el entrenamiento de hoy.`,
            scheduled_for: scheduledFor.toISOString(),
            status: "pending",
            dedupe_key: `fernando:${input.enrollmentId}:${sessionStart.toISOString()}:${minutesBefore}`,
          });
        }
      }
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  for (let index = 0; index < rows.length; index += 250) {
    const { error } = await supabase
      .from("telegram_notifications")
      .upsert(rows.slice(index, index + 250), {
        onConflict: "dedupe_key",
        ignoreDuplicates: true,
      });

    if (error) throw error;
  }

  return rows.length;
}
