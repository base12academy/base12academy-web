import { NextRequest, NextResponse } from "next/server";
import { authorizeOpo12Request, isOpo12AuthorizationError, opo12PublicProfile } from "@/lib/opo12/server";

const CATEGORIES = new Set(["question", "technical", "subscription", "other"]);

export async function POST(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const category = String(body.category || "");
  const description = String(body.description || "").trim();
  const attemptId = body.attemptId ? String(body.attemptId) : null;
  const position = body.position == null ? null : Number(body.position);
  if (!CATEGORIES.has(category) || description.length < 10 || description.length > 3000 || (position != null && (!Number.isInteger(position) || position < 1))) {
    return NextResponse.json({ error: "invalid_incident" }, { status: 400 });
  }
  const { data: opposition } = await supabase.from("opo12_oppositions").select("id").eq("slug", opo12PublicProfile.slug).maybeSingle();
  if (!opposition) return NextResponse.json({ error: "opposition_unavailable" }, { status: 503 });
  if (attemptId) {
    const { data: attempt } = await supabase.from("opo12_attempts").select("id").eq("id", attemptId).eq("user_id", user.id).eq("opposition_id", opposition.id).maybeSingle();
    if (!attempt) return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  }
  const { data, error } = await supabase.from("opo12_incidents").insert({
    user_id: user.id,
    opposition_id: opposition.id,
    attempt_id: attemptId,
    position,
    category,
    description,
    status: category === "question" ? "automatic_review" : "received",
    metadata: {
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      app_version: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    },
  }).select("id,status,created_at").single();
  if (error) return NextResponse.json({ error: "incident_not_saved" }, { status: 503 });
  return NextResponse.json({ incident: data }, { status: 201 });
}
