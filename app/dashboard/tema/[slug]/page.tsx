"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { temasHistoria } from "@/lib/temas";

export default function TemaPage() {
  const params = useParams();
  const slug = params.slug as string;

  const indiceActual = temasHistoria.findIndex((t) => t.slug === slug);
  const temaData = temasHistoria[indiceActual];

  if (!temaData) {
    return <div style={{ padding: "32px" }}>Tema no encontrado</div>;
  }

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/dashboard">← Volver al dashboard</Link>
      </div>

      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}>
        {temaData.titulo}
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "24px" }}>
        {temaData.descripcion}
      </p>

      <div style={{ marginBottom: "32px" }}>
        <iframe
          width="100%"
          height="400"
          src={temaData.videoUrl}
          title={temaData.titulo}
          style={{ border: "none", borderRadius: "16px" }}
          allowFullScreen
        />
      </div>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Temario
        </h2>

        <div
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.8",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          {temaData.contenido}
        </div>
      </section>

      {slug === "tema-1" && (
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
            Pruebas del Tema 1
          </h2>

          <div style={{ display: "grid", gap: "12px" }}>
            <Link href="/dashboard/test">Hacer test del Tema 1</Link>
            <Link href="/dashboard/cortas-tema-1">Preguntas cortas del Tema 1</Link>
            <Link href="/dashboard/texto-tema-1">Prueba de texto del Tema 1</Link>
            <Link href="/dashboard/imagen-tema-1">Prueba de imagen del Tema 1</Link>
          </div>
        </section>
      )}

      {indiceActual === 3 && (
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
            Prueba de bloque
          </h2>

          <div style={{ display: "grid", gap: "12px" }}>
            <Link href="/dashboard/temario-largo-bloque-1">
              Prueba de temario largo del Bloque 1
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}