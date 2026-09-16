import {
  formatTrainingValue,
  getOfficialTarget,
  nextTrainingTarget,
  trainingTestMap,
  type TrainingSex,
  type TrainingTestSlug,
} from "@/lib/training-config";

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
  status: "start" | "improving" | "stable" | "passed" | "consolidating";
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
  const latestPassed = latest !== null && (test.direction === "higher_is_better" ? latest >= official : latest <= official);
  const recentPassed = results.slice(0, 3).filter((result) => test.direction === "higher_is_better" ? result.result_value >= official : result.result_value <= official).length;
  const improved = latest !== null && previous !== null
    ? (test.direction === "higher_is_better" ? latest > previous : latest < previous)
    : false;
  const stable = latest !== null && previous !== null && Math.abs(latest - previous) < Math.max(test.step / 3, 0.1);
  const status: TrainingRecommendation["status"] = latest === null
    ? "start"
    : recentPassed >= 2
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
  } else if (recentPassed >= 2) {
    message = `Ya estás superando la referencia oficial con regularidad. Ahora buscamos consolidarla y ampliar el margen antes de la prueba real.`;
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
    sessionsBeforeControl: latestPassed ? 2 : 2,
    status,
  };
}
