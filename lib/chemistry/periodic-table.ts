import periodicTableData from "@/data/chemistry/elements.json";

export type ElementCategory =
  | "actínido"
  | "metal alcalino"
  | "metal alcalinotérreo"
  | "halógeno"
  | "lantánido"
  | "metaloide"
  | "gas noble"
  | "no metal"
  | "metal postransición"
  | "metal de transición";

export type ChemicalElement = {
  atomicNumber: number;
  symbol: string;
  name: string;
  englishName: string;
  aliases: string[];
  atomicMass: string;
  atomicMassKind: "standard" | "longest-lived-isotope";
  electronConfiguration: string;
  electronegativity: number | null;
  atomicRadiusPm: number | null;
  ionizationEnergyEv: number | null;
  electronAffinityEv: number | null;
  oxidationStates: string[];
  standardState: string;
  meltingPointK: number | null;
  boilingPointK: number | null;
  densityGcm3: number | null;
  category: ElementCategory;
  discovered: string;
  period: number;
  group: number | null;
  block: "s" | "p" | "d" | "f";
};

export type TrendKey =
  | "none"
  | "electronegativity"
  | "atomicRadiusPm"
  | "ionizationEnergyEv"
  | "electronAffinityEv"
  | "meltingPointK"
  | "boilingPointK"
  | "densityGcm3";

type PeriodicTablePayload = {
  schemaVersion: number;
  generatedAt: string;
  sources: { name: string; url: string; fields: string }[];
  elements: ChemicalElement[];
};

export const periodicTable = periodicTableData as PeriodicTablePayload;
export const elements = periodicTable.elements;
export const elementCategories = [...new Set(elements.map((element) => element.category))];

export const trendDefinitions: Record<Exclude<TrendKey, "none">, {
  label: string;
  unit: string;
  explanation: string;
}> = {
  electronegativity: {
    label: "Electronegatividad",
    unit: "Pauling",
    explanation: "En general aumenta de izquierda a derecha y de abajo arriba. Los gases nobles sin valor recomendado se dejan sin color.",
  },
  atomicRadiusPm: {
    label: "Radio atómico",
    unit: "pm",
    explanation: "En general aumenta al bajar en un grupo y hacia la izquierda en un periodo; hay irregularidades por apantallamiento y contracción de los bloques d y f.",
  },
  ionizationEnergyEv: {
    label: "1.ª energía de ionización",
    unit: "eV",
    explanation: "En general aumenta hacia la derecha y hacia arriba, con excepciones ligadas a subniveles y configuraciones especialmente estables.",
  },
  electronAffinityEv: {
    label: "Afinidad electrónica",
    unit: "eV",
    explanation: "No sigue una progresión perfectamente monotónica. La configuración electrónica y la repulsión dentro de orbitales introducen excepciones importantes.",
  },
  meltingPointK: {
    label: "Punto de fusión",
    unit: "K",
    explanation: "Depende del tipo de enlace y de la estructura del sólido; no existe una única tendencia periódica simple.",
  },
  boilingPointK: {
    label: "Punto de ebullición",
    unit: "K",
    explanation: "Refleja la intensidad de las interacciones entre partículas y presenta cambios amplios entre familias y estructuras.",
  },
  densityGcm3: {
    label: "Densidad",
    unit: "g/cm³",
    explanation: "Combina masa atómica y empaquetamiento estructural. Los valores de gases son mucho menores y deben compararse teniendo presentes las condiciones de medida.",
  },
};

export function normalizeChemistryText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function matchesElementSearch(element: ChemicalElement, query: string) {
  const normalized = normalizeChemistryText(query);
  if (!normalized) return true;
  const searchable = [
    element.name,
    element.englishName,
    element.symbol,
    String(element.atomicNumber),
    ...element.aliases,
  ].map(normalizeChemistryText);
  return searchable.some((value) => value.includes(normalized));
}

export function trendValue(element: ChemicalElement, trend: TrendKey) {
  if (trend === "none") return null;
  return element[trend];
}

export function formatTrendValue(value: number | null, trend: Exclude<TrendKey, "none">) {
  if (value == null) return "Sin dato";
  const decimals = Math.abs(value) < 0.01 ? 6 : Math.abs(value) < 10 ? 3 : 2;
  return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: decimals }).format(value)} ${trendDefinitions[trend].unit}`;
}

function includesAny(query: string, words: string[]) {
  return words.some((word) => query.includes(normalizeChemistryText(word)));
}

export function inferTrend(question: string): Exclude<TrendKey, "none"> | null {
  const query = normalizeChemistryText(question);
  if (includesAny(query, ["electronegatividad", "electronegativo", "pauling"])) return "electronegativity";
  if (includesAny(query, ["radio atómico", "radio atomico", "tamaño atómico", "tamano atomico"])) return "atomicRadiusPm";
  if (includesAny(query, ["ionización", "ionizacion", "arrancar un electrón", "arrancar un electron"])) return "ionizationEnergyEv";
  if (includesAny(query, ["afinidad electrónica", "afinidad electronica"])) return "electronAffinityEv";
  if (includesAny(query, ["fusión", "fusion", "fundir"])) return "meltingPointK";
  if (includesAny(query, ["ebullición", "ebullicion", "hervir"])) return "boilingPointK";
  if (includesAny(query, ["densidad", "denso"])) return "densityGcm3";
  return null;
}

export function findMentionedElements(question: string) {
  const normalized = normalizeChemistryText(question);
  const originalTokens = question.match(/\b[A-Za-z]{1,3}\b/g) ?? [];
  const requestedNumbers = new Set(
    [...question.matchAll(/(?:z\s*=\s*|n(?:ú|u)mero\s+at(?:ó|o)mico\s+|#\s*)(\d{1,3})/gi)]
      .map((match) => Number(match[1]))
      .filter((number) => number >= 1 && number <= 118),
  );

  return elements.filter((element) => {
    if (requestedNumbers.has(element.atomicNumber)) return true;
    const names = [element.name, element.englishName, ...element.aliases].map(normalizeChemistryText);
    if (names.some((name) => new RegExp(`(^|\\W)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|\\W)`, "i").test(normalized))) return true;
    return originalTokens.some((token) => token === element.symbol);
  });
}

export type ClaraAnswer = {
  title: string;
  body: string;
  elementNumbers: number[];
};

export function answerClara(question: string): ClaraAnswer {
  const mentioned = findMentionedElements(question).slice(0, 4);
  const trend = inferTrend(question);

  if (mentioned.length >= 2) {
    const metric = trend ?? "electronegativity";
    const values = mentioned.map((element) => ({ element, value: trendValue(element, metric) }));
    const available = values.filter((item): item is { element: ChemicalElement; value: number } => item.value != null);
    const ordered = [...available].sort((a, b) => b.value - a.value);
    const unavailable = values.filter((item) => item.value == null).map((item) => item.element.name);
    const comparison = ordered.length
      ? ordered.map((item) => `${item.element.symbol}: ${formatTrendValue(item.value, metric)}`).join(" · ")
      : "La fuente no ofrece valores comparables para los elementos elegidos.";
    const caveat = unavailable.length ? ` Sin dato tabulado: ${unavailable.join(", ")}.` : "";
    return {
      title: `Comparación: ${trendDefinitions[metric].label}`,
      body: `${comparison}.${caveat} ${trendDefinitions[metric].explanation}`,
      elementNumbers: mentioned.map((element) => element.atomicNumber),
    };
  }

  if (mentioned.length === 1) {
    const element = mentioned[0];
    const metricSentence = trend
      ? `${trendDefinitions[trend].label}: ${formatTrendValue(trendValue(element, trend), trend)}.`
      : `Configuración electrónica: ${element.electronConfiguration}. Estados de oxidación tabulados: ${element.oxidationStates.join(", ") || "sin dato"}.`;
    return {
      title: `${element.name} (${element.symbol})`,
      body: `Z = ${element.atomicNumber}; masa ${element.atomicMassKind === "standard" ? "atómica estándar abreviada" : "del isótopo de referencia"} ${element.atomicMass}; grupo ${element.group ?? "serie f"}, periodo ${element.period}, bloque ${element.block}; ${element.category}. ${metricSentence}`,
      elementNumbers: [element.atomicNumber],
    };
  }

  if (trend) {
    return {
      title: trendDefinitions[trend].label,
      body: `${trendDefinitions[trend].explanation} Selecciona la tendencia en la tabla o nombra dos elementos para compararlos con sus valores tabulados.`,
      elementNumbers: [],
    };
  }

  return {
    title: "Puedo razonar con los datos de la tabla",
    body: "Prueba con «compara Na y Cl», «¿qué estados de oxidación tiene el hierro?» o «¿cómo cambia la energía de ionización en un periodo?». Si un valor no está tabulado, te lo diré en lugar de estimarlo.",
    elementNumbers: [],
  };
}
