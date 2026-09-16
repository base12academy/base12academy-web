import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getMatematicasIIEntitlement } from "@/lib/matematicas-ii/entitlement";

export type MatematicasIIRequestAccess = {
  authenticated: boolean;
  administrator: boolean;
  hasCourse: boolean;
  hasPau: boolean;
  plans: string[];
};

export async function getMatematicasIIRequestAccess(req: NextRequest): Promise<MatematicasIIRequestAccess> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return { authenticated: false, administrator: false, hasCourse: false, hasPau: false, plans: [] };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { authenticated: false, administrator: false, hasCourse: false, hasPau: false, plans: [] };
  }

  if (isCourseAdministrator(data.user.email)) {
    return { authenticated: true, administrator: true, hasCourse: true, hasPau: true, plans: ["esencial", "estandar", "pau"] };
  }

  const now = new Date().toISOString();
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("plan_slug,expires_at")
    .eq("user_id", data.user.id)
    .eq("course_slug", "matematicas-ii")
    .eq("status", "active")
    .lte("starts_at", now);

  if (enrollmentError) {
    throw new Error("access_check_failed");
  }

  const valid = (enrollments || []).filter((item) => !item.expires_at || item.expires_at >= now);
  const entitlement = getMatematicasIIEntitlement(valid.map((item) => item.plan_slug));

  return {
    authenticated: true,
    administrator: false,
    ...entitlement,
  };
}
