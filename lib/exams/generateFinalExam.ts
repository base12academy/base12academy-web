import { temasHistoria } from "@/lib/temas";
import { getExamSourceCatalog, publicExamSource } from "./sourceCatalog";
import { getShortQuestionsByTopic } from "./getShortQuestions";
import { getShortFileSlug } from "./getShortFileSlug";
import { pickRandomItems } from "./pickRandom";

type GenerateFinalExamInput = {
  selectedTopicSlugs: string[];
};

export async function generateFinalExam({
  selectedTopicSlugs,
}: GenerateFinalExamInput) {
  if (!selectedTopicSlugs.length) {
    throw new Error("No hay temas seleccionados");
  }

  const allShortQuestions = selectedTopicSlugs.flatMap((topicSlug: string) => {
    const fileSlug = getShortFileSlug(topicSlug);
    return getShortQuestionsByTopic(fileSlug).map((q: any) => ({
      ...q,
      topicSlug,
    }));
  });

  if (allShortQuestions.length < 5) {
    throw new Error("No hay suficientes preguntas cortas para el examen final");
  }

  const shortQuestions = pickRandomItems(allShortQuestions, 5);
  const publicShortQuestions=shortQuestions.map((q:any)=>({id:q.id,question:q.question,topicSlug:q.topicSlug}));

  const developmentPool = temasHistoria.filter(
    (t: any) =>
      typeof t.slug === "string" &&
      typeof t.contenido === "string" &&
      selectedTopicSlugs.includes(t.slug)
  );

  if (!developmentPool.length) {
    throw new Error("No hay temas de desarrollo disponibles");
  }

  const development = pickRandomItems(developmentPool, 1)[0];

  const allSources = getExamSourceCatalog();

  if (!allSources.length) {
    throw new Error("No hay fuentes disponibles para el examen final");
  }

  const source = pickRandomItems(allSources, 1)[0];

  return {
    selectedTopicSlugs,
    shortQuestions: publicShortQuestions,
    source: publicExamSource(source),
    development: {
      slug: development.slug,
      titulo: development.titulo,
      descripcion: development.descripcion,
    },
  };
}