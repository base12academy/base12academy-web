"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import course from "@/lib/ofimatica-content.json";
import rocioQuestions from "@/lib/rocio-questions.json";
import { supabase } from "@/lib/supabaseClient";
import styles from "./ofimatica.module.css";
import quizStyles from "./rocio.module.css";

type Tab = "explicacion" | "glosario" | "rocio" | "fernando" | "actividad";

export default function OfimaticaPage() {
  return <Suspense fallback={<div className={styles.loading}>Preparando el aula de Competencias y Productividad Digital, Ofimática e IA…</div>}><OfimaticaCourse /></Suspense>;
}

function OfimaticaCourse() {
  const search = useSearchParams();
  const requested = (search.get("contenido") || "G01_V01").toUpperCase();
  const allLessons = useMemo(() => course.groups.flatMap((group) => group.lessons.map((lesson) => ({ ...lesson, group }))), []);
  const selected = allLessons.find((lesson) => lesson.id === requested) || allLessons[0];
  const [tab, setTab] = useState<Tab>("explicacion");
  const [allowed, setAllowed] = useState(selected.publicPreview);
  const [access, setAccess] = useState(selected.publicPreview ? "public_preview" : "checking");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      setShowVideo(false);
      const { data } = await supabase.auth.getSession();
      const response = await fetch(`/api/course-access?lesson=${encodeURIComponent(selected.id)}`, {
        headers: data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {},
      });
      const result = await response.json().catch(() => ({}));
      if (active) {
        setAllowed(Boolean(result.allowed));
        setAccess(result.access || "subscription_required");
      }
    };
    check();
    return () => { active = false; };
  }, [selected.id]);

  const youtubeUrl = "videoUrl" in selected ? selected.videoUrl : "";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>B12 <span>Base12 Academy</span></Link>
        <p className={styles.eyebrow}>PROGRAMA</p>
        <h2>Competencias y Productividad Digital, Ofimática e IA</h2>
        <div className={styles.progress}><span /></div>
        <nav className={styles.index}>
          {course.groups.map((group) => (
            <details key={group.id} open={group.id === selected.group.id}>
              <summary>{group.id.slice(1)}. {group.title}</summary>
              {group.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/dashboard/ofimatica?contenido=${lesson.id}`} className={lesson.id === selected.id ? styles.active : ""}>
                  {lesson.id === "G01_V01" ? "● " : ""}{lesson.title}
                </Link>
              ))}
            </details>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.topline}>
          <span>{selected.group.title} · {selected.id}</span>
          {access === "administrator" && <b>Vista completa de administrador</b>}
          {access === "public_preview" && <b>Unidad abierta</b>}
        </div>
        <h1>{selected.title}</h1>
        <p className={styles.subtitle}>Contenido práctico del programa de Competencias y Productividad Digital, Ofimática e IA de Base12 Academy.</p>

        {!allowed ? (
          <section className={styles.locked}>
            <h2>Este contenido requiere acceso al curso</h2>
            <p>La primera unidad está abierta. Para continuar, inicia sesión y activa una matrícula o una clave personal.</p>
            <div><Link href="/dashboard/ofimatica?contenido=G01_V01">Ver la unidad abierta</Link><Link href="/dashboard/comprar/ofimatica-esencial">Ver modalidades</Link></div>
          </section>
        ) : (
          <>
            <section className={styles.videoCard}>
              {!showVideo ? (
                <button onClick={() => setShowVideo(true)}>▶ Ver vídeo de este contenido</button>
              ) : youtubeUrl ? (
                <iframe
                  src={`${youtubeUrl}?autoplay=1&rel=0`}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
                />
              ) : (
                <div className={styles.videoPending}>El vídeo está preparado y se mostrará aquí cuando termine la carga al alojamiento.</div>
              )}
            </section>


                <div className={styles.tabs}>
                  {(["explicacion", "glosario", "rocio", "fernando", "actividad"] as Tab[]).map((name) => (
                    <button key={name} onClick={() => setTab(name)} className={tab === name ? styles.selectedTab : ""}>
                      {name === "rocio" ? "Rocío · Profesora IA" : name === "fernando" ? "Fernando · Tutor IA" : name[0].toUpperCase() + name.slice(1)}
                    </button>
                  ))}
                </div>

                <section className={styles.contentCard}>
                  {tab === "explicacion" && <TextContent title="Explicación del contenido" text={selected.explanation} />}
                  {tab === "glosario" && <TextContent title="Glosario" text={selected.glossary} />}
                  {tab === "actividad" && <TextContent title="Pruebas, retos y prácticas" text={selected.activities} />}
                  {tab === "rocio" && <RocioQuiz lesson={selected.id} />}
                  {tab === "fernando" && <Assistant name="Fernando" role="Tutor IA" text="Te ayuda a organizar el estudio, comprueba tu avance y te orienta para retomar el curso si te has despistado." />}
                </section>

          </>
        )}
      </main>
    </div>
  );
}

function TextContent({ title, text }: { title: string; text: string }) {
  return <><h2>{title}</h2><div className={styles.pre}>{text || "Contenido en preparación."}</div></>;
}

function Assistant({ name, role, text }: { name: string; role: string; text: string }) {
  return <div className={styles.assistant}><div className={styles.avatar}>{name[0]}</div><div><p className={styles.eyebrow}>{role}</p><h2>{name}</h2><p>{text}</p><button>Preguntar sobre este contenido</button></div></div>;
}

type RocioQuestion = {
  code: string;
  lesson: string;
  type: string;
  difficulty: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  criterion: string;
  recovery: string;
};

function RocioQuiz({ lesson }: { lesson: string }) {
  const questions = useMemo(
    () => (rocioQuestions as RocioQuestion[]).filter((question) => question.lesson === lesson),
    [lesson],
  );
  const ordinary = useMemo(() => questions.filter((question) => question.type !== "Recuperación"), [questions]);
  const recovery = questions.find((question) => question.type === "Recuperación");
  const [queue, setQueue] = useState<RocioQuestion[]>(ordinary);
  const [position, setPosition] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    setQueue(ordinary);
    setPosition(0);
    setSelectedOption(null);
    setCorrect(0);
  }, [lesson, ordinary]);

  const question = queue[position];
  const finished = position >= queue.length;

  const choose = (option: number) => {
    if (selectedOption !== null || !question) return;
    setSelectedOption(option);
    if (option === question.answer) setCorrect((value) => value + 1);
  };

  const next = () => {
    if (!question || selectedOption === null) return;
    if (selectedOption !== question.answer && recovery && !queue.some((item) => item.code === recovery.code)) {
      setQueue((items) => [...items.slice(0, position + 1), recovery, ...items.slice(position + 1)]);
    }
    setPosition((value) => value + 1);
    setSelectedOption(null);
  };

  const restart = () => {
    setQueue(ordinary);
    setPosition(0);
    setSelectedOption(null);
    setCorrect(0);
  };

  if (!questions.length) {
    return <Assistant name="Rocío" role="Profesora IA" text="Las preguntas de comprobación de este contenido están en preparación." />;
  }

  if (finished) {
    return (
      <div className={quizStyles.quiz}>
        <p className={styles.eyebrow}>ROCÍO · PROFESORA IA</p>
        <h2>Comprobación terminada</h2>
        <p>Has respondido correctamente {correct} de {queue.length} preguntas realizadas.</p>
        <p>Estas preguntas sirven para practicar y recuperar conceptos; no sustituyen las evidencias certificables del curso.</p>
        <button className={quizStyles.primaryButton} onClick={restart}>Repetir comprobación</button>
      </div>
    );
  }

  const isCorrect = selectedOption === question.answer;
  return (
    <div className={quizStyles.quiz}>
      <div className={quizStyles.quizHeader}>
        <div><p className={styles.eyebrow}>ROCÍO · PROFESORA IA</p><h2>Comprueba lo aprendido</h2></div>
        <span>{position + 1} / {queue.length}</span>
      </div>
      <p className={quizStyles.quizMeta}>{question.type} · {question.difficulty}</p>
      <h3>{question.prompt}</h3>
      <div className={quizStyles.options}>
        {question.options.map((option, index) => {
          const state = selectedOption === null ? "" : index === question.answer ? quizStyles.correct : index === selectedOption ? quizStyles.incorrect : "";
          return <button key={option} className={state} onClick={() => choose(index)} disabled={selectedOption !== null}><b>{String.fromCharCode(65 + index)}</b>{option}</button>;
        })}
      </div>
      {selectedOption !== null && (
        <div className={isCorrect ? quizStyles.feedbackCorrect : quizStyles.feedbackIncorrect}>
          <strong>{isCorrect ? "Correcto." : "Vamos a revisarlo."}</strong> {question.explanation}
          <p><b>Criterio:</b> {question.criterion}</p>
          {!isCorrect && <p><b>Recuperación:</b> {question.recovery}</p>}
          <button className={quizStyles.primaryButton} onClick={next}>{position + 1 === queue.length ? "Ver resultado" : "Siguiente pregunta"}</button>
        </div>
      )}
    </div>
  );
}








