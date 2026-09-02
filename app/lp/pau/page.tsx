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
  title: "Preparación PAU Online por Comunidad Autónoma | Base12 Academy",
  description:
    "Prepara la PAU por asignatura y comunidad autónoma con modelos de examen, ejercicios, simulacros, correcciones y estrategia.",
  alternates: { canonical: "/lp/pau" },
};

const examFeatures = [
  ["▤", "Modelo de examen", "Comprende la estructura de la PAU y su formato."],
  ["✎", "Práctica", "Ejercicios y entrenamiento en lo que te van a evaluar."],
  ["◷", "Simulacros", "Entrena bajo condiciones reales de examen."],
  ["✓", "Corrección", "Corrección con feedback para mejorar tu nota."],
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

const preparationIncludes = [
  ["▤", "Modelos", "Modelos oficiales de tu comunidad."],
  ["✎", "Ejercicios", "Entrenamiento guiado y práctico."],
  ["◷", "Simulacros", "Simulacros cronometrados y por temario."],
  ["✓", "Corrección", "Corrección experta y feedback claro."],
  ["●", "Profesor real", "Atención docente y resolución de dudas."],
  ["▦", "Tutor IA", "Organiza tu estudio y planifica tu plan."],
];

const formats = [
  { name: "PAU", detail: "Solo examen", text: "Entrena de forma específica para el examen de acceso. Enfocado, práctico y estratégico." },
  { name: "Estándar", detail: "Bachillerato + PAU", text: "Aprende durante el curso y rinde preparando tu estrategia de PAU con modelos y simulacros.", featured: true },
  { name: "Premium", detail: "Bachillerato, PAU y clases online", text: "La opción con máximo apoyo. Clases online y refuerzo personalizado para la PAU." },
];

export default async function PauAdsLanding({
  searchParams,
}: {
  searchParams: Promise<LandingSearchParams>;
}) {
  const campaign = getCampaignParams(await searchParams);

  return (
    <div className={styles.page}>
      <LandingHeader active="pau" campaign={campaign} ctaHref="/bachillerato-pau" ctaLabel="Ver asignaturas" />

      <main className={styles.main}>
        <section className={`${styles.hero} ${styles.heroCompact}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Preparación específica de PAU</p>
            <h1>La PAU no se prepara igual que Bachillerato</h1>
            <p className={styles.heroIntro}>En Base12 te ayudamos a entrenar el examen real de tu comunidad con modelos oficiales, práctica con método, correcciones y estrategia para llegar al día final.</p>
            <div className={styles.heroOffer}>
              <div><strong>Preparación por pago único</strong><div className={styles.offerPrice}>199 €</div></div>
              <ul><li>Acceso online hasta el examen</li><li>Simulacros y correcciones</li><li>Materiales y recursos actualizados</li><li>Preparación específica por CCAA</li></ul>
            </div>
            <div className={styles.actions}>
              <CampaignLink campaign={campaign} className={styles.primaryCta} href="/bachillerato-pau">Ver asignaturas</CampaignLink>
              <CampaignLink campaign={campaign} className={styles.secondaryCta} href="/bachillerato-pau">Conocer la preparación</CampaignLink>
            </div>
            <ul className={styles.quickFacts}>
              <li><span className={styles.factIcon}>⌖</span>Modelos por comunidad</li>
              <li><span className={styles.factIcon}>▦</span>Simulacros y corrección</li>
              <li><span className={styles.factIcon}>▣</span>Acceso online</li>
            </ul>
          </div>
          <div className={styles.heroImage}>
            <Image src="/images/landings/pau-hero.png" alt="Alumno entrenando un simulacro de PAU" fill sizes="(max-width: 880px) 100vw, 58vw" priority />
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}><h2>No basta con saberse la asignatura</h2></div>
          <div className={styles.grid4}>{examFeatures.map(([icon, title, text]) => <article className={styles.subjectCard} key={title}><span className={styles.subjectIcon}>{icon}</span><strong>{title}</strong><p>{text}</p></article>)}</div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Elige tu asignatura</h2></div>
          <div className={styles.grid7}>{subjects.map(([icon, title]) => <CampaignLink campaign={campaign} className={styles.subjectCard} href="/bachillerato-pau" key={title}><span className={styles.subjectIcon}>{icon}</span><strong>{title}</strong></CampaignLink>)}</div>

          <div className={styles.sectionHeader} style={{ marginTop: 34 }}><h2>Tu comunidad autónoma importa</h2><p>En Base12 adaptamos la preparación de PAU cuando cambia el modelo de examen según la comunidad.</p></div>
          <div className={styles.communityBand}>
            <div className={styles.communityItem}><span className={styles.icon}>⌖</span><div><strong>Estructura de la prueba</strong><p>Adaptamos los bloques, opciones y tiempos a tu comunidad.</p></div></div>
            <div className={styles.communityItem}><span className={styles.icon}>⚖</span><div><strong>Criterios de corrección</strong><p>Aplicamos los criterios oficiales para que sumes más puntos.</p></div></div>
            <div className={styles.communityItem}><span className={styles.icon}>☷</span><div><strong>Modelos y práctica</strong><p>Trabajamos con modelos oficiales y ejercicios reales.</p></div></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className={styles.sectionHeader}><h2>Qué incluye tu preparación</h2></div>
          <div className={styles.grid6}>{preparationIncludes.map(([icon, title, text]) => <article className={styles.subjectCard} key={title}><span className={styles.subjectIcon}>{icon}</span><strong>{title}</strong><p>{text}</p></article>)}</div>

          <div className={styles.sectionHeader} style={{ marginTop: 35 }}><h2>Formas de prepararte</h2></div>
          <div className={styles.grid3}>
            {formats.map((item) => <article className={`${styles.priceCard} ${item.featured ? styles.featuredCard : ""}`} key={item.name}>{item.featured ? <span className={styles.popularTag}>Más elegido</span> : null}<h3>{item.name}</h3><p className={styles.priceContext}>{item.detail}</p><p>{item.text}</p><span className={styles.price}>Desde 199 €</span><p className={styles.priceContext}>pago único</p><CampaignLink campaign={campaign} className={item.featured ? styles.cardCta : styles.cardCtaOutline} href="/bachillerato-pau">Ver asignatura</CampaignLink></article>)}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Apoyo inteligente hasta el examen</h2></div>
          <div className={styles.supportRow}>
            <article className={styles.supportCard}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, Profesora IA" width={100} height={120} /><div><h3>Rocío · Profesora IA</h3><p>Aclara conceptos y resuelve dudas sobre la asignatura en cualquier momento.</p></div></article>
            <article className={styles.supportCard}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, Tutor IA" width={100} height={120} /><div><h3>Fernando · Tutor IA</h3><p>Te ayuda a organizar tu tiempo y avanzar según tu plan hasta el día de la PAU.</p></div></article>
            <article className={styles.supportCard}><span className={styles.supportBadge}>◇</span><div><h3>Entrenamiento PAU</h3><p>Convertimos el conocimiento en rendimiento real en el examen.</p></div></article>
          </div>
        </section>

        <section className={styles.ctaBand}>
          <Image className={styles.ctaLogo} src="/images/base12-logo.png" alt="Base12 Academy" width={130} height={78} />
          <div><h2>No llegues a la PAU solo con teoría.<span>Entrena el examen para mejorar tu nota.</span></h2><p>Elige tu asignatura y prepárate con método, práctica y estrategia.</p></div>
          <CampaignLink campaign={campaign} className={styles.primaryCta} href="/bachillerato-pau">Elegir asignatura</CampaignLink>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
