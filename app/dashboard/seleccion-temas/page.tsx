"use client";

import { useState } from "react";
import { temasHistoria } from "@/lib/temas";
import { supabase } from "@/lib/supabaseClient";

export default function SeleccionTemasPage() {
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  const toggleTema = (slug: string) => {
    if (seleccionados.includes(slug)) {
      setSeleccionados(seleccionados.filter((t) => t !== slug));
    } else {
      if (seleccionados.length >= 25) return;
      setSeleccionados([...seleccionados, slug]);
    }
  };

  const guardar = async () => {
  if (seleccionados.length !== 25) {
    alert("Debes seleccionar exactamente 25 temas");
    return;
  }

  const bloques = {
  "bloque-1": ["tema-1", "tema-2", "tema-3", "tema-4"],
  "bloque-2": ["tema-5", "tema-6", "tema-7", "tema-8"],
  "bloque-3": ["tema-9", "tema-10", "tema-11", "tema-12"],
  "bloque-4": ["tema-13", "tema-14", "tema-15", "tema-16"],
  "bloque-5": ["tema-17", "tema-18", "tema-18-bis", "tema-19"],
  "bloque-6": ["tema-20", "tema-21", "tema-22", "tema-23"],
  "bloque-7": ["tema-23-bis", "tema-24", "tema-24-bis", "tema-25"],
  "bloque-8": ["tema-26", "tema-26-bis", "tema-26ter", "tema-27"],
  "bloque-9": ["tema-28", "tema-29", "tema-30"],
};

  const faltaBloque = Object.values(bloques).some((temasBloque) => {
    return !temasBloque.some((slug) => seleccionados.includes(slug));
  });

  if (faltaBloque) {
    alert("Debes elegir al menos 1 tema de cada bloque");
    return;
  }

    setGuardando(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("Debes iniciar sesión");
      setGuardando(false);
      return;
    }

    await supabase
      .from("perfiles")
      .update({ temas_activos: seleccionados })
      .eq("user_id", user.id);

    alert("Temas guardados correctamente");
    window.location.href = "/dashboard";
  };

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Selecciona tus 25 temas</h1>

      <p>Debes elegir exactamente 25 temas para empezar.</p>

      <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
        {temasHistoria.map((tema) => (
          <div
            key={tema.slug}
            onClick={() => toggleTema(tema.slug)}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              background: seleccionados.includes(tema.slug)
                ? "#2563eb"
                : "white",
              color: seleccionados.includes(tema.slug)
                ? "white"
                : "black",
            }}
          >
            {tema.titulo}
          </div>
        ))}
      </div>

      <p style={{ marginTop: "20px" }}>
        Seleccionados: {seleccionados.length} / 25
      </p>

      <button
        onClick={guardar}
        disabled={guardando}
        style={{
          marginTop: "20px",
          padding: "12px 16px",
          background: "#111827",
          color: "white",
          borderRadius: "8px",
          border: "none",
        }}
      >
        Guardar selección
      </button>
    </main>
  );
}