import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const payload = JSON.parse(await readFile(new URL("../data/chemistry/elements.json", import.meta.url), "utf8"));
const elements = payload.elements;

assert.equal(payload.schemaVersion, 1, "La versión del esquema debe ser 1");
assert.equal(elements.length, 118, "Deben existir exactamente 118 elementos");
assert.deepEqual(elements.map((element) => element.atomicNumber), Array.from({ length: 118 }, (_, index) => index + 1), "Los números atómicos deben ser continuos");
assert.equal(new Set(elements.map((element) => element.symbol)).size, 118, "Los símbolos deben ser únicos");
assert.equal(new Set(elements.map((element) => element.name)).size, 118, "Los nombres en español deben ser únicos");
assert.ok(payload.sources.length >= 3, "La procedencia de los datos debe ser trazable");

for (const element of elements) {
  assert.match(element.symbol, /^[A-Z][a-z]?$/, `Símbolo no válido en Z=${element.atomicNumber}`);
  assert.ok(element.period >= 1 && element.period <= 7, `Periodo no válido en ${element.symbol}`);
  assert.ok(element.group == null || (element.group >= 1 && element.group <= 18), `Grupo no válido en ${element.symbol}`);
  assert.ok(["s", "p", "d", "f"].includes(element.block), `Bloque no válido en ${element.symbol}`);
  assert.ok(element.category, `Falta familia en ${element.symbol}`);
  assert.ok(element.standardState, `Falta estado estándar en ${element.symbol}`);
  if (element.atomicMassKind === "longest-lived-isotope") {
    assert.match(element.atomicMass, /^\[\d+\]$/, `La masa de referencia de ${element.symbol} debe aparecer entre corchetes`);
  } else {
    assert.ok(Number(element.atomicMass) > 0, `Peso atómico inválido en ${element.symbol}`);
  }
  for (const field of ["electronegativity", "atomicRadiusPm", "ionizationEnergyEv", "meltingPointK", "boilingPointK", "densityGcm3"]) {
    assert.ok(element[field] == null || (Number.isFinite(element[field]) && element[field] >= 0), `${field} inválido en ${element.symbol}`);
  }
  assert.ok(Array.isArray(element.oxidationStates), `Faltan estados de oxidación en ${element.symbol}`);
  assert.ok(element.oxidationStates.every((state) => /^[+-]?\d+$/.test(state)), `Estado de oxidación inválido en ${element.symbol}`);
}

const bySymbol = Object.fromEntries(elements.map((element) => [element.symbol, element]));
assert.equal(bySymbol.H.group, 1);
assert.equal(bySymbol.He.group, 18);
assert.equal(bySymbol.C.atomicNumber, 6);
assert.equal(bySymbol.F.electronegativity, 3.98);
assert.equal(bySymbol.He.electronegativity, null);
assert.equal(bySymbol.Br.standardState, "líquido");
assert.equal(bySymbol.Hg.standardState, "líquido");
assert.equal(bySymbol.Og.atomicMass, "[295]");
assert.equal(bySymbol.W.name, "Wolframio");
assert.equal(bySymbol.Ds.name, "Darmstatio");
assert.deepEqual(bySymbol.Fe.oxidationStates, ["+3", "+2"]);
assert.deepEqual(bySymbol.Cl.oxidationStates, ["+7", "+5", "+1", "-1"]);
assert.deepEqual(elements.filter((element) => element.oxidationStates.length === 0).map((element) => element.symbol), ["Nh"], "Toda ausencia de estados de oxidación debe quedar localizada y explícita");

const fBlock = elements.filter((element) => element.block === "f");
assert.equal(fBlock.length, 30, "Deben existir 15 lantánidos y 15 actínidos en el bloque f");
assert.ok(fBlock.every((element) => element.group === null), "El grupo 3 se deja explícitamente sin asignar para las series f");

console.log("Auditoría química superada: 118 elementos, posiciones, unidades, masas, estados de oxidación y casos de referencia verificados.");
