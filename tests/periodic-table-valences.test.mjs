import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { formatFormulationValences, formulationValences } from "../lib/chemistry/valences.ts";

const payload = JSON.parse(await readFile(new URL("../data/chemistry/elements.json", import.meta.url), "utf8"));
const bySymbol = Object.fromEntries(payload.elements.map((element) => [element.symbol, element]));

test("las valencias de formulación conservan magnitudes únicas, positivas y ordenadas", () => {
  for (const element of payload.elements) {
    const valences = formulationValences(element);
    assert.deepEqual(valences, [...new Set(valences)].sort((a, b) => a - b), element.symbol);
    assert.ok(valences.every((value) => Number.isInteger(value) && value >= 0), element.symbol);
  }
});

test("deriva correctamente casos químicos de referencia sin confundir el signo", () => {
  assert.deepEqual(formulationValences(bySymbol.H), [1]);
  assert.deepEqual(formulationValences(bySymbol.O), [2]);
  assert.deepEqual(formulationValences(bySymbol.Fe), [2, 3]);
  assert.deepEqual(formulationValences(bySymbol.Cl), [1, 3, 5, 7]);
  assert.deepEqual(formulationValences(bySymbol.Br), [1, 3, 5, 7]);
  assert.deepEqual(formulationValences(bySymbol.Mn), [2, 3, 4, 6, 7]);
  assert.deepEqual(formulationValences(bySymbol.He), [0]);
});

test("declara expresamente la ausencia de una valencia verificada", () => {
  assert.deepEqual(formulationValences(bySymbol.Nh), []);
  assert.equal(formatFormulationValences(bySymbol.Nh), "Sin dato verificado");
});
