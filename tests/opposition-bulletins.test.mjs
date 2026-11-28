import test from "node:test";
import assert from "node:assert/strict";
import { ceutaIssueLinks, readCeutaSummary, verifyBojaArticle } from "../lib/opposition-bulletins.ts";

test("distinguishes ordinary and extraordinary newspaper notices, even when PDF hyphens are omitted", () => {
  const date = "2026-11-27";
  const pdf = "https://www.ceuta.es/ordinary.pdf";
  const heading = "Boletín Oficial Ciudad de Ceuta Viernes 27 de Noviembre de 2026";
  const title = "Corrección de la relación de aspirantes admitidos de la convocatoria de cinco plazas";
  const selection = readCeutaSummary([`${heading} BOCCE Nº6.673 ORDINARIO SUMARIO 796.- ${title} Pág.4126`], { issue: "6673", date, pdf });
  assert.equal(selection[0].reference, "2026/6673/796");
  const extraordinary = readCeutaSummary([`${heading} BOCCE Nº58 EXTRA ORDINARIO SUMARIO 117. ${title} Pág.1427`], { issue: "Extra58", date, pdf });
  assert.equal(extraordinary[0].reference, "2026/Extra58/117");
  assert.throws(() => readCeutaSummary([`${heading} BOCCE Nº6.673 ORDINARIO SUMARIO 796.- ${title} Pág.4126`], { issue: "6673", date: "2026-12-01", pdf }));
});

test("deduplicates links to the same official edition and verifies the BOJA's issue date", () => {
  const link = '<a href="/ceuta/component/jdownloads/viewdownload/1983/23339?Itemid=">BOCCE_6673_27-11-2026 </a>';
  assert.equal(ceutaIssueLinks(link + link).length, 1);
  const article = '<h1>BOJA <span class="nota">Boletín 230 de 27/11/2026</span></h1><a href="/official.pdf">PDF</a>';
  const record = { pdf: "https://www.juntadeandalucia.es/official.pdf", date: "2026-11-20" };
  assert.equal(verifyBojaArticle(record, article).date, "2026-11-27");
  assert.throws(() => verifyBojaArticle(record, article.replace("official.pdf", "another.pdf")));
});
