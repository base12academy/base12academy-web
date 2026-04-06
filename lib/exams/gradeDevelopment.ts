import { normalizeText } from "./normalizeText";

export function gradeDevelopment(answer: string, expectedContent: string) {
  const normalizedAnswer = normalizeText(answer);
  const normalizedContent = normalizeText(expectedContent);

  const answerWords = normalizedAnswer.split(" ").filter(Boolean).length;

  const expectedWords = Array.from(
    new Set(
      normalizedContent
        .split(" ")
        .map((w) => w.trim())
        .filter((w) => w.length >= 5)
    )
  );

  const matchedWords = expectedWords.filter((word) =>
    normalizedAnswer.includes(word)
  );

  const ratio =
    expectedWords.length > 0 ? matchedWords.length / expectedWords.length : 0;

  let score = 0;

  if (answerWords < 30) {
    score = 0;
  } else if (ratio >= 0.02) {
    score = 3;
  } else if (ratio >= 0.01) {
    score = 2;
  } else if (ratio > 0) {
    score = 1;
  }

  return {
    score,
    matches: matchedWords.length,
    totalConcepts: expectedWords.length,
    ratio: Number(ratio.toFixed(4)),
  };
}