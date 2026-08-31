import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import {
  authorizeTropaRequest,
  canAccessTropaAptitude,
  isTropaAuthorizationError,
} from "@/lib/tropa-access";
import { isTropaAptitudeSlug, tropaAptitudes } from "@/lib/tropa-config";

export async function POST(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, user, access } = authorization;
  const body = await request.json().catch(() => ({}));
  const aptitudeSlug = String(body.aptitude || "");
  const role = body.role === "fernando" ? "fernando" : "rocio";
  const message = String(body.message || "").trim().slice(0, 2_000);
  if (!isTropaAptitudeSlug(aptitudeSlug) || !message) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!canAccessTropaAptitude(access, aptitudeSlug)) {
    return NextResponse.json({ error: "aptitude_not_allowed" }, { status: 403 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "tutor_unavailable" }, { status: 503 });
  }

  const aptitude = tropaAptitudes.find((item) => item.slug === aptitudeSlug)!;
  const [contentResult, progressResult] = await Promise.all([
    supabase
      .from("trop_microtemarios")
      .select("motor_code, game_name, correct_sequence, main_tip")
      .in("motor_code", [...aptitude.motors])
      .eq("active", true),
    supabase
      .from("trop_question_attempts")
      .select("motor_code, family_id, correct, error_code, answered_at")
      .eq("user_id", user.id)
      .eq("aptitude_slug", aptitudeSlug)
      .order("answered_at", { ascending: false })
      .limit(20),
  ]);
  const context = JSON.stringify({
    aptitude: aptitude.name,
    microtemarios: contentResult.data ?? [],
    recentProgress: progressResult.data ?? [],
  });
  const identity = role === "rocio"
    ? "Eres Rocío, profesora IA de Base12 Academy. Enseñas el procedimiento de la aptitud con ejemplos breves y feedback pedagógico."
    : "Eres Fernando, tutor IA de Base12 Academy. Ayudas a interpretar el progreso, priorizar errores y decidir la siguiente sesión de estudio.";

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `${identity}\nUsa únicamente el contexto TROP proporcionado. No inventes resultados, preguntas, imágenes ni progreso. No reveles claves de respuesta de preguntas no contestadas. Responde en español claro y conciso.\nContexto: ${context}`,
        },
        { role: "user", content: message },
      ],
    });
    return NextResponse.json({ role, answer: response.output_text });
  } catch (error) {
    console.error("No se pudo consultar el tutor IA TROP", error);
    return NextResponse.json({ error: "tutor_unavailable" }, { status: 503 });
  }
}
