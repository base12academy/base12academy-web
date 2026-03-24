"use client";

import { useState } from "react";

const data = {
  imageUrl: "/images/tema01-imagen.jpg",
  question: "Describe y analiza la imagen relacionándola con el Tema 1.",
};

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

      <p>
        <strong>{data.question}</strong>
      </p>

      <textarea
        rows={5}
        style={{ width: "100%", padding: "8px", marginTop: "12px" }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
      />

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          style={{ marginTop: "12px", padding: "10px 14px", cursor: "pointer" }}
        >
          Enviar
        </button>
      )}

      {submitted && (
        <p style={{ marginTop: "16px" }}>✅ Respuesta guardada</p>
      )}
    </div>
  );
}