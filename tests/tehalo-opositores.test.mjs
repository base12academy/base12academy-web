import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Tehalo abre un configurador separado y no cobra en el formulario", () => {
  const catalog = read("components/CourseCatalog.tsx");
  const configurator = read("components/tehalo-opositores/TehaloConfigurator.tsx");
  const page = read("app/tehalo-pruebas-opositores/page.tsx");

  assert.match(catalog, /href="\/tehalo-pruebas-opositores"/);
  assert.match(catalog, /Descubrir cómo funciona/);
  assert.match(configurator, /Paso \{step \+ 1\} de \{stepTitles\.length\}/);
  assert.match(configurator, /No se solicita tarjeta ni se realiza ningún pago en este paso/);
  assert.match(configurator, /Recibirás por correo el precio final, el plazo/);
  assert.match(page, /La posibilidad de pagar mediante Redsys solo aparecerá en ese correo/);
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
