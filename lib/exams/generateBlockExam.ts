import { temasHistoria, BLOQUES_HISTORIA } from "@/lib/temas";
import { getExamSourceCatalog, publicExamSource } from "./sourceCatalog";
import { getShortQuestionsByTopic } from "./getShortQuestions";
import { getShortFileSlug } from "./getShortFileSlug";
import { pickRandomItems, pickRandomOne } from "./pickRandom";

type GenerateBlockExamInput = {
  blockId: string;
  selectedTopicSlugs: string[];
};

export async function generateBlockExam({
  blockId,
  selectedTopicSlugs,
}: GenerateBlockExamInput) {
  if (!selectedTopicSlugs.length) {
    throw new Error("No hay temas seleccionados");
  }

  const normalizeBlockId = (value: string) => value.replace("-", "_");

  const block = BLOQUES_HISTORIA.find(
    (b: any) => normalizeBlockId(b.id) === normalizeBlockId(blockId)
  );

  if (!block) {
    throw new Error("No se encontró el bloque");
  }

  const blockTopics = block.temas.filter((slug: string) =>
    selectedTopicSlugs.includes(slug)
  );

  if (!blockTopics.length) {
    throw new Error("No hay temas seleccionados válidos para este bloque");
  }

  const questionsByTopic = blockTopics.map((topicSlug: string) => {
    const fileSlug = getShortFileSlug(topicSlug);
    return {
      topicSlug,
      questions: getShortQuestionsByTopic(fileSlug),
    };
  });

  let selectedQuestions: any[] = [];

  questionsByTopic.forEach(({ topicSlug, questions }) => {
    if (questions.length > 0) {
      const random = pickRandomOne(questions);
      if (random) {
        selectedQuestions.push({
          ...random,
          topicSlug,
        });
      }
    }
  });

  const remainingPool = questionsByTopic.flatMap(({ topicSlug, questions }) =>
    questions.map((q: any) => ({
      ...q,
      topicSlug,
    }))
  );

  const extraNeeded = Math.max(0, 5 - selectedQuestions.length);

  if (extraNeeded > 0) {
    const extra = pickRandomItems(remainingPool, extraNeeded);
    selectedQuestions = [...selectedQuestions, ...extra];
  }

  const uniqueMap = new Map();

  selectedQuestions.forEach((q) => {
    if (!uniqueMap.has(q.id)) {
      uniqueMap.set(q.id, q);
    }
  });

  let shortQuestions = Array.from(uniqueMap.values());

  if (shortQuestions.length < 5) {
    const additionalPool = remainingPool.filter(
      (q: any) => !shortQuestions.some((sq: any) => sq.id === q.id)
    );

    const additional = pickRandomItems(
      additionalPool,
      5 - shortQuestions.length
    );

    shortQuestions = [...shortQuestions, ...additional];
  }

  shortQuestions = shortQuestions.slice(0, 5);

  if (shortQuestions.length < 5) {
    throw new Error("No hay suficientes preguntas cortas para este bloque");
  }

  const developmentTopics = temasHistoria.filter(
    (t: any) =>
      typeof t.slug === "string" &&
      typeof t.contenido === "string" &&
      blockTopics.includes(t.slug)
  );

  if (!developmentTopics.length) {
    throw new Error("No se encontró tema de desarrollo para este bloque");
  }

  const shuffledDevelopment = pickRandomItems(
    developmentTopics,
    developmentTopics.length
  );

  const development = shuffledDevelopment[0];

  const normalizedBlockId=block.id.replace("_","-");
  const allSources=getExamSourceCatalog().filter(source=>source.sourceId.startsWith(normalizedBlockId+":"));

  if (!allSources.length) {
    throw new Error("No se encontró ninguna fuente para este bloque");
  }

  const shuffledSources = pickRandomItems(allSources, allSources.length);
  const source = shuffledSources[0];

  return {
    blockId: block.id,
    selectedTopicSlugs: blockTopics,
    shortQuestions,
    source: publicExamSource(source),
    development: {
      slug: development.slug,
      titulo: development.titulo,
      descripcion: development.descripcion,
    },
  };
}