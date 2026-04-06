"use client";

import { useEffect, useState } from "react";
import { getBadgeSummaryFromFinalProgress } from "@/lib/badges-storage";

type FinalStatus = {
  blocked?: boolean;
  attempts?: number;
  passed?: number;
  completed?: boolean;
  error?: string;
};

export default function ExamStrategyPage() {
  const [data, setData] = useState<FinalStatus | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/final-exam-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "11111111-1111-1111-1111-111111111111",
        }),
      });

      const json = await res.json();
      setData(json);
    }

    load();
  }, []);

  const passedCount = Number(data?.passed || 0);
  const badge = getBadgeSummaryFromFinalProgress(passedCount);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Fin de preparación</h1>

      <div style={{ marginBottom: 28 }}>
        <p>Has terminado este curso.</p>
        <p>
          Finales superadas: <strong>{passedCount}</strong>
        </p>
        <p>
          Nivel alcanzado:{" "}
          <strong>
            {badge.icon ? `${badge.icon} ${badge.label}` : badge.label}
          </strong>
        </p>
        <p>{badge.description}</p>
      </div>

      <h2>Antes del examen</h2>
      <ul>
        <li>Llega con al menos 30 minutos de antelación.</li>
        <li>Evita conversaciones que generen dudas o inseguridad.</li>
        <li>Lleva el DNI o documento identificativo.</li>
        <li>Usa ropa cómoda y ten en cuenta la temperatura del aula.</li>
        <li>Come como de costumbre, evitando tanto el exceso como pasar hambre.</li>
        <li>Mantente hidratado y, si es posible, lleva agua en recipiente transparente.</li>
        <li>Lleva dos o tres bolígrafos revisados.</li>
        <li>Si llevas reloj, mejor analógico.</li>
        <li>Si quieres usar tapones, pregunta antes si están permitidos.</li>
        <li>Duerme bien la noche anterior y prepara el material con antelación.</li>
      </ul>

      <h2>Durante el examen</h2>
      <ul>
        <li>Lee detenidamente cada pregunta y relee si hace falta.</li>
        <li>Haz una lectura completa del examen antes de empezar.</li>
        <li>Empieza por las preguntas que mejor sabes.</li>
        <li>Deja para después las preguntas en las que tienes dudas parciales.</li>
        <li>Si te bloqueas, pasa a la siguiente y vuelve más tarde.</li>
        <li>Controla el tiempo desde el principio.</li>
        <li>En preguntas largas, haz antes un pequeño esquema mental.</li>
        <li>Escribe con claridad y deja unos minutos finales para revisar.</li>
      </ul>

      <a href="/api/download-exam-strategy">
        <button style={{ padding: 12, marginTop: 24 }}>
          Descargar PDF
        </button>
      </a>
    </div>
  );
}
