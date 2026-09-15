export type ElementWithOxidationStates = {
  oxidationStates: string[];
};

/**
 * Educational formulation valences are shown as unsigned magnitudes.
 * The source data remains unchanged: signed oxidation states are displayed
 * separately because the two concepts are related but not interchangeable.
 */
export function formulationValences(element: ElementWithOxidationStates) {
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
