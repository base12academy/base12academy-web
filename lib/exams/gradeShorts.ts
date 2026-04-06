import { normalizeText } from "./normalizeText";

type ShortQuestion = {
  id: string;
  question: string;
  answerGuide: string;
  keywords: string[];
};

export function gradeShorts(
  answers: Record<string, string>,
  questions: ShortQuestion[]
) {
  let totalCorrect = 0;

  const results = questions.map((q) => {
    const userAnswer = answers[q.id] || "";
    const normalizedAnswer = normalizeText(userAnswer);

    const matchedKeywords = q.keywords.filter((keyword) =>
      normalizedAnswer.includes(normalizeText(keyword))
    );

    const isCorrect = matchedKeywords.length > 0;

    if (isCorrect) {
      totalCorrect += 1;
    }

    return {
      id: q.id,
      question: q.question,
      userAnswer,
      matchedKeywords,
      isCorrect,
    };
  });

  const scoreOver3 = Number(((totalCorrect / 5) * 3).toFixed(2));

  return {
    totalCorrect,
    scoreOver3,
    results,
  };
}