import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ attempts: [] });
  const supabase = getSupabase(); const { data: auth } = await supabase.auth.getUser(token);
  if (!auth.user) return NextResponse.json({ attempts: [] });
  const course = String(req.nextUrl.searchParams.get("course") || ""); const theme = String(req.nextUrl.searchParams.get("theme") || "");
  const { data } = await supabase.from("course_learning_events").select("progress_percent,metadata,occurred_at").eq("user_id", auth.user.id).eq("course_slug", course).eq("content_id", theme).eq("event_type", "assessment_submitted").order("occurred_at", { ascending: false }).limit(20);
  return NextResponse.json({ attempts: data || [] });
}
