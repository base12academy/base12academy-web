export type MatematicasAplicadasPlan = "esencial" | "estandar" | "pau";

export type MatematicasAplicadasEntitlement = {
  hasCourse: boolean;
  hasPau: boolean;
  plans: MatematicasAplicadasPlan[];
};

const VALID_PLANS = new Set<MatematicasAplicadasPlan>(["esencial", "estandar", "pau"]);

export function getMatematicasAplicadasEntitlement(planSlugs: Array<string | null | undefined>): MatematicasAplicadasEntitlement {
  const plans = Array.from(new Set(planSlugs
    .map((plan) => String(plan || "").trim().toLowerCase())
    .filter((plan): plan is MatematicasAplicadasPlan => VALID_PLANS.has(plan as MatematicasAplicadasPlan))));

  return {
    hasCourse: plans.includes("esencial") || plans.includes("estandar"),
    hasPau: plans.includes("estandar") || plans.includes("pau"),
    plans,
  };
}
