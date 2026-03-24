"use client";

import { useEffect, useRef, useState } from "react";

export default function LeadChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState<string[]>([
    "Asistente Base12: Hola, soy el asistente de cursos de Base12 Academy. Puedo ayudarte con precios, contenidos, acceso, vídeos y matrícula.",
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  async function enviarMensaje(textoDirecto?: string) {
    const textoUsuario = (textoDirecto ?? mensaje).trim();

    if (!textoUsuario) return;

    setChat((prev) => [
      ...prev,
      "Interesado: " + textoUsuario,
      "Asistente Base12: pensando...",
    ]);

    setMensaje("");

    try {
      const res = await fetch("/api/lead-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje: textoUsuario,
        }),
      });

      const data = await res.json();

      setChat((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] =
          "Asistente Base12: " +
          (data.respuesta || "Ahora mismo no puedo responder.");
        return copia;
      });
    } catch (error) {
      setChat((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] =
          "Asistente Base12: Ahora mismo no puedo conectar. Puedes preguntarme por cursos, precios o acceso.";
        return copia;
      });
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        B
      </button>

      {abierto && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "20px",
            width: "360px",
            height: "520px",
            background: "white",
            border: "1px solid #d1d5db",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "#111827",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Asistente Base12
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  enviarMensaje("¿Qué cursos tenéis disponibles?")
                }
                style={quickButtonStyle}
              >
                Cursos
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Cuánto cuestan los cursos?")
                }
                style={quickButtonStyle}
              >
                Precios
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Los cursos incluyen vídeos y test?")
                }
                style={quickButtonStyle}
              >
                Vídeos y test
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Cómo puedo matricularme?")
                }
                style={quickButtonStyle}
              >
                Matrícula
              </button>
            </div>
          </div>

          <div
            ref={chatRef}
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              background: "#ffffff",
            }}
          >
            {chat.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: m.startsWith("Interesado")
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                <div
                  style={{
                    background: m.startsWith("Interesado")
                      ? "#2563eb"
                      : "#f3f4f6",
                    color: m.startsWith("Interesado") ? "white" : "#111827",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    maxWidth: "82%",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m
                    .replace("Interesado: ", "")
                    .replace("Asistente Base12: ", "")}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "10px",
              display: "flex",
              gap: "8px",
              background: "#fff",
            }}
          >
            <input
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  enviarMensaje();
                }
              }}
              placeholder="Pregúntame por cursos, precios o acceso..."
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "10px 12px",
                outline: "none",
              }}
            />

            <button
              onClick={() => enviarMensaje()}
              style={{
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "0 14px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const quickButtonStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#111827",
  fontSize: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  whiteSpace: "nowrap",
};