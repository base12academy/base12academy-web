import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Tehalo respeta las ventanas y los textos del Plan Maestro", () => {
  const catalog = read("components/CourseCatalog.tsx");
  const configurator = read("components/tehalo-opositores/TehaloConfigurator.tsx");
  const page = read("app/tehalo-pruebas-opositores/page.tsx");

  assert.match(catalog, /Material adaptado a tu convocatoria, administración y territorio/);
  assert.match(catalog, /Temario, explicaciones, test y simulacros personalizados para tu oposición/);
  assert.match(catalog, /Descubrir cómo funciona/);
  assert.match(catalog, /En menos de 24 h diseñamos, personalizamos y adaptamos el curso a tu oposición/);
  assert.match(catalog, /<TehaloConfigurator \/>/);
  assert.doesNotMatch(catalog, /href="\/tehalo-pruebas-opositores"/);
  assert.match(page, /redirect\("\/#catalogo"\)/);

  for (const question of [
    "¿Qué oposición preparas?",
    "¿A qué administración pertenece?",
    "¿Qué cuerpo o puesto es?",
    "¿Qué nivel tiene?",
    "¿En qué territorio se convoca?",
    "¿Qué convocatoria debemos tomar como referencia?",
    "¿Qué material necesitas?",
    "¿Dónde te enviamos tu propuesta personalizada?",
  ]) assert.match(configurator, new RegExp(question.replace(/[?¿]/g, ".")));

  assert.match(configurator, /Precio orientativo\. La propuesta final dependerá del número de temas y del grado de personalización necesario/);
  assert.match(configurator, /Correo electrónico/);
  assert.match(configurator, /Política de privacidad/);
  assert.doesNotMatch(configurator, /Nombre y apellidos/);
  assert.doesNotMatch(configurator, /Quiero recibir novedades/);
});

test("la solicitud se valida, guarda y confirma por correo", () => {
  const route = read("app/api/tehalo-opositores/solicitudes/route.ts");
  const migration = read("supabase/migrations/20260929090000_tehalo_opposition_requests.sql");

  assert.match(route, /verifyTurnstileToken/);
  assert.match(route, /tehalo_opposition_requests/);
  assert.match(route, /TEHALO_REQUEST_EMAIL/);
  assert.match(route, /ese correo incluirá la posibilidad de pagar de forma segura mediante Redsys/);
  assert.match(migration, /create table if not exists public\.tehalo_opposition_requests/);
  assert.match(migration, /redsys_order_id text/);
  assert.match(migration, /invoice_copy_sent_at timestamptz/);
});
