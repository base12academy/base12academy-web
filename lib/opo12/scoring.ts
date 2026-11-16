import type { Opo12Block, Opo12ExamProfile } from "./config";

export type Opo12QuestionForScoring = {
  id: string;
  block: Opo12Block;
  isReserve: boolean;
  reserveOrder?: number | null;
  correctOption: string;
  annulled?: boolean;
};

export type Opo12BlockResult = {
  block: Opo12Block;
  correct: number;
  wrong: number;
  blank: number;
  annulled: number;
  score: number;
  maximumPoints: number;
  passingPoints: number;
  passed: boolean;
};

export type Opo12Score = {
  correct: number;
  wrong: number;
  blank: number;
  annulled: number;
  score: number;
  maximumPoints: number;
  passed: boolean;
  blocks: Opo12BlockResult[];
};

export type Opo12TrainingScore = {
  correct: number;
  wrong: number;
  blank: number;
  total: number;
  percentage: number;
};

function round(value: number) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

/**
 * Deterministic correction. Reserve questions only replace annulled ordinary
 * questions from the same block and are consumed in their official order.
 */
export function scoreOpo12Attempt(
  profile: Opo12ExamProfile,
  questions: readonly Opo12QuestionForScoring[],
  answers: Readonly<Record<string, string | null | undefined>>,
): Opo12Score {
  const blocks = profile.blocks.map((rule): Opo12BlockResult => {
    const ordinary = questions.filter(
      (question) => question.block === rule.id && !question.isReserve,
    );
    const reserve = questions
      .filter((question) => question.block === rule.id && question.isReserve)
      .sort((a, b) => (a.reserveOrder ?? 999) - (b.reserveOrder ?? 999));
    const annulledOrdinary = ordinary.filter((question) => question.annulled);
    const replacements = reserve.slice(0, annulledOrdinary.length);
    const evaluable = [
      ...ordinary.filter((question) => !question.annulled),
      ...replacements.filter((question) => !question.annulled),
    ];

    let correct = 0;
    let wrong = 0;
    let blank = 0;
    for (const question of evaluable) {
      const answer = String(answers[question.id] ?? "").toUpperCase();
      if (!answer) blank += 1;
      else if (answer === question.correctOption.toUpperCase()) correct += 1;
      else wrong += 1;
    }

    const score = round(
      Math.max(0, rule.pointsPerCorrect * (correct - wrong / rule.wrongAnswerDivisor)),
    );
    return {
      block: rule.id,
      correct,
      wrong,
      blank,
      annulled: annulledOrdinary.length,
      score,
      maximumPoints: rule.maximumPoints,
      passingPoints: rule.passingPoints,
      passed: score >= rule.passingPoints,
    };
  });

  return {
    correct: blocks.reduce((sum, block) => sum + block.correct, 0),
    wrong: blocks.reduce((sum, block) => sum + block.wrong, 0),
    blank: blocks.reduce((sum, block) => sum + block.blank, 0),
    annulled: blocks.reduce((sum, block) => sum + block.annulled, 0),
    score: round(blocks.reduce((sum, block) => sum + block.score, 0)),
    maximumPoints: blocks.reduce((sum, block) => sum + block.maximumPoints, 0),
    passed: blocks.every((block) => block.passed),
    blocks,
  };
}

/** Los entrenamientos miden dominio; no imitan la nota oficial del simulacro. */
export function scoreOpo12Training(
  questions: readonly Pick<Opo12QuestionForScoring, "id" | "correctOption">[],
  answers: Readonly<Record<string, string | null | undefined>>,
): Opo12TrainingScore {
  let correct = 0;
  let wrong = 0;
  let blank = 0;
  for (const question of questions) {
    const answer = String(answers[question.id] ?? "").toUpperCase();
    if (!answer) blank += 1;
    else if (answer === question.correctOption.toUpperCase()) correct += 1;
    else wrong += 1;
  }
  return {
    correct,
    wrong,
    blank,
    total: questions.length,
    percentage: questions.length ? round((correct / questions.length) * 100) : 0,
  };
}
