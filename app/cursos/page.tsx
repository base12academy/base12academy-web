import Link from "next/link";
import type { CSSProperties } from "react";

const courses = [
  {
    title: "Curso de Protocolo Institucional",
    description:
      "Formación orientada a comprender y aplicar el protocolo en actos institucionales, administraciones, entidades públicas y eventos oficiales.",
    status: "En preparación",
    href: "#",
    video: "/videos/presentacion-protocolo-institucional.mp4",
  },
  {
    title: "Curso de Protocolo Social y Empresarial",
    description:
      "Curso práctico para desenvolverse con seguridad en contextos sociales, empresariales y profesionales donde la imagen, el trato y la organización importan.",
    status: "En preparación",
    href: "#",
    video: "/videos/presentacion-protocolo-social-empresarial.mp4",
  },
  {
    title: "Curso de Gestión Eficaz del Tiempo",
    description:
      "Formación pensada para profesionales y directivos que necesitan ordenar prioridades, reducir dispersión y mejorar su rendimiento diario.",
    status: "En preparación",
    href: "#",
    video: "/videos/presentacion-gestion-tiempo.mp4",
  },
];

export default function CursosOnlinePage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>Base12 Academy</p>
        <h1 style={styles.title}>Cursos online</h1>
        <p style={styles.subtitle}>
          Formación práctica para adquirir competencias útiles en el ejercicio
          profesional, empresarial e institucional. Cada curso tendrá su propia
          aula, sus vídeos de presentación, recursos, paquetes y metodología.
        </p>

        <div style={styles.heroActions}>
          <Link href="/" style={styles.secondaryButton}>
            Volver a la home
          </Link>
        </div>
      </section>

      <section style={styles.grid}>
        {courses.map((course) => (
          <article key={course.title} style={styles.card}>
            <div style={styles.videoBox}>
              {course.video ? (
                <video
                  src={course.video}
                  controls
                  playsInline
                  style={styles.video}
                />
              ) : (
                <div style={styles.videoPlaceholder}>
                  Vídeo de presentación
                </div>
              )}
            </div>

            <div style={styles.cardBody}>
              <p style={styles.status}>{course.status}</p>
              <h2 style={styles.cardTitle}>{course.title}</h2>
              <p style={styles.description}>{course.description}</p>

              {course.href === "#" ? (
                <button style={styles.disabledButton} disabled>
                  Próximamente
                </button>
              ) : (
                <Link href={course.href} style={styles.button}>
                  Ver curso
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#1f2937",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "80px 24px 56px",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 42px",
    textAlign: "center",
  },
  kicker: {
    margin: 0,
    color: "#2563eb",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontSize: 13,
  },
  title: {
    margin: "12px 0 16px",
    fontSize: "clamp(42px, 6vw, 72px)",
    lineHeight: 1,
    color: "#111827",
  },
  subtitle: {
    maxWidth: 790,
    margin: "0 auto",
    fontSize: 19,
    lineHeight: 1.7,
    color: "#4b5563",
  },
  heroActions: {
    marginTop: 26,
    display: "flex",
    justifyContent: "center",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    color: "#2563eb",
    border: "1px solid rgba(37, 99, 235, 0.30)",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 14,
  },
  grid: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  },
  videoBox: {
    background: "#e5e7eb",
    aspectRatio: "16 / 9",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    minHeight: 170,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontWeight: 800,
    background:
      "linear-gradient(135deg, rgba(219,234,254,1), rgba(241,245,249,1))",
  },
  cardBody: {
    padding: 24,
  },
  status: {
    margin: "0 0 10px",
    color: "#2563eb",
    fontSize: 13,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: 25,
    color: "#111827",
  },
  description: {
    margin: "0 0 22px",
    color: "#4b5563",
    lineHeight: 1.6,
    fontSize: 15,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 14,
  },
  disabledButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e5e7eb",
    color: "#6b7280",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 14,
    border: "none",
    cursor: "not-allowed",
  },
};