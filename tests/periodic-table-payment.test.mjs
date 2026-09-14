import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_BASE12_BILLING_EMAIL,
  PERIODIC_TABLE_CATALOG_SLUG,
  PERIODIC_TABLE_LICENSE_PRICE_CENTS,
  isPeriodicTableIncludedPlan,
  parsePeriodicInvoiceChoice,
} from "../lib/chemistry/periodic-table-product.ts";

test("la licencia usa el precio canónico de 9,99 €", () => {
  assert.equal(PERIODIC_TABLE_CATALOG_SLUG, "tabla-periodica-licencia");
  assert.equal(PERIODIC_TABLE_LICENSE_PRICE_CENTS, 999);
});

test("la decisión de factura debe ser un sí o un no explícito", () => {
  assert.equal(parsePeriodicInvoiceChoice(true), true);
  assert.equal(parsePeriodicInvoiceChoice(false), false);
  assert.equal(parsePeriodicInvoiceChoice(undefined), null);
  assert.equal(parsePeriodicInvoiceChoice("false"), null);
});

test("la comunicación interna usa el buzón de facturación de Base12", () => {
  assert.equal(DEFAULT_BASE12_BILLING_EMAIL, "base12academy+facturacion@gmail.com");
});

test("la aplicación solo se incluye gratis en Esencial y Estándar de Química", () => {
  assert.equal(isPeriodicTableIncludedPlan("Química", "Esencial"), true);
  assert.equal(isPeriodicTableIncludedPlan("Química", "Estándar"), true);
  assert.equal(isPeriodicTableIncludedPlan("Química", "PAU"), false);
  assert.equal(isPeriodicTableIncludedPlan("Física", "Esencial"), false);
});
