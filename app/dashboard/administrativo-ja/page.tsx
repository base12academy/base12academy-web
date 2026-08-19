"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import data from "@/lib/administrativo-ja-content.json";
import { supabase } from "@/lib/supabaseClient";
import styles from "./administrativo-ja.module.css";

type Tab = "explicacion" | "glosario" | "rocio" | "test";
type TestQuestion = { question: string; options: string[]; answer: number; explanation: string };

export default function AdministrativoJaPage() {
  return <Suspense fallback={<div className={styles.loading}>Preparando el aula…</div>}><Course /></Suspense>;
}

function Course() {
  const params = useSearchParams();
  const requested = (params.get("tema") || "T01").toUpperCase();
  const theme = data.themes.find((item) => item.id === requested) || data.themes[0];
  const [tab, setTab] = useState<Tab>("explicacion");
  const [allowed, setAllowed] = useState(theme.publicPreview);
  const [access, setAccess] = useState(theme.publicPreview ? "public_preview" : "checking");

  useEffect(() => {
    let active = true;
    setTab("explicacion");
    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(`/api/course-access?course=administrativo-ja&lesson=${theme.id}`, {
        headers: sessionData.session?.access_token ? { Authorization: `Bearer ${sessionData.session.access_token}` } : {},
      });
      const result = await response.json().catch(() => ({}));
      if (active) {
        setAllowed(Boolean(result.allowed));
        setAccess(result.access || "subscription_required");
      }
    };
    check();
    return () => { active = false; };
  }, [theme.id]);

  const progress = Math.round((theme.number / data.themes.length) * 100);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}><strong>B12</strong><span>Base12<br />Academy</span></Link>
        <p className={styles.eyebrow}>OPOSICIONES · JUNTA DE ANDALUCÍA</p>
        <h2>Administrativo/a</h2>
        <div className={styles.progressText}><span>Progreso del temario</span><b>{progress}%</b></div>
        <div className={styles.progress}><span style={{ width: `${progress}%` }} /></div>
        <p className={styles.indexTitle}>ÍNDICE DEL TEMARIO · 42 TEMAS</p>
        <nav className={styles.index}>
          {data.themes.map((item) => (
            <Link key={item.id} href={`/dashboard/administrativo-ja?tema=${item.id}`} className={item.id === theme.id ? styles.active : ""}>
              <span>{item.number}</span><span>{item.title}</span>{item.publicPreview && <small>ABIERTO</small>}
            </Link>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.topline}>
          <span>Temario / Tema {theme.number}</span>
          <b>{access === "administrator" ? "Vista de administrador" : access === "public_preview" ? "Tema abierto" : "Aula Base12"}</b>
        </div>
        <p className={styles.kicker}>TEMA {theme.number} DE 42</p>
        <h1>{theme.title}</h1>
        <p className={styles.subtitle}>Administrativo/a de la Junta de Andalucía</p>

        {!allowed ? (
          <section className={styles.locked}>
            <div className={styles.lockIcon}>🔒</div>
            <div><h2>Este tema requiere matrícula</h2><p>El Tema 1 está abierto para que conozcas el aula. Inicia sesión con una matrícula activa para continuar.</p></div>
            <div className={styles.lockActions}><Link href="/dashboard/administrativo-ja?tema=T01">Ver el Tema 1</Link><Link href="/#catalogo">Ver modalidades</Link></div>
          </section>
        ) : (
          <>
            <section className={styles.videoCard}>
              <iframe src={`${theme.videoUrl}?rel=0`} title={`Vídeo del tema ${theme.number}: ${theme.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </section>

            <div className={styles.tabs} role="tablist" aria-label="Recursos del tema">
              {(["explicacion", "glosario", "rocio", "test"] as Tab[]).map((name) => (
                <button key={name} onClick={() => setTab(name)} className={tab === name ? styles.selectedTab : ""}>
                  <span>{name === "explicacion" ? "▤" : name === "glosario" ? "◫" : name === "rocio" ? "✦" : "✓"}</span>
                  {name === "explicacion" ? "Explicación" : name === "glosario" ? "Glosario" : name === "rocio" ? "Profesora IA" : "Test rápido"}
                </button>
              ))}
            </div>

            <section className={styles.contentCard}>
              {tab === "explicacion" && <><p className={styles.sectionLabel}>EXPLICACIÓN DEL TEMA</p><h2>{theme.title}</h2><div className={styles.pre}>{theme.explanation}</div></>}
              {tab === "glosario" && <Glossary items={theme.glossary} />}
              {tab === "rocio" && <Rocio items={theme.rocio} />}
              {tab === "test" && <QuickTest questions={theme.tests as TestQuestion[]} />}
            </section>
          </>
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
  return <><p className={styles.sectionLabel}>ROCÍO · PROFESORA IA</p><h2>Repasa las ideas esenciales</h2><p>Abre cada pregunta para comprobar tu respuesta.</p><div className={styles.qa}>{items.map((item, index) => <article key={item.question}><button onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span><b>{open === index ? "−" : "+"}</b></button>{open === index && <p>{item.answer}</p>}</article>)}</div></>;
}

function QuickTest({ questions }: { questions: TestQuestion[] }) {
  const sample = useMemo(() => questions.slice(0, 7), [questions]);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = position >= sample.length;
  const question = sample[position];

  if (!sample.length) return <p>El test de este tema está en preparación.</p>;
  if (finished) return <div className={styles.result}><span>✓</span><h2>Test terminado</h2><p>Has acertado {score} de {sample.length} preguntas.</p><button onClick={() => { setPosition(0); setSelected(null); setScore(0); }}>Repetir test</button></div>;

  const choose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.answer) setScore((value) => value + 1);
  };

  return <div className={styles.test}>
    <div className={styles.testHead}><div><p className={styles.sectionLabel}>TEST RÁPIDO</p><h2>Comprueba lo aprendido</h2></div><b>{position + 1} / {sample.length}</b></div>
    <h3>{question.question}</h3>
    <div className={styles.options}>{question.options.map((option, index) => <button key={option} disabled={selected !== null} onClick={() => choose(index)} className={selected === null ? "" : index === question.answer ? styles.correct : index === selected ? styles.incorrect : ""}><b>{String.fromCharCode(65 + index)}</b><span>{option}</span></button>)}</div>
    {selected !== null && <div className={styles.feedback}><strong>{selected === question.answer ? "Correcto." : "Vamos a revisarlo."}</strong> {question.explanation}<button onClick={() => { setPosition((value) => value + 1); setSelected(null); }}>{position + 1 === sample.length ? "Ver resultado" : "Siguiente pregunta"}</button></div>}
  </div>;
}
