import test from "node:test";
import assert from "node:assert/strict";
import { getTrainingLicenseExpiry, isTrainingLicenseActive, TRAINING_LICENSE_YEARS, TRAINING_OWNER_EMAIL } from "../lib/training-license.ts";

test("las licencias normales de Training duran un año", () => {
  assert.equal(TRAINING_LICENSE_YEARS, 1);
  const expiry = getTrainingLicenseExpiry("2026-09-17T12:00:00.000Z");
  assert.equal(expiry?.toISOString(), "2027-09-17T12:00:00.000Z");
});

test("la licencia deja de ser válida exactamente al vencer", () => {
  const activation = "2026-09-17T12:00:00.000Z";
  assert.equal(isTrainingLicenseActive(activation, new Date("2027-09-17T11:59:59.000Z")), true);
  assert.equal(isTrainingLicenseActive(activation, new Date("2027-09-17T12:00:00.000Z")), false);
});

test("la licencia de propietario queda identificada por su correo", () => {
  assert.equal(TRAINING_OWNER_EMAIL, "eduardojcaro@gmail.com");
});
