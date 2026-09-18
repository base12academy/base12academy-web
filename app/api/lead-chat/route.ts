import { NextResponse } from "next/server";
import { commercialAnswer } from "@/lib/commercial-assistant";

export async function POST(request: Request) {
  const body = (await request.json()) as { mensaje?: string; comunidad?: string };
  return NextResponse.json({
    respuesta: commercialAnswer(body.mensaje || "", body.comunidad || ""),
  });
}
