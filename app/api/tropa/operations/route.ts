import { NextRequest, NextResponse } from "next/server";
import { authorizeTropaRequest, isTropaAuthorizationError } from "@/lib/tropa-access";
import { tropaPlanAccess, type TropaPlanSlug } from "@/lib/tropa-config";

const validAnswers = new Set(["A", "B", "C", "D"]);
const planOrder: TropaPlanSlug[] = ["esencial", "operativa", "integral"];

export async function GET(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, access } = authorization;
  const formCode = request.nextUrl.searchParams.get("form");
  if (!formCode) {
    const allowedAccess = access.planSlug
      ? planOrder.filter((plan) => tropaPlanAccess[plan].rank <= tropaPlanAccess[access.planSlug!].rank)
      : planOrder;
    const formSelection = "form_code, usage_type, difficulty, variant, operation_code, sea_trial_code, destination_name, stage";
    const [trials, operations, formsFirstPage, formsSecondPage] = await Promise.all([
      supabase.from("trop_sea_trials").select("trial_code, trial_name, access_min, stage, difficulty, variant, function_text").eq("active", true).order("trial_code"),
      supabase.from("trop_operations").select("operation_code, difficulty, variant, questions_total, factors_total, strict_time, destination").eq("active", true).order("operation_code"),
      supabase
        .from("trop_operation_form_questions")
        .select(formSelection)
        .in("aptitude_slug", access.aptitudeSlugs)
        .or(`access_min.is.null,access_min.in.(${allowedAccess.join(",")})`)
        .order("form_code")
        .range(0, 999),
      supabase
        .from("trop_operation_form_questions")
        .select(formSelection)
        .in("aptitude_slug", access.aptitudeSlugs)
        .or(`access_min.is.null,access_min.in.(${allowedAccess.join(",")})`)
        .order("form_code")
        .range(1000, 1999),
    ]);
    const error = trials.error || operations.error || formsFirstPage.error || formsSecondPage.error;
    if (error) return NextResponse.json({ error: "operations_unavailable" }, { status: 503 });
    const allowedTrials = access.planSlug
      ? (trials.data ?? []).filter((trial) => tropaPlanAccess[access.planSlug!].rank >= tropaPlanAccess[trial.access_min as TropaPlanSlug].rank)
      : trials.data ?? [];
    const forms = Array.from(
      new Map([...(formsFirstPage.data ?? []), ...(formsSecondPage.data ?? [])].map((form) => [form.form_code, form])).values(),
    );
    return NextResponse.json({ seaTrials: allowedTrials, operations: operations.data ?? [], forms });
  }
  if (!/^[A-Z0-9_-]{2,40}$/.test(formCode)) {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }
  const allowedAccess = access.planSlug
    ? planOrder.filter((plan) => tropaPlanAccess[plan].rank <= tropaPlanAccess[access.planSlug!].rank)
    : planOrder;
  const { data, error } = await supabase
    .from("trop_operation_form_questions")
    .select("form_code, usage_type, aptitude_slug, factor_position, question_id, level, motor_code, target_time_seconds, prompt, options, stimulus")
    .eq("form_code", formCode)
    .in("aptitude_slug", access.aptitudeSlugs)
    .or(`access_min.is.null,access_min.in.(${allowedAccess.join(",")})`)
    .order("aptitude_slug")
    .order("factor_position");
  if (error) return NextResponse.json({ error: "operation_unavailable" }, { status: 503 });
  if (!data?.length) return NextResponse.json({ error: "operation_not_found" }, { status: 404 });
  return NextResponse.json({ formCode, questions: data });
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, user, access } = authorization;
  const body = await request.json().catch(() => ({}));
  const formCode = String(body.formCode || "").trim();
  const answers = body.answers && typeof body.answers === "object" ? body.answers as Record<string, string> : {};
  if (!/^[A-Z0-9_-]{2,40}$/.test(formCode) || Object.values(answers).some((value) => !validAnswers.has(String(value).toUpperCase()))) {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }
  const allowedAccess = access.planSlug
    ? planOrder.filter((plan) => tropaPlanAccess[plan].rank <= tropaPlanAccess[access.planSlug!].rank)
    : planOrder;
  const { data: questions, error } = await supabase
    .from("trop_operation_form_questions")
    .select("question_id, usage_type, aptitude_slug, correct_option, explanation")
    .eq("form_code", formCode)
    .in("aptitude_slug", access.aptitudeSlugs)
    .or(`access_min.is.null,access_min.in.(${allowedAccess.join(",")})`);
  if (error || !questions?.length) return NextResponse.json({ error: "operation_not_found" }, { status: 404 });
  const results = questions.map((question) => ({
    questionId: question.question_id,
    correctOption: question.correct_option,
    selectedOption: String(answers[question.question_id] || "").toUpperCase() || null,
    correct: String(answers[question.question_id] || "").toUpperCase() === question.correct_option,
    explanation: question.explanation,
  }));
  const score = results.filter((item) => item.correct).length;
  const completedAt = new Date().toISOString();
  const { error: attemptError } = await supabase.from("trop_operation_attempts").insert({
    user_id: user.id,
    form_code: formCode,
    usage_type: questions[0].usage_type,
    aptitude_scope: access.aptitudeSlugs,
    answers,
    score,
    questions_total: results.length,
    completed_at: completedAt,
  });
  if (attemptError) return NextResponse.json({ error: "progress_not_saved" }, { status: 503 });
  return NextResponse.json({ formCode, score, total: results.length, completedAt, results });
}
