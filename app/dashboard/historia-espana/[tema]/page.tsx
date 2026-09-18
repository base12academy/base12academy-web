"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HistoriaBlocks, { type HistoriaBlock } from "@/components/historia/HistoriaBlocks";
import { supabase } from "@/lib/supabaseClient";
import WrittenAssessment from "@/components/learning/WrittenAssessment";
import ChoiceAssessment from "@/components/learning/ChoiceAssessment";
import catalog from "@/data/historia/catalog.json";
import rocioRules from "@/data/historia/rocio-rules.json";
import baseStyles from "../../filosofia/filosofia.module.css";
import videoStyles from "../../filosofia/video.module.css";
import resourceStyles from "../../filosofia/[slug]/resource.module.css";
import historyStyles from "../historia.module.css";

const styles = { ...baseStyles, ...videoStyles, ...resourceStyles, ...historyStyles };
type Payload = { allowed: boolean; access?: string; kind?: string; item?: Record<string, unknown>; error?: string };
type BankType = "test" | "short" | "source" | "development" | "error" | "chronology" | "territorial" | "rocio";

export default function HistoriaResourcePage() {
  const params = useParams();
  const slug = String(params.tema || "");
  if (slug === "entrenamiento") return <TrainingPage initialType="test" />;
  if (slug === "rocio") return <TrainingPage initialType="rocio" showRules />;
  return <ResourcePage slug={slug} />;
}

function resourceFromSlug(slug: string) {
  if (/^tema-\d{2}$/.test(slug)) return `unit:${slug}`;
  if (slug === "glosario-maestro") return "glossary:maestro";
  if (slug.startsWith("cronologia-")) return `chronology:${slug}`;
  if (slug.startsWith("metodo-")) return `method:${slug}`;
  if (slug.startsWith("pau-")) return `territory:${slug.slice(4)}`;
  if (slug.startsWith("video-")) return `video:${slug.slice(6)}`;
  return "";
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

function ResourcePage({ slug }: { slug: string }) {
  const resource = resourceFromSlug(slug);
  const [payload, setPayload] = useState<Payload | null>(null);
  useEffect(() => { let active = true; void (async () => { if (!resource) return; const response = await fetch(`/api/historia?resource=${encodeURIComponent(resource)}`, { headers: await authHeaders() }); const result = await response.json().catch(() => ({ allowed: false, error: "No se pudo cargar el contenido" })); if (active) setPayload(result); })(); return () => { active = false; }; }, [resource]);
  if (!resource) return <Locked message="Contenido no encontrado" />;
  if (!payload) return <Loading />;
  if (!payload.allowed || !payload.item) return <Locked reason={payload.access} message={payload.error} />;
  const item = payload.item;
  const title = String(item.title || "Historia de España");
  const blocks = (item.blocks || []) as HistoriaBlock[];
  const videos = (item.videos || []) as { title?: string; url?: string | null }[];

  return <div className={styles.resourceShell}><ResourceBar access={payload.access} /><main className={styles.resourceMain}><header className={styles.resourceHeader}><p className={styles.eyebrow}>{labelForKind(payload.kind, item)}</p><h1>{title}</h1>{typeof item.guide === "string" && <p>{item.guide}</p>}</header>
    {payload.kind === "video" ? <VideoLesson video={item as { title?: string; url?: string | null }} title={title} /> : null}
    {payload.kind === "unit" && videos.length ? <div className={styles.videoStack}>{videos.map((video, index) => <VideoLesson key={`${video.url}-${index}`} video={video} title={title} />)}</div> : null}
    {payload.kind === "territory" ? <Territory item={item} /> : <HistoriaBlocks blocks={blocks} />}
  </main></div>;
}

function ResourceBar({ access }: { access?: string }) { return <aside className={styles.resourceBar}><Link href="/dashboard/historia-espana"><b>B12</b><span>Historia de España</span></Link><div><span>{access === "public_preview" ? "Unidad abierta" : access === "administrator" ? "Vista completa" : "Curso activo"}</span><Link href="/dashboard/historia-espana">Volver al índice</Link></div></aside>; }
function labelForKind(kind?: string, item?: Record<string, unknown>) { if (kind === "unit") return `TEMA ${String(item?.number || "")}`; return ({ chronology: "CRONOLOGÍA ESENCIAL", glossary: "GLOSARIO", method: "MÉTODO PAU", territory: "PAU POR TERRITORIO", video: "VÍDEO" } as Record<string, string>)[kind || ""] || "HISTORIA DE ESPAÑA"; }

function VideoLesson({ video, title }: { video?: { title?: string; url?: string | null }; title: string }) {
  const videoId = youtubeId(video?.url);
  if (!video?.url) return null;
  if (!videoId) return <section className={styles.videoExternal}><div><span>VÍDEO</span><h2>{video.title || title}</h2></div><a href={video.url} target="_blank" rel="noopener noreferrer">Ver vídeo ↗</a></section>;
  return <section className={styles.videoLesson}><div className={styles.videoHeading}><span>VÍDEO DE HISTORIA DE ESPAÑA</span><h2>{video.title || title}</h2></div><div className={styles.videoFrame}><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`Vídeo: ${video.title || title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></section>;
}
function youtubeId(url?: string | null) { if (!url) return ""; try { const parsed = new URL(url); if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0]; if (parsed.hostname.endsWith("youtube.com")) return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || ""; } catch { return ""; } return ""; }

function Territory({ item }: { item: Record<string, unknown> }) {
  const adapter = (item.adapter || {}) as Record<string, unknown>;
  const matrix = (item.matrix || {}) as Record<string, unknown>;
  const recipes = (item.recipes || []) as Record<string, unknown>[];
  const facts = [
    ["Puntuación", adapter["Puntuación"]], ["Estructura PAU 2026", adapter["Estructura PAU 2026"]], ["Opcionalidad", adapter["Opcionalidad"]],
    ["Destrezas prioritarias", adapter["Destrezas prioritarias"]], ["Refuerzo territorial", adapter["Refuerzo territorial"]], ["Lengua", adapter["Lengua"]],
    ["Acción pedagógica", matrix["Acción pedagógica Base12"]], ["Estado de verificación", adapter["Estado de verificación"]],
  ].filter((entry) => entry[1]);
  const tableRows = recipes.length ? [Object.keys(recipes[0]), ...recipes.map((row) => Object.keys(recipes[0]).map((key) => String(row[key] ?? "")))] : [];
  return <><section className={styles.facts}>{facts.map(([label, value], index) => <article className={index === 1 || index === 2 ? styles.wideFact : ""} key={String(label)}><small>{String(label)}</small><p>{String(value)}</p></article>)}</section>{tableRows.length ? <section className={styles.recipe}><h2>Receta del simulacro</h2><HistoriaBlocks blocks={[{ type: "table", rows: tableRows }]} /></section> : null}{Number(item.exerciseCount || 0) > 0 ? <p><Link href={`/dashboard/historia-espana/entrenamiento?tipo=territorial&grupo=${encodeURIComponent(String(item.title || ""))}`}>Practicar el banco territorial →</Link></p> : null}</>;
}

function TrainingPage({ initialType, showRules = false }: { initialType: BankType; showRules?: boolean }) {
  const [type, setType] = useState<BankType>(initialType);
  const groups = catalog.bankGroups[type] || [];
  const [group, setGroup] = useState(String(groups[0] || ""));
  const [offset, setOffset] = useState(0);
  const [payload, setPayload] = useState<{ allowed: boolean; access?: string; total?: number; items?: Record<string, unknown>[] } | null>(null);
  useEffect(() => { let active = true; if (!group) return; void (async () => { const response = await fetch(`/api/historia?bankType=${type}&group=${encodeURIComponent(group)}&offset=${offset}&limit=10`, { headers: await authHeaders() }); const result = await response.json().catch(() => ({ allowed: false })); if (active) setPayload(result); })(); return () => { active = false; }; }, [type, group, offset]);
  const changeType = (nextType: BankType) => { const nextGroups = catalog.bankGroups[nextType] || []; setType(nextType); setGroup(String(nextGroups[0] || "")); setOffset(0); setPayload(null); };
  const labels: Record<BankType, string> = { test: "Test", short: "Cortas", source: "Fuentes", development: "Desarrollo", error: "Errores", chronology: "Cronología", territorial: "Territoriales", rocio: "Rocío" };
  return <div className={styles.resourceShell}><ResourceBar access={payload?.access} /><main className={styles.resourceMain}><header className={styles.resourceHeader}><p className={styles.eyebrow}>{showRules ? "ROCÍO" : "ENTRENAMIENTO"}</p><h1>{showRules ? "Entrena con el corpus de Rocío" : "Practica con los bancos maestros"}</h1><p>{showRules ? "Rocío selecciona actividades del corpus definitivo según el tema, la destreza y el progreso del alumno." : "Elige un banco y trabaja diez actividades cada vez con su respuesta, criterio y retroalimentación."}</p></header><div className={styles.trainingTabs}>{(Object.keys(labels) as BankType[]).map((item) => <button key={item} onClick={() => changeType(item)} className={type === item ? styles.selectedTrainingTab : ""}>{labels[item]}</button>)}</div><label className={styles.bankSelect}><span>Tema o banco</span><select value={group} onChange={(event) => { setGroup(event.target.value); setOffset(0); setPayload(null); }}>{groups.map((item) => <option value={String(item)} key={String(item)}>{String(item)}</option>)}</select></label>{!payload ? <Loading compact /> : !payload.allowed ? <Locked reason={payload.access} compact /> : <QuestionSet key={`${type}-${group}-${offset}`} type={type} items={payload.items || []} />}{payload?.allowed && <div className={styles.pagination}><button disabled={offset === 0} onClick={() => { setOffset(Math.max(0, offset - 10)); setPayload(null); }}>← Anteriores</button><span>{offset + 1}–{Math.min(offset + 10, payload.total || 0)} de {payload.total}</span><button disabled={offset + 10 >= (payload.total || 0)} onClick={() => { setOffset(offset + 10); setPayload(null); }}>Siguientes →</button></div>}{showRules ? <section className={styles.rocioRules}><HistoriaBlocks blocks={[{ type: "heading", level: 2, text: "Reglas de trabajo de Rocío" }, { type: "table", rows: [Object.keys(rocioRules[0]), ...rocioRules.map((row) => Object.keys(rocioRules[0]).map((key) => String((row as Record<string, unknown>)[key] ?? "")))] }]} /></section> : null}</main></div>;
}

function QuestionSet({ type, items }: { type: BankType; items: Record<string, unknown>[] }) {
  return <div className={styles.questions}>{items.map((item, index) => {
    const prompt = questionPrompt(item, type);
    const options = type === "test" || type === "rocio" ? ["A", "B", "C", "D"].map((letter) => ({ value: letter, label: String(item["Opción "+letter] || item[letter] || "") })).filter((option) => option.label) : [];
    const answer = answerText(item, type);
    const guidance = guidanceText(item);
    const itemId = String(item.ID || item.Corpus_ID || type+"-"+index);
    let correctLetter = /^[ABCD]$/i.test(answer.trim()) ? answer.trim().toUpperCase() : "";
    if (!correctLetter && options.length) {
      const found = options.find((option) => option.label.trim().toLocaleLowerCase("es") === answer.trim().toLocaleLowerCase("es"));
      correctLetter = found?.value || "";
    }
    return <article key={itemId}>
      <div className={styles.questionMeta}><span>{String(item.Dificultad || item.Destreza || item.Tipo || "Práctica")}</span><b>{itemId}</b></div>
      <h2>{prompt}</h2>
      {options.length && (type==="test"||type==="rocio") ? <ChoiceAssessment courseSlug="historia-espana" contentId={itemId} activityType={type==="rocio"?"rocio_closed":"test"} prompt={prompt} options={options} group={type}/>
      : <WrittenAssessment courseSlug="historia-espana" contentId={itemId} activityType={type} prompt={prompt} expectedAnswer={answer} rubric={guidance} group={type} rows={type==="development"||type==="source"||type==="territorial"?10:6}/>}
      <QuestionDetails item={item} />
    </article>;
  })}</div>;
}
function questionPrompt(item: Record<string, unknown>, type: BankType) { if (type === "error") return String(item["Afirmación incorrecta"] || ""); if (type === "chronology") return String(item.Ejercicio || item.Proceso || "Ordena los elementos"); if (type === "source") return `${String(item["Fuente / material"] || "Fuente histórica")}: ${String(item["Pregunta 1"] || "")}`; return String(item.Pregunta || item.Enunciado || item["Ejercicio 2,5 pt"] || item["Pregunta 1 pt"] || item["Apartado 1"] || "Actividad de Historia de España"); }
function answerText(item: Record<string, unknown>, type: BankType) { if (type === "test") return String(item.Correcta || ""); if (type === "error") return String(item["Corrección correcta"] || ""); if (type === "chronology") return String(item["Orden correcto"] || ""); return String(item["Respuesta modelo"] || item["Respuesta modelo / correcta"] || item["Respuesta orientativa"] || item["Esquema de respuesta"] || item["Letra correcta"] || ""); }
function guidanceText(item: Record<string, unknown>) { return String(item["Feedback pedagógico"] || item["Feedback / rúbrica"] || item["Criterio de corrección"] || item["Explicación pedagógica"] || item["Explicación causal"] || item["Rúbrica Base12"] || item.Criterio || item["Criterio 1"] || "Revisa la respuesta y relaciónala con el proceso histórico del tema."); }
function QuestionDetails({ item }: { item: Record<string, unknown> }) { const keys = ["Concepto", "Concepto / eje", "Fecha / periodo", "Pregunta 2", "Criterio 2", "Elemento A", "Elemento B", "Elemento C", "Elemento D"].filter((key) => item[key]); if (!keys.length) return null; return <div className={styles.details}>{keys.map((key) => <p key={key}><b>{key}:</b> {String(item[key])}</p>)}</div>; }
function Loading({ compact = false }: { compact?: boolean }) { return <div className={compact ? styles.loadingCompact : styles.loading}>Preparando el contenido de Historia de España…</div>; }
function Locked({ reason, message, compact = false }: { reason?: string; message?: string; compact?: boolean }) { return <div className={compact ? styles.lockedCompact : styles.locked}><p className={styles.eyebrow}>ACCESO AL CURSO</p><h1>{message || (reason === "login_required" ? "Inicia sesión para continuar" : reason === "plan_upgrade_required" ? "Este contenido no está incluido en tu modalidad" : "Este contenido requiere una matrícula activa")}</h1><p>El primer tema está abierto. El resto del material queda disponible según la modalidad contratada.</p><div><Link href="/dashboard/historia-espana/tema-01">Ver unidad abierta</Link><Link href="/login?redirect=/dashboard/historia-espana">Iniciar sesión</Link><Link href="/?curso=historia-espana#catalogo">Ver modalidades</Link></div></div>; }
