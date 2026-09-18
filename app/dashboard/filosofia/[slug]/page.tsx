"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilosofiaBlocks, { type FilosofiaBlock } from "@/components/filosofia/FilosofiaBlocks";
import { supabase } from "@/lib/supabaseClient";
import WrittenAssessment from "@/components/learning/WrittenAssessment";
import ChoiceAssessment from "@/components/learning/ChoiceAssessment";
import catalog from "@/data/filosofia/catalog.json";
import baseStyles from "../filosofia.module.css";
import videoStyles from "../video.module.css";
import resourceStyles from "./resource.module.css";

const styles = { ...baseStyles, ...videoStyles, ...resourceStyles };

type ResourcePayload = { allowed: boolean; access?: string; kind?: string; item?: Record<string, unknown>; error?: string };
type BankType = "test" | "short" | "long" | "rocio-authors" | "rocio-pau";

export default function FilosofiaResourcePage() {
  const params = useParams();
  const slug = String(params.slug || "");
  if (slug === "entrenamiento") return <TrainingPage />;
  return <ResourcePage slug={slug} />;
}

function resourceFromSlug(slug: string) {
  const prefixes: [string, string][] = [["autor-", "author"], ["corriente-", "block"], ["comparacion-", "comparison"], ["concepto-", "glossary"], ["biblioteca-", "library"], ["metodo-", "method"], ["taller-", "workshop"], ["pau-", "territory"]];
  const match = prefixes.find(([prefix]) => slug.startsWith(prefix));
  return match ? `${match[1]}:${slug.slice(match[0].length)}` : "";
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

function ResourcePage({ slug }: { slug: string }) {
  const resource = resourceFromSlug(slug);
  const [payload, setPayload] = useState<ResourcePayload | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!resource) return;
      const response = await fetch(`/api/filosofia?resource=${encodeURIComponent(resource)}`, { headers: await authHeaders() });
      const result = await response.json().catch(() => ({ allowed: false, error: "No se pudo cargar el contenido" }));
      if (active) setPayload(result);
    })();
    return () => { active = false; };
  }, [resource]);

  if (!resource) return <Locked message="Contenido no encontrado" />;
  if (!payload) return <Loading />;
  if (!payload.allowed || !payload.item) return <Locked reason={payload.access} message={payload.error} />;
  const item = payload.item;
  const title = String(item.title || item["Nombre preferido"] || "Historia de la Filosofía");
  const period = String(item.period || item["Periodo"] || labelForKind(payload.kind));
  const blocks = (item.blocks || []) as FilosofiaBlock[];

  const video = item.video as { title?: string; url?: string | null } | undefined;

  return <div className={styles.resourceShell}><ResourceBar access={payload.access} /><main className={styles.resourceMain}><header className={styles.resourceHeader}><p className={styles.eyebrow}>{period}</p><h1>{title}</h1>{typeof item.guide === "string" && <p>{item.guide}</p>}{typeof item.axis === "string" && <p>{item.axis}</p>}</header>{(payload.kind === "author" || payload.kind === "block") && <VideoLesson video={video} title={title} />}{payload.kind === "author" && <AuthorSummary item={item} />}{payload.kind === "block" && <BlockSummary item={item} />}{payload.kind === "glossary" ? <GlossaryEntry item={item} /> : <FilosofiaBlocks blocks={blocks} />}</main></div>;
}

function ResourceBar({ access }: { access?: string }) {
  return <aside className={styles.resourceBar}><Link href="/dashboard/filosofia"><b>B12</b><span>Historia de la Filosofía</span></Link><div><span>{access === "public_preview" ? "Unidad abierta" : access === "administrator" ? "Vista completa" : "Curso activo"}</span><Link href="/dashboard/filosofia">Volver al índice</Link></div></aside>;
}

function AuthorSummary({ item }: { item: Record<string, unknown> }) {
  const concepts = (item.concepts || []) as string[];
  return <section className={styles.summaryGrid}><article><small>TESIS</small><p>{String(item.thesis || "")}</p></article><article><small>APORTACIÓN</small><p>{String(item.innovation || "")}</p></article>{concepts.length ? <article className={styles.fullSummary}><small>CONCEPTOS NUCLEARES</small><div>{concepts.map((concept) => <span key={concept}>{concept}</span>)}</div></article> : null}</section>;
}

function BlockSummary({ item }: { item: Record<string, unknown> }) {
  return <section className={styles.summaryGrid}><article><small>CONTEXTO</small><p>{String(item.context || "")}</p></article><article><small>LEGADO</small><p>{String(item.legacy || "")}</p></article></section>;
}

function VideoLesson({ video, title }: { video?: { title?: string; url?: string | null }; title: string }) {
  const videoId = youtubeId(video?.url);
  if (!video?.url) return null;
  if (!videoId) return <section className={styles.videoExternal}><div><span>VÍDEO</span><h2>{video.title || title}</h2></div><a href={video.url} target="_blank" rel="noopener noreferrer">Ver vídeo ↗</a></section>;
  return <section className={styles.videoLesson}><div className={styles.videoHeading}><span>VÍDEO DE LA UNIDAD</span><h2>{video.title || title}</h2></div><div className={styles.videoFrame}><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`Vídeo: ${video.title || title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></section>;
}

function youtubeId(url?: string | null) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0];
    if (parsed.hostname.endsWith("youtube.com")) return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch { return ""; }
  return "";
}

function GlossaryEntry({ item }: { item: Record<string, unknown> }) {
  return <section className={styles.glossaryEntry}><article><small>DEFINICIÓN BASE12</small><p>{String(item["Definición Base12"] || "")}</p></article><article><small>AUTORES Y CORRIENTES</small><p>{String(item["Autores/corrientes"] || "")}</p></article><article><small>NO CONFUNDIR</small><p>{String(item["No confundir"] || "")}</p></article>{item.Alias ? <article><small>ALIAS</small><p>{String(item.Alias)}</p></article> : null}</section>;
}

function labelForKind(kind?: string) { return ({ comparison: "Comparación", library: "Biblioteca", method: "Metodología PAU", workshop: "Taller", territory: "PAU por territorio" } as Record<string, string>)[kind || ""] || "Historia de la Filosofía"; }

function TrainingPage() {
  const [type, setType] = useState<BankType>("test");
  const groups = type === "rocio-authors" ? catalog.rocioAuthorGroups : type === "rocio-pau" ? catalog.rocioPauGroups.map((item) => item.id) : catalog.banks;
  const labelForGroup = (value: string) => type === "rocio-pau" ? catalog.rocioPauGroups.find((item) => item.id === value)?.title || value : value;
  const [group, setGroup] = useState(String(catalog.banks[0] || ""));
  const [offset, setOffset] = useState(0);
  const [payload, setPayload] = useState<{ allowed: boolean; access?: string; total?: number; items?: Record<string, unknown>[] } | null>(null);

  useEffect(() => {
    let active = true;
    if (!group) return;
    void (async () => { const response = await fetch(`/api/filosofia?bankType=${type}&group=${encodeURIComponent(group)}&offset=${offset}&limit=10`, { headers: await authHeaders() }); const result = await response.json().catch(() => ({ allowed: false })); if (active) setPayload(result); })();
    return () => { active = false; };
  }, [type, group, offset]);

  const changeType = (nextType: BankType) => {
    const nextGroups = nextType === "rocio-authors" ? catalog.rocioAuthorGroups : nextType === "rocio-pau" ? catalog.rocioPauGroups.map((item) => item.id) : catalog.banks;
    setType(nextType);
    setGroup(String(nextGroups[0] || ""));
    setOffset(0);
    setPayload(null);
  };

  return <div className={styles.resourceShell}><ResourceBar access={payload?.access} /><main className={styles.resourceMain}><header className={styles.resourceHeader}><p className={styles.eyebrow}>ENTRENAMIENTO</p><h1>Practica con los bancos maestros</h1><p>Elige un banco y trabaja diez preguntas cada vez. Las respuestas y pautas proceden del paquete final saneado.</p></header><div className={styles.trainingTabs}>{(["test", "short", "long", "rocio-authors", "rocio-pau"] as BankType[]).map((item) => <button key={item} onClick={() => changeType(item)} className={type === item ? styles.selectedTrainingTab : ""}>{({ test: "Test", short: "Preguntas cortas", long: "Preguntas largas", "rocio-authors": "Rocío · autores", "rocio-pau": "Rocío · PAU" } as Record<BankType, string>)[item]}</button>)}</div><label className={styles.bankSelect}><span>Banco</span><select value={group} onChange={(event) => { setGroup(event.target.value); setOffset(0); setPayload(null); }}>{groups.map((item) => <option value={String(item)} key={String(item)}>{labelForGroup(String(item))}</option>)}</select></label>{!payload ? <Loading compact /> : !payload.allowed ? <Locked reason={payload.access} compact /> : <QuestionSet key={`${type}-${group}-${offset}`} type={type} items={payload.items || []} />}{payload?.allowed && <div className={styles.pagination}><button disabled={offset === 0} onClick={() => { setOffset(Math.max(0, offset - 10)); setPayload(null); }}>← Anteriores</button><span>{offset + 1}–{Math.min(offset + 10, payload.total || 0)} de {payload.total}</span><button disabled={offset + 10 >= (payload.total || 0)} onClick={() => { setOffset(offset + 10); setPayload(null); }}>Siguientes →</button></div>}</main></div>;
}

function QuestionSet({ type, items }: { type: BankType; items: Record<string, unknown>[] }) {
  return <div className={styles.questions}>{items.map((item, index) => {
    const prompt = String(item.Pregunta || item["Pregunta corta"] || item["Pregunta larga"] || "");
    const rawOptions = type === "rocio-authors" ? String(item["Opciones A-D"] || "").split(" / ").filter(Boolean) : ["A","B","C","D"].map((letter)=>String(item[letter]||"")).filter(Boolean);
    const options = rawOptions.map((label, optionIndex)=>({value:["A","B","C","D"][optionIndex] || String(optionIndex+1),label}));
    const answer = String(item.Correcta || item["Respuesta correcta"] || "");
    const guidance = String(item.Feedback || item.Retroalimentación || item["Elementos esperados"] || item["Respuesta correcta"] || "");
    const itemId = String(item.ID || type+"-"+index);
    let correctLetter = /^[ABCD]$/i.test(answer.trim()) ? answer.trim().toUpperCase() : "";
    if (!correctLetter && options.length) {
      const found=options.find((option)=>option.label.trim().toLocaleLowerCase("es")===answer.trim().toLocaleLowerCase("es"));
      correctLetter=found?.value||"";
    }
    return <article key={itemId}>
      <div className={styles.questionMeta}><span>{String(item.Dificultad || item["Tipo diagnóstico"] || item["Tipo de tarea"] || "Práctica")}</span><b>{itemId}</b></div>
      <h2>{prompt}</h2>
      {options.length && (type==="test"||type==="rocio-authors") ? <ChoiceAssessment courseSlug="historia-filosofia" contentId={itemId} activityType={type.startsWith("rocio")?"rocio_closed":"test"} prompt={prompt} options={options} group={type}/>
      : <WrittenAssessment courseSlug="historia-filosofia" contentId={itemId} activityType={type} prompt={prompt} expectedAnswer={answer} rubric={guidance} group={type} rows={type==="long"||type==="rocio-pau"?10:6}/>}
    </article>;
  })}</div>;
}
function Loading({ compact = false }: { compact?: boolean }) { return <div className={compact ? styles.loadingCompact : styles.loading}>Preparando el contenido de Filosofía…</div>; }

function Locked({ reason, message, compact = false }: { reason?: string; message?: string; compact?: boolean }) {
  return <div className={compact ? styles.lockedCompact : styles.locked}><p className={styles.eyebrow}>ACCESO AL CURSO</p><h1>{message || (reason === "login_required" ? "Inicia sesión para continuar" : reason === "plan_upgrade_required" ? "Este contenido no está incluido en tu modalidad" : "Este contenido requiere una matrícula activa")}</h1><p>La unidad de Sócrates está abierta. El resto del material queda disponible según la modalidad contratada.</p><div><Link href="/dashboard/filosofia/autor-socrates">Ver unidad abierta</Link><Link href="/login?redirect=/dashboard/filosofia">Iniciar sesión</Link><Link href="/?curso=historia-filosofia#catalogo">Ver modalidades</Link></div></div>;
}
