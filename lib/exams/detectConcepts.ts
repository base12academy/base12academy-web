import { CONCEPTS } from "./concepts";

export function detectConcepts(text: string): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  for (const concept in CONCEPTS) {
    const variants = CONCEPTS[concept];

    result[concept] = variants.some((variant) =>
      text.includes(variant)
    );
  }

  return result;
}