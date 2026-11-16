import { randomInt } from "node:crypto";
import type { Opo12Block } from "./config";

export type SelectableQuestion = {
  id: string;
  block: Opo12Block;
  topic_code: string;
  seenCount?: number;
  lastSeenAt?: string | null;
};

/** Prioriza inéditas y menos recientes, repartiendo por temas antes de repetir. */
export function selectBalancedQuestions(
  pool: readonly SelectableQuestion[],
  amount: number,
): SelectableQuestion[] {
  const byTopic = new Map<string, SelectableQuestion[]>();
  for (const question of pool) {
    const group = byTopic.get(question.topic_code) ?? [];
    group.push(question);
    byTopic.set(question.topic_code, group);
  }
  for (const group of byTopic.values()) {
    group.sort((left, right) => {
      const exposure = (left.seenCount ?? 0) - (right.seenCount ?? 0);
      if (exposure) return exposure;
      const recency = String(left.lastSeenAt ?? "").localeCompare(String(right.lastSeenAt ?? ""));
      return recency || randomInt(-1, 2);
    });
  }

  const result: SelectableQuestion[] = [];
  const topics = [...byTopic.keys()].sort(() => randomInt(-1, 2));
  while (result.length < amount) {
    let added = false;
    for (const topic of topics) {
      const next = byTopic.get(topic)?.shift();
      if (!next) continue;
      result.push(next);
      added = true;
      if (result.length === amount) break;
    }
    if (!added) break;
  }
  if (result.length !== amount) throw new Error("question_bank_not_ready");
  return result;
}

/** Selecciona dentro de los temas solicitados conservando la rotación por exposición. */
export function selectTopicQuestions(
  pool: readonly SelectableQuestion[],
  topicCodes: readonly string[],
  amount: number,
): SelectableQuestion[] {
  const allowed = new Set(topicCodes);
  if (!allowed.size) throw new Error("topic_required");
  return selectBalancedQuestions(
    pool.filter((question) => allowed.has(question.topic_code)),
    amount,
  );
}

/** El repaso utiliza únicamente preguntas previamente falladas, en blanco o marcadas. */
export function selectReviewQuestions(
  pool: readonly SelectableQuestion[],
  reviewQuestionIds: ReadonlySet<string>,
  amount: number,
): SelectableQuestion[] {
  const eligible = pool.filter((question) => reviewQuestionIds.has(question.id));
  if (!eligible.length) throw new Error("no_review_questions");
  return selectBalancedQuestions(eligible, Math.min(amount, eligible.length));
}
