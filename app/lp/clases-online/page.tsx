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

export const metadata: Metadata = {
  title: "Clases Online en Directo con Profesor Real | Base12 Academy",
  description:
    "Clases particulares a distancia, en directo y con profesor real para Historia y Filosofía en ESO y Bachillerato. No son clases con IA.",
  alternates: { canonical: "/lp/clases-online" },
};

const humanFeatures = [
  ["●", "Profesor real", "Profesores expertos en Historia y Filosofía con experiencia docente."],
  ["▶", "Explicación en directo", "Clases en tiempo real con explicación clara y ejemplos prácticos."],
  ["?", "Resolución de dudas", "Responde tus preguntas al momento y refuerza lo que más te cuesta."],
  ["▥", "Seguimiento personalizado", "Adaptamos la clase a tu nivel y objetivos y te acompañamos en tu progreso."],
];

const steps = [
  ["✎", "Cuéntanos qué necesitas", "Elige la materia, el tema y cuéntanos tus objetivos."],
  ["⌕", "Revisamos tu solicitud", "Analizamos tu caso y te proponemos la mejor opción."],
  ["▦", "Confirmamos la clase", "Te asignamos profesor y confirmamos día y hora."],
  ["▣", "Te conectas por Google Meet", "Accedes a tu clase en directo desde donde estés."],
];

const subjects = [
  ["▥", "Historia", "Comprende procesos, hechos y contextos históricos."],
  ["φ", "Filosofía", "Entiende corrientes, autores e ideas clave de la filosofía."],
  ["≡", "Comentarios de texto", "Analiza y comenta textos históricos y filosóficos con soltura."],
  ["◇", "Preparación de exámenes", "Prepara exámenes y pruebas con garantías."],
  ["↻", "Recuperaciones", "Refuerza lo visto y supera tus recuperaciones."],
  ["◎", "Organización del estudio", "Mejora tu método, planifica y gana eficiencia."],
];

const bundles = [
  { hours: "5 horas", price: "100 €", perHour: "20 €/hora", key: "5h" },
  { hours: "10 horas", price: "190 €", perHour: "19 €/hora", key: "10h", featured: true },
  { hours: "15 horas", price: "280 €", perHour: "18,67 €/hora", key: "15h" },
  { hours: "20 horas", price: "340 €", perHour: "17 €/hora", key: "20h" },
];

export default async function ClassesAdsLanding({
  searchParams,
}: {
  searchParams: Promise<LandingSearchParams>;
}) {
  const campaign = getCampaignParams(await searchParams);

  return (
    <div className={styles.page}>
      <LandingHeader active="clases" campaign={campaign} ctaHref="#bonos" ctaLabel="Ver bonos" />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Clases a distancia</p>
            <h1>Clases online con profesor real</h1>
            <p className={styles.heroSubtitle}>No son clases con IA</p>
            <p className={styles.heroIntro}>
              Clases online en directo de Historia y Filosofía con profesor
              experto. Explicación clara, resolución de dudas en tiempo real y
              seguimiento personalizado para que alcances tus objetivos.
            </p>
            <div className={styles.priceLine}><span>Desde</span><strong>20 €</strong><span>/ hora</span></div>
            <p className={styles.priceNote}>sesiones en directo por Google Meet</p>
            <div className={styles.actions}>
              <Link className={styles.primaryCta} href="#bonos">Ver bonos</Link>
              <CampaignLink campaign={campaign} className={styles.secondaryCta} href="/?curso=clases-online-solicitud#catalogo">Consultar disponibilidad</CampaignLink>
            </div>
            <ul className={styles.quickFacts}>
              <li><span className={styles.factIcon}>●</span>Profesor real</li>
              <li><span className={styles.factIcon}>◉</span>En directo</li>
              <li><span className={styles.factIcon}>▣</span>A distancia</li>
            </ul>
          </div>
          <div className={styles.heroImage}>
            <Image src="/images/landings/clases-hero.png" alt="Clase online en directo con un profesor real" fill sizes="(max-width: 880px) 100vw, 58vw" priority />
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}>
            <h2>No son clases con IA</h2>
            <p>Todas nuestras clases son impartidas por un profesor real, en directo, que explica, responde, se adapta a ti e interactúa en tiempo real.</p>
          </div>
          <div className={styles.grid4}>
            {humanFeatures.map(([icon, title, text]) => <article className={styles.featureCard} key={title}><span className={styles.icon}>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Cómo funciona</h2></div>
          <div className={styles.grid4}>
            {steps.map(([icon, title, text], index) => <article className={styles.stepCard} key={title}><span className={styles.stepNumber}>{index + 1}</span><span className={styles.icon}>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}><h2>Qué puedes trabajar</h2></div>
          <div className={styles.grid6}>
            {subjects.map(([icon, title, text]) => <article className={styles.subjectCard} key={title}><span className={styles.subjectIcon}>{icon}</span><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className={styles.section} id="bonos">
          <div className={styles.sectionHeader}><h2>Elige tu bono</h2><p>Clases online en directo con profesor real para Historia y Filosofía (ESO y Bachillerato)</p></div>
          <div className={styles.grid4}>
            {bundles.map((bundle) => (
              <article className={`${styles.priceCard} ${bundle.featured ? styles.featuredCard : ""}`} key={bundle.key}>
                {bundle.featured ? <span className={styles.popularTag}>Más elegido</span> : null}
                <h3>{bundle.hours}</h3>
                <span className={styles.price}>{bundle.price}</span>
                <p className={styles.priceContext}>{bundle.perHour}</p>
                <ul className={styles.checkList}><li>Clases de 60 minutos</li><li>Profesor real en directo</li><li>Flexibilidad horaria</li><li>Vigencia de 2 meses</li></ul>
                <CampaignLink campaign={campaign} className={bundle.featured ? styles.cardCta : styles.cardCtaOutline} href={`/?curso=clases-online-eso-bach&bono=${bundle.key}#catalogo`}>Elegir bono</CampaignLink>
              </article>
            ))}
          </div>

          <div className={styles.sectionHeader} style={{ marginTop: 27, marginBottom: 12 }}><h2 style={{ fontSize: 25 }}>Información importante</h2></div>
          <div className={styles.infoBand}>
            <div className={styles.infoItem}><span className={styles.icon}>◷</span><div><strong>Clases de 60 minutos</strong><p>Sesiones individuales de 60 minutos.</p></div></div>
            <div className={styles.infoItem}><span className={styles.icon}>▣</span><div><strong>Bonos con vigencia de 2 meses</strong><p>Desde la fecha de la primera clase.</p></div></div>
            <div className={styles.infoItem}><span className={styles.icon}>◴</span><div><strong>Horario</strong><p>L-J 15:00–21:00 · V 15:00–19:00.</p></div></div>
            <div className={styles.infoItem}><span className={styles.icon}>♙</span><div><strong>Reserva sujeta a disponibilidad</strong><p>Las clases se confirman según disponibilidad.</p></div></div>
          </div>
        </section>

        <section className={styles.ctaBand}>
          <Image className={styles.ctaLogo} src="/images/base12-logo.png" alt="Base12 Academy" width={130} height={78} />
          <div><h2>Cuando necesitas una <span>explicación humana, marca la diferencia</span></h2><p>Clases online a distancia, en directo y con profesor real.</p></div>
          <CampaignLink campaign={campaign} className={styles.primaryCta} href="/?curso=clases-online-eso-bach#catalogo">Reservar clases online</CampaignLink>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
