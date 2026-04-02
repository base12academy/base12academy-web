"use client";

import { useState } from "react";
import { TEXTOS_BLOQUES } from "@/lib/temas";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreByKeywords(answer: string, keywords: string[]) {
  const text = normalize(answer);
  let hits = 0;

  for (const keyword of keywords) {
    if (text.includes(normalize(keyword))) hits++;
  }

  return Math.round((hits / keywords.length) * 100);
}

export default function Bloque1Page() {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");
  const [tema, setTema] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const textos = TEXTOS_BLOQUES["bloque-2"] || [];
  const texto = textos[0];

  const handleSubmit = () => {
    const s1 = scoreByKeywords(q1, [
      "paleolitico",
      "caza",
      "recoleccion",
      "nomadismo",
    ]);

    const s2 = scoreByKeywords(q2, [
      "neolitico",
      "agricultura",
      "ganaderia",
      "sedentarismo",
    ]);

    const s3 = scoreByKeywords(docA, [
      "prehistoria",
      "peninsula iberica",
      "sociedades humanas",
    ]);

    const s4 = scoreByKeywords(docB, [
      "contexto",
      "prehistoria",
      "evolucion",
    ]);

    const s5 = scoreByKeywords(tema, [
      "paleolitico",
      "neolitico",
      "metales",
      "hominizacion",
    ]);

    const finalScore = Math.round((s1 + s2 + s3 + s4 + s5) / 5);

    setScore(finalScore);
    setSubmitted(true);
  };

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "24px" }}>
        Prueba PAU — Bloque 1
      </h1>

      <section style={{ marginBottom: "32px" }}>
        <h2>I. Cuestiones</h2>

        <div style={{ marginBottom: "20px" }}>
          <p>1. Define Paleolítico y sus características.</p>
          <textarea
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "12px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p>2. Explica la revolución neolítica.</p>
          <textarea
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "12px" }}
          />
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>II. Documento</h2>

        {texto ? (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontWeight: "bold" }}>{texto.titulo}</p>

            <div
              style={{
                whiteSpace: "pre-line",
                background: "#f9fafb",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              {texto.texto}
            </div>
          </div>
        ) : null}

        <div style={{ marginBottom: "20px" }}>
          <p>a) Resume el contenido del texto.</p>
          <textarea
            value={docA}
            onChange={(e) => setDocA(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "12px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p>b) Contextualiza históricamente el documento.</p>
          <textarea
            value={docB}
            onChange={(e) => setDocB(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "12px" }}
          />
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>III. Tema</h2>

        <p>Desarrolla: La Prehistoria en la Península Ibérica.</p>
        <textarea
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          rows={8}
          style={{ width: "100%", padding: "12px" }}
        />
      </section>

      <button
        onClick={handleSubmit}
        style={{
          padding: "12px 20px",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
        }}
      >
        Entregar prueba
      </button>

      {submitted && score !== null ? (
        <div style={{ marginTop: "16px" }}>
          <p>Resultado: {score}%</p>
          <p>{score >= 80 ? "✅ Bloque superado" : "❌ Bloque no superado"}</p>
        </div>
      ) : null}
    </main>
  );
}