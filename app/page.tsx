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
          color: "#111827",
        }}
      >
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "64px 24px 32px",
          }}
        >
         
          <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
            Base12 Academy
          </h1>

          <p style={{ marginTop: "16px", marginBottom: "24px" }}>
            Plataforma de estudio con test y seguimiento.
          </p>

          <Link
            href="/dashboard"
            style={{
              padding: "12px 20px",
              background: "#111827",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            Ir al dashboard
          </Link>
          
           <div style={{ marginTop: "40px" }}>
  <h2>Empieza por aquí</h2>

  <div style={{ display: "grid", gap: "24px", marginTop: "20px" }}>
    {videosInicio.map((video, index) => (
      <div key={index}>
        <h3>{video.titulo}</h3>
        <iframe
          width="100%"
          height="400"
          src={video.url}
          title={video.titulo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ))}
  </div>
</div>
        </section>
      </main>

      <LeadChatBot />
    </>
  );
}