import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getMatematicasIIEntitlement } from "@/lib/matematicas-ii/entitlement";
import { MATEMATICAS_II_GLOSSARY, MATEMATICAS_II_GLOSSARY_COUNT } from "@/lib/matematicas-ii/glossary";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  if (!isCourseAdministrator(data.user.email)) {
    const now = new Date().toISOString();
    const { data: enrollments, error: enrollmentError } = await supabase
      .from("course_enrollments")
      .select("plan_slug,expires_at")
      .eq("user_id", data.user.id)
      .eq("course_slug", "matematicas-ii")
      .eq("status", "active")
      .lte("starts_at", now);

    if (enrollmentError) return NextResponse.json({ error: "access_check_failed" }, { status: 500 });

    const plans = (enrollments || [])
      .filter((item) => !item.expires_at || item.expires_at >= now)
      .map((item) => item.plan_slug);
    const entitlement = getMatematicasIIEntitlement(plans);
    if (!entitlement.hasCourse && !entitlement.hasPau) {
      return NextResponse.json({ error: "matriculation_required" }, { status: 403 });
    }
  }

  return NextResponse.json({
    count: MATEMATICAS_II_GLOSSARY_COUNT,
    sections: MATEMATICAS_II_GLOSSARY,
  });
}
