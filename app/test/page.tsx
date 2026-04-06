"use client";

import { useEffect, useState } from "react";

type SourceData = {
  source_id: string;
  source_type: "image" | "text";
  title: string | null;
  content: string | null;
  asset_url: string | null;
};

export default function TestPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [source, setSource] = useState<SourceData | null>(null);

  useEffect(() => {
    async function loadSource() {
      const res = await fetch("/api/test-source");
      const data = await res.json();
      setSource(data);
    }

    loadSource();
  }, []);

  async function handleTest() {
    const res = await fetch("/api/test-grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  answer: text,
  image: source?.asset_url,
}),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Comentario de fuente</h1>

      {source?.source_type === "image" && source.asset_url && (
        <img
          src={source.asset_url}
          alt="Fuente histórica"
          style={{ width: "100%", maxWidth: 800, marginBottom: 20 }}
        />
      )}

      {source?.source_type === "text" && source.content && (
        <div style={{ marginBottom: 20, whiteSpace: "pre-wrap" }}>
          {source.content}
        </div>
      )}

      <p>Realiza un comentario histórico en unas 20 líneas.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        style={{ width: "100%" }}
        placeholder="Escribe aquí tu respuesta..."
      />

      <button
        onClick={handleTest}
        style={{ marginTop: 10, padding: 10 }}
      >
        Corregir
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}