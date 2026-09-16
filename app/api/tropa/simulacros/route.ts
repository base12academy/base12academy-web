import { NextRequest, NextResponse } from "next/server";
import { authorizeTropaRequest, isTropaAuthorizationError } from "@/lib/tropa-access";

const validAnswers = new Set(["A", "B", "C", "D"]);

export async function GET(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, access } = authorization;
  const simulacroId = request.nextUrl.searchParams.get("id");
  if (!simulacroId) {
    const { data, error } = await supabase
      .from("trop_simulacros")
      .select("simulacro_id, display_order, title, questions_total")
      .eq("active", true)
      .order("display_order");
    if (error) return NextResponse.json({ error: "simulacros_unavailable" }, { status: 503 });
    return NextResponse.json({ simulacros: data ?? [] });
  }

  const { data, error } = await supabase
    .from("trop_simulacro_questions")
    .select("simulacro_id, aptitude_slug, factor_position, question_id, level, motor_code, target_time_seconds, prompt, options, stimulus")
    .eq("simulacro_id", simulacroId)
    .in("aptitude_slug", access.aptitudeSlugs)
    .order("aptitude_slug")
    .order("factor_position");
  if (error) return NextResponse.json({ error: "simulacro_unavailable" }, { status: 503 });
  if (!data?.length) return NextResponse.json({ error: "simulacro_not_found" }, { status: 404 });
  return NextResponse.json({ simulacroId, questions: data });
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, user, access } = authorization;
  const body = await request.json().catch(() => ({}));
  const simulacroId = String(body.simulacroId || "").trim();
  const answers = body.answers && typeof body.answers === "object"
    ? body.answers as Record<string, string>
    : {};
  if (!simulacroId || Object.values(answers).some((answer) => !validAnswers.has(String(answer).toUpperCase()))) {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }

  const { data: questions, error } = await supabase
    .from("trop_simulacro_questions")
    .select("question_id, aptitude_slug, correct_option, explanation")
    .eq("simulacro_id", simulacroId)
    .in("aptitude_slug", access.aptitudeSlugs);
  if (error || !questions?.length) {
    return NextResponse.json({ error: "simulacro_not_found" }, { status: 404 });
  }
  const results = questions.map((question) => ({
    questionId: question.question_id,
    selectedOption: String(answers[question.question_id] || "").toUpperCase() || null,
    correctOption: question.correct_option,
    correct: String(answers[question.question_id] || "").toUpperCase() === question.correct_option,
    explanation: question.explanation,
  }));
  const score = results.filter((item) => item.correct).length;
  const completedAt = new Date().toISOString();
  const { error: attemptError } = await supabase.from("trop_simulacro_attempts").insert({
    user_id: user.id,
    simulacro_id: simulacroId,
    aptitude_scope: access.aptitudeSlugs,
    answers,
    score,
    questions_total: results.length,
    completed_at: completedAt,
  });
  if (attemptError) {
    console.error("No se pudo guardar el simulacro TROP", attemptError);
    return NextResponse.json({ error: "progress_not_saved" }, { status: 503 });
  }
  return NextResponse.json({ simulacroId, score, total: results.length, completedAt, results });
}
