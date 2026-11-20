export const healthOppositions = {
  "telefonista-sas": {
    title: "Telefonista del Servicio Andaluz de Salud", shortTitle: "Telefonista SAS",
    themes: 29, standardModels: 6, premiumModels: 12,
  },
  "celador-sermas": {
    title: "Celador del SERMAS", shortTitle: "Celador SERMAS",
    themes: 16, standardModels: 10, premiumModels: 10,
  },
  "celador-chguv-co32-24": {
    title: "Celador del Consorcio Hospital General Universitario de Valencia (CHGUV) · CO/32/24", shortTitle: "Celador CHGUV",
    themes: 28, standardModels: 8, premiumModels: 8,
  },
  "auxiliar-administrativo-chguv-co34-24": {
    title: "Auxiliar Administrativo del Consorcio Hospital General Universitario de Valencia (CHGUV) · CO/34/24", shortTitle: "Auxiliar Administrativo CHGUV",
    themes: 31, standardModels: 10, premiumModels: 10,
  },
} as const;

export type HealthCourseSlug = keyof typeof healthOppositions;
