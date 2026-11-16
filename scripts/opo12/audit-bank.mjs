import { readFile } from "node:fs/promises";

const source = new URL("../../lib/administrativo-ja-content.json", import.meta.url);
const bank = JSON.parse(await readFile(source, "utf8"));
const seenPrompts = new Map();
const rows = [];

for (const theme of bank.themes ?? []) {
  for (const [index, question] of (theme.tests ?? []).entries()) {
    const key = `${theme.id}-${String(index + 1).padStart(3, "0")}`;
    const failures = [];
    if (typeof question.question !== "string" || question.question.trim().length < 25) failures.push("prompt_too_short");
    if (!Array.isArray(question.options) || question.options.length !== 4 || question.options.some((option) => typeof option !== "string" || !option.trim())) failures.push("options_invalid");
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) failures.push("answer_invalid");
    if (typeof question.explanation !== "string" || question.explanation.trim().length < 80) failures.push("explanation_insufficient");
    if (!question.officialReference) failures.push("official_reference_missing");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(question.reviewedOn ?? ""))) failures.push("review_date_missing");
    if (!question.block || !["theory", "practical"].includes(question.block)) failures.push("exam_block_missing");
    if (!question.difficulty || !["medium", "medium_high", "high"].includes(question.difficulty)) failures.push("difficulty_missing");
    const normalized = String(question.question ?? "").toLocaleLowerCase("es").replace(/\s+/g, " ").trim();
    if (seenPrompts.has(normalized)) failures.push(`duplicate_of:${seenPrompts.get(normalized)}`);
    else seenPrompts.set(normalized, key);
    rows.push({ key, theme: theme.id, status: failures.length ? "quarantine" : "review", failures });
  }
}

const counts = rows.reduce((total, row) => {
  total[row.status] = (total[row.status] ?? 0) + 1;
  return total;
}, {});
const failures = rows.flatMap((row) => row.failures).reduce((total, failure) => {
  const code = failure.split(":")[0];
  total[code] = (total[code] ?? 0) + 1;
  return total;
}, {});

const report = {
  source: "lib/administrativo-ja-content.json",
  opposition: "administrativos-junta-andalucia-c1-1000",
  auditedAt: new Date().toISOString(),
  total: rows.length,
  counts,
  failures,
  eligibleForHumanReview: rows.filter((row) => row.status === "review").length,
  approved: 0,
  note: "La auditoría automática nunca aprueba una respuesta: las candidatas pasan después por revisiones de contenido y norma.",
};

if (process.argv.includes("--details")) report.questions = rows;
console.log(JSON.stringify(report, null, 2));
