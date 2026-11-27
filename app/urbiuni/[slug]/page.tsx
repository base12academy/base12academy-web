import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveWideButton } from "@/components/urbiuni/UrbiList";
import { Tag, UrbiShell } from "@/components/urbiuni/UrbiShell";
import { NIVEL_TEXTO, fmt, getFicha, getTitulo, normalize, precioCurso, precioLabel, shortName, type Empleabilidad, type Indicadores } from "@/lib/urbiuni";
import styles from "../urbiuni.module.css";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const titulo = await getTitulo(slug);
  if (!titulo) return { title: "Grado no encontrado | UrbiUni" };
  return {
    title: `${shortName(titulo.denominacion)}: nota de corte, plazas y precio | UrbiUni`,
    description: `Nota de corte, plazas, precio del primer curso, empleabilidad y vida en la ciudad del ${titulo.denominacion}.`,
    alternates: { canonical: `/urbiuni/${slug}` },
  };
}

function nivelNota(row: { nivel_dato: Empleabilidad["nivel_dato"]; ambito: string | null }) {
  return row.nivel_dato ? NIVEL_TEXTO[row.nivel_dato](row.ambito || "sin ámbito") : "Dato de la universidad, no de este grado concreto.";
}

function EmpleoBox({ rows }: { rows: Empleabilidad[] }) {
  return (
    <section className={styles.box}>
      <h2>Empleabilidad</h2>
      {rows.length === 0 ? (
        <p className={styles.note}>Sin fuente: el Ministerio no publica datos de inserción laboral para este título ni para su ámbito en esta universidad.</p>
      ) : rows.map((row) => (
        <div key={row.id} className={styles.col}>
          {row.parte && <strong>{row.parte}</strong>}
          <div className={styles.grid2}>
            <div className={styles.stat}><small>Trabajan a los 4 años</small><b>{fmt.pct(row.afiliacion)}</b></div>
            <div className={styles.stat}><small>Base media de cotización</small><b>{fmt.euros(row.base_cotizacion)}</b></div>
            <div className={styles.stat}><small>Contrato indefinido</small><b>{fmt.pct(row.indefinido)}</b></div>
            <div className={styles.stat}><small>Empleo acorde a su nivel</small><b>{fmt.pct(row.empleo_acorde)}</b></div>
          </div>
          <p className={styles.note}>{nivelNota(row)} Titulados del curso {row.cohorte || "sin dato"}, afiliados a la Seguridad Social a los cuatro años (Ministerio de Ciencia, Innovación y Universidades).</p>
        </div>
      ))}
    </section>
  );
}

function RendimientoBox({ rows }: { rows: Indicadores[] }) {
  return (
    <section className={styles.box}>
      <h2>Cómo les va a los estudiantes</h2>
      {rows.length === 0 ? (
        <p className={styles.note}>Sin fuente: no hay indicadores de rendimiento publicados para este título ni para su ámbito.</p>
      ) : rows.map((row) => (
        <div key={row.id} className={styles.col}>
          {row.parte && <strong>{row.parte}</strong>}
          <div className={styles.rows}>
            <div><span>Créditos aprobados sobre matriculados</span><b>{fmt.pct(row.rendimiento)}</b></div>
            <div><span>Abandonan en primer curso</span><b>{fmt.pct(row.abandono_1)}</b></div>
            <div><span>Abandono total del estudio</span><b>{fmt.pct(row.abandono)}</b></div>
            <div><span>Terminan en el tiempo previsto</span><b>{fmt.pct(row.graduacion)}</b></div>
            <div><span>Duración media real</span><b>{row.duracion_media != null ? `${fmt.nota(row.duracion_media)} años` : "Sin dato"}{row.duracion_prevista_anos != null ? ` (previstos ${row.duracion_prevista_anos})` : ""}</b></div>
          </div>
          <p className={styles.note}>{nivelNota(row)} Curso {row.curso || "sin dato"} (Ministerio, UNIVbase).</p>
        </div>
      ))}
    </section>
  );
}

export default async function FichaPage({ params }: Props) {
  const { slug } = await params;
  const ficha = await getFicha(slug);
  if (!ficha) notFound();
  const { titulo, universidad, acceso, empleo, indicadores, campus, alojamiento, comedores, index } = ficha;
  const precio = precioCurso(titulo);
  const nombre = shortName(titulo.denominacion);

  const base = normalize(titulo.denominacion);
  const otras = index.titulos
    .filter((t) => t.id !== titulo.id && normalize(t.denominacion) === base)
    .map((t) => ({ t, uni: index.universidades.get(t.universidad_id), acc: index.acceso.get(t.id) }))
    .sort((a, b) => (b.acc?.nota_corte ?? -1) - (a.acc?.nota_corte ?? -1))
    .slice(0, 8);
  const parecidos = index.titulos
    .filter((t) => t.universidad_id === titulo.universidad_id && t.id !== titulo.id && t.rama && t.rama === titulo.rama)
    .slice(0, 6);

  const residencia = alojamiento.find((a) => a.precio_mes_desde != null) ?? null;
  const comedor = comedores.find((c) => c.precio_menu != null) ?? null;
  const profesion = titulo.habilitante?.startsWith("Sí") ? titulo.habilitante.replace(/^Sí:?\s*/, "") || "profesión regulada" : null;
  const ciudad = campus[0]?.municipio || universidad?.municipio || "";

  return (
    <UrbiShell>
      <nav className={styles.crumbs} aria-label="Ruta">
        <Link href="/urbiuni">UrbiUni</Link><span>›</span>
        <Link href={`/urbiuni/buscar?q=${encodeURIComponent(nombre)}`}>{nombre}</Link><span>›</span>
        <span>{universidad?.siglas || universidad?.nombre}</span>
      </nav>

      <header className={styles.fichaHead}>
        <div className={styles.badges}>
          {universidad?.tipo && <span className={styles.badge}>Universidad {universidad.tipo.toLowerCase()}</span>}
          {titulo.rama && <span className={styles.badge}>{titulo.rama}</span>}
          {titulo.modalidad && <span className={styles.badge}>{titulo.modalidad}</span>}
          {profesion && <span className={styles.badge}>Profesión regulada</span>}
        </div>
        <h1>{titulo.denominacion}</h1>
        <p>{universidad?.nombre}{ciudad ? ` · ${ciudad}` : ""}{universidad?.ccaa ? ` (${universidad.ccaa})` : ""}</p>
        <div><SaveWideButton slug={titulo.slug} /></div>
      </header>

      <div className={styles.layout}>
        <div className={styles.col}>
          <section className={styles.box}>
            <h2>Nota de corte</h2>
            <div className={styles.big}>
              <b>{fmt.nota(acceso?.nota_corte)}</b>
              <span>{acceso?.curso ? `Curso ${acceso.curso}` : ""}{acceso?.via ? ` · ${acceso.via}` : ""}</span>
            </div>
            <div className={styles.grid2}>
              <div className={styles.stat}><small>Plazas</small><b>{fmt.num(acceso?.plazas)}</b></div>
              <div className={styles.stat}><small>Solicitudes en 1.ª opción</small><b>{fmt.num(acceso?.solicitudes_1a)}</b></div>
            </div>
            {acceso?.centro && <p className={styles.note}>Centro: {acceso.centro}</p>}
            <div className={styles.sourceRow}>
              <Tag value={acceso?.nota_corte != null ? acceso.fuente_etiqueta : "sin_fuente"} />
              {acceso?.fuente_url && <a href={acceso.fuente_url} target="_blank" rel="noopener noreferrer">Ver fuente →</a>}
            </div>
            <p className={styles.note}>Es la última nota publicada. La de este curso se conoce tras la adjudicación de plazas y puede subir o bajar.</p>
          </section>

          <EmpleoBox rows={empleo} />
          <RendimientoBox rows={indicadores} />

          {profesion && (
            <section className={styles.bridge}>
              <h2>Este grado da acceso a una profesión regulada</h2>
              <p>Habilita para ejercer como {profesion}. Si piensas en el empleo público, consulta las convocatorias abiertas en el Banco de Opositores de Base12.</p>
              <Link href="/banco-opositores">Ver convocatorias →</Link>
            </section>
          )}
        </div>

        <aside className={styles.col}>
          <section className={styles.box}>
            <h2>El grado</h2>
            <div className={styles.rows}>
              <div><span>Créditos</span><b>{titulo.ects != null ? `${titulo.ects} ECTS (${Math.round(titulo.ects / 60)} cursos)` : "Sin dato"}</b></div>
              <div><span>Primer curso</span><b>{precioLabel(precio)}</b></div>
              <div><span>Modalidad</span><b>{titulo.modalidad || "Sin dato"}</b></div>
              <div><span>Centro</span><b>{titulo.centro || "Sin dato"}{titulo.centro_adscrito === "Sí" ? " (adscrito)" : ""}</b></div>
              {titulo.codigo_ruct && <div><span>Código RUCT</span><b>{titulo.codigo_ruct}</b></div>}
            </div>
            <div className={styles.sourceRow}>
              <span>Precio: <Tag value={precio.valor != null ? precio.etiqueta : "sin_fuente"} /></span>
              {titulo.fuente_url && <a href={titulo.fuente_url} target="_blank" rel="noopener noreferrer">Fuente del título →</a>}
            </div>
            {precio.texto && !precio.texto.startsWith("Sin fuente") && <p className={styles.note}>{/^[\d.,]+ €( \(|$)/.test(precio.texto) || precio.texto.includes("según grupo") ? `Precio del crédito: ${precio.texto}` : precio.texto}</p>}
            {precio.valor == null && precio.texto?.startsWith("Sin fuente") && <p className={styles.note}>{precio.texto}.</p>}
            {universidad?.tipo === "Pública" && precio.valor != null && <p className={styles.note}>Precio de 60 créditos en primera matrícula según el decreto de precios públicos de la comunidad. Con beca del Ministerio la matrícula puede ser gratuita.</p>}
          </section>

          <section className={styles.box}>
            <h2>Vivir allí</h2>
            <div className={styles.rows}>
              <div><span>Campus</span><b>{campus.length ? campus.map((c) => c.nombre || c.municipio).join(", ") : universidad?.municipio || "Sin dato"}</b></div>
              <div><span>Residencia desde</span><b>{residencia ? `${fmt.euros(residencia.precio_mes_desde)}/mes` : alojamiento.length ? `${alojamiento.length} en el directorio oficial, sin precio publicado` : "Sin fuente"}</b></div>
              <div><span>Menú del comedor</span><b>{comedor ? fmt.euros(comedor.precio_menu) : comedores.length ? "Sin precio publicado" : "Sin fuente"}</b></div>
            </div>
            {residencia?.url && <div className={styles.sourceRow}><span>{residencia.nombre}</span><a href={residencia.url} target="_blank" rel="noopener noreferrer">Ver residencia →</a></div>}
            {!residencia && alojamiento[0]?.url && <div className={styles.sourceRow}><span>Alojamiento de la universidad</span><a href={alojamiento[0].url} target="_blank" rel="noopener noreferrer">Ver →</a></div>}
            {comedor?.url && <div className={styles.sourceRow}><span>{comedor.nombre || "Comedor"}</span><a href={comedor.url} target="_blank" rel="noopener noreferrer">Ver comedor →</a></div>}
          </section>

          {otras.length > 0 && (
            <section className={styles.box}>
              <h2>{nombre} en otras universidades</h2>
              <div className={styles.linkList}>
                {otras.map(({ t, uni, acc }) => (
                  <Link key={t.id} href={`/urbiuni/${t.slug}`}>{uni?.siglas || uni?.nombre}<span>{fmt.nota(acc?.nota_corte)}</span></Link>
                ))}
              </div>
              <Link href={`/urbiuni/buscar?q=${encodeURIComponent(nombre)}`} className={styles.more}>Ver todas →</Link>
            </section>
          )}

          {parecidos.length > 0 && (
            <section className={styles.box}>
              <h2>Grados parecidos en {universidad?.siglas || "esta universidad"}</h2>
              <div className={styles.linkList}>
                {parecidos.map((t) => (
                  <Link key={t.id} href={`/urbiuni/${t.slug}`}>{shortName(t.denominacion)}<span>{fmt.nota(index.acceso.get(t.id)?.nota_corte)}</span></Link>
                ))}
              </div>
            </section>
          )}

          <section className={styles.promo}>
            <small>Base12 Academy</small>
            <b>Sube tu nota de admisión con la preparación de la PAU de Base12.</b>
            <Link href="/bachillerato-pau">Ver Bachillerato y PAU →</Link>
          </section>
        </aside>
      </div>
    </UrbiShell>
  );
}
