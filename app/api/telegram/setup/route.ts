import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !secretToken) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const webhook =
    "https://base12academy-web.vercel.app/api/telegram/webhook";
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhook,
      secret_token: secretToken,
      allowed_updates: ["message"],
    }),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok || !result.ok) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, webhook });
}
