export type BadgeLevel = "none" | "bronze" | "silver" | "gold";

export type BadgeInfo = {
  level: BadgeLevel;
  label: string;
  icon: string;
  description: string;
};

export function getBadgeFromPassedCount(passedCount: number): BadgeInfo {
  if (passedCount >= 3) {
    return {
      level: "gold",
      label: "Oro",
      icon: "🥇",
      description: "Has completado el nivel final del curso.",
    };
  }

  if (passedCount >= 2) {
    return {
      level: "silver",
      label: "Plata",
      icon: "🥈",
      description: "Estás consolidando el nivel final del curso.",
    };
  }

  if (passedCount >= 1) {
    return {
      level: "bronze",
      label: "Bronce",
      icon: "🥉",
      description: "Has superado tu primera prueba final.",
    };
  }

  return {
    level: "none",
    label: "Sin insignia",
    icon: "",
    description: "Todavía no has superado ninguna prueba final.",
  };
}