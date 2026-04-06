export const exampleImageConfig = {
  max_score: 4,
  min_words: 140,
  rubric: {
    recognition: {
      weight: 1,
      required_concepts: ["cartel_propaganda"],
      optional_concepts: ["fuente_visual"]
    },
    context: {
      weight: 1,
      required_concepts: ["guerra_civil"],
      optional_concepts: ["segunda_republica"]
    },
    analysis: {
      weight: 1,
      required_concepts: ["mensaje_propagandistico"],
      optional_concepts: ["movilizacion"]
    },
    relevance: {
      weight: 1,
      required_concepts: ["valor_historico"],
      optional_concepts: ["opinion_publica"]
    }
  }
};