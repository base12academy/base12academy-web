"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { temasFilosofia } from "@/lib/temas-filosofia";

const COLORS = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#1f2937",
  primary: "#2563eb",
  primaryLight: "#60a5fa",
};

export default function TemaFilosofiaPage() {
  const params = useParams();
  const slug = params.slug as string;

  const temaData = temasFilosofia.find((t) => t.slug === slug);

  if (!temaData) {
    return <div style={{ padding: "32px" }}>Tema no encontrado</div>;
  }

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "900px",
        margin: "0 auto",
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Link href="/dashboard/filosofia">
          <div
            style={{
              display: "inline-block",
              padding: "12px 16px",
              background: COLORS.primary,
              color: "white",
              borderRadius: "10px",
              fontWeight: "500",
            }}
          >
            ← Volver a Filosofía
          </div>
        </Link>
      </div>

      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}>
        {temaData.titulo}
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "24px" }}>
        {temaData.descripcion}
      </p>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Índice del tema
        </h2>

        <div
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.8",
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          {temaData.indice}
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Temario
        </h2>

        <div
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.8",
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          {temaData.contenido}
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Material de apoyo
        </h2>

        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          Aquí irán los movimientos filosóficos y materiales comparativos.
        </div>
      </section>
    </main>
  );
}