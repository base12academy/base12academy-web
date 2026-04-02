"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { historiaTests } from "@/src/data/historia/tests/index";
import { BADGES } from "@/lib/badges";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export default function TestPage() {
  const [tema, setTema] = useState("tema-1");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setTema(params.get("tema") || "tema-1");
}, []);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [testVersion, setTestVersion] = useState(0);

 const [questions, setQuestions] = useState<Question[]>([]);

useEffect(() => {
  const allQuestions = historiaTests[tema as keyof typeof historiaTests] || [];
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  setQuestions(shuffled.slice(0, 20));
}, [tema, testVersion]);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    loadUser();
  }, []);

  useEffect(() => {
    setAnswers({});
    setScore(null);
    setShowResults(false);
    setShowSuccess(false);
  }, [tema]);

  useEffect(() => {
    const saved = localStorage.getItem("historia-badges");
    if (saved) setEarnedBadges(JSON.parse(saved));
  }, []);

  const handleSubmit = async () => {
    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });

    const handleReset = () => {
  setAnswers({});
  setScore(null);
  setShowResults(false);
  setShowSuccess(false);
  setNewBadge(null);
  setTestVersion((prev) => prev + 1);
};

    const percentage =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    setScore(percentage);
    setShowResults(true);

    // 🔥 GUARDAR PROGRESO EN SUPABASE
if (userId) {
  const { error } = await supabase.from("intentos_test").insert({
    usuario_id: userId,
    tema_id: Number(tema.split("-")[1]),
    score: percentage,
    tiempo_total: 0,
    fecha: new Date().toISOString(),
  });

  if (error) {
    alert("Error guardando intento: " + error.message);
  }
}

if (userId) {
  const { data: intentos } = await supabase
    .from("intentos_test")
    .select("*")
    .eq("usuario_id", userId)
    .eq("tema_id", Number(tema.split("-")[1]));

  const aprobados = intentos?.filter((i) => i.score >= 80).length || 0;

if (aprobados >= 5) {
  setShowSuccess(true);

  const siguienteTema = `tema-${Number(tema.split("-")[1]) + 1}`;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("temas_activos")
    .eq("user_id", userId)
    .maybeSingle();

  const actuales = perfil?.temas_activos || [];

  if (!actuales.includes(siguienteTema)) {
    await supabase
      .from("perfiles")
      .update({
        temas_activos: [...actuales, siguienteTema],
      })
      .eq("user_id", userId);
  }
}
}

    // 🔥 MEDALLAS
    let newBadges = [...earnedBadges];

    if (percentage >= 80 && !newBadges.includes("primer_test_aprobado")) {
      newBadges.push("primer_test_aprobado");
    }

    if (tema === "tema-1" && percentage >= 80 && !newBadges.includes("test_tema1_80")) {
      newBadges.push("test_tema1_80");
    }

    
    setEarnedBadges(newBadges);
    localStorage.setItem("historia-badges", JSON.stringify(newBadges));

    // 🔥 GUARDAR MEDALLAS EN SUPABASE
    if (userId) {
      for (const badgeId of newBadges) {
        await supabase.from("insignias_historia").upsert({
          user_id: userId,
          badge_id: badgeId,
        });
      }
    }

        const lastBadge = newBadges[newBadges.length - 1];
    if (lastBadge && !earnedBadges.includes(lastBadge)) {
      setNewBadge(lastBadge);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
    setShowResults(false);
    setShowSuccess(false);
  };

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Test {tema}</h1>

      {questions.length === 0 ? (
        <p>No hay preguntas para este tema</p>
      ) : (
        <>
          {questions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: "20px" }}>
              <p>
                <strong>
                  {index + 1}. {q.question}
                </strong>
              </p>

              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctAnswer;
                const isSelected = answers[q.id] === i;

                let color = "black";

                if (showResults) {
                  if (isCorrect) color = "green";
                  if (isSelected && !isCorrect) color = "red";
                }

                return (
                  <div key={i}>
                    <label style={{ color }}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === i}
                        disabled={showResults}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.id]: i,
                          }))
                        }
                      />
                      {opt}
                    </label>
                  </div>
                );
              })}
            </div>
          ))}

          {!showResults ? (
            <button onClick={handleSubmit}>Corregir</button>
          ) : (
            <>
              <h2>Resultado: {score}%</h2>

              {showSuccess && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "#dcfce7",
                    border: "1px solid #16a34a",
                    borderRadius: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  🎉 ¡Tema superado!
                </div>
              )}

              {showSuccess && (
                <p style={{ color: "green" }}>
                  ✔ Has desbloqueado el siguiente tema
                </p>
              )}

              {showSuccess && (
                <div style={{ marginTop: "16px" }}>
                  <a
                    href={`/dashboard/tema/tema-${Number(tema.split("-")[1]) + 1}`}
                    style={{
                      display: "inline-block",
                      padding: "12px 16px",
                      background: "#2563eb",
                      color: "white",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    ➡️ Ir al siguiente tema
                  </a>
                </div>
              )}

              <button onClick={handleReset}>Repetir</button>
            </>
          )}

          {earnedBadges.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <h3>Medallas</h3>

              {earnedBadges.map((id) => {
                const badge = BADGES[id as keyof typeof BADGES];
                if (!badge) return null;

                return (
                  <div
                    key={id}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    🏅 <strong>{badge.title}</strong>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      {badge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {newBadge && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                background: "#111827",
                color: "white",
                padding: "16px",
                borderRadius: "12px",
              }}
            >
              🏅 Nueva medalla:{" "}
              {BADGES[newBadge as keyof typeof BADGES]?.title}
            </div>
          )}
        </>
      )}
    </div>
  );
}