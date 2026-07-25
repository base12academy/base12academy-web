import Link from "next/link";
import type { CSSProperties } from "react";
import LeadChatBot from "@/components/LeadChatBot";
import CourseCatalog from "@/components/CourseCatalog";

const videos = [
  {
    title: "Qué es Base12",
    text: "Una presentación general de la plataforma y de sus aulas de formación.",
    src: "/videos/que-es-base12.mp4",
  },
  {
    title: "Método Base12",
    text: "Cómo Base12 organiza el aprendizaje para avanzar con estructura, comprensión y seguridad.",
    src: "/videos/metodo-base12.mp4",
  },
  {
    title: "Cómo funciona",
    text: "Una explicación sencilla del funcionamiento de la plataforma, las aulas, los recursos y el acceso.",
    src: "/videos/como-funciona-base12.mp4",
  },
];

export default function HomePage() {
  return (
    <>
      <main style={styles.page}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <Link href="/" style={styles.brand}>
              <img
                src="/images/base12-logo.png"
                alt="Base12 Academy"
                style={styles.logoImage}
              />
            </Link>

            <nav style={styles.nav}>
              <a href="#videos-presentacion" style={styles.navLink}>
                Presentación
              </a>

              <a href="#catalogo" style={styles.navLink}>
                Cursos y precios
              </a>

              <a
                href="https://discord.gg/CJ2CKEFvc"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.communityLink}
              >
                Comunidad B12
              </a>
            </nav>

            <Link href="/login" style={styles.loginButton}>Acceso alumnos</Link>
          </div>
        </header>

        <div style={styles.layout}>
          <section style={styles.content}>
            <section style={styles.hero}>
              <div style={styles.heroTextColumn}>
                <div style={styles.label}>
                  Bachillerato · PAU · Oposiciones · Cursos online
                </div>

                <h1 style={styles.h1}>
                  Aprende con estructura. Avanza con seguridad.
                </h1>

                <p style={styles.heroText}>
                  Base12 Academy reúne distintas líneas de formación: Bachillerato
                  y PAU, Oposiciones y Cursos online. Cada aula tendrá su propio
                  método, sus propios recursos y una preparación adaptada al
                  objetivo del estudiante.
                </p>

                <div style={styles.heroButtons}>
                  <a href="#videos-presentacion" style={styles.secondaryButton}>
                    Ver presentación
                  </a>
                </div>
              </div>

              <div style={styles.heroVideoBox}>
                <video
                  src="/videos/presentacion-base12.mp4"
                  controls
                  playsInline
                  style={styles.heroVideo}
                />
                <div style={styles.videoFallback}>
                  Vídeo de presentación Base12
                </div>
              </div>
            </section>

            <CourseCatalog />

            <section id="videos-presentacion" style={styles.videoSection}>
              <h2 style={styles.h2}>Vídeos de presentación</h2>
              <p style={styles.subtitle}>
                Conoce qué es Base12 Academy, cómo funciona y cuál es su método
                de trabajo.
              </p>

              <div style={styles.cards}>
                {videos.map((video) => (
                  <article key={video.title} style={styles.videoCard}>
                    <video
                      src={video.src}
                      controls
                      preload="metadata"
                      playsInline
                      style={styles.presentationVideo}
                    />
                    <div style={styles.videoContent}>
                      <h3 style={styles.h3}>{video.title}</h3>
                      <p style={styles.cardText}>{video.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <footer style={styles.footer}>
              <div style={styles.footerInner}>
                <p style={styles.footerBrand}>Base12 Academy</p>

                <p style={styles.footerText}>Imagen Digital Ménace, S. L. U.</p>
                <p style={styles.footerText}>CIF: B21746086</p>
                <p style={styles.footerText}>Calle Lanuza, 8 · 29009 Málaga</p>
                <p style={styles.footerText}>
                  Contacto técnico: base12academy@gmail.com
                </p>

                <div style={styles.footerLinks}>
                  <Link href="/aviso-legal" style={styles.footerLink}>
                    Aviso legal
                  </Link>
                  <Link href="/privacidad" style={styles.footerLink}>
                    Política de privacidad
                  </Link>
                  <Link href="/cookies" style={styles.footerLink}>
                    Política de cookies
                  </Link>
                  <Link
                    href="/terminos-contratacion"
                    style={styles.footerLink}
                  >
                    Términos de contratación
                  </Link>
                </div>

                <p style={styles.footerCopy}>
                  © 2026 Base12 Academy. Todos los derechos reservados.
                </p>
              </div>
            </footer>
          </section>

          <aside style={styles.aside}>
  <div style={styles.trustBox}>
    <p style={styles.sideLabel}>Decide con seguridad</p>

    <h3 style={styles.sideTitle}>
      Una experiencia docente real convertida en método
    </h3>

    <p style={styles.sideIntro}>
      Base12 Academy nace de años de enseñanza, acompañamiento académico y
      trabajo con alumnos reales.
    </p>

    <div style={styles.trustList}>
      <div style={styles.trustItem}>
        <strong style={styles.trustNumber}>3.200</strong>
        <span style={styles.trustText}>alumnos formados</span>
      </div>

      <div style={styles.trustItem}>
        <strong style={styles.trustNumber}>11 años</strong>
        <span style={styles.trustText}>de experiencia docente</span>
      </div>

      <div style={styles.trustItem}>
        <strong style={styles.trustNumber}>Doctor</strong>
        <span style={styles.trustText}>
          con formación en Historia, Teología, Pedagogía y Alta Dirección
        </span>
      </div>
    </div>
  </div>

  <div style={styles.faqBox}>
    <p style={styles.sideLabel}>Preguntas frecuentes</p>

    <details style={styles.faqItem}>
      <summary style={styles.faqQuestion}>¿Qué es Base12 Academy?</summary>
      <p style={styles.faqAnswer}>
        Una plataforma de formación pensada para estudiar con estructura,
        avanzar con seguridad y comprender mejor lo que se aprende.
      </p>
    </details>

    <details style={styles.faqItem}>
      <summary style={styles.faqQuestion}>
        ¿Base12 sustituye a mi profesor?
      </summary>
      <p style={styles.faqAnswer}>
        No. Base12 complementa las clases, ordena los contenidos y ayuda al
        alumno a estudiar con más método.
      </p>
    </details>

    <details style={styles.faqItem}>
      <summary style={styles.faqQuestion}>
        ¿Qué diferencia hay con estudiar solo?
      </summary>
      <p style={styles.faqAnswer}>
        Base12 ofrece orientación, vídeos de apoyo, materiales organizados y
        pruebas para comprobar si realmente se avanza.
      </p>
    </details>

    <details style={styles.faqItem}>
      <summary style={styles.faqQuestion}>
        ¿Tengo que estudiar más temario?
      </summary>
      <p style={styles.faqAnswer}>
        No se trata de añadir carga sin sentido, sino de comprender mejor el
        contexto, las causas, las consecuencias y las relaciones importantes.
      </p>
    </details>

    <details style={styles.faqItem}>
      <summary style={styles.faqQuestion}>
        ¿Qué paquete debería elegir?
      </summary>
      <p style={styles.faqAnswer}>
        Depende de tu situación: apoyo para la asignatura, preparación PAU o
        acompañamiento más completo. La idea es elegir según la necesidad real.
      </p>
    </details>

    <details style={styles.faqItem}>
      <summary style={styles.faqQuestion}>
        ¿Qué significa “Consigue tu libertad”?
      </summary>
      <p style={styles.faqAnswer}>
        Significa que aprender bien abre posibilidades. Cuando entiendes y
        avanzas con seguridad, dependes menos del miedo y de la improvisación.
      </p>
    </details>
  </div>

  <div style={styles.quickBox}>
    <p style={styles.sideLabel}>Acceso rápido</p>
    <a href="#catalogo" style={styles.quickPrimary}>Ver cursos y precios</a>
  </div>
</aside>
        </div>
      </main>

      <LeadChatBot />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#0f172a",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 50,
    background: "rgba(255, 255, 255, 0.96)",
    borderBottom: "1px solid rgba(15, 23, 42, 0.10)",
    backdropFilter: "blur(10px)",
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "7px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logoImage: {
    width: 180,
    height: 76,
    objectFit: "contain",
    borderRadius: 12,
    background: "#ffffff",
    padding: 4,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 22,
    fontSize: 14,
  },
  navLink: {
    color: "#1e293b",
    textDecoration: "none",
    fontWeight: 600,
  },
  communityLink: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "1px solid rgba(37, 99, 235, 0.20)",
    textDecoration: "none",
    fontWeight: 800,
    padding: "9px 14px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  },
  loginButton: {
    border: "1px solid rgba(15, 23, 42, 0.18)",
    color: "#0f172a",
    background: "#ffffff",
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
  },
  layout: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "100px 24px 64px",
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 28,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 26,
  },
  hero: {
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderRadius: 32,
    padding: 26,
    background:
      "linear-gradient(135deg, #ffffff 0%, #eaf1fb 55%, #dbeafe 100%)",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 24,
    alignItems: "center",
  },
  heroTextColumn: {
    minWidth: 0,
  },
  label: {
    display: "inline-block",
    border: "1px solid rgba(15, 23, 42, 0.16)",
    borderRadius: 999,
    padding: "7px 14px",
    color: "#1e3a8a",
    background: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 14,
  },
  h1: {
    margin: 0,
    fontSize: 41,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    maxWidth: 760,
    color: "#020617",
  },
  heroText: {
    maxWidth: 720,
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.58,
    marginTop: 16,
  },
  heroButtons: {
    display: "flex",
    gap: 12,
    marginTop: 18,
    flexWrap: "wrap",
  },
  secondaryButton: {
    border: "1px solid rgba(37, 99, 235, 0.35)",
    color: "#1d4ed8",
    background: "#ffffff",
    padding: "13px 22px",
    borderRadius: 999,
    fontWeight: 900,
    textDecoration: "none",
    fontSize: 14,
  },
  heroVideoBox: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 28,
    minHeight: 275,
    background: "linear-gradient(135deg, #dbeafe, #e2e8f0)",
    border: "1px solid rgba(15, 23, 42, 0.10)",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
  },
  heroVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 2,
  },
  videoFallback: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontWeight: 800,
    textAlign: "center",
    padding: 24,
  },
  h2: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: "#020617",
  },
  subtitle: {
    color: "#475569",
    marginTop: 8,
    marginBottom: 20,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },
  card: {
    border: "1px solid rgba(15, 23, 42, 0.10)",
    background: "#ffffff",
    borderRadius: 28,
    padding: 22,
    minHeight: 270,
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  },
  cardImage: {
    height: 110,
    borderRadius: 20,
    background: "linear-gradient(135deg, #e2e8f0, #dbeafe)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    marginBottom: 20,
  },
  h3: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.25,
    color: "#020617",
  },
  cardText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.65,
    marginTop: 12,
  },
  cardButton: {
    display: "inline-block",
    marginTop: 18,
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "1px solid rgba(37, 99, 235, 0.18)",
    borderRadius: 999,
    padding: "9px 14px",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 900,
  },
  videoSection: {
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderRadius: 30,
    padding: 24,
    background: "#ffffff",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  },
  videoCard: {
    overflow: "hidden",
    borderRadius: 24,
    background: "#ffffff",
    border: "1px solid rgba(15, 23, 42, 0.10)",
  },
  presentationVideo: {
    width: "100%",
    aspectRatio: "16 / 9",
    background: "#e2e8f0",
    display: "block",
    objectFit: "cover",
  },
  videoContent: {
    padding: 18,
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 34,
    marginTop: 12,
  },
  footerInner: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.7,
  },
  footerBrand: {
    margin: "0 0 18px",
    color: "#111827",
    fontWeight: 900,
  },
  footerText: {
    margin: "2px 0",
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 18,
  },
  footerLink: {
    color: "#004aad",
    textDecoration: "none",
    fontWeight: 600,
  },
  footerCopy: {
    marginTop: 22,
    color: "#94a3b8",
  },
  aside: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "sticky",
    top: 100,
    alignSelf: "start",
  },
  trustBox: {
  border: "1px solid rgba(37, 99, 235, 0.16)",
  borderRadius: 28,
  padding: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.07)",
},
faqBox: {
  border: "1px solid rgba(15, 23, 42, 0.10)",
  borderRadius: 28,
  padding: 18,
  background: "#ffffff",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.07)",
},
sideLabel: {
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: 0,
  marginBottom: 12,
},
sideTitle: {
  margin: 0,
  color: "#0f172a",
  fontSize: 19,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
},
sideIntro: {
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.65,
  marginTop: 12,
  marginBottom: 16,
},
trustList: {
  display: "flex",
  flexDirection: "column",
  gap: 12,
},
trustItem: {
  border: "1px solid rgba(37, 99, 235, 0.12)",
  borderRadius: 20,
  padding: 14,
  background: "rgba(255, 255, 255, 0.78)",
},
trustNumber: {
  display: "block",
  color: "#1e3a8a",
  fontSize: 22,
  lineHeight: 1.1,
  fontWeight: 950,
  marginBottom: 4,
},
trustText: {
  display: "block",
  color: "#334155",
  fontSize: 13,
  lineHeight: 1.45,
  fontWeight: 650,
},
faqItem: {
  borderTop: "1px solid rgba(15, 23, 42, 0.08)",
  paddingTop: 12,
  paddingBottom: 12,
},
faqQuestion: {
  cursor: "pointer",
  color: "#0f172a",
  fontSize: 14,
  lineHeight: 1.35,
  fontWeight: 850,
},
faqAnswer: {
  color: "#475569",
  fontSize: 13,
  lineHeight: 1.6,
  marginTop: 10,
  marginBottom: 0,
},
    quickBox: {
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderRadius: 28,
    padding: 18,
    background: "#ffffff",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.07)",
  },
  quickPrimary: {
    display: "block",
    background: "#1d4ed8",
    color: "#ffffff",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 900,
    padding: "12px 14px",
    borderRadius: 18,
  },
};
