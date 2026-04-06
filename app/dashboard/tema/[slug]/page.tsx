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
  const isFreeTopic = slug === "tema-1";

  const canAccessTopic = isFreeTopic || (hasAccess && temaElegido && unlocked);
  const canSeeContent = canAccessTopic;
  const canDoTests = canAccessTopic;
  const showBlockExam = isLastTopicOfBlock(slug);

// 🔴 BLOQUEO 1 — NO HA COMPRADO
if (!isFreeTopic && !hasAccess) {
  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <Link href="/dashboard">← Volver</Link>

      <div style={{ marginTop: "24px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "16px", padding: "24px" }}>
        <h1 style={{ marginTop: 0 }}>Acceso bloqueado</h1>
        <p style={{ marginBottom: "16px" }}>
          Ya has podido ver el Tema 1. Para acceder al resto del curso, desbloquea el acceso completo.
        </p>

        <Link href="/comprar" style={{ display: "inline-block", padding: "12px 16px", background: "#2563eb", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: 600 }}>
          Desbloquear curso completo
        </Link>
      </div>
    </main>
  );
}


// 🔴 BLOQUEO 2 — NO ESTÁ EN SUS 25 TEMAS
if (hasAccess && !temaElegido && !isFreeTopic) {
  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <Link href="/dashboard">← Volver</Link>

      <div style={{ marginTop: "24px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "16px", padding: "24px" }}>
        <h1 style={{ marginTop: 0 }}>Tema no incluido</h1>
        <p style={{ marginBottom: "16px" }}>
          Este tema no forma parte de tu selección actual.
        </p>

        <Link href="/dashboard" style={{ display: "inline-block", padding: "12px 16px", background: "#111827", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: 600 }}>
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
}


// 🔴 BLOQUEO 3 — PROGRESO
if (!unlocked && !isFreeTopic) {
  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <Link href="/dashboard">← Volver</Link>

      <div style={{ marginTop: "24px", background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "16px", padding: "24px" }}>
        <h1 style={{ marginTop: 0 }}>Tema bloqueado</h1>
        <p style={{ marginBottom: "16px" }}>
          Debes superar el tema anterior con al menos un 80%.
        </p>

        <Link href="/dashboard" style={{ display: "inline-block", padding: "12px 16px", background: "#111827", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: 600 }}>
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
}

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      
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
) : null}

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
  
  ) : null}

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
