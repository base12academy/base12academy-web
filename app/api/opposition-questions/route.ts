import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

async function context(req: NextRequest, courseSlug: string) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser(token);
  if (!data.user) return null;
  const now = new Date().toISOString();
  const { data: enrollment } = await supabase.from("course_enrollments").select("id").eq("user_id", data.user.id).eq("course_slug", courseSlug).eq("status", "active").lte("starts_at", now).or(`expires_at.is.null,expires_at.gte.${now}`).limit(1).maybeSingle();
  return enrollment ? { supabase, user: data.user, enrollment } : null;
}

export async function GET(req: NextRequest) {
  const courseSlug = String(req.nextUrl.searchParams.get("course") || "");
  const themeId = String(req.nextUrl.searchParams.get("theme") || "");
  const ctx = await context(req, courseSlug);
  if (!ctx) return NextResponse.json({ error: "subscription_required" }, { status: 403 });
  const { data } = await ctx.supabase.from("opposition_open_questions").select("id,question,status,answer,created_at,answered_at").eq("user_id", ctx.user.id).eq("course_slug", courseSlug).eq("theme_id", themeId).order("created_at", { ascending: false });
  return NextResponse.json({ questions: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const courseSlug = String(body.courseSlug || ""); const themeId = String(body.themeId || ""); const question = String(body.question || "").trim();
  if (!courseSlug || !themeId || question.length < 8 || question.length > 1500) return NextResponse.json({ error: "invalid_question" }, { status: 400 });
  const ctx = await context(req, courseSlug);
  if (!ctx) return NextResponse.json({ error: "subscription_required" }, { status: 403 });
  const { data, error } = await ctx.supabase.from("opposition_open_questions").insert({ user_id: ctx.user.id, enrollment_id: ctx.enrollment.id, course_slug: courseSlug, theme_id: themeId, question }).select("id,question,status,created_at").single();
  if (error) return NextResponse.json({ error: "question_not_saved" }, { status: 500 });
  return NextResponse.json({ question: data });
}
