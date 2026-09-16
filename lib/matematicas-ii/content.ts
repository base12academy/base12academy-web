export type MatematicasIIUnit = {
  id: string;
  order: number;
  title: string;
  block: "Álgebra" | "Geometría" | "Análisis" | "Probabilidad";
  source: "mat2" | "shared-matccss";
};

export const MATEMATICAS_II_UNITS: MatematicasIIUnit[] = [
  { id: "T01", order: 1, title: "Matrices I: concepto y tipos", block: "Álgebra", source: "mat2" },
  { id: "T02", order: 2, title: "Matrices II: suma y resta", block: "Álgebra", source: "mat2" },
  { id: "T03", order: 3, title: "Matrices III: producto por escalar", block: "Álgebra", source: "mat2" },
  { id: "T04", order: 4, title: "Producto de matrices", block: "Álgebra", source: "mat2" },
  { id: "T05", order: 5, title: "Determinantes I: sentido del determinante y determinante de orden 2", block: "Álgebra", source: "mat2" },
  { id: "T06", order: 6, title: "Determinantes II: regla de Sarrus", block: "Álgebra", source: "mat2" },
  { id: "T07", order: 7, title: "Determinantes III: propiedades", block: "Álgebra", source: "mat2" },
  { id: "T08", order: 8, title: "Matriz inversa I: qué significa deshacer una matriz", block: "Álgebra", source: "mat2" },
  { id: "T09", order: 9, title: "Matriz inversa II: cálculo de la inversa", block: "Álgebra", source: "mat2" },
  { id: "T10", order: 10, title: "Rango de una matriz I: información independiente", block: "Álgebra", source: "mat2" },
  { id: "T11", order: 11, title: "Rango de una matriz II: cálculo mediante determinantes", block: "Álgebra", source: "mat2" },
  { id: "T12", order: 12, title: "Rango de una matriz III: cálculo por Gauss", block: "Álgebra", source: "mat2" },
  { id: "T13", order: 13, title: "Sistemas de ecuaciones I: del problema al sistema", block: "Álgebra", source: "mat2" },
  { id: "T14", order: 14, title: "Sistemas de ecuaciones II: método de Gauss", block: "Álgebra", source: "mat2" },
  { id: "T15", order: 15, title: "Sistemas de ecuaciones III: solución única", block: "Álgebra", source: "mat2" },
  { id: "T16", order: 16, title: "Sistemas de ecuaciones IV: infinitas soluciones", block: "Álgebra", source: "mat2" },
  { id: "T17", order: 17, title: "Sistemas de ecuaciones V: sistema incompatible", block: "Álgebra", source: "mat2" },
  { id: "T18", order: 18, title: "Rouché-Frobenius: clasificación de sistemas mediante rangos", block: "Álgebra", source: "mat2" },
  { id: "T19", order: 19, title: "Sistemas con parámetros I: decidir cuándo cambia el sistema", block: "Álgebra", source: "mat2" },
  { id: "T20", order: 20, title: "Sistemas con parámetros II: decidir casos sin perderse", block: "Álgebra", source: "mat2" },
  { id: "T21", order: 21, title: "Cómo discutir y resolver un sistema con parámetros sin perder casos", block: "Álgebra", source: "mat2" },

  { id: "T22", order: 22, title: "Cómo construir un vector entre dos puntos y calcular su módulo", block: "Geometría", source: "mat2" },
  { id: "T23", order: 23, title: "Cómo operar con vectores y reconocer combinaciones lineales", block: "Geometría", source: "mat2" },
  { id: "T24", order: 24, title: "Cómo usar el producto escalar para ángulos y perpendicularidad", block: "Geometría", source: "mat2" },
  { id: "T25", order: 25, title: "Cómo calcular el producto vectorial y usarlo para perpendicularidad y áreas", block: "Geometría", source: "mat2" },
  { id: "T26", order: 26, title: "Cómo usar el producto mixto para volumen y coplanaridad", block: "Geometría", source: "mat2" },
  { id: "T27", order: 27, title: "Cómo construir todas las ecuaciones de una recta en el espacio", block: "Geometría", source: "mat2" },
  { id: "T28", order: 28, title: "Cómo construir la ecuación de un plano desde los datos que da el problema", block: "Geometría", source: "mat2" },
  { id: "T29", order: 29, title: "Cómo decidir la posición relativa de rectas y planos", block: "Geometría", source: "mat2" },
  { id: "T30", order: 30, title: "Cómo calcular ángulos entre rectas, planos y recta con plano", block: "Geometría", source: "mat2" },
  { id: "T31", order: 31, title: "Cómo calcular distancias entre punto, recta y plano", block: "Geometría", source: "mat2" },
  { id: "T32", order: 32, title: "Cómo decidir y encadenar herramientas en un problema PAU de geometría del espacio", block: "Geometría", source: "mat2" },

  { id: "T33", order: 33, title: "Cómo calcular límites finitos y resolver indeterminaciones algebraicas", block: "Análisis", source: "mat2" },
  { id: "T34", order: 34, title: "Cómo estudiar límites infinitos y obtener asíntotas verticales, horizontales y oblicuas", block: "Análisis", source: "mat2" },
  { id: "T35", order: 35, title: "Cómo comprobar continuidad y clasificar una discontinuidad", block: "Análisis", source: "mat2" },
  { id: "T36", order: 36, title: "Cómo derivar funciones compuestas, productos y cocientes sin perder la estructura", block: "Análisis", source: "mat2" },
  { id: "T37", order: 37, title: "Cómo construir la recta tangente y la normal a una curva", block: "Análisis", source: "mat2" },
  { id: "T38", order: 38, title: "Cómo estudiar crecimiento, decrecimiento y extremos con la primera derivada", block: "Análisis", source: "mat2" },
  { id: "T39", order: 39, title: "Cómo estudiar curvatura y resolver optimización con derivadas", block: "Análisis", source: "mat2" },
  { id: "T40", order: 40, title: "Cómo representar una función a partir de su estudio analítico", block: "Análisis", source: "mat2" },
  { id: "T41", order: 41, title: "Cómo reconocer y calcular primitivas inmediatas en Matemáticas II", block: "Análisis", source: "mat2" },
  { id: "T42", order: 42, title: "Cómo elegir entre cambio de variable e integración por partes", block: "Análisis", source: "mat2" },
  { id: "T43", order: 43, title: "Cómo preparar e integrar funciones racionales mediante división y fracciones simples", block: "Análisis", source: "mat2" },
  { id: "T44", order: 44, title: "Cómo calcular una integral definida, áreas con signo y áreas entre curvas", block: "Análisis", source: "mat2" },
  { id: "T45", order: 45, title: "Cómo resolver un problema PAU completo de Análisis eligiendo y encadenando herramientas", block: "Análisis", source: "mat2" },

  { id: "MAT2-PROB-01", order: 46, title: "Probabilidad condicionada e independencia", block: "Probabilidad", source: "shared-matccss" },
  { id: "MAT2-PROB-02", order: 47, title: "Probabilidad total y teorema de Bayes", block: "Probabilidad", source: "shared-matccss" },
  { id: "MAT2-PROB-03", order: 48, title: "Variable aleatoria y distribución binomial", block: "Probabilidad", source: "shared-matccss" },
  { id: "MAT2-PROB-04", order: 49, title: "Distribución normal", block: "Probabilidad", source: "shared-matccss" },
];

export const MATEMATICAS_II_BLOCKS = ["Álgebra", "Geometría", "Análisis", "Probabilidad"] as const;

export const MATEMATICAS_II_STATS = {
  units: MATEMATICAS_II_UNITS.length,
  simulations: 17,
} as const;

export function getMatematicasIIUnit(id: string) {
  return MATEMATICAS_II_UNITS.find((unit) => unit.id === id) ?? null;
}
