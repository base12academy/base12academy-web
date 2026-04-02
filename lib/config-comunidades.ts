export type ComunidadId =
  | "andalucia"
  | "madrid"
  | "valencia"
  | "castilla_leon"
  | "galicia"
  | "aragon"
  | "navarra"
  | "rioja"
  | "cantabria"
  | "murcia"
  | "extremadura"
  | "ministerio";

export type ConfigComunidad = {
  nombre: string;
  tipoExamen: "desarrollo" | "epigrafes" | "fuentes" | "mixto";
  enfoque: string;
  bloquesClave: number[] | "todos";
  consejos: string[];
};

export const CONFIG_COMUNIDADES: Record<ComunidadId, ConfigComunidad> = {
  ministerio: {
    nombre: "Modelo Ministerio / Exterior",
    tipoExamen: "mixto",
    enfoque: "equilibrado",
    bloquesClave: [5,6,7,8,9,10,11,12],
    consejos: [
      "Domina los bloques 5 al 12 (1808 hasta hoy)",
      "El peso está en comentario de texto y tema contemporáneo",
      "Las preguntas iniciales son cortas",
    ],
  },

  andalucia: {
    nombre: "Andalucía",
    tipoExamen: "desarrollo",
    enfoque: "redacción",
    bloquesClave: [5,6,7,8,9,10,11,12],
    consejos: [
      "Debes saber redactar temas largos con claridad",
      "Enfócate en siglos XIX y XX",
      "Evita respuestas esquemáticas",
    ],
  },

  madrid: {
    nombre: "Madrid",
    tipoExamen: "epigrafes",
    enfoque: "precisión",
    bloquesClave: "todos",
    consejos: [
      "Domina epígrafes concretos",
      "Usa vocabulario histórico preciso",
      "Evita respuestas generales",
    ],
  },

  valencia: {
    nombre: "Comunidad Valenciana",
    tipoExamen: "fuentes",
    enfoque: "análisis",
    bloquesClave: [5,6,7,8,9,10,11,12],
    consejos: [
      "Practica análisis de imágenes y textos",
      "Relaciona documento con contexto histórico",
      "Refuerza industrialización del XIX",
    ],
  },

  castilla_leon: {
    nombre: "Castilla y León",
    tipoExamen: "desarrollo",
    enfoque: "estructura",
    bloquesClave: "todos",
    consejos: [
      "Responde con estructura clara: causas, desarrollo y consecuencias",
      "Prepara preguntas tipo cerradas",
      "Refuerza Edad Media y Reyes Católicos",
    ],
  },

  galicia: {
    nombre: "Galicia",
    tipoExamen: "mixto",
    enfoque: "regional + contemporáneo",
    bloquesClave: [5,6,7,8,9,10,11,12],
    consejos: [
      "Incluye Rexurdimento en tus respuestas",
      "Relaciona emigración con economía",
      "Foco en siglos XIX y XX",
    ],
  },

  aragon: {
    nombre: "Aragón",
    tipoExamen: "fuentes",
    enfoque: "técnico",
    bloquesClave: "todos",
    consejos: [
      "Domina los Fueros",
      "Entiende Decretos de Nueva Planta",
      "Análisis de fuentes obligatorio",
    ],
  },

  navarra: {
    nombre: "Navarra",
    tipoExamen: "mixto",
    enfoque: "foral",
    bloquesClave: "todos",
    consejos: [
      "Domina el Carlismo",
      "Entiende evolución de los Fueros",
      "Incluye LORAFNA",
    ],
  },

  rioja: {
    nombre: "La Rioja",
    tipoExamen: "mixto",
    enfoque: "social",
    bloquesClave: [5,6,7,8,9,10,11,12],
    consejos: [
      "Refuerza reforma agraria",
      "Movimientos sociales del XIX",
    ],
  },

  cantabria: {
    nombre: "Cantabria",
    tipoExamen: "mixto",
    enfoque: "contemporáneo",
    bloquesClave: [6,7,8,9,10,11,12],
    consejos: [
      "Foco en Segunda República",
      "Guerra Civil importante",
    ],
  },

  murcia: {
    nombre: "Murcia",
    tipoExamen: "mixto",
    enfoque: "estándares",
    bloquesClave: [6,7,8,9,10,11,12],
    consejos: [
      "Refuerza Restauración",
      "Impacto minería y agricultura",
    ],
  },

  extremadura: {
    nombre: "Extremadura",
    tipoExamen: "mixto",
    enfoque: "agrario",
    bloquesClave: [6,7,8,9,10,11,12],
    consejos: [
      "Reforma agraria clave",
      "Plan Badajoz importante",
    ],
  },
};