import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { TRAINING_COURSE_SLUG, TRAINING_PLAN_SLUG } from "@/lib/training-config";

export type TrainingAuthorization = {
  supabase: ReturnType<typeof getSupabase>;
  user: { id: string; email?: string | null };
  access: "administrator" | "enrollment";
};

export async function authorizeTrainingRequest(request: NextRequest): Promise<TrainingAuthorization | NextResponse> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  if (isCourseAdministrator(data.user.email)) {
    return { supabase, user: data.user, access: "administrator" };
  }

  const now = new Date().toISOString();
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", data.user.id)
    .eq("course_slug", TRAINING_COURSE_SLUG)
    .eq("plan_slug", TRAINING_PLAN_SLUG)
    .eq("status", "active")
    .lte("starts_at", now)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .limit(1)
    .maybeSingle();

  if (enrollmentError) {
    console.error("No se pudo comprobar el acceso a Base12 Training", enrollmentError);
    return NextResponse.json({ allowed: false, access: "error" }, { status: 500 });
  }
  if (!enrollment) {
    return NextResponse.json({ allowed: false, access: "subscription_required" }, { status: 403 });
  }

  return { supabase, user: data.user, access: "enrollment" };
}

export function isTrainingAuthorizationError(value: TrainingAuthorization | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
