import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

const allowedEvents = new Set([
  "opened", "video_started", "video_completed", "activity_started",
  "activity_completed", "content_completed", "assessment_submitted",
]);

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const courseSlug = String(body.courseSlug || "");
  const contentId = String(body.contentId || "");
  const eventType = String(body.eventType || "");
  if (!courseSlug || !contentId || !allowedEvents.has(eventType)) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("id, starts_at, expires_at, status")
    .eq("user_id", authData.user.id)
    .eq("course_slug", courseSlug)
    .lte("starts_at", now)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .eq("status", "active")
    .maybeSingle();

  if (enrollmentError || !enrollment) {
    return NextResponse.json({ error: "no_active_enrollment" }, { status: 403 });
  }

  const progress = body.progressPercent == null ? null : Number(body.progressPercent);
  const normalizedProgress = typeof progress === "number" && Number.isFinite(progress)
    ? Math.max(0, Math.min(100, progress))
    : null;
  const { error: eventError } = await supabase.from("course_learning_events").insert({
    user_id: authData.user.id,
    enrollment_id: enrollment.id,
    course_slug: courseSlug,
    content_id: contentId,
    event_type: eventType,
    progress_percent: normalizedProgress,
    metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {},
    occurred_at: now,
  });

  if (eventError) {
    console.error("No se pudo registrar el progreso", eventError);
    return NextResponse.json({ error: "progress_not_saved" }, { status: 500 });
  }

  if (eventType === "opened") {
    await supabase.from("course_enrollments")
      .update({ first_content_accessed_at: now, updated_at: now })
      .eq("id", enrollment.id).is("first_content_accessed_at", null);
  }

  return NextResponse.json({ ok: true });
}
