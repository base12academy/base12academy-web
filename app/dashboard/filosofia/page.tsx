"use client";

import Link from "next/link";
import { temasFilosofia } from "@/lib/temas-filosofia";

export default function FilosofiaPage() {
  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
        Historia de la Filosofía
      </h1>

      <p style={{ marginBottom: "24px", fontSize: "18px", color: "#4b5563" }}>
        Curso estructurado por temas, con material de apoyo y preparación práctica
        orientada a PAU.
      </p>

      <section
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px",
          lineHeight: "1.8",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Cómo estudiar este curso
        </h2>

        <p><strong>1. Comprende el autor</strong> → estudia el tema y su contexto.</p>
        <p><strong>2. Refuerza ideas clave</strong> → apóyate en movimientos y materiales comparativos.</p>
        <p><strong>3. Relaciona conceptos</strong> → prepara comparaciones entre autores y corrientes.</p>
      </section>

      {temasFilosofia.map((tema) => (
        <div
          key={tema.slug}
          style={{
            marginBottom: "20px",
            padding: "24px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
          }}
        >
          <h2>{tema.titulo}</h2>
          <p>{tema.descripcion}</p>

          <Link href={`/dashboard/filosofia/${tema.slug}`}>Ver tema →</Link>
        </div>
      ))}
    </main>
  );
}