"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BADGES } from "@/lib/badges";
import {
  temasHistoria,
  IMAGENES_BLOQUES,
  TEXTOS_BLOQUES,
} from "@/lib/temas";
const COLORS = {
  bg: "#f8fafc",        // blanco roto
  card: "#ffffff",     // tarjetas
  border: "#e5e7eb",   // gris suave
  text: "#1f2937",     // gris oscuro (no negro)
  primary: "#2563eb",  // azul corporativo
  primaryLight: "#60a5fa" // azul claro
};

export default function TemaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [hasAccess, setHasAccess] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openTemario, setOpenTemario] = useState(false);
  const [openIndice, setOpenIndice] = useState(false);

  useEffect(() => {
  if (slug === "tema-1") {
    setHasAccess(true);
  } else {
    setHasAccess(false);
  }
}, [slug]);

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
    <main style={{
  padding: "32px",
  maxWidth: "900px",
  margin: "0 auto",
  background: COLORS.bg,
  color: COLORS.text,
  minHeight: "100vh"
}}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/dashboard/historia-espana">
  <div
    style={{
      display: "inline-block",
      padding: "12px 16px",
      background: COLORS.primary,
      color: "white",
      borderRadius: "10px",
      fontWeight: "500",
      marginBottom: "8px",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    }}
  >
    ← Volver a Historia de España
  </div>
</Link>
      </div>

      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}>
        {temaData.titulo}
      </h1>
        <div
  style={{
    marginBottom: "20px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      padding: "6px 10px",
      background: "#ecfeff",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "500",
    }}
  >
    🎯 {BADGES.primer_test_aprobado.title}
  </div>

  <div
    style={{
      padding: "6px 10px",
      background: "#ecfeff",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "500",
    }}
  >
    ⭐ {BADGES.test_tema1_80.title}
  </div>
</div>
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

  <button
    onClick={() => setOpenIndice(!openIndice)}
    style={{
      marginBottom: "12px",
      fontSize: "14px",
      background: COLORS.primaryLight,
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}`,
      borderRadius: "10px",
      cursor: "pointer",
      padding: "10px 14px",
      fontWeight: "500",
      width: "100%",
      textAlign: "center",
    }}
  >
    {openIndice ? "Ocultar índice ↑" : "Ver índice ↓"}
  </button>

  {openIndice ? (
    <div
      style={{
        whiteSpace: "pre-line",
        lineHeight: "1.8",
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "16px",
        padding: "24px",
        userSelect: "none",
      }}
    >
      {temaData.indice}
    </div>
  ) : null}
</section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Temario
        </h2>
{hasAccess ? (
  <>
    <button
      onClick={() => setOpenTemario(!openTemario)}
      style={{
        marginBottom: "12px",
        fontSize: "14px",
        background: COLORS.primaryLight,
        color: COLORS.primary,
        border: `1px solid ${COLORS.primary}`,
        borderRadius: "10px",
        cursor: "pointer",
        padding: "10px 14px",
        fontWeight: "500",
        width: "100%",
        textAlign: "center",
      }}
    >
      {openTemario ? "Ocultar temario ↑" : "Ver temario ↓"}
    </button>

    {openTemario ? (
      <div
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.8",
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "16px",
          padding: "24px",
          userSelect: "none",
        }}
      >
        {temaData.contenido}
      </div>
    ) : null}
  </>
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

            <p style={{ marginBottom: "16px", fontSize: "16px" }}>
  Accede al contenido completo del tema, esquemas claros y preparación para sacar la máxima nota en la EBAU.
</p>

<p style={{ marginBottom: "16px", fontSize: "14px", color: "#6b7280" }}>
  ✔️ Explicado paso a paso  
  ✔️ Enfocado a examen real  
  ✔️ Diseñado para subir nota
</p>

            <Link href="/comprar">
  <div
    style={{
      display: "inline-block",
      padding: "14px 20px",
      background: COLORS.primary,
      color: "white",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      textAlign: "center",
      marginTop: "12px",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    }}
  >
    🔓 Activar acceso completo
  </div>
</Link>
          </div>
        )}
      </section>

      {slug === "tema-1" && (
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
            Pruebas del Tema 1
          </h2>

          <div
  style={{
    display: "grid",
    gap: "12px",
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    padding: "20px",
  }}
>
            <Link href="/dashboard/test">
  <div style={{
    padding: "12px 16px",
    background: COLORS.primary,
    color: "white",
    borderRadius: "10px",
    display: "inline-block",
    fontWeight: "500",
    marginBottom: "8px"
  }}>
    Hacer test del Tema 1
  </div>
</Link>
            <Link href="/dashboard/cortas-tema-1">
  <div
    style={{
      padding: "12px 16px",
      background: COLORS.primary,
      color: "white",
      borderRadius: "10px",
      display: "inline-block",
      fontWeight: "500",
    }}
  >
    Preguntas cortas del Tema 1
  </div>
</Link>

<Link href="/dashboard/texto-tema-1">
  <div
    style={{
      padding: "12px 16px",
      background: COLORS.primary,
      color: "white",
      borderRadius: "10px",
      display: "inline-block",
      fontWeight: "500",
    }}
  >
    Prueba de texto del Tema 1
  </div>
</Link>

<Link href="/dashboard/imagen-tema-1">
  <div
    style={{
      padding: "12px 16px",
      background: COLORS.primary,
      color: "white",
      borderRadius: "10px",
      display: "inline-block",
      fontWeight: "500",
    }}
  >
    Prueba de imagen del Tema 1
  </div>
</Link>
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
                border: `1px solid ${COLORS.border}`,
                background: COLORS.card,
                borderRadius: "12px",
                }}
            >
              <div style={{ marginBottom: "8px" }}>
  <span
    style={{
      fontSize: "12px",
      padding: "4px 8px",
      borderRadius: "999px",
      background:
        img.titulo === "Dama de Elche" ? "#dbeafe" : "#f3f4f6",
      color:
        img.titulo === "Dama de Elche" ? COLORS.primary : "#6b7280",
      fontWeight: "500",
    }}
  >
    {img.titulo === "Dama de Elche" ? "EBAU" : "Subir nota"}
  </span>
</div>

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
    background: COLORS.primaryLight,
    color: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    borderRadius: "10px",
    cursor: "pointer",
    padding: "10px 14px",
    fontWeight: "500",
    width: "100%",
    textAlign: "center",
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