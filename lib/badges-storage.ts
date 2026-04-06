import { getBadgeFromPassedCount } from "./badges";

export function getBadgeSummaryFromFinalProgress(passedCount: number) {
  return getBadgeFromPassedCount(passedCount);
}