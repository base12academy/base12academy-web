"use client";

import { useState } from "react";

export default function TestFullPage() {
  const [result, setResult] = useState<any>(null);

  async function handleTest() {
    const res = await fetch("/api/test-full-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicSlug: "tema-3",
        shortAnswers: {
          tc3_1: "Los fenicios llegaron desde Tiro y Sidón en el Líbano.",
          tc3_2: "Buscaban la plata y el cobre de Tartessos.",
          tc3_3: "Fundaron factorías comerciales en la costa.",
          tc3_4: "Gadir y Malaka.",
          tc3_5: "Introdujeron salazones y el olivo.",
        },
        sourceAnswer:
          "Comentario suficientemente largo para prueba de fuente histórica con más de ciento veinte caracteres y contenido mínimo para activar puntuación completa en esta fase de prueba.",
        developmentAnswer:
          "Los fenicios llegaron a la península ibérica atraídos por la riqueza minera y fundaron colonias como Gadir, Malaka, Abdera y Sexi. Los griegos se instalaron en Emporion y Mainake, impulsaron el comercio, la moneda, el vino y un urbanismo más avanzado. Más tarde los cartagineses, con los Bárcidas, fundaron Qart Hadasht y usaron la península como base militar y económica hasta el conflicto con Roma en la Segunda Guerra Púnica.",
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Prueba examen completo</h1>

      <button onClick={handleTest} style={{ padding: 10 }}>
        Probar examen completo
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}