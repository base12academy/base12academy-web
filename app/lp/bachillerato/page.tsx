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
  title: "Cursos Online de Bachillerato | Base12 Academy",
  description:
    "Comprende las asignaturas de Bachillerato con temario, vídeos, ejercicios, pruebas, seguimiento y apoyo durante todo el curso.",
  alternates: { canonical: "/lp/bachillerato" },
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

const packages = [
  {
    name: "Esencial",
    price: "249 €",
    detail: "Bachillerato",
    description: "Para comprender los contenidos y preparar la asignatura durante el curso.",
  },
  {
    name: "Estándar",
    price: "299 €",
    detail: "Bachillerato + PAU",
    description: "Añade entrenamiento específico para el examen de acceso.",
  },
  {
    name: "Premium",
    price: "399 €",
    detail: "Bachillerato + PAU + acompañamiento",
    description: "La modalidad con mayor nivel de recursos y seguimiento.",
  },
];

export default async function BachilleratoAdsLanding({
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
        ctaLabel="Elegir asignatura"
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Bachillerato</p>
            <h1>Comprende ahora. Construye una base para todo el curso.</h1>
            <p className={styles.heroIntro}>
              Temario estructurado, explicaciones, práctica y seguimiento para
              llegar a los exámenes sabiendo qué haces y por qué.
            </p>
            <div className={styles.heroProof}>
              <span>Apoyo durante todo el curso</span>
              <span>Contenido por asignatura</span>
              <span>Adaptación por comunidad</span>
            </div>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/bachillerato-pau"
              >
                Elegir asignatura
              </CampaignLink>
              <Link className={styles.secondaryCta} href="#paquetes">
                Comparar paquetes
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <strong>Todo el curso</strong>
            <p>Un único precio total para trabajar la asignatura con método.</p>
            <ul>
              <li>Vídeos, temario y recursos</li>
              <li>Ejercicios y pruebas</li>
              <li>Seguimiento del progreso</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Aprender y aprobar</p>
              <h2>Una preparación para la asignatura</h2>
              <p>
                La finalidad es comprender los contenidos y superar la materia
                durante el curso. La preparación específica de la PAU tiene su
                propio recorrido y puede añadirse según el paquete elegido.
              </p>
            </div>
            <div className={styles.accentPanel}>
              <h3>Tu comunidad autónoma importa</h3>
              <p>
                Partimos de una base común amplia y adaptamos los contenidos
                cuando existen diferencias curriculares entre comunidades.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Asignaturas</p>
            <h2>Elige qué quieres preparar</h2>
          </div>
          <div className={styles.subjectList}>
            {subjects.map((subject) => (
              <span key={subject}>{subject}</span>
            ))}
          </div>
          <div className={styles.actions}>
            <CampaignLink
              campaign={campaign}
              className={styles.secondaryCta}
              href="/bachillerato-pau"
            >
              Ver estado de las asignaturas
            </CampaignLink>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Más que vídeos</p>
            <h2>Explicación, práctica y seguimiento</h2>
          </div>
          <div className={styles.grid3}>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Comprende</p>
              <h3>Temario y explicaciones</h3>
              <p>
                Contenido estructurado, vídeos, esquemas, glosarios y recursos
                para entender cada parte de la asignatura.
              </p>
            </article>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Practica</p>
              <h3>Ejercicios y pruebas</h3>
              <p>
                Test, preguntas cortas, desarrollo, problemas y repasos según
                las necesidades de cada materia.
              </p>
            </article>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Avanza</p>
              <h3>Apoyo para organizarte</h3>
              <p>
                Consulta dudas, comprueba lo aprendido y reajusta el trabajo
                cuando tu ritmo real no coincide con el previsto.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} id="paquetes">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Precio total y claro</p>
            <h2>Elige cómo quieres prepararte</h2>
            <p>
              El importe principal es siempre el precio total que pagas por el
              paquete completo.
            </p>
          </div>

          <div className={styles.grid3}>
            {packages.map((item, index) => (
              <article
                className={`${styles.priceCard} ${index === 1 ? styles.featuredCard : ""}`}
                key={item.name}
              >
                <p className={styles.cardLabel}>{item.detail}</p>
                <h3>{item.name}</h3>
                <span className={styles.price}>{item.price}</span>
                <p className={styles.priceContext}>pago único</p>
                {index === 0 ? (
                  <p className={styles.priceContext}>
                    aprox. 1 €/hora de apoyo durante el curso
                  </p>
                ) : null}
                <p>{item.description}</p>
                <CampaignLink
                  campaign={campaign}
                  className={styles.cardCta}
                  href="/cursos/historia-espana"
                >
                  Ver una ficha de asignatura
                </CampaignLink>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.ctaPanel}>
            <h2>No estudies solamente para el próximo examen</h2>
            <p>
              Construye una base que te sirva durante el curso y añade la PAU
              cuando necesites entrenar específicamente la prueba.
            </p>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/bachillerato-pau"
              >
                Elegir asignatura
              </CampaignLink>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
