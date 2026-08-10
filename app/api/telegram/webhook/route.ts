import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

type TelegramUpdate = {
  message?: {
    date: number;
    text?: string;
    chat: { id: number };
    from?: TelegramUser;
  };
};

async function sendMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Falta TELEGRAM_BOT_TOKEN");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Telegram sendMessage devolvió ${response.status}`);
  }
}

function replyFor(text: string) {
  const command = text.trim().split(/\s+/)[0].toLowerCase();

  if (command === "/start") {
    return (
      "<b>Bienvenido a Base12 Academy.</b>\n\n" +
      "Soy el Jefe de Estudios Base12. Te avisaré sobre el acceso, el progreso y las novedades académicas de tu formación.\n\n" +
      "Cuando tu matrícula esté vinculada, podrás consultar aquí tus avisos y próximos pasos."
    );
  }

  if (command === "/ayuda" || command === "/help") {
    return (
      "<b>Ayuda Base12</b>\n\n" +
      "Usa /start para iniciar. Para una incidencia, escribe a base12academy+soporte@gmail.com."
    );
  }

  return "He recibido tu mensaje. Para comenzar usa /start. Si necesitas ayuda, utiliza /ayuda.";
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get(
    "x-telegram-bot-api-secret-token"
  );

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    const message = update.message;

    if (!message?.from || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const user = message.from;
    const { error } = await getSupabase().from("telegram_users").upsert(
      {
        telegram_user_id: user.id,
        chat_id: message.chat.id,
        username: user.username ?? null,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        language_code: user.language_code ?? null,
        last_message_at: new Date(message.date * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "telegram_user_id" }
    );

    if (error) {
      console.error("No se pudo registrar el usuario de Telegram", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    await sendMessage(message.chat.id, replyFor(message.text));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error procesando el webhook de Telegram", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

