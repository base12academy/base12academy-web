"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { temasHistoria } from "@/lib/temas";

export default function HistoriaEspanaPage() {
  const [tema1Superado, setTema1Superado] = useState(false);
  const [tema2Superado, setTema2Superado] = useState(false);

  useEffect(() => {
    let testTema1Ok = false;
    let cortasTema1Ok = false;
    let textoTema1Ok = false;
    let imagenTema1Ok = false;

    const t1 = localStorage.getItem("tema-01");
    if (t1) {
      const r = JSON.parse(t1);
      if (r.correct / r.total >= 0.8) {
        testTema1Ok = true;
      }
    }

    const cortas = localStorage.getItem("tema-01-cortas");
    if (cortas) {
      const r = JSON.parse(cortas);
      if (r.correct >= 4) {
        cortasTema1Ok = true;
      }
    }

    const texto = localStorage.getItem("tema-01-texto");
    if (texto) {
      const r = JSON.parse(texto);
      if (r.approved) {
        textoTema1Ok = true;
      }
    }

    const imagen = localStorage.getItem("tema-01-imagen");
    if (imagen) {
      const r = JSON.parse(imagen);
      if (r.approved) {
        imagenTema1Ok = true;
      }
    }

    setTema1Superado(
      testTema1Ok &&
        cortasTema1Ok &&
        (textoTema1Ok || imagenTema1Ok)
    );

    const t2 = localStorage.getItem("tema-02");
    if (t2) {
      const r = JSON.parse(t2);
      if (r.correct / r.total >= 0.8) {
        setTema2Superado(true);
      }
    }
  }, []);

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "12px" }}>
        Historia de España
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "32px", color: "#4b5563" }}>
        Bienvenido a la materia. Selecciona un tema para comenzar.
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        {temasHistoria.map((tema, index) => {
          let bloqueado = false;

          if (index === 1 && !tema1Superado) bloqueado = true;
          if (index === 2 && !tema2Superado) bloqueado = true;

          return (
            <div key={tema.slug}>
              {bloqueado ? (
                <div
                  style={{
                    padding: "24px",
                    border: "1px solid #d1d5db",
                    borderRadius: "16px",
                    background: "#f3f4f6",
                    opacity: 0.6,
                  }}
                >
                  <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {tema.titulo} 🔒
                  </h2>
                  <p style={{ margin: 0, color: "#6b7280" }}>
                    {index === 1
                      ? "Debes superar el test y las cortas del Tema 1 con un 80%, y además texto o imagen."
                      : "Debes superar el Tema 2 con un 80%."}
                  </p>
                </div>
              ) : (
                <Link
                  href={`/dashboard/historia-espana/${tema.slug}`}
                  style={{
                    display: "block",
                    padding: "24px",
                    border: "1px solid #d1d5db",
                    borderRadius: "16px",
                    textDecoration: "none",
                    color: "inherit",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {tema.titulo}
                    {index === 0 && tema1Superado ? " ✅" : ""}
                    {index === 1 && tema2Superado ? " ✅" : ""}
                  </h2>
                  <p style={{ margin: 0, color: "#6b7280" }}>
                    {tema.descripcion}
                  </p>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}