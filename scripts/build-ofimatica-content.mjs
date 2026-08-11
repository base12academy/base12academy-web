import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Indica la carpeta BASE12_Curso_Ofimatica...");

const groupTitles = {
  G01: "Entorno digital",
  G02: "Comunicación y organización",
  G03: "Documentos profesionales",
  G04: "Datos y hojas de cálculo",
  G05: "Presentaciones visuales",
  G06: "Colaboración profesional",
  G07: "Bases de datos",
  G08: "Integración y Power BI",
  G09: "Automatización",
  G10: "Inteligencia artificial",
  G11: "Proyecto integrado",
};

const titleFromFolder = (name) => name.replace(/^G\d+_V\d+_/, "").replaceAll("_", " ");
const readFirstText = (folder) => {
  if (!fs.existsSync(folder)) return "";
  const file = fs.readdirSync(folder).find((name) => name.toLowerCase().endsWith(".txt"));
  return file ? fs.readFileSync(path.join(folder, file), "utf8").replace(/^\uFEFF/, "").trim() : "";
};

const groups = fs.readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^G\d{2}_/.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name, "es"))
  .map((groupEntry) => {
    const groupId = groupEntry.name.slice(0, 3);
    const groupPath = path.join(source, groupEntry.name);
    const lessons = fs.readdirSync(groupPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^G\d{2}_V\d{2}_/.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .map((lessonEntry) => {
        const lessonPath = path.join(groupPath, lessonEntry.name);
        const lessonId = lessonEntry.name.slice(0, 7);
        return {
          id: lessonId,
          title: titleFromFolder(lessonEntry.name),
          explanation: readFirstText(path.join(lessonPath, "04_EXPLICACION")),
          glossary: readFirstText(path.join(lessonPath, "05_GLOSARIO")),
          activities: readFirstText(path.join(lessonPath, "06_RETOS_Y_PRACTICAS")),
          videoFile: `VT${lessonId.slice(1, 3)}${lessonId.slice(5, 7)}.mp4`,
          publicPreview: lessonId === "G01_V01",
        };
      });
    return { id: groupId, title: groupTitles[groupId] ?? groupEntry.name, lessons };
  });

const output = path.resolve("lib/ofimatica-content.json");
fs.writeFileSync(output, `${JSON.stringify({ groups }, null, 2)}\n`, "utf8");
console.log(`Generados ${groups.reduce((sum, group) => sum + group.lessons.length, 0)} contenidos en ${output}`);
