import fs from "fs";
import path from "path";

export function getShortQuestionsByTopic(topicSlug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "historia",
    "shorts",
    `${topicSlug}.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe el archivo de preguntas cortas para ${topicSlug}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}