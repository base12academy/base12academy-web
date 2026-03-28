import LeadChatBot from "@/components/LeadChatBot";
import Link from "next/link";

const cursos = [
  {
    titulo: "Historia de España",
    precio: "29 €",
    descripcion:
      "Temario, apoyo al estudio, test y preparación académica.",
  },
  {
    titulo: "Historia de la Filosofía",
    precio: "29 €",
    descripcion:
      "Curso estructurado por temas para repaso y comprensión de autores.",
  },
];

export default function HomePage() {
  const videosInicio = [
    {
      titulo: "Introducción a Base12 Academy",
      url: "https://www.youtube.com/embed/KqeL09fa4AI",
    },
    {
      titulo: "El Método Base12",
      url: "https://www.youtube.com/embed/yjl-bICtTMk",
    },
    {
      titulo: "Guía de Estudio Plataforma Base12",
      url: "https://www.youtube.com/embed/DO7qaRuR9T4",
    },
  ];

  
  return (
  <>
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#1f2937",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "40px",
  }}
>
  <div
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2563eb",
  }}
>
  Base12 Academy
</div>

  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
    <Link href="/aviso-legal" style={{ color: "#1f2937", textDecoration: "none" }}>
      Aviso legal
    </Link>
    <Link href="/privacidad" style={{ color: "#1f2937", textDecoration: "none" }}>
      Privacidad
    </Link>
    <Link href="/cookies" style={{ color: "#1f2937", textDecoration: "none" }}>
      Cookies
    </Link>
    <Link href="/contacto" style={{ color: "#1f2937", textDecoration: "none" }}>
      Contacto
    </Link>
  </div>
</div>
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
          Base12 Academy
        </h1>

        <p style={{ marginTop: "16px", marginBottom: "32px", fontSize: "18px" }}>
          Plataforma para preparar la EBAU y oposiciones con método, claridad y enfoque a nota alta.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
          <Link
            href="/register"
            style={{
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Empezar ahora
          </Link>

          <Link
            href="/login"
            style={{
              padding: "12px 20px",
              border: "1px solid #2563eb",
              color: "#2563eb",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Ya tengo cuenta
          </Link>
        </div>

        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
          Preparación para la EBAU / PAU
        </h2>
        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
          Preparación de oposiciones
</h2>

<div style={{ display: "grid", gap: "20px", marginBottom: "48px" }}>
  <div
    style={{
      padding: "20px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
      Auxiliar Administrativo del Estado
    </h3>
    <p style={{ margin: "8px 0 16px 0" }}>
      Preparación estructurada para avanzar con claridad, práctica y seguimiento.
    </p>
    <Link
      href="/register"
      style={{
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none",
      }}
    >
      Ver preparación
    </Link>
  </div>

  <div
    style={{
      padding: "20px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
      Administrativo del Estado
    </h3>
    <p style={{ margin: "8px 0 16px 0" }}>
      Temario, apoyo al estudio y práctica guiada para consolidar resultados.
    </p>
    <Link
      href="/register"
      style={{
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none",
      }}
    >
      Ver preparación
    </Link>
  </div>

  <div
    style={{
      padding: "20px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
      Otra oposición
    </h3>
    <p style={{ margin: "8px 0 16px 0" }}>
      Preparación guiada con estructura clara y recursos de apoyo.
    </p>
    <Link
      href="/register"
      style={{
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none",
      }}
    >
      Ver preparación
    </Link>
  </div>
</div>
        <div style={{ display: "grid", gap: "20px", marginBottom: "48px" }}>
          {cursos.map((curso, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
              }}
            >
              <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
                {curso.titulo}
              </h3>

              <p style={{ margin: "8px 0", color: "#2563eb", fontWeight: "600" }}>
                {curso.precio}
              </p>

              <p style={{ marginBottom: "16px" }}>{curso.descripcion}</p>

              <Link
                href="/comprar"
                style={{
                  padding: "10px 16px",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Ver acceso
              </Link>
            </div>
          ))}
        </div>

<h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
  Cursos online
</h2>

<div style={{ display: "grid", gap: "20px", marginBottom: "48px" }}>
  <div
    style={{
      padding: "20px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
      Protocolo Institucional
    </h3>
    <p style={{ margin: "8px 0 16px 0" }}>
      Curso completo estructurado por temas con vídeos explicativos.
    </p>
    <Link href="/register" style={{
      padding: "10px 16px",
      background: "#2563eb",
      color: "white",
      borderRadius: "8px",
      textDecoration: "none",
    }}>
      Ver curso
    </Link>
  </div>

  <div
    style={{
      padding: "20px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
      Protocolo Social y Empresarial
    </h3>
    <p style={{ margin: "8px 0 16px 0" }}>
      Formación práctica para entornos profesionales y empresariales.
    </p>
    <Link href="/register" style={{
      padding: "10px 16px",
      background: "#2563eb",
      color: "white",
      borderRadius: "8px",
      textDecoration: "none",
    }}>
      Ver curso
    </Link>
  </div>

  <div
    style={{
      padding: "20px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
      Gestión eficaz del tiempo
    </h3>
    <p style={{ margin: "8px 0 16px 0" }}>
      Técnicas prácticas para organizar el estudio y mejorar el rendimiento.
    </p>
    <Link href="/register" style={{
      padding: "10px 16px",
      background: "#2563eb",
      color: "white",
      borderRadius: "8px",
      textDecoration: "none",
    }}>
      Ver curso
    </Link>
  </div>
</div>

        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
          Empieza por aquí
        </h2>

        <div style={{ display: "grid", gap: "24px" }}>
          {videosInicio.map((video, index) => (
            <div key={index}>
              <h3>{video.titulo}</h3>
              <iframe
                width="100%"
                height="400"
                src={video.url}
                title={video.titulo}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </section>
    </main>

    <LeadChatBot />
  </>
);
}