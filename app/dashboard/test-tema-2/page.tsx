"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { BADGES } from "../../../lib/badges";
import { canAccessTopic } from "@/lib/topic-access";

const data = require("../../data/historia/tema02_test.json");

export default function TestTema2Page() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<{
    correct: number;
    total: number;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      const userBadges = data?.map((item) => item.badge_id) ?? [];
      const canAccess = canAccessTopic("tema-2", userBadges);

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
        <p>Necesitas desbloquear primero el Tema 2.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1>Test Tema 2</h1>

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
                    disabled={showResults || saving}
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
          disabled={saving}
          onClick={async () => {
            setSaving(true);

            let correct = 0;

            data.questions.forEach((q: any) => {
              if (answers[q.id] === q.correctAnswer) {
                correct++;
              }
            });

            const result = {
              correct,
              total: data.questions.length,
            };

            setScore(result);
            setShowResults(true);

            localStorage.setItem("tema-02", JSON.stringify(result));

            if (correct / data.questions.length >= 0.8) {
              const { data: userData } = await supabase.auth.getUser();
              const user = userData?.user;

              if (!user) {
                setSaving(false);
                return;
              }

              await supabase.from("user_badges").upsert(
                {
                  user_id: user.id,
                  badge_id: "test_tema2_80",
                },
                { onConflict: "user_id,badge_id" }
              );

              const badgeTitle =
                BADGES["test_tema2_80" as keyof typeof BADGES]?.title ||
                "Insignia conseguida";

              setTimeout(() => {
                alert(`🎉 ${badgeTitle}\n\nTema 3 desbloqueado.`);
              }, 100);
            }

            setSaving(false);
          }}
        >
          {saving ? "Guardando..." : "Enviar respuestas"}
        </button>
      )}

      {score && (
        <>
          <p style={{ marginTop: "20px" }}>
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