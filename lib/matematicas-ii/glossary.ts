import glossary1 from "./glossary-1.json";
import glossary2 from "./glossary-2.json";

export type GlossaryTerm = {
  term: string;
  definition: string;
  utility: string;
  error: string;
  example: string;
};

export type GlossarySection = {
  section: number;
  title: string;
  terms: GlossaryTerm[];
};

const sections = [
  ...(glossary1.sections as GlossarySection[]),
  ...(glossary2.sections as GlossarySection[]),
];

const order = [1, 2, 3, 4, 11, 5, 6, 7, 8, 9, 12];

export const MATEMATICAS_II_GLOSSARY = order
  .map((section) => sections.find((item) => item.section === section))
  .filter((item): item is GlossarySection => Boolean(item));

export const MATEMATICAS_II_GLOSSARY_COUNT = MATEMATICAS_II_GLOSSARY.reduce(
  (total, section) => total + section.terms.length,
  0,
);
