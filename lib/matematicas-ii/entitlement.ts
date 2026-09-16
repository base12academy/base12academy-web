export type MatematicasIIPlan = "esencial" | "estandar" | "pau";

export type MatematicasIIEntitlement = {
  hasCourse: boolean;
  hasPau: boolean;
  plans: MatematicasIIPlan[];
};

const VALID_PLANS = new Set<MatematicasIIPlan>(["esencial", "estandar", "pau"]);

export function getMatematicasIIEntitlement(planSlugs: Array<string | null | undefined>): MatematicasIIEntitlement {
  const plans = Array.from(new Set(planSlugs
    .map((plan) => String(plan || "").trim().toLowerCase())
    .filter((plan): plan is MatematicasIIPlan => VALID_PLANS.has(plan as MatematicasIIPlan))));

  return {
    hasCourse: plans.includes("esencial") || plans.includes("estandar"),
    hasPau: plans.includes("estandar") || plans.includes("pau"),
    plans,
  };
}
