export const OPO12_TIME_ZONE = "Europe/Madrid" as const;

export type Opo12Block = "theory" | "practical";
export type Opo12AttemptMode = "simulation" | "topic" | "review";

export const OPO12_TRAINING_QUESTION_COUNTS = [10, 20, 30, 50] as const;

export type Opo12ExamBlock = {
  id: Opo12Block;
  label: string;
  ordinaryQuestions: number;
  reserveQuestions: number;
  pointsPerCorrect: number;
  wrongAnswerDivisor: number;
  maximumPoints: number;
  passingPoints: number;
};

export type Opo12ExamProfile = {
  slug: string;
  name: string;
  shortName: string;
  callLabel: string;
  officialSourceUrl: string;
  officialSourcePublishedAt: string;
  durationMinutes: number;
  optionsPerQuestion: number;
  blocks: readonly Opo12ExamBlock[];
};

/**
 * Convocatoria libre publicada en BOJA 191, de 1 de octubre de 2024.
 * La versión queda fijada en cada intento: una convocatoria posterior solo
 * cambia los simulacros que se creen después de activar su nueva versión.
 */
export const C11000_EXAM_PROFILE: Opo12ExamProfile = {
  slug: "administrativos-junta-andalucia-c1-1000",
  name: "Cuerpo General de Administrativos de la Junta de Andalucía",
  shortName: "Administrativos Junta de Andalucía · C1.1000",
  callLabel: "Acceso libre · OEP 2022 y 2023",
  officialSourceUrl: "https://www.juntadeandalucia.es/boja/2024/191/25",
  officialSourcePublishedAt: "2024-10-01",
  durationMinutes: 180,
  optionsPerQuestion: 4,
  blocks: [
    {
      id: "theory",
      label: "Parte teórica",
      ordinaryQuestions: 75,
      reserveQuestions: 4,
      pointsPerCorrect: 1.2,
      wrongAnswerDivisor: 3,
      maximumPoints: 90,
      passingPoints: 36,
    },
    {
      id: "practical",
      label: "Parte práctica",
      ordinaryQuestions: 25,
      reserveQuestions: 3,
      pointsPerCorrect: 1.2,
      wrongAnswerDivisor: 3,
      maximumPoints: 30,
      passingPoints: 12,
    },
  ],
};

export const C11000_TOTAL_QUESTIONS = C11000_EXAM_PROFILE.blocks.reduce(
  (total, block) => total + block.ordinaryQuestions + block.reserveQuestions,
  0,
);

export const C11000_EVALUABLE_QUESTIONS = C11000_EXAM_PROFILE.blocks.reduce(
  (total, block) => total + block.ordinaryQuestions,
  0,
);
