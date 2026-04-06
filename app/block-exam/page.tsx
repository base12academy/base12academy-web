"use client";

import { useState } from "react";

type ShortQuestion = {
  id: string;
  question: string;
  answerGuide: string;
  keywords: string[];
  topicSlug: string;
};

type SourceData = {
  source_type: "image" | "text";
  title: string | null;
  description: string | null;
  content: string | null;
  asset_url: string | null;
  explicacion: string;
};

type DevelopmentData = {
  slug: string;
  titulo: string;
  descripcion: string;
};

type GeneratedExam = {
  blockId: string;
  selectedTopicSlugs: string[];
  shortQuestions: ShortQuestion[];
  source: SourceData;
  development: DevelopmentData;
};

type SubmitResult = {
  saved: boolean;
  attemptId: string;
  short: number;
  source: number;
  development: number;
  total: number;
  passed: boolean;
  blockUpdated: boolean;
  attemptsCount: number;
  bestScore: number;
};

const styles = {
  page: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "32px 20px 80px",
    fontFamily: "Arial, sans-serif",
    color: "#14213d",
  },
  hero: {
    border: "1px solid #d9e2f2",
    borderRadius: "20px",
    padding: "24px",
    background: "#f8fbff",
    marginBottom: "24px",
  },
  title: {
    fontSize: "34px",
    margin: 0,
    marginBottom: "8px",
  },
  subtitle: {
    margin: 0,
    color: "#4a5a7a",
    lineHeight: 1.5,
  },
  primaryButton: {
    padding: "14px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#1d4ed8",
    color: "white",
    fontSize: "16px",
    fontWeight: 700 as const,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "14px 20px",
    borderRadius: "12px",
    border: "1px solid #c7d2e5",
    background: "white",
    color: "#14213d",
    fontSize: "16px",
    fontWeight: 700 as const,
    cursor: "pointer",
  },
  error: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "#fff1f2",
    color: "#b42318",
    border: "1px solid #fecdd3",
  },
  section: {
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "24px",
    background: "white",
    marginBottom: "22px",
  },
  sectionTitle: {
    fontSize: "24px",
    marginTop: 0,
    marginBottom: "18px",
  },
  questionCard: {
    border: "1px solid #e7edf6",
    borderRadius: "14px",
    padding: "18px",
    background: "#fcfdff",
    marginBottom: "16px",
  },
  questionLabel: {
    fontSize: "18px",
    fontWeight: 700 as const,
    marginBottom: "10px",
    display: "block",
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    lineHeight: 1.5,
    boxSizing: "border-box" as const,
  },
  sourceNote: {
    marginTop: "10px",
    marginBottom: "16px",
    color: "#4a5a7a",
  },
  developmentBox: {
    padding: "16px",
    borderRadius: "14px",
    background: "#f8fbff",
    border: "1px solid #d9e2f2",
    marginBottom: "14px",
  },
  resultBox: {
    border: "1px solid #d9e2f2",
    borderRadius: "18px",
    padding: "24px",
    background: "#f8fbff",
    marginTop: "20px",
  },
  badgePass: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#ecfdf3",
    color: "#027a48",
    fontWeight: 700 as const,
    border: "1px solid #abefc6",
  },
  badgeFail: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#fff1f2",
    color: "#b42318",
    fontWeight: 700 as const,
    border: "1px solid #fecdd3",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginTop: "16px",
  },
  statCard: {
    border: "1px solid #d9e2f2",
    borderRadius: "14px",
    padding: "16px",
    background: "white",
  },
  statLabel: {
    fontSize: "13px",
    color: "#4a5a7a",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700 as const,
  },
};

export default function BlockExamPage() {
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string>("");

  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [sourceAnswer, setSourceAnswer] = useState("");
  const [developmentAnswer, setDevelopmentAnswer] = useState("");

  async function handleGenerateExam() {
    setLoadingExam(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate-block-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockId: "bloque-1",
          selectedTopicSlugs: ["tema-3"],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al generar el examen");
        setLoadingExam(false);
        return;
      }

      setExam(data);
      setShortAnswers({});
      setSourceAnswer("");
      setDevelopmentAnswer("");
    } catch {
      setError("Error al generar el examen");
    } finally {
      setLoadingExam(false);
    }
  }

  function updateShortAnswer(questionId: string, value: string) {
    setShortAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  async function handleSubmitExam() {
    if (!exam) return;

    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/submit-block-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "11111111-1111-1111-1111-111111111111",
          blockId: exam.blockId,
          topicSlug: exam.development.slug,
          shortAnswers,
          sourceAnswer,
          sourceExpectedContent: exam.source.explicacion || "",
          developmentAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar el examen");
        setSubmitting(false);
        return;
      }

      setResult(data);
    } catch {
      setError("Error al enviar el examen");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Examen de bloque</h1>
        <p style={styles.subtitle}>
          Completa las preguntas cortas, el comentario de fuente y el tema de
          desarrollo. Necesitas un mínimo de 8 sobre 10 para superar el bloque.
        </p>

        {!exam && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleGenerateExam}
              disabled={loadingExam}
              style={styles.primaryButton}
            >
              {loadingExam ? "Generando examen..." : "Generar examen"}
            </button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>

      {exam && (
        <>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Preguntas cortas</h2>

            {exam.shortQuestions.map((q, index) => (
              <div key={q.id} style={styles.questionCard}>
                <label style={styles.questionLabel}>
                  {index + 1}. {q.question}
                </label>

                <input
                  type="text"
                  value={shortAnswers[q.id] || ""}
                  onChange={(e) => updateShortAnswer(q.id, e.target.value)}
                  style={styles.input}
                  placeholder="Escribe una respuesta breve"
                />
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Comentario de fuente</h2>

            {exam.source.source_type === "image" && exam.source.asset_url && (
              <div style={{ marginBottom: "14px" }}>
                <img
                  src={exam.source.asset_url}
                  alt={exam.source.title || "Fuente histórica"}
                  style={{
                    width: "100%",
                    maxWidth: 820,
                    display: "block",
                    borderRadius: "14px",
                  }}
                />
              </div>
            )}

            {exam.source.source_type === "text" && exam.source.content && (
              <div
                style={{
                  marginBottom: "14px",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                  background: "#f8fbff",
                  border: "1px solid #d9e2f2",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                {exam.source.content}
              </div>
            )}

            <p style={styles.sourceNote}>
              Realiza un comentario histórico en unas 20 líneas.
            </p>

            <textarea
              value={sourceAnswer}
              onChange={(e) => setSourceAnswer(e.target.value)}
              rows={10}
              style={styles.textarea}
              placeholder="Escribe aquí tu comentario de fuente"
            />
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Tema de desarrollo</h2>

            <div style={styles.developmentBox}>
              <p style={{ marginTop: 0, marginBottom: "8px", fontWeight: 700 }}>
                {exam.development.titulo}
              </p>
              <p style={{ margin: 0, color: "#4a5a7a" }}>
                {exam.development.descripcion}
              </p>
            </div>

            <textarea
              value={developmentAnswer}
              onChange={(e) => setDevelopmentAnswer(e.target.value)}
              rows={14}
              style={styles.textarea}
              placeholder="Desarrolla aquí el tema"
            />
          </section>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              style={styles.primaryButton}
            >
              {submitting ? "Entregando examen..." : "Entregar examen"}
            </button>

            <button
              onClick={handleGenerateExam}
              disabled={loadingExam}
              style={styles.secondaryButton}
            >
              Generar otro examen
            </button>
          </div>
        </>
      )}

      {result && (
        <div style={styles.resultBox}>
          <h2 style={{ marginTop: 0 }}>Resultado</h2>

          <div style={result.passed ? styles.badgePass : styles.badgeFail}>
            {result.passed ? "Bloque superado" : "Bloque no superado"}
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Preguntas cortas</div>
              <div style={styles.statValue}>{result.short} / 3</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Comentario de fuente</div>
              <div style={styles.statValue}>{result.source} / 4</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Desarrollo</div>
              <div style={styles.statValue}>{result.development} / 3</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Nota total</div>
              <div style={styles.statValue}>{result.total} / 10</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Intentos del bloque</div>
              <div style={styles.statValue}>{result.attemptsCount}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Mejor nota</div>
              <div style={styles.statValue}>{result.bestScore}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}