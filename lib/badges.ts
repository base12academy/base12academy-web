export type BadgeLevel = "none" | "bronze" | "silver" | "gold";

export type BadgeInfo = {
  level: BadgeLevel;
  title: string;
  label: string;
  icon: string;
  description: string;
};

export const BADGES: Record<BadgeLevel, BadgeInfo> = {
  none: {
    level: "none",
    title: "Sin insignia",
    label: "Sin insignia",
    icon: "",
    description: "Todavía no has superado ninguna prueba final.",
  },
  bronze: {
    level: "bronze",
    title: "Bronce",
    label: "Bronce",
    icon: "🥉",
    description: "Has superado tu primera prueba final.",
  },
  silver: {
    level: "silver",
    title: "Plata",
    label: "Plata",
    icon: "🥈",
    description: "Estás consolidando el nivel final del curso.",
  },
  gold: {
    level: "gold",
    title: "Oro",
    label: "Oro",
    icon: "🥇",
    description: "Has completado el nivel final del curso.",
  },
};

export function getBadgeFromPassedCount(passedCount: number): BadgeInfo {
  if (passedCount >= 3) {
    return BADGES.gold;
  }

  if (passedCount >= 2) {
    return BADGES.silver;
  }

  if (passedCount >= 1) {
    return BADGES.bronze;
  }

  return BADGES.none;
}