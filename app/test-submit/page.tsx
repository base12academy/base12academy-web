"use client";

import { useState } from "react";

export default function TestSubmitPage() {
  const [result, setResult] = useState<any>(null);

  async function handleSubmit() {
    const res = await fetch("/api/submit-block-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "11111111-1111-1111-1111-111111111111",
        blockId: "bloque_1",
        topicSlug: "tema-3",
        shortAnswers: {
          tc3_1: "Los fenicios llegaron desde Tiro y Sidón en el Líbano.",
          tc3_2: "Buscaban la plata y el cobre de Tartessos.",
          tc3_3: "Fundaron factorías comerciales en la costa.",
          tc3_4: "Gadir y Malaka.",
          tc3_5: "Introdujeron salazones y el olivo.",
        },
        sourceAnswer:
          "Comentario suficientemente largo para prueba de fuente histórica con más de veinte palabras y contenido suficiente para activar la puntuación completa de esta fase de prueba del comentario.",
        developmentAnswer:
          "Los fenicios llegaron a la península ibérica atraídos por la riqueza minera y fundaron colonias como Gadir, Malaka, Abdera y Sexi. Los griegos se instalaron en Emporion y Mainake, impulsaron el comercio, la moneda, el vino y un urbanismo más avanzado. Más tarde los cartagineses, con los Bárcidas, fundaron Qart Hadasht y usaron la península como base militar y económica hasta el conflicto con Roma en la Segunda Guerra Púnica.",
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Enviar examen de bloque</h1>

      <button onClick={handleSubmit} style={{ padding: 10 }}>
        Enviar examen
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}