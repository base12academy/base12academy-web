import { NextRequest, NextResponse } from "next/server";
import { packageCourse, packageRegion, packageRegions, plans } from "@/lib/haciendas-universidades";
import { getPackageEnrollment, getPackageRegion } from "@/lib/haciendas-universidades-access";
import { getSupabase } from "@/lib/supabase/server";

const reply = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

type Context = { params: Promise<{ course: string }> };

async function authorize(request: NextRequest, { params }: Context) {
  const { course: slug } = await params;
  const course = packageCourse(slug);
  if (!course) return reply({ error: "course_not_found" }, 404);

  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return reply({ error: "login_required" }, 401);

  try {
    const db = getSupabase();
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user) return reply({ error: "login_required" }, 401);

    const access = await getPackageEnrollment(db, data.user.id, [slug]);
    if (!access) return reply({ error: "enrollment_required" }, 403);

    return { db, course, slug, access, userId: data.user.id };
  } catch {
    return reply({ error: "materials_unavailable" }, 503);
  }
}

export async function GET(request: NextRequest, context: Context) {
  const authorized = await authorize(request, context);
  if (authorized instanceof NextResponse) return authorized;
  const { db, slug, access, userId } = authorized;

  try {
    const moduleSlug = access.enrollment.metadata?.autonomousModule;
    const region = typeof moduleSlug === "string" ? packageRegion(moduleSlug) : undefined;
    const packageKind = request.nextUrl.searchParams.get("package");
    if (packageKind !== null) return reply({error:"downloads_disabled"},410);
    if (packageKind === null) {
      const {data: extra, error: extraError} = await db.from("opposition_materials").select("payload").eq("course_slug",slug).eq("resource_id","documents").maybeSingle();
      if (extraError) return reply({error:"materials_unavailable"},503);
      const rank: Record<string,number> = {esencial:1,estandar:2,premium:3};
      const documents = region ? (extra?.payload?.documents || []).filter((doc:{minimumPlan:string}) => (rank[doc.minimumPlan] || 99) <= rank[access.plan]) : [];

      return reply({
        plan: plans[access.plan],
        documents,
        region: region ? {
          label: region.label,
          href: `/dashboard/modulo-autonomico-${moduleSlug}`,
        } : null,
        regions: !region ? Object.entries(packageRegions).map(([slug, item]) => ({ slug, label: item.label })) : [],
        suggestedRegion: !region ? (await getPackageRegion(db, userId))?.[0] ?? null : null,
      });
    }

  } catch {
    return reply({ error: "materials_unavailable" }, 503);
  }
}

export async function POST(request: NextRequest, context: Context) {
  const authorized = await authorize(request, context);
  if (authorized instanceof NextResponse) return authorized;
  const { db, access, userId } = authorized;

  const body = await request.json().catch(() => null);
  const moduleSlug = body?.region;
  if (typeof moduleSlug !== "string" || !packageRegion(moduleSlug)) {
    return reply({ error: "invalid_region" }, 400);
  }

  const now = new Date().toISOString();
  const { data, error } = await db.from("course_enrollments")
    .update({ metadata: { ...access.enrollment.metadata, autonomousModule: moduleSlug } })
    .eq("id", access.enrollment.id).eq("user_id", userId).eq("status", "active")
    .lte("starts_at", now).or(`expires_at.is.null,expires_at.gte.${now}`)
    .is("metadata->>autonomousModule", null).select("id").maybeSingle();
  if (error) return reply({ error: "materials_unavailable" }, 503);
  if (!data) return reply({ error: "region_already_selected" }, 409);
  return reply({ ok: true });
}
