import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import {
  CHEMISTRY_COURSE_SLUGS,
  PERIODIC_TABLE_COURSE_SLUG,
  classifyPeriodicTableAccess,
  type EnrollmentForPeriodicTable,
} from "@/lib/chemistry/periodic-table-access";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({
      entitled: false,
      access: "purchase_required",
      source: null,
      planSlug: null,
      authenticated: false,
    });
  }

  try {
    const supabase = getSupabase();
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json({
        entitled: false,
        access: "purchase_required",
        source: null,
        planSlug: null,
        authenticated: false,
      });
    }

    const { data, error } = await supabase
      .from("course_enrollments")
      .select("course_slug,plan_slug,status,starts_at,expires_at")
      .eq("user_id", authData.user.id)
      .in("course_slug", [...CHEMISTRY_COURSE_SLUGS, PERIODIC_TABLE_COURSE_SLUG]);

    if (error) {
      console.error("No se pudo comprobar el acceso a la tabla periódica", error);
      return NextResponse.json(
        { error: "No se pudo comprobar el acceso en este momento." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ...classifyPeriodicTableAccess((data ?? []) as EnrollmentForPeriodicTable[]),
      authenticated: true,
    });
  } catch (error) {
    console.error("Configuración de acceso a la tabla periódica no disponible", error);
    return NextResponse.json(
      { error: "La comprobación de acceso no está configurada." },
      { status: 503 },
    );
  }
}
