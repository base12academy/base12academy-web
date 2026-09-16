import algebra from "./pau-problems-algebra.json";
import geometry from "./pau-problems-geometria.json";
import analysis from "./pau-problems-analisis.json";
import probability from "./pau-problems-probabilidad.json";
import profiles from "./pau-profiles.json";
import simulations1 from "./simulations-1.json";
import simulations2 from "./simulations-2.json";
import simulations3 from "./simulations-3.json";
import simulations4 from "./simulations-4.json";
import simulations5 from "./simulations-5.json";

export type PauProblem = {
  id: string;
  subject: string;
  block: string;
  statement: string;
  solution: string;
  rubric: string;
};

export type PauProfile = {
  code: string;
  name: string;
  state: string;
  description: string;
  source: string;
};

export type PauSimulation = {
  code: string;
  file: string;
  title: string;
  profile: string;
  content: string[];
};

export const MATEMATICAS_II_PAU_PROBLEMS: PauProblem[] = [
  ...(algebra as PauProblem[]),
  ...(geometry as PauProblem[]),
  ...(analysis as PauProblem[]),
  ...(probability as PauProblem[]),
];

export const MATEMATICAS_II_PAU_PROFILES = profiles as PauProfile[];
export const MATEMATICAS_II_PAU_SIMULATIONS: PauSimulation[] = [
  ...(simulations1 as PauSimulation[]),
  ...(simulations2 as PauSimulation[]),
  ...(simulations3 as PauSimulation[]),
  ...(simulations4 as PauSimulation[]),
  ...(simulations5 as PauSimulation[]),
];

export function getPauProblems(block?: string) {
  return block ? MATEMATICAS_II_PAU_PROBLEMS.filter((item) => item.block === block) : MATEMATICAS_II_PAU_PROBLEMS;
}

export function getPauProfile(code?: string) {
  if (!code) return MATEMATICAS_II_PAU_PROFILES;
  return MATEMATICAS_II_PAU_PROFILES.find((item) => item.code === code.toUpperCase()) ?? null;
}

export function getPauSimulation(code?: string) {
  if (!code) return MATEMATICAS_II_PAU_SIMULATIONS;
  return MATEMATICAS_II_PAU_SIMULATIONS.find((item) => item.code === code.toUpperCase()) ?? null;
}
