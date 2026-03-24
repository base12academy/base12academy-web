"use client";

import { useState } from "react";

const data = require("../../../data/historia/tema01_texto.json");

export default function TextoTema1Page() {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ padding: "32px" }}>
      <h1>Comentario de texto - Tema 1</h1>

      <p style={{ marginBottom: "20px", fontStyle: "italic" }}>
        {data.text}
      </p>

      <p><strong>{data.questions[0].question}</strong></p>

      <textarea
        rows={5}
        style={{ width: "100%", padding: "8px" }}
        value={answer}
        disabled={submitted}
        onChange={(e) => setAnswer(e.target.value)}
      />

      {!submitted && (
        <button
          onClick={() => {
            const aprobado = answer.trim().length > 50;

            const result = {
              approved: aprobado,
              answer,
            };

            localStorage.setItem(
              "tema-01-texto",
              JSON.stringify(result)
            );

            setSubmitted(true);
          }}
          style={{ marginTop: "10px" }}
        >
          Enviar respuesta
        </button>
      )}

      {submitted && (
        <>
          <p>
            {answer.length > 50
              ? "✅ Texto superado"
              : "❌ Texto insuficiente"}
          </p>

          <p style={{ color: "#6b7280" }}>
            💡 {data.questions[0].answerGuide}
          </p>
        </>
      )}
    </div>
  );
}