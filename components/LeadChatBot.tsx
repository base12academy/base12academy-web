"use client";

import { useEffect, useRef, useState } from "react";

const initialMessage =
  "Asistente Base12: Hola 👋\n\nEstoy aquí para ayudarte a elegir bien.\n\nPuedo orientarte sobre:\n• Competencias, Productividad, Ofimática e IA\n• Bachillerato y PAU\n• Oposiciones\n• Modalidades, precios y duración\n• Acceso gratuito y contratación\n\nElige una pregunta o escríbeme lo que necesites.";

export default function LeadChatBot({ attention = false }: { attention?: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [comunidad, setComunidad] = useState("");
  const [chat, setChat] = useState<string[]>([initialMessage]);
  const [showAttention, setShowAttention] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const attentionAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if (!attention || abierto) return;

    const storageKey = "base12-commercial-audio-shown";

    if (sessionStorage.getItem(storageKey) === "1") return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(storageKey, "1");
      setShowAttention(true);

      const audio = new Audio("/audios/comercial-aviso.mp3");
      attentionAudioRef.current = audio;

      audio.play().catch(() => {
        const reproducirTrasInteraccion = () => {
          audio.play().catch(() => {});

          window.removeEventListener("pointerdown", reproducirTrasInteraccion);
          window.removeEventListener("keydown", reproducirTrasInteraccion);
        };

        window.addEventListener("pointerdown", reproducirTrasInteraccion, { once: true });
        window.addEventListener("keydown", reproducirTrasInteraccion, { once: true });
      });

      window.setTimeout(() => {
        setShowAttention(false);
      }, 7000);
    }, 3000);

    return () => {
      window.clearTimeout(timer);

      if (attentionAudioRef.current) {
        attentionAudioRef.current.pause();
        attentionAudioRef.current.currentTime = 0;
        attentionAudioRef.current = null;
      }
    };
  }, [attention, abierto]);
  useEffect(() => {
    if (!abierto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [abierto]);

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
          comunidad,
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
    } catch {
      setChat((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] =
          "Asistente Base12: Ahora mismo no puedo responder bien.\n\nPuedes consultar los accesos, precios y vídeos de presentación en la sección Oferta formativa de esta misma página.";
        return copia;
      });
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes b12CommercialPulse {
          0%,
          100% {
            box-shadow:
              0 10px 25px rgba(0, 0, 0, 0.2),
              0 0 0 0 rgba(37, 99, 235, 0);
            transform: scale(1);
          }
          50% {
            box-shadow:
              0 10px 25px rgba(0, 0, 0, 0.2),
              0 0 0 13px rgba(37, 99, 235, 0.22);
            transform: scale(1.055);
          }
        }

        @keyframes b12CommercialHint {
          0% {
            opacity: 0;
            transform: translateX(8px);
          }
          12%,
          72% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(4px);
          }
        }

        .b12-commercial-attention {
          animation: b12CommercialPulse 2.2s ease-in-out 0s 3;
        }

        .b12-commercial-hint {
          animation: b12CommercialHint 7.2s ease-in-out 0s 1 both;
        }

        @media (prefers-reduced-motion: reduce) {
          .b12-commercial-attention,
          .b12-commercial-hint {
            animation: none !important;
          }
        }
      `}</style>

      {showAttention && !abierto && (
        <div
          className="b12-commercial-hint"
          style={{
            position: "fixed",
            bottom: "35px",
            right: "96px",
            padding: "8px 12px",
            borderRadius: "999px",
            background: "white",
            color: "#111827",
            border: "1px solid #d1d5db",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            fontSize: "13px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            zIndex: 999,
            pointerEvents: "none",
          }}
        >
          ¿Te ayudo a elegir?
        </div>
      )}

      <button
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? "Cerrar asistente Base12" : "Abrir asistente Base12"}
        className={showAttention ? "b12-commercial-attention" : undefined}
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
        B12
      </button>

      {abierto && (
        <div
          style={{
            position: "fixed",
              bottom: "84px",
            right: "20px",
              width: "min(360px, calc(100vw - 24px))",
              height: "min(560px, calc(100dvh - 108px))",
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
            <div style={{ marginBottom: "10px" }}>
              <select
                value={comunidad}
                onChange={(e) => setComunidad(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              >
                <option value="">Tu comunidad autónoma (opcional)</option>
                <option value="andalucia">Andalucía</option>
                <option value="madrid">Madrid</option>
                <option value="valencia">Comunidad Valenciana</option>
                <option value="castilla_leon">Castilla y León</option>
                <option value="galicia">Galicia</option>
                <option value="aragon">Aragón</option>
                <option value="navarra">Navarra</option>
                <option value="rioja">La Rioja</option>
                <option value="cantabria">Cantabria</option>
                <option value="murcia">Murcia</option>
                <option value="extremadura">Extremadura</option>
                <option value="ministerio">Modelo Ministerio</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  enviarMensaje("¿Qué incluye Competencias Digitales?")
                }
                style={quickButtonStyle}
              >
                Competencias Digitales
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Qué incluye el acceso Ofimática?")
                }
                style={quickButtonStyle}
              >
                Ofimática
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Qué incluye Productividad Digital e IA?")
                }
                style={quickButtonStyle}
              >
                Productividad Digital e IA
              </button>

              <button
                onClick={() =>
                  enviarMensaje(
                    "¿Qué diferencias hay entre Competencias Digitales, Ofimática y Productividad Digital e IA?"
                  )
                }
                style={quickButtonStyle}
              >
                Comparar los 3 accesos
              </button>

              <button
                onClick={() =>
                  enviarMensaje(
                    "¿Cuánto cuesta y cuánto dura cada acceso de Competencias, Productividad, Ofimática e IA?"
                  )
                }
                style={quickButtonStyle}
              >
                Precio y duración
              </button>

              <button
                onClick={() =>
                  enviarMensaje(
                    "¿Qué puedo probar gratis antes de suscribirme a Competencias, Productividad, Ofimática e IA?"
                  )
                }
                style={quickButtonStyle}
              >
                Probar gratis
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
              placeholder="Pregúntame por accesos, precios o qué te conviene..."
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
              aria-label="Enviar mensaje"
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





