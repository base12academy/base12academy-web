import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getMatematicasAplicadasEntitlement } from "@/lib/matematicas-aplicadas-ccss/entitlement";

const empty = { authenticated:false, administrator:false, hasCourse:false, hasPau:false, plans:[], previewUnit:"T01" };

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json(empty);

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json(empty, { status: 401 });

  if (isCourseAdministrator(data.user.email)) {
    return NextResponse.json({ authenticated:true, administrator:true, hasCourse:true, hasPau:true, plans:["esencial","estandar","pau"], previewUnit:"T01" });
  }

  const now = new Date().toISOString();
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("plan_slug,expires_at")
    .eq("user_id", data.user.id)
    .eq("course_slug", "matematicas-aplicadas-ccss")
    .in("status", ["active", "pending"])
    .lte("starts_at", now);

  if (enrollmentError) return NextResponse.json({ error:"access_check_failed" }, { status:500 });

  const valid = (enrollments || []).filter((item) => !item.expires_at || item.expires_at >= now);
  const entitlement = getMatematicasAplicadasEntitlement(valid.map((item) => item.plan_slug));

  return NextResponse.json({ authenticated:true, administrator:false, ...entitlement, previewUnit:"T01" });
}
