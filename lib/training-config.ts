export type TrainingTestSlug = "flexiones" | "plancha" | "carrera-2000" | "agilidad";
export type TrainingSex = "male" | "female";
export type TrainingDirection = "higher_is_better" | "lower_is_better";

export type TrainingExercise = {
  slug: string;
  name: string;
  defaultDose: string;
};

export type TrainingTest = {
  slug: TrainingTestSlug;
  name: string;
  shortName: string;
  unit: "repeticiones" | "segundos";
  direction: TrainingDirection;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  official: Record<TrainingSex, number>;
  step: number;
  videoUrl: string | null;
  exercises: TrainingExercise[];
};

export const TRAINING_COURSE_SLUG = "tropa-y-marineria";
export const TRAINING_PLAN_SLUG = "base12-training";

export const trainingTests: TrainingTest[] = [
  {
    slug: "flexiones",
    name: "Flexiones",
    shortName: "Flexiones",
    unit: "repeticiones",
    direction: "higher_is_better",
    accent: "#A9D6E5",
    accentStrong: "#4F8FA8",
    accentSoft: "#EEF8FC",
    official: { male: 9, female: 5 },
    step: 1,
    videoUrl: null,
    exercises: [
      { slug: "scapular-push-up", name: "Scapular Push-Up", defaultDose: "3 × 10" },
      { slug: "flexion-inclinada", name: "Flexión inclinada", defaultDose: "3 × 8" },
      { slug: "flexion-pecho", name: "Flexión de pecho", defaultDose: "3 × 6" },
      { slug: "plancha-alta", name: "Plancha alta", defaultDose: "3 × 20 s" },
      { slug: "toque-hombros", name: "Plancha + toque de hombros", defaultDose: "2 × 8/lado" },
      { slug: "band-pull-apart", name: "Band Pull-Apart", defaultDose: "2 × 12" },
      { slug: "rotacion-externa", name: "Rotación externa con goma", defaultDose: "2 × 12" },
    ],
  },
  {
    slug: "plancha",
    name: "Plancha",
    shortName: "Plancha",
    unit: "segundos",
    direction: "higher_is_better",
    accent: "#A8D5BA",
    accentStrong: "#4F8A64",
    accentSoft: "#EFF8F2",
    official: { male: 40, female: 40 },
    step: 5,
    videoUrl: null,
    exercises: [
      { slug: "bird-dog", name: "Bird-Dog", defaultDose: "3 × 8/lado" },
      { slug: "dead-bug", name: "Dead Bug", defaultDose: "3 × 8/lado" },
      { slug: "plancha-frontal", name: "Plancha frontal", defaultDose: "3 × 30 s" },
      { slug: "plancha-lateral", name: "Plancha lateral", defaultDose: "3 × 20 s/lado" },
      { slug: "bear-crawl", name: "Bear Crawl", defaultDose: "3 × 12 m" },
      { slug: "hollow-body", name: "Hollow Body Hold", defaultDose: "3 × 15 s" },
    ],
  },
  {
    slug: "carrera-2000",
    name: "Carrera 2000 m",
    shortName: "2000 m",
    unit: "segundos",
    direction: "lower_is_better",
    accent: "#C6B98B",
    accentStrong: "#8B7A46",
    accentSoft: "#F7F4E9",
    official: { male: 714, female: 778 },
    step: 15,
    videoUrl: null,
    exercises: [
      { slug: "skipping-a", name: "Skipping A", defaultDose: "3 × 20 m" },
      { slug: "skipping-b", name: "Skipping B", defaultDose: "3 × 20 m" },
      { slug: "talones-gluteo", name: "Talones al glúteo", defaultDose: "3 × 20 m" },
      { slug: "gemelo", name: "Elevaciones de gemelo", defaultDose: "3 × 15" },
      { slug: "progresivos", name: "Progresivos", defaultDose: "4 × 60 m" },
      { slug: "aceleracion-20-30", name: "Aceleración 20–30 m", defaultDose: "5 × 30 m" },
      { slug: "multisaltos", name: "Multisaltos suaves", defaultDose: "3 × 8" },
    ],
  },
  {
    slug: "agilidad",
    name: "Agilidad",
    shortName: "Agilidad",
    unit: "segundos",
    direction: "lower_is_better",
    accent: "#8FA3B1",
    accentStrong: "#5F7382",
    accentSoft: "#EFF4F7",
    official: { male: 15.4, female: 17.1 },
    step: 0.3,
    videoUrl: null,
    exercises: [
      { slug: "desplazamiento-lateral", name: "Desplazamiento lateral", defaultDose: "3 × 20 m" },
      { slug: "cambio-direccion", name: "Cambio de dirección", defaultDose: "4 × 20 m" },
      { slug: "aceleracion-frenada", name: "Aceleración + frenada", defaultDose: "4 × 15 m" },
      { slug: "carrera-atras", name: "Carrera hacia atrás", defaultDose: "3 × 20 m" },
      { slug: "saltos-laterales", name: "Saltos laterales", defaultDose: "3 × 10/lado" },
      { slug: "aceleraciones-cortas", name: "Aceleraciones cortas", defaultDose: "5 × 10 m" },
      { slug: "ladder-lateral", name: "Agility ladder lateral shuffle", defaultDose: "3 pasadas" },
    ],
  },
];

export const trainingTestMap = Object.fromEntries(trainingTests.map((test) => [test.slug, test])) as Record<TrainingTestSlug, TrainingTest>;

export function isTrainingTestSlug(value: string): value is TrainingTestSlug {
  return value in trainingTestMap;
}

export function getOfficialTarget(test: TrainingTest, sex: TrainingSex) {
  return test.official[sex];
}

export function formatTrainingValue(test: TrainingTest, value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (test.slug === "flexiones") return `${Math.round(value)} rep.`;
  if (test.slug === "plancha") return `${Math.round(value)} s`;
  if (test.slug === "agilidad") return `${value.toFixed(1).replace(".", ",")} s`;
  const total = Math.max(0, Math.round(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function nextTrainingTarget(test: TrainingTest, latest: number | null, sex: TrainingSex) {
  const official = getOfficialTarget(test, sex);
  if (latest === null || Number.isNaN(latest)) return official;
  if (test.direction === "higher_is_better") {
    if (latest < official) return Math.min(official, latest + test.step);
    return latest + test.step;
  }
  if (latest > official) return Math.max(official, latest - test.step);
  return Math.max(0, latest - test.step);
}

export function hasPassedOfficial(test: TrainingTest, value: number, sex: TrainingSex) {
  const official = getOfficialTarget(test, sex);
  return test.direction === "higher_is_better" ? value >= official : value <= official;
}
