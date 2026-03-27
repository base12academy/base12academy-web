"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  temasHistoria,
  IMAGENES_BLOQUES,
  TEXTOS_BLOQUES,
} from "@/lib/temas";

export default function TemaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [hasAccess, setHasAccess] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
  setHasAccess(true);
}, []);

  const indiceActual = temasHistoria.findIndex((t) => t.slug === slug);
  const temaData = temasHistoria[indiceActual];

  if (!temaData) {
    return <div style={{ padding: "32px" }}>Tema no encontrado</div>;
  }

  const bloque = `bloque-${Math.floor(indiceActual / 4) + 1}`;
  const imagenes =
    IMAGENES_BLOQUES[bloque as keyof typeof IMAGENES_BLOQUES] || [];
  const textos =
    TEXTOS_BLOQUES[bloque as keyof typeof TEXTOS_BLOQUES] || [];

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
          Índice del tema
        </h2>

        <div
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.8",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            userSelect: "none",
          }}
        >
          {temaData.indice}
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Temario
        </h2>

        {hasAccess ? (
          <div
            style={{
              whiteSpace: "pre-line",
              lineHeight: "1.8",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px",
              userSelect: "none",
            }}
          >
            {temaData.contenido}
          </div>
        ) : (
          <div
            style={{
              background: "#f3f4f6",
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
              🔒 Contenido premium bloqueado
            </p>

            <p style={{ marginBottom: "16px" }}>
              Accede al desarrollo completo del tema, esquemas y preparación tipo EBAU.
            </p>

            <Link href="/comprar" style={{ fontWeight: "bold" }}>
              Activar acceso →
            </Link>
          </div>
        )}
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

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Imágenes del bloque
        </h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {imagenes.map((img, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#ffffff",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{img.titulo}</p>
                {"imagen" in img && img.imagen ? (
  <img
  src={img.imagen}
  alt={img.titulo}
  style={{
    width: "300px",
    display: "block",
    margin: "0 auto 12px auto",
    borderRadius: "12px",
  }}
/>
) : null}

              <p style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>
                {img.descripcion}
              </p>

              {"explicacion" in img && img.explicacion ? (
  <>
    <button
      onClick={() => setOpenIndex(openIndex === i ? null : i)}
      style={{
        marginBottom: "12px",
        fontSize: "14px",
        color: "#2563eb",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {openIndex === i ? "Ocultar explicación ↑" : "Ver explicación ↓"}
    </button>

    {openIndex === i ? (
      <div
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.8",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "15px",
        }}
      >
        {img.explicacion}
      </div>
    ) : null}
  </>
) : null}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Textos históricos del bloque
        </h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {textos.map((txt, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#ffffff",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{txt.titulo}</p>

              <p style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>
                {txt.descripcion}
              </p>

              {"explicacion" in txt && txt.explicacion ? (
                <div
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.8",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                    fontSize: "15px",
                  }}
                >
                  {txt.explicacion}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}