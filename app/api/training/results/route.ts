import { NextRequest, NextResponse } from "next/server";
import { authorizeTrainingRequest, isTrainingAuthorizationError } from "@/lib/training-access";
import { isTrainingTestSlug } from "@/lib/training-config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const test = String(request.nextUrl.searchParams.get("test") || "");
  let query = supabase.from("training_results").select("id,test_slug,result_value,perceived_effort,performed_at").eq("user_id", user.id).order("performed_at", { ascending: false }).limit(100);
  if (test) {
    if (!isTrainingTestSlug(test)) return NextResponse.json({ error: "invalid_test" }, { status: 400 });
    query = query.eq("test_slug", test);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "results_unavailable" }, { status: 500 });
  return NextResponse.json({ results: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const testSlug = String(body.test || "");
  const resultValue = Number(body.value);
  const effort = body.effort ? String(body.effort) : null;
  if (!isTrainingTestSlug(testSlug) || !Number.isFinite(resultValue) || resultValue <= 0) {
    return NextResponse.json({ error: "invalid_result" }, { status: 400 });
  }
  if (effort && !["easy", "normal", "hard", "max"].includes(effort)) {
    return NextResponse.json({ error: "invalid_effort" }, { status: 400 });
  }
  const { data, error } = await supabase.from("training_results").insert({ user_id: user.id, test_slug: testSlug, result_value: resultValue, perceived_effort: effort }).select("id,test_slug,result_value,perceived_effort,performed_at").single();
  if (error) return NextResponse.json({ error: "result_not_saved" }, { status: 500 });
  return NextResponse.json({ result: data });
}
