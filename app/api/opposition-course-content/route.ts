import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import administrativo from "@/lib/administrativo-ja-content.json";
import auxiliar from "@/lib/auxiliar-administrativo-ja-content.json";

const courses = { "administrativo-ja": administrativo, "auxiliar-administrativo-ja": auxiliar } as const;

export async function GET(req: NextRequest) {
  const courseSlug = String(req.nextUrl.searchParams.get("course") || "").toLowerCase();
  const themeId = String(req.nextUrl.searchParams.get("theme") || "T01").toUpperCase();
  const course = courses[courseSlug as keyof typeof courses];
  if (!course) return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  const theme = course.themes.find((item) => item.id === themeId);
  if (!theme) return NextResponse.json({ error: "theme_not_found" }, { status: 404 });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  let access = "public_preview";
  let canNavigateAll = false;
  if (token) {
    const supabase = getSupabase();
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (!authError && authData.user) {
      if (isCourseAdministrator(authData.user.email)) {
        access = "administrator";
        canNavigateAll = true;
      } else {
        const now = new Date().toISOString();
        const { data: enrollment } = await supabase.from("course_enrollments").select("id")
          .eq("user_id", authData.user.id).eq("course_slug", courseSlug).eq("status", "active")
          .lte("starts_at", now).or(`expires_at.is.null,expires_at.gte.${now}`).limit(1).maybeSingle();
        if (enrollment) { access = "enrollment"; canNavigateAll = true; }
      }
    }
  }
  if (!theme.publicPreview && !canNavigateAll) {
    return NextResponse.json({ allowed: false, access: token ? "subscription_required" : "login_required", canNavigateAll: false }, { status: token ? 403 : 401 });
  }
  return NextResponse.json({ allowed: true, access, canNavigateAll, theme });
}
