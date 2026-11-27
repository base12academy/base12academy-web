import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import OppositionDetailActions from "@/components/banco-opositores/OppositionDetailActions";
import { boeOrganisation } from "@/lib/boe-details";
import {
  applicationStatus,
  formatOfficialDate,
  getOppositionCall,
  missingOfficialValue,
} from "@/lib/oppositions";
import styles from "../../banco.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getOppositionCall(slug);
  if (!result) return { title: "Convocatoria no encontrada | Banco de Opositores" };
  const organisation = boeOrganisation(result.call.title, result.call.organisation);
  const title = `${result.officialDetails?.headline ? `${result.officialDetails.headline} · ${organisation || ""}` : result.call.title} · ${result.call.source_external_id}`;
  const description = `${result.call.source_external_id}: ${organisation || ""}. ${result.officialDetails?.summary || result.call.title}`;
  return {
    title: `${title} | Banco de Opositores`,
    description: description.slice(0, 158),
    alternates: { canonical: `/banco-opositores/convocatoria/${slug}` },
    openGraph: { title, description: description.slice(0, 158), type: "article" },
  };
}

export default async function OppositionDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getOppositionCall(slug);
  if (!result) notFound();
  const { call, publications, officialDetails } = result;
  const organisation = boeOrganisation(call.title, call.organisation);
  const registration = applicationStatus(call);
  const courseHref = call.base12_course_slug === "tropa-y-marineria" ? "/tropa-y-marineria" : "/cursos";

  const facts = [
    ["Referencia oficial", call.source_external_id],
    ["Plazas", call.vacancies],
    ["Grupo / categoría", call.group_category || officialDetails?.category],
    ["Especialidad", officialDetails?.specialty || call.specialty],
    ["Identificador de la plaza", officialDetails?.positionId],
    ["Titulación requerida", officialDetails?.education],
    ["Sistema de acceso", call.access_system],
    ["Fecha de publicación", formatOfficialDate(call.publication_date)],
    ["Inicio del plazo", call.application_start ? formatOfficialDate(call.application_start) : null],
    ["Fin del plazo", call.application_end ? formatOfficialDate(call.application_end) : null],
    ["Plazo según la publicación", officialDetails?.applicationPeriod],
    ["Fecha de examen", call.exam_date ? formatOfficialDate(call.exam_date) : null],
    ["Órgano convocante", organisation],
    ["Administración", call.administration],
    ["Territorio", [call.territory, call.province, call.locality].filter(Boolean).join(" · ")],
  ] as const;

  return (
    <div className={styles.bancoPage}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/banco-opositores" className={styles.brand}>
            <Image src="/images/banco-opositores/logo-banco-opositores.png" alt="B12 Banco de Opositores" width={56} height={56} priority />
            <span><b>Banco de Opositores</b><small>Convocatorias de oposiciones y empleo público</small></span>
          </Link>
          <nav aria-label="Banco de Opositores"><Link href="/banco-opositores">Buscar</Link><Link href="/banco-opositores/alertas">♧ Alertas</Link></nav>
        </div>
      </header>

      <main className={styles.detailMain}>
        <nav className={styles.breadcrumbs} aria-label="Migas de pan">
          <Link href="/">Base12 Academy</Link><span>›</span><Link href="/banco-opositores">Banco de Opositores</Link><span>›</span><span>{call.territory}</span>
        </nav>

        <section className={styles.detailHeader}>
          <div>
            <h1>{officialDetails?.headline || call.title}</h1>
            {officialDetails?.headline && <p>{call.title}</p>}
            <h2>{organisation || "Consulta el organismo en la publicación oficial"}</h2>
            <div className={styles.detailMeta}><span>▣ {call.group_category || "Grupo no indicado"}</span><span>⌖ {call.territory}</span><span>◷ {call.status}</span><span>Fuente: {call.bulletin_name}</span></div>
          </div>
          <div>
            <div className={styles.statusBox}>{officialDetails?.applicationPeriod && !call.application_end ? "Plazo indicado en el anuncio" : registration.label}<small>{call.application_end ? `Hasta el ${formatOfficialDate(call.application_end)}` : "Consulta el plazo literal y las actualizaciones oficiales"}</small></div>
            <div className={styles.detailActions}><OppositionDetailActions callId={call.id} callTitle={call.title} territory={call.territory} /></div>
          </div>
        </section>

        <div className={styles.detailGrid}>
          <div className={styles.detailContent}>
            <section className={styles.detailCard}>
              <h2>Datos de la convocatoria</h2>
              <dl className={styles.factGrid}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{missingOfficialValue(value)}</dd></div>)}</dl>
            </section>

            <section className={styles.detailCard}>
              <h2>Orientación para la inscripción</h2>
              <p>Realiza los trámites personalmente ante el organismo convocante. Base12 Academy informa y orienta; no presenta solicitudes ni gestiona pagos.</p>
              <dl className={styles.factGrid}>{[
                ["Tasas de examen", officialDetails?.fees],
                ["Exenciones y bonificaciones", officialDetails?.exemptions],
                ["Documentación", officialDetails?.documentation],
                ["Procedimiento de pago", officialDetails?.payment],
              ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{missingOfficialValue(value)}</dd></div>)}</dl>
              <ol><li>Consulta las bases completas y sus rectificaciones.</li><li>Comprueba los requisitos, el plazo y la documentación.</li><li>Accede al procedimiento oficial y abona las tasas si corresponde.</li><li>Firma y registra la solicitud según las bases. Conserva el justificante.</li><li>Consulta las listas de admisión y los plazos de subsanación.</li></ol>
              <p>Los extractos pueden ser incompletos. No sustituyen las bases oficiales.</p>
              <a href={call.official_url} target="_blank" rel="noopener noreferrer">Consultar publicación oficial ↗</a>
              {call.application_url && <p><a href={call.application_url} target="_blank" rel="noopener noreferrer">Acceder a la inscripción oficial ↗</a></p>}
            </section>

            {officialDetails && <section className={styles.detailCard}>
              <h2>Detalle de esta publicación oficial</h2>
              <p>Extractos del anuncio {call.source_external_id}, publicado el {formatOfficialDate(call.publication_date)}. Consulta las bases y las modificaciones posteriores antes de presentar la solicitud.</p>
              {officialDetails.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </section>}

            <section className={styles.detailCard}>
              <h2>Fuente y enlaces oficiales</h2>
              <div className={styles.officialLinks}>
                <a href={call.official_url} target="_blank" rel="noopener noreferrer">Publicación oficial exacta ↗</a>
                {call.application_url && <a href={call.application_url} target="_blank" rel="noopener noreferrer">Solicitud oficial ↗</a>}
                <span>{call.bulletin_name} · {call.bulletin_identifier || "Identificador no indicado"} · {formatOfficialDate(call.publication_date)}</span>
              </div>
            </section>

            <section className={styles.detailCard}>
              <h2>Temario</h2>
              <p>{call.official_syllabus_included === true
                ? "Esta convocatoria incluye temario oficial. Consúltalo en la publicación oficial enlazada; Banco de Opositores no reproduce el temario."
                : call.official_syllabus_included === false
                  ? "La publicación oficial indica que no incorpora temario."
                  : "El temario no está incorporado a esta ficha. Consulta el anuncio y las bases oficiales enlazadas."}</p>
            </section>

            <section className={styles.detailCard}>
              <h2>Evolución e historial oficial</h2>
              {publications.length ? <div className={styles.timeline}>{publications.map((publication) => <article key={publication.id}><time dateTime={publication.publication_date}>{formatOfficialDate(publication.publication_date)}</time><h3>{publication.publication_type.replace(/_/g, " ")}</h3><p>{publication.change_summary}</p><a href={publication.official_url} target="_blank" rel="noopener noreferrer">Ver publicación oficial ↗</a></article>)}</div> : <p>No existen modificaciones oficiales relacionadas registradas hasta el momento.</p>}
            </section>
          </div>

          <aside className={styles.detailAside}>
            <section className={styles.advisorCard}>
              <Image src="/images/fernando-tutor-ia.png" alt="Fernando, asesor de oposiciones" width={120} height={140} />
              <h2>Fernando te asesora</h2>
              <p>Puede comparar esta convocatoria con otras publicadas según territorio, nivel y coincidencias reales. No inventará requisitos ni compatibilidades.</p>
            </section>
            {call.base12_course_slug && <section className={styles.courseCard}><p className={styles.eyebrow}>Preparación relacionada</p><h2>Base12 dispone de preparación relacionada</h2><p>Esta información es contextual y no limita el acceso a convocatorias para las que Base12 no tenga curso.</p><Link className={styles.primaryButton} href={courseHref}>Ver preparación Base12</Link></section>}
            <section className={styles.officialNotice}><span aria-hidden="true">i</span><div><b>Comprueba siempre la fuente oficial</b><p>Un dato no disponible en esta ficha puede figurar en las bases oficiales. Los plazos relativos se reproducen literalmente, sin calcular una fecha de cierre que pueda depender de festivos. La publicación oficial posterior prevalece.</p></div></section>
          </aside>
        </div>
      </main>
    </div>
  );
}
