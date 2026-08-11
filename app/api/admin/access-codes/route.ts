import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase/server";
import { courses, type CourseSlug } from "@/lib/courses";

const ADMIN_EMAIL = "base12academy+administracion@gmail.com";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || authData.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const catalogSlug = String(body.catalogSlug || "") as CourseSlug;
  const course = courses[catalogSlug];
  const customCourseSlug = String(body.courseSlug || "").trim().toLowerCase();
  const customPlanSlug = String(body.planSlug || "standard").trim().toLowerCase();
  const courseSlug = course && course.active
    ? ("courseSlug" in course ? course.courseSlug : course.slug)
    : customCourseSlug;
  const planSlug = course && course.active
    ? ("planSlug" in course ? course.planSlug : "standard")
    : customPlanSlug;
  const accessMonths = course && course.active
    ? ("accessMonths" in course ? course.accessMonths : null)
    : Math.max(1, Math.min(36, Number(body.accessMonths) || 12));
  if (
    !email || !email.includes("@") ||
    !/^[a-z0-9-]{3,80}$/.test(courseSlug) ||
    !/^[a-z0-9-]{2,40}$/.test(planSlug)
  ) {
    return NextResponse.json({ error: "Datos de la clave no válidos" }, { status: 400 });
  }

  const rawCode = `B12-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const codeHash = crypto.createHash("sha256").update(rawCode).digest("hex");
  const expiresAt = new Date();
  expiresAt.setUTCDate(expiresAt.getUTCDate() + Math.max(1, Math.min(365, Number(body.validDays) || 30)));

  const { error } = await supabase.from("personal_access_codes").insert({
    code_hash: codeHash,
    code_hint: rawCode.slice(-6),
    assigned_email: email,
    course_slug: courseSlug,
    plan_slug: planSlug,
    access_months: accessMonths,
    expires_at: expiresAt.toISOString(),
    created_by: authData.user.id,
    note: body.note ? String(body.note).slice(0, 500) : null,
  });

  if (error) {
    console.error("No se pudo crear la clave personal", error);
    return NextResponse.json({ error: "No se pudo crear la clave" }, { status: 500 });
  }

  return NextResponse.json({ code: rawCode, assignedEmail: email, expiresAt });
}
