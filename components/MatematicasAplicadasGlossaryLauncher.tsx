"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type GlossaryTerm = {
  term: string;
  definition: string;
  utility: string;
  error: string;
  example: string;
};

type GlossarySection = {
  section: number;
  title: string;
  terms: GlossaryTerm[];
};

type GlossaryPayload = {
  count: number;
  sections: GlossarySection[];
};

export default function MatematicasAplicadasGlossaryLauncher() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<GlossaryPayload | null>(null);

  async function openGlossary() {
    setOpen(true);
    if (data || loading) return;

    setLoading(true);
    setError("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const response = await fetch("/api/matematicas-aplicadas-ccss/glossary", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      setData(payload as GlossaryPayload);
    } else if (payload?.error === "authentication_required") {
      setError("Inicia sesión para acceder al glosario completo de Matemáticas Aplicadas CCSS II.");
    } else if (payload?.error === "matriculation_required") {
      setError("El glosario completo requiere una modalidad con acceso a Matemáticas Aplicadas CCSS II.");
    } else {
      setError("No se ha podido cargar el glosario.");
    }
    setLoading(false);
  }

  const filteredSections = useMemo(() => {
    if (!data) return [];
    const needle = query.trim().toLocaleLowerCase("es");
    if (!needle) return data.sections;

    return data.sections
      .map((section) => ({
        ...section,
        terms: section.terms.filter((item) =>
          `${item.term} ${item.definition} ${item.utility} ${item.error} ${item.example}`
            .toLocaleLowerCase("es")
            .includes(needle),
        ),
      }))
      .filter((section) => section.terms.length > 0);
  }, [data, query]);

  return <>
    <button
      type="button"
      onClick={openGlossary}
      aria-label="Abrir glosario de Matemáticas Aplicadas CCSS II"
      style={launcherStyle}
    >
      <span style={{ fontSize: 18 }}>Aa</span>
      <span><strong style={{ display: "block", fontSize: 13 }}>Glosario</strong><small style={{ display: "block", opacity: .78, fontSize: 10 }}>86 términos</small></span>
    </button>

    {open ? <div style={backdropStyle} role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
      <aside style={drawerStyle} role="dialog" aria-modal="true" aria-label="Glosario de Matemáticas Aplicadas CCSS II">
        <header style={headerStyle}>
          <div>
            <span style={eyebrowStyle}>RECURSO BASE12</span>
            <h2 style={{ margin: "5px 0 2px", fontSize: 24, color: "#0b2c5d" }}>Glosario de Matemáticas Aplicadas CCSS II</h2>
            <p style={{ margin: 0, color: "#60758d", fontSize: 12 }}>{data ? `${data.count} términos operativos` : "Definición · utilidad · error típico · ejemplo"}</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} style={closeStyle}>Cerrar ×</button>
        </header>

        {data ? <label style={searchLabelStyle}>
          Buscar término o concepto
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Determinante, Bayes, integral…"
            autoFocus
            style={searchInputStyle}
          />
        </label> : null}

        <div style={bodyStyle}>
          {loading ? <p style={statusStyle}>Cargando glosario…</p> : null}
          {error ? <div style={errorStyle}>{error}</div> : null}
          {!loading && !error && data && filteredSections.length === 0 ? <p style={statusStyle}>No hay términos que coincidan con la búsqueda.</p> : null}
          {!loading && !error ? filteredSections.map((section) => <section key={section.section} style={{ marginBottom: 24 }}>
            <h3 style={sectionTitleStyle}>{section.title}</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {section.terms.map((item) => <article key={`${section.section}-${item.term}`} style={termCardStyle}>
                <h4 style={{ margin: 0, color: "#0b2c5d", fontSize: 16 }}>{item.term}</h4>
                <p style={paragraphStyle}><strong>Definición:</strong> {item.definition}</p>
                <p style={paragraphStyle}><strong>Para qué sirve:</strong> {item.utility}</p>
                <p style={paragraphStyle}><strong>Error típico:</strong> {item.error}</p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}><strong>Ejemplo:</strong> {item.example}</p>
              </article>)}
            </div>
          </section>) : null}
        </div>
      </aside>
    </div> : null}
  </>;
}

const launcherStyle: React.CSSProperties = {
  position: "fixed",
  right: 22,
  bottom: 22,
  zIndex: 45,
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #d7e0ea",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#ffffff",
  color: "#0b2c5d",
  boxShadow: "0 12px 30px rgba(10,42,89,.18)",
  cursor: "pointer",
  textAlign: "left",
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 80,
  background: "rgba(5,20,40,.42)",
  display: "flex",
  justifyContent: "flex-end",
};

const drawerStyle: React.CSSProperties = {
  width: "min(720px, 94vw)",
  height: "100vh",
  background: "#f7f9fc",
  boxShadow: "-18px 0 46px rgba(6,26,54,.22)",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "flex-start",
  padding: "22px 24px 16px",
  background: "#fff",
  borderBottom: "1px solid #e0e7ef",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#cc8300",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: ".1em",
};

const closeStyle: React.CSSProperties = {
  border: "1px solid #d7e0ea",
  borderRadius: 8,
  background: "#fff",
  color: "#526d89",
  padding: "8px 10px",
  cursor: "pointer",
  fontWeight: 700,
};

const searchLabelStyle: React.CSSProperties = {
  display: "block",
  padding: "14px 24px",
  color: "#526d89",
  background: "#fff",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  borderBottom: "1px solid #e0e7ef",
};

const searchInputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 7,
  padding: "11px 12px",
  border: "1px solid #cfd9e6",
  borderRadius: 8,
  background: "#fff",
  color: "#153c70",
  fontSize: 14,
  outline: "none",
};

const bodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: 22,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 10px",
  color: "#0b2c5d",
  fontSize: 17,
};

const termCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #dfe7ef",
  borderRadius: 10,
  padding: 15,
};

const paragraphStyle: React.CSSProperties = {
  margin: "8px 0",
  color: "#526d89",
  fontSize: 13,
  lineHeight: 1.48,
};

const statusStyle: React.CSSProperties = {
  color: "#60758d",
  fontWeight: 700,
};

const errorStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 9,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#9a3412",
  fontWeight: 700,
};
