import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getMatematicasIIEntitlement } from "@/lib/matematicas-ii/entitlement";
import { getRocioQuestions, getShortQuestions, hasEvaluationUnit } from "@/lib/matematicas-ii/evaluation.server";
import { getPauProblems } from "@/lib/matematicas-ii/pau-problems.server";
import { MAT2_PAU_PROFILES } from "@/lib/matematicas-ii/pau-profiles.server";
import { getPauSimulation } from "@/lib/matematicas-ii/simulations.server";

const PREVIEW_UNIT = "T01";

type AccessResult = {
  authenticated: boolean;
  administrator: boolean;
  hasCourse: boolean;
  hasPau: boolean;
  error?: boolean;
};

async function getAccess(req: NextRequest): Promise<AccessResult> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { authenticated: false, administrator: false, hasCourse: false, hasPau: false };

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { authenticated: false, administrator: false, hasCourse: false, hasPau: false };

  if (isCourseAdministrator(data.user.email)) {
    return { authenticated: true, administrator: true, hasCourse: true, hasPau: true };
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
    return { authenticated: true, administrator: false, hasCourse: false, hasPau: false, error: true };
  }

  const plans = (enrollments || [])
    .filter((item) => !item.expires_at || item.expires_at >= now)
    .map((item) => item.plan_slug);
  const entitlement = getMatematicasIIEntitlement(plans);

  return {
    authenticated: true,
    administrator: false,
    hasCourse: entitlement.hasCourse,
    hasPau: entitlement.hasPau,
  };
}

function denied(access: AccessResult) {
  return NextResponse.json(
    { error: access.authenticated ? "matriculation_required" : "authentication_required" },
    { status: access.authenticated ? 403 : 401 },
  );
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const access = await getAccess(req);
  if (access.error) return NextResponse.json({ error: "access_check_failed" }, { status: 500 });

  if (type === "rocio" || type === "short") {
    const unit = req.nextUrl.searchParams.get("unit") || "";
    if (!hasEvaluationUnit(unit)) return NextResponse.json({ error: "invalid_unit" }, { status: 400 });

    const preview = unit === PREVIEW_UNIT;
    if (!preview && !access.administrator && !access.hasCourse && !access.hasPau) return denied(access);

    const items = type === "rocio" ? getRocioQuestions(unit) : getShortQuestions(unit);
    return NextResponse.json({ type, unit, preview, count: items.length, items });
  }

  if (type === "problems") {
    if (!access.administrator && !access.hasPau) return denied(access);
    const block = req.nextUrl.searchParams.get("block") || undefined;
    const items = getPauProblems(block);
    return NextResponse.json({ type, block: block || null, count: items.length, items });
  }

  if (type === "profiles") {
    if (!access.administrator && !access.hasPau) return denied(access);
    return NextResponse.json({ type, count: MAT2_PAU_PROFILES.length, items: MAT2_PAU_PROFILES });
  }

  if (type === "simulation") {
    if (!access.administrator && !access.hasPau) return denied(access);
    const code = (req.nextUrl.searchParams.get("code") || "").toUpperCase();
    const simulation = getPauSimulation(code);
    if (!simulation) return NextResponse.json({ error: "invalid_community" }, { status: 404 });
    return NextResponse.json({ type, code, simulation });
  }

  return NextResponse.json({ error: "invalid_request" }, { status: 400 });
}
