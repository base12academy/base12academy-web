import { NextRequest, NextResponse } from "next/server";
import { authorizeTrainingRequest, isTrainingAuthorizationError } from "@/lib/training-access";
import type { TrainingSex } from "@/lib/training-config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const { data, error } = await supabase.from("training_profiles").select("sex").eq("user_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "profile_unavailable" }, { status: 500 });
  return NextResponse.json({ sex: data?.sex ?? null });
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const sex = String(body.sex || "") as TrainingSex;
  if (sex !== "male" && sex !== "female") return NextResponse.json({ error: "invalid_sex" }, { status: 400 });
  const now = new Date().toISOString();
  const { error } = await supabase.from("training_profiles").upsert({ user_id: user.id, sex, updated_at: now }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "profile_unavailable" }, { status: 500 });
  return NextResponse.json({ sex });
}
