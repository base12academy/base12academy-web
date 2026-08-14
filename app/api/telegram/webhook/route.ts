import { createHmac, timingSafeEqual } from "crypto";
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
    chat: {
      id: number;
    };
    from?: TelegramUser;
  };
};

function getLinkSecret() {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("Falta TELEGRAM_WEBHOOK_SECRET");
  }

  return secret;
}

function getCommand(text: string) {
  return text
    .trim()
    .split(/\s+/)[0]
    .split("@")[0]
    .toLowerCase();
}

function getLinkedUserId(text: string) {
  if (getCommand(text) !== "/start") {
    return null;
  }

  const parts = text.trim().split(/\s+/);

  if (parts.length < 2) {
    return null;
  }

  const payload = parts[1];

  const match = payload.match(
    /^([a-fA-F0-9]{32})_([A-Za-z0-9_-]{22})$/
  );

  if (!match) {
    return null;
  }

  const compactUserId = match[1].toLowerCase();
  const receivedSignature = match[2];

  const expectedSignature = createHmac(
    "sha256",
    getLinkSecret()
  )
    .update(compactUserId)
    .digest("base64url")
    .slice(0, 22);

  const receivedBuffer = Buffer.from(
    receivedSignature,
    "utf8"
  );

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "utf8"
  );

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return [
    compactUserId.slice(0, 8),
    compactUserId.slice(8, 12),
    compactUserId.slice(12, 16),
    compactUserId.slice(16, 20),
    compactUserId.slice(20),
  ].join("-");
}

async function sendMessage(
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
    throw new Error(
      `Telegram sendMessage devolvió ${response.status}`
    );
  }
}

function replyFor(
  text: string,
  linked: boolean
) {
  const command = getCommand(text);

  if (command === "/start" && linked) {
    return (
      "<b>Tu cuenta está vinculada correctamente.</b>\n\n" +
      "Telegram ya está conectado con tu cuenta de alumno de Base12 Academy.\n\n" +
      "A partir de ahora podrás recibir aquí avisos relacionados con tu formación."
    );
  }

  if (command === "/start") {
    return (
      "<b>Bienvenido a Base12 Academy.</b>\n\n" +
      "Soy el Jefe de Estudios Base12.\n\n" +
      "Para vincular Telegram con tu matrícula, utiliza el botón «Vincular Telegram» dentro de tu onboarding en Base12 Academy."
    );
  }

  if (
    command === "/ayuda" ||
    command === "/help"
  ) {
    return (
      "<b>Ayuda Base12</b>\n\n" +
      "Para vincular tu cuenta, utiliza el enlace generado desde Base12 Academy.\n\n" +
      "Para una incidencia, escribe a base12academy+soporte@gmail.com."
    );
  }

  return (
    "He recibido tu mensaje. " +
    "Si necesitas ayuda, utiliza /ayuda."
  );
}

export async function POST(
  request: NextRequest
) {
  const expectedSecret =
    process.env.TELEGRAM_WEBHOOK_SECRET;

  const receivedSecret = request.headers.get(
    "x-telegram-bot-api-secret-token"
  );

  if (
    !expectedSecret ||
    receivedSecret !== expectedSecret
  ) {
    return NextResponse.json(
      { ok: false },
      { status: 401 }
    );
  }

  try {
    const update =
      (await request.json()) as TelegramUpdate;

    const message = update.message;

    if (!message?.from || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const user = message.from;
    const now = new Date().toISOString();

    let linkedUserId = getLinkedUserId(
      message.text
    );

    /*
     * La vinculación solo se permite
     * desde una conversación privada con el bot.
     */
    if (
      linkedUserId &&
      message.chat.id !== user.id
    ) {
      linkedUserId = null;
    }

    const supabase = getSupabase();

    /*
     * Si este alumno ya tenía otra cuenta
     * de Telegram vinculada, liberamos
     * la relación anterior.
     */
    if (linkedUserId) {
      const { error: previousLinkError } =
        await supabase
          .from("telegram_users")
          .update({
            user_id: null,
            linked_at: null,
            updated_at: now,
          })
          .eq("user_id", linkedUserId)
          .neq("telegram_user_id", user.id);

      if (previousLinkError) {
        throw previousLinkError;
      }
    }

    const telegramData = {
      telegram_user_id: user.id,
      chat_id: message.chat.id,
      username: user.username ?? null,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      language_code:
        user.language_code ?? null,
      last_message_at: new Date(
        message.date * 1000
      ).toISOString(),
      updated_at: now,
      ...(linkedUserId
        ? {
            user_id: linkedUserId,
            linked_at: now,
          }
        : {}),
    };

    const { error } = await supabase
      .from("telegram_users")
      .upsert(telegramData, {
        onConflict: "telegram_user_id",
      });

    if (error) {
      throw error;
    }

    await sendMessage(
      message.chat.id,
      replyFor(
        message.text,
        Boolean(linkedUserId)
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Error procesando el webhook de Telegram",
      error
    );

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}