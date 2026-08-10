import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !secretToken) {
    const missing = [
      !token ? "TELEGRAM_BOT_TOKEN" : null,
      !secretToken ? "TELEGRAM_WEBHOOK_SECRET" : null,
    ].filter(Boolean);
    return NextResponse.json(
      { ok: false, error: "Faltan variables de Telegram", missing },
      { status: 500 }
    );
  }

  const webhookUrl =
    "https://base12academy-web.vercel.app/api/telegram/webhook";
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
