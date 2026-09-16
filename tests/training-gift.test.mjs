import test from "node:test";
import assert from "node:assert/strict";
import {
  createTrainingGiftCode,
  hashTrainingGiftCode,
  isValidTrainingGiftEmail,
  normalizeTrainingGiftCode,
  normalizeTrainingGiftEmail,
  TRAINING_GIFT_LIMIT,
} from "../lib/training-gift.ts";

test("configura exactamente 50 regalos de Base12 Training", () => {
  assert.equal(TRAINING_GIFT_LIMIT, 50);
});

test("normaliza correos y códigos de regalo", () => {
  assert.equal(normalizeTrainingGiftEmail("  Alumno@Ejemplo.ES "), "alumno@ejemplo.es");
  assert.equal(normalizeTrainingGiftCode(" b12-training-abc123 "), "B12-TRAINING-ABC123");
});

test("valida correos plausibles", () => {
  assert.equal(isValidTrainingGiftEmail("alumno@example.com"), true);
  assert.equal(isValidTrainingGiftEmail("sin-arroba"), false);
});

test("genera códigos Training y hash estable normalizado", () => {
  const code = createTrainingGiftCode();
  assert.match(code, /^B12-TRAINING-[A-F0-9]{10}$/);
  assert.equal(hashTrainingGiftCode(code.toLowerCase()), hashTrainingGiftCode(code));
});
