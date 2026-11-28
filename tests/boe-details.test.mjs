import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseBoeDetails, detailsFromParagraphs, boeOrganisation } from "../lib/boe-details.ts";

const load = id => readFileSync(new URL(`./fixtures/boe/${id}.xml`, import.meta.url), "utf8");
const parse = id => parseBoeDetails(load(id), `BOE-A-2026-${id}`);

test("same UAB title retains the distinct area, profile and position identifier", () => {
  const a = parse("19817");
  const b = parse("19818");
  assert.equal(a.specialty, "Comunicación Audiovisual y Publicidad");
  assert.equal(a.positionId, "ATU01193");
  assert.equal(b.specialty, "Metodología de las Ciencias del Comportamiento");
  assert.equal(b.positionId, "ATU01202");
  assert.notEqual(a.headline, b.headline);
  assert.match(b.summary, /Modelos Estadísticos y Psicométricos/);
  assert.match(a.applicationPeriod, /veinte días hábiles/);
  assert.doesNotMatch(a.summary, /SE MODIFICA|Presidencia titular/);
});

test("Motril announcements preserve different base references and access routes", () => {
  const a = parse("20331");
  const b = parse("20332");
  const c = parse("20333");
  assert.match(a.summary, /número 153/);
  assert.match(b.summary, /número 151/);
  assert.match(c.summary, /número 155/);
  assert.match(b.summary, /promoción interna/);
  assert.match(c.summary, /turno libre/);
  assert.notEqual(a.summary, b.summary);
});

test("natural days remain natural days and text survives storage round-trip", () => {
  const d = parse("19810");
  assert.match(d.applicationPeriod, /veinte días naturales/);
  assert.match(d.headline, /Siete plazas/);
  assert.deepEqual(detailsFromParagraphs(d.summary.split(/\n\s*\n/)), d);
});

test("rejects a different publication, invalid identifiers and metadata-only XML", () => {
  assert.equal(parseBoeDetails(load("19817"), "BOE-A-2026-19818"), null);
  assert.equal(parseBoeDetails(load("19817"), "../19817"), null);
  assert.equal(parseBoeDetails('<documento><identificador>BOE-A-2026-19817</identificador><texto>reference only</texto></documento>', "BOE-A-2026-19817"), null);
});

test("uses the named organisation, preserving the bulletin department as a fallback", () => {
  assert.equal(boeOrganisation("Resolución de 23 de septiembre de 2026, del Ayuntamiento de Motril (Granada), referente a la convocatoria", "ADMINISTRACIÓN LOCAL"), "Ayuntamiento de Motril (Granada)");
  assert.equal(boeOrganisation("Resolución de 17 de septiembre de 2026, de la Universidad Autónoma de Barcelona, por la que se convoca", "UNIVERSIDADES"), "Universidad Autónoma de Barcelona");
  assert.equal(boeOrganisation("Acuerdo de la Comisión Permanente", "CONSEJO GENERAL DEL PODER JUDICIAL"), "CONSEJO GENERAL DEL PODER JUDICIAL");
});

test("reads explicit selection dates and avoids deriving deadlines from relative periods", () => {
  const result = detailsFromParagraphs([
    "Se convocan un total de 24 plazas del subgrupo C1 mediante el sistema de concurso-oposición.",
    "El plazo de presentación de solicitudes será desde el 2 de noviembre de 2026 hasta el 23 de noviembre de 2026.",
    "El primer ejercicio se celebrará el 3 de diciembre de 2026.",
  ]);
  assert.equal(result.accessSystem, "Concurso-oposición");
  assert.equal(result.vacancies, 24);
  assert.equal(result.group, "C1");
  assert.equal(result.applicationStart, "2026-11-02");
  assert.equal(result.applicationEnd, "2026-11-23");
  assert.equal(result.examDate, "2026-12-03");
  assert.equal(parse("19810").applicationEnd, null);
  assert.equal(detailsFromParagraphs(["El primer ejercicio se celebrará el 31 de noviembre de 2026."]).examDate, null);
});

test("keeps a selection announcement's date only when it gives one full date", () => {
  const first = "Convocar a los aspirantes admitidos para la celebración del primer ejercicio en Madrid el día 14 de diciembre de 2026.";
  const second = "Convocar a las personas aspirantes admitidas para la celebración del ejercicio único en Madrid el día 31 de enero de 2027.";
  assert.equal(detailsFromParagraphs([first]).examDate, "2026-12-14");
  assert.equal(detailsFromParagraphs([first, second]).examDate, null);
  assert.equal(detailsFromParagraphs([first, second.replace(" de 2027", "")]).examDate, null);
});
