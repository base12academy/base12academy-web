export const PERIODIC_TABLE_CATALOG_SLUG = "tabla-periodica-licencia";
export const PERIODIC_TABLE_LICENSE_PRICE_CENTS = 999;
export const DEFAULT_BASE12_BILLING_EMAIL = "base12academy+facturacion@gmail.com";

export function isPeriodicTableIncludedPlan(courseName: string, planName: string) {
  return courseName === "Química" && (planName === "Esencial" || planName === "Estándar");
}

export function parsePeriodicInvoiceChoice(value: unknown): boolean | null {
  if (value === true) return true;
  if (value === false) return false;
  return null;
}
