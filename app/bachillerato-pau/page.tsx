import Link from "next/link";
import LeadChatBot from "@/components/LeadChatBot";

const subjects = [
  {
    title: "Historia de España",
    description:
      "Comprende los grandes procesos históricos, entrena comentarios de textos e imágenes y prepara la PAU con método.",
    status: "En actualización",
    href: "/cursos/historia-espana",
    video: "/videos/presentacion-historia-espana.mp4",
  },
  {
    title: "Historia de la Filosofía",
    description:
      "Estudia autores, problemas filosóficos, textos y comparaciones con una preparación pensada para Bachillerato y PAU.",
    status: "En preparación",
    href: "#",
    video: "/videos/presentacion-historia-filosofia.mp4",
  },
  {
    title: "Lengua y Literatura",
    description:
      "Refuerza comprensión, comentario, literatura, sintaxis y expresión escrita para mejorar el rendimiento académico.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-lengua-literatura.mp4",
  },
  {
    title: "Matemáticas II",
    description:
      "Entrenamiento progresivo para dominar procedimientos, razonamiento matemático y resolución de problemas.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-matematicas.mp4",
  },
  {
    title: "Matemáticas Aplicadas",
    description:
      "Preparación orientada a economía, ciencias sociales, interpretación de datos y ejercicios tipo PAU.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-matematicas.mp4",
  },
  {
    title: "Física",
    description:
      "Explicaciones claras, práctica guiada y entrenamiento de problemas para comprender y aplicar los conceptos.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-fisica.mp4",
  },
  {
    title: "Química",
    description:
      "Método, ejercicios y recursos para ordenar la teoría y ganar seguridad en la resolución de problemas.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-quimica.mp4",
  },
  {
    title: "Biología",
    description:
      "Contenido organizado, explicación de procesos biológicos y preparación práctica para pruebas y exámenes.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-biologia.mp4",
  },
  {
    title: "Empresa",
    description:
      "Conceptos económicos y empresariales explicados con claridad y orientados a la aplicación práctica.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-empresa.mp4",
  },
  {
    title: "Geografía",
    description:
      "Mapas, conceptos, análisis territorial y preparación para interpretar datos, gráficos e imágenes.",
    status: "Próximamente",
    href: "#",
    video: "/videos/presentacion-geografia.mp4",
  },
  {
    title: "Geología",
    description:
      "Comprensión de procesos geológicos, materiales, estructuras y relación con el entorno físico.",
    status: "Próximamente",
    href: "#",
    video: "",
  },
];

export default function BachilleratoPauPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>Base12 Academy</p>
        <h1 style={styles.title}>Bachillerato y PAU</h1>
        <p style={styles.subtitle}>
          Elige la asignatura que quieres preparar. Cada aula tendrá sus propios
          vídeos, recursos, pruebas, paquetes y metodología específica.
        </p>
      </section>

      <section style={styles.grid}>
        {subjects.map((subject) => (
          <article key={subject.title} style={styles.card}>
            <div style={styles.videoBox}>
              {subject.video ? (
                <video
                  src={subject.video}
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
              <p style={styles.status}>{subject.status}</p>
              <h2 style={styles.cardTitle}>{subject.title}</h2>
              <p style={styles.description}>{subject.description}</p>

              {subject.href === "#" ? (
  <button style={styles.disabledButton} disabled>
    Próximamente
  </button>
) : (
  <Link href={subject.href} style={styles.button}>
    Ver asignatura
  </Link>
)}
            </div>
          </article>
        ))}
      </section>
       <LeadChatBot />     
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
    maxWidth: 760,
    margin: "0 auto",
    fontSize: 19,
    lineHeight: 1.7,
    color: "#4b5563",
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