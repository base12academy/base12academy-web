import test from "node:test";
import assert from "node:assert/strict";
import {
  createRedsysSignature,
  getRedsysCredentials,
  safeEqual,
} from "../lib/redsys.ts";

const TEST_SIGNING_KEY = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

test("Redsys decodifica las credenciales empaquetadas del entorno de pruebas", () => {
  const payload = Buffer.from(`999008881_1_${TEST_SIGNING_KEY}`).toString("base64url");

  assert.deepEqual(getRedsysCredentials({ REDSYS_API_KEY: `TEST_${payload}` }), {
    environment: "TEST",
    merchantCode: "999008881",
    terminal: "1",
    signingKey: TEST_SIGNING_KEY,
  });
});

test("Redsys impide usar la clave pública de pruebas en producción", () => {
  assert.throws(
    () => getRedsysCredentials({
      REDSYS_ENV: "PROD",
      REDSYS_MERCHANT_CODE: "999008881",
      REDSYS_TERMINAL: "1",
      REDSYS_SECRET_KEY: TEST_SIGNING_KEY,
    }),
    /pruebas.*produccion/i,
  );
});

test("la firma HMAC SHA-256 de Redsys permanece estable para un pago de 9,99 euros", () => {
  const merchantParameters = "eyJEU19NRVJDSEFOVF9BTU9VTlQiOiI5OTkiLCJEU19NRVJDSEFOVF9PUkRFUiI6IjEyMzQ1Njc4OTAxMiJ9";

  assert.equal(
    createRedsysSignature(merchantParameters, "123456789012", TEST_SIGNING_KEY),
    "BPEXSazbBJ6gjbF6vxi9jF/PGpZsr4BSXHV2qf39fD0=",
  );
});

test("la comparación de firmas admite base64url y rechaza una firma alterada", () => {
  const base64 = "BPEXSazbBJ6gjbF6vxi9jF/PGpZsr4BSXHV2qf39fD0=";
  const base64url = "BPEXSazbBJ6gjbF6vxi9jF_PGpZsr4BSXHV2qf39fD0";

  assert.equal(safeEqual(base64, base64url), true);
  assert.equal(safeEqual(base64, `${base64url.slice(0, -1)}A`), false);
});
