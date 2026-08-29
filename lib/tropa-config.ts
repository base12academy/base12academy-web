export const TROP_COURSE_SLUG = "tropa-y-marineria";

export const tropaPlanAccess = {
  esencial: { label: "Esencial", rank: 1, questionCount: 14_000, motorCount: 7 },
  operativa: { label: "Operativa", rank: 2, questionCount: 21_000, motorCount: 14 },
  integral: { label: "Integral", rank: 3, questionCount: 28_000, motorCount: 21 },
} as const;

export type TropaPlanSlug = keyof typeof tropaPlanAccess;

export const tropaAptitudes = [
  { slug: "verbal", name: "Verbal", code: "VER", motors: ["VB01", "VB02", "VB03"] },
  { slug: "numerico", name: "Numérico", code: "NUM", motors: ["NU01", "NU02", "NU03"] },
  { slug: "espacial", name: "Espacial", code: "ESP", motors: ["ES01", "ES02", "ES03"] },
  { slug: "mecanico", name: "Mecánico", code: "MEC", motors: ["ME01", "ME03", "ME05"] },
  { slug: "perceptivo", name: "Perceptivo", code: "PER", motors: ["PE01", "PE02", "PE03"] },
  { slug: "memoria", name: "Memoria", code: "MEM", motors: ["MEM01", "MEM03", "MEM04"] },
  { slug: "abstracto", name: "Razonamiento abstracto", code: "ABS", motors: ["AB01", "AB04", "AB05"] },
] as const;

export const tropaMotors = {
  VB01: { name: "Intruso semántico", minimumPlan: "esencial" },
  VB02: { name: "Parejas relámpago", minimumPlan: "operativa" },
  VB03: { name: "Analogía táctica", minimumPlan: "integral" },
  NU01: { name: "Número objetivo", minimumPlan: "esencial" },
  NU02: { name: "Estimación rápida", minimumPlan: "operativa" },
  NU03: { name: "Caza la serie", minimumPlan: "integral" },
  ES01: { name: "Giro mental", minimumPlan: "esencial" },
  ES02: { name: "Espejo o giro", minimumPlan: "operativa" },
  ES03: { name: "Cierra el cubo", minimumPlan: "integral" },
  ME01: { name: "Cadena de engranajes", minimumPlan: "esencial" },
  ME03: { name: "Equilibra la palanca", minimumPlan: "operativa" },
  ME05: { name: "¿Qué ocurrirá?", minimumPlan: "integral" },
  PE01: { name: "Radar", minimumPlan: "esencial" },
  PE02: { name: "El infiltrado", minimumPlan: "operativa" },
  PE03: { name: "Comparación flash", minimumPlan: "integral" },
  MEM01: { name: "Kim Base12", minimumPlan: "esencial" },
  MEM03: { name: "¿Qué cambió?", minimumPlan: "operativa" },
  MEM04: { name: "Mapa de memoria", minimumPlan: "integral" },
  AB01: { name: "Regla oculta", minimumPlan: "esencial" },
  AB04: { name: "Matriz incompleta", minimumPlan: "operativa" },
  AB05: { name: "Cazador de hipótesis", minimumPlan: "integral" },
} as const;

export type TropaMotorCode = keyof typeof tropaMotors;

export function isTropaPlanSlug(value: string): value is TropaPlanSlug {
  return value in tropaPlanAccess;
}

export function effectiveTropaPlan(planSlugs: string[]) {
  return planSlugs
    .filter(isTropaPlanSlug)
    .sort((a, b) => tropaPlanAccess[b].rank - tropaPlanAccess[a].rank)[0] ?? null;
}

export function motorIsAvailable(code: TropaMotorCode, plan: TropaPlanSlug) {
  return tropaPlanAccess[plan].rank >= tropaPlanAccess[tropaMotors[code].minimumPlan].rank;
}
