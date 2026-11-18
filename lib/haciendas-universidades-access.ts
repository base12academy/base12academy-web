import "server-only";

import { packageCourses, packageRegion, regionFromProfile, strongestPlan } from "@/lib/haciendas-universidades";
import { getSupabase } from "@/lib/supabase/server";

type Database = ReturnType<typeof getSupabase>;

export async function getPackageEnrollment(
  db: Database,
  userId: string,
  courseSlugs = Object.keys(packageCourses),
  regionSlug?: string,
) {
  const now = new Date().toISOString();
  const { data, error } = await db.from("course_enrollments").select("id, plan_slug, metadata")
    .eq("user_id", userId).in("course_slug", courseSlugs).eq("status", "active")
    .lte("starts_at", now).or(`expires_at.is.null,expires_at.gte.${now}`);
  if (error) throw error;
  return strongestPlan(regionSlug ? data.filter(row => row.metadata?.autonomousModule === regionSlug) : data);
}

export async function getPackageRegion(db: Database, userId: string) {
  const { data, error } = await db.from("student_profiles").select("autonomous_community")
    .eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return regionFromProfile(data?.autonomous_community);
}

export async function getIncludedModuleEnrollment(db: Database, userId: string, courseSlug: string) {
  const prefix = "modulo-autonomico-";
  if (!courseSlug.startsWith(prefix)) return null;
  const slug = courseSlug.slice(prefix.length);
  const region = packageRegion(slug);
  if (!region || region.files) return null;
  const access = await getPackageEnrollment(db, userId, undefined, slug);
  return access?.enrollment ?? null;
}
