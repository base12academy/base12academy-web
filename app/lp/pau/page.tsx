import type { Metadata } from "next";
import Link from "next/link";
import {
  CampaignLink,
  LandingFooter,
  LandingHeader,
  landingStyles as styles,
} from "@/components/AdsLandingShell";
import {
  getCampaignParams,
  type LandingSearchParams,
} from "@/lib/campaign-tracking";

export const metadata: Metadata = {
  title: "Preparación PAU Online por Comunidad Autónoma | Base12 Academy",
  description:
    "Prepara la PAU por asignatura y comunidad autónoma con modelos de examen, ejercicios, simulacros, correcciones y estrategia.",
  alternates: { canonical: "/lp/pau" },
};

const subjects = [
  "Lengua Castellana y Literatura",
  "Historia de España",
  "Historia de la Filosofía",
  "Matemáticas II",
  "Matemáticas Aplicadas a las CCSS",
  "Física",
  "Química",
  "Biología",
  "Empresa y Diseño de Modelos de Negocio",
];

export default async function PauAdsLanding({
  searchParams,
}: {
  searchParams: Promise<LandingSearchParams>;
}) {
  const campaign = getCampaignParams(await searchParams);

  return (
    <div className={styles.page}>
      <LandingHeader
        campaign={campaign}
        ctaHref="/bachillerato-pau"
        ctaLabel="Preparar mi PAU"
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Preparación PAU</p>
            <h1>Ya has estudiado la asignatura. Ahora entrena el examen.</h1>
            <p className={styles.heroIntro}>
              Trabaja el modelo, los criterios, el tiempo y los tipos de
              preguntas de tu comunidad autónoma para convertir lo que sabes en
              una mejor respuesta de examen.
            </p>
            <div className={styles.heroProof}>
              <span>Por comunidad autónoma</span>
              <span>Por asignatura</span>
              <span>Modelos y simulacros</span>
            </div>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/bachillerato-pau"
              >
                Elegir asignatura y comunidad
              </CampaignLink>
              <Link className={styles.secondaryCta} href="#preparacion">
                Cómo se prepara
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <strong>PAU</strong>
            <p>Entrenamiento específico para una prueba concreta.</p>
            <ul>
              <li>Estructura y criterios de corrección</li>
              <li>Gestión del tiempo y estrategia</li>
              <li>Práctica progresiva y simulacros</li>
            </ul>
          </div>
        </section>

        <section className={styles.section} id="preparacion">
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Un objetivo diferente</p>
              <h2>Bachillerato enseña. La PAU evalúa.</h2>
              <p>
                Aquí no vuelves a empezar la asignatura. Entrenas cómo demostrar
                lo que ya sabes dentro de un modelo, un tiempo y unos criterios
                de corrección determinados.
              </p>
            </div>
            <div className={styles.accentPanel}>
              <h3>Tu PAU depende de tu comunidad</h3>
              <p>
                Al acceder indicas tu comunidad autónoma para trabajar el modelo
                que corresponde a tu prueba y a tu asignatura.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Entrenamiento de examen</p>
            <h2>Practica como te van a evaluar</h2>
          </div>
          <div className={styles.grid3}>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Conoce la prueba</p>
              <h3>Estructura y criterios</h3>
              <p>
                Identifica los tipos de preguntas, la distribución del tiempo y
                aquello que el corrector espera encontrar.
              </p>
            </article>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Entrena</p>
              <h3>Ejercicios y modelos</h3>
              <p>
                Trabaja preguntas cerradas, cuestiones cortas, desarrollo,
                comentarios, problemas y modelos completos.
              </p>
            </article>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Mejora</p>
              <h3>Correcciones útiles</h3>
              <p>
                Comprende qué faltaba, qué puede penalizar y cómo construir una
                respuesta mejor la próxima vez.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Asignaturas</p>
            <h2>Elige la materia que vas a examinar</h2>
          </div>
          <div className={styles.subjectList}>
            {subjects.map((subject) => (
              <span key={subject}>{subject}</span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Preparación independiente</p>
              <h2>Puedes contratar solo PAU</h2>
              <p>
                No es obligatorio haber cursado Bachillerato con Base12. La
                modalidad PAU está pensada para quien ya domina la asignatura y
                necesita centrarse exclusivamente en el examen.
              </p>
            </div>
            <article className={`${styles.priceCard} ${styles.featuredCard}`}>
              <p className={styles.cardLabel}>Solo PAU</p>
              <h3>Preparación específica</h3>
              <span className={styles.price}>199 €</span>
              <p className={styles.priceContext}>pago único</p>
              <ul className={styles.checkList}>
                <li>Pruebas y modelos tipo PAU</li>
                <li>Entrenamiento de respuestas</li>
                <li>Recursos por asignatura</li>
              </ul>
              <CampaignLink
                campaign={campaign}
                className={styles.cardCta}
                href="/cursos/historia-espana"
              >
                Ver una ficha de asignatura
              </CampaignLink>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.ctaPanel}>
            <h2>Convierte lo que sabes en una respuesta de examen</h2>
            <p>
              Elige tu comunidad autónoma, tu asignatura y empieza a preparar
              específicamente tu PAU.
            </p>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/bachillerato-pau"
              >
                Elegir asignatura y comunidad
              </CampaignLink>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
