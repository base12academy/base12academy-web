"use client";

import Link from "next/link";

// import LeadChatBot from "@/components/LeadChatBot";
import LeadChatBot from "@/components/LeadChatBot";

// import LeadChatBot from "@/components/LeadChatBot";
import { introVideos } from "@/lib/intro-videos";

const COLORS = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#1f2937",
  muted: "#6b7280",
  primary: "#2563eb",
};

const pauCursos = [
  {
    titulo: "Historia de España",
    precio: "17 € / mes",
    descripcion: "Preparación completa para la PAU con temario, apoyo al estudio, test y vídeos.",
  },
  {
    titulo: "Historia de la Filosofía",
    precio: "17 € / mes",
    descripcion: "Curso estructurado por temas para repaso, comprensión de autores y preparación de examen.",
  },
];

const oposicionesCursos = [
  {
    titulo: "Auxiliar Administrativo del Estado",
    descripcion: "Preparación estructurada para avanzar con claridad, práctica y seguimiento.",
  },
  {
    titulo: "Administrativo del Estado",
    descripcion: "Temario, apoyo al estudio y práctica guiada para consolidar resultados.",
  },
  {
    titulo: "Otra oposición",
    descripcion: "Preparación guiada con estructura clara y recursos de apoyo.",
  },
];

const onlineCursos = [
  {
    titulo: "Protocolo Institucional",
    precio: "39 €",
    descripcion: "Curso completo estructurado por temas con vídeos explicativos.",
  },
  {
    titulo: "Protocolo Social y Empresarial",
    precio: "39 €",
    descripcion: "Formación práctica para entornos profesionales y empresariales.",
  },
  {
    titulo: "Gestión eficaz del tiempo",
    precio: "35 €",
    descripcion: "Técnicas prácticas para organizar el estudio y mejorar el rendimiento.",
  },
];

export default function HomePage() {
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          color: COLORS.text,
        }}
      >
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "32px 24px 48px",
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "64px",
            }}
          >
            <img
              src="/images/base12-logo.png"
              alt="Base12 Academy"
              style={{
                height: "220px",
                objectFit: "contain",
              }}
            />

            <nav
  style={{
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  <Link
    href="/login"
    style={{
      padding: "10px 16px",
      border: `1px solid ${COLORS.border}`,
      borderRadius: "10px",
      textDecoration: "none",
      color: COLORS.text,
      fontWeight: "500",
    }}
  >
    Acceso
  </Link>

   <div style={{ display: "flex", gap: "12px", marginLeft: "8px" }}>
    <Link href="/aviso-legal" style={{ color: COLORS.muted, fontSize: "14px" }}>
      Aviso legal
    </Link>
    <Link href="/privacidad" style={{ color: COLORS.muted, fontSize: "14px" }}>
      Privacidad
    </Link>
    <Link href="/cookies" style={{ color: COLORS.muted, fontSize: "14px" }}>
      Cookies
    </Link>
    <Link href="/terminos-contratacion" style={{ color: COLORS.muted, fontSize: "14px" }}>
      Términos
    </Link>
  </div>
</nav>
              
          </header>

          <section style={{ marginBottom: "56px" }}>
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                lineHeight: "1.1",
                marginBottom: "20px",
              }}
            >
              Saca nota alta en la PAU y avanza en tu preparación
            </h1>
<div
  style={{
    fontSize: "18px",
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: "16px",
    letterSpacing: "0.5px",
  }}
>
  Construye · Comprende · Domina
</div>
            <p
              style={{
                fontSize: "22px",
                lineHeight: "1.6",
                color: COLORS.muted,
                marginBottom: "24px",
                maxWidth: "820px",
              }}
            >
              Estudia con un método claro, test interactivos y seguimiento real para
  mejorar tu rendimiento en la PAU, oposiciones y cursos profesionales.
            </p>

           
          </section>

          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
              Preparación para la PAU
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
             {pauCursos.map((curso) => (
  <div
    key={curso.titulo}
    style={{
      padding: "24px",
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: "16px",
      minHeight: "220px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div>
      <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
        {curso.titulo}
      </h3>

      <p style={{ fontSize: "14px", color: COLORS.muted, marginTop: "8px" }}>
        {curso.titulo === "Historia de España"
          ? "Acceso online completo"
          : "Temario en actualización"}
      </p>

<p style={{ fontSize: "14px", color: COLORS.muted, marginTop: "8px" }}>
  {curso.titulo === "Historia de España"
    ? "Acceso online completo"
    : "Temario en actualización"}
</p>

{curso.titulo === "Historia de España" ? (
  <Link href="/comprar/historia-espana">
    🔓 Activar acceso completo
  </Link>
) : null}

      <p style={{ fontSize: "16px", fontWeight: "600", marginTop: "4px" }}>
        Desde {curso.precio}
      </p>

      {curso.titulo === "Historia de la Filosofía" ? (
  <>
    <Link href="/dashboard/filosofia">Ver curso →</Link>
    <p style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
      Curso estructurado. Pruebas comparativas en desarrollo.
    </p>
  </>
) : null}

    </div>

    {curso.titulo === "Historia de España" && (
      <Link
        href="/dashboard/comprar/historia-espana"
        style={{
          marginTop: "16px",
          display: "inline-block",
          padding: "10px 16px",
          background: COLORS.primary,
          color: "white",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Ver curso
      </Link>
    )}
  </div>
))}
            </div>
          </section>

          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
              Preparación de oposiciones
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {oposicionesCursos.map((curso) => (
                <div
                  key={curso.titulo}
                  style={{
                    padding: "24px",
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                    {curso.titulo}
                  </h3>
                  <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>{curso.descripcion}</p>
                  <p style={{ fontSize: "14px", color: COLORS.muted, marginTop: "8px" }}>
                    Temario en actualización
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", marginTop: "4px" }}>
                    Desde 19 € / mes
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
              Cursos online
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {onlineCursos.map((curso) => (
                <div
                  key={curso.titulo}
                  style={{
                    padding: "24px",
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                    {curso.titulo}
                  </h3>
                  <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>{curso.descripcion}</p>
                  <p style={{ fontSize: "14px", color: COLORS.muted, marginTop: "8px" }}>
                    Temario en actualización
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", marginTop: "4px" }}>
                    Desde {curso.precio}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "40px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
              Empieza por aquí
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "20px",
                alignItems: "start",
              }}
            >
              {introVideos.map((video) => (
                <div
                  key={video.slug}
                  style={{
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "16px",
                    padding: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>{video.titulo}</h3>

                  <iframe
                    width="100%"
                    height="180"
                    src={video.videoUrl}
                    title={video.titulo}
                    style={{ border: "none", borderRadius: "12px" }}
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

            <footer
        style={{
          marginTop: "64px",
          padding: "40px 24px",
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.6",
          }}
        >
          <p style={{ marginBottom: "16px", fontWeight: "bold", color: "#1f2937" }}>
            Base12 Academy
          </p>

          <div style={{ marginBottom: "8px" }}>
            <p style={{ margin: 0 }}>Imagen Digital Ménace, S. L. U.</p>
            <p style={{ margin: 0 }}>CIF: B21746086</p>
            <p style={{ margin: 0 }}>Calle Lanuza, 8 · 29009 Málaga</p>
            <p style={{ margin: 0 }}>Contacto técnico: base12academy@gmail.com</p>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "12px" }}>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Política de privacidad</Link>
            <Link href="/cookies">Política de cookies</Link>
            <Link href="/terminos-contratacion">Términos de contratación</Link>
          </div>

          <p style={{ marginTop: "16px", fontSize: "14px", color: "#9ca3af" }}>
            © 2026 Base12 Academy. Todos los derechos reservados.
          </p>
        </div>
      </footer>

          {/* <LeadChatBot /> */}
      <LeadChatBot />
    </>
  );
}

// rebuild