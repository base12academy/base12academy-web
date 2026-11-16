"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  abandonOpo12Attempt,
  createOpo12Incident,
  loadOpo12Attempt,
  loadOpo12Overview,
  Opo12ApiError,
  saveOpo12Answer,
  startOpo12Attempt,
  submitOpo12Attempt,
  type Opo12AttemptPayload,
  type Opo12Overview,
} from "@/lib/opo12/client";
import styles from "./opo12.module.css";

type Screen = "home" | "topicSetup" | "reviewSetup" | "exam" | "review" | "result" | "solution" | "history" | "subscription" | "incidents";
type Answer = "A" | "B" | "C" | "D";
type PreviewMode = "simulation" | "topic" | "review";

const previewQuestions = [
  { block: "Parte teórica", topic: "Tema 3", prompt: "Según la convocatoria utilizada por Opo12, ¿cuántas preguntas ordinarias tiene la parte teórica?", options: ["70", "75", "79", "80"], correct: "B" as Answer, explanation: "La base séptima fija 75 preguntas ordinarias y 4 de reserva en la parte teórica.", reference: "BOJA núm. 191, de 1 de octubre de 2024, base séptima. Revisión: 16/11/2026." },
  { block: "Parte teórica", topic: "Tema 8", prompt: "¿Qué efecto tiene dejar una pregunta sin responder en este sistema de corrección?", options: ["Resta 0,4 puntos", "Resta 1,2 puntos", "No suma ni resta", "Anula una respuesta correcta"], correct: "C" as Answer, explanation: "La fórmula solo computa aciertos y errores; las respuestas en blanco no penalizan.", reference: "BOJA núm. 191/2024, base séptima, apartado 2.3. Revisión: 16/11/2026." },
  { block: "Parte práctica", topic: "Supuesto 1", prompt: "En esta vista de demostración, ¿qué debe hacer el alumno si desea volver después a una pregunta?", options: ["Entregar el examen", "Marcarla para revisar", "Cerrar el navegador", "Borrar todas las respuestas"], correct: "B" as Answer, explanation: "La marca de revisión conserva la respuesta y destaca la pregunta en ámbar dentro del mapa.", reference: "Regla de interfaz Opo12. Revisión: 16/11/2026." },
];

const nav: Array<[Screen, string]> = [["home", "Inicio"], ["history", "Histórico"], ["subscription", "Suscripción"], ["incidents", "Incidencias"]];
const topicOptions = Array.from({ length: 42 }, (_, index) => `T${String(index + 1).padStart(2, "0")}`);

function optionList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).slice(0, 4);
  if (value && typeof value === "object") {
    const options = value as Record<string, unknown>;
    return ["A", "B", "C", "D"].map((key) => String(options[key] ?? ""));
  }
  return [];
}

function friendlyError(error: unknown) {
  if (!(error instanceof Opo12ApiError)) return "No se ha podido completar la operación.";
  const messages: Record<string, string> = {
    login_required: "Inicia sesión para acceder a tu suscripción.",
    subscription_required: "Tu suscripción no permite iniciar una prueba nueva.",
    question_bank_auditing: "El banco sigue en auditoría y todavía no admite pruebas reales.",
    question_bank_not_ready: "Todavía no hay suficientes preguntas aprobadas para esta modalidad.",
    no_review_questions: "Aún no tienes preguntas disponibles para repasar.",
    attempt_preparation_timeout: "La prueba está tardando más de lo previsto. Inténtalo de nuevo.",
    attempt_time_elapsed: "El tiempo ha terminado. Se corregirán las respuestas guardadas.",
  };
  return messages[error.message] ?? "No se ha podido completar la operación.";
}

function formatCountdown(deadline: string | null, now: number) {
  if (!deadline) return "Sin límite";
  const seconds = Math.max(0, Math.ceil((new Date(deadline).getTime() - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function Opo12Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<PreviewMode>("simulation");
  const [questionCount, setQuestionCount] = useState(20);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(["T03"]));
  const [overview, setOverview] = useState<Opo12Overview | null>(null);
  const [liveAttempt, setLiveAttempt] = useState<Opo12AttemptPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [incidentCategory, setIncidentCategory] = useState<"question" | "technical" | "subscription" | "other">("question");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentSent, setIncidentSent] = useState(false);
  const [incidentPosition, setIncidentPosition] = useState<number | null>(null);
  const [clock, setClock] = useState(() => Date.now());
  const examQuestions = useMemo(() => liveAttempt?.questions?.length
    ? liveAttempt.questions.map((item) => {
      const solution = liveAttempt.solutions?.find((candidate) => candidate.position === item.position);
      return {
        block: item.block === "theory" ? "Parte teórica" : "Parte práctica",
        topic: item.topic_code,
        prompt: item.prompt,
        options: optionList(item.options),
        correct: solution?.correct_option,
        explanation: solution?.explanation ?? "",
        reference: solution ? `${solution.official_reference} Revisión: ${solution.reviewed_on}.` : "",
      };
    })
    : previewQuestions, [liveAttempt]);
  const score = useMemo(() => previewQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1.2 : answers[index] ? -0.4 : 0), 0), [answers]);
  const question = examQuestions[current] ?? examQuestions[0];
  const scoreSnapshot = liveAttempt?.attempt.score_snapshot as Record<string, unknown> | null | undefined;
  const resultCorrect = Number(scoreSnapshot?.correct ?? examQuestions.filter((item, index) => item.correct && answers[index] === item.correct).length);
  const resultWrong = Number(scoreSnapshot?.wrong ?? examQuestions.filter((item, index) => item.correct && answers[index] && answers[index] !== item.correct).length);
  const resultBlank = Number(scoreSnapshot?.blank ?? Math.max(0, examQuestions.length - resultCorrect - resultWrong));
  const resultScore = Number(liveAttempt?.attempt.score ?? score);
  const simulationScores = (overview?.history ?? []).filter((item) => item.mode === "simulation" && item.score != null).map((item) => Number(item.score));
  const averageScore = simulationScores.length ? simulationScores.reduce((sum, value) => sum + value, 0) / simulationScores.length : null;
  const bestScore = simulationScores.length ? Math.max(...simulationScores) : null;
  const recentScores = simulationScores.slice(0, 6).reverse();

  useEffect(() => {
    let active = true;
    loadOpo12Overview()
      .then((data) => { if (active) { setOverview(data); setSystemMessage(""); } })
      .catch((error) => { if (active) setSystemMessage(friendlyError(error)); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (screen !== "exam" || !liveAttempt?.attempt.deadline_at) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [screen, liveAttempt?.attempt.deadline_at]);

  useEffect(() => {
    const deadline = liveAttempt?.attempt.deadline_at;
    if (screen === "exam" && deadline && clock >= new Date(deadline).getTime() && !busy) {
      void completeAttempt();
    }
  }, [busy, clock, liveAttempt, screen]);

  function applyAttempt(payload: Opo12AttemptPayload, nextScreen: Screen = "exam") {
    setLiveAttempt(payload);
    setMode(payload.attempt.mode);
    setAnswers(Object.fromEntries(payload.answers.filter((item) => item.selected_option).map((item) => [item.position - 1, item.selected_option as Answer])));
    setFlagged(new Set(payload.answers.filter((item) => item.flagged).map((item) => item.position - 1)));
    setCurrent(0);
    setScreen(nextScreen);
  }

  function beginPreview(nextMode: PreviewMode) { setMode(nextMode); setAnswers({}); setFlagged(new Set()); setCurrent(0); setScreen("exam"); }
  async function beginAttempt(nextMode: PreviewMode) {
    if (!overview) { beginPreview(nextMode); return; }
    if (!overview.access.canStart) { setSystemMessage("Tu suscripción no permite iniciar una prueba nueva."); return; }
    setBusy(true); setSystemMessage("");
    try {
      const payload = await startOpo12Attempt({
        mode: nextMode,
        questionCount: nextMode === "simulation" ? undefined : questionCount,
        topicCodes: nextMode === "topic" ? [...selectedTopics] : undefined,
      });
      applyAttempt(payload);
    } catch (error) { setSystemMessage(friendlyError(error)); }
    finally { setBusy(false); }
  }
  function persistAnswer(selectedOption: Answer | null, nextFlagged: boolean) {
    if (!liveAttempt) return;
    void saveOpo12Answer({
      attemptId: liveAttempt.attempt.id,
      position: current + 1,
      selectedOption,
      flagged: nextFlagged,
    }).catch((error) => setSystemMessage(friendlyError(error)));
  }
  function chooseAnswer(answer: Answer | null) {
    setAnswers((before) => { const next = { ...before }; if (answer) next[current] = answer; else delete next[current]; return next; });
    persistAnswer(answer, flagged.has(current));
  }
  function toggleFlag() {
    const nextFlagged = !flagged.has(current);
    setFlagged((before) => { const next = new Set(before); if (nextFlagged) next.add(current); else next.delete(current); return next; });
    persistAnswer(answers[current] ?? null, nextFlagged);
  }
  function toggleTopic(topic: string) { setSelectedTopics((before) => { const next = new Set(before); if (next.has(topic)) next.delete(topic); else next.add(topic); return next; }); }

  async function completeAttempt() {
    if (!liveAttempt) { setScreen("result"); return; }
    setBusy(true); setSystemMessage("");
    try { applyAttempt(await submitOpo12Attempt(liveAttempt.attempt.id), "result"); }
    catch (error) { setSystemMessage(friendlyError(error)); }
    finally { setBusy(false); }
  }

  async function abandonAttempt() {
    if (liveAttempt) await abandonOpo12Attempt(liveAttempt.attempt.id).catch((error) => setSystemMessage(friendlyError(error)));
    setLiveAttempt(null); setScreen("home");
    loadOpo12Overview().then(setOverview).catch(() => undefined);
  }

  async function openHistory(attemptId: string) {
    setBusy(true); setSystemMessage("");
    try { applyAttempt(await loadOpo12Attempt(attemptId), "result"); }
    catch (error) { setSystemMessage(friendlyError(error)); }
    finally { setBusy(false); }
  }

  async function sendIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIncidentSent(false); setSystemMessage("");
    try {
      await createOpo12Incident({ category: incidentCategory, description: incidentDescription, attemptId: liveAttempt?.attempt.id ?? null, position: incidentPosition });
      setIncidentDescription(""); setIncidentPosition(null); setIncidentSent(true);
      loadOpo12Overview().then(setOverview).catch(() => undefined);
    } catch (error) { setSystemMessage(friendlyError(error)); }
  }

  return <div className={styles.app}>
    <header className={styles.header}>
      <Link href="/opo12" className={styles.brand} aria-label="Opo12 · Inicio"><Image src="/icons/opo12.svg" width={48} height={48} alt="" /><span>Opo<strong>12</strong></span></Link>
      {screen !== "exam" && screen !== "review" ? <nav aria-label="Navegación de Opo12">{nav.map(([key, label]) => <button key={key} className={screen === key ? styles.selectedNav : ""} onClick={() => setScreen(key)}>{label}</button>)}</nav> : null}
      <Link className={styles.base12} href="/">Base12 Academy</Link>
    </header>

    {systemMessage && <div className={styles.systemMessage} role="status">{systemMessage}{systemMessage.startsWith("Inicia sesión") ? <Link href="/login?redirect=%2Fopo12">Entrar</Link> : null}</div>}

    {screen === "home" && <main className={styles.shell}>
      <section className={styles.welcome}>
        <div><p className={styles.eyebrow}>TU OPOSICIÓN</p><h1>{overview?.profile.name ?? "Administrativos Junta de Andalucía"}</h1><p>C1.1000 · {overview?.profile.callLabel ?? "Convocatoria de acceso libre OEP 2022–2023"}</p></div>
        <span className={styles.activeBadge}>{!overview ? "Vista de demostración" : overview.access.state === "restricted" ? "Pago pendiente" : overview.access.state === "cancelled" ? "Suscripción cancelada" : "Suscripción activa"}</span>
      </section>
      <div className={styles.notice}><strong>Vista de interfaz en pruebas.</strong> El banco continúa en auditoría; esta demostración no usa el banco real ni calcula una nota oficial.</div>
      <div className={styles.included}><b>Una sola suscripción</b><span>Las tres modalidades están incluidas sin límites adicionales.</span></div>
      <section className={styles.modeGrid} aria-label="Modalidades incluidas">
        <article className={styles.modeCard}><span className={styles.modeIcon}>01</span><p className={styles.eyebrow}>MEDIR TU NIVEL</p><h2>Simulacro oficial</h2><p>107 preguntas, 180 minutos y corrección exacta de la convocatoria.</p><button disabled={busy} className={styles.primary} onClick={() => void beginAttempt("simulation")}>{overview?.activeAttempt ? "Reanudar prueba" : "Comenzar simulacro"}</button></article>
        <article className={styles.modeCard}><span className={styles.modeIcon}>02</span><p className={styles.eyebrow}>ENTRENAR</p><h2>Test por temas</h2><p>Elige uno o varios temas y practica con 10, 20, 30 o 50 preguntas.</p><button onClick={() => setScreen("topicSetup")}>Configurar test</button></article>
        <article className={styles.modeCard}><span className={styles.modeIcon}>03</span><p className={styles.eyebrow}>CONSOLIDAR</p><h2>Repasar errores</h2><p>Recupera preguntas falladas, en blanco o marcadas para revisar.</p><button onClick={() => setScreen("reviewSetup")}>Configurar repaso</button></article>
      </section>
      <section className={styles.heroGrid}><article className={styles.startCard}><div className={styles.quota}><span><b>∞</b> Pruebas ilimitadas</span><small>Mientras tu suscripción esté activa</small></div><h2>Un progreso, tres formas de practicar</h2><p>Opo12 separa las notas oficiales del entrenamiento para que tu evolución sea fiable.</p><small>Solo puedes mantener una prueba abierta; siempre podrás reanudarla.</small></article><aside className={styles.sideCard}><p className={styles.eyebrow}>ÚLTIMO SIMULACRO</p><strong>{overview?.history[0]?.score ?? "—"} <small>/ 120</small></strong><p>{overview?.history[0] ? new Date(overview.history[0].started_at).toLocaleDateString("es-ES") : "Todavía no has terminado ninguno"}</p>{overview?.history[0] ? <button onClick={() => void openHistory(overview.history[0].id)}>Ver resultado</button> : null}</aside></section>
      <section className={styles.stats}><article><span>Media</span><b>{averageScore == null ? "—" : averageScore.toFixed(1).replace(".", ",")}</b><small>Solo simulacros oficiales</small></article><article><span>Realizados</span><b>{overview?.history.length ?? 0}</b><small>Todas las modalidades</small></article><article><span>Mejor nota</span><b>{bestScore == null ? "—" : bestScore.toFixed(1).replace(".", ",")}</b><small>Sobre 120 puntos</small></article><article><span>Incidencias</span><b>{overview?.incidents.length ?? 0}</b><small>Últimas comunicaciones</small></article></section>
      <section className={styles.historyPreview}><div><p className={styles.eyebrow}>EVOLUCIÓN</p><h2>Tu progreso reciente</h2></div><div className={styles.chart} aria-label="Evolución de las notas de simulacros">{recentScores.length ? recentScores.map((value, index) => <i key={`${index}-${value}`} style={{ height: `${Math.max(4, Math.min(100, value / 1.2))}%` }}><span>{value.toFixed(1).replace(".", ",")}</span></i>) : <small>Completa tu primer simulacro para ver la evolución.</small>}</div><button onClick={() => setScreen("history")}>Ver histórico completo</button></section>
    </main>}

    {screen === "topicSetup" && <main className={styles.narrow}><button className={styles.back} onClick={() => setScreen("home")}>← Volver</button><p className={styles.eyebrow}>TEST POR TEMAS</p><h1>Configura tu entrenamiento</h1><p>Selecciona uno o varios de los 42 temas. Opo12 priorizará las preguntas que todavía no hayas visto.</p><div className={styles.setupPanel}><fieldset><legend>Temas seleccionados: {selectedTopics.size}</legend><div className={styles.topicPicker}>{topicOptions.map((topic) => <button type="button" key={topic} aria-pressed={selectedTopics.has(topic)} className={selectedTopics.has(topic) ? styles.countSelected : ""} onClick={() => toggleTopic(topic)}>Tema {Number(topic.slice(1))}</button>)}</div></fieldset><fieldset><legend>Número de preguntas</legend><div>{[10,20,30,50].map((count) => <button type="button" key={count} className={questionCount === count ? styles.countSelected : ""} onClick={() => setQuestionCount(count)}>{count}</button>)}</div></fieldset><button disabled={!selectedTopics.size || busy} className={styles.primary} onClick={() => void beginAttempt("topic")}>Comenzar test de {questionCount} preguntas</button></div></main>}

    {screen === "reviewSetup" && <main className={styles.narrow}><button className={styles.back} onClick={() => setScreen("home")}>← Volver</button><p className={styles.eyebrow}>REPASO INTELIGENTE</p><h1>Consolida lo que más te cuesta</h1><p>El repaso reúne automáticamente preguntas falladas, en blanco o marcadas. Si hay menos disponibles, utilizará todas.</p><div className={styles.setupPanel}><fieldset><legend>Máximo de preguntas</legend><div>{[10,20,30,50].map((count) => <button type="button" key={count} className={questionCount === count ? styles.countSelected : ""} onClick={() => setQuestionCount(count)}>{count}</button>)}</div></fieldset><button disabled={busy} className={styles.primary} onClick={() => void beginAttempt("review")}>Comenzar repaso de hasta {questionCount}</button></div></main>}

    {screen === "exam" && <main className={styles.exam}>
      <div className={styles.examTop}><div><span>{mode === "simulation" ? question.block : mode === "topic" ? "Test por temas" : "Repaso de errores"}</span><b>Pregunta {current + 1} de {examQuestions.length}</b></div><time>{liveAttempt ? formatCountdown(liveAttempt.attempt.deadline_at, clock) : mode === "simulation" ? "03:00:00" : "Sin límite"}</time></div>
      <div className={styles.progress}><i style={{ width: `${((current + 1) / examQuestions.length) * 100}%` }} /></div>
      <section className={styles.questionCard}><div className={styles.questionMeta}><span>{question.topic}</span><button className={flagged.has(current) ? styles.flagged : ""} onClick={toggleFlag}>⚑ {flagged.has(current) ? "Marcada" : "Marcar para revisar"}</button></div><h1>{question.prompt}</h1><div className={styles.options}>{question.options.map((option, index) => { const letter = String.fromCharCode(65 + index) as Answer; return <button key={letter} className={answers[current] === letter ? styles.chosen : ""} onClick={() => chooseAnswer(letter)}><b>{letter}</b><span>{option}</span></button>; })}</div>{answers[current] && <button className={styles.clear} onClick={() => chooseAnswer(null)}>Borrar respuesta</button>}</section>
      <div className={styles.questionMap}>{examQuestions.map((_, index) => <button key={index} aria-label={`Ir a la pregunta ${index + 1}`} onClick={() => setCurrent(index)} className={`${index === current ? styles.currentDot : ""} ${flagged.has(index) ? styles.reviewDot : answers[index] ? styles.answeredDot : ""}`}>{index + 1}</button>)}</div>
      <footer className={styles.examActions}><button disabled={current === 0} onClick={() => setCurrent(current - 1)}>← Anterior</button><span>{Object.keys(answers).length} respondidas · {flagged.size} para revisar</span>{current < examQuestions.length - 1 ? <button className={styles.next} onClick={() => setCurrent(current + 1)}>Siguiente →</button> : <button className={styles.finish} onClick={() => setScreen("review")}>Revisar y entregar</button>}</footer>
    </main>}

    {screen === "review" && <main className={styles.narrow}><p className={styles.eyebrow}>ANTES DE ENTREGAR</p><h1>Revisa tu prueba</h1><div className={styles.reviewSummary}><span><b>{Object.keys(answers).length}</b> respondidas</span><span><b>{examQuestions.length - Object.keys(answers).length}</b> en blanco</span><span><b>{flagged.size}</b> marcadas</span></div><p>Después de entregar no podrás modificar ninguna respuesta. Recibirás la corrección determinista y el solucionario verificado.</p><div className={styles.actions}><button onClick={() => setScreen("exam")}>Volver al examen</button><button onClick={() => void abandonAttempt()}>Abandonar prueba</button><button disabled={busy} className={styles.primary} onClick={() => void completeAttempt()}>Confirmar entrega</button></div></main>}

    {screen === "result" && <main className={styles.shell}><section className={styles.resultHero}><div><p className={styles.eyebrow}>{mode === "simulation" ? "SIMULACRO OFICIAL" : mode === "topic" ? "ENTRENAMIENTO POR TEMAS" : "REPASO INTELIGENTE"}</p><h1>Resultado</h1><p>{liveAttempt?.attempt.submitted_at ? `Finalizado el ${new Date(liveAttempt.attempt.submitted_at).toLocaleString("es-ES")}` : "Resultado de demostración"}</p></div><strong>{resultScore.toFixed(mode === "simulation" ? 1 : 0).replace(".", ",")}<small>{mode === "simulation" ? " / 120" : "% de aciertos"}</small></strong></section><section className={styles.stats}><article><span>Aciertos</span><b className={styles.good}>{resultCorrect}</b></article><article><span>Errores</span><b className={styles.bad}>{resultWrong}</b></article><article><span>Sin responder</span><b>{resultBlank}</b></article><article><span>{mode === "simulation" ? "Penalización" : "Modalidad"}</span><b>{mode === "simulation" ? "−0,4" : mode === "topic" ? "Tema" : "Repaso"}</b><small>{mode === "simulation" ? "Por cada error" : "No altera tu nota oficial"}</small></article></section>{liveAttempt?.purgedAfterDelivery ? <div className={styles.notice}>Esta prueba se ha corregido, pero no se conservará en el histórico porque la suscripción fue cancelada definitivamente.</div> : null}<div className={styles.actions}>{!liveAttempt?.solutionsLocked ? <button className={styles.primary} onClick={() => setScreen("solution")}>Ver solucionario</button> : null}<button onClick={() => setScreen("home")}>Volver al inicio</button></div></main>}

    {screen === "solution" && <main className={styles.shell}><p className={styles.eyebrow}>SOLUCIONARIO</p><h1>Revisión pregunta a pregunta</h1><div className={styles.solutions}>{examQuestions.map((item, index) => <article key={`${index}-${item.prompt}`}><header><span>Pregunta {index + 1} · {item.topic}</span><b className={answers[index] === item.correct ? styles.good : styles.bad}>{answers[index] === item.correct ? "Correcta" : answers[index] ? "Incorrecta" : "Sin responder"}</b></header><h2>{item.prompt}</h2><p>Tu respuesta: <strong>{answers[index] ?? "—"}</strong> · Respuesta correcta: <strong>{item.correct ?? "No disponible"}</strong></p><div><b>Explicación</b><p>{item.explanation}</p><small>{item.reference}</small></div><button onClick={() => { setIncidentCategory("question"); setIncidentPosition(index + 1); setScreen("incidents"); }}>Comunicar una duda sobre esta pregunta</button></article>)}</div></main>}

    {screen === "history" && <SimpleScreen title="Histórico de actividad" text="Consulta por separado simulacros, entrenamientos y repasos mientras tu suscripción esté activa." onBack={() => setScreen("home")}><div className={styles.historyRows}>{overview?.history.length ? overview.history.map((item) => <button key={item.id} onClick={() => void openHistory(item.id)}><span><b>{item.mode === "simulation" ? "Simulacro" : item.mode === "topic" ? "Test por temas" : "Repaso de errores"}</b><small>{new Date(item.started_at).toLocaleDateString("es-ES")}</small></span><b>{item.score == null ? "—" : `${item.score}${item.mode === "simulation" ? " / 120" : "%"}`}</b><small>Ver resultado →</small></button>) : <p>Todavía no hay pruebas terminadas.</p>}</div></SimpleScreen>}
    {screen === "subscription" && <SimpleScreen title="Tu suscripción" text="Cada oposición tiene una suscripción independiente. Las tres modalidades están incluidas en el mismo precio." onBack={() => setScreen("home")}><div className={styles.subscription}><span className={styles.activeBadge}>{overview?.access.state === "restricted" ? "Pago pendiente" : overview?.access.state === "cancelled" ? "Cancelada" : "Activa"}</span><dl><div><dt>Oposición</dt><dd>{overview?.profile.shortName ?? "Administrativos Junta de Andalucía · C1.1000"}</dd></div><div><dt>Incluye</dt><dd>Simulacros · Test por temas · Repaso de errores</dd></div><div><dt>Pagada hasta</dt><dd>{overview?.access.paidThrough ? new Date(`${overview.access.paidThrough}T12:00:00`).toLocaleDateString("es-ES") : "Acceso gratuito o pendiente de información"}</dd></div>{overview?.access.regularizationDaysRemaining != null ? <div><dt>Plazo para regularizar</dt><dd>{overview.access.regularizationDaysRemaining} días</dd></div> : null}</dl><button>Gestionar pago</button></div></SimpleScreen>}
    {screen === "incidents" && <SimpleScreen title="Incidencias y dudas" text="Puedes comunicar una pregunta dudosa, un problema técnico o una incidencia con la suscripción. Verás aquí el estado y la resolución." onBack={() => setScreen("home")}><form className={styles.incident} onSubmit={(event) => void sendIncident(event)}><label>Tipo<select value={incidentCategory} onChange={(event) => setIncidentCategory(event.target.value as typeof incidentCategory)}><option value="question">Pregunta dudosa o defectuosa</option><option value="technical">Problema técnico</option><option value="subscription">Suscripción o pago</option><option value="other">Otro</option></select></label><label>Cuéntanos qué ha ocurrido<textarea required minLength={10} maxLength={3000} value={incidentDescription} onChange={(event) => setIncidentDescription(event.target.value)} rows={5} placeholder="Incluye toda la información que pueda ayudarnos a revisarlo." /></label><button disabled={incidentDescription.trim().length < 10} className={styles.primary}>Enviar incidencia</button>{incidentSent ? <p className={styles.good}>Incidencia recibida. Puedes consultar su estado en esta misma sección.</p> : null}</form><div className={styles.incidentHistory}>{overview?.incidents.map((item) => <article key={item.id}><b>{item.category === "question" ? "Pregunta" : item.category === "technical" ? "Problema técnico" : item.category === "subscription" ? "Suscripción" : "Otra incidencia"}</b><span>{item.status === "resolved" ? "Resuelta" : item.status === "dismissed" ? "Cerrada" : item.status === "human_review" ? "En revisión" : "Recibida"}</span><small>{new Date(item.created_at).toLocaleDateString("es-ES")}</small></article>)}</div></SimpleScreen>}
  </div>;
}

function SimpleScreen({ title, text, onBack, children }: { title: string; text: string; onBack: () => void; children: React.ReactNode }) {
  return <main className={styles.narrow}><button className={styles.back} onClick={onBack}>← Volver</button><p className={styles.eyebrow}>OPO12</p><h1>{title}</h1><p>{text}</p>{children}</main>;
}
