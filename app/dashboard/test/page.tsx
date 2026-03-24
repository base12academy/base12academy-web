"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { BADGES } from "../../../lib/badges";
import { canAccessTopic } from "@/lib/topic-access";

const data = require("../../data/historia/tema01_test_v2.json");

export default function TestPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔒 BLOQUEO DE ACCESO (como los temas)
  useEffect(() => {
    const checkAccess = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const { data } = user
        ? await supabase
            .from("user_badges")
            .select("badge_id")
            .eq("user_id", user.id)
        : { data: [] as { badge_id: string }[] };

      const userBadges = data?.map((b) => b.badge_id) ?? [];

      // 👇 aquí decides qué test corresponde
      const canAccess = canAccessTopic("tema-1", userBadges);

      setAllowed(canAccess);
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return <div style={{ padding: "32px" }}>Cargando...</div>;
  }

  if (!allowed) {
    return (
      <div style={{ padding: "32px" }}>
        <h1>🔒 Test bloqueado</h1>
        <p>Debes desbloquear el tema primero.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1>Test Tema 1</h1>

      {data.questions.map((q: any) => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          <p>{q.question}</p>

          {q.options.map((opt: string, i: number) => {
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

      {!showResults && (
        <button
          onClick={async () => {
            let correct = 0;

            data.questions.forEach((q: any) => {
              if (answers[q.id] === q.correctAnswer) {
                correct++;
              }
            });

            const result = {
              correct,
              total: data.questions.length,
              answers,
              date: new Date().toISOString(),
            };

            setScore(result);
            setShowResults(true);

            if (correct / data.questions.length >= 0.8) {
              const { data: userData } = await supabase.auth.getUser();
              const user = userData?.user;

              if (!user) return;

              const badges = ["primer_test_aprobado", "test_tema1_80"];

              for (const badgeId of badges) {
                await supabase.from("user_badges").upsert(
                  {
                    user_id: user.id,
                    badge_id: badgeId,
                  },
                  { onConflict: "user_id,badge_id" }
                );
              }

              alert("🎉 Has aprobado. Tema 2 desbloqueado.");
            }
          }}
        >
          Enviar respuestas
        </button>
      )}

      {score && (
        <>
          <p>
            Resultado: {score.correct}/{score.total}
          </p>

          <p>
            {score.correct / score.total >= 0.8
              ? "✅ Tema superado"
              : "❌ Tema no superado"}
          </p>
        </>
      )}
    </div>
  );
}