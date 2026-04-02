export const courses = {
  "historia-espana": {
    slug: "historia-espana",
    title: "Historia de España",
    shortTitle: "Historia de España",
    price: 29,
    priceInCents: 2900,
    mode: "one_time",
    active: true,
    accessType: "lifetime",
    comingSoon: false,
  },
  "historia-filosofia": {
    slug: "historia-filosofia",
    title: "Historia de la Filosofía",
    shortTitle: "Historia de la Filosofía",
    price: null,
    priceInCents: null,
    mode: "pending",
    active: false,
    accessType: null,
    comingSoon: true,
  },
} as const;

export type CourseSlug = keyof typeof courses;