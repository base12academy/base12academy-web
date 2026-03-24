"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
export default function ChatBot() {

  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
const pathname = usePathname();
const temaActual = pathname.split("/").pop();
useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [chat]);
  async function enviarMensaje() {

    if (!mensaje.trim()) return;

    const textoUsuario = mensaje;

    setChat((prev) => [
      ...prev,
      "Alumno: " + textoUsuario,
      "Tutor Base12: pensando..."
    ]);

    setMensaje("");

    try {

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mensaje: textoUsuario,
          ruta: pathname,
          tema: temaActual
        })
      });

      const data = await res.json();

      setChat((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] = "Tutor Base12: " + data.respuesta;
        return copia;
      });

    } catch (error) {

      setChat((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] =
          "Tutor Base12: error conectando con la IA";
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
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        B
      </button>

      {abierto && (

        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column"
          }}
        >

          <div
            style={{
              padding: "10px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold"
            }}
          >
            Tutor Base12
          </div>

          <div
  ref={chatRef}
  style={{
    flex: 1,
    padding: "10px",
    overflowY: "auto"
  }}
>
            {chat.map((m, i) => (
              <div
  key={i}
  style={{
    marginBottom: "8px",
    display: "flex",
    justifyContent: m.startsWith("Alumno") ? "flex-end" : "flex-start"
  }}
>
                <div
  style={{
    background: m.startsWith("Alumno") ? "#2563eb" : "#f1f5f9",
    color: m.startsWith("Alumno") ? "white" : "#111",
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "80%",
    fontSize: "14px"
  }}
>
  {m.replace("Alumno: ", "").replace("Tutor Base12: ", "")}
</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>

<div
  style={{
    display: "flex",
    gap: "8px",
    marginBottom: "14px",
    flexWrap: "wrap",
  }}
>
<button
  onClick={() => enviarMensaje("Hazme un resumen del tema")}
  style={{
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    whiteSpace: "nowrap",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
Resumen
</button>
<button
  onClick={() => enviarMensaje("Explícame este tema de forma sencilla")}
  style={{
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    whiteSpace: "nowrap",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
Explicación
</button>
<button
  onClick={() => enviarMensaje("Hazme 5 preguntas tipo test sobre este tema")}
  style={{
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    whiteSpace: "nowrap",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
Test
</button>
</div>
            <input
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
}}
              placeholder="Pregunta algo..."
              style={{
                flex: 1,
                border: "none",
                padding: "8px"
              }}
            />

            <button
              onClick={enviarMensaje}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "8px 12px"
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