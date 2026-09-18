import { NextRequest, NextResponse } from "next/server";
import {
  authorizeTropaRequest,
  canAccessTropaQuestion,
  isTropaAuthorizationError,
} from "@/lib/tropa-access";
import { TROP_COURSE_SLUG } from "@/lib/tropa-config";

const validAnswers = new Set(["A", "B", "C", "D"]);

export async function POST(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, user, access } = authorization;
  const body = await request.json().catch(() => ({}));
  const questionId = String(body.questionId || "").trim();
  const selectedOption = String(body.selectedOption || "").trim().toUpperCase();
  const responseMs = Math.max(0, Math.min(3_600_000, Number(body.responseMs || 0)));
  if (!questionId || !validAnswers.has(selectedOption)) {
    return NextResponse.json({ error: "invalid_answer" }, { status: 400 });
  }

  const { data: question, error } = await supabase
    .from("trop_questions")
    .select("question_id, aptitude_slug, motor_code, family_id, level, access_min, correct_option, explanation, feedback, error_codes")
    .eq("question_id", questionId)
    .eq("active", true)
    .maybeSingle();
  if (error || !question) {
    return NextResponse.json({ error: "question_not_found" }, { status: 404 });
  }
  if (!canAccessTropaQuestion(access, question)) {
    return NextResponse.json({ error: "question_not_allowed" }, { status: 403 });
  }

  const correct = selectedOption === question.correct_option;
  const feedback = question.feedback && typeof question.feedback === "object"
    ? String((question.feedback as Record<string, unknown>)[selectedOption] || "")
    : "";
  const errorCode = question.error_codes && typeof question.error_codes === "object"
    ? (question.error_codes as Record<string, unknown>)[selectedOption]
    : null;
  const answeredAt = new Date().toISOString();
  const { error: attemptError } = await supabase.from("trop_question_attempts").insert({
    user_id: user.id,
    question_id: question.question_id,
    aptitude_slug: question.aptitude_slug,
    motor_code: question.motor_code,
    family_id: question.family_id,
    level: question.level,
    selected_option: selectedOption,
    correct,
    error_code: errorCode ? String(errorCode) : null,
    response_ms: Math.round(responseMs),
    answered_at: answeredAt,
  });
  if (attemptError) {
    console.error("No se pudo guardar el intento TROP", attemptError);
    return NextResponse.json({ error: "progress_not_saved" }, { status: 503 });
  }

  const enrollmentId=access.enrollmentIds[0]||null;
  if(enrollmentId){
    const {error:learningError}=await supabase.from("course_learning_events").insert({
      user_id:user.id,
      enrollment_id:enrollmentId,
      course_slug:TROP_COURSE_SLUG,
      content_id:question.question_id,
      event_type:"assessment_submitted",
      progress_percent:correct?100:0,
      metadata:{activityType:"tropa_question",aptitude:question.aptitude_slug,motor:question.motor_code,family:question.family_id,level:question.level,errorCode:errorCode?String(errorCode):null,responseMs:Math.round(responseMs)},
      occurred_at:answeredAt,
    });
    if(learningError)console.error("No se pudo registrar la respuesta TROP en el progreso común",learningError);
  }

  return NextResponse.json({
    correct,
    correctOption: question.correct_option,
    explanation: question.explanation,
    feedback,
    errorCode: errorCode || null,
    answeredAt,
  });
}
