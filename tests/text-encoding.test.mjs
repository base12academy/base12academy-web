import assert from "node:assert/strict";
import test from "node:test";

import { repairMojibake } from "../scripts/repair-mojibake.mjs";

test("repara texto UTF-8 interpretado como Windows-1252", () => {
  const corrupted = "\u00c3\u0081rea de estudio \u00e2\u20ac\u201d \u00f0\u0178\u201d\u2019";

  assert.equal(repairMojibake(corrupted), "Área de estudio — 🔒");
});

test("repara texto que fue codificado incorrectamente dos veces", () => {
  const doubleCorrupted = "\u00c3\u0192\u00c2\u00a1";

  assert.equal(repairMojibake(doubleCorrupted), "á");
});

test("conserva el texto Unicode que ya es correcto", () => {
  const correct = "Historia de la Filosofía · 9,99 €";

  assert.equal(repairMojibake(correct), correct);
});
