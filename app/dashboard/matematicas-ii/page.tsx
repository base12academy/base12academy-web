"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MATEMATICAS_II_BLOCKS, MATEMATICAS_II_STATS, MATEMATICAS_II_UNITS } from "@/lib/matematicas-ii/content";
import styles from "./matematicas-ii.module.css";

type AccessState = {
  authenticated: boolean;
  administrator: boolean;
  hasCourse: boolean;
  hasPau: boolean;
  plans: string[];
  previewUnit: string;
};

type VideoState = {
  embedUrl: string;
  url: string;
};

const INITIAL_ACCESS: AccessState = {
  authenticated: false,
  administrator: false,
  hasCourse: false,
  hasPau: false,
  plans: [],
  previewUnit: "T01",
};

export default function MatematicasIIPage() {
  const [selectedId, setSelectedId] = useState("T01");
  const [block, setBlock] = useState<(typeof MATEMATICAS_II_BLOCKS)[number] | "Todos">("Todos");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"curso" | "pau">("curso");
  const [access, setAccess] = useState<AccessState>(INITIAL_ACCESS);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [video, setVideo] = useState<VideoState>({ embedUrl: "", url: "" });
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function loadAccess() {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const response = await fetch("/api/matematicas-ii/access", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => INITIAL_ACCESS);
      if (alive) {
        setAccess({ ...INITIAL_ACCESS, ...payload });
        setCheckingAccess(false);
      }
    }
    loadAccess();
    return () => { alive = false; };
  }, []);

  const selected = MATEMATICAS_II_UNITS.find((unit) => unit.id === selectedId) ?? MATEMATICAS_II_UNITS[0];
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("es");
    return MATEMATICAS_II_UNITS.filter((unit) =>
      (block === "Todos" || unit.block === block) &&
      (!needle || `${unit.id} ${unit.title} ${unit.block}`.toLocaleLowerCase("es").includes(needle)),
    );
  }, [block, query]);

  const canOpenSelected = access.administrator || access.hasCourse || selected.id === access.previewUnit;
  const canUsePau = access.administrator || access.hasPau;

  useEffect(() => {
    let alive = true;

    async function loadVideo() {
      if (!canOpenSelected) {
        setVideo({ embedUrl: "", url: "" });
        return;
      }

      setVideoLoading(true);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const response = await fetch(`/api/matematicas-ii/video?unit=${encodeURIComponent(selected.id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => ({}));

      if (alive) {
        setVideo(response.ok ? {
          embedUrl: typeof payload.embedUrl === "string" ? payload.embedUrl : "",
          url: typeof payload.url === "string" ? payload.url : "",
        } : { embedUrl: "", url: "" });
        setVideoLoading(false);
      }
    }

    loadVideo();
    return () => { alive = false; };
  }, [selected.id, canOpenSelected]);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority />
          <span><strong>Matemáticas II</strong><small>2.º Bachillerato · PAU</small></span>
        </Link>
        <div className={styles.motto}>CONSTRUYE · COMPRENDE · DOMINA</div>
        <nav className={styles.topnav}>
          <Link href="/">Inicio</Link>
          <Link href="/dashboard">Mis cursos</Link>
          <Link href="/dashboard">Mi cuenta</Link>
        </nav>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <Link href="/dashboard" className={styles.back}>← Volver a mis cursos</Link>
          <h1>MATEMÁTICAS II</h1>
          <p className={styles.meta}>49 unidades operativas</p>

          <div className={styles.modeSwitch}>
            <button className={mode === "curso" ? styles.activeMode : ""} onClick={() => setMode("curso")}>Temario</button>
            <button className={mode === "pau" ? styles.activeMode : ""} onClick={() => setMode("pau")}>PAU</button>
          </div>

          {mode === "curso" ? <>
            <label className={styles.searchLabel}>Buscar tema
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Matrices, límites, Bayes…" />
            </label>
            <nav className={styles.blocks} aria-label="Bloques del curso">
              <button onClick={() => setBlock("Todos")} className={block === "Todos" ? styles.activeBlock : ""}>Todos</button>
              {MATEMATICAS_II_BLOCKS.map((item) => <button key={item} onClick={() => setBlock(item)} className={block === item ? styles.activeBlock : ""}>{item}</button>)}
            </nav>
            <div className={styles.unitList}>
              {filtered.map((unit) => {
                const locked = !access.administrator && !access.hasCourse && unit.id !== access.previewUnit;
                return <button key={unit.id} className={selected.id === unit.id ? styles.activeUnit : ""} onClick={() => setSelectedId(unit.id)}>
                  <span>{unit.id.startsWith("T") ? unit.order : "P"}</span>
                  <div><strong>{unit.id}</strong><small>{unit.title}</small></div>
                  {locked ? <b aria-label="Bloqueado">◇</b> : null}
                </button>;
              })}
            </div>
          </> : <PauMenu locked={!canUsePau} />}
        </aside>

        <main className={styles.main}>
          {mode === "curso" ? <>
            <div className={styles.breadcrumb}>Matemáticas II / {selected.block} / {selected.id}</div>
            <section className={styles.hero}>
              <div>
                <span className={styles.eyebrow}>{selected.block} · Unidad {selected.order} de {MATEMATICAS_II_STATS.units}</span>
                <h2>{selected.title}</h2>
                <p>Comprende el procedimiento, aplícalo paso a paso, detecta los errores frecuentes y comprueba que puedes resolver un caso nuevo.</p>
                {canOpenSelected ? <div className={styles.heroActions}>
                  <button type="button" className={styles.primary} onClick={() => document.getElementById("mat2-video")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Ver explicación</button>
                  <button type="button" className={styles.secondary}>Abrir recursos</button>
                </div> : <LockedCourse authenticated={access.authenticated} />}
              </div>
              <div className={styles.mathPanel} aria-hidden="true">
                <span>f(x)</span><b>∫</b><em>Σ</em><i>√x</i><small>A · x = b</small>
              </div>
            </section>

            {canOpenSelected ? <section id="mat2-video" style={{ marginTop: 24, borderRadius: 20, border: "1px solid #dbe4f0", background: "#ffffff", overflow: "hidden", boxShadow: "0 16px 45px rgba(15,23,42,0.08)" }}>
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div><strong style={{ display: "block", color: "#0a2a59", fontSize: 18 }}>{selected.id} · {selected.title}</strong><span style={{ color: "#64748b", fontSize: 13 }}>Vídeo principal de la unidad</span></div>
                {video.url ? <a href={video.url} target="_blank" rel="noreferrer" style={{ color: "#0a2a59", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>Abrir en YouTube ↗</a> : null}
              </div>
              <div style={{ aspectRatio: "16 / 9", background: "#07152d", display: "grid", placeItems: "center" }}>
                {videoLoading ? <p style={{ color: "white", fontWeight: 700 }}>Cargando vídeo…</p> : video.embedUrl ? <iframe src={video.embedUrl} title={`${selected.id} · ${selected.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ width: "100%", height: "100%", border: 0 }} /> : <p style={{ color: "white", fontWeight: 700 }}>No se ha podido cargar el vídeo de esta unidad.</p>}
              </div>
            </section> : null}

            <h3 className={styles.sectionTitle}>Trabaja esta unidad</h3>
            <div className={styles.resourceGrid}>
              <ResourceCard title="Vídeos explicativos" text="Procedimiento y ejemplos guiados, organizados por unidad." icon="▷" locked={!canOpenSelected} />
              <ResourceCard title="Material de apoyo" text="Resumen operativo, fórmulas, ejemplos y recursos asociados." icon="▤" locked={!canOpenSelected} />
              <ResourceCard title="Comprueba tu aprendizaje" text="Preguntas y ejercicios para verificar el dominio del procedimiento." icon="✓" locked={!canOpenSelected} />
              <ResourceCard title="Entrena como en la PAU" text="Problemas y práctica de examen cuando tu modalidad incluye PAU." icon="⌁" locked={!canUsePau} />
            </div>

            <section className={styles.courseMap}>
              <div><h3>Mapa del curso</h3><p>49 unidades: Álgebra, Geometría, Análisis y Probabilidad.</p></div>
              <div className={styles.blockStats}>{MATEMATICAS_II_BLOCKS.map((item) => <span key={item}><b>{MATEMATICAS_II_UNITS.filter((unit) => unit.block === item).length}</b>{item}</span>)}</div>
            </section>
          </> : <PauWorkspace allowed={canUsePau} authenticated={access.authenticated} />}
        </main>

        <aside className={styles.rightbar}>
          <AssistantCard image="/images/rocio-profesora-ia.png" name="Rocío" role="Profesora IA" text="Te ayuda a entender conceptos, procedimientos y errores de Matemáticas II." action="Practicar con Rocío" />
          <AssistantCard image="/images/fernando-tutor-ia.png" name="Fernando" role="Tutor IA" text="Organiza tus sesiones, repasos y progresión hasta la PAU." action="Plan de estudio" />
          <section className={styles.sideInfo}><strong>Tu objetivo</strong><p>Dominar los procedimientos y ser capaz de elegirlos correctamente cuando cambia el ejercicio.</p></section>
          {checkingAccess ? <p className={styles.accessNote}>Comprobando acceso…</p> : <p className={styles.accessNote}>{access.administrator ? "Acceso administrador" : access.plans.length ? `Modalidad: ${access.plans.join(" · ")}` : "Vista previa de la primera unidad"}</p>}
        </aside>
      </div>
    </div>
  );
}

function ResourceCard({ title, text, icon, locked }: { title: string; text: string; icon: string; locked: boolean }) {
  return <article className={locked ? `${styles.resourceCard} ${styles.locked}` : styles.resourceCard}><span>{icon}</span><h4>{title}</h4><p>{text}</p><b>{locked ? "Requiere tu modalidad" : "Abrir →"}</b></article>;
}

function LockedCourse({ authenticated }: { authenticated: boolean }) {
  return <div className={styles.lockNotice}><strong>Esta unidad forma parte del curso.</strong><p>{authenticated ? "Elige una modalidad con acceso al curso para continuar." : "Inicia sesión si ya estás matriculado o elige una modalidad."}</p><div><Link href={authenticated ? "/bachillerato-pau/matematicas-ii#modalidades" : "/login"}>{authenticated ? "Ver modalidades" : "Iniciar sesión"}</Link></div></div>;
}

function PauMenu({ locked }: { locked: boolean }) {
  return <div className={styles.pauMenu}><strong>Entrenamiento PAU</strong><button>Problemas tipo PAU {locked ? "◇" : ""}</button><button>Preguntas cortas {locked ? "◇" : ""}</button><button>Simulacros · 17 {locked ? "◇" : ""}</button><button>PAU por comunidades {locked ? "◇" : ""}</button></div>;
}

function PauWorkspace({ allowed, authenticated }: { allowed: boolean; authenticated: boolean }) {
  if (!allowed) return <section className={styles.pauLocked}><span>PAU</span><h2>Entrenamiento específico para la prueba</h2><p>Problemas, preguntas y simulacros quedan disponibles con Estándar o con la modalidad PAU.</p><Link href={authenticated ? "/bachillerato-pau/matematicas-ii#modalidades" : "/login"}>{authenticated ? "Ver modalidades" : "Iniciar sesión"}</Link></section>;
  return <><div className={styles.breadcrumb}>Matemáticas II / PAU</div><header className={styles.pauHeader}><span>ENTRENAMIENTO PAU</span><h2>Practica la prueba con método</h2><p>Trabaja problemas, preguntas y simulacros sin mezclar el entrenamiento específico con el temario del curso.</p></header><div className={styles.pauGrid}><ResourceCard title="Problemas PAU" text="Resolución y transferencia por bloques." icon="∫" locked={false} /><ResourceCard title="Preguntas cortas" text="Comprueba procedimientos, decisiones y resultados." icon="?" locked={false} /><ResourceCard title={`${MATEMATICAS_II_STATS.simulations} simulacros`} text="Práctica completa de examen." icon="▣" locked={false} /><ResourceCard title="PAU por comunidades" text="Modelos y criterios organizados por territorio." icon="⌂" locked={false} /></div></>;
}

function AssistantCard({ image, name, role, text, action }: { image: string; name: string; role: string; text: string; action: string }) {
  return <section className={styles.assistant}><Image src={image} alt={`${name}, ${role}`} width={1536} height={1024} /><div><h3>{name}</h3><strong>{role}</strong><p>{text}</p><button type="button">{action}</button></div></section>;
}
