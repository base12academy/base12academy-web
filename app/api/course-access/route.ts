import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator, isPublicOfimaticaLesson } from "@/lib/course-access";

const PLAN_MAX_GROUP: Record<string, number> = {
  esencial: 6,
  estandar: 9,
  standard: 9,
  premium: 11,
};

export async function GET(req: NextRequest) {
  const lessonId = String(req.nextUrl.searchParams.get("lesson") || "G01_V01").toUpperCase();
  const courseSlug = String(req.nextUrl.searchParams.get("course") || "ofimatica").toLowerCase();
  const groupNumber = Number(lessonId.slice(1, 3));

  const publicLesson = courseSlug === "ofimatica" ? isPublicOfimaticaLesson(lessonId) : lessonId === "T01";
  if (publicLesson) {
    return NextResponse.json({ allowed: true, access: "public_preview", maxGroup: 1 });
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  if (isCourseAdministrator(data.user.email)) {
    return NextResponse.json({ allowed: true, access: "administrator", maxGroup: courseSlug === "ofimatica" ? 11 : 42 });
  }

  const now = new Date().toISOString();
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("plan_slug,expires_at")
    .eq("user_id", data.user.id)
    .eq("course_slug", courseSlug)
    .eq("status", "active")
    .lte("starts_at", now);

  const valid = (enrollments || []).filter((item) => !item.expires_at || item.expires_at >= now);
  const maxGroup = courseSlug === "ofimatica"
    ? valid.reduce((max, item) => Math.max(max, PLAN_MAX_GROUP[item.plan_slug] || 0), 0)
    : valid.length ? 42 : 0;
  return NextResponse.json({
    allowed: maxGroup >= groupNumber,
    access: maxGroup >= groupNumber ? "enrollment" : "subscription_required",
    maxGroup,
  }, { status: maxGroup >= groupNumber ? 200 : 403 });
}
