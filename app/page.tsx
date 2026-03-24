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
        </section>
      </main>

      <LeadChatBot />
    </>
  );
}