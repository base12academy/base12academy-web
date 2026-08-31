import type { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getSupabase } from "@/lib/supabase/server";
import {
  effectiveTropaPlan,
  isTropaIndividualProductSlug,
  motorIsAvailable,
  TROP_COURSE_SLUG,
  tropaAptitudes,
  tropaIndividualProductAccess,
  tropaPlanAccess,
  type TropaAptitudeSlug,
  type TropaMotorCode,
  type TropaPlanSlug,
} from "@/lib/tropa-config";

type TropaEnrollment = {
  id: string;
  plan_slug: string;
};

export type TropaResolvedAccess = {
  userId: string;
  administrator: boolean;
  enrollmentIds: string[];
  planSlug: TropaPlanSlug | null;
  aptitudeSlugs: TropaAptitudeSlug[];
  individualProductSlugs: string[];
  availableMotors: TropaMotorCode[];
  questionCount: number;
  motorCount: number;
  label: string;
};

export type TropaAuthorizedRequest = {
  supabase: ReturnType<typeof getSupabase>;
  user: User;
  access: TropaResolvedAccess;
};

export async function resolveTropaAccess(
  supabase: ReturnType<typeof getSupabase>,
  user: Pick<User, "id" | "email">,
): Promise<TropaResolvedAccess | null> {
  const administrator = isCourseAdministrator(user.email);
  let enrollments: TropaEnrollment[] = [];

  if (!administrator) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("course_enrollments")
      .select("id, plan_slug")
      .eq("user_id", user.id)
      .eq("course_slug", TROP_COURSE_SLUG)
      .eq("status", "active")
      .lte("starts_at", now)
      .or(`expires_at.is.null,expires_at.gte.${now}`);

    if (error) throw new Error(`No se pudo comprobar el acceso TROP: ${error.message}`);
    enrollments = (data ?? []).map((row) => ({ id: String(row.id), plan_slug: String(row.plan_slug) }));
  }

  const planSlug = administrator
    ? "integral"
    : effectiveTropaPlan(enrollments.map((enrollment) => enrollment.plan_slug));
  const individualProductSlugs = administrator
    ? []
    : enrollments
        .map((enrollment) => enrollment.plan_slug)
        .filter(isTropaIndividualProductSlug);

  const aptitudeSet = new Set<TropaAptitudeSlug>();
  if (planSlug) {
    for (const aptitude of tropaAptitudes) aptitudeSet.add(aptitude.slug);
  } else {
    for (const productSlug of individualProductSlugs) {
      aptitudeSet.add(tropaIndividualProductAccess[productSlug]);
    }
  }

  const aptitudeSlugs = tropaAptitudes
    .map((aptitude) => aptitude.slug)
    .filter((slug) => aptitudeSet.has(slug));
  if (aptitudeSlugs.length === 0) return null;

  const availableMotors = tropaAptitudes.flatMap((aptitude) => {
    if (!aptitudeSet.has(aptitude.slug)) return [];
    return aptitude.motors.filter((code) => !planSlug || motorIsAvailable(code, planSlug));
  });

  const questionCount = planSlug
    ? tropaPlanAccess[planSlug].questionCount
    : aptitudeSlugs.length * 4_000;
  const label = planSlug
    ? tropaPlanAccess[planSlug].label
    : aptitudeSlugs.length === 1
      ? tropaAptitudes.find((aptitude) => aptitude.slug === aptitudeSlugs[0])?.name ?? "Aptitud"
      : `${aptitudeSlugs.length} aptitudes`;

  return {
    userId: user.id,
    administrator,
    enrollmentIds: enrollments.map((enrollment) => enrollment.id),
    planSlug,
    aptitudeSlugs,
    individualProductSlugs,
    availableMotors,
    questionCount,
    motorCount: availableMotors.length,
    label,
  };
}

export function canAccessTropaAptitude(access: TropaResolvedAccess, aptitudeSlug: TropaAptitudeSlug) {
  return access.aptitudeSlugs.includes(aptitudeSlug);
}

export function canAccessTropaQuestion(
  access: TropaResolvedAccess,
  question: { aptitude_slug: string; access_min: string },
) {
  const aptitudeSlug = question.aptitude_slug as TropaAptitudeSlug;
  if (!canAccessTropaAptitude(access, aptitudeSlug)) return false;
  if (!access.planSlug) return true;
  const minimum = question.access_min as TropaPlanSlug;
  return minimum in tropaPlanAccess
    && tropaPlanAccess[access.planSlug].rank >= tropaPlanAccess[minimum].rank;
}

export async function authorizeTropaRequest(
  request: NextRequest,
): Promise<TropaAuthorizedRequest | NextResponse> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) {
    return NextResponse.json({ allowed: false, access: "login_required" }, { status: 401 });
  }

  try {
    const access = await resolveTropaAccess(supabase, auth.user);
    if (!access) {
      return NextResponse.json({ allowed: false, access: "subscription_required" }, { status: 403 });
    }
    return { supabase, user: auth.user, access };
  } catch (error) {
    console.error("No se pudo comprobar el acceso TROP", error);
    return NextResponse.json({ allowed: false, access: "unavailable" }, { status: 503 });
  }
}

export function isTropaAuthorizationError(
  value: TropaAuthorizedRequest | NextResponse,
): value is NextResponse {
  return value instanceof NextResponse;
}
