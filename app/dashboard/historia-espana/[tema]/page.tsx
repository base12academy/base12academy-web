"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { temasHistoria } from "@/lib/temas";

export default function TemaPage() {
  const params = useParams();
  const tema = params.tema as string;

  const indiceActual = temasHistoria.findIndex((t) => t.slug === tema);
  const temaData = temasHistoria[indiceActual];

  if (!temaData) {
    return <div>Tema no encontrado</div>;
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>{temaData.titulo}</h1>

      {indiceActual === 0 && (
        <div style={{ marginTop: "20px" }}>
          <Link href="/dashboard/test">
            Ir al test del Tema 1 →
          </Link>
        </div>
      )}

      {indiceActual === 0 && (
        <div style={{ marginTop: "12px" }}>
          <Link href="/dashboard/cortas-tema-1">
            Ir a preguntas cortas del Tema 1 →
          </Link>
        </div>
      )}

      {indiceActual === 0 && (
        <div style={{ marginTop: "12px" }}>
          <Link href="/dashboard/texto-tema-1">
            Ir al comentario de texto del Tema 1 →
          </Link>
        </div>
      )}

      {indiceActual === 0 && (
        <div style={{ marginTop: "12px" }}>
          <Link href="/dashboard/imagen-tema-1">
            Ir al comentario de imagen del Tema 1 →
          </Link>
        </div>
      )}

      {indiceActual === 1 && (
        <div style={{ marginTop: "20px" }}>
          {hasAccess ? (
  <Link href="/dashboard/test">
    Ir al test del Tema 2 →
  </Link>
) : (
  <p>🔒 Necesitas acceso para hacer el test</p>
)}
        </div>
      )}
    </main>
  );
}