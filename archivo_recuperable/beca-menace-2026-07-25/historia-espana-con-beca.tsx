import Link from "next/link";
import type { CSSProperties } from "react";

const COLORS = {
  bg: "#f4f7fb",
  card: "#ffffff",
  border: "#dbe3ef",
  text: "#0f172a",
  muted: "#475569",
  primary: "#1d4ed8",
  warning: "#fffbeb",
  warningBorder: "#fcd34d",
  warningText: "#92400e",
};

const paquetes = [
  {
    name: "Esencial",
    area: "2º Bachillerato",
    slogan: "Empieza a despegar",
    description:
      "Para comprender Historia de España durante el curso, ordenar el temario y avanzar con una base sólida.",
    price: "Precio en revisión",
    imageLabel: "Imagen Esencial",
    features: [
      "Curso completo de Historia de España",
      "Vídeos explicativos",
      "Texto del contenido del vídeo",
      "Pruebas tipo test",
      "Banco de textos e imágenes",
      "Asistente virtual",
    ],
  },
  {
    name: "Estándar",
    area: "2º Bachillerato + PAU",
    slogan: "Toma el control",
    description:
      "Para preparar la asignatura y comenzar el entrenamiento específico de la PAU con método y seguridad.",
    price: "Precio en revisión",
    imageLabel: "Imagen Estándar",
    features: [
      "Curso completo de Historia de España",
      "Preparación PAU",
      "Pruebas tipo test",
      "Pruebas de desarrollo",
      "Banco de textos e imágenes",
      "Exigencia para continuar el temario",
    ],
  },
  {
    name: "Premium",
    area: "2º Bachillerato + PAU",
    slogan: "Vuela sin límites",
    description:
      "Para quien busca una preparación más completa, con más recursos, más exigencia y acompañamiento especial.",
    price: "Precio en revisión",
    imageLabel: "Imagen Premium",
    features: [
      "Curso completo de Historia de España",
      "Preparación PAU avanzada",
      "Pruebas de desarrollo",
      "Banco de textos e imágenes",
      "Mentoría de apoyo",
      "Complementos didácticos",
    ],
  },
  {
    name: "Complementario PAU",
    area: "Solo PAU",
    slogan: "Rompe las cadenas",
    description:
      "Para estudiantes que ya han trabajado la asignatura y necesitan entrenar específicamente la prueba PAU.",
    price: "Precio en revisión",
    imageLabel: "Imagen Complementario PAU",
    features: [
      "Preparación específica PAU",
      "Pruebas tipo PAU",
      "Banco de textos e imágenes",
      "Entrenamiento de desarrollo",
      "Asistente virtual",
      "Mentoría de apoyo",
    ],
  },
];

export default function CursoHistoriaEspanaPage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link href="/" style={styles.brand}>
            <img
              src="/images/base12-logo.png"
              alt="Base12 Academy"
              style={styles.logoHeader}
            />
          </Link>

          <nav style={styles.nav}>
            <Link href="/" style={styles.navLink}>
              Inicio
            </Link>
            <Link href="/#bachillerato-pau" style={styles.navLink}>
              Bachillerato y PAU
            </Link>
            <Link href="/#oposiciones" style={styles.navLink}>
              Oposiciones
            </Link>
            <Link href="/#cursos-online" style={styles.navLink}>
              Cursos online
            </Link>
            <Link href="/#beca-menace" style={styles.navLink}>
              Beca Ménace
            </Link>
          </nav>

          <Link href="/login" style={styles.loginButton}>
            Acceso alumnos
          </Link>
        </div>
      </header>

      <div style={styles.container}>
        <section style={styles.hero}>
          <div>
            <Link href="/" style={styles.backLink}>
              ← Volver a Base12 Academy
            </Link>

            <p style={styles.kicker}>Bachillerato y PAU</p>

            <h1 style={styles.h1}>Historia de España</h1>

            <p style={styles.heroText}>
              Curso en actualización para adaptarse al nuevo modelo de paquetes
              de Base12 Academy. El objetivo sigue siendo el mismo: comprender
              la Historia de España, ordenar el estudio y preparar los exámenes
              con una guía clara, útil y exigente.
            </p>

            <div style={styles.statusBox}>
              <strong>Curso en actualización.</strong> Los paquetes, recursos
              incluidos y precios están en revisión antes de su activación
              definitiva.
            </div>
          </div>

          <div style={styles.heroCard}>
            <img
              src="/images/base12-logo.png"
              alt="Base12 Academy"
              style={styles.logo}
            />
            <p style={styles.claim}>Construye · Comprende · Domina</p>
            <p style={styles.heroCardText}>
              Nueva organización por niveles de apoyo, libertad y preparación.
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Nuevos paquetes previstos</h2>
          <p style={styles.sectionText}>
            Estos paquetes aparecen de forma provisional para mostrar la nueva
            estructura del curso. Todavía no están activados para compra.
          </p>

          <div style={styles.packagesGrid}>
            {paquetes.map((paquete) => (
              <article key={paquete.name} style={styles.packageCard}>
                <div style={styles.packageImage}>
                  <span>{paquete.imageLabel}</span>
                </div>

                <p style={styles.packageArea}>{paquete.area}</p>
                <h3 style={styles.packageName}>{paquete.name}</h3>
                <p style={styles.packageSlogan}>{paquete.slogan}</p>

                <p style={styles.packageDescription}>{paquete.description}</p>

                <p style={styles.price}>{paquete.price}</p>

                <ul style={styles.featuresList}>
                  {paquete.features.map((feature) => (
                    <li key={feature} style={styles.featureItem}>
                      ✔️ {feature}
                    </li>
                  ))}
                </ul>

                <button type="button" disabled style={styles.disabledButton}>
                  Actualizando el curso
                </button>
              </article>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Qué vas a conseguir</h2>

          <div style={styles.simpleList}>
            <p>✔️ Comprender el temario en profundidad.</p>
            <p>✔️ Responder con estructura y claridad.</p>
            <p>✔️ Evitar errores típicos de examen.</p>
            <p>✔️ Mejorar tu nota de forma progresiva.</p>
          </div>
        </section>

        <section style={styles.infoSection}>
          <h2 style={styles.h2}>En qué consiste el curso</h2>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Comprensión histórica</h3>
              <p style={styles.infoText}>
                No se trata solo de memorizar datos, sino de entender escenarios,
                causas, procesos y consecuencias.
              </p>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Método de estudio</h3>
              <p style={styles.infoText}>
                El curso permite avanzar tema a tema con comprensión real,
                evitando la memorización superficial.
              </p>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Entrenamiento PAU</h3>
              <p style={styles.infoText}>
                Los paquetes con PAU incorporarán entrenamiento específico para
                responder con estructura, claridad y criterio.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Para quién es este curso</h2>

          <p style={styles.sectionText}>
            Para estudiantes que quieren entender el temario, mejorar su forma
            de estudiar y preparar el examen con una base sólida para sacar
            mejor nota.
          </p>
        </section>

        <section style={styles.notice}>
          <h2 style={styles.noticeTitle}>Aviso de actualización</h2>
          <p style={styles.noticeText}>
            Durante esta fase, Base12 Academy está reorganizando Historia de
            España para adaptarla al nuevo sistema de paquetes. Las condiciones
            finales se publicarán cuando el curso quede activado definitivamente.
          </p>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "122px 24px 40px",
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
    maxWidth: 1180,
    margin: "0 auto",
    padding: "10px 24px",
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
  logoHeader: {
    width: 190,
    height: 72,
    objectFit: "contain",
    borderRadius: 12,
    background: "#ffffff",
    padding: 4,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    fontSize: 14,
  },
  navLink: {
    color: "#1e293b",
    textDecoration: "none",
    fontWeight: 600,
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
  container: {
    maxWidth: 1180,
    margin: "0 auto",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 28,
    alignItems: "stretch",
    background:
      "linear-gradient(135deg, #ffffff 0%, #eaf1fb 55%, #dbeafe 100%)",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 32,
    padding: 36,
    marginBottom: 34,
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
  },
  backLink: {
    display: "inline-block",
    marginBottom: 22,
    color: COLORS.primary,
    fontWeight: 800,
    textDecoration: "none",
  },
  kicker: {
    display: "inline-block",
    margin: 0,
    marginBottom: 16,
    padding: "7px 14px",
    borderRadius: 999,
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.primary,
    fontWeight: 800,
    fontSize: 14,
  },
  h1: {
    margin: 0,
    fontSize: 52,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    color: "#020617",
  },
  heroText: {
    maxWidth: 760,
    color: "#334155",
    fontSize: 18,
    lineHeight: 1.75,
    marginTop: 22,
  },
  statusBox: {
    marginTop: 24,
    background: COLORS.warning,
    border: `1px solid ${COLORS.warningBorder}`,
    color: COLORS.warningText,
    borderRadius: 18,
    padding: 18,
    lineHeight: 1.6,
  },
  heroCard: {
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 28,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  },
  logo: {
    width: 220,
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
  },
  claim: {
    marginTop: 18,
    color: COLORS.primary,
    fontWeight: 900,
    letterSpacing: "0.04em",
  },
  heroCardText: {
    color: COLORS.muted,
    lineHeight: 1.6,
    marginTop: 8,
  },
  section: {
    marginBottom: 34,
  },
  h2: {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: "#020617",
  },
  sectionText: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 1.7,
    marginTop: 10,
    marginBottom: 22,
  },
  packagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 18,
  },
  packageCard: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 28,
    padding: 20,
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    minHeight: 560,
  },
  packageImage: {
    height: 130,
    borderRadius: 22,
    background: "linear-gradient(135deg, #e2e8f0, #dbeafe)",
    border: `1px solid ${COLORS.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontWeight: 800,
    textAlign: "center",
    padding: 12,
    marginBottom: 18,
  },
  packageArea: {
    margin: 0,
    color: COLORS.primary,
    fontWeight: 900,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  packageName: {
    margin: "6px 0 0",
    fontSize: 25,
    color: "#020617",
  },
  packageSlogan: {
    margin: "6px 0 0",
    color: "#0f172a",
    fontWeight: 800,
  },
  packageDescription: {
    color: COLORS.muted,
    lineHeight: 1.6,
    fontSize: 14,
    marginTop: 12,
  },
  price: {
    marginTop: 10,
    color: COLORS.warningText,
    background: COLORS.warning,
    border: `1px solid ${COLORS.warningBorder}`,
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 900,
    textAlign: "center",
  },
  featuresList: {
    margin: "14px 0 20px",
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 9,
    flex: 1,
  },
  featureItem: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.45,
  },
  disabledButton: {
    width: "100%",
    border: "none",
    background: "#cbd5e1",
    color: "#475569",
    borderRadius: 16,
    padding: "13px 14px",
    fontWeight: 900,
    cursor: "not-allowed",
  },
  simpleList: {
    marginTop: 16,
    lineHeight: 1.8,
    color: COLORS.muted,
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 34,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
    marginTop: 20,
  },
  infoCard: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
  },
  infoTitle: {
    margin: 0,
    color: "#020617",
    fontSize: 20,
  },
  infoText: {
    color: COLORS.muted,
    lineHeight: 1.65,
    marginBottom: 0,
  },
  notice: {
    background: COLORS.warning,
    border: `1px solid ${COLORS.warningBorder}`,
    borderRadius: 28,
    padding: 26,
    color: COLORS.warningText,
  },
  noticeTitle: {
    margin: 0,
    fontSize: 24,
  },
  noticeText: {
    lineHeight: 1.7,
    marginBottom: 0,
  },
};