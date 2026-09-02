import type { Metadata } from "next";
import Image from "next/image";
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

const learning = [
  ["◉", "Comprensión", "Explicaciones claras para entender cada tema."],
  ["✎", "Práctica", "Ejercicios y test para consolidar lo aprendido."],
  ["▥", "Repaso", "Esquemas, glosarios y revisión antes de cada evaluación."],
  ["▥", "Progreso", "Sigue tu evolución y detecta lo que debes mejorar."],
];

const subjects = [
  ["▤", "Lengua y Literatura"],
  ["▥", "Historia de España"],
  ["φ", "Historia de la Filosofía"],
  ["√x", "Matemáticas II"],
  ["Σ", "Matemáticas CCSS"],
  ["⚛", "Física"],
  ["⚗", "Química"],
];

const courseIncludes = [
  ["▶", "Vídeos", "Clases en vídeo claras y al grano."],
  ["▤", "Temario", "Contenidos completos, actualizados y estructurados."],
  ["✎", "Ejercicios", "Práctica guiada y resuelta paso a paso."],
  ["✓", "Test", "Test por tema y exámenes tipo evaluación."],
  ["●", "Profesor IA", "Ayuda para resolver dudas y entender mejor los conceptos."],
  ["▦", "Tutor IA", "Organización y planificación a medida para ti."],
];

const packages = [
  { name: "Esencial", detail: "Bachillerato", price: "249 €", text: "Para aprender lo importante y trabajar el curso con método." },
  { name: "Estándar", detail: "Bachillerato + PAU", price: "299 €", text: "Añade entrenamiento específico para el examen de acceso.", featured: true },
  { name: "Premium", detail: "Bachillerato + PAU + clases online", price: "399 €", text: "La opción con mayor acompañamiento y refuerzo." },
];

export default async function BachilleratoAdsLanding({
  searchParams,
}: {
  searchParams: Promise<LandingSearchParams>;
}) {
  const campaign = getCampaignParams(await searchParams);

  return (
    <div className={styles.page}>
      <LandingHeader active="bachillerato" campaign={campaign} ctaHref="/bachillerato-pau" ctaLabel="Ver asignaturas" />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Apoyo para 2.º de Bachillerato</p>
            <h1>Aprende, practica y aprueba durante el curso</h1>
            <p className={styles.heroIntro}>Vídeos, temario, ejercicios, test, repasos y apoyo con IA para que no estudies solo para el próximo examen.</p>
            <div className={styles.priceLine}><span>Desde</span><strong>249 €</strong><span>· pago único</span></div>
            <p className={styles.priceNote}>aprox. 1 €/hora de apoyo durante el curso</p>
            <p className={styles.priceNote}>◎ &nbsp; Acceso online durante el curso</p>
            <div className={styles.actions}>
              <CampaignLink campaign={campaign} className={styles.primaryCta} href="/bachillerato-pau">Ver asignaturas</CampaignLink>
              <CampaignLink campaign={campaign} className={styles.secondaryCta} href="/bachillerato-pau">Conocer Bachillerato</CampaignLink>
            </div>
            <ul className={styles.quickFacts}>
              <li><span className={styles.factIcon}>✓</span>Adaptado a tu comunidad</li>
              <li><span className={styles.factIcon}>▦</span>Apoyo durante todo el curso</li>
              <li><span className={styles.factIcon}>▣</span>Acceso online</li>
            </ul>
          </div>
          <div className={styles.heroImage}>
            <Image src="/images/landings/bachillerato-hero.png" alt="Alumno de Bachillerato estudiando con Base12 Academy" fill sizes="(max-width: 880px) 100vw, 58vw" priority />
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}><h2>No se trata solo de memorizar</h2></div>
          <div className={styles.grid4}>{learning.map(([icon, title, text]) => <article className={styles.featureCard} key={title}><span className={styles.icon}>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Elige tu asignatura</h2></div>
          <div className={styles.grid7}>{subjects.map(([icon, title]) => <CampaignLink campaign={campaign} className={styles.subjectCard} href="/bachillerato-pau" key={title}><span className={styles.subjectIcon}>{icon}</span><strong>{title}</strong></CampaignLink>)}</div>

          <div className={styles.sectionHeader} style={{ marginTop: 34 }}><h2>Tu comunidad autónoma importa</h2><p>En Base12 partimos de una base común y adaptamos los contenidos cuando existen diferencias autonómicas.</p></div>
          <div className={styles.communityBand}>
            <div className={styles.communityItem}><span className={styles.icon}>⌖</span><div><strong>Contenidos adaptados</strong><p>Ajustamos temario, ejercicios y recursos a tu comunidad.</p></div></div>
            <div className={styles.communityItem}><span className={styles.icon}>⌘</span><div><strong>Diferencias por comunidad</strong><p>Indicamos qué cambia y cómo afecta a cada tema.</p></div></div>
            <div className={styles.communityItem}><span className={styles.icon}>☷</span><div><strong>Preparación ordenada</strong><p>Planifica tu estudio sabiendo qué entra en tu evaluación.</p></div></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}><h2>Qué incluye tu curso</h2></div>
          <div className={styles.grid6}>{courseIncludes.map(([icon, title, text]) => <article className={styles.subjectCard} key={title}><span className={styles.subjectIcon}>{icon}</span><strong>{title}</strong><p>{text}</p></article>)}</div>

          <div className={styles.sectionHeader} style={{ marginTop: 35 }}><h2>Formas de prepararte</h2></div>
          <div className={styles.grid3}>
            {packages.map((item) => <article className={`${styles.priceCard} ${item.featured ? styles.featuredCard : ""}`} key={item.name}>{item.featured ? <span className={styles.popularTag}>Más elegido</span> : null}<h3>{item.name}</h3><p className={styles.priceContext}>{item.detail}</p><p>{item.text}</p><span className={styles.price}>{item.price}</span>{item.name === "Esencial" ? <p className={styles.priceContext}>aprox. 1 €/hora de apoyo durante el curso</p> : <p className={styles.priceContext}>pago único</p>}<CampaignLink campaign={campaign} className={item.featured ? styles.cardCta : styles.cardCtaOutline} href="/bachillerato-pau">Ver opción</CampaignLink></article>)}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Apoyo inteligente durante el curso</h2></div>
          <div className={styles.supportRow}>
            <article className={styles.supportCard}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, Profesora IA" width={100} height={120} /><div><h3>Rocío · Profesora IA</h3><p>Aclara conceptos y dudas y refuerza explicaciones.</p></div></article>
            <article className={styles.supportCard}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, Tutor IA" width={100} height={120} /><div><h3>Fernando · Tutor IA</h3><p>Te ayuda a organizar el estudio y registrar el plan.</p></div></article>
            <article className={styles.supportCard}><span className={styles.supportBadge}>◇</span><div><h3>Bachillerato + PAU</h3><p>Aprende durante el curso y entrena después el examen.</p></div></article>
          </div>
        </section>

        <section className={styles.ctaBand}>
          <Image className={styles.ctaLogo} src="/images/base12-logo.png" alt="Base12 Academy" width={130} height={78} />
          <div><h2>No estudies solo para el próximo examen.<span>Construye una base para todo el curso.</span></h2><p>Elige tu asignatura y empieza a trabajar con método, práctica y apoyo.</p></div>
          <CampaignLink campaign={campaign} className={styles.primaryCta} href="/bachillerato-pau">Elegir asignatura</CampaignLink>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
