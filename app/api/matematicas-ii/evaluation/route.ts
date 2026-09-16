import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getRocioQuestions, getShortQuestions, hasEvaluationUnit } from "@/lib/matematicas-ii/evaluation.server";

const PREVIEW_UNIT = "T01";

async function hasAnyMatematicasIIAccess(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { authenticated: false, allowed: false, administrator: false };

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { authenticated: false, allowed: false, administrator: false };

  if (isCourseAdministrator(data.user.email)) {
    return { authenticated: true, allowed: true, administrator: true };
  }

  const now = new Date().toISOString();
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("plan_slug,expires_at")
    .eq("user_id", data.user.id)
    .eq("course_slug", "matematicas-ii")
    .eq("status", "active")
    .lte("starts_at", now);

  if (enrollmentError) return { authenticated: true, allowed: false, administrator: false, error: true };

  const allowed = (enrollments || []).some((item) => !item.expires_at || item.expires_at >= now);
  return { authenticated: true, allowed, administrator: false };
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const unit = req.nextUrl.searchParams.get("unit") || "";

  if ((type !== "rocio" && type !== "short") || !hasEvaluationUnit(unit)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const access = await hasAnyMatematicasIIAccess(req);
  if ("error" in access && access.error) {
    return NextResponse.json({ error: "access_check_failed" }, { status: 500 });
  }

  const preview = unit === PREVIEW_UNIT;
  if (!preview && !access.allowed) {
    return NextResponse.json({ error: access.authenticated ? "matriculation_required" : "authentication_required" }, { status: access.authenticated ? 403 : 401 });
  }

  const items = type === "rocio" ? getRocioQuestions(unit) : getShortQuestions(unit);
  return NextResponse.json({
    type,
    unit,
    preview,
    count: items.length,
    items,
  });
}
