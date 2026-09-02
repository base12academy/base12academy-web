import type { Metadata } from "next";
import Image from "next/image";
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
import { tropaPlans } from "@/lib/tropa-commercial";

export const metadata: Metadata = {
  title: "Curso Tropa y Marinería Online | Base12 Academy",
  description:
    "Prepara los psicotécnicos de Tropa y Marinería con entrenamiento progresivo, siete aptitudes, simulacros y seguimiento de tu evolución.",
  alternates: { canonical: "/lp/tropa-y-marineria" },
};

const aptitudeNames = [
  "Aptitud Verbal",
  "Aptitud Numérica",
  "Aptitud Espacial",
  "Aptitud Mecánica",
  "Aptitud Perceptiva",
  "Memoria",
  "Razonamiento Abstracto",
];

export default async function TropaAdsLanding({
  searchParams,
}: {
  searchParams: Promise<LandingSearchParams>;
}) {
  const campaign = getCampaignParams(await searchParams);
  const plans = tropaPlans.filter((product) => product.kind === "plan");
  const aptitudes = tropaPlans.filter((product) => product.kind === "aptitude");
  const training = tropaPlans.find((product) => product.kind === "training");

  return (
    <div className={styles.page}>
      <LandingHeader
        campaign={campaign}
        ctaHref="#modalidades"
        ctaLabel="Ver modalidades"
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Tropa y Marinería</p>
            <h1>Prepárate entrenando de verdad</h1>
            <p className={styles.heroIntro}>
              Miles de ejercicios psicotécnicos, práctica organizada por
              aptitudes, explicaciones y entrenamiento progresivo para llegar a
              las pruebas con método, velocidad y seguridad.
            </p>
            <div className={styles.heroProof}>
              <span>Desde 139 €</span>
              <span>Pago único</span>
              <span>Acceso durante 12 meses</span>
            </div>
            <div className={styles.actions}>
              <Link className={styles.primaryCta} href="#modalidades">
                Ver modalidades
              </Link>
              <CampaignLink
                campaign={campaign}
                className={styles.secondaryCta}
                href="/tropa-y-marineria"
              >
                Conocer el curso
              </CampaignLink>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <strong>28.000</strong>
            <p>preguntas en la preparación de mayor alcance</p>
            <ul>
              <li>Siete aptitudes psicotécnicas</li>
              <li>Práctica progresiva y simulacros</li>
              <li>Explicaciones para aprender de cada error</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>No se trata solo de hacer test</p>
              <h2>Comprende, practica y gana velocidad</h2>
              <p>
                En una prueba psicotécnica no basta con conocer la respuesta.
                Necesitas reconocer el ejercicio, elegir el procedimiento,
                evitar errores frecuentes y mantener la concentración bajo
                presión.
              </p>
            </div>
            <div className={styles.accentPanel}>
              <h3>Entrena las siete aptitudes</h3>
              <p>
                Cada bloque trabaja una capacidad concreta y permite reforzar
                las áreas en las que más tiempo o precisión pierdes.
              </p>
              <div className={styles.aptitudeList}>
                {aptitudeNames.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="modalidades">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Preparación completa</p>
            <h2>Tres formas de prepararte</h2>
            <p>
              Empieza por el nivel que necesitas. Si después amplías tu
              preparación, mantienes el progreso y solo pagas la diferencia.
            </p>
          </div>

          <div className={styles.grid3}>
            {plans.map((plan, index) => (
              <article
                className={`${styles.priceCard} ${index === 1 ? styles.featuredCard : ""}`}
                key={plan.slug}
              >
                <p className={styles.cardLabel}>Preparación completa</p>
                <h3>{plan.name}</h3>
                <div className={styles.price}>
                  {"previousPrice" in plan && plan.previousPrice ? (
                    <span className={styles.oldPrice}>{plan.previousPrice}</span>
                  ) : null}
                  {plan.currentPrice}
                </div>
                <p className={styles.priceContext}>pago único</p>
                <p>{plan.description}</p>
                <ul className={styles.checkList}>
                  {plan.includes.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <CampaignLink
                  campaign={campaign}
                  className={styles.cardCta}
                  href={`/tropa-y-marineria/${plan.slug}#contratar`}
                >
                  Elegir {plan.name}
                </CampaignLink>
                <CampaignLink
                  campaign={campaign}
                  className={styles.textLink}
                  href={`/tropa-y-marineria/${plan.slug}`}
                >
                  Ver contenido
                </CampaignLink>
              </article>
            ))}
          </div>

          <p className={styles.note}>
            <strong>Ampliación acumulativa:</strong> de Esencial a Operativa y
            de Operativa a Integral se conserva lo adquirido y se paga
            únicamente la diferencia correspondiente.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Entrenamiento independiente</p>
            <h2>Refuerza una aptitud concreta por 39 €</h2>
            <p>
              Las siete aptitudes también se pueden contratar de forma
              independiente, con su propio entrenamiento, talleres, juegos y
              simulacros.
            </p>
          </div>

          <div className={styles.grid4}>
            {aptitudes.map((aptitude) => (
              <article className={styles.priceCard} key={aptitude.slug}>
                <p className={styles.cardLabel}>Por aptitud</p>
                <h3>{aptitude.name}</h3>
                <span className={styles.price}>{aptitude.currentPrice}</span>
                <p>{aptitude.description}</p>
                <CampaignLink
                  campaign={campaign}
                  className={styles.cardCta}
                  href={`/tropa-y-marineria/${aptitude.slug}#contratar`}
                >
                  Contratar aptitud
                </CampaignLink>
              </article>
            ))}

            {training ? (
              <article className={`${styles.priceCard} ${styles.trainingCard}`}>
                <p className={styles.cardLabel}>Preparación física</p>
                <Image
                  className={styles.trainingLogo}
                  src="/images/banco-opositores/logo-base12-training.png"
                  alt="Base12 Training"
                  width={150}
                  height={150}
                />
                <h3>{training.name}</h3>
                <span className={styles.price}>{training.currentPrice}</span>
                <p>{training.description}</p>
                <CampaignLink
                  campaign={campaign}
                  className={styles.cardCta}
                  href={`/tropa-y-marineria/${training.slug}#contratar`}
                >
                  Contratar preparación física
                </CampaignLink>
              </article>
            ) : null}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.ctaPanel}>
            <h2>El examen será el mismo. Tu preparación puede ser diferente.</h2>
            <p>
              Elige una preparación completa o trabaja de forma independiente
              la aptitud que necesitas reforzar.
            </p>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/tropa-y-marineria"
              >
                Prepararme para Tropa y Marinería
              </CampaignLink>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
