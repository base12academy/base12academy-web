"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isTropaAptitudeSlug, tropaAptitudes } from "@/lib/tropa-config";
import styles from "./training.module.css";

type Tab = "training" | "resources" | "motors" | "tutors";
type Question = {
  question_id: string;
  aptitude_slug: string;
  motor_code: string;
  family_id: string;
  level: number;
  prompt: string;
  options: Record<string, string>;
  stimulus: Record<string, unknown>;
};
type AnswerResult = {
  correct: boolean;
  correctOption: string;
  explanation: string;
  feedback: string;
  errorCode: string | null;
};
type Workshop = {
  workshop_id: string;
  block_code: string;
  title: string;
  resource_kind: string;
  content: Record<string, unknown> | null;
};
type Microtemario = {
  micro_id: string;
  motor_code: string;
  game_name: string;
  correct_sequence: string;
  main_tip: string;
};
type Game = {
  motor_code: string;
  game_name: string;
  available: boolean;
};
type Video = { video_id: string; source_name: string; youtube_url: string };
type ContentPayload = {
  workshops: Workshop[];
  microtemarios: Microtemario[];
  games: Game[];
  videos: Video[];
  laminas: { lamina_id: string; title: string; priority: string }[];
};

async function authorizedFetch(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("login_required");
  return fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers, Authorization: `Bearer ${token}` },
  });
}

async function questionVisualUrl(aptitudeSlug: string, question?: Question) {
  const sourceId = question?.stimulus?.resource_v5_reference;
  if (typeof sourceId !== "string" || !sourceId) return null;
  const response = await authorizedFetch(`/api/tropa/resource?aptitude=${aptitudeSlug}&id=${encodeURIComponent(sourceId)}`);
  if (!response.ok) return null;
  return URL.createObjectURL(await response.blob());
}

export default function TropaAptitudePage() {
  const params = useParams<{ aptitude: string }>();
  const aptitudeSlug = String(params.aptitude || "");
  const aptitude = isTropaAptitudeSlug(aptitudeSlug)
    ? tropaAptitudes.find((item) => item.slug === aptitudeSlug) ?? null
    : null;
  const [state, setState] = useState<"loading" | "ready" | "locked" | "error">("loading");
  const [tab, setTab] = useState<Tab>("training");
  const [content, setContent] = useState<ContentPayload | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeMotor, setActiveMotor] = useState<string | null>(null);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState({ totalAnswered: 0, accuracy: 0 });
  const [tutorRole, setTutorRole] = useState<"rocio" | "fernando">("rocio");
  const [tutorMessage, setTutorMessage] = useState("");
  const [tutorAnswer, setTutorAnswer] = useState("");
  const [tutorBusy, setTutorBusy] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!aptitude) {
        if (active) setState("error");
        return;
      }
      try {
        const [accessResponse, contentResponse, progressResponse, questionResponse] = await Promise.all([
          authorizedFetch("/api/tropa/access"),
          authorizedFetch(`/api/tropa/content?aptitude=${aptitude.slug}`),
          authorizedFetch("/api/tropa/progress"),
          authorizedFetch(`/api/tropa/questions?aptitude=${aptitude.slug}&limit=10`),
        ]);
        if (!active) return;
        if (accessResponse.status === 401 || accessResponse.status === 403 || contentResponse.status === 403) {
          setState("locked");
          return;
        }
        if (!accessResponse.ok || !contentResponse.ok || !questionResponse.ok) throw new Error("unavailable");
        const [accessBody, contentBody, progressBody, questionBody] = await Promise.all([
          accessResponse.json(), contentResponse.json(), progressResponse.json(), questionResponse.json(),
        ]);
        if (!Array.isArray(accessBody.aptitudeSlugs) || !accessBody.aptitudeSlugs.includes(aptitude.slug)) {
          setState("locked");
          return;
        }
        const loadedQuestions = (questionBody.questions ?? []) as Question[];
        const firstVisual = await questionVisualUrl(aptitude.slug, loadedQuestions[0]);
        if (!active) {
          if (firstVisual) URL.revokeObjectURL(firstVisual);
          return;
        }
        setContent(contentBody as ContentPayload);
        setProgress({ totalAnswered: Number(progressBody.totalAnswered || 0), accuracy: Number(progressBody.accuracy || 0) });
        setQuestions(loadedQuestions);
        setVisualUrl(firstVisual);
        startedAt.current = performance.now();
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    })();
    return () => { active = false; };
  }, [aptitude]);

  async function loadQuestions(motor: string | null) {
    if (!aptitude) return;
    const suffix = motor ? `&motor=${encodeURIComponent(motor)}` : "";
    const response = await authorizedFetch(`/api/tropa/questions?aptitude=${aptitude.slug}&limit=10${suffix}`);
    if (!response.ok) throw new Error("question_bank_unavailable");
    const body = await response.json();
    const loadedQuestions = (body.questions ?? []) as Question[];
    const nextVisual = await questionVisualUrl(aptitude.slug, loadedQuestions[0]);
    setQuestions(loadedQuestions);
    setPosition(0);
    setAnswer(null);
    setVisualUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextVisual;
    });
    setActiveMotor(motor);
    setTab("training");
    startedAt.current = performance.now();
  }

  async function submitAnswer(selectedOption: string) {
    const question = questions[position];
    if (!question || answer || submitting) return;
    setSubmitting(true);
    try {
      const response = await authorizedFetch("/api/tropa/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: question.question_id,
          selectedOption,
          responseMs: Math.round(performance.now() - startedAt.current),
        }),
      });
      if (!response.ok) throw new Error("answer_failed");
      setAnswer(await response.json() as AnswerResult);
      setProgress((current) => ({
        totalAnswered: current.totalAnswered + 1,
        accuracy: current.accuracy,
      }));
    } finally {
      setSubmitting(false);
    }
  }

  async function nextQuestion() {
    if (position + 1 < questions.length) {
      const nextPosition = position + 1;
      const nextVisual = await questionVisualUrl(aptitude!.slug, questions[nextPosition]);
      setPosition(nextPosition);
      setAnswer(null);
      setVisualUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextVisual;
      });
      startedAt.current = performance.now();
      return;
    }
    await loadQuestions(activeMotor);
  }

  async function askTutor() {
    if (!aptitude || !tutorMessage.trim() || tutorBusy) return;
    setTutorBusy(true);
    setTutorAnswer("");
    try {
      const response = await authorizedFetch("/api/tropa/ia", {
        method: "POST",
        body: JSON.stringify({ aptitude: aptitude.slug, role: tutorRole, message: tutorMessage }),
      });
      const body = await response.json().catch(() => ({}));
      setTutorAnswer(response.ok ? String(body.answer || "") : "El tutor no está disponible ahora mismo.");
    } finally {
      setTutorBusy(false);
    }
  }

  if (!aptitude || state === "error") return <Status title="No se ha podido abrir esta aptitud" />;
  if (state === "loading") return <Status title="Cargando tu contenido de Tropa y Marinería…" />;
  if (state === "locked") return <Status title="Tu matrícula no incluye esta aptitud" locked />;
  const question = questions[position];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/"><Image src="/images/base12-logo.png" alt="Base12 Academy" width={126} height={58} /></Link>
        <nav><Link href="/dashboard/tropa-y-marineria">Centro de operaciones</Link><Link href="/dashboard/facturas">Mis facturas</Link></nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div><p>{aptitude.code} · Aptitud</p><h1>{aptitude.name}</h1><span>{progress.totalAnswered} respuestas registradas · {progress.accuracy}% de precisión global</span></div>
          <b>{activeMotor ? `Motor ${activeMotor}` : "Entrenamiento general"}</b>
        </section>
        <nav className={styles.tabs} aria-label="Secciones del aula">
          {(["training", "resources", "motors", "tutors"] as Tab[]).map((item) => (
            <button key={item} type="button" className={tab === item ? styles.activeTab : ""} onClick={() => setTab(item)}>
              {{ training: "Entrenamiento", resources: "Talleres y recursos", motors: "Motores", tutors: "Rocío y Fernando" }[item]}
            </button>
          ))}
        </nav>

        {tab === "training" && (
          <section className={styles.training}>
            <div className={styles.trainingTop}><span>Pregunta {position + 1} de {questions.length}</span><span>Nivel N{question?.level ?? "–"} · {question?.family_id ?? ""}</span></div>
            {question ? (
              <>
                <h2>{question.prompt}</h2>
                {visualUrl && <Image className={styles.questionVisual} src={visualUrl} alt="Recurso visual de la pregunta" width={900} height={560} unoptimized />}
                <div className={styles.options}>
                  {Object.entries(question.options).map(([letter, value]) => (
                    <button key={letter} type="button" disabled={Boolean(answer) || submitting} onClick={() => void submitAnswer(letter)}>
                      <b>{letter}</b><span>{value}</span>
                    </button>
                  ))}
                </div>
                {answer && (
                  <div className={answer.correct ? styles.correct : styles.incorrect}>
                    <h3>{answer.correct ? "Correcto" : `La respuesta correcta es ${answer.correctOption}`}</h3>
                    <p>{answer.feedback || answer.explanation}</p>
                    {!answer.correct && answer.feedback !== answer.explanation && <p>{answer.explanation}</p>}
                    <button type="button" onClick={() => void nextQuestion()}>Siguiente pregunta</button>
                  </div>
                )}
              </>
            ) : <p>No hay preguntas disponibles para este filtro.</p>}
          </section>
        )}

        {tab === "resources" && content && (
          <section className={styles.resourceGrid}>
            <div className={styles.resourceColumn}><h2>Talleres y fichas</h2>{content.workshops.map((workshop) => (
              <details key={workshop.workshop_id}><summary>{workshop.title}</summary><p>{field(workshop.content, "objective") || "Recurso transversal disponible para esta aptitud."}</p><p><b>Idea clave:</b> {field(workshop.content, "key_idea")}</p><p><b>Procedimiento:</b> {field(workshop.content, "procedure")}</p></details>
            ))}</div>
            <div className={styles.resourceColumn}><h2>Microtemarios</h2>{content.microtemarios.map((micro) => (
              <article key={micro.micro_id}><span>{micro.motor_code}</span><h3>{micro.game_name}</h3><p>{micro.main_tip}</p><small>{micro.correct_sequence}</small></article>
            ))}<h2>Láminas maestras</h2>{content.laminas.map((lamina) => <p key={lamina.lamina_id}><b>{lamina.lamina_id}</b> · {lamina.title}</p>)}</div>
            <div className={styles.resourceColumn}><h2>Vídeos</h2>{content.videos.map((video) => <a key={video.video_id} href={video.youtube_url} target="_blank" rel="noreferrer">{video.source_name}</a>)}</div>
          </section>
        )}

        {tab === "motors" && content && (
          <section className={styles.motorGrid}>{content.games.map((game) => (
            <article key={game.motor_code} className={!game.available ? styles.lockedMotor : ""}><span>{game.motor_code}</span><h2>{game.game_name}</h2><p>{content.microtemarios.find((item) => item.motor_code === game.motor_code)?.main_tip}</p><button type="button" disabled={!game.available} onClick={() => void loadQuestions(game.motor_code)}>{game.available ? "Entrenar motor" : "No incluido en tu paquete"}</button></article>
          ))}</section>
        )}

        {tab === "tutors" && (
          <section className={styles.tutors}>
            <div className={styles.tutorPicker}><button type="button" className={tutorRole === "rocio" ? styles.activeTutor : ""} onClick={() => setTutorRole("rocio")}>Rocío · Profesora IA</button><button type="button" className={tutorRole === "fernando" ? styles.activeTutor : ""} onClick={() => setTutorRole("fernando")}>Fernando · Tutor IA</button></div>
            <textarea value={tutorMessage} onChange={(event) => setTutorMessage(event.target.value)} placeholder={tutorRole === "rocio" ? "Pide una explicación del procedimiento…" : "Pregunta qué deberías entrenar ahora…"} />
            <button type="button" disabled={tutorBusy || !tutorMessage.trim()} onClick={() => void askTutor()}>{tutorBusy ? "Consultando…" : "Enviar consulta"}</button>
            {tutorAnswer && <div className={styles.tutorAnswer}>{tutorAnswer}</div>}
          </section>
        )}
      </main>
    </div>
  );
}

function field(content: Record<string, unknown> | null, key: string) {
  return content ? String(content[key] || "") : "";
}

function Status({ title, locked = false }: { title: string; locked?: boolean }) {
  return <main className={styles.status}><h1>{title}</h1><p>{locked ? "Vuelve al centro de operaciones para ver el contenido incluido en tu compra." : "Inténtalo de nuevo o vuelve al centro de operaciones."}</p><Link href="/dashboard/tropa-y-marineria">Volver</Link></main>;
}
