type UnitEvaluationMeta = {
  id: string;
  title: string;
  criterion: string;
  error: string;
};

export type RocioQuestion = {
  id: string;
  scope: string;
  unit: string;
  title: string;
  question: string;
  options: Record<"A" | "B" | "C" | "D", string>;
  correct: "A" | "B" | "C" | "D";
  feedback: string;
  recovery: string;
};

export type ShortQuestion = {
  id: string;
  scope: string;
  unit: string;
  title: string;
  question: string;
  expectedAnswer: string;
  rubric: string;
};

const UNIT_META: UnitEvaluationMeta[] = [
  { id: "T01", title: "Matrices: significado, dimensiones y tipos", criterion: "Reconocer qué representa una matriz, su orden y tipos básicos.", error: "Confundir filas con columnas." },
  { id: "T02", title: "Suma y resta de matrices", criterion: "Comprobar igualdad de dimensiones y operar elemento a elemento.", error: "Sumar matrices de distinto orden." },
  { id: "T03", title: "Producto de una matriz por un escalar", criterion: "Multiplicar todos los elementos por el escalar.", error: "Multiplicar solo una fila o columna." },
  { id: "T04", title: "Producto de matrices", criterion: "Comprobar columnas de la primera = filas de la segunda y aplicar fila por columna.", error: "Multiplicar elemento a elemento." },
  { id: "T05", title: "Determinantes: significado y cálculo básico", criterion: "Usar el determinante para invertibilidad y cálculo algebraico.", error: "Tratar el determinante como una matriz." },
  { id: "T06", title: "Determinantes 3×3 y regla de Sarrus", criterion: "Organizar diagonales positivas y negativas sin perder signos.", error: "Sumar todas las diagonales con el mismo signo." },
  { id: "T07", title: "Propiedades de los determinantes", criterion: "Aplicar efectos de permutar, escalar o combinar filas/columnas.", error: "Aplicar propiedades de matrices al determinante sin ajuste." },
  { id: "T08", title: "Invertibilidad de una matriz", criterion: "Decidir A invertible ⇔ det(A)≠0.", error: "Concluir invertibilidad sin comprobar determinante/rango." },
  { id: "T09", title: "Cálculo de la matriz inversa", criterion: "Calcular A⁻¹ y verificar A·A⁻¹=I.", error: "Olvidar el factor 1/det(A) o no verificar." },
  { id: "T10", title: "Rango de una matriz por menores", criterion: "Buscar el mayor menor no nulo.", error: "Concluir rango por un menor nulo sin seguir buscando." },
  { id: "T11", title: "Rango por eliminación de Gauss", criterion: "Reducir por filas y contar filas no nulas/pivotes.", error: "Confundir operaciones elementales válidas." },
  { id: "T12", title: "Ecuaciones matriciales", criterion: "Aislar la incógnita respetando el orden no conmutativo.", error: "Cambiar el orden de productos como si AB=BA." },
  { id: "T13", title: "Del problema al sistema de ecuaciones", criterion: "Definir incógnitas y traducir cada relación a una ecuación.", error: "Operar antes de definir qué representa cada incógnita." },
  { id: "T14", title: "Matriz de coeficientes y matriz ampliada", criterion: "Distinguir A y A* y su papel en la clasificación.", error: "Meter términos independientes en el determinante de A." },
  { id: "T15", title: "Sistemas con solución única", criterion: "Reconocer rango completo/determinante no nulo y resolver.", error: "Dar solución sin comprobar sustitución." },
  { id: "T16", title: "Resolución de sistemas por Gauss", criterion: "Escalonar sin cambiar el conjunto de soluciones.", error: "Hacer operaciones de fila incoherentes en ambos lados." },
  { id: "T17", title: "Teorema de Rouché–Frobenius", criterion: "Comparar rangos de A y A* con número de incógnitas.", error: "Usar det=0 como conclusión final." },
  { id: "T18", title: "Sistemas compatibles indeterminados e incompatibles", criterion: "Parametrizar cuando faltan pivotes o detectar contradicción.", error: "Confundir infinitas soluciones con ausencia de solución." },
  { id: "T19", title: "Sistemas con parámetros: valores críticos", criterion: "Calcular valores donde cambia rango/determinante.", error: "Resolver solo el caso general." },
  { id: "T20", title: "Discusión completa de sistemas con parámetros", criterion: "Separar casos, comparar rangos y resolver/parametrizar cada uno.", error: "No sustituir los valores críticos en A y A*." },
  { id: "T21", title: "Cómo discutir y resolver un sistema con parámetros sin perder casos", criterion: "determinante/rangos → casos → solución", error: "quedarse solo con el caso general" },
  { id: "T22", title: "Cómo construir un vector entre dos puntos y calcular su módulo", criterion: "vector final−inicial y módulo", error: "restar puntos en orden inverso sin interpretar el sentido" },
  { id: "T23", title: "Cómo operar con vectores y reconocer combinaciones lineales", criterion: "suma, producto por escalar y combinación lineal", error: "confundir combinación lineal con producto escalar" },
  { id: "T24", title: "Cómo usar el producto escalar para ángulos y perpendicularidad", criterion: "u·v, módulos y coseno", error: "olvidar valor absoluto para ángulo geométrico" },
  { id: "T25", title: "Cómo calcular el producto vectorial y usarlo para perpendicularidad y áreas", criterion: "u×v, perpendicularidad y módulo como área", error: "intercambiar orden sin cambiar signo" },
  { id: "T26", title: "Cómo usar el producto mixto para volumen y coplanaridad", criterion: "determinante/producto mixto y valor absoluto", error: "usar el signo como volumen" },
  { id: "T27", title: "Cómo construir todas las ecuaciones de una recta en el espacio", criterion: "punto+director → vectorial/paramétrica/continua", error: "dividir por componente directora cero" },
  { id: "T28", title: "Cómo construir la ecuación de un plano desde los datos que da el problema", criterion: "punto+normal o tres puntos", error: "usar dos vectores paralelos como directores del plano" },
  { id: "T29", title: "Cómo decidir la posición relativa de rectas y planos", criterion: "comparar directores/normales y resolver sistemas", error: "decidir solo por aspecto de ecuaciones" },
  { id: "T30", title: "Cómo calcular ángulos entre rectas, planos y recta con plano", criterion: "directores/normales y fórmulas adecuadas", error: "usar coseno de normales para recta-plano sin complementar" },
  { id: "T31", title: "Cómo calcular distancias entre punto, recta y plano", criterion: "perpendicularidad/área sobre base y fórmulas de distancia", error: "usar distancia euclídea a un punto arbitrario de la recta" },
  { id: "T32", title: "Cómo decidir y encadenar herramientas en un problema PAU de geometría del espacio", criterion: "identificar objeto/pregunta → ecuación/posición/ángulo/distancia", error: "empezar a operar sin clasificar" },
  { id: "T33", title: "Cómo calcular límites finitos y resolver indeterminaciones algebraicas", criterion: "sustitución regular y transformaciones en 0/0", error: "cancelar factores sin declarar restricción" },
  { id: "T34", title: "Cómo estudiar límites infinitos y obtener asíntotas verticales, horizontales y oblicuas", criterion: "laterales y comportamiento al infinito", error: "confundir grado con demostración completa de oblicua" },
  { id: "T35", title: "Cómo comprobar continuidad y clasificar una discontinuidad", criterion: "laterales/límite/valor", error: "confundir punto no definido con salto" },
  { id: "T36", title: "Cómo derivar funciones compuestas, productos y cocientes sin perder la estructura", criterion: "identificar regla exterior/interior, producto o cociente", error: "derivar producto como producto de derivadas" },
  { id: "T37", title: "Cómo construir la recta tangente y la normal a una curva", criterion: "punto+f′(a), caso pendiente cero", error: "dividir por cero para la normal" },
  { id: "T38", title: "Cómo estudiar crecimiento, decrecimiento y extremos con la primera derivada", criterion: "críticos + signo + coordenadas", error: "declarar máximo porque f′=0" },
  { id: "T39", title: "Cómo estudiar curvatura y resolver optimización con derivadas", criterion: "f″ para concavidad/inflexión + modelización de optimización", error: "declarar inflexión solo porque f″=0" },
  { id: "T40", title: "Cómo representar una función a partir de su estudio analítico", criterion: "dominio/asíntotas/f′/f″ → gráfica", error: "presentar gráfica sin cálculos" },
  { id: "T41", title: "Cómo reconocer y calcular primitivas inmediatas en Matemáticas II", criterion: "familia de primitivas, reglas y casos especiales", error: "usar regla de potencia en n=−1" },
  { id: "T42", title: "Cómo elegir entre cambio de variable e integración por partes", criterion: "reconocer composición vs producto y ejecutar sustitución/partes", error: "elegir partes solo porque hay un producto" },
  { id: "T43", title: "Cómo preparar e integrar funciones racionales mediante división y fracciones simples", criterion: "simplificar → dividir → factorizar → fracciones parciales", error: "aplicar fracciones simples sin mirar grados/factores" },
  { id: "T44", title: "Cómo calcular una integral definida, áreas con signo y áreas entre curvas", criterion: "intersecciones + orden de funciones + integral por tramos", error: "integrar f−g sin comprobar cuál está arriba" },
  { id: "T45", title: "Cómo resolver un problema PAU completo de Análisis eligiendo y encadenando herramientas", criterion: "clasificar cada apartado y justificar", error: "mezclar herramientas sin responder a cada verbo" },
  { id: "MAT2-PROB-01", title: "Cómo calcular probabilidad condicionada y comprobar independencia", criterion: "P(A|B)=P(A∩B)/P(B); independencia por producto", error: "invertir condicionada" },
  { id: "MAT2-PROB-02", title: "Cómo usar probabilidad total y Bayes con un árbol de causas", criterion: "partición → total → posterior de Bayes", error: "confundir causa con efecto" },
  { id: "MAT2-PROB-03", title: "Cómo reconocer y calcular una distribución binomial", criterion: "comprobar ensayos, independencia, p constante y contar éxitos", error: "usar binomial si p cambia" },
  { id: "MAT2-PROB-04", title: "Cómo tipificar una normal y localizar el área que representa la probabilidad", criterion: "z=(x−μ)/σ y elegir cola/intervalo", error: "leer la tabla sin dibujar/identificar área" },
];

const LETTERS = ["A", "B", "C", "D"] as const;
type Letter = (typeof LETTERS)[number];

function sourcePrefix(id: string) {
  if (id.startsWith("MAT2-PROB-")) return id;
  const n = Number(id.slice(1));
  return n <= 20 ? `COM${String(n).padStart(2, "0")}` : `MAT2-T${String(n).padStart(2, "0")}`;
}

function scopeFor(id: string) {
  return id.startsWith("T") && Number(id.slice(1)) <= 20 ? "COMÚN MAT2+MACS" : "MAT2";
}

function correctSequence(id: string): [Letter, Letter, Letter] {
  if (id === "MAT2-PROB-01") return ["B", "C", "D"];
  if (id === "MAT2-PROB-02") return ["A", "B", "C"];
  if (id === "MAT2-PROB-03") return ["D", "A", "B"];
  if (id === "MAT2-PROB-04") return ["C", "D", "A"];
  const n = Number(id.slice(1));
  const pattern: [Letter, Letter, Letter][] = [
    ["B", "C", "D"],
    ["A", "B", "C"],
    ["D", "A", "B"],
    ["C", "D", "A"],
  ];
  return pattern[n % 4];
}

function orderedOptions(correct: Letter, correctText: string, distractors: string[]) {
  const options = {} as Record<Letter, string>;
  let j = 0;
  for (const letter of LETTERS) {
    options[letter] = letter === correct ? correctText : distractors[j++];
  }
  return options;
}

export function getRocioQuestions(unitId: string): RocioQuestion[] {
  const meta = UNIT_META.find((item) => item.id === unitId);
  if (!meta) return [];
  const [r1, r2, r3] = correctSequence(meta.id);
  const prefix = sourcePrefix(meta.id);
  const scope = scopeFor(meta.id);
  const verify = `Volver a los datos y condiciones y verificar que el resultado es coherente con el procedimiento: ${meta.criterion}.`;

  return [
    {
      id: `${prefix}-R01`, scope, unit: meta.id, title: meta.title,
      question: `¿Cuál es el criterio de trabajo más seguro en «${meta.title}»?`,
      options: orderedOptions(r1, meta.criterion, [
        "Aplicar cualquier fórmula que contenga los mismos símbolos.",
        "Dar el resultado sin justificar para ahorrar tiempo.",
        "Sustituir números antes de identificar qué se pide.",
      ]),
      correct: r1,
      feedback: `La respuesta correcta resume el procedimiento Base12: ${meta.criterion}.`,
      recovery: "Vuelve a identificar la pregunta, las condiciones del método y el primer paso. No empieces por la cuenta.",
    },
    {
      id: `${prefix}-R02`, scope, unit: meta.id, title: meta.title,
      question: `¿Qué error debe evitarse especialmente en «${meta.title}»?`,
      options: orderedOptions(r2, meta.error, [
        "Escribir las unidades cuando existen.",
        "Comprobar el resultado al final.",
        "Separar casos si el procedimiento lo exige.",
      ]),
      correct: r2,
      feedback: `El error característico es ${meta.error}.`,
      recovery: "Localiza qué condición o interpretación se está saltando. Un procedimiento correcto no depende solo de operar.",
    },
    {
      id: `${prefix}-R03`, scope, unit: meta.id, title: meta.title,
      question: `Después de resolver «${meta.title}», ¿qué comprobación final es la más sólida?`,
      options: orderedOptions(r3, verify, [
        "Aceptar el resultado si coincide con la calculadora, aunque no se ajuste a las condiciones.",
        "Redondear la respuesta hasta que parezca razonable.",
        "Eliminar cualquier caso que complique la solución.",
      ]),
      correct: r3,
      feedback: `La verificación debe volver al problema y al criterio usado en «${meta.title}»; no basta con que la cuenta produzca un número.`,
      recovery: `Revisa las condiciones de «${meta.title}» y comprueba el resultado por sustitución, propiedad independiente o interpretación, según corresponda.`,
    },
  ];
}

export function getShortQuestions(unitId: string): ShortQuestion[] {
  const meta = UNIT_META.find((item) => item.id === unitId);
  if (!meta) return [];
  const prefix = sourcePrefix(meta.id);
  const scope = scopeFor(meta.id);
  return [
    {
      id: `${prefix}-C01`, scope, unit: meta.id, title: meta.title,
      question: `Explica en 3–5 líneas cómo reconocerías que un ejercicio exige el procedimiento de «${meta.title}» y cuál sería tu primer paso.`,
      expectedAnswer: `Debe identificar los datos/palabras matemáticas relevantes, verificar las condiciones del procedimiento y comenzar por: ${meta.criterion}.`,
      rubric: "2 puntos: 0,75 reconocimiento; 0,75 primer paso correcto; 0,50 justificación/condiciones.",
    },
    {
      id: `${prefix}-C02`, scope, unit: meta.id, title: meta.title,
      question: `Indica un error frecuente en «${meta.title}» y explica cómo comprobarías que no lo has cometido.`,
      expectedAnswer: `Error de referencia: ${meta.error}. La comprobación debe volver a las condiciones, sustituir el resultado o contrastar con una propiedad independiente.`,
      rubric: "2 puntos: 0,75 error pertinente; 0,75 comprobación válida; 0,50 claridad matemática.",
    },
  ];
}

export function hasEvaluationUnit(unitId: string) {
  return UNIT_META.some((item) => item.id === unitId);
}
