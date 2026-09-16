import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules"]);
const inspectedExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".py",
  ".ts",
  ".tsx",
]);
const mojibakePattern = /[\u0080-\u009f\u00c2\u00c3\u00e2\u00f0\u0192\ufffd]/u;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await collectFiles(join(directory, entry.name))));
      }
      continue;
    }

    if (entry.isFile() && inspectedExtensions.has(extname(entry.name))) {
      files.push(join(directory, entry.name));
    }
  }

  return files;
}

const failures = [];

for (const file of await collectFiles(root)) {
  const content = await readFile(file, "utf8");
  const lines = content.split(/\r?\n/u);

  lines.forEach((line, index) => {
    if (mojibakePattern.test(line)) {
      failures.push(`${relative(root, file)}:${index + 1}`);
    }
  });
}

if (failures.length > 0) {
  console.error("Se han detectado posibles textos con codificación corrupta:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Codificación de textos validada correctamente.");
}
