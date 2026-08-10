import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  const authorization = request.headers.get("authorization");

  if (!token || !secretToken) {
    return NextResponse.json(
      { ok: false, error: "Faltan variables de Telegram" },
      { status: 500 }
    );
  }

  if (authorization !== `Bearer ${secretToken}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const webhookUrl = new URL("/api/telegram/webhook", request.url).toString();
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secretToken,
      allowed_updates: ["message"],
    }),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok || !result.ok) {
    console.error("No se pudo configurar el webhook de Telegram", result);
    return NextResponse.json(
      { ok: false, error: "Telegram rechazó la configuración" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    bot: process.env.TELEGRAM_BOT_USERNAME ?? "TutorBase12Bot",
    webhook: webhookUrl,
  });
}

