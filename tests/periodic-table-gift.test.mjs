import test from "node:test";
import assert from "node:assert/strict";
import {
  createGiftCode,
  giftErrorMessage,
  hashGiftCode,
  isValidGiftEmail,
  normalizeGiftCode,
  normalizeGiftEmail,
  PERIODIC_TABLE_GIFT_LIMIT,
} from "../lib/chemistry/periodic-table-gift.ts";

test("normaliza el correo y valida destinatarios plausibles", () => {
  assert.equal(normalizeGiftEmail("  Alumno@Ejemplo.ES "), "alumno@ejemplo.es");
  assert.equal(isValidGiftEmail("alumno@ejemplo.es"), true);
  assert.equal(isValidGiftEmail("sin-arroba"), false);
});

test("genera claves opacas y el hash ignora mayúsculas y espacios", () => {
  const code = createGiftCode();
  assert.match(code, /^B12-CLARA-[A-F0-9]{10}$/);
  assert.equal(normalizeGiftCode(` ${code.toLowerCase()} `), code);
  assert.equal(hashGiftCode(code), hashGiftCode(` ${code.toLowerCase()} `));
  assert.equal(hashGiftCode(code).length, 64);
});

test("la campaña está limitada a 50 y traduce errores sin filtrar datos", () => {
  assert.equal(PERIODIC_TABLE_GIFT_LIMIT, 50);
  assert.match(giftErrorMessage("gift_email_mismatch"), /otro correo/i);
  assert.match(giftErrorMessage("gift_campaign_full"), /50 plazas/i);
  assert.match(giftErrorMessage("detalle interno inesperado"), /No se pudo gestionar/i);
});
