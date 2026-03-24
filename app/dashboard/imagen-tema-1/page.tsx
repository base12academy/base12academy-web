"use client";

import { useState } from "react";

const data = require("../../data/historia/tema01_imagen.json");

export default function ImagenTema1Page() {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ padding: "32px" }}>
      <h1>Comentario de imagen - Tema 1</h1>

      <img
        src={data.imageUrl}
        alt="Imagen del tema"
        style={{ maxWidth: "100%", marginBottom: "20px" }}
      />

      <p><strong>{data.question}</strong></p>

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
              "tema-01-imagen",
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
              ? "✅ Imagen superada"
              : "❌ Respuesta insuficiente"}
          </p>

          <p style={{ color: "#6b7280" }}>
            💡 {data.answerGuide}
          </p>
        </>
      )}
    </div>
  );
}