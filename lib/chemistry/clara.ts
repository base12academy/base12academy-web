import {
  answerClara,
  elements,
  findMentionedElements,
  periodicTable,
  trendDefinitions,
} from "@/lib/chemistry/periodic-table";
import { formulationValences } from "@/lib/chemistry/valences";

const MAX_CONTEXT_ELEMENTS = 6;

export function buildClaraContext(question: string, preferredAtomicNumbers: number[] = []) {
  const localAnswer = answerClara(question);
  const contextualElements = [
    ...findMentionedElements(question),
    ...preferredAtomicNumbers.map((number) => elements[number - 1]).filter(Boolean),
  ].filter(
    (element, index, collection) =>
      collection.findIndex((candidate) => candidate.atomicNumber === element.atomicNumber) === index,
  ).slice(0, MAX_CONTEXT_ELEMENTS);

  const elementNumbers = [...new Set([
    ...localAnswer.elementNumbers,
    ...contextualElements.map((element) => element.atomicNumber),
  ])].slice(0, 4);

  const grounding = {
    rules: {
      atomicMass: "CIAAW 2024; los valores entre corchetes son números másicos de referencia, no pesos atómicos estándar",
      missingValues: "null significa que la fuente no ofrece un valor tabulado; no debe estimarse",
      valence: "formulationValences contiene valores sin signo de uso escolar verificados frente a fuentes didácticas y a los estados de oxidación tabulados; valencia y estado de oxidación no deben presentarse como sinónimos",
      trends: Object.fromEntries(
        Object.entries(trendDefinitions).map(([key, value]) => [key, value.explanation]),
      ),
    },
    elements: contextualElements.map((element) => ({
      atomicNumber: element.atomicNumber,
      symbol: element.symbol,
      name: element.name,
      atomicMass: element.atomicMass,
      atomicMassKind: element.atomicMassKind,
      electronConfiguration: element.electronConfiguration,
      electronegativityPauling: element.electronegativity,
      atomicRadiusPm: element.atomicRadiusPm,
      firstIonizationEnergyEv: element.ionizationEnergyEv,
      electronAffinityEv: element.electronAffinityEv,
      oxidationStates: element.oxidationStates,
      formulationValences: formulationValences(element),
      standardState: element.standardState,
      meltingPointK: element.meltingPointK,
      boilingPointK: element.boilingPointK,
      densityGcm3: element.densityGcm3,
      category: element.category,
      period: element.period,
      group: element.group,
      block: element.block,
    })),
    sources: periodicTable.sources,
  };

  return {
    localAnswer,
    elementNumbers,
    grounding: JSON.stringify(grounding),
  };
}
