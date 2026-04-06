import { normalizeText } from "./normalizeText";
import { detectConcepts } from "./detectConcepts";

type RubricCriteria = {
  weight: number;
  required_concepts: string[];
  optional_concepts: string[];
};

type GradingConfig = {
  max_score: number;
  min_words: number;
  rubric: {
    recognition: RubricCriteria;
    context: RubricCriteria;
    analysis: RubricCriteria;
    relevance: RubricCriteria;
  };
};

export function gradeSource(answer: string, config: GradingConfig) {
  const normalized = normalizeText(answer);
  const detected = detectConcepts(normalized);
  const wordCount = normalized.split(" ").filter(Boolean).length;

  let total = 0;
  const breakdown: Record<string, number> = {};

  const rubricKeys: Array<keyof GradingConfig["rubric"]> = [
    "recognition",
    "context",
    "analysis",
    "relevance",
  ];

  for (const key of rubricKeys) {
    const criterion = config.rubric[key];

    const requiredMatches = criterion.required_concepts.filter(
      (concept: string) => detected[concept]
    ).length;

    const optionalMatches = criterion.optional_concepts.filter(
      (concept: string) => detected[concept]
    ).length;

    const requiredScore =
      criterion.required_concepts.length === 0
        ? 0.6
        : (requiredMatches / criterion.required_concepts.length) * 0.6;

    const optionalScore =
      criterion.optional_concepts.length === 0
        ? 0
        : (optionalMatches / criterion.optional_concepts.length) * 0.4;

    const score = (requiredScore + optionalScore) * criterion.weight;

    breakdown[key] = Number(score.toFixed(2));
    total += score;
  }

  if (wordCount < config.min_words) {
    total *= 0.5;
  }

  return {
    score: Number(total.toFixed(2)),
    breakdown,
    wordCount,
  };
}