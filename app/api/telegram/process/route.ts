import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TelegramNotification = {
  id: string;
  user_id: string;
  source: string;
  notification_type: string;
  title: string | null;
  message: string;
  scheduled_for: string;
};

function getSourceLabel(
  source: TelegramNotification["source"]
) {
  switch (source) {
    case "fernando":
      return "Fernando";
    case "secretaria":
      return "Secretaría";
    case "jefatura":
      return "Jefatura de Estudios";
    default:
      return "Base12 Academy";
  }
}

function formatTelegramMessage(
  notification: TelegramNotification
) {
  const sourceLabel = getSourceLabel(
    notification.source
  );

  const title = notification.title
    ? `<b>${notification.title}</b>\n\n`
    : "";

  return (
    `<b>${sourceLabel} · Base12 Academy</b>\n\n` +
    title +
    notification.message
  );
}

async function sendTelegramMessage(
  chatId: number,
  text: string
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("Falta TELEGRAM_BOT_TOKEN");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Telegram devolvió ${response.status}: ${body}`
    );
  }
}

export async function POST(
  request: NextRequest
) {
  const expectedSecret =
    process.env.CRON_SECRET;

  const receivedAuthorization =
    request.headers.get("authorization");

  if (
    !expectedSecret ||
    receivedAuthorization !==
      `Bearer ${expectedSecret}`
  ) {
    return NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  const supabase = getSupabase();
  const now = new Date().toISOString();

  try {
    const {
      data: notifications,
      error: notificationsError,
    } = await supabase
      .from("telegram_notifications")
      .select(
  "id,user_id,source,notification_type,title,message,scheduled_for"
)
      .eq("status", "pending")
      .lte("scheduled_for", now)
      .order("scheduled_for", {
        ascending: true,
      })
      .limit(50);

    if (notificationsError) {
      throw notificationsError;
    }

    if (!notifications?.length) {
      return NextResponse.json({
        ok: true,
        processed: 0,
        sent: 0,
        failed: 0,
      });
    }

    let sent = 0;
    let failed = 0;

    for (const rawNotification of notifications) {
      const notification =
        rawNotification as TelegramNotification;

      try {
        const { error: processingError } =
          await supabase
            .from("telegram_notifications")
            .update({
              status: "processing",
              updated_at: new Date().toISOString(),
            })
            .eq("id", notification.id)
            .eq("status", "pending");

        if (processingError) {
          throw processingError;
        }

        const {
          data: telegramUser,
          error: telegramUserError,
        } = await supabase
          .from("telegram_users")
          .select(
            "chat_id, notifications_enabled"
          )
          .eq("user_id", notification.user_id)
          .maybeSingle();

        if (telegramUserError) {
          throw telegramUserError;
        }

        if (!telegramUser) {
          throw new Error(
            "El usuario no tiene Telegram vinculado"
          );
        }

        if (!telegramUser.notifications_enabled) {
          throw new Error(
            "El usuario tiene las notificaciones desactivadas"
          );
        }

        await sendTelegramMessage(
          telegramUser.chat_id,
          formatTelegramMessage(notification)
        );

        const sentAt = new Date().toISOString();

        const { error: sentError } =
          await supabase
            .from("telegram_notifications")
            .update({
              status: "sent",
              sent_at: sentAt,
              failed_at: null,
              error_message: null,
              updated_at: sentAt,
            })
            .eq("id", notification.id);

        if (sentError) {
          throw sentError;
        }

        sent++;
      } catch (error) {
        failed++;

        const message =
          error instanceof Error
            ? error.message
            : "Error desconocido";

        const failedAt =
          new Date().toISOString();

        const { error: failedUpdateError } =
          await supabase
            .from("telegram_notifications")
            .update({
              status: "failed",
              failed_at: failedAt,
              error_message: message.slice(
                0,
                1000
              ),
              updated_at: failedAt,
            })
            .eq("id", notification.id);

        if (failedUpdateError) {
          console.error(
            "No se pudo registrar el fallo de la notificación",
            failedUpdateError
          );
        }
      }
    }

    return NextResponse.json({
      ok: true,
      processed: notifications.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error(
      "Error procesando notificaciones de Telegram",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudieron procesar las notificaciones de Telegram.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest
) {
  return POST(request);
}