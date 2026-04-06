import { temasHistoria, IMAGENES_BLOQUES, TEXTOS_BLOQUES } from "@/lib/temas";
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

  const normalizeImagePath = (value: string) => {
  if (!value) return null;
  if (value.startsWith("/images/")) return value;
  if (value.startsWith("/")) return value;
  return `/images/${value}`;
};

const allImages = Object.values(IMAGENES_BLOQUES).flat().map((img: any) => ({
  source_type: "image" as const,
  title: img.titulo,
  description: img.descripcion,
  content: null,
  asset_url: normalizeImagePath(img.imagen),
  explicacion: img.explicacion,
}));

  const allTexts = Object.values(TEXTOS_BLOQUES).flat().map((txt: any) => ({
    source_type: "text" as const,
    title: txt.titulo,
    description: txt.descripcion,
    content: txt.texto,
    asset_url: null,
    explicacion: txt.explicacion,
  }));

  const allSources = [...allImages, ...allTexts];

  if (!allSources.length) {
    throw new Error("No hay fuentes disponibles para el examen final");
  }

  const source = pickRandomItems(allSources, 1)[0];

  return {
    selectedTopicSlugs,
    shortQuestions,
    source,
    development: {
      slug: development.slug,
      titulo: development.titulo,
      descripcion: development.descripcion,
    },
  };
}