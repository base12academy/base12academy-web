export const PERIODIC_TABLE_COURSE_SLUG = "tabla-periodica";
export const PERIODIC_TABLE_PLAN_SLUG = "licencia";

export const CHEMISTRY_COURSE_SLUGS = [
  "quimica",
  "quimica-bachillerato-pau",
] as const;

export const INCLUDED_CHEMISTRY_PLANS = ["esencial", "estandar", "standard"] as const;

export type EnrollmentForPeriodicTable = {
  course_slug: string;
  plan_slug: string;
  status: string;
  starts_at: string;
  expires_at: string | null;
};

export type PeriodicTableAccess =
  | { entitled: true; access: "included"; source: "chemistry-package"; planSlug: string }
  | { entitled: true; access: "licensed"; source: "standalone-license"; planSlug: string }
  | { entitled: false; access: "purchase_required"; source: null; planSlug: null };

export function classifyPeriodicTableAccess(
  enrollments: EnrollmentForPeriodicTable[],
  now = new Date(),
): PeriodicTableAccess {
  const instant = now.getTime();
  const valid = enrollments.filter((enrollment) => {
    if (enrollment.status !== "active") return false;
    if (Date.parse(enrollment.starts_at) > instant) return false;
    return enrollment.expires_at == null || Date.parse(enrollment.expires_at) >= instant;
  });

  const standalone = valid.find(
    (enrollment) =>
      enrollment.course_slug === PERIODIC_TABLE_COURSE_SLUG &&
      enrollment.plan_slug === PERIODIC_TABLE_PLAN_SLUG,
  );

  if (standalone) {
    return {
      entitled: true,
      access: "licensed",
      source: "standalone-license",
      planSlug: standalone.plan_slug,
    };
  }

  const included = valid.find(
    (enrollment) =>
      CHEMISTRY_COURSE_SLUGS.includes(enrollment.course_slug as (typeof CHEMISTRY_COURSE_SLUGS)[number]) &&
      INCLUDED_CHEMISTRY_PLANS.includes(enrollment.plan_slug as (typeof INCLUDED_CHEMISTRY_PLANS)[number]),
  );

  if (included) {
    return {
      entitled: true,
      access: "included",
      source: "chemistry-package",
      planSlug: included.plan_slug,
    };
  }

  return {
    entitled: false,
    access: "purchase_required",
    source: null,
    planSlug: null,
  };
}
