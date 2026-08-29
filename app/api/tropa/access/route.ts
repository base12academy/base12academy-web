import { NextRequest, NextResponse } from "next/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getSupabase } from "@/lib/supabase/server";
import {
  effectiveTropaPlan,
  motorIsAvailable,
  TROP_COURSE_SLUG,
  tropaMotors,
  tropaPlanAccess,
  type TropaPlanSlug,
} from "@/lib/tropa-config";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  let planSlug: TropaPlanSlug | null = isCourseAdministrator(auth.user.email) ? "integral" : null;
  if (!planSlug) {
    const now = new Date().toISOString();
    const { data: enrollments, error } = await supabase
      .from("course_enrollments")
      .select("plan_slug")
      .eq("user_id", auth.user.id)
      .eq("course_slug", TROP_COURSE_SLUG)
      .eq("status", "active")
      .lte("starts_at", now)
      .or(`expires_at.is.null,expires_at.gte.${now}`);
    if (error) {
      console.error("No se pudo comprobar el acceso TROP", error);
      return NextResponse.json({ allowed: false, access: "unavailable" }, { status: 503 });
    }
    planSlug = effectiveTropaPlan((enrollments ?? []).map((item) => String(item.plan_slug)));
  }

  if (!planSlug) {
    return NextResponse.json({ allowed: false, access: "subscription_required" }, { status: 403 });
  }

  const availableMotors = Object.keys(tropaMotors).filter((code) =>
    motorIsAvailable(code as keyof typeof tropaMotors, planSlug),
  );
  return NextResponse.json({
    allowed: true,
    access: isCourseAdministrator(auth.user.email) ? "administrator" : "enrollment",
    planSlug,
    plan: tropaPlanAccess[planSlug],
    availableMotors,
  });
}
