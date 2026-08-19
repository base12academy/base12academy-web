"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import data from "@/lib/auxiliar-administrativo-ja-index.json";
import { supabase } from "@/lib/supabaseClient";
import styles from "../administrativo-ja/administrativo-ja.module.css";
import layout from "../administrativo-ja/course-layout.module.css";
import { OpenQuestion, OppositionTest, TutoringCalendar } from "@/components/OppositionTools";

type Tab = "explicacion" | "glosario" | "rocio" | "fernando" | "test" | "tutoria";
type TestQuestion = { question: string; options: string[]; answer: number; explanation: string };
type ThemeContent = { id: string; number: number; title: string; videoUrl: string; explanation: string; glossary: { term: string; definition: string }[]; rocio: { question: string; answer: string }[]; tests: TestQuestion[]; publicPreview: boolean };

export default function AuxiliarAdministrativoJaPage() {
  return <Suspense fallback={<div className={styles.loading}>Preparando el aula…</div>}><Course /></Suspense>;
}

function Course() {
  const params = useSearchParams();
  const requested = (params.get("tema") || "T01").toUpperCase();
  const theme = data.themes.find((item) => item.id === requested) || data.themes[0];
  const [tab, setTab] = useState<Tab>("explicacion");
  const [allowed, setAllowed] = useState(false);
  const [access, setAccess] = useState("checking");
  const [content, setContent] = useState<ThemeContent | null>(null);
  const [canNavigateAll, setCanNavigateAll] = useState(false);
  const [checking, setChecking] = useState(true);
  const [planSlug, setPlanSlug] = useState("esencial");

  useEffect(() => {
    let active = true;
    setTab("explicacion");
    setChecking(true);
    setContent(null);
    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(`/api/opposition-course-content?course=auxiliar-administrativo-ja&theme=${theme.id}`, {
        headers: sessionData.session?.access_token ? { Authorization: `Bearer ${sessionData.session.access_token}` } : {},
      });
      const result = await response.json().catch(() => ({}));
      if (active) {
        setAllowed(Boolean(result.allowed));
        setAccess(result.access || "subscription_required");
        setCanNavigateAll(Boolean(result.canNavigateAll));
        setContent(result.theme || null);
        setPlanSlug(result.planSlug || "esencial");
        setChecking(false);
      }
    };
    check();
    return () => { active = false; };
  }, [theme.id]);

  const progress = Math.round((theme.number / data.themes.length) * 100);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}><img className={layout.brandLogo} src="/images/base12-logo.png" alt="Base12 Academy" /></Link>
        <p className={styles.eyebrow}>OPOSICIONES · JUNTA DE ANDALUCÍA</p>
        <h2>Auxiliar Administrativo</h2>
        <div className={styles.progressText}><span>Progreso del temario</span><b>{progress}%</b></div>
        <div className={styles.progress}><span style={{ width: `${progress}%` }} /></div>
        <p className={styles.indexTitle}>ÍNDICE DEL TEMARIO · {data.themes.length} TEMAS</p>
        <nav className={styles.index}>
          {data.themes.map((item) => item.publicPreview || canNavigateAll ? <Link key={item.id} href={`/dashboard/auxiliar-administrativo-ja?tema=${item.id}`} className={item.id === theme.id ? styles.active : ""}><span>{item.number}</span><span>{item.title}</span>{item.publicPreview && <small>ABIERTO</small>}</Link> : <span key={item.id} className={layout.lockedTheme}><span>{item.number}</span><span>{item.title}</span><small>🔒</small></span>)}
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.topline}>
          <span>Temario / Tema {theme.number}</span>
          <div className={layout.topActions}><b>{access === "administrator" ? "Vista de administrador" : access === "public_preview" ? "Tema abierto" : "Aula Base12"}</b><Link className={layout.accountLink} href="/dashboard"><span aria-hidden="true">◯</span> Mi cuenta</Link></div>
        </div>
        <p className={styles.kicker}>TEMA {theme.number} DE {data.themes.length}</p>
        <h1>{theme.title}</h1>
        <p className={styles.subtitle}>Auxiliar Administrativo de la Junta de Andalucía</p>

        {checking ? <section className={styles.locked}><div className={styles.lockIcon}>…</div><div><h2>Comprobando acceso</h2><p>Estamos verificando la matrícula de esta cuenta.</p></div></section> : !allowed || !content ? (
          <section className={styles.locked}>
            <div className={styles.lockIcon}>🔒</div>
            <div><h2>Este tema requiere matrícula</h2><p>El Tema 1 está abierto para que conozcas el aula. Inicia sesión con una matrícula activa para continuar.</p></div>
            <div className={styles.lockActions}><Link href="/dashboard/auxiliar-administrativo-ja?tema=T01">Ver el Tema 1</Link><Link href="/#catalogo">Ver modalidades</Link></div>
          </section>
        ) : (
          <div className={layout.learningGrid}>
            <div className={layout.lessonColumn}>
            <section className={styles.videoCard}>
              <iframe src={`${content.videoUrl}?rel=0`} title={`Vídeo del tema ${theme.number}: ${theme.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </section>

            <div className={styles.tabs} role="tablist" aria-label="Recursos del tema">
              {(["explicacion", "glosario", "rocio", "fernando", "test", ...(planSlug === "premium" ? ["tutoria" as Tab] : [])] as Tab[]).map((name) => (
                <button key={name} onClick={() => setTab(name)} className={tab === name ? styles.selectedTab : ""}>
                  {name !== "rocio" && name !== "fernando" && <span>{name === "explicacion" ? "▤" : name === "glosario" ? "◫" : "✓"}</span>}
                  {name === "explicacion" ? "Explicación" : name === "glosario" ? "Glosario" : name === "rocio" ? "Rocío · Profesora IA" : name === "fernando" ? "Fernando · Tutor IA" : name === "tutoria" ? "Tutoría humana" : planSlug === "esencial" ? "Comprobación" : "Simulacro"}
                </button>
              ))}
            </div>

            <section className={styles.contentCard}>
              {tab === "explicacion" && <><p className={styles.sectionLabel}>EXPLICACIÓN DEL TEMA</p><h2>{theme.title}</h2><div className={styles.pre}>{content.explanation}</div></>}
              {tab === "glosario" && <Glossary items={content.glossary} />}
              {tab === "rocio" && <><Rocio items={content.rocio} /><OpenQuestion courseSlug="auxiliar-administrativo-ja" themeId={theme.id} /></>}
              {tab === "fernando" && <Assistant name="Fernando" role="Tutor IA" text={`Te ayuda a organizar el estudio del Tema ${theme.number}, comprobar tu avance y retomar el itinerario cuando lo necesites.`} />}
              {tab === "test" && <OppositionTest questions={content.tests} courseSlug="auxiliar-administrativo-ja" themeId={theme.id} planSlug={planSlug} />}
              {tab === "tutoria" && planSlug === "premium" && <TutoringCalendar courseSlug="auxiliar-administrativo-ja" />}
            </section>
            </div>
            <RightRail theme={content} onSelect={setTab} />
          </div>
        )}
      </main>
    </div>
  );
}

function Glossary({ items }: { items: { term: string; definition: string }[] }) {
  return <><p className={styles.sectionLabel}>CONCEPTOS CLAVE</p><h2>Glosario del tema</h2><div className={styles.glossary}>{items.map((item) => <article key={item.term}><h3>{item.term}</h3><p>{item.definition}</p></article>)}</div></>;
}

function Rocio({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return <><Assistant name="Rocío" role="Profesora IA" text="Te explica el contenido, resuelve dudas académicas y te ayuda a comprobar las ideas esenciales." /><div className={styles.qa}>{items.map((item, index) => <article key={item.question}><button onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span><b>{open === index ? "−" : "+"}</b></button>{open === index && <p>{item.answer}</p>}</article>)}</div></>;
}

function Assistant({ name, role, text }: { name: string; role: string; text: string }) {
  const avatar = name === "Rocío" ? "/images/rocio-profesora-ia.png" : "/images/fernando-tutor-ia.png";
  return <div className={layout.assistant}><img className={layout.avatar} src={avatar} alt={`Avatar de ${name}`} /><div><p className={styles.sectionLabel}>{role}</p><h2>{name}</h2><p>{text}</p><button>Preguntar sobre este tema</button></div></div>;
}

function RightRail({ theme, onSelect }: { theme: ThemeContent; onSelect: (tab: Tab) => void }) {
  return <aside className={layout.rightRail}>
    <section><div className={layout.railTitle}><span>◫</span><h3>Glosario</h3><button onClick={() => onSelect("glosario")}>Ver todo</button></div>{theme.glossary.slice(0, 3).map((item) => <div className={layout.railEntry} key={item.term}><b>{item.term}</b><p>{item.definition}</p></div>)}</section>
    <section><div className={layout.railTitle}><img className={layout.miniAvatar} src="/images/rocio-profesora-ia.png" alt="Rocío" /><h3>Rocío</h3><small>Profesora IA</small></div><p>Pregunta tus dudas sobre este tema y repasa sus ideas esenciales.</p><button className={layout.railAction} onClick={() => onSelect("rocio")}>Hablar con Rocío</button></section>
    <section><div className={layout.railTitle}><img className={layout.miniAvatar} src="/images/fernando-tutor-ia.png" alt="Fernando" /><h3>Fernando</h3><small>Tutor IA</small></div><p>Organiza tu estudio, tu progreso y el siguiente paso del itinerario.</p><button className={layout.railAction} onClick={() => onSelect("fernando")}>Planificar con Fernando</button></section>
    <section><div className={layout.railTitle}><span>✓</span><h3>Simulacro</h3><small>20 de 50</small></div><p>Practica con 20 preguntas aleatorias del banco del tema.</p><button className={layout.railAction} onClick={() => onSelect("test")}>Comenzar simulacro</button></section>
  </aside>;
}

function QuickTest({ questions }: { questions: TestQuestion[] }) {
  const [attempt, setAttempt] = useState(0);
  const sample = useMemo(() => {
    const shuffled = [...questions];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled.slice(0, 20);
  }, [questions, attempt]);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = position >= sample.length;
  const question = sample[position];

  if (!sample.length) return <p>El test de este tema está en preparación.</p>;
  if (finished) return <div className={styles.result}><span>✓</span><h2>Simulacro terminado</h2><p>Has acertado {score} de {sample.length} preguntas.</p><button onClick={() => { setAttempt((value) => value + 1); setPosition(0); setSelected(null); setScore(0); }}>Nuevo simulacro</button></div>;

  const choose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.answer) setScore((value) => value + 1);
  };

  return <div className={styles.test}>
    <div className={styles.testHead}><div><p className={styles.sectionLabel}>SIMULACRO · 20 PREGUNTAS ALEATORIAS</p><h2>Comprueba lo aprendido</h2><small>Banco disponible: {questions.length} preguntas</small></div><b>{position + 1} / {sample.length}</b></div>
    <h3>{question.question}</h3>
    <div className={styles.options}>{question.options.map((option, index) => <button key={option} disabled={selected !== null} onClick={() => choose(index)} className={selected === null ? "" : index === question.answer ? styles.correct : index === selected ? styles.incorrect : ""}><b>{String.fromCharCode(65 + index)}</b><span>{option}</span></button>)}</div>
    {selected !== null && <div className={styles.feedback}><strong>{selected === question.answer ? "Correcto." : "Vamos a revisarlo."}</strong> {question.explanation}<button onClick={() => { setPosition((value) => value + 1); setSelected(null); }}>{position + 1 === sample.length ? "Ver resultado" : "Siguiente pregunta"}</button></div>}
  </div>;
}
