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
  title: "Clases Online en Directo con Profesor Real | Base12 Academy",
  description:
    "Clases particulares a distancia, en directo y con profesor real para Historia y Filosofía en ESO, Bachillerato y universidad. No son clases con IA.",
  alternates: { canonical: "/lp/clases-online" },
};

const schoolBundles = [
  { hours: "5 horas", price: "100 €", perHour: "20 €/hora", key: "5h" },
  { hours: "10 horas", price: "190 €", perHour: "19 €/hora", key: "10h" },
  { hours: "15 horas", price: "280 €", perHour: "18,67 €/hora", key: "15h" },
  { hours: "20 horas", price: "340 €", perHour: "17 €/hora", key: "20h" },
];

const universityBundles = [
  { hours: "5 horas", price: "125 €", key: "5h" },
  { hours: "10 horas", price: "230 €", key: "10h" },
  { hours: "15 horas", price: "300 €", key: "15h" },
  { hours: "20 horas", price: "400 €", key: "20h" },
];

export default async function ClassesAdsLanding({
  searchParams,
}: {
  searchParams: Promise<LandingSearchParams>;
}) {
  const campaign = getCampaignParams(await searchParams);

  return (
    <div className={styles.page}>
      <LandingHeader
        campaign={campaign}
        ctaHref="/?curso=clases-online-eso-bach#catalogo"
        ctaLabel="Ver disponibilidad"
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Clases online · Profesor real</p>
            <h1>Una explicación humana, estés donde estés</h1>
            <p className={styles.heroIntro}>
              Clases a distancia con un profesor real, en directo, para resolver
              dudas, preparar exámenes y comprender la asignatura. No son clases
              con inteligencia artificial.
            </p>
            <div className={styles.heroProof}>
              <span>Profesor real</span>
              <span>Sesiones en directo</span>
              <span>60 minutos por clase</span>
            </div>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/?curso=clases-online-eso-bach#catalogo"
              >
                Consultar disponibilidad
              </CampaignLink>
              <Link className={styles.secondaryCta} href="#bonos">
                Ver bonos
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <strong>En directo</strong>
            <p>Pregunta, comparte tu pantalla y trabaja tu problema concreto.</p>
            <ul>
              <li>Videollamada mediante Google Meet</li>
              <li>Material compartido en Google Classroom</li>
              <li>Seguimiento adaptado al alumno</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Apoyo personalizado</p>
            <h2>Una clase para tu necesidad concreta</h2>
            <p>
              No tienes que seguir un curso cerrado. Utiliza tus horas para
              entender un tema, preparar una recuperación, revisar apuntes,
              trabajar comentarios de texto o resolver dudas antes de un examen.
            </p>
          </div>

          <div className={styles.grid3}>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Antes de empezar</p>
              <h3>Revisamos tu solicitud</h3>
              <p>
                Comprobamos personalmente que podemos ayudarte con el curso, la
                asignatura y el material que estás utilizando.
              </p>
            </article>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Durante la clase</p>
              <h3>Hablas con tu profesor</h3>
              <p>
                La sesión es una videollamada real y en directo. Puedes preguntar,
                responder y trabajar sobre tus documentos.
              </p>
            </article>
            <article className={styles.featureCard}>
              <p className={styles.cardLabel}>Después</p>
              <h3>Tus horas siguen siendo tuyas</h3>
              <p>
                Los bonos son válidos durante dos meses y puedes modificar una
                reserva hasta 30 minutos antes si existe otro horario disponible.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} id="bonos">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>ESO y Bachillerato</p>
            <h2>Historia y Filosofía</h2>
            <p>Elige el bono que mejor encaja con el apoyo que necesitas.</p>
          </div>

          <div className={styles.grid4}>
            {schoolBundles.map((bundle) => (
              <article className={styles.priceCard} key={bundle.key}>
                <p className={styles.cardLabel}>Bono en directo</p>
                <h3>{bundle.hours}</h3>
                <span className={styles.price}>{bundle.price}</span>
                <p className={styles.priceContext}>{bundle.perHour}</p>
                <ul className={styles.checkList}>
                  <li>Profesor real</li>
                  <li>Google Meet y Classroom</li>
                  <li>Historia y/o Filosofía</li>
                </ul>
                <CampaignLink
                  campaign={campaign}
                  className={styles.cardCta}
                  href={`/?curso=clases-online-eso-bach&bono=${bundle.key}#catalogo`}
                >
                  Ver agenda y reservar
                </CampaignLink>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Universidad</p>
            <h2>Historia con apoyo especializado</h2>
            <p>
              Para asignaturas universitarias, preparación de contenidos,
              revisión conceptual y apoyo académico especializado.
            </p>
          </div>

          <div className={styles.grid4}>
            {universityBundles.map((bundle) => (
              <article className={styles.priceCard} key={bundle.key}>
                <p className={styles.cardLabel}>Historia · Universidad</p>
                <h3>{bundle.hours}</h3>
                <span className={styles.price}>{bundle.price}</span>
                <p className={styles.priceContext}>pago único</p>
                <CampaignLink
                  campaign={campaign}
                  className={styles.cardCta}
                  href={`/?curso=clases-online-universidad&bono=${bundle.key}#catalogo`}
                >
                  Consultar agenda
                </CampaignLink>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Horario ordinario</p>
              <h2>Reserva según la agenda disponible</h2>
              <p>
                De lunes a jueves, de 15:00 a 21:00. Los viernes, de 15:00 a
                19:00. Las sesiones empiezan en horas completas y duran 60
                minutos.
              </p>
            </div>
            <div className={styles.accentPanel}>
              <h3>¿Necesitas otra asignatura?</h3>
              <p>
                Envía una solicitud indicando curso, asignatura, comunidad y el
                material que utilizas. Revisaremos si podemos atenderla.
              </p>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/?curso=clases-online-solicitud#catalogo"
              >
                Solicitar disponibilidad
              </CampaignLink>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.ctaPanel}>
            <h2>Cuando un vídeo no basta, pregunta directamente</h2>
            <p>
              Elige tu bono, consulta el calendario y reserva una clase online
              en directo con un profesor real.
            </p>
            <div className={styles.actions}>
              <CampaignLink
                campaign={campaign}
                className={styles.primaryCta}
                href="/?curso=clases-online-eso-bach#catalogo"
              >
                Ver disponibilidad y reservar
              </CampaignLink>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter campaign={campaign} />
    </div>
  );
}
