"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./TropaAssessmentPage.module.css";

type Kind = "simulacros" | "operations";
type Item = { id: string; title: string; detail: string };
type Question = { question_id: string; aptitude_slug: string; prompt: string; options: Record<string, string>; level: number };
type Result = { score: number; total: number; results: { questionId: string; correct: boolean; correctOption: string; explanation: string }[] };

async function authFetch(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("login_required");
  return fetch(path, { ...init, headers: { "Content-Type": "application/json", ...init?.headers, Authorization: `Bearer ${token}` } });
}

export default function TropaAssessmentPage({ kind }: { kind: Kind }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const endpoint = kind === "simulacros" ? "/api/tropa/simulacros" : "/api/tropa/operations";

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await authFetch(endpoint);
        if (!response.ok) throw new Error("unavailable");
        const body = await response.json();
        if (!active) return;
        if (kind === "simulacros") {
          setItems((body.simulacros ?? []).map((item: Record<string, unknown>) => ({
            id: String(item.simulacro_id),
            title: String(item.title),
            detail: `${Number(item.questions_total || 105)} preguntas · 7 aptitudes`,
          })));
        } else {
          setItems((body.forms ?? []).map((item: Record<string, unknown>) => ({
            id: String(item.form_code),
            title: String(item.destination_name || item.operation_code || item.sea_trial_code || item.form_code),
            detail: `${String(item.usage_type || "Entrenamiento")} · ${String(item.difficulty || "")} · 105 preguntas`,
          })));
        }
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    })();
    return () => { active = false; };
  }, [endpoint, kind]);

  async function openItem(item: Item) {
    setBusy(true);
    try {
      const key = kind === "simulacros" ? "id" : "form";
      const response = await authFetch(`${endpoint}?${key}=${encodeURIComponent(item.id)}`);
      if (!response.ok) throw new Error("unavailable");
      const body = await response.json();
      setSelected(item);
      setQuestions((body.questions ?? []) as Question[]);
      setPosition(0);
      setAnswers({});
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  function choose(letter: string) {
    const question = questions[position];
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.question_id]: letter }));
  }

  async function submit() {
    if (!selected || Object.keys(answers).length !== questions.length) return;
    setBusy(true);
    try {
      const payload = kind === "simulacros"
        ? { simulacroId: selected.id, answers }
        : { formCode: selected.id, answers };
      const response = await authFetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("submit_failed");
      setResult(await response.json() as Result);
    } finally {
      setBusy(false);
    }
  }

  const question = questions[position];
  const selectedAnswer = question ? answers[question.question_id] : null;
  return (
    <div className={styles.page}>
      <header className={styles.header}><Link href="/"><Image src="/images/base12-logo.png" alt="Base12 Academy" width={126} height={58} /></Link><Link href="/dashboard/tropa-y-marineria">Centro de operaciones</Link></header>
      <main className={styles.main}>
        <section className={styles.hero}><p>Tropa y Marinería</p><h1>{kind === "simulacros" ? "Simulacros auditados" : "Operaciones y Pruebas de Mar"}</h1><span>{kind === "simulacros" ? "20 pruebas de 7 × 15 preguntas" : "15 formas de entrenamiento operativo"}</span></section>
        {status === "loading" && <p className={styles.notice}>Cargando contenido…</p>}
        {status === "error" && <p className={styles.notice}>No se ha podido abrir este contenido o tu matrícula no lo incluye.</p>}
        {status === "ready" && !selected && <section className={styles.grid}>{items.map((item) => <article key={item.id}><span>{item.id}</span><h2>{item.title}</h2><p>{item.detail}</p><button type="button" disabled={busy} onClick={() => void openItem(item)}>Comenzar</button></article>)}</section>}
        {selected && question && !result && (
          <section className={styles.runner}>
            <div><button type="button" className={styles.back} onClick={() => setSelected(null)}>← Volver</button><span>{selected.title} · {position + 1}/{questions.length} · {question.aptitude_slug} · N{question.level}</span></div>
            <h2>{question.prompt}</h2>
            <div className={styles.options}>{Object.entries(question.options).map(([letter, text]) => <button key={letter} type="button" className={selectedAnswer === letter ? styles.selectedAnswer : ""} onClick={() => choose(letter)}><b>{letter}</b>{text}</button>)}</div>
            <footer>{position > 0 && <button type="button" onClick={() => setPosition((current) => current - 1)}>Anterior</button>}{position + 1 < questions.length ? <button type="button" disabled={!selectedAnswer} onClick={() => setPosition((current) => current + 1)}>Siguiente</button> : <button type="button" disabled={!selectedAnswer || busy} onClick={() => void submit()}>Corregir y guardar</button>}</footer>
          </section>
        )}
        {result && <section className={styles.result}><h2>{result.score} de {result.total}</h2><p>Resultado guardado en tu progreso de Tropa y Marinería.</p><button type="button" onClick={() => setSelected(null)}>Elegir otra prueba</button></section>}
      </main>
    </div>
  );
}
