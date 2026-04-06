"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type ShortQuestion = {
  id: string;
  question: string;
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
  shortQuestions?: ShortQuestion[];
  source?: SourceData;
  development?: DevelopmentData;
};

type Result = {
  total: number;
  passed: boolean;
  attemptsCount: number;
  passedCount: number;
  fullyCompleted: boolean;
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
    opacity: 1,
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

export default function FinalExamPage() {
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [sourceAnswer, setSourceAnswer] = useState("");
  const [developmentAnswer, setDevelopmentAnswer] = useState("");
  const [selectedTopicSlugs, setSelectedTopicSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
  setBlocked(false);
  setExam(null);
  setResult(null);
  setSelectedTopicSlugs(null);
  setError("Debes iniciar sesión para acceder al examen final");
  return;
}

        const { data: perfil } = await supabase
  .from("perfiles")
  .select("temas_activos")
  .eq("user_id", user.id)
  .maybeSingle();

        if (!perfil) {
  setError("Todavía no tienes un perfil de alumno preparado");
  setSelectedTopicSlugs([]);
} else if (!perfil.temas_activos || perfil.temas_activos.length === 0) {
  setError("Todavía no tienes temas activos guardados");
  setSelectedTopicSlugs([]);
} else {
  setError("");
  setSelectedTopicSlugs(perfil.temas_activos);
}

        const res = await fetch("/api/final-exam-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await res.json();

if (data.blocked) {
  setBlocked(true);
  setError("");
}

      } catch {
        setError("Error cargando datos");
      } finally {
        setChecking(false);
      }
    }

    load();
  }, []);

  async function generateExam() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setError("Debes iniciar sesión para acceder al examen final");
        return;
      }

      if (selectedTopicSlugs === null) {
  setError("Todavía se están cargando tus temas");
  return;
}

if (selectedTopicSlugs.length === 0) {
  setError("No tienes temas activos guardados");
  return;
}

      const res = await fetch("/api/generate-final-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          selectedTopicSlugs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al generar examen");
        return;
      }

      if (data.blocked && data.redirectTo) {
        window.location.href = data.redirectTo;
        return;
      }

      setExam(data);
      setShortAnswers({});
      setSourceAnswer("");
      setDevelopmentAnswer("");
    } catch {
      setError("Error generando examen");
    } finally {
      setLoading(false);
    }
  }

  function updateShort(id: string, value: string) {
    setShortAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function submitExam() {
    if (!exam) return;

    setError("");
    setResult(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
  setSelectedTopicSlugs(null);
  setError("Debes iniciar sesión para acceder al examen final");
  return;
}

      const res = await fetch("/api/submit-final-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          selectedTopicSlugs,
          topicSlug: exam.development?.slug,
          shortAnswers,
          sourceAnswer,
          sourceExpectedContent: exam.source?.explicacion || "",
          developmentAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar examen");
        return;
      }

      setResult(data);
    } catch {
      setError("Error enviando examen");
    }
  }

  if (checking) {
    return <div style={{ padding: 24 }}>Cargando...</div>;
  }

  if (blocked) {
    return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Examen final completado</h1>
          <p style={styles.subtitle}>
            Ya has alcanzado el límite de intentos o has superado las pruebas
            finales.
          </p>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => (window.location.href = "/exam-strategy")}
              style={styles.primaryButton}
            >
              Ver recomendaciones finales
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Examen final</h1>
        <p style={styles.subtitle}>
          Realiza el examen completo. Necesitas aprobar 3 pruebas finales con un
          máximo de 6 intentos.
        </p>

        {!exam && !error && (
  <div style={{ marginTop: "20px" }}>
    <button
      onClick={generateExam}
      style={styles.primaryButton}
      disabled={loading || selectedTopicSlugs === null}
    >
      {loading
        ? "Generando examen final..."
        : selectedTopicSlugs === null
        ? "Cargando temas..."
        : "Generar examen final"}
    </button>
  </div>
)}

        {error && <div style={styles.error}>{error}</div>}
      </div>

      {exam && (
        <>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Preguntas cortas</h2>

            {Array.isArray(exam.shortQuestions) &&
              exam.shortQuestions.map((q, index) => (
                <div key={q.id} style={styles.questionCard}>
                  <label style={styles.questionLabel}>
                    {index + 1}. {q.question}
                  </label>

                  <input
                    value={shortAnswers[q.id] || ""}
                    onChange={(e) => updateShort(q.id, e.target.value)}
                    style={styles.input}
                    placeholder="Escribe una respuesta breve"
                  />
                </div>
              ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Comentario de fuente</h2>

            {exam.source?.source_type === "image" && exam.source.asset_url && (
              <img
                src={exam.source.asset_url}
                alt={exam.source.title || "Fuente histórica"}
                style={{
                  width: "100%",
                  maxWidth: 820,
                  borderRadius: "14px",
                  marginBottom: "14px",
                }}
              />
            )}

            {exam.source?.source_type === "text" && exam.source.content && (
              <div style={styles.developmentBox}>{exam.source.content}</div>
            )}

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
              <strong>{exam.development?.titulo}</strong>
              <p>{exam.development?.descripcion}</p>
            </div>

            <textarea
              value={developmentAnswer}
              onChange={(e) => setDevelopmentAnswer(e.target.value)}
              rows={14}
              style={styles.textarea}
              placeholder="Desarrolla aquí el tema"
            />
          </section>

          <button onClick={submitExam} style={styles.primaryButton}>
            Entregar examen final
          </button>
        </>
      )}

      {result && (
        <div style={styles.resultBox}>
          <h2>Resultado</h2>

          <div style={result.passed ? styles.badgePass : styles.badgeFail}>
            {result.passed ? "Final superada" : "Final no superada"}
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Nota total</div>
              <div style={styles.statValue}>{result.total} / 10</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Intentos</div>
              <div style={styles.statValue}>{result.attemptsCount}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Finales superadas</div>
              <div style={styles.statValue}>{result.passedCount}</div>
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