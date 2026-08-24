export const tropaPlans = [
  {
    slug: "esencial",
    name: "Esencial",
    previousPrice: "179 €",
    currentPrice: "139 €",
    description: "La base de entrenamiento para comenzar con método, constancia y una práctica amplia.",
    includes: [
      "14.000 preguntas de entrenamiento",
      "Itinerario de preparación Tropa y Marinería",
      "Entrenamiento organizado para afianzar la base",
      "Acceso acumulativo dentro de la gama Tropa y Marinería",
    ],
    difference: "La opción de entrada para construir una base sólida de entrenamiento.",
  },
  {
    slug: "operativa",
    name: "Operativa",
    previousPrice: "249 €",
    currentPrice: "209 €",
    description: "Entrenamiento ampliado para aumentar el volumen de práctica y consolidar el rendimiento.",
    includes: [
      "Todo el alcance comercial del paquete Esencial",
      "21.000 preguntas de entrenamiento",
      "Itinerario ampliado de preparación Tropa y Marinería",
      "Mayor profundidad y continuidad de entrenamiento",
    ],
    difference: "Amplía Esencial con 7.000 preguntas adicionales y un recorrido de práctica más extenso.",
  },
  {
    slug: "integral",
    name: "Integral",
    previousPrice: "319 €",
    currentPrice: "279 €",
    description: "La preparación comercial más completa de la gama para entrenar con el máximo alcance previsto.",
    includes: [
      "Todo el alcance comercial del paquete Operativa",
      "28.000 preguntas de entrenamiento",
      "Itinerario completo de preparación Tropa y Marinería",
      "Máximo volumen y continuidad de entrenamiento",
    ],
    difference: "Amplía Operativa con 7.000 preguntas adicionales y el alcance completo de la gama.",
  },
] as const;

export type TropaPlan = (typeof tropaPlans)[number];

export function getTropaPlan(slug: string) {
  return tropaPlans.find((plan) => plan.slug === slug);
}
