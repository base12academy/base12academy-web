import assert from "node:assert/strict";
import test from "node:test";
import { C11000_EXAM_PROFILE } from "../lib/opo12/config.ts";
import { scoreOpo12Attempt, scoreOpo12Training } from "../lib/opo12/scoring.ts";

function questions(block, count, reserve = 0) {
  return [
    ...Array.from({ length: count }, (_, index) => ({
      id: `${block}-q${index + 1}`,
      block,
      isReserve: false,
      correctOption: "A",
    })),
    ...Array.from({ length: reserve }, (_, index) => ({
      id: `${block}-r${index + 1}`,
      block,
      isReserve: true,
      reserveOrder: index + 1,
      correctOption: "A",
    })),
  ];
}

const fullExam = [
  ...questions("theory", 75, 4),
  ...questions("practical", 25, 3),
];

test("C1.1000 aplica 1,2 por acierto y resta 0,4 por error", () => {
  const answers = Object.fromEntries(fullExam.map((question) => [question.id, "A"]));
  answers["theory-q1"] = "B";
  answers["theory-q2"] = null;
  const result = scoreOpo12Attempt(C11000_EXAM_PROFILE, fullExam, answers);
  assert.equal(result.correct, 98);
  assert.equal(result.wrong, 1);
  assert.equal(result.blank, 1);
  assert.equal(result.score, 117.2);
  assert.equal(result.blocks[0].score, 87.2);
  assert.equal(result.blocks[1].score, 30);
});

test("las reservas no puntúan salvo que sustituyan preguntas anuladas", () => {
  const exam = fullExam.map((question) => ({
    ...question,
    annulled: question.id === "theory-q1",
  }));
  const answers = Object.fromEntries(exam.map((question) => [question.id, null]));
  answers["theory-r1"] = "A";
  answers["theory-r2"] = "A";
  const result = scoreOpo12Attempt(C11000_EXAM_PROFILE, exam, answers);
  assert.equal(result.blocks[0].correct, 1);
  assert.equal(result.blocks[0].blank, 74);
  assert.equal(result.blocks[0].annulled, 1);
  assert.equal(result.blocks[0].score, 1.2);
});

test("aprobar exige alcanzar el mínimo de las dos partes", () => {
  const answers = Object.fromEntries(fullExam.map((question) => [question.id, null]));
  for (let index = 1; index <= 30; index += 1) answers[`theory-q${index}`] = "A";
  for (let index = 1; index <= 10; index += 1) answers[`practical-q${index}`] = "A";
  const result = scoreOpo12Attempt(C11000_EXAM_PROFILE, fullExam, answers);
  assert.equal(result.score, 48);
  assert.equal(result.passed, true);
  answers["practical-q10"] = null;
  assert.equal(scoreOpo12Attempt(C11000_EXAM_PROFILE, fullExam, answers).passed, false);
});

test("los test temáticos y repasos miden porcentaje sin alterar la nota oficial", () => {
  const result = scoreOpo12Training([
    { id: "1", correctOption: "A" },
    { id: "2", correctOption: "B" },
    { id: "3", correctOption: "C" },
    { id: "4", correctOption: "D" },
  ], { 1: "A", 2: "A", 3: null, 4: "D" });
  assert.deepEqual(result, { correct: 2, wrong: 1, blank: 1, total: 4, percentage: 50 });
});
