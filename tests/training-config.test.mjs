import test from "node:test";
import assert from "node:assert/strict";
import {
  formatTrainingValue,
  getBestTrainingValue,
  getOfficialTarget,
  getTrainingProgressState,
  hasPassedOfficial,
  nextTrainingTarget,
  trainingTestMap,
} from "../lib/training-config.ts";

test("usa las cuatro referencias de ingreso 2026 configuradas", () => {
  assert.equal(getOfficialTarget(trainingTestMap.flexiones, "male"), 9);
  assert.equal(getOfficialTarget(trainingTestMap.flexiones, "female"), 5);
  assert.equal(getOfficialTarget(trainingTestMap.plancha, "male"), 40);
  assert.equal(getOfficialTarget(trainingTestMap.plancha, "female"), 40);
  assert.equal(getOfficialTarget(trainingTestMap["carrera-2000"], "male"), 714);
  assert.equal(getOfficialTarget(trainingTestMap["carrera-2000"], "female"), 778);
  assert.equal(getOfficialTarget(trainingTestMap.agilidad, "male"), 15.4);
  assert.equal(getOfficialTarget(trainingTestMap.agilidad, "female"), 17.1);
});

test("en flexiones y plancha una marca mayor es mejor", () => {
  assert.equal(nextTrainingTarget(trainingTestMap.flexiones, 6, "male"), 7);
  assert.equal(nextTrainingTarget(trainingTestMap.flexiones, 8, "male"), 9);
  assert.equal(nextTrainingTarget(trainingTestMap.flexiones, 9, "male"), 10);
  assert.equal(nextTrainingTarget(trainingTestMap.plancha, 35, "female"), 40);
  assert.equal(hasPassedOfficial(trainingTestMap.flexiones, 9, "male"), true);
  assert.equal(hasPassedOfficial(trainingTestMap.flexiones, 8, "male"), false);
  assert.equal(getBestTrainingValue(trainingTestMap.flexiones, [6, 9, 8]), 9);
});

test("en carrera y agilidad una marca menor es mejor", () => {
  assert.equal(nextTrainingTarget(trainingTestMap["carrera-2000"], 750, "male"), 735);
  assert.equal(nextTrainingTarget(trainingTestMap["carrera-2000"], 720, "male"), 714);
  assert.equal(nextTrainingTarget(trainingTestMap.agilidad, 16, "male"), 15.7);
  assert.equal(hasPassedOfficial(trainingTestMap["carrera-2000"], 714, "male"), true);
  assert.equal(hasPassedOfficial(trainingTestMap.agilidad, 15.5, "male"), false);
  assert.equal(getBestTrainingValue(trainingTestMap["carrera-2000"], [750, 714, 730]), 714);
});

test("distingue no alcanza, cerca, superada y consolidada", () => {
  assert.equal(getTrainingProgressState(trainingTestMap.flexiones, [], "male"), "Sin marca inicial");
  assert.equal(getTrainingProgressState(trainingTestMap.flexiones, [6], "male"), "No alcanza");
  assert.equal(getTrainingProgressState(trainingTestMap.flexiones, [8], "male"), "Cerca");
  assert.equal(getTrainingProgressState(trainingTestMap.flexiones, [9], "male"), "Superada");
  assert.equal(getTrainingProgressState(trainingTestMap.flexiones, [10, 9, 11], "male"), "Consolidada");
  assert.equal(getTrainingProgressState(trainingTestMap.agilidad, [15.7], "male"), "Cerca");
  assert.equal(getTrainingProgressState(trainingTestMap.agilidad, [15.4], "male"), "Superada");
  assert.equal(getTrainingProgressState(trainingTestMap.agilidad, [15.1, 15.3, 15.4], "male"), "Consolidada");
});

test("formatea correctamente repeticiones y tiempos", () => {
  assert.equal(formatTrainingValue(trainingTestMap.flexiones, 9), "9 rep.");
  assert.equal(formatTrainingValue(trainingTestMap.plancha, 40), "40 s");
  assert.equal(formatTrainingValue(trainingTestMap["carrera-2000"], 714), "11:54");
  assert.equal(formatTrainingValue(trainingTestMap.agilidad, 15.4), "15,4 s");
});
