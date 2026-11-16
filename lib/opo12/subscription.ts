export type Opo12SubscriptionInput = {
  status: "active" | "payment_failed" | "cancelled";
  paidThrough: string;
};

export type Opo12SubscriptionState = "active" | "restricted" | "cancelled";

function utcDayNumber(day: string) {
  const [year, month, date] = day.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, date) / 86_400_000);
}

/** Estado al comienzo de un día civil de Europe/Madrid. */
export function resolveSubscriptionState(
  subscription: Opo12SubscriptionInput | null,
  madridDay: string,
  complimentary = false,
): { state: Opo12SubscriptionState; regularizationDaysRemaining: number | null } {
  if (complimentary) return { state: "active", regularizationDaysRemaining: null };
  if (!subscription || subscription.status === "cancelled") return { state: "cancelled", regularizationDaysRemaining: null };
  const daysAfterPaidThrough = utcDayNumber(madridDay) - utcDayNumber(subscription.paidThrough);
  if (subscription.status === "active" && daysAfterPaidThrough <= 0) {
    return { state: "active", regularizationDaysRemaining: null };
  }
  if (daysAfterPaidThrough <= 0) return { state: "active", regularizationDaysRemaining: 10 };
  if (daysAfterPaidThrough <= 10) {
    return { state: "restricted", regularizationDaysRemaining: 11 - daysAfterPaidThrough };
  }
  return { state: "cancelled", regularizationDaysRemaining: 0 };
}
