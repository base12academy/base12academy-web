import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getMatematicasIIEntitlement } from "@/lib/matematicas-ii/entitlement";
import { MATEMATICAS_II_VIDEO_URLS, toYouTubeEmbedUrl } from "@/lib/matematicas-ii/videos.server";

export async function GET(req: NextRequest) {
  const unit = req.nextUrl.searchParams.get("unit")?.toUpperCase() ?? "";
  const videoUrl = MATEMATICAS_II_VIDEO_URLS[unit];

  if (!videoUrl) {
    return NextResponse.json({ error: "video_not_found" }, { status: 404 });
  }

  if (unit === "T01") {
    return NextResponse.json({
      unit,
      url: videoUrl,
      embedUrl: toYouTubeEmbedUrl(videoUrl),
      preview: true,
    });
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: "invalid_session" }, { status: 401 });
  }

  if (isCourseAdministrator(data.user.email)) {
    return NextResponse.json({
      unit,
      url: videoUrl,
      embedUrl: toYouTubeEmbedUrl(videoUrl),
      preview: false,
    });
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
    return NextResponse.json({ error: "access_check_failed" }, { status: 500 });
  }

  const valid = (enrollments || []).filter((item) => !item.expires_at || item.expires_at >= now);
  const entitlement = getMatematicasIIEntitlement(valid.map((item) => item.plan_slug));

  if (!entitlement.hasCourse) {
    return NextResponse.json({ error: "course_access_required" }, { status: 403 });
  }

  return NextResponse.json({
    unit,
    url: videoUrl,
    embedUrl: toYouTubeEmbedUrl(videoUrl),
    preview: false,
  });
}
