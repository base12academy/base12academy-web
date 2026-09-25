"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { trainingTests, type TrainingTestSlug } from "@/lib/training-config";
import styles from "./TrainingCarlosChat.module.css";

type Message = { role: "user" | "carlos"; text: string };

export default function TrainingCarlosChat() {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState<TrainingTestSlug>("flexiones");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setAvailable(Boolean(data.session)));
  }, []);

  async function askCarlos(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion || loading) return;

    setMessages((current) => [...current, { role: "user", text: cleanQuestion }]);
    setQuestion("");
    setLoading(true);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setMessages((current) => [...current, { role: "carlos", text: "Tu sesión ha caducado. Vuelve a iniciar sesión para preguntarme." }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/training/carlos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ test, question: cleanQuestion }),
      });
      const body = await response.json().catch(() => ({}));
      setMessages((current) => [...current, {
        role: "carlos",
        text: response.ok && body.answer ? body.answer : "No he podido responder ahora. Inténtalo de nuevo en unos minutos.",
      }]);
    } catch {
      setMessages((current) => [...current, { role: "carlos", text: "No he podido conectar ahora. Inténtalo de nuevo en unos minutos." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!available) return null;

  return <div className={styles.wrapper}>
    {open && <section className={styles.panel} aria-label="Preguntar a Carlos">
      <div className={styles.heading}>
        <div><strong>Carlos</strong><span>Entrenador IA de Training</span></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar conversación">×</button>
      </div>
      <div className={styles.messages} aria-live="polite">
        {messages.length === 0 && <p className={styles.intro}>Pregúntame por una prueba física o por el nombre y uso de cualquiera de los ejercicios de Training.</p>}
        {messages.map((message, index) => <p className={message.role === "user" ? styles.userMessage : styles.carlosMessage} key={`${message.role}-${index}`}>{message.text}</p>)}
        {loading && <p className={styles.carlosMessage}>Estoy revisando tu pregunta…</p>}
      </div>
      <form className={styles.form} onSubmit={askCarlos}>
        <label htmlFor="carlos-test">Prueba</label>
        <select id="carlos-test" value={test} onChange={(event) => setTest(event.target.value as TrainingTestSlug)}>
          {trainingTests.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
        </select>
        <label htmlFor="carlos-question">Tu pregunta</label>
        <textarea id="carlos-question" maxLength={800} required rows={3} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ej.: ¿Qué es el Bird-Dog y para qué sirve en la plancha?" />
        <button type="submit" disabled={loading || !question.trim()}>{loading ? "Pensando…" : "Preguntar"}</button>
      </form>
      <p className={styles.safety}>Si tienes dolor o una lesión, detén el ejercicio y consulta a un profesional sanitario.</p>
    </section>}
    <button className={styles.trigger} type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
      {open ? "Cerrar Carlos" : "Preguntar a Carlos"}
    </button>
  </div>;
}
