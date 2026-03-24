"use client";

import { useEffect, useState } from "react";
import { awardBadge } from "../../../lib/badges-storage";
import { BADGES } from "../../../lib/badges";

const data = require("../../data/historia/tema01_cortas.json");

export default function CortasTema1Page() {
  const questions = data.questions || data;
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tema-01-cortas");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setScore(parsed.correct ?? null);
      setSubmitted(true);
    }
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <h1>Preguntas cortas - Tema 1</h1>

      {questions.map((q: any) => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          <p>
            <strong>{q.question}</strong>
          </p>

          <textarea
            rows={3}
            style={{ width: "100%", padding: "8px" }}
            disabled={submitted}
            value={answers[q.id] || ""}
            onChange={(e) =>
              setAnswers((prev: any) => ({
                ...prev,
                [q.id]: e.target.value,
              }))
            }
          />

          {submitted && (
            <p style={{ marginTop: "5px", color: "#6b7280" }}>
              💡 Guía: {q.answerGuide}
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={() => {
            let correct = 0;

            questions.forEach((q: any) => {
              const respuesta = (answers[q.id] || "").trim();
              if (respuesta.length > 20) {
                correct++;
              }
            });

            const result = {
              correct,
              total: questions.length,
              approved: correct >= 4,
              answers,
            };

            setScore(correct);
            setSubmitted(true);
            localStorage.setItem("tema-01-cortas", JSON.stringify(result));

            if (correct === 5) {
              const gained: string[] = [];

              if (awardBadge("cortas_tema1_5_5")) {
                gained.push(BADGES["cortas_tema1_5_5"].title);
              }

              if (gained.length > 0) {
                setTimeout(() => {
                  alert(`🎉 Has conseguido: ${gained.join(", ")}`);
                }, 100);
              }
            }
          }}
        >
          Enviar respuestas
        </button>
      )}

      {submitted && (
        <>
          <p>Resultado: {score}/5</p>
          <p>
            {score !== null && score >= 4
              ? "✅ Cortas superadas"
              : "❌ Cortas no superadas"}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("tema-01-cortas");
              setAnswers({});
              setScore(null);
              setSubmitted(false);
            }}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            🔄 Reiniciar cortas
          </button>
        </>
      )}
    </div>
  );
}