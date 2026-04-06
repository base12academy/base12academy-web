"use client";

import Link from "next/link";
import LeadChatBot from "@/components/LeadChatBot";
import { introVideos } from "@/lib/intro-videos";

const COLORS = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#1f2937",
  muted: "#6b7280",
  primary: "#2563eb",
  dark: "#111827",
};

const pauCursos = [
  {
    titulo: "Historia de España",
    precio: "17 € / mes",
    descripcion:
      "Preparación completa para la PAU con vídeos, test, apoyo al estudio y entrenamiento para responder mejor.",
  },
  {
    titulo: "Historia de la Filosofía",
    precio: "17 € / mes",
    descripcion:
      "Curso estructurado por temas para repaso, comprensión de autores y preparación de examen.",
  },
];

const oposicionesCursos = [
  {
    titulo: "Auxiliar Administrativo del Estado",
    descripcion:
      "Preparación estructurada para avanzar con claridad, práctica y seguimiento.",
  },
  {
    titulo: "Administrativo del Estado",
    descripcion:
      "Temario, apoyo al estudio y práctica guiada para consolidar resultados.",
  },
  {
    titulo: "Otra oposición",
    descripcion:
      "Preparación guiada con estructura clara y recursos de apoyo.",
  },
];

const onlineCursos = [
  {
    titulo: "Protocolo Institucional",
    precio: "39 €",
    descripcion:
      "Curso completo estructurado por temas con vídeos explicativos.",
  },
  {
    titulo: "Protocolo Social y Empresarial",
    precio: "39 €",
    descripcion:
      "Formación práctica para entornos profesionales y empresariales.",
  },
  {
    titulo: "Gestión eficaz del tiempo",
    precio: "35 €",
    descripcion:
      "Técnicas prácticas para organizar el estudio y mejorar el rendimiento.",
  },
];

const quickLinkStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "10px",
  border: `1px solid ${COLORS.border}`,
  textDecoration: "none",
  color: COLORS.text,
  fontWeight: 600,
  background: "#fff",
  fontSize: "14px",
};

const cardStyle = {
  padding: "24px",
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "16px",
};

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
            id="top"
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
                  background: "#fff",
                }}
              >
                Acceso
              </Link>

              <div style={{ display: "flex", gap: "12px", marginLeft: "8px", flexWrap: "wrap" }}>
                <Link href="/aviso-legal" style={{ color: COLORS.muted, fontSize: "14px" }}>
                  Aviso legal
                </Link>
                <Link href="/privacidad" style={{ color: COLORS.muted, fontSize: "14px" }}>
                  Privacidad
                </Link>
                <Link href="/cookies" style={{ color: COLORS.muted, fontSize: "14px" }}>
                  Cookies
                </Link>
                <Link
                  href="/terminos-contratacion"
                  style={{ color: COLORS.muted, fontSize: "14px" }}
                >
                  Términos
                </Link>
              </div>
            </nav>
          </header>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              alignItems: "center",
              marginBottom: "56px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  lineHeight: "1.1",
                  marginBottom: "20px",
                }}
              >
                Domina cualquier examen con un método que funciona
              </h1>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: COLORS.primary,
                  marginBottom: "16px",
                }}
              >
                Construye · Comprende · Domina
              </div>

              <p
                style={{
                  fontSize: "22px",
                  lineHeight: "1.6",
                  color: COLORS.muted,
                  marginBottom: "12px",
                  maxWidth: "600px",
                }}
              >
                Estudia con un método claro, vídeos explicativos, test interactivos y
                seguimiento real para mejorar tu rendimiento sin aumentar tu carga de estudio.
              </p>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.5",
                  color: COLORS.text,
                  marginBottom: "24px",
                  fontWeight: 600,
                }}
              >
                Sin más temario. Sin perder tiempo. Enfocado en sacar puntos.
              </p>

              <Link
                href="/login"
                style={{
                  display: "inline-block",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#1d4ed8",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Comienza gratis
              </Link>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                <a href="#pau" style={quickLinkStyle}>
                  Ver cursos PAU
                </a>
                <a href="#oposiciones" style={quickLinkStyle}>
                  Ver oposiciones
                </a>
                <a href="#online" style={quickLinkStyle}>
                  Ver cursos online
                </a>
              </div>

              <p style={{ marginTop: "12px", fontSize: "14px", color: "#6b7280" }}>
                Acceso inmediato • Sin permanencia • Empieza hoy • Sin tarjeta
              </p>
            </div>

            <div>
              <img
                src="/images/hero-estudiante.jpg"
                alt="Estudiante preparando un examen"
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  objectFit: "cover",
                }}
              />
            </div>
          </section>

          <section style={{ marginBottom: "56px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>
                No necesitas más apuntes
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: COLORS.muted,
                  lineHeight: "1.6",
                  maxWidth: "820px",
                  margin: 0,
                }}
              >
                Ya tienes el temario de tu centro. Aquí trabajas lo que realmente necesitas
                para sacar nota: entender lo importante, memorizar lo esencial y aprender
                cómo responder en el examen.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              <div style={cardStyle}>
                <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
                  Entiende lo importante
                </h3>
                <p style={{ margin: 0, lineHeight: "1.6", color: COLORS.muted }}>
                  Vídeos claros para dar contexto a las lagunas de los resúmenes y entender
                  lo que de verdad te van a pedir.
                </p>
              </div>

              <div style={cardStyle}>
                <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
                  Memoriza con práctica
                </h3>
                <p style={{ margin: 0, lineHeight: "1.6", color: COLORS.muted }}>
                  Baterías de test para fijar fechas, conceptos y datos clave sin aumentar
                  tu carga de estudio.
                </p>
              </div>

              <div style={cardStyle}>
                <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
                  Aprende a responder
                </h3>
                <p style={{ margin: 0, lineHeight: "1.6", color: COLORS.muted }}>
                  Entrena preguntas cortas, preguntas de desarrollo y comentarios de imágenes
                  y textos históricos, donde muchos alumnos pierden puntos.
                </p>
              </div>
            </div>
          </section>

          <section id="pau" style={{ marginBottom: "56px", scrollMarginTop: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>
                Preparación para la PAU
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: COLORS.muted,
                  lineHeight: "1.6",
                  maxWidth: "820px",
                  margin: 0,
                }}
              >
                Cursos pensados para estudiar solo lo necesario, practicar cómo te van a
                evaluar y llegar al examen con una estrategia clara.
              </p>
            </div>

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
  onClick={() => {
    if (curso.titulo === "Historia de España") {
      window.location.href = "/login";
    }
  }}
  style={{
    padding: "24px",
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: curso.titulo === "Historia de España" ? "pointer" : "default",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  }}
  onMouseEnter={(e) => {
    if (curso.titulo === "Historia de España") {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)";
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  
                    <div>
                    <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                      {curso.titulo}
                    </h3>

{curso.titulo === "Historia de España" && (
  <span
    style={{
      display: "inline-block",
      marginBottom: "10px",
      padding: "4px 10px",
      background: "#dcfce7",
      color: "#166534",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
    }}
  >
    Curso ya disponible
  </span>
)}

                    <p style={{ marginBottom: "12px", lineHeight: "1.6", color: COLORS.muted }}>
                      {curso.descripcion}
                    </p>

                    <p style={{ fontSize: "14px", color: COLORS.muted, marginBottom: "6px" }}>
                      {curso.titulo === "Historia de España"
                        ? "Acceso online completo"
                        : "Temario en actualización"}
                    </p>

                    <ul
                      style={{
                        margin: "0 0 16px 18px",
                        padding: 0,
                        color: COLORS.muted,
                        lineHeight: "1.7",
                        fontSize: "15px",
                      }}
                    >
                      <li>Vídeos explicativos por tema</li>
                      <li>Tests interactivos para memorizar lo esencial</li>
                      <li>Entrenamiento para preguntas de desarrollo</li>
                      <li>
                        {curso.titulo === "Historia de España"
                          ? "Comentario de imágenes y textos históricos"
                          : "Comentario guiado de textos"}
                      </li>
                      <li>Recomendaciones finales para el examen</li>
                    </ul>

                    <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                      Desde {curso.precio}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {curso.titulo === "Historia de España" && (
                      <>
                        <Link
  href="/login"
  style={{
    display: "inline-block",
    padding: "12px 16px",
    background: COLORS.primary,
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    textAlign: "center",
  }}
>
  Empezar ahora
</Link>

                        <span style={{ fontSize: "13px", color: COLORS.muted }}>
                          Acceso inmediato
                        </span>
                      </>
                    )}

                    {curso.titulo === "Historia de la Filosofía" && (
                      <>
                        <Link
                          href="/dashboard/filosofia"
                          style={{
                            display: "inline-block",
                            padding: "12px 16px",
                            background: COLORS.dark,
                            color: "white",
                            borderRadius: "10px",
                            textDecoration: "none",
                            fontWeight: "600",
                            textAlign: "center",
                          }}
                        >
                          Explorar curso
                        </Link>

                        <span
  style={{
    fontSize: "13px",
    color: "#92400e",
    background: "#fef3c7",
    padding: "4px 10px",
    borderRadius: "999px",
    display: "inline-block",
    width: "fit-content",
  }}
>
  En actualización
</span>

<span style={{ fontSize: "13px", color: COLORS.muted }}>
  Accede y ve cómo está estructurado
</span>

                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="oposiciones" style={{ marginBottom: "56px", scrollMarginTop: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>
                Preparación de oposiciones
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: COLORS.muted,
                  lineHeight: "1.6",
                  maxWidth: "820px",
                  margin: 0,
                }}
              >
                Una línea de preparación pensada para crecer contigo. Ya puedes ver lo que
                iremos incorporando y hacia dónde evoluciona la academia.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {oposicionesCursos.map((curso) => (
                <div key={curso.titulo} style={cardStyle}>
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                    {curso.titulo}
                  </h3>

                  <p style={{ marginBottom: "12px", lineHeight: "1.6", color: COLORS.muted }}>
                    {curso.descripcion}
                  </p>

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

          <section id="online" style={{ marginBottom: "56px", scrollMarginTop: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>
                Cursos online
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: COLORS.muted,
                  lineHeight: "1.6",
                  maxWidth: "820px",
                  margin: 0,
                }}
              >
                Formación online práctica para seguir aprendiendo con estructura clara y
                recursos útiles.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {onlineCursos.map((curso) => (
                <div key={curso.titulo} style={cardStyle}>
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                    {curso.titulo}
                  </h3>
                  <p style={{ marginBottom: "12px", lineHeight: "1.6", color: COLORS.muted }}>
                    {curso.descripcion}
                  </p>
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

      <LeadChatBot />
    </>
  );
}