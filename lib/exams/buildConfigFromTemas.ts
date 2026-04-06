import { CONCEPTS } from "./concepts";
import { normalizeText } from "./normalizeText";

export function buildConfigFromExplicacion(explicacion: string) {
  const text = normalizeText(explicacion);

  const detectedConcepts = Object.keys(CONCEPTS).filter((key) => {
    return CONCEPTS[key].some((variant) => text.includes(variant));
  });

  return {
    max_score: 4,
    min_words: 120,
    rubric: {
      recognition: {
        weight: 1,
        required_concepts: detectedConcepts.slice(0, 2),
        optional_concepts: detectedConcepts.slice(2, 5),
      },
      context: {
        weight: 1,
        required_concepts: detectedConcepts.slice(1, 3),
        optional_concepts: detectedConcepts.slice(3, 6),
      },
      analysis: {
        weight: 1,
        required_concepts: detectedConcepts.slice(0, 3),
        optional_concepts: detectedConcepts.slice(3, 7),
      },
      relevance: {
        weight: 1,
        required_concepts: detectedConcepts.slice(2, 4),
        optional_concepts: detectedConcepts.slice(4, 8),
      },
    },
  };
}
