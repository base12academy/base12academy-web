import {
  formatTrainingValue,
  getOfficialTarget,
  nextTrainingTarget,
  trainingTestMap,
  type TrainingSex,
  type TrainingTestSlug,
} from "./training-config";

export type TrainingResultSnapshot = {
  result_value: number;
  performed_at?: string | null;
};

export type TrainingPrescription = {
  slug: string;
  name: string;
  dose: string;
};

export type TrainingRecommendation = {
  message: string;
  target: number;
  exercises: TrainingPrescription[];
  sessionsBeforeControl: number;
  status: "start" | "improving" | "stable" | "passed" | "consolidating" | "consolidated";
};

function selectExercises(testSlug: TrainingTestSlug, offset = 0) {
  const test = trainingTestMap[testSlug];
  const count = Math.min(4, test.exercises.length);
  return Array.from({ length: count }, (_, index) => {
    const item = test.exercises[(index + offset) % test.exercises.length];
    return { slug: item.slug, name: item.name, dose: item.defaultDose };
  });
}

export function buildLocalTrainingRecommendation(input: {
  testSlug: TrainingTestSlug;
  sex: TrainingSex;
  results: TrainingResultSnapshot[];
  sessionsSinceControl: number;
}): TrainingRecommendation {
  const { testSlug, sex, results, sessionsSinceControl } = input;
  const test = trainingTestMap[testSlug];
  const latest = results[0]?.result_value ?? null;
  const previous = results[1]?.result_value ?? null;
  const official = getOfficialTarget(test, sex);
  const target = nextTrainingTarget(test, latest, sex);
  const isPassed = (value: number) => test.direction === "higher_is_better" ? value >= official : value <= official;
  const latestPassed = latest !== null && isPassed(latest);
  const lastThree = results.slice(0, 3);
  const consecutivePassed = lastThree.findIndex((result) => !isPassed(result.result_value));
  const passedStreak = consecutivePassed === -1 ? lastThree.length : consecutivePassed;
  const improved = latest !== null && previous !== null
    ? (test.direction === "higher_is_better" ? latest > previous : latest < previous)
    : false;
  const stable = latest !== null && previous !== null && Math.abs(latest - previous) < Math.max(test.step / 3, 0.1);
  const status: TrainingRecommendation["status"] = latest === null
    ? "start"
    : passedStreak >= 3
      ? "consolidated"
      : passedStreak >= 2
        ? "consolidating"
        : latestPassed
          ? "passed"
          : improved
            ? "improving"
            : stable
              ? "stable"
              : "start";

  const offset = Math.max(0, results.length + sessionsSinceControl) % test.exercises.length;
  const exercises = selectExercises(testSlug, offset);
  const formattedTarget = formatTrainingValue(test, target);
  const formattedLatest = formatTrainingValue(test, latest);
  const officialText = formatTrainingValue(test, official);

  let message: string;
  if (latest === null) {
    message = `Registra una primera marca para personalizar el plan. Mientras tanto trabajaremos técnica y base específica de ${test.shortName}.`;
  } else if (passedStreak >= 3) {
    message = `La referencia oficial está consolidada en tres controles consecutivos. Mantendremos el trabajo específico para llegar a la prueba real con margen.`;
  } else if (passedStreak >= 2) {
    message = `Has superado la referencia oficial en dos controles consecutivos. Falta un control más para considerarla consolidada.`;
  } else if (latestPassed) {
    message = `Has superado la referencia oficial (${officialText}). Antes de darla por consolidada, repetiremos el trabajo específico y buscaremos ${formattedTarget}.`;
  } else if (improved) {
    message = `Has mejorado hasta ${formattedLatest}. Mantendremos la progresión y el siguiente objetivo será ${formattedTarget}.`;
  } else if (stable) {
    message = `Tu última marca se mantiene estable en ${formattedLatest}. Cambiaremos el estímulo dentro del plan para acercarnos a ${formattedTarget}.`;
  } else {
    message = `Tomamos ${formattedLatest} como punto de partida. El siguiente objetivo será ${formattedTarget} y trabajaremos los ejercicios indicados antes de repetir el control.`;
  }

  return {
    message,
    target,
    exercises,
    sessionsBeforeControl: 2,
    status,
  };
}
