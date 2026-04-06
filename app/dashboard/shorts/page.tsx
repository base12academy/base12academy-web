"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

import tema1 from "@/src/data/historia/shorts/tema1.json";
import tema2 from "@/src/data/historia/shorts/tema2.json";
import tema3 from "@/src/data/historia/shorts/tema3.json";
import tema4 from "@/src/data/historia/shorts/tema4.json";
import tema5 from "@/src/data/historia/shorts/tema5.json";
import tema6 from "@/src/data/historia/shorts/tema6.json";
import tema7 from "@/src/data/historia/shorts/tema7.json";
import tema8 from "@/src/data/historia/shorts/tema8.json";
import tema9 from "@/src/data/historia/shorts/tema9.json";
import tema10 from "@/src/data/historia/shorts/tema10.json";
import tema11 from "@/src/data/historia/shorts/tema11.json";
import tema12 from "@/src/data/historia/shorts/tema12.json";
import tema13 from "@/src/data/historia/shorts/tema13.json";
import tema14 from "@/src/data/historia/shorts/tema14.json";
import tema15 from "@/src/data/historia/shorts/tema15.json";
import tema16 from "@/src/data/historia/shorts/tema16.json";
import tema17 from "@/src/data/historia/shorts/tema17.json";
import tema18 from "@/src/data/historia/shorts/tema18.json";
import tema18bis from "@/src/data/historia/shorts/tema18bis.json";
import tema19 from "@/src/data/historia/shorts/tema19.json";
import tema20 from "@/src/data/historia/shorts/tema20.json";
import tema21 from "@/src/data/historia/shorts/tema21.json";
import tema22 from "@/src/data/historia/shorts/tema22.json";
import tema23 from "@/src/data/historia/shorts/tema23.json";
import tema23bis from "@/src/data/historia/shorts/tema23bis.json";
import tema24 from "@/src/data/historia/shorts/tema24.json";
import tema24bis from "@/src/data/historia/shorts/tema24bis.json";
import tema25 from "@/src/data/historia/shorts/tema25.json";
import tema26 from "@/src/data/historia/shorts/tema26.json";
import tema26bis from "@/src/data/historia/shorts/tema26bis.json";
import tema26ter from "@/src/data/historia/shorts/tema26ter.json";
import tema27 from "@/src/data/historia/shorts/tema27.json";
import tema28 from "@/src/data/historia/shorts/tema28.json";
import tema29 from "@/src/data/historia/shorts/tema29.json";
import tema30 from "@/src/data/historia/shorts/tema30.json";

type ShortQuestion = {
  id: string;
  question: string;
  answerGuide: string;
  keywords: string[];
};

const historiaShorts = {
  "tema-1": tema1,
  "tema-2": tema2,
  "tema-3": tema3,
  "tema-4": tema4,
  "tema-5": tema5,
  "tema-6": tema6,
  "tema-7": tema7,
  "tema-8": tema8,
  "tema-9": tema9,
  "tema-10": tema10,
  "tema-11": tema11,
  "tema-12": tema12,
  "tema-13": tema13,
  "tema-14": tema14,
  "tema-15": tema15,
  "tema-16": tema16,
  "tema-17": tema17,
  "tema-18": tema18,
  "tema-18bis": tema18bis,
  "tema-19": tema19,
  "tema-20": tema20,
  "tema-21": tema21,
  "tema-22": tema22,
  "tema-23": tema23,
  "tema-23bis": tema23bis,
  "tema-24": tema24,
  "tema-24bis": tema24bis,
  "tema-25": tema25,
  "tema-26": tema26,
  "tema-26bis": tema26bis,
  "tema-26ter": tema26ter,
  "tema-27": tema27,
  "tema-28": tema28,
  "tema-29": tema29,
  "tema-30": tema30,
} as const;

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,;:¿?¡!()"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ShortsPage() {
  const [tema, setTema] = useState("tema-1");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setTema(params.get("tema") || "tema-1");
}, []);

  const [testVersion, setTestVersion] = useState(0);
  const [questions, setQuestions] = useState<ShortQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const all = (historiaShorts[tema as keyof typeof historiaShorts] || []) as ShortQuestion[];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    setAnswers({});
    setShowResults(false);
    setScore(null);
  }, [tema, testVersion]);

  useEffect(() => {
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUserId(data.user?.id ?? null);
  };

  loadUser();
}, []);

  const results = useMemo(() => {
    return questions.map((q) => {
      const userAnswer = normalizeText(answers[q.id] || "");
      const keywords = Array.isArray(q.keywords) ? q.keywords : [];
      const matchedKeywords = keywords.filter((kw) =>
        userAnswer.includes(normalizeText(kw))
      );
      const minRequired = Math.max(1, Math.ceil(keywords.length * 0.6));
      const isCorrect = keywords.length > 0 && matchedKeywords.length >= minRequired;

      return {
        id: q.id,
        isCorrect,
        matchedKeywords,
        totalKeywords: keywords.length,
      };
    });
  }, [questions, answers]);

  const handleSubmit = async () => {
    const correct = results.filter((r) => r.isCorrect).length;
    const percentage =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    setScore(percentage);
    setShowResults(true);
    if (userId) {
      const { error } = await supabase.from("intentos-cortas").insert({
        usuario_id: userId,
        tema_id: Number(tema.split("-")[1]),
        score: percentage,
        fecha: new Date().toISOString(),
      });

  if (error) {
    alert("Error guardando cortas: " + error.message);
  }
}

if (userId) {
  const { data: intentos } = await supabase
    .from("intentos-cortas")
    .select("*")
    .eq("usuario_id", userId)
    .eq("tema_id", Number(tema.split("-")[1]));

  const aprobados = intentos?.filter((i) => i.score >= 80).length || 0;

  if (aprobados >= 4) {
    setShowSuccess(true);

    const siguienteTemaMap: Record<string, string> = {
  "tema-1": "tema-2",
  "tema-2": "tema-3",
  "tema-3": "tema-4",
  "tema-4": "tema-5",
  "tema-5": "tema-6",
  "tema-6": "tema-7",
  "tema-7": "tema-8",
  "tema-8": "tema-9",
  "tema-9": "tema-10",
  "tema-10": "tema-11",
  "tema-11": "tema-12",
  "tema-12": "tema-13",
  "tema-13": "tema-14",
  "tema-14": "tema-15",
  "tema-15": "tema-16",
  "tema-16": "tema-17",
  "tema-17": "tema-18",
  "tema-18": "tema-18bis",
  "tema-18bis": "tema-19",
  "tema-19": "tema-20",
  "tema-20": "tema-21",
  "tema-21": "tema-22",
  "tema-22": "tema-23",
  "tema-23": "tema-23bis",
  "tema-23bis": "tema-24",
  "tema-24": "tema-24bis",
  "tema-24bis": "tema-25",
  "tema-25": "tema-26",
  "tema-26": "tema-26bis",
  "tema-26bis": "tema-26ter",
  "tema-26ter": "tema-27",
  "tema-27": "tema-28",
  "tema-28": "tema-29",
  "tema-29": "tema-30",
};

const siguienteTema = siguienteTemaMap[tema];

if (!siguienteTema) {
  return;
}

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

  };

  const handleReset = () => {
    setTestVersion((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Preguntas cortas {tema}</h1>

      {questions.length === 0 ? (
        <p>No hay preguntas para este tema</p>
      ) : (
        <>
          {questions.map((q, index) => {
            const result = results.find((r) => r.id === q.id);
            const isCorrect = result?.isCorrect;

            return (
              <div
                key={q.id}
                style={{
                  marginBottom: "20px",
                  padding: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  background: showResults
                    ? isCorrect
                      ? "#f0fdf4"
                      : "#fef2f2"
                    : "white",
                }}
              >
                <p style={{ fontWeight: "bold" }}>
                  {index + 1}. {q.question}
                </p>

                <textarea
                  value={answers[q.id] || ""}
                  disabled={showResults}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  placeholder="Escribe tu respuesta"
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    fontSize: "15px",
                    marginTop: "10px",
                  }}
                />

                {showResults && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Resultado:</strong>{" "}
                      {isCorrect ? "Correcta" : "Incorrecta"}
                    </p>

                    <p style={{ marginBottom: "8px" }}>
                      <strong>Claves necesarias:</strong> {q.keywords.join(", ")}
                    </p>

                    <p style={{ marginBottom: "8px" }}>
                      <strong>Coincidencias encontradas:</strong>{" "}
                      {result && result.matchedKeywords.length > 0
                        ? result.matchedKeywords.join(", ")
                        : "Ninguna"}
                    </p>

                    {!isCorrect && (
                      <p style={{ marginBottom: 0 }}>
                        <strong>Respuesta guía:</strong> {q.answerGuide}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!showResults ? (
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 16px",
                background: "#111827",
                color: "white",
                borderRadius: "10px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Corregir
            </button>
          ) : (
            <>
              <h2 style={{ marginTop: "24px" }}>Resultado: {score}%</h2>
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
    🎉 Has desbloqueado el siguiente tema
  </div>
)}
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 16px",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "12px",
                }}
              >
                Repetir
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}