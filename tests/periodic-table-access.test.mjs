import test from "node:test";
import assert from "node:assert/strict";
import { classifyPeriodicTableAccess } from "../lib/chemistry/periodic-table-access.ts";

const now = new Date("2026-09-14T12:00:00.000Z");
const enrollment = (overrides = {}) => ({
  course_slug: "quimica",
  plan_slug: "esencial",
  status: "active",
  starts_at: "2026-01-01T00:00:00.000Z",
  expires_at: null,
  ...overrides,
});

test("incluye Esencial y Estándar activos de Química", () => {
  assert.equal(classifyPeriodicTableAccess([enrollment()], now).access, "included");
  assert.equal(classifyPeriodicTableAccess([enrollment({ plan_slug: "estandar" })], now).access, "included");
  assert.equal(classifyPeriodicTableAccess([enrollment({ course_slug: "quimica-bachillerato-pau", plan_slug: "standard" })], now).access, "included");
});

test("no incluye otros planes, otros cursos ni matrículas inactivas", () => {
  assert.equal(classifyPeriodicTableAccess([enrollment({ plan_slug: "pau" })], now).access, "purchase_required");
  assert.equal(classifyPeriodicTableAccess([enrollment({ plan_slug: "premium" })], now).access, "purchase_required");
  assert.equal(classifyPeriodicTableAccess([enrollment({ course_slug: "historia-espana" })], now).access, "purchase_required");
  assert.equal(classifyPeriodicTableAccess([enrollment({ status: "pending" })], now).access, "purchase_required");
  assert.equal(classifyPeriodicTableAccess([enrollment({ expires_at: "2026-09-13T23:59:59.000Z" })], now).access, "purchase_required");
  assert.equal(classifyPeriodicTableAccess([enrollment({ starts_at: "2026-09-15T00:00:00.000Z" })], now).access, "purchase_required");
});

test("reconoce la licencia independiente activa y sin caducidad", () => {
  const result = classifyPeriodicTableAccess([enrollment({ course_slug: "tabla-periodica", plan_slug: "licencia" })], now);
  assert.equal(result.access, "licensed");
  assert.equal(result.source, "standalone-license");
  assert.equal(result.entitled, true);
});
