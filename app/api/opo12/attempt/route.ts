import { NextRequest, NextResponse } from "next/server";
import { C11000_EXAM_PROFILE, OPO12_TRAINING_QUESTION_COUNTS, type Opo12AttemptMode } from "@/lib/opo12/config";
import { scoreOpo12Attempt, scoreOpo12Training } from "@/lib/opo12/scoring";
import { selectBalancedQuestions, selectReviewQuestions, selectTopicQuestions } from "@/lib/opo12/selection";
import { resolveSubscriptionState } from "@/lib/opo12/subscription";
import {
  authorizeOpo12Request,
  isOpo12AuthorizationError,
  opo12PublicProfile,
} from "@/lib/opo12/server";

const OPTIONS = new Set(["A", "B", "C", "D"]);
const MODES = new Set<Opo12AttemptMode>(["simulation", "topic", "review"]);
const TRAINING_COUNTS = new Set<number>(OPO12_TRAINING_QUESTION_COUNTS);

type QuestionRow = {
  id: string;
  block: "theory" | "practical";
  topic_code: string;
  prompt: string;
  options: unknown;
  correct_option: string;
  explanation: string;
  official_reference: string;
  reviewed_on: string;
};

async function ownedAttempt(supabase: ReturnType<typeof import("@/lib/supabase/server").getSupabase>, userId: string, attemptId: string) {
  return supabase.from("opo12_attempts")
    .select("id,user_id,opposition_id,exam_version_id,mode,configuration,status,started_at,deadline_at,submitted_at,score,score_snapshot")
    .eq("id", attemptId).eq("user_id", userId).maybeSingle();
}

function attemptPreparing(attemptId: string) {
  return NextResponse.json(
    { error: "attempt_preparing", attemptId, retryAfterSeconds: 1 },
    { status: 202, headers: { "Retry-After": "1", "Cache-Control": "no-store" } },
  );
}

async function publicAttemptPayload(supabase: ReturnType<typeof import("@/lib/supabase/server").getSupabase>, attempt: Record<string, unknown>, includeSolutions = false) {
  const attemptId = String(attempt.id);
  const [{ data: questions }, { data: answers }] = await Promise.all([
    supabase.from("opo12_attempt_questions").select("position,block,is_reserve,reserve_order,topic_code,prompt,options").eq("attempt_id", attemptId).order("position"),
    supabase.from("opo12_answers").select("position,selected_option,flagged,saved_at").eq("attempt_id", attemptId),
  ]);
  const payload: Record<string, unknown> = { attempt, questions: questions ?? [], answers: answers ?? [] };
  if (includeSolutions && (attempt.status === "submitted" || attempt.status === "expired")) {
    const { data: solutions } = await supabase.from("opo12_attempt_solutions")
      .select("position,correct_option,explanation,official_reference,reviewed_on,annulled")
      .eq("attempt_id", attemptId).order("position");
    payload.solutions = solutions ?? [];
  } else if (attempt.status === "submitted" || attempt.status === "expired") {
    payload.solutionsLocked = true;
  }
  return payload;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const attemptId = request.nextUrl.searchParams.get("id") ?? "";
  const { data: attempt, error } = await ownedAttempt(authorization.supabase, authorization.user.id, attemptId);
  if (error || !attempt) return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  if (attempt.status === "preparing") return attemptPreparing(String(attempt.id));
  let includeSolutions = false;
  if (attempt.status === "submitted" || attempt.status === "expired") {
    const now = new Date().toISOString();
    const [{ data: subscription }, { data: grant }] = await Promise.all([
      authorization.supabase.from("opo12_subscriptions").select("status,paid_through,access_blocked_at").eq("user_id", authorization.user.id).eq("opposition_id", attempt.opposition_id).maybeSingle(),
      authorization.supabase.from("opo12_access_grants").select("id").eq("user_id", authorization.user.id).eq("opposition_id", attempt.opposition_id).is("revoked_at", null).lte("starts_at", now).or(`ends_at.is.null,ends_at.gt.${now}`).limit(1).maybeSingle(),
    ]);
    const access = resolveSubscriptionState(subscription ? { status: subscription.status, paidThrough: subscription.paid_through } : null, new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date()), Boolean(grant));
    const protectedAttempt = Boolean(subscription?.access_blocked_at && new Date(attempt.started_at) <= new Date(subscription.access_blocked_at));
    includeSolutions = access.state === "active" || protectedAttempt;
  }
  return NextResponse.json(await publicAttemptPayload(authorization.supabase, attempt, includeSolutions));
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const oppositionSlug = String(body.oppositionSlug || opo12PublicProfile.slug);
  if (oppositionSlug !== opo12PublicProfile.slug) return NextResponse.json({ error: "invalid_opposition" }, { status: 400 });

  const mode = String(body.mode || "simulation") as Opo12AttemptMode;
  if (!MODES.has(mode)) return NextResponse.json({ error: "invalid_attempt_mode" }, { status: 400 });
  const questionCount = Number(body.questionCount ?? 20);
  if (mode !== "simulation" && !TRAINING_COUNTS.has(questionCount)) {
    return NextResponse.json({ error: "invalid_question_count" }, { status: 400 });
  }
  const topicCodes: string[] = Array.isArray(body.topicCodes)
    ? [...new Set(body.topicCodes.map(String).filter((code: string) => /^T(?:0[1-9]|[1-3][0-9]|4[0-2])$/.test(code)))]
      .map(String)
    : [];
  if (mode === "topic" && !topicCodes.length) {
    return NextResponse.json({ error: "topic_required" }, { status: 400 });
  }

  const { data: opposition } = await supabase.from("opo12_oppositions").select("id").eq("slug", oppositionSlug).eq("active", true).maybeSingle();
  if (!opposition) return NextResponse.json({ error: "opposition_unavailable" }, { status: 404 });
  const { data: examVersion } = await supabase.from("opo12_exam_versions").select("id,status").eq("opposition_id", opposition.id).in("status", ["ready", "auditing"]).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!examVersion || examVersion.status !== "ready") {
    return NextResponse.json({ error: "question_bank_auditing" }, { status: 409 });
  }

  const { data: openAttempt } = await supabase.from("opo12_attempts")
    .select("id,status")
    .eq("user_id", user.id)
    .eq("opposition_id", opposition.id)
    .in("status", ["preparing", "in_progress"])
    .maybeSingle();
  if (openAttempt) {
    if (openAttempt.status === "preparing") return attemptPreparing(String(openAttempt.id));
    const { data: attempt } = await ownedAttempt(supabase, user.id, openAttempt.id);
    return NextResponse.json(await publicAttemptPayload(supabase, attempt as Record<string, unknown>));
  }

  const { data: pool } = await supabase.from("opo12_question_versions")
    .select("id,block,topic_code,prompt,options,correct_option,explanation,official_reference,reviewed_on")
    .eq("opposition_id", opposition.id).eq("audit_status", "approved");
  const questionPool = (pool ?? []) as QuestionRow[];
  const theoryPool = questionPool.filter((question) => question.block === "theory");
  const practicalPool = questionPool.filter((question) => question.block === "practical");

  const { data: recentAttempts } = await supabase.from("opo12_attempts")
    .select("id,started_at,mode")
    .eq("user_id", user.id)
    .eq("opposition_id", opposition.id)
    .in("status", ["submitted", "expired"])
    .order("started_at", { ascending: false })
    .limit(120);
  const recentIds = (recentAttempts ?? []).map((attempt) => attempt.id);
  const exposure = new Map<string, { seenCount: number; lastSeenAt: string | null }>();
  const reviewQuestionIds = new Set<string>();
  if (recentIds.length) {
    const startedAt = new Map((recentAttempts ?? []).map((attempt) => [attempt.id, attempt.started_at]));
    const [{ data: pastQuestions }, { data: pastAnswers }, { data: pastSolutions }] = await Promise.all([
      supabase.from("opo12_attempt_questions").select("attempt_id,position,question_version_id,is_reserve").in("attempt_id", recentIds),
      supabase.from("opo12_answers").select("attempt_id,position,selected_option,flagged").in("attempt_id", recentIds),
      supabase.from("opo12_attempt_solutions").select("attempt_id,position,correct_option,annulled").in("attempt_id", recentIds),
    ]);
    const key = (attemptId: string, position: number) => `${attemptId}:${position}`;
    const answerByPosition = new Map((pastAnswers ?? []).map((answer) => [key(answer.attempt_id, answer.position), answer]));
    const solutionByPosition = new Map((pastSolutions ?? []).map((solution) => [key(solution.attempt_id, solution.position), solution]));
    for (const past of pastQuestions ?? []) {
      const previous = exposure.get(past.question_version_id) ?? { seenCount: 0, lastSeenAt: null };
      const seenAt = startedAt.get(past.attempt_id) ?? null;
      exposure.set(past.question_version_id, {
        seenCount: previous.seenCount + 1,
        lastSeenAt: !previous.lastSeenAt || (seenAt && seenAt > previous.lastSeenAt) ? seenAt : previous.lastSeenAt,
      });
      const answer = answerByPosition.get(key(past.attempt_id, past.position));
      const solution = solutionByPosition.get(key(past.attempt_id, past.position));
      if (!past.is_reserve && solution && !solution.annulled && (
        answer?.flagged || !answer?.selected_option || answer.selected_option !== solution.correct_option
      )) reviewQuestionIds.add(past.question_version_id);
    }
  }
  const withExposure = <T extends { id: string }>(questions: T[]) => questions.map((question) => ({
    ...question,
    ...(exposure.get(question.id) ?? { seenCount: 0, lastSeenAt: null }),
  }));

  let selected: QuestionRow[];
  let configuration: Record<string, unknown>;
  try {
    if (mode === "simulation") {
      if (theoryPool.length < 79 || practicalPool.length < 28) {
        return NextResponse.json({ error: "question_bank_not_ready", available: { theory: theoryPool.length, practical: practicalPool.length } }, { status: 409 });
      }
      const theorySelection = selectBalancedQuestions(withExposure(theoryPool), 79);
      const practicalSelection = selectBalancedQuestions(withExposure(practicalPool), 28);
      const byId = new Map(questionPool.map((question) => [question.id, question]));
      selected = [...theorySelection, ...practicalSelection].map((question) => byId.get(question.id) as QuestionRow);
      configuration = { officialFormat: true, questionCount: 107 };
    } else if (mode === "topic") {
      const topicSelection = selectTopicQuestions(withExposure(theoryPool), topicCodes, questionCount);
      const byId = new Map(questionPool.map((question) => [question.id, question]));
      selected = topicSelection.map((question) => byId.get(question.id) as QuestionRow);
      configuration = { topicCodes, questionCount: selected.length };
    } else {
      const reviewSelection = selectReviewQuestions(withExposure(questionPool), reviewQuestionIds, questionCount);
      const byId = new Map(questionPool.map((question) => [question.id, question]));
      selected = reviewSelection.map((question) => byId.get(question.id) as QuestionRow);
      configuration = { source: "wrong_blank_flagged", questionCount: selected.length };
    }
  } catch (error) {
    const code = error instanceof Error ? error.message : "question_bank_not_ready";
    const known = ["topic_required", "no_review_questions", "question_bank_not_ready"].includes(code) ? code : "question_bank_not_ready";
    return NextResponse.json({ error: known }, { status: 409 });
  }

  const { data: start, error: startError } = await supabase.rpc("opo12_start_or_resume", {
    p_user_id: user.id,
    p_opposition_slug: oppositionSlug,
    p_mode: mode,
    p_configuration: configuration,
    p_duration_minutes: mode === "simulation" ? C11000_EXAM_PROFILE.durationMinutes : null,
  });
  if (startError) {
    const known = ["subscription_required", "exam_not_ready", "opposition_unavailable", "invalid_attempt_mode"]
      .find((code) => startError.message.includes(code));
    return NextResponse.json({ error: known ?? "attempt_unavailable" }, { status: known ? 409 : 503 });
  }
  const reservation = start?.[0];
  if (!reservation) return NextResponse.json({ error: "attempt_unavailable" }, { status: 503 });
  const attemptId = String(reservation.attempt_id);

  if (!reservation.resumed) {
    try {
      const questionRows = selected.map((question, index) => {
        const theoryQuestion = mode === "simulation" && index < 79;
        const withinBlock = theoryQuestion ? index : index - 79;
        const isReserve = mode === "simulation" && (theoryQuestion ? withinBlock >= 75 : withinBlock >= 25);
        return {
          attempt_id: attemptId,
          position: index + 1,
          question_version_id: question.id,
          block: question.block,
          is_reserve: isReserve,
          reserve_order: isReserve ? (theoryQuestion ? withinBlock - 74 : withinBlock - 24) : null,
          topic_code: question.topic_code,
          prompt: question.prompt,
          options: question.options,
        };
      });
      const solutionRows = selected.map((question, index) => ({
        attempt_id: attemptId,
        position: index + 1,
        correct_option: question.correct_option,
        explanation: question.explanation,
        official_reference: question.official_reference,
        reviewed_on: question.reviewed_on,
      }));
      const { error: questionError } = await supabase.from("opo12_attempt_questions").insert(questionRows);
      if (questionError) throw questionError;
      const { error: solutionError } = await supabase.from("opo12_attempt_solutions").insert(solutionRows);
      if (solutionError) throw solutionError;
      const { data: readyAttempt, error: readyError } = await supabase.from("opo12_attempts")
        .update({ status: "in_progress" })
        .eq("id", attemptId)
        .eq("user_id", user.id)
        .eq("status", "preparing")
        .select("id")
        .single();
      if (readyError || !readyAttempt) throw readyError ?? new Error("attempt_not_prepared");
    } catch (error) {
      await supabase.from("opo12_attempts").delete().eq("id", attemptId).eq("user_id", user.id);
      console.error("No se pudo preparar el simulacro Opo12", error);
      return NextResponse.json({ error: "attempt_preparation_failed" }, { status: 503 });
    }
  }

  const { data: attempt } = await ownedAttempt(supabase, user.id, attemptId);
  if (attempt?.status === "preparing") return attemptPreparing(attemptId);
  return NextResponse.json(await publicAttemptPayload(supabase, attempt as Record<string, unknown>));
}

export async function PATCH(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const body = await request.json().catch(() => ({}));
  const attemptId = String(body.attemptId || "");
  const position = Number(body.position);
  const selectedOption = body.selectedOption == null || body.selectedOption === "" ? null : String(body.selectedOption).toUpperCase();
  if (!attemptId || !Number.isInteger(position) || position < 1 || (selectedOption && !OPTIONS.has(selectedOption))) {
    return NextResponse.json({ error: "invalid_answer" }, { status: 400 });
  }
  const { data: attempt } = await ownedAttempt(authorization.supabase, authorization.user.id, attemptId);
  if (!attempt || attempt.status !== "in_progress") return NextResponse.json({ error: "attempt_closed" }, { status: 409 });
  if (attempt.deadline_at && Date.now() >= new Date(attempt.deadline_at).getTime()) {
    return NextResponse.json({ error: "attempt_time_elapsed" }, { status: 409 });
  }
  const { error } = await authorization.supabase.from("opo12_answers").upsert({
    attempt_id: attemptId,
    position,
    selected_option: selectedOption,
    flagged: Boolean(body.flagged),
    saved_at: new Date().toISOString(),
  }, { onConflict: "attempt_id,position" });
  if (error) return NextResponse.json({ error: "answer_not_saved" }, { status: 503 });
  return NextResponse.json({ saved: true, savedAt: new Date().toISOString() });
}

export async function DELETE(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const body = await request.json().catch(() => ({}));
  const attemptId = String(body.attemptId || "");
  const { data: attempt } = await ownedAttempt(authorization.supabase, authorization.user.id, attemptId);
  if (!attempt) return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  if (attempt.status !== "in_progress") return NextResponse.json({ abandoned: false, status: attempt.status });
  const { error } = await authorization.supabase.from("opo12_attempts").update({
    status: "abandoned",
    submitted_at: new Date().toISOString(),
  }).eq("id", attemptId).eq("user_id", authorization.user.id).eq("status", "in_progress");
  if (error) return NextResponse.json({ error: "attempt_not_abandoned" }, { status: 503 });
  return NextResponse.json({ abandoned: true });
}

export async function PUT(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const attemptId = String(body.attemptId || "");
  const { data: attempt } = await ownedAttempt(supabase, user.id, attemptId);
  if (!attempt) return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  if (attempt.status === "preparing") return attemptPreparing(String(attempt.id));
  if (attempt.status !== "in_progress") return NextResponse.json(await publicAttemptPayload(supabase, attempt));

  const [{ data: questions }, { data: solutions }, { data: answers }] = await Promise.all([
    supabase.from("opo12_attempt_questions").select("position,block,is_reserve,reserve_order").eq("attempt_id", attemptId).order("position"),
    supabase.from("opo12_attempt_solutions").select("position,correct_option,annulled").eq("attempt_id", attemptId).order("position"),
    supabase.from("opo12_answers").select("position,selected_option").eq("attempt_id", attemptId),
  ]);
  if (!questions?.length || !solutions?.length) return NextResponse.json({ error: "attempt_incomplete" }, { status: 503 });
  const solutionByPosition = new Map(solutions.map((solution) => [solution.position, solution]));
  const answerMap = Object.fromEntries((answers ?? []).map((answer) => [String(answer.position), answer.selected_option]));
  const scoringQuestions = questions.map((question) => ({
    id: String(question.position),
    block: question.block,
    isReserve: question.is_reserve,
    reserveOrder: question.reserve_order,
    correctOption: solutionByPosition.get(question.position)?.correct_option ?? "",
    annulled: solutionByPosition.get(question.position)?.annulled ?? false,
  }));
  const scoreSnapshot = attempt.mode === "simulation"
    ? scoreOpo12Attempt(C11000_EXAM_PROFILE, scoringQuestions, answerMap)
    : scoreOpo12Training(scoringQuestions, answerMap);
  const scoreValue = "score" in scoreSnapshot ? scoreSnapshot.score : scoreSnapshot.percentage;
  const submittedAt = new Date();
  const submittedAfterDeadline = Boolean(attempt.deadline_at && submittedAt >= new Date(attempt.deadline_at));
  const elapsedSeconds = Math.max(0, Math.min(
    attempt.mode === "simulation" ? C11000_EXAM_PROFILE.durationMinutes * 60 : Number.MAX_SAFE_INTEGER,
    Math.round((submittedAt.getTime() - new Date(attempt.started_at).getTime()) / 1000),
  ));
  const { data: completed, error } = await supabase.from("opo12_attempts").update({
    status: submittedAfterDeadline ? "expired" : "submitted",
    submitted_at: submittedAt.toISOString(),
    elapsed_seconds: elapsedSeconds,
    score: scoreValue,
    score_snapshot: scoreSnapshot,
  }).eq("id", attemptId).eq("user_id", user.id).eq("status", "in_progress").select("*").single();
  if (error || !completed) return NextResponse.json({ error: "submission_failed" }, { status: 503 });
  const payload = await publicAttemptPayload(supabase, completed, true);
  const { data: subscription } = await supabase.from("opo12_subscriptions")
    .select("status,access_blocked_at")
    .eq("user_id", user.id)
    .eq("opposition_id", completed.opposition_id)
    .maybeSingle();
  const finishedAfterDefinitiveCancellation = Boolean(
    subscription?.status === "cancelled"
      && subscription.access_blocked_at
      && new Date(completed.started_at) <= new Date(subscription.access_blocked_at),
  );
  if (finishedAfterDefinitiveCancellation) {
    const { error: purgeError } = await supabase.from("opo12_attempts")
      .delete()
      .eq("id", attemptId)
      .eq("user_id", user.id);
    if (purgeError) {
      console.error("No se pudo purgar el intento finalizado tras la cancelacion", purgeError);
    } else {
      payload.purgedAfterDelivery = true;
    }
  }
  return NextResponse.json(payload);
}
