import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7);
}

function createTelegramPayload(userId: string) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("Falta TELEGRAM_WEBHOOK_SECRET");
  }

  const compactUserId = userId.replace(/-/g, "").toLowerCase();

  const signature = createHmac("sha256", secret)
    .update(compactUserId)
    .digest("base64url")
    .slice(0, 22);

  return `${compactUserId}_${signature}`;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const supabase = getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesión no válida" },
        { status: 401 }
      );
    }

    const {
      data: telegramUser,
      error: telegramError,
    } = await supabase
      .from("telegram_users")
      .select("telegram_user_id, username, linked_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (telegramError) {
      throw telegramError;
    }

    if (telegramUser) {
      return NextResponse.json({
        linked: true,
        telegram: telegramUser,
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new Error("Falta TELEGRAM_BOT_TOKEN");
    }

    const botResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`,
      {
        cache: "no-store",
      }
    );

    const botData = await botResponse.json();

    if (
      !botResponse.ok ||
      !botData.ok ||
      !botData.result?.username
    ) {
      throw new Error(
        "No se pudo obtener el usuario del bot de Telegram"
      );
    }

    const payload = createTelegramPayload(user.id);

    const url =
      `https://t.me/${botData.result.username}` +
      `?start=${payload}`;

    return NextResponse.json({
      linked: false,
      url,
    });
  } catch (error) {
    console.error(
      "Error creando enlace de Telegram",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo preparar la vinculación con Telegram.",
      },
      { status: 500 }
    );
  }
}