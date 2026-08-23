import { refreshClassReminders } from "@/lib/class-reminders";
﻿import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getSupabase } from "@/lib/supabase/server";
import {
  getCalendarOAuthClient,
  getClassesCalendarId,
} from "@/lib/google-calendar";
import { courses } from "@/lib/courses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hashCheckoutToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function generateTemporaryPassword() {
  return `B12!${crypto
    .randomBytes(14)
    .toString("base64url")}`;
}

function getBearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7);
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatEuro(amountCents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

function planName(planSlug: string) {
  if (planSlug === "esencial") {
    return "Competencias Digitales";
  }

  if (planSlug === "estandar") {
    return "Ofim├ítica";
  }

  if (planSlug === "premium") {
    return "Productividad Digital e IA";
  }

  return planSlug;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

type FirstClassCalendarInput = {
  bookingId: string;
  email: string;
  fullName: string;
  subject: string;
  academicLevel: string;
  topic: string;
  bookPublisher: string;
};

async function syncFirstClassBookingToCalendar(
  input: FirstClassCalendarInput
) {
  const refreshToken =
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

  if (!refreshToken) {
    console.error(
      "Primera clase no sincronizada: falta GOOGLE_CALENDAR_REFRESH_TOKEN."
    );
    return false;
  }

  const supabase = getSupabase();

  const {
    data: booking,
    error: bookingError,
  } = await supabase
    .from("class_bookings")
    .select(`
      id,
      slot_start,
      slot_end,
      google_event_id,
      meet_url
    `)
    .eq("id", input.bookingId)
    .maybeSingle();

  if (bookingError || !booking) {
    throw bookingError ??
      new Error(
        "No se encontró la primera reserva para sincronizarla con Google Calendar."
      );
  }

  if (
    booking.google_event_id &&
    booking.meet_url
  ) {
    return true;
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

  const eventId =
    booking.google_event_id ||
    `b12${booking.id.replace(/-/g, "")}`;

  const description = [
    `Alumno: ${input.fullName}`,
    `Nivel: ${input.academicLevel}`,
    `Asignatura: ${input.subject}`,
    `Tema: ${input.topic}`,
    input.bookPublisher
      ? `Editorial: ${input.bookPublisher}`
      : null,
    "",
    "Clase Online · Base12 Academy",
  ]
    .filter(Boolean)
    .join("\n");

  let eventData;

  try {
    const inserted =
      await calendar.events.insert({
        calendarId:
          getClassesCalendarId(),

        conferenceDataVersion: 1,

        sendUpdates: "all",

        requestBody: {
          id: eventId,

          summary:
            `Base12 · ${input.fullName} · ${input.subject}`,

          description,

          start: {
            dateTime:
              booking.slot_start,
            timeZone:
              "Europe/Madrid",
          },

          end: {
            dateTime:
              booking.slot_end,
            timeZone:
              "Europe/Madrid",
          },

          attendees: [
            {
              email:
                input.email,
            },
          ],

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

    eventData =
      inserted.data;
  } catch (insertError) {
    const status =
      typeof insertError === "object" &&
      insertError !== null &&
      "code" in insertError
        ? Number(
            (insertError as { code?: unknown }).code
          )
        : null;

    if (status !== 409) {
      throw insertError;
    }

    const existing =
      await calendar.events.get({
        calendarId:
          getClassesCalendarId(),
        eventId,
      });

    eventData =
      existing.data;
  }

  let meetUrl =
    eventData.conferenceData
      ?.entryPoints
      ?.find(
        (entry) =>
          entry.entryPointType === "video"
      )
      ?.uri ??
    eventData.hangoutLink ??
    null;

  if (!meetUrl) {
    try {
      const patched =
        await calendar.events.patch({
          calendarId:
            getClassesCalendarId(),

          eventId,

          conferenceDataVersion: 1,

          sendUpdates: "all",

          requestBody: {
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

      meetUrl =
        patched.data.conferenceData
          ?.entryPoints
          ?.find(
            (entry) =>
              entry.entryPointType === "video"
          )
          ?.uri ??
        patched.data.hangoutLink ??
        null;
    } catch (meetError) {
      console.error(
        "No se pudo añadir Google Meet a la primera clase",
        meetError
      );
    }
  }

  const {
    error: updateError,
  } = await supabase
    .from("class_bookings")
    .update({
      google_event_id:
        eventData.id || eventId,

      meet_url:
        meetUrl,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", booking.id);

  if (updateError) {
    throw updateError;
  }

  return true;
}


type ClassConfirmationEmailInput = {
  email: string;
  fullName: string;
  orderId: string;
  amountCents: number;
  totalHours: number;
  expiresAt: Date | null;
  bookingId: string;
  academicLevel: string;
  subject: string;
  topic: string;
  bookPublisher: string;
  termsAccepted: boolean;
  privacyAcknowledged: boolean;
  withdrawalAcknowledged: boolean;
  marketingConsent: boolean;
};

function formatClassDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function sendClassPurchaseConfirmation(
  input: ClassConfirmationEmailInput
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "Correo de Clases Online no enviado: faltan RESEND_API_KEY o RESEND_FROM_EMAIL."
    );
    return false;
  }

  const supabase = getSupabase();

  const {
    data: booking,
    error: bookingError,
  } = await supabase
    .from("class_bookings")
    .select(`
      slot_start,
      slot_end,
      meet_url
    `)
    .eq("id", input.bookingId)
    .maybeSingle();

  if (bookingError) {
    console.error(
      "No se pudieron recuperar los datos de la primera clase para el correo",
      bookingError
    );
  }

  const price = formatEuro(input.amountCents);

  const expirationText =
    input.expiresAt
      ? formatDate(input.expiresAt)
      : "Consulta Mis clases";

  const firstClassText =
    booking?.slot_start
      ? formatClassDateTime(booking.slot_start)
      : "Consulta la reserva en Mis clases";

  const publisherText =
    input.bookPublisher
      ? input.bookPublisher
      : "No indicada";

  const subjectLine =
    `Confirmación de bono de Clases Online · ${input.totalHours} horas · Base12 Academy`;

  const textBody = [
    `Hola ${input.fullName},`,
    "",
    "Tu bono de Clases Online de Base12 Academy ha quedado contratado correctamente.",
    "",
    "RESUMEN DE LA CONTRATACIÓN",
    `Bono: ${input.totalHours} horas`,
    `Importe pagado: ${price}`,
    `Referencia del pedido: ${input.orderId}`,
    `Caducidad del bono: ${expirationText}`,
    "",
    "PRIMERA CLASE RESERVADA",
    `Fecha y hora: ${firstClassText}`,
    `Nivel: ${input.academicLevel}`,
    `Asignatura: ${input.subject}`,
    `Tema: ${input.topic}`,
    `Editorial: ${publisherText}`,
    "",
    "La primera clase ya forma parte de las horas del bono contratado.",
    "",
    "GESTIÓN DE TUS CLASES",
    "Puedes reservar las horas restantes y consultar tus próximas clases desde:",
    "https://base12academy.es/dashboard/clases",
    "",
    "Los cambios de horario se realizan únicamente desde Mis clases y pueden hacerse hasta 30 minutos antes del comienzo de la clase.",
    "Al cambiar el horario se mueve la misma reserva: no se consume una segunda hora del bono y se conserva el mismo Google Meet.",
    "",
    "Google Calendar enviará la invitación de la clase al correo de tu cuenta cuando la sincronización esté disponible.",
    "",
    "ACEPTACIONES REGISTRADAS",
    `Condiciones de contratación y normas de uso: ${input.termsAccepted ? "Aceptadas" : "No aceptadas"}`,
    `Política de privacidad: ${input.privacyAcknowledged ? "Confirmada" : "No confirmada"}`,
    `Conocimiento de las consecuencias del inicio inmediato: ${input.withdrawalAcknowledged ? "Confirmado" : "No confirmado"}`,
    `Comunicaciones comerciales opcionales: ${input.marketingConsent ? "Aceptadas" : "No aceptadas"}`,
    "",
    "TU CUENTA",
    `Correo de acceso: ${input.email}`,
    "Por seguridad, Base12 Academy no envía contraseñas por correo electrónico.",
    "Acceso: https://base12academy.es/login",
    "",
    "Conserva este correo junto con la referencia del pedido.",
    "",
    "Base12 Academy",
  ].join("\n");

  const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;line-height:1.55">
      <div style="padding:24px 0 18px;border-bottom:1px solid #e5e7eb">
        <div style="font-size:22px;font-weight:800;color:#0b4fc2">
          Base12 Academy
        </div>
      </div>

      <div style="padding:26px 0">
        <p>Hola ${escapeHtml(input.fullName)},</p>

        <p>
          Tu bono de <strong>Clases Online</strong> ha quedado contratado correctamente.
        </p>

        <h2 style="font-size:18px;margin-top:28px">
          Resumen de la contratación
        </h2>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#64748b">Bono</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${input.totalHours} horas
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Importe pagado</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(price)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Referencia</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(input.orderId)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Caducidad</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(expirationText)}
            </td>
          </tr>
        </table>

        <div style="margin-top:24px;padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px">
          <div style="font-weight:800;color:#1e40af;margin-bottom:8px">
            Primera clase reservada
          </div>
          <div><strong>Fecha y hora:</strong> ${escapeHtml(firstClassText)}</div>
          <div><strong>Nivel:</strong> ${escapeHtml(input.academicLevel)}</div>
          <div><strong>Asignatura:</strong> ${escapeHtml(input.subject)}</div>
          <div><strong>Tema:</strong> ${escapeHtml(input.topic)}</div>
          <div><strong>Editorial:</strong> ${escapeHtml(publisherText)}</div>
        </div>

        <p style="margin-top:20px">
          La primera clase ya forma parte de las horas del bono contratado.
        </p>

        <h2 style="font-size:18px;margin-top:30px">
          Gestión de tus clases
        </h2>

        <p>
          Desde <strong>Mis clases</strong> puedes reservar las horas restantes,
          consultar tus próximas clases y cambiar una clase ya programada.
        </p>

        <p>
          Los cambios de horario se realizan únicamente desde Mis clases y
          pueden hacerse hasta <strong>30 minutos antes</strong> del comienzo.
          El cambio mueve la misma reserva: no consume una segunda hora del bono
          y conserva el mismo Google Meet.
        </p>

        <p>
          <a
            href="https://base12academy.es/dashboard/clases"
            style="display:inline-block;background:#0b4fc2;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px"
          >
            Ir a Mis clases
          </a>
        </p>

        <p style="color:#526176">
          Google Calendar enviará la invitación de la clase al correo de tu
          cuenta cuando la sincronización esté disponible.
        </p>

        <h2 style="font-size:18px;margin-top:30px">
          Aceptaciones registradas
        </h2>

        <ul style="padding-left:20px">
          <li>
            Condiciones de contratación y normas de uso:
            <strong>${input.termsAccepted ? "Aceptadas" : "No aceptadas"}</strong>.
          </li>
          <li>
            Política de privacidad:
            <strong>${input.privacyAcknowledged ? "Confirmada" : "No confirmada"}</strong>.
          </li>
          <li>
            Conocimiento de las consecuencias del inicio inmediato:
            <strong>${input.withdrawalAcknowledged ? "Confirmado" : "No confirmado"}</strong>.
          </li>
          <li>
            Comunicaciones comerciales opcionales:
            <strong>${input.marketingConsent ? "Aceptadas" : "No aceptadas"}</strong>.
          </li>
        </ul>

        <h2 style="font-size:18px;margin-top:30px">
          Tu cuenta
        </h2>

        <p>
          Correo de acceso:
          <strong>${escapeHtml(input.email)}</strong>.
          Por seguridad, Base12 Academy no envía contraseñas por correo electrónico.
        </p>

        <p>
          <a
            href="https://base12academy.es/login"
            style="display:inline-block;border:1px solid #cbd5e1;color:#172033;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:10px"
          >
            Acceder a Base12 Academy
          </a>
        </p>

        <p style="margin-top:24px">
          Conserva este correo junto con la referencia del pedido.
        </p>
      </div>

      <div style="border-top:1px solid #e5e7eb;padding:18px 0;color:#64748b;font-size:13px">
        Base12 Academy
      </div>
    </div>
  `;

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: subjectLine,
        text: textBody,
        html: htmlBody,
      }),
    }
  );

  if (!response.ok) {
    const detail =
      await response.text().catch(() => "");

    console.error(
      "Resend rechazó el correo de Clases Online",
      {
        status: response.status,
        detail,
      }
    );

    return false;
  }

  return true;
}

type ConfirmationEmailInput = {
  email: string;
  fullName: string;
  orderId: string;
  planSlug: string;
  amountCents: number;
  accessMonths: number | null;
  immediateAccess: boolean;
  startsAt: Date;
  expiresAt: Date | null;
  termsAccepted: boolean;
  privacyAcknowledged: boolean;
  withdrawalAcknowledged: boolean;
  marketingConsent: boolean;
};

async function sendPurchaseConfirmation(
  input: ConfirmationEmailInput
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "Correo de confirmaci├│n no enviado: faltan RESEND_API_KEY o RESEND_FROM_EMAIL."
    );
    return false;
  }

  const accessName = planName(input.planSlug);
  const price = formatEuro(input.amountCents);
  const activationText = input.immediateAccess
    ? "Acceso inmediato solicitado y habilitado."
    : `El acceso de pago se activar├í el ${formatDate(input.startsAt)}.`;

  const expirationText = input.expiresAt
    ? ` hasta el ${formatDate(input.expiresAt)}`
    : "";

  const durationText = input.accessMonths
    ? `${input.accessMonths} meses${expirationText}`
    : "Seg├║n las condiciones del acceso contratado";

  const subject =
    `Confirmaci├│n de contrataci├│n ┬À ${accessName} ┬À Base12 Academy`;

  const text = [
    `Hola ${input.fullName},`,
    "",
    "Tu contrataci├│n en Base12 Academy ha quedado registrada correctamente.",
    "",
    "RESUMEN DE LA CONTRATACI├ôN",
    "Curso: Competencias, Productividad, Ofim├ítica e IA",
    `Acceso: ${accessName}`,
    `Importe pagado: ${price}`,
    `Referencia del pedido: ${input.orderId}`,
    `Duraci├│n del acceso: ${durationText}`,
    `Activaci├│n: ${activationText}`,
    "",
    "ACEPTACIONES REGISTRADAS",
    `Condiciones de contrataci├│n y normas de uso: ${input.termsAccepted ? "Aceptadas" : "No aceptadas"}`,
    `Pol├¡tica de privacidad: ${input.privacyAcknowledged ? "Confirmada" : "No confirmada"}`,
    `Inicio inmediato: ${input.immediateAccess ? "Solicitado" : "No solicitado"}`,
    `Conocimiento de las consecuencias del inicio inmediato: ${input.withdrawalAcknowledged ? "Confirmado" : "No aplicable / no confirmado"}`,
    `Comunicaciones comerciales opcionales: ${input.marketingConsent ? "Aceptadas" : "No aceptadas"}`,
    "",
    "TU CUENTA",
    `Correo de acceso: ${input.email}`,
    "Por seguridad, Base12 Academy no env├¡a contrase├▒as por correo electr├│nico.",
    "Puedes acceder a tu cuenta desde https://base12academy.es/login",
    "",
    "Durante el alta completar├ís los datos de facturaci├│n, tu planificaci├│n con Fernando, la vinculaci├│n con Telegram y los v├¡deos de bienvenida.",
    "",
    "Conserva este correo junto con la referencia del pedido.",
    "",
    "Base12 Academy",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;line-height:1.55">
      <div style="padding:24px 0 18px;border-bottom:1px solid #e5e7eb">
        <div style="font-size:22px;font-weight:800;color:#0b4fc2">Base12 Academy</div>
      </div>

      <div style="padding:26px 0">
        <p>Hola ${escapeHtml(input.fullName)},</p>

        <p>
          Tu contrataci├│n en Base12 Academy ha quedado registrada correctamente.
          Este correo resume la operaci├│n y las aceptaciones asociadas a tu pedido.
        </p>

        <h2 style="font-size:18px;margin-top:28px">Resumen de la contrataci├│n</h2>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#64748b">Curso</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              Competencias, Productividad, Ofim├ítica e IA
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Acceso</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(accessName)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Importe pagado</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(price)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Referencia</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(input.orderId)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Duraci├│n</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(durationText)}
            </td>
          </tr>
        </table>

        <div style="margin-top:20px;padding:14px 16px;background:#eef5ff;border:1px solid #bfdbfe;border-radius:12px;color:#174b8f">
          ${escapeHtml(activationText)}
        </div>

        <h2 style="font-size:18px;margin-top:30px">Aceptaciones registradas</h2>

        <ul style="padding-left:20px">
          <li>Condiciones de contrataci├│n y normas de uso: <strong>${input.termsAccepted ? "Aceptadas" : "No aceptadas"}</strong>.</li>
          <li>Pol├¡tica de privacidad: <strong>${input.privacyAcknowledged ? "Confirmada" : "No confirmada"}</strong>.</li>
          <li>Inicio inmediato: <strong>${input.immediateAccess ? "Solicitado" : "No solicitado"}</strong>.</li>
          <li>Conocimiento de las consecuencias del inicio inmediato: <strong>${input.withdrawalAcknowledged ? "Confirmado" : "No aplicable / no confirmado"}</strong>.</li>
          <li>Comunicaciones comerciales opcionales: <strong>${input.marketingConsent ? "Aceptadas" : "No aceptadas"}</strong>.</li>
        </ul>

        <h2 style="font-size:18px;margin-top:30px">Tu cuenta</h2>

        <p>
          Correo de acceso:
          <strong>${escapeHtml(input.email)}</strong>.
          Por seguridad, Base12 Academy no env├¡a contrase├▒as por correo electr├│nico.
        </p>

        <p>
          <a
            href="https://base12academy.es/login"
            style="display:inline-block;background:#0b4fc2;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px"
          >
            Acceder a Base12 Academy
          </a>
        </p>

        <p style="margin-top:26px;color:#526176">
          Durante el alta completar├ís los datos de facturaci├│n, tu planificaci├│n con Fernando,
          la vinculaci├│n con Telegram y los v├¡deos de bienvenida.
        </p>

        <p style="margin-top:24px">
          Conserva este correo junto con la referencia del pedido.
        </p>
      </div>

      <div style="border-top:1px solid #e5e7eb;padding:18px 0;color:#64748b;font-size:13px">
        Base12 Academy
      </div>
    </div>
  `;

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Base12Academy/1.0",
        "Idempotency-Key": `base12-contract-${input.orderId}`,
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject,
        html,
        text,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(
      "Resend no pudo enviar la confirmaci├│n de contrataci├│n",
      response.status,
      errorText
    );
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  let createdUserId: string | null = null;

  try {
    const body = await request.json().catch(() => ({}));

    const checkoutToken =
      typeof body?.checkout === "string"
        ? body.checkout.trim()
        : "";

    const fullName =
      typeof body?.fullName === "string"
        ? body.fullName.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body?.phone === "string"
        ? body.phone.trim()
        : "";

    const autonomousCommunity =
      typeof body?.autonomousCommunity === "string"
        ? body.autonomousCommunity.trim()
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

    if (!checkoutToken) {
      return NextResponse.json(
        { error: "Falta la referencia de compra." },
        { status: 400 }
      );
    }

    if (fullName.length < 3) {
      return NextResponse.json(
        {
          error:
            "Indica tu nombre y apellidos.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          error:
            "Indica un correo electr├│nico v├ílido.",
        },
        { status: 400 }
      );
    }

    if (phone.length < 6) {
      return NextResponse.json(
        {
          error:
            "Indica un n├║mero de m├│vil v├ílido.",
        },
        { status: 400 }
      );
    }

    const {
      data: checkout,
      error: checkoutError,
    } = await supabase
      .from("checkout_orders")
      .select(
        `
          id,
          order_id,
          status,
          catalog_slug,
          course_slug,
          plan_slug,
          access_months,
          amount_cents,
          legal_version,
          terms_accepted,
          privacy_acknowledged,
          immediate_access_requested,
          withdrawal_acknowledged,
          marketing_consent,
          contract_snapshot,
          ip_hash,
          user_agent,
          paid_at,
          communications_video_completed_at,
          linked_user_id,
          contract_acceptance_id
        `
      )
      .eq(
        "checkout_token_hash",
        hashCheckoutToken(checkoutToken)
      )
      .maybeSingle();

    if (checkoutError) {
      throw checkoutError;
    }

    if (!checkout) {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado la compra.",
        },
        { status: 404 }
      );
    }

    const catalogCourse =
      courses[
        checkout.catalog_slug as keyof typeof courses
      ];

    if (!catalogCourse) {
      return NextResponse.json(
        {
          error:
            "No se ha podido identificar el producto contratado.",
        },
        { status: 400 }
      );
    }

    const isClassBono =
      catalogCourse.accessType === "class_bono";

    const classService =
      isClassBono &&
      "classService" in catalogCourse
        ? catalogCourse.classService
        : null;

    const classHours =
      isClassBono &&
      "classHours" in catalogCourse
        ? catalogCourse.classHours
        : null;

    if (
      checkout.status !== "paid" &&
      checkout.status !== "linked"
    ) {
      return NextResponse.json(
        {
          error:
            "El pago todav├¡a no est├í confirmado.",
        },
        { status: 409 }
      );
    }

    if (isClassBono) {
      if (
        !classService ||
        !classHours
      ) {
        return NextResponse.json(
          {
            error:
              "La configuraci?n del bono de clases no es v?lida.",
          },
          { status: 500 }
        );
      }

      if (
        !autonomousCommunity ||
        !academicLevel ||
        !topic
      ) {
        return NextResponse.json(
          {
            error:
              "Completa la Comunidad Aut?noma, el nivel o curso y el tema de la primera clase.",
          },
          { status: 400 }
        );
      }

      if (
        classService === "universidad-historia" &&
        subject !== "Historia"
      ) {
        return NextResponse.json(
          {
            error:
              "Las clases universitarias contratadas corresponden a Historia.",
          },
          { status: 400 }
        );
      }

      if (
        classService ===
          "eso-bach-historia-filosofia" &&
        subject !== "Historia" &&
        subject !== "Filosof?a"
      ) {
        return NextResponse.json(
          {
            error:
              "Selecciona Historia o Filosof?a.",
          },
          { status: 400 }
        );
      }
    }

    if (
      !isClassBono &&
      !checkout.communications_video_completed_at
    ) {
      return NextResponse.json(
        {
          error:
            "La bienvenida inicial todav├¡a no est├í completada.",
        },
        { status: 409 }
      );
    }

    /*
     * Si el pedido ya est├í vinculado,
     * no puede reclamarse con otra cuenta.
     */
    if (
      checkout.status === "linked" &&
      checkout.linked_user_id
    ) {
      return NextResponse.json(
        {
          error:
            "Esta compra ya est├í vinculada a una cuenta.",
          code: "ALREADY_LINKED",
        },
        { status: 409 }
      );
    }

    /*
     * Si viene una sesi├│n autenticada,
     * utilizamos esa cuenta existente.
     *
     * Si no, creamos una cuenta nueva
     * con contrase├▒a provisional.
     */
    const accessToken =
      getBearerToken(request);

    let userId: string;
    let temporaryPassword: string | null = null;
    let newAccount = false;

    if (accessToken) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(
        accessToken
      );

      if (authError || !user) {
        return NextResponse.json(
          {
            error:
              "La sesi├│n no es v├ílida.",
          },
          { status: 401 }
        );
      }

      const authenticatedEmail =
        user.email?.toLowerCase() ?? "";

      if (authenticatedEmail !== email) {
        return NextResponse.json(
          {
            error:
              "El correo indicado no coincide con la cuenta iniciada.",
          },
          { status: 400 }
        );
      }

      userId = user.id;
    } else {
      temporaryPassword =
        generateTemporaryPassword();

      const {
        data: createdUser,
        error: createUserError,
      } =
        await supabase.auth.admin.createUser({
          email,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            phone,
          },
        });

      if (
        createUserError ||
        !createdUser.user
      ) {
        const message =
          createUserError?.message?.toLowerCase() ??
          "";

        if (
          message.includes("already") ||
          message.includes("registered") ||
          message.includes("exists")
        ) {
          return NextResponse.json(
            {
              error:
                "Ya existe una cuenta de Base12 con este correo. Introduce la contrase├▒a de esa cuenta para vincular la compra.",
              code: "ACCOUNT_EXISTS",
            },
            { status: 409 }
          );
        }

        console.error(
          "No se pudo crear el usuario",
          createUserError
        );

        return NextResponse.json(
          {
            error:
              "No se pudo crear la cuenta de alumno.",
          },
          { status: 500 }
        );
      }

      userId = createdUser.user.id;
      createdUserId = userId;
      newAccount = true;
    }

    const now = new Date();

    /*
     * Evidencia contractual:
     * ahora puede asociarse al usuario.
     */
    let acceptanceId =
      checkout.contract_acceptance_id;

    if (!acceptanceId) {
      const {
        data: acceptance,
        error: acceptanceError,
      } = await supabase
        .from("contract_acceptances")
        .insert({
          user_id: userId,
          order_id: checkout.order_id,
          catalog_slug:
            checkout.catalog_slug,
          legal_version:
            checkout.legal_version,
          terms_accepted:
            checkout.terms_accepted,
          privacy_acknowledged:
            checkout.privacy_acknowledged,
          immediate_access_requested:
            checkout.immediate_access_requested,
          withdrawal_acknowledged:
            checkout.withdrawal_acknowledged,
          marketing_consent:
            checkout.marketing_consent,
          contract_snapshot:
            checkout.contract_snapshot,
          ip_hash:
            checkout.ip_hash,
          user_agent:
            checkout.user_agent,
          payment_confirmed_at:
            checkout.paid_at ??
            now.toISOString(),
        })
        .select("id")
        .single();

      if (
        acceptanceError ||
        !acceptance
      ) {
        throw acceptanceError ??
          new Error(
            "No se pudo crear la evidencia contractual."
          );
      }

      acceptanceId = acceptance.id;
    }

    /*
     * Perfil b├ísico del alumno.
     */
    const { error: profileError } =
      await supabase
        .from("student_profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName,
            contact_email: email,
            phone,

            ...(isClassBono
              ? {
                  autonomous_community:
                    autonomousCommunity,
                }
              : {}),

            updated_at:
              now.toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

    if (profileError) {
      throw profileError;
    }

    /*
     * Fecha real de activaci├│n.
     */
    const immediateAccess =
      isClassBono ||
      (
        checkout.immediate_access_requested &&
        checkout.withdrawal_acknowledged
      );

    const startsAt =
      isClassBono && checkout.paid_at
        ? new Date(checkout.paid_at)
        : new Date(now);

    if (
      !isClassBono &&
      !immediateAccess
    ) {
      startsAt.setUTCDate(
        startsAt.getUTCDate() + 14
      );
    }

    const expiresAt =
      isClassBono
        ? new Date(startsAt)
        : checkout.access_months
          ? new Date(startsAt)
          : null;

    if (expiresAt) {
      if (isClassBono) {
        expiresAt.setUTCMonth(
          expiresAt.getUTCMonth() + 2
        );
      } else if (
        checkout.access_months
      ) {
        expiresAt.setUTCMonth(
          expiresAt.getUTCMonth() +
            checkout.access_months
        );
      }
    }

    let classBookingIdForConfirmation:
      | string
      | null = null;

    if (isClassBono) {
      const {
        data: classPurchase,
        error: classPurchaseError,
      } = await supabase
        .rpc(
          "finalize_class_bono_purchase",
          {
            p_checkout_order_id:
              checkout.id,

            p_user_id:
              userId,

            p_catalog_slug:
              checkout.catalog_slug,

            p_plan_slug:
              checkout.plan_slug,

            p_class_service:
              classService,

            p_total_hours:
              classHours,

            p_subject:
              subject,

            p_academic_level:
              academicLevel,

            p_topic:
              topic,

            p_book_publisher:
              bookPublisher || null,
          }
        )
        .single();

      if (
        classPurchaseError ||
        !classPurchase
      ) {
        throw classPurchaseError ??
          new Error(
            "No se pudo activar el bono y confirmar la primera clase."
          );
      }
      /*
       * La compra ya está pagada y el bono ya existe.
       * Google Calendar se sincroniza en modo best-effort:
       * un fallo aquí no revierte el pago ni elimina la cuenta.
       */
      const classPurchaseRecord =
        classPurchase as {
          booking_id?: string | null;
        };

      if (
        typeof classPurchaseRecord.booking_id === "string"
      ) {
        classBookingIdForConfirmation =
          classPurchaseRecord.booking_id;
        try {
          await syncFirstClassBookingToCalendar({
            bookingId:
              classPurchaseRecord.booking_id,

            email,

            fullName,

            subject,

            academicLevel,

            topic,

            bookPublisher,
          });
          await refreshClassReminders(
            classPurchaseRecord.booking_id
          ).catch((reminderError) => {
            console.error(
              "No se pudieron programar los recordatorios de la primera clase",
              reminderError
            );
          });
        } catch (calendarError) {
          console.error(
            "Bono creado, pero la primera clase no pudo sincronizarse con Google Calendar",
            {
              checkoutId:
                checkout.id,
              bookingId:
                classPurchaseRecord.booking_id,
              error:
                calendarError,
            }
          );
        }
      } else {
        console.error(
          "Bono creado sin booking_id para sincronización de Calendar",
          {
            checkoutId:
              checkout.id,
          }
        );
      }

    } else {
      /*
       * Matr?cula de cursos y oposiciones.
       */
      const {
        data: enrollment,
        error: enrollmentError,
      } = await supabase
        .from("course_enrollments")
        .upsert(
          {
            user_id: userId,

            course_slug:
              checkout.course_slug,

            plan_slug:
              checkout.plan_slug,

            status:
              immediateAccess
                ? "active"
                : "pending",

            starts_at:
              startsAt.toISOString(),

            expires_at:
              expiresAt?.toISOString() ??
              null,

            payment_order_id:
              checkout.order_id,

            amount_cents:
              checkout.amount_cents,

            consent_id:
              acceptanceId,

            metadata: {
              catalogSlug:
                checkout.catalog_slug,
              immediateAccess,
              checkoutId:
                checkout.id,
            },

            updated_at:
              now.toISOString(),
          },
          {
            onConflict:
              "user_id,course_slug,plan_slug",
          }
        )
        .select("id")
        .single();

      if (
        enrollmentError ||
        !enrollment
      ) {
        throw enrollmentError ??
          new Error(
            "No se pudo crear la matr?cula."
          );
      }

      const {
        error: progressError,
      } = await supabase
        .from("onboarding_progress")
        .upsert(
          {
            enrollment_id:
              enrollment.id,

            user_id:
              userId,

            current_step:
              "billing",

            communications_video_completed_at:
              checkout.communications_video_completed_at,

            personal_data_completed_at:
              now.toISOString(),

            updated_at:
              now.toISOString(),
          },
          {
            onConflict:
              "enrollment_id",
          }
        );

      if (progressError) {
        throw progressError;
      }
    }

    /*
     * Asociamos tambi?n el pago
     * al usuario definitivo.
     */
    const { error: paymentLinkError } =
      await supabase
        .from("pagos")
        .update({
          user_id:
            userId,
        })
        .eq(
          "order_id",
          checkout.order_id
        );

    if (paymentLinkError) {
      throw paymentLinkError;
    }

    /*
     * Cerramos el pedido an├│nimo.
     */
    const {
      error: checkoutLinkError,
    } = await supabase
      .from("checkout_orders")
      .update({
        status: "linked",

        linked_user_id:
          userId,

        contract_acceptance_id:
          acceptanceId,

        linked_at:
          now.toISOString(),

        updated_at:
          now.toISOString(),
      })
      .eq(
        "id",
        checkout.id
      );

    if (checkoutLinkError) {
      throw checkoutLinkError;
    }

    /*
     * Compatibilidad con el control
     * de acceso que ya exist├¡a.
     */
    if (!isClassBono && immediateAccess) {
      const {
        error: legacyProfileError,
      } = await supabase
        .from("perfiles")
        .update({
          acceso: true,
        })
        .eq(
          "user_id",
          userId
        );

      if (legacyProfileError) {
        console.error(
          "No se pudo actualizar perfiles.acceso",
          legacyProfileError
        );
      }
    }

    /*
     * Confirmaci├│n de contrataci├│n y bienvenida.
     *
     * El correo nunca contiene la contrase├▒a.
     * Un fallo del proveedor de correo no bloquea
     * el alta ni deja la compra a medias.
     */
    const confirmationEmailSent =
      isClassBono &&
      classBookingIdForConfirmation
        ? await sendClassPurchaseConfirmation({
            email,
            fullName,
            orderId: checkout.order_id,
            amountCents:
              checkout.amount_cents,
            totalHours:
              Number(classHours || 0),
            expiresAt,
            bookingId:
              classBookingIdForConfirmation,
            academicLevel,
            subject,
            topic,
            bookPublisher,
            termsAccepted:
              checkout.terms_accepted,
            privacyAcknowledged:
              checkout.privacy_acknowledged,
            withdrawalAcknowledged:
              checkout.withdrawal_acknowledged,
            marketingConsent:
              checkout.marketing_consent,
          }).catch((emailError) => {
            console.error(
              "Error enviando confirmación de Clases Online",
              emailError
            );
            return false;
          })
        : await sendPurchaseConfirmation({
            email,
            fullName,
            orderId: checkout.order_id,
            planSlug: checkout.plan_slug,
            amountCents:
              checkout.amount_cents,
            accessMonths:
              checkout.access_months,
            immediateAccess,
            startsAt,
            expiresAt,
            termsAccepted:
              checkout.terms_accepted,
            privacyAcknowledged:
              checkout.privacy_acknowledged,
            withdrawalAcknowledged:
              checkout.withdrawal_acknowledged,
            marketingConsent:
              checkout.marketing_consent,
          }).catch((emailError) => {
            console.error(
              "Error enviando confirmación de contratación",
              emailError
            );
            return false;
          });

    createdUserId = null;

    return NextResponse.json({
      ok: true,
      newAccount,
      email,
      temporaryPassword,
      nextStep:
        isClassBono
          ? "classes"
          : "billing",
      confirmationEmailSent,
    });
  } catch (error) {
    /*
     * Si se cre├│ un usuario nuevo pero
     * fall├│ la vinculaci├│n posterior,
     * evitamos dejar una cuenta hu├®rfana.
     */
    if (createdUserId) {
      try {
        await supabase.auth.admin.deleteUser(
          createdUserId
        );
      } catch (cleanupError) {
        console.error(
          "No se pudo limpiar el usuario incompleto",
          cleanupError
        );
      }
    }

    console.error(
      "Error vinculando compra y alumno",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo completar el alta del alumno.",
      },
      { status: 500 }
    );
  }
}
