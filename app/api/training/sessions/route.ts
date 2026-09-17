import { NextRequest, NextResponse } from "next/server";
import { authorizeTrainingRequest, isTrainingAuthorizationError } from "@/lib/training-access";
import { isTrainingTestSlug } from "@/lib/training-config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const test = String(request.nextUrl.searchParams.get("test") || "");
  let query = supabase.from("training_sessions").select("id,test_slug,exercises,completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(100);
  if (test) {
    if (!isTrainingTestSlug(test)) return NextResponse.json({ error: "invalid_test" }, { status: 400 });
    query = query.eq("test_slug", test);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "sessions_unavailable" }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const testSlug = String(body.test || "");
  const exercises = Array.isArray(body.exercises) ? body.exercises.slice(0, 12) : [];
  if (!isTrainingTestSlug(testSlug)) return NextResponse.json({ error: "invalid_test" }, { status: 400 });
  const { data, error } = await supabase.from("training_sessions").insert({ user_id: user.id, test_slug: testSlug, exercises }).select("id,test_slug,exercises,completed_at").single();
  if (error) return NextResponse.json({ error: "session_not_saved" }, { status: 500 });
  return NextResponse.json({ session: data });
}
