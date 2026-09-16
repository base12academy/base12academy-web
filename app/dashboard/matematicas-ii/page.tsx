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

type VideoState = { embedUrl: string; url: string };
type ResourceKind = "rocio" | "short" | "problems" | "profiles" | "simulation";

type RocioItem = {
  id: string;
  question: string;
  options: Record<"A" | "B" | "C" | "D", string>;
  correct: "A" | "B" | "C" | "D";
  feedback: string;
  recovery: string;
};

type ShortItem = { id: string; question: string; expectedAnswer: string; rubric: string };
type ProblemItem = { id: string; block: string; statement: string; solution: string; rubric: string };
type ProfileItem = { code: string; community: string; status: string; format: string; source: string };
type SimulationExercise = { label: string; statement: string; solution: string; rubric: string };
type Simulation = { code: string; community: string; profile: string; exercises: SimulationExercise[] };

type EvaluationPayload =
  | { type: "rocio"; items: RocioItem[] }
  | { type: "short"; items: ShortItem[] }
  | { type: "problems"; items: ProblemItem[] }
  | { type: "profiles"; items: ProfileItem[] }
  | { type: "simulation"; simulation: Simulation };

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
  const [resourceKind, setResourceKind] = useState<ResourceKind | null>(null);
  const [resourceData, setResourceData] = useState<EvaluationPayload | null>(null);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceError, setResourceError] = useState("");

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

  useEffect(() => {
    if (resourceKind === "rocio" || resourceKind === "short") {
      setResourceKind(null);
      setResourceData(null);
      setResourceError("");
    }
  }, [selectedId]);

  async function openResource(kind: ResourceKind, code?: string) {
    setResourceKind(kind);
    setResourceData(null);
    setResourceError("");
    setResourceLoading(true);

    const params = new URLSearchParams({ type: kind });
    if (kind === "rocio") params.set("unit", selected.id);
    if (kind === "short") {
      if (mode === "pau") params.set("all", "1");
      else params.set("unit", selected.id);
    }
    if (kind === "simulation" && code) params.set("code", code);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const response = await fetch(`/api/matematicas-ii/evaluation?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      setResourceData(payload as EvaluationPayload);
    } else {
      setResourceError(payload?.error === "authentication_required"
        ? "Inicia sesión para acceder a este recurso."
        : payload?.error === "matriculation_required"
          ? "Este recurso requiere una modalidad que incluya este contenido."
          : "No se ha podido cargar el recurso.");
    }
    setResourceLoading(false);
    window.setTimeout(() => document.getElementById("mat2-resource-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

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
          </> : <PauMenu locked={!canUsePau} onOpen={openResource} />}
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
                  <button type="button" className={styles.secondary} onClick={() => openResource("short")}>Comprobar la unidad</button>
                </div> : <LockedCourse authenticated={access.authenticated} />}
              </div>
              <div className={styles.mathPanel} aria-hidden="true"><span>f(x)</span><b>∫</b><em>Σ</em><i>√x</i><small>A · x = b</small></div>
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
              <ResourceCard title="Vídeos explicativos" text="Procedimiento y ejemplos guiados, organizados por unidad." icon="▷" locked={!canOpenSelected} onOpen={() => document.getElementById("mat2-video")?.scrollIntoView({ behavior: "smooth", block: "start" })} />
              <ResourceCard title="Preguntas cortas" text={`2 preguntas de comprobación en esta unidad · ${MATEMATICAS_II_STATS.shortQuestions} en total.`} icon="?" locked={!canOpenSelected} onOpen={() => openResource("short")} />
              <ResourceCard title="Practica con Rocío" text={`3 preguntas cerradas por unidad · ${MATEMATICAS_II_STATS.rocioQuestions} en total.`} icon="✓" locked={!canOpenSelected} onOpen={() => openResource("rocio")} />
              <ResourceCard title="Entrena como en la PAU" text={`${MATEMATICAS_II_STATS.pauProblems} problemas y ${MATEMATICAS_II_STATS.simulations} simulacros cuando tu modalidad incluye PAU.`} icon="⌁" locked={!canUsePau} onOpen={() => openResource("problems")} />
            </div>

            <section className={styles.courseMap}>
              <div><h3>Mapa del curso</h3><p>49 unidades: Álgebra, Geometría, Análisis y Probabilidad.</p></div>
              <div className={styles.blockStats}>{MATEMATICAS_II_BLOCKS.map((item) => <span key={item}><b>{MATEMATICAS_II_UNITS.filter((unit) => unit.block === item).length}</b>{item}</span>)}</div>
            </section>
          </> : <PauWorkspace allowed={canUsePau} authenticated={access.authenticated} onOpen={openResource} />}

          {resourceKind ? <section id="mat2-resource-panel" style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
              <div><span style={{ fontSize: 11, fontWeight: 900, color: "#cc8300", letterSpacing: ".08em" }}>RECURSO BASE12</span><h3 style={{ margin: "6px 0 0", fontSize: 24 }}>{resourceTitle(resourceKind, selected.title, mode)}</h3></div>
              <button type="button" onClick={() => { setResourceKind(null); setResourceData(null); }} style={closeButtonStyle}>Cerrar ×</button>
            </div>
            {resourceLoading ? <p>Cargando recurso…</p> : resourceError ? <p style={{ color: "#9a3412", fontWeight: 700 }}>{resourceError}</p> : resourceData ? <ResourceContent payload={resourceData} onSimulation={(code) => openResource("simulation", code)} /> : null}
          </section> : null}
        </main>

        <aside className={styles.rightbar}>
          <AssistantCard image="/images/rocio-profesora-ia.png" name="Rocío" role="Profesora IA" text="Te ayuda a entender conceptos, procedimientos y errores de Matemáticas II." action="Practicar con Rocío" onAction={() => openResource("rocio")} />
          <AssistantCard image="/images/fernando-tutor-ia.png" name="Fernando" role="Tutor IA" text="Organiza tus sesiones, repasos y progresión hasta la PAU." action="Plan de estudio" />
          <section className={styles.sideInfo}><strong>Tu objetivo</strong><p>Dominar los procedimientos y ser capaz de elegirlos correctamente cuando cambia el ejercicio.</p></section>
          {checkingAccess ? <p className={styles.accessNote}>Comprobando acceso…</p> : <p className={styles.accessNote}>{access.administrator ? "Acceso administrador" : access.plans.length ? `Modalidad: ${access.plans.join(" · ")}` : "Vista previa de la primera unidad"}</p>}
        </aside>
      </div>
    </div>
  );
}

function resourceTitle(kind: ResourceKind, unitTitle: string, currentMode: "curso" | "pau") {
  if (kind === "rocio") return `Rocío · ${unitTitle}`;
  if (kind === "short") return currentMode === "pau" ? `Banco de preguntas cortas · ${MATEMATICAS_II_STATS.shortQuestions}` : `Preguntas cortas · ${unitTitle}`;
  if (kind === "problems") return "Banco de problemas PAU";
  if (kind === "profiles") return "PAU por comunidades autónomas";
  return "Simulacro PAU";
}

function ResourceContent({ payload, onSimulation }: { payload: EvaluationPayload; onSimulation: (code: string) => void }) {
  if (payload.type === "rocio") return <RocioPanel items={payload.items} />;
  if (payload.type === "short") return <ShortPanel items={payload.items} />;
  if (payload.type === "problems") return <ProblemsPanel items={payload.items} />;
  if (payload.type === "profiles") return <ProfilesPanel items={payload.items} onSimulation={onSimulation} />;
  return <SimulationPanel simulation={payload.simulation} />;
}

function RocioPanel({ items }: { items: RocioItem[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  return <div style={{ display: "grid", gap: 16 }}>{items.map((item, index) => {
    const answer = answers[item.id];
    const correct = answer === item.correct;
    return <article key={item.id} style={cardStyle}>
      <strong style={{ color: "#0b2c5d" }}>Pregunta {index + 1}</strong>
      <p style={{ lineHeight: 1.55 }}>{item.question}</p>
      <div style={{ display: "grid", gap: 8 }}>{(["A", "B", "C", "D"] as const).map((letter) => <button key={letter} type="button" onClick={() => setAnswers((current) => ({ ...current, [item.id]: letter }))} style={{ ...optionButtonStyle, borderColor: answer === letter ? "#0c4a8a" : "#d7e0ea", background: answer === letter ? "#eef6ff" : "#fff" }}><b>{letter}</b> {item.options[letter]}</button>)}</div>
      {answer ? <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: correct ? "#ecfdf5" : "#fff7ed", color: correct ? "#166534" : "#9a3412" }}><strong>{correct ? "Correcto." : `La respuesta correcta es ${item.correct}.`}</strong><p style={{ margin: "6px 0 0", lineHeight: 1.45 }}>{correct ? item.feedback : item.recovery}</p></div> : null}
    </article>;
  })}</div>;
}

function ShortPanel({ items }: { items: ShortItem[] }) {
  return <div style={{ display: "grid", gap: 16 }}>{items.map((item, index) => <article key={item.id} style={cardStyle}>
    <strong>Pregunta {index + 1}</strong><p style={{ lineHeight: 1.55 }}>{item.question}</p>
    <details><summary style={summaryStyle}>Ver respuesta esperada y rúbrica</summary><p style={{ lineHeight: 1.5 }}>{item.expectedAnswer}</p><p style={{ color: "#60758d", fontSize: 13 }}>{item.rubric}</p></details>
  </article>)}</div>;
}

function ProblemsPanel({ items }: { items: ProblemItem[] }) {
  const [filter, setFilter] = useState("Todos");
  const visible = filter === "Todos" ? items : items.filter((item) => item.block === filter);
  return <><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>{["Todos", "Álgebra", "Geometría", "Análisis", "Probabilidad"].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} style={{ ...pillStyle, background: filter === item ? "#0c4a8a" : "#eef3f8", color: filter === item ? "#fff" : "#0b2c5d" }}>{item}</button>)}</div><div style={{ display: "grid", gap: 14 }}>{visible.map((item) => <article key={item.id} style={cardStyle}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><strong>{item.id}</strong><span style={{ fontSize: 12, color: "#cc8300", fontWeight: 800 }}>{item.block}</span></div><p style={{ lineHeight: 1.55 }}>{item.statement}</p><details><summary style={summaryStyle}>Ver solución y rúbrica</summary><p style={{ lineHeight: 1.5 }}>{item.solution}</p><p style={{ color: "#60758d", fontSize: 13 }}>{item.rubric}</p></details></article>)}</div></>;
}

function ProfilesPanel({ items, onSimulation }: { items: ProfileItem[]; onSimulation: (code: string) => void }) {
  return <div style={{ display: "grid", gap: 14 }}>{items.map((item) => <article key={item.code} style={cardStyle}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><strong>{item.code} · {item.community}</strong><button type="button" onClick={() => onSimulation(item.code)} style={smallButtonStyle}>Abrir simulacro</button></div><p style={{ color: "#526d89", fontSize: 13 }}>{item.status}</p><p style={{ lineHeight: 1.5 }}>{item.format}</p><a href={item.source} target="_blank" rel="noreferrer" style={{ color: "#0c4a8a", fontWeight: 700, fontSize: 12 }}>Fuente de coordinación/PAU ↗</a></article>)}</div>;
}

function SimulationPanel({ simulation }: { simulation: Simulation }) {
  return <div><p style={{ marginTop: 0, color: "#526d89", fontWeight: 700 }}>{simulation.community} · {simulation.profile}</p><div style={{ display: "grid", gap: 14 }}>{simulation.exercises.map((exercise, index) => <article key={`${simulation.code}-${index}`} style={cardStyle}><strong>{exercise.label}</strong><p style={{ lineHeight: 1.55 }}>{exercise.statement}</p><details><summary style={summaryStyle}>Ver solución docente y criterio Base12</summary><p style={{ lineHeight: 1.5 }}>{exercise.solution}</p><p style={{ color: "#60758d", fontSize: 13 }}>{exercise.rubric}</p></details></article>)}</div></div>;
}

function ResourceCard({ title, text, icon, locked, onOpen }: { title: string; text: string; icon: string; locked: boolean; onOpen?: () => void }) {
  return <button type="button" className={locked ? `${styles.resourceCard} ${styles.locked}` : styles.resourceCard} disabled={locked} onClick={locked ? undefined : onOpen} style={{ textAlign: "left", cursor: locked ? "not-allowed" : "pointer" }}><span>{icon}</span><h4>{title}</h4><p>{text}</p><b>{locked ? "Requiere tu modalidad" : "Abrir →"}</b></button>;
}

function LockedCourse({ authenticated }: { authenticated: boolean }) {
  return <div className={styles.lockNotice}><strong>Esta unidad forma parte del curso.</strong><p>{authenticated ? "Elige una modalidad con acceso al curso para continuar." : "Inicia sesión si ya estás matriculado o elige una modalidad."}</p><div><Link href={authenticated ? "/bachillerato-pau/matematicas-ii#modalidades" : "/login"}>{authenticated ? "Ver modalidades" : "Iniciar sesión"}</Link></div></div>;
}

function PauMenu({ locked, onOpen }: { locked: boolean; onOpen: (kind: ResourceKind, code?: string) => void }) {
  return <div className={styles.pauMenu}><strong>Entrenamiento PAU</strong><button disabled={locked} onClick={() => onOpen("problems")}>Problemas tipo PAU {locked ? "◇" : ""}</button><button disabled={locked} onClick={() => onOpen("short")}>Preguntas cortas {locked ? "◇" : ""}</button><button disabled={locked} onClick={() => onOpen("profiles")}>Simulacros · 17 {locked ? "◇" : ""}</button><button disabled={locked} onClick={() => onOpen("profiles")}>PAU por comunidades {locked ? "◇" : ""}</button></div>;
}

function PauWorkspace({ allowed, authenticated, onOpen }: { allowed: boolean; authenticated: boolean; onOpen: (kind: ResourceKind, code?: string) => void }) {
  if (!allowed) return <section className={styles.pauLocked}><span>PAU</span><h2>Entrenamiento específico para la prueba</h2><p>Problemas, preguntas y simulacros quedan disponibles con Estándar o con la modalidad PAU.</p><Link href={authenticated ? "/bachillerato-pau/matematicas-ii#modalidades" : "/login"}>{authenticated ? "Ver modalidades" : "Iniciar sesión"}</Link></section>;
  return <><div className={styles.breadcrumb}>Matemáticas II / PAU</div><header className={styles.pauHeader}><span>ENTRENAMIENTO PAU</span><h2>Practica la prueba con método</h2><p>Trabaja problemas, preguntas y simulacros sin mezclar el entrenamiento específico con el temario del curso.</p></header><div className={styles.pauGrid}><ResourceCard title={`${MATEMATICAS_II_STATS.pauProblems} problemas PAU`} text="Resolución y transferencia por bloques." icon="∫" locked={false} onOpen={() => onOpen("problems")} /><ResourceCard title={`${MATEMATICAS_II_STATS.shortQuestions} preguntas cortas`} text="Comprueba procedimientos, decisiones y resultados." icon="?" locked={false} onOpen={() => onOpen("short")} /><ResourceCard title={`${MATEMATICAS_II_STATS.simulations} simulacros`} text="Un simulacro por comunidad autónoma." icon="▣" locked={false} onOpen={() => onOpen("profiles")} /><ResourceCard title="PAU por comunidades" text="Formato, estado de verificación y fuente de cada territorio." icon="⌂" locked={false} onOpen={() => onOpen("profiles")} /></div></>;
}

function AssistantCard({ image, name, role, text, action, onAction }: { image: string; name: string; role: string; text: string; action: string; onAction?: () => void }) {
  return <section className={styles.assistant}><Image src={image} alt={`${name}, ${role}`} width={1536} height={1024} /><div><h3>{name}</h3><strong>{role}</strong><p>{text}</p><button type="button" onClick={onAction}>{action}</button></div></section>;
}

const panelStyle: React.CSSProperties = { marginTop: 24, background: "#fff", border: "1px solid #dfe7ef", borderRadius: 14, padding: 22, boxShadow: "0 12px 32px rgba(15,42,76,.07)" };
const cardStyle: React.CSSProperties = { border: "1px solid #e0e7ef", borderRadius: 10, padding: 16, background: "#fbfdff" };
const closeButtonStyle: React.CSSProperties = { border: "1px solid #d7e0ea", background: "#fff", borderRadius: 8, padding: "8px 11px", cursor: "pointer", color: "#526d89", fontWeight: 700 };
const optionButtonStyle: React.CSSProperties = { border: "1px solid #d7e0ea", borderRadius: 8, padding: "10px 12px", textAlign: "left", cursor: "pointer", color: "#183b65" };
const summaryStyle: React.CSSProperties = { cursor: "pointer", color: "#0c4a8a", fontWeight: 800, fontSize: 13 };
const pillStyle: React.CSSProperties = { border: 0, borderRadius: 999, padding: "7px 11px", cursor: "pointer", fontWeight: 800, fontSize: 12 };
const smallButtonStyle: React.CSSProperties = { border: 0, borderRadius: 7, background: "#0c4a8a", color: "#fff", padding: "8px 10px", cursor: "pointer", fontWeight: 800, fontSize: 11 };
