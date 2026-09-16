"use client";

import Link from "next/link";
import { useState } from "react";
import OppositionAlertDialog from "./OppositionAlertDialog";
import styles from "@/app/banco-opositores/banco.module.css";

type Recommendation = { id: string; slug: string; title: string; compatibility: number; reasons: string[] };

export default function OppositionDetailActions({
  callId,
  callTitle,
  territory,
}: {
  callId: string;
  callTitle: string;
  territory: string;
}) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  async function askFernando() {
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("/api/banco-opositores/fernando", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preparation: callTitle, territory }),
      });
      const result = (await response.json()) as { answer?: string; recommendations?: Recommendation[]; error?: string };
      if (!response.ok) throw new Error(result.error || "No se pudo consultar a Fernando.");
      setAnswer(result.answer ?? "");
      setRecommendations((result.recommendations ?? []).filter((item) => item.id !== callId).slice(0, 3));
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "No se pudo consultar a Fernando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className={styles.outlineButton} type="button" onClick={() => setAlertOpen(true)}>♡ Avísame de novedades</button>
      <button className={styles.primaryButton} type="button" onClick={askFernando} disabled={loading}>
        {loading ? "Comparando…" : "Consultar a Fernando"}
      </button>
      {answer && <div className={styles.fernandoAnswer}><p>{answer}</p>{recommendations.map((item) => <article key={item.id}><div><b>{item.title}</b>{item.reasons.map((reason) => <small key={reason}>{reason}</small>)}</div><strong>{item.compatibility}%</strong><Link href={`/banco-opositores/convocatoria/${item.slug}`}>Ver ficha</Link></article>)}</div>}
      <OppositionAlertDialog open={alertOpen} onClose={() => setAlertOpen(false)} callId={callId} callTitle={callTitle} />
    </>
  );
}
