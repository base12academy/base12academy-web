export type MatematicasAplicadasBlock = "Álgebra" | "Programación lineal" | "Análisis" | "Probabilidad" | "Inferencia";

export type MatematicasAplicadasUnit = {
  id: string;
  order: number;
  title: string;
  block: MatematicasAplicadasBlock;
};

export const MATEMATICAS_APLICADAS_UNITS: MatematicasAplicadasUnit[] = [
  { id: "T01", order: 1, title: "Cómo leer y construir una matriz a partir de datos", block: "Álgebra" },
  { id: "T02", order: 2, title: "Cómo sumar y restar matrices sin mezclar posiciones", block: "Álgebra" },
  { id: "T03", order: 3, title: "Cómo multiplicar una matriz por un número", block: "Álgebra" },
  { id: "T04", order: 4, title: "Cómo multiplicar matrices: compatibilidad, fila por columna y sentido", block: "Álgebra" },
  { id: "T05", order: 5, title: "Cómo calcular e interpretar un determinante de orden dos", block: "Álgebra" },
  { id: "T06", order: 6, title: "Cómo calcular un determinante de orden tres con Sarrus", block: "Álgebra" },
  { id: "T07", order: 7, title: "Cómo simplificar determinantes usando sus propiedades", block: "Álgebra" },
  { id: "T08", order: 8, title: "Cómo saber si una matriz tiene inversa y calcularla en orden dos", block: "Álgebra" },
  { id: "T09", order: 9, title: "Cómo obtener una matriz inversa por Gauss-Jordan", block: "Álgebra" },
  { id: "T10", order: 10, title: "Cómo detectar dependencia y estimar el rango de una matriz", block: "Álgebra" },
  { id: "T11", order: 11, title: "Cómo calcular el rango por menores", block: "Álgebra" },
  { id: "T12", order: 12, title: "Cómo calcular el rango por Gauss", block: "Álgebra" },
  { id: "T13", order: 13, title: "Cómo traducir un problema a un sistema de ecuaciones", block: "Álgebra" },
  { id: "T14", order: 14, title: "Cómo resolver un sistema por el método de Gauss", block: "Álgebra" },
  { id: "T15", order: 15, title: "Cómo reconocer, obtener y comprobar una solución única", block: "Álgebra" },
  { id: "T16", order: 16, title: "Cómo resolver un sistema con infinitas soluciones", block: "Álgebra" },
  { id: "T17", order: 17, title: "Cómo detectar un sistema incompatible", block: "Álgebra" },
  { id: "T18", order: 18, title: "Cómo clasificar sistemas con el teorema de Rouché-Frobenius", block: "Álgebra" },
  { id: "T19", order: 19, title: "Cómo discutir un sistema con un parámetro y un valor especial", block: "Álgebra" },
  { id: "T20", order: 20, title: "Cómo discutir un sistema con dos valores especiales y resultados distintos", block: "Álgebra" },
  { id: "T21", order: 21, title: "Cómo traducir un problema de programación lineal y construir la región factible", block: "Programación lineal" },
  { id: "T22", order: 22, title: "Cómo evaluar una función objetivo y decidir el óptimo", block: "Programación lineal" },
  { id: "T23", order: 23, title: "Cómo calcular límites: sustitución, laterales e indeterminación cero entre cero", block: "Análisis" },
  { id: "T24", order: 24, title: "Cómo encontrar asíntotas y describir el comportamiento infinito", block: "Análisis" },
  { id: "T25", order: 25, title: "Cómo comprobar continuidad y clasificar una discontinuidad", block: "Análisis" },
  { id: "T26", order: 26, title: "Cómo derivar una función y dar sentido al signo de la derivada", block: "Análisis" },
  { id: "T27", order: 27, title: "Cómo construir la recta tangente y la normal a una curva", block: "Análisis" },
  { id: "T28", order: 28, title: "Cómo estudiar crecimiento, decrecimiento y extremos con la primera derivada", block: "Análisis" },
  { id: "T29", order: 29, title: "Cómo resolver un problema de optimización en un intervalo", block: "Análisis" },
  { id: "T30", order: 30, title: "Cómo representar una función a partir de su estudio analítico", block: "Análisis" },
  { id: "T31", order: 31, title: "Cómo calcular primitivas y comprobar una integral indefinida", block: "Análisis" },
  { id: "T32", order: 32, title: "Cómo calcular una integral definida y distinguir área con signo de área geométrica", block: "Análisis" },
  { id: "T33", order: 33, title: "Cómo elegir la herramienta correcta en un problema PAU de análisis", block: "Análisis" },
  { id: "T34", order: 34, title: "Cómo construir el espacio muestral y trabajar con sucesos", block: "Probabilidad" },
  { id: "T35", order: 35, title: "Cómo aplicar Laplace, la unión y el complementario", block: "Probabilidad" },
  { id: "T36", order: 36, title: "Cómo calcular probabilidad condicionada y comprobar independencia", block: "Probabilidad" },
  { id: "T37", order: 37, title: "Cómo usar probabilidad total y Bayes con un árbol de causas", block: "Probabilidad" },
  { id: "T38", order: 38, title: "Cómo reconocer y calcular una distribución binomial", block: "Probabilidad" },
  { id: "T39", order: 39, title: "Cómo tipificar una normal y localizar el área que representa la probabilidad", block: "Probabilidad" },
  { id: "T40", order: 40, title: "Cómo elegir una muestra y distinguir parámetro, estadístico y estimación", block: "Inferencia" },
  { id: "T41", order: 41, title: "Cómo construir e interpretar un intervalo de confianza para la media", block: "Inferencia" },
  { id: "T42", order: 42, title: "Cómo construir un intervalo de confianza para una proporción", block: "Inferencia" },
  { id: "T43", order: 43, title: "Cómo plantear y decidir un contraste de hipótesis para una media", block: "Inferencia" },
  { id: "T44", order: 44, title: "Cómo reconocer y resolver el modelo estadístico correcto en un ejercicio PAU", block: "Inferencia" },
];

export const MATEMATICAS_APLICADAS_BLOCKS: MatematicasAplicadasBlock[] = [
  "Álgebra",
  "Programación lineal",
  "Análisis",
  "Probabilidad",
  "Inferencia",
];

export const MATEMATICAS_APLICADAS_STATS = {
  explanations: MATEMATICAS_APLICADAS_UNITS.length,
  videos: 44,
} as const;

export function getMatematicasAplicadasUnit(id: string) {
  return MATEMATICAS_APLICADAS_UNITS.find((unit) => unit.id === id) ?? null;
}
