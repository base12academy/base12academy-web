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

const learningFeatures = [
  ["▣", "Explicación", "Entiende el porqué de cada respuesta con explicaciones claras y didácticas."],
  ["✎", "Práctica", "Miles de ejercicios y simulacros para entrenar tu mente como en el examen."],
  ["✓", "Corrección", "Corrección pedagógica que te enseña de tus errores y te hace mejorar."],
  ["▥", "Progreso", "Estadísticas y seguimiento para medir tu evolución y seguir mejorando."],
];

const answerBenefits = [
  ["◆", "Corrección pedagógica", "Entiende por qué fallas y aprende la clave para acertar."],
  ["!", "Errores frecuentes", "Identifica los fallos típicos y evita caer en ellos."],
  ["★", "Mejora real", "Gana velocidad, seguridad y confianza para el día del examen."],
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
        active="tropa"
        campaign={campaign}
        ctaHref="#modalidades"
        ctaLabel="Ver modalidades"
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Preparación online</p>
            <h1>Prepárate para Tropa y Marinería entrenando de verdad</h1>
            <p className={styles.heroIntro}>
              Psicotécnicos, práctica progresiva, explicaciones y miles de
              ejercicios para llegar a las pruebas con método, velocidad y
              seguridad.
            </p>
            <div className={styles.priceLine}>
              <span>Desde</span><strong>139 €</strong><span>· pago único</span>
            </div>
            <p className={styles.priceNote}>Sin cuotas mensuales</p>
            <div className={styles.actions}>
              <Link className={styles.primaryCta} href="#modalidades">Ver modalidades</Link>
              <CampaignLink campaign={campaign} className={styles.secondaryCta} href="/tropa-y-marineria">
                Conocer el curso
              </CampaignLink>
            </div>
            <ul className={styles.quickFacts}>
              <li><span className={styles.factIcon}>?</span>14.000 a 28.000 preguntas</li>
              <li><span className={styles.factIcon}>◎</span>Entrenamiento por aptitudes</li>
              <li><span className={styles.factIcon}>▣</span>Acceso online</li>
            </ul>
          </div>
          <div className={styles.heroImage}>
            <Image src="/images/landings/tropa-hero.png" alt="Alumno entrenando psicotécnicos para Tropa y Marinería" fill sizes="(max-width: 880px) 100vw, 58vw" priority />
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}><h2>No se trata solo de hacer test</h2></div>
          <div className={styles.grid4}>
            {learningFeatures.map(([icon, title, text]) => (
              <article className={styles.featureCard} key={title}>
                <span className={styles.icon}>{icon}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="modalidades">
          <div className={styles.sectionHeader}><h2>Paquetes y aptitudes</h2></div>
          <div className={styles.grid4}>
            {plans.map((plan) => (
              <article className={styles.priceCard} key={plan.slug}>
                <p className={styles.cardLabel}>Preparación completa</p>
                <h3>{plan.name}</h3>
                <span className={styles.price}>
                  {plan.previousPrice ? <span className={styles.oldPrice}>{plan.previousPrice}</span> : null}
                  {plan.currentPrice}
                </span>
                <span className={styles.discount}>40 € de descuento</span>
                <p>{plan.description}</p>
                <ul className={styles.checkList}>{plan.includes.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                <div className={styles.cardActions}>
                  <CampaignLink campaign={campaign} className={styles.cardCta} href={`/tropa-y-marineria/${plan.slug}`}>Ver contenido</CampaignLink>
                  <CampaignLink campaign={campaign} className={styles.cardCtaOutline} href={`/tropa-y-marineria/${plan.slug}#contratar`}>Contratar ahora</CampaignLink>
                </div>
              </article>
            ))}

            {training ? (
              <article className={`${styles.priceCard} ${styles.trainingCard}`}>
                <p className={styles.cardLabel}>Aplicación de preparación física</p>
                <Image className={styles.trainingLogo} src="/images/banco-opositores/logo-base12-training.png" alt="Base12 Training" width={120} height={110} />
                <h3>{training.name}</h3>
                <span className={styles.price}>{training.currentPrice}</span>
                <p>{training.description}</p>
                <ul className={styles.checkList}>{training.includes.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                <div className={styles.cardActions}>
                  <CampaignLink campaign={campaign} className={styles.cardCta} href={`/tropa-y-marineria/${training.slug}`}>Ver contenido</CampaignLink>
                  <CampaignLink campaign={campaign} className={styles.cardCtaOutline} href={`/tropa-y-marineria/${training.slug}#contratar`}>Contratar ahora</CampaignLink>
                </div>
              </article>
            ) : null}
          </div>

          <div className={styles.sectionHeader} style={{ marginTop: 34 }}><h2>Entrena por aptitud</h2></div>
          <div className={styles.aptitudeGrid}>
            {aptitudes.map((aptitude) => (
              <article className={`${styles.priceCard} ${styles.compactCard}`} key={aptitude.slug}>
                <p className={styles.cardLabel}>Por aptitud</p>
                <h3>{aptitude.name}</h3>
                <span className={styles.price}>{aptitude.currentPrice}</span>
                <p>{aptitude.description}</p>
                <ul className={styles.checkList}>{aptitude.includes.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                <div className={styles.cardActions}>
                  <CampaignLink campaign={campaign} className={styles.cardCta} href={`/tropa-y-marineria/${aptitude.slug}`}>Ver contenido</CampaignLink>
                  <CampaignLink campaign={campaign} className={styles.cardCtaOutline} href={`/tropa-y-marineria/${aptitude.slug}#contratar`}>Contratar ahora</CampaignLink>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.upgradeBand}>
            <div><h2>Amplía cuando quieras</h2><p>Si empiezas por Esencial y quieres pasar a Operativa, solo pagas 70 €. Si pasas de Operativa a Integral, solo pagas otros 70 €.</p></div>
            <div className={styles.upgradeFlow}>
              <div className={styles.upgradeStep}>Esencial<strong>139 €</strong></div><span className={styles.upgradeArrow}>+70 € →</span>
              <div className={styles.upgradeStep}>Operativa<strong>209 €</strong></div><span className={styles.upgradeArrow}>+70 € →</span>
              <div className={styles.upgradeStep}>Integral<strong>279 €</strong></div>
            </div>
          </div>

          <div className={styles.sectionHeader} style={{ marginTop: 30 }}><h2>Cada respuesta debe enseñarte algo</h2></div>
          <div className={styles.benefitRow}>
            {answerBenefits.map(([icon, title, text]) => <article className={styles.benefit} key={title}><span className={styles.icon}>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </section>

        <section className={styles.ctaBand}>
          <Image className={styles.ctaLogo} src="/images/base12-logo.png" alt="Base12 Academy" width={130} height={78} />
          <div><h2>El examen será el mismo.<span>Tu preparación puede ser diferente.</span></h2><p>Esencial 139 € · Operativa 209 € · Integral 279 €</p></div>
          <CampaignLink campaign={campaign} className={styles.primaryCta} href="/tropa-y-marineria">Prepararme para Tropa y Marinería</CampaignLink>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
