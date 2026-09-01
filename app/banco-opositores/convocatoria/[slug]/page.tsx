import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import OppositionDetailActions from "@/components/banco-opositores/OppositionDetailActions";
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
  const description = `${result.call.title}. Consulta los datos disponibles, el historial y la fuente oficial.`;
  return {
    title: `${result.call.title} | Banco de Opositores`,
    description: description.slice(0, 158),
    alternates: { canonical: `/banco-opositores/convocatoria/${slug}` },
    openGraph: { title: result.call.title, description: description.slice(0, 158), type: "article" },
  };
}

export default async function OppositionDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getOppositionCall(slug);
  if (!result) notFound();
  const { call, publications } = result;
  const registration = applicationStatus(call);
  const courseHref = call.base12_course_slug === "tropa-y-marineria" ? "/tropa-y-marineria" : "/cursos";

  const facts = [
    ["Plazas", call.vacancies],
    ["Grupo / categoría", call.group_category],
    ["Especialidad", call.specialty],
    ["Titulación requerida", null],
    ["Sistema de acceso", call.access_system],
    ["Fecha de publicación", formatOfficialDate(call.publication_date)],
    ["Inicio del plazo", call.application_start ? formatOfficialDate(call.application_start) : null],
    ["Fin del plazo", call.application_end ? formatOfficialDate(call.application_end) : null],
    ["Fecha de examen", call.exam_date ? formatOfficialDate(call.exam_date) : null],
    ["Órgano convocante", call.organisation],
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
            <h1>{call.title}</h1>
            <h2>{call.organisation || "Organismo no indicado en la publicación oficial"}</h2>
            <div className={styles.detailMeta}><span>▣ {call.group_category || "Grupo no indicado"}</span><span>⌖ {call.territory}</span><span>◷ {call.status}</span><span>Fuente: {call.bulletin_name}</span></div>
          </div>
          <div>
            <div className={styles.statusBox}>{registration.label}<small>{call.application_end ? `Hasta el ${formatOfficialDate(call.application_end)}` : "Consulta la publicación oficial"}</small></div>
            <div className={styles.detailActions}><OppositionDetailActions callId={call.id} callTitle={call.title} territory={call.territory} /></div>
          </div>
        </section>

        <div className={styles.detailGrid}>
          <div className={styles.detailContent}>
            <section className={styles.detailCard}>
              <h2>Resumen oficial disponible</h2>
              <dl className={styles.factGrid}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{missingOfficialValue(value)}</dd></div>)}</dl>
            </section>

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
                  : "No indicado en la publicación oficial. Banco de Opositores no reproduce ni completa temarios por inferencia."}</p>
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
            <section className={styles.officialNotice}><span aria-hidden="true">i</span><div><b>Comprueba siempre la fuente oficial</b><p>Si un dato no figura en la publicación, se muestra como no indicado. La publicación oficial posterior prevalece y queda añadida al historial.</p></div></section>
          </aside>
        </div>
      </main>
    </div>
  );
}
