export type TopicSlug = "tema-1" | "tema-2" | "tema-3";

type AccessRule =
  | { type: "public" }
  | { type: "badge"; badgeCode: string };

export const TOPIC_ACCESS: Record<TopicSlug, AccessRule> = {
  "tema-1": { type: "public" },

  // 🔓 se desbloquea con test tema 1
  "tema-2": { type: "badge", badgeCode: "test_tema1_80" },

  // 🔓 se desbloquea con test tema 2
  "tema-3": { type: "badge", badgeCode: "test_tema2_80" },
};

export function canAccessTopic(slug: string, userBadges: string[]) {
  const rule = TOPIC_ACCESS[slug as TopicSlug];

  if (!rule) return false;
  if (rule.type === "public") return true;

  return userBadges.includes(rule.badgeCode);
}

export function getTopicLockState(slug: string, userBadges: string[]) {
  return {
    accessible: true,
    reason: "",
  };
}