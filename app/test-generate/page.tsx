"use client";

import { useState } from "react";

export default function TestGeneratePage() {
  const [result, setResult] = useState<any>(null);

  async function handleGenerate() {
    const res = await fetch("/api/generate-block-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockId: "bloque_1",
        selectedTopicSlugs: ["tema-3"],
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Generar examen de bloque</h1>

      <button onClick={handleGenerate} style={{ padding: 10 }}>
        Generar
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}