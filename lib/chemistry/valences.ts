export type ElementWithOxidationStates = {
  symbol?: string;
  oxidationStates: string[];
};

// Valores de uso escolar en formulación inorgánica. Completan los estados
// frecuentes de PubChem cuando esa selección omite una valencia habitual.
const SCHOOL_FORMULATION_VALENCES: Record<string, number[]> = {
  B: [3],
  C: [2, 4],
  N: [1, 2, 3, 4, 5],
  O: [2],
  F: [1],
  Si: [4],
  P: [3, 5],
  S: [2, 4, 6],
  Cl: [1, 3, 5, 7],
  Mn: [2, 3, 4, 6, 7],
  As: [3, 5],
  Se: [2, 4, 6],
  Br: [1, 3, 5, 7],
  Sb: [3, 5],
  Te: [2, 4, 6],
  I: [1, 3, 5, 7],
};

/**
 * Educational formulation valences are unsigned magnitudes. The curated
 * school set takes priority where present; other elements use the magnitudes
 * of their verified, tabulated oxidation states. Signed oxidation states are
 * always preserved and displayed separately.
 */
export function formulationValences(element: ElementWithOxidationStates) {
  if (element.symbol && SCHOOL_FORMULATION_VALENCES[element.symbol]) {
    return [...SCHOOL_FORMULATION_VALENCES[element.symbol]];
  }

  const nonZeroValences = element.oxidationStates
    .map((state) => Number(state))
    .filter(Number.isFinite)
    .map(Math.abs)
    .filter((value) => value > 0);
  const valences = [...new Set(nonZeroValences)].sort((a, b) => a - b);

  if (valences.length > 0) return valences;
  return element.oxidationStates.some((state) => Number(state) === 0) ? [0] : [];
}

export function formatFormulationValences(element: ElementWithOxidationStates) {
  const valences = formulationValences(element);
  return valences.length ? valences.join(", ") : "Sin dato verificado";
}
