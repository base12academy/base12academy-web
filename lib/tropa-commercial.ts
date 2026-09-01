export type TropaProductKind = "plan" | "aptitude" | "training";

export type TropaCommercialProduct = {
  slug: string;
  name: string;
  kind: TropaProductKind;
  previousPrice?: string;
  currentPrice: string;
  description: string;
  includes: readonly string[];
  difference?: string;
};

export const tropaPlans = [
  {
    slug: "esencial",
    name: "Esencial",
    kind: "plan",
    previousPrice: "179 €",
    currentPrice: "139 €",
    description: "La base de entrenamiento para comenzar con método, constancia y una práctica amplia.",
    includes: [
      "14.000 preguntas de entrenamiento",
      "Las 7 aptitudes psicotécnicas",
      "Entrenamiento organizado para afianzar la base",
      "Acceso acumulativo dentro de la gama Tropa y Marinería",
    ],
    difference: "La opción de entrada para construir una base sólida de entrenamiento.",
  },
  {
    slug: "operativa",
    name: "Operativa",
    kind: "plan",
    previousPrice: "249 €",
    currentPrice: "209 €",
    description: "Entrenamiento ampliado para aumentar el volumen de práctica y consolidar el rendimiento.",
    includes: [
      "Todo el paquete Esencial",
      "21.000 preguntas de entrenamiento",
      "Las 7 aptitudes psicotécnicas",
      "Mayor profundidad y continuidad de entrenamiento",
    ],
    difference: "Amplía Esencial con 7.000 preguntas adicionales.",
  },
  {
    slug: "integral",
    name: "Integral",
    kind: "plan",
    previousPrice: "319 €",
    currentPrice: "279 €",
    description: "La preparación más completa de la gama Base12 para Tropa y Marinería.",
    includes: [
      "Todo el paquete Operativa",
      "28.000 preguntas de entrenamiento",
      "Las 7 aptitudes psicotécnicas",
      "Máximo alcance de entrenamiento",
    ],
    difference: "Amplía Operativa con 7.000 preguntas adicionales y el alcance completo.",
  },
  {
    slug: "aptitud-verbal",
    name: "Aptitud Verbal",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Aptitud Verbal.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 12 familias",
      "Juegos: Intruso semántico, Parejas relámpago y Analogía táctica",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "aptitud-numerica",
    name: "Aptitud Numérica",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Aptitud Numérica.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 18 familias",
      "Juegos: Número objetivo, Estimación rápida y Caza la serie",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "aptitud-espacial",
    name: "Aptitud Espacial",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Aptitud Espacial.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 15 familias",
      "Juegos: Giro mental, Espejo o giro y Cierra el cubo",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "aptitud-mecanica",
    name: "Aptitud Mecánica",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Aptitud Mecánica.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 18 familias",
      "Juegos: Cadena de engranajes, Equilibra la palanca y ¿Qué ocurrirá?",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "aptitud-perceptiva",
    name: "Aptitud Perceptiva",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Aptitud Perceptiva.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 15 contenidos pedagógicos",
      "Juegos: Radar, El infiltrado y Comparación flash",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "memoria",
    name: "Memoria",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Memoria.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 15 contenidos pedagógicos",
      "Juegos: Kim Base12, ¿Qué cambió? y Mapa de memoria",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "razonamiento-abstracto",
    name: "Razonamiento Abstracto",
    kind: "aptitude",
    currentPrice: "39 €",
    description: "Entrenamiento independiente y completo de Razonamiento Abstracto.",
    includes: [
      "4.000 preguntas específicas",
      "Taller completo · 17 familias",
      "Juegos: Regla oculta, Matriz incompleta y Cazador de hipótesis",
      "20 simulacros específicos de 15 preguntas",
      "Rocío · Profesora IA",
      "Fernando · Tutor IA",
    ],
  },
  {
    slug: "base12-training",
    name: "Base12 Training",
    kind: "training",
    currentPrice: "29 €",
    description: "Paquete independiente de preparación física para Tropa y Marinería. Puedes contratarlo sin tener ningún otro paquete Base12.",
    includes: [
      "Compra independiente, sin requisitos previos",
      "Contenido disponible en breve",
      "Pendiente de revisión",
    ],
  },
] as const satisfies readonly TropaCommercialProduct[];

export type TropaPlan = (typeof tropaPlans)[number];

export function getTropaPlan(slug: string) {
  return tropaPlans.find((plan) => plan.slug === slug);
}

export function getTropaCatalogSlug(productSlug: string) {
  return `tropa-y-marineria-${productSlug}`;
}
