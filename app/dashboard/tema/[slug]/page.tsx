"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  temasHistoria,
  IMAGENES_BLOQUES,
  TEXTOS_BLOQUES,
  getInitialTopicProgressMap,
  isTopicUnlocked,
  isLastTopicOfBlock,
} from "@/lib/temas";

const COLORS = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#1f2937",
  primary: "#2563eb",
  primaryLight: "#60a5fa",
};

export default function TemaPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openTemario, setOpenTemario] = useState(false);
  const [openIndice, setOpenIndice] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [temasActivos, setTemasActivos] = useState<string[]>([]);

  // 🔥 CARGA PROGRESO LOCAL
  useEffect(() => {
    const saved = localStorage.getItem("historia-best-scores");
    if (saved) {
      setBestScores(JSON.parse(saved));
    }
  }, []);

  const topicProgressMap = useMemo(() => getInitialTopicProgressMap(), []);

  const indiceActual = temasHistoria.findIndex((t) => t.slug === slug);
  const temaData = temasHistoria[indiceActual];

  if (!temaData) {
    return <div style={{ padding: "32px" }}>Tema no encontrado</div>;
  }

  // 🔥 DESBLOQUEO REAL
  const prevTema = temasHistoria[indiceActual - 1];
  const unlocked =
    indiceActual === 0 ||
    (prevTema && (bestScores[prevTema.slug] || 0) >= 80);

  const bloque = `bloque-${Math.floor(indiceActual / 4) + 1}`;
  const imagenes = IMAGENES_BLOQUES[bloque as keyof typeof IMAGENES_BLOQUES] || [];
  const textos = TEXTOS_BLOQUES[bloque as keyof typeof TEXTOS_BLOQUES] || [];

  useEffect(() => {
  const checkAccess = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    const { data } = await supabase
      .from("perfiles")
      .select("acceso, temas_activos")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data?.acceso) {
      setHasAccess(true);
    }

    if (Array.isArray(data?.temas_activos)) {
      setTemasActivos(data.temas_activos);
    }
  };

  checkAccess();
}, []);

  const temaElegido = temasActivos.includes(slug);
  const canSeeContent = slug === "tema-1" || (hasAccess && temaElegido);
  const canDoTests = (slug === "tema-1") || (hasAccess && unlocked);
  const showBlockExam = isLastTopicOfBlock(slug);

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* 🔥 BLOQUEO DE TEMA */}
      {!unlocked && (
        <div style={{ background: "#fdeaea", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
          🔒 Debes superar el tema anterior con al menos un 80%
        </div>
      )}

      <Link href="/dashboard">← Volver</Link>

      <h1>{temaData.titulo}</h1>

      <p>{temaData.descripcion}</p>

      {/* VIDEO */}
      <iframe width="100%" height="400" src={temaData.videoUrl} />

      {/* ÍNDICE */}
      <button onClick={() => setOpenIndice(!openIndice)}>
        Índice
      </button>

      {openIndice && <div>{temaData.indice}</div>}

      {/* TEMARIO */}
      {canSeeContent ? (
  <>
    <button onClick={() => setOpenTemario(!openTemario)}>
      Temario
    </button>

    {openTemario && <div>{temaData.contenido}</div>}
  </>
) : hasAccess && !temaElegido ? (
  <div
    style={{
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: "12px",
      padding: "16px",
      marginTop: "12px",
    }}
  >
    Este tema no forma parte de tu selección actual de 25 temas.
  </div>
) : (
  <Link href="/comprar">Comprar acceso</Link>
)}

      {/* 🔥 PRUEBAS CORRECTAS */}
      <section>
  <h2>Pruebas</h2>

  {canDoTests ? (
    <>
      <Link href={`/dashboard/test?tema=${slug}`}>
        <div>Test del tema</div>
      </Link>

      <Link href={`/dashboard/shorts?tema=${slug}`}>
        <div>Preguntas cortas</div>
      </Link>
    </>
  ) : (
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "12px",
        padding: "16px",
        marginTop: "12px",
      }}
    >
      <p style={{ marginBottom: "10px" }}>
        🔒 Debes activar el acceso y superar el tema anterior para desbloquear las pruebas.
      </p>

      <Link href="/comprar">Ir a comprar acceso</Link>
    </div>
  )}
</section>

      {/* 🔥 MEDALLA */}
      <section style={{ marginTop: "24px" }}>
        <h3>Progreso</h3>

        <p>Mejor nota: {bestScores[slug] || 0}%</p>

        {bestScores[slug] >= 80 && (
          <p style={{ color: "green" }}>🏅 Tema superado</p>
        )}
      </section>

      {/* IMÁGENES */}
      <section>
        <h2>Imágenes</h2>

        {imagenes.map((img, i) => (
          <div key={i}>
            <p>{img.titulo}</p>
            {img.imagen && <img src={img.imagen} width="200" />}
            <p>{img.descripcion}</p>
          </div>
        ))}
      </section>

      {/* TEXTOS */}
      <section>
        <h2>Textos</h2>

        {textos.map((txt, i) => (
          <div key={i}>
            <p>{txt.titulo}</p>
            <p>{txt.descripcion}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
