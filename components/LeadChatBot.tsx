"use client";

import { useEffect, useRef, useState } from "react";

export default function LeadChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [comunidad, setComunidad] = useState("");
  const [chat, setChat] = useState<string[]>([
    "Asistente Base12: Hola 👋\n\nEstoy aquí para ayudarte a elegir bien.\n\nPuedo orientarte sobre:\n• Bachillerato y PAU\n• Cursos online y certificados\n• Oposiciones\n• Modalidades, precios y descuentos\n• Acceso según tu comunidad\n\nSelecciona tu comunidad si lo deseas y pregúntame.",
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
    } catch (error) {
      setChat((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] =
            "Asistente Base12: Ahora mismo no puedo responder bien.\n\nPuedes consultar todos los cursos y precios en la sección Oferta formativa de esta misma página.";
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
        B12
      </button>

      {abierto && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "20px",
            width: "360px",
            height: "560px",
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
                  enviarMensaje("¿Cómo funciona Base12 Academy?")
                }
                style={quickButtonStyle}
              >
                Cómo funciona
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Qué incluyen las modalidades Esencial, Estándar y Premium?")
                }
                style={quickButtonStyle}
              >
                Qué incluye
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Cuáles son los precios y descuentos?")
                }
                style={quickButtonStyle}
              >
                Precio y acceso
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Qué oposiciones hay para mi comunidad?")
                }
                style={quickButtonStyle}
              >
                Mi comunidad
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Puedo probar Ofimática antes de matricularme?")
                }
                style={quickButtonStyle}
              >
                Unidad gratuita
              </button>

              <button
                onClick={() =>
                  enviarMensaje("¿Cómo funcionan el desistimiento y el acceso inmediato?")
                }
                style={quickButtonStyle}
              >
                Contratación
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
              placeholder="Pregúntame por cursos, precios o tu comunidad..."
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
