import type { Metadata } from "next";
import Link from "next/link";
import { SaveButton } from "@/components/urbiuni/UrbiList";
import { Tag, UrbiShell } from "@/components/urbiuni/UrbiShell";
import { CCAA, RAMAS, SIN_NOTA_CORTE, alcance, centroAdscrito, esOnline, fmt, getUrbiIndex, normalize, parseNota, precioCurso, precioLabel, shortName } from "@/lib/urbiuni";
import styles from "../urbiuni.module.css";

export const metadata: Metadata = {
  title: "Buscar grados universitarios | UrbiUni",
  description: "Busca grados de todas las universidades de España y filtra por rama, comunidad, universidad pública o privada, modalidad y nota de corte.",
  alternates: { canonical: "/urbiuni/buscar" },
};

type Search = { q?: string; rama?: string; ccaa?: string; tipo?: string; modalidad?: string; nota?: string; p?: string };
type Props = { searchParams: Promise<Search> };

const PAGE = 30;

export default async function BuscarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().slice(0, 80);
  const rama = RAMAS.find((r) => r === sp.rama) ?? "";
  const ccaa = CCAA.find((c) => c === sp.ccaa) ?? "";
  const tipo = sp.tipo === "Pública" || sp.tipo === "Privada" ? sp.tipo : "";
  const modalidad = sp.modalidad === "presencial" || sp.modalidad === "online" ? sp.modalidad : "";
  const nota = parseNota(sp.nota);
  const page = Math.max(1, Math.min(500, Number.parseInt(sp.p || "1", 10) || 1));

  const index = await getUrbiIndex();
  const tokens = normalize(q.replace(/^grado (en|de) /i, "")).split(" ").filter((t) => t.length > 1);

  const results = index.titulos
    .map((t) => ({ t, uni: index.universidades.get(t.universidad_id), acc: index.acceso.get(t.id) }))
    .filter(({ t, uni }) => {
      if (tokens.length) {
        const hay = normalize(`${t.denominacion} ${centroAdscrito(t) ?? ""} ${uni?.nombre ?? ""} ${uni?.siglas ?? ""} ${uni?.municipio ?? ""}`);
        if (!tokens.every((tok) => hay.includes(tok))) return false;
      }
      if (rama && !(t.rama || "").includes(rama)) return false;
      if (ccaa && uni?.ccaa !== ccaa) return false;
      if (tipo && uni?.tipo !== tipo) return false;
      if (modalidad === "online" && !esOnline(t.modalidad)) return false;
      if (modalidad === "presencial" && esOnline(t.modalidad)) return false;
      return true;
    })
    .map((r) => {
      const libre = Boolean(SIN_NOTA_CORTE[r.t.universidad_id]);
      const reach = libre ? ({ label: "Sin nota de corte", tone: "ok" } as const) : alcance(nota, r.acc?.nota_corte ?? null);
      return { ...r, libre, reach };
    });

  const order = { ok: 0, tight: 1, hard: 2 } as const;
  results.sort((a, b) => {
    if (nota != null) {
      const ra = a.reach ? order[a.reach.tone] : 3;
      const rb = b.reach ? order[b.reach.tone] : 3;
      if (ra !== rb) return ra - rb;
      return (b.acc?.nota_corte ?? -1) - (a.acc?.nota_corte ?? -1);
    }
    return a.t.denominacion.localeCompare(b.t.denominacion, "es") || (a.uni?.nombre || "").localeCompare(b.uni?.nombre || "", "es");
  });

  const total = results.length;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const current = Math.min(page, pages);
  const shown = results.slice((current - 1) * PAGE, current * PAGE);
  const reachable = nota != null ? results.filter((r) => r.reach?.tone === "ok").length : 0;
  const libres = results.filter((r) => r.libre).length;
  const libresLink = (() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (rama) params.set("rama", rama);
    params.set("ccaa", "Estado");
    return `/urbiuni/buscar?${params.toString()}`;
  })();

  const link = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (rama) params.set("rama", rama);
    if (ccaa) params.set("ccaa", ccaa);
    if (tipo) params.set("tipo", tipo);
    if (modalidad) params.set("modalidad", modalidad);
    if (nota != null) params.set("nota", String(nota));
    if (p > 1) params.set("p", String(p));
    return `/urbiuni/buscar?${params.toString()}`;
  };

  return (
    <UrbiShell>
      <form action="/urbiuni/buscar" className={styles.filters} role="search">
        <div className={styles.filterGrid}>
          <label className={styles.field}>Grado, universidad o ciudad
            <input name="q" type="search" defaultValue={q} placeholder="Ej.: Enfermería" />
          </label>
          <label className={styles.field}>Rama
            <select name="rama" defaultValue={rama}>
              <option value="">Todas</option>
              {RAMAS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className={styles.field}>Comunidad
            <select name="ccaa" defaultValue={ccaa}>
              <option value="">Toda España</option>
              {CCAA.map((c) => <option key={c} value={c}>{c === "Estado" ? "A distancia (estatal)" : c}</option>)}
            </select>
          </label>
          <label className={styles.field}>Universidad
            <select name="tipo" defaultValue={tipo}>
              <option value="">Pública y privada</option>
              <option value="Pública">Pública</option>
              <option value="Privada">Privada</option>
            </select>
          </label>
          <label className={styles.field}>Tu nota (sobre 14)
            <input name="nota" inputMode="decimal" defaultValue={nota != null ? String(nota).replace(".", ",") : ""} placeholder="Opcional" />
          </label>
          <button type="submit" className={styles.button}>Buscar</button>
        </div>
        <div className={styles.chips}>
          {[["", "Todas las modalidades"], ["presencial", "Presencial"], ["online", "A distancia u online"]].map(([value, label]) => {
            const params = new URLSearchParams(link(1).split("?")[1]);
            if (value) params.set("modalidad", value); else params.delete("modalidad");
            return (
              <Link key={value} href={`/urbiuni/buscar?${params.toString()}`} className={`${styles.chip} ${modalidad === value ? styles.chipActive : ""}`}>{label}</Link>
            );
          })}
        </div>
      </form>

      <div className={styles.resultsHead}>
        <span><strong>{fmt.num(total)}</strong> {total === 1 ? "resultado" : "resultados"}{nota != null && <> · <strong>{fmt.num(reachable)}</strong> a tu alcance con un {fmt.nota(nota)}</>}</span>
        {nota != null && <span>Comparado con la última nota de corte publicada; la de este curso puede cambiar.</span>}
      </div>

      {nota != null && libres > 0 && ccaa !== "Estado" && (
        <div className={styles.bridge} style={{ marginBottom: 16 }}>
          <h2>¿No te llega la nota? En la UNED no hay nota de corte</h2>
          <p>{libres === 1 ? "1 grado" : `${fmt.num(libres)} grados`} de tu búsqueda {libres === 1 ? "se imparte" : "se imparten"} en la UNED, que no limita plazas: solo necesitas tener el acceso a la universidad. Se estudia a distancia, con centros asociados en toda España.</p>
          <Link href={libresLink}>Ver los grados de la UNED →</Link>
        </div>
      )}

      {shown.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay grados que coincidan con tu búsqueda.</p>
          <p>Prueba con menos filtros o con otra palabra (por ejemplo, «Psicología» en lugar de «Grado en Psicología clínica»).</p>
        </div>
      ) : (
        <div className={styles.cards}>
          {shown.map(({ t, uni, acc, reach, libre }) => {
            const precio = precioCurso(t);
            return (
              <article key={t.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitle}>
                    {reach && <span className={`${styles.tag} ${styles[`reach_${reach.tone}`]}`} style={{ justifySelf: "start" }}>{reach.label}</span>}
                    <Link href={`/urbiuni/${t.slug}`}>{shortName(t.denominacion)}</Link>
                    <span>{uni?.nombre ?? ""}{uni?.municipio ? ` · ${uni.municipio}` : ""}{uni?.tipo ? ` · ${uni.tipo}` : ""}</span>
                    {centroAdscrito(t) && <span><strong>Centro adscrito:</strong> {centroAdscrito(t)} (nota y precio propios)</span>}
                  </div>
                  <SaveButton slug={t.slug} name={shortName(t.denominacion)} />
                </div>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <small>Nota de corte</small>
                    <b>{libre ? "No tiene" : fmt.nota(acc?.nota_corte)}</b>
                    <Tag value={libre ? "oficial" : acc?.nota_corte != null ? acc.fuente_etiqueta : "sin_fuente"} />
                  </div>
                  <div className={styles.stat}>
                    <small>Plazas</small>
                    <b>{libre ? "Sin límite" : fmt.num(acc?.plazas)}</b>
                    <Tag value={libre ? "oficial" : acc?.plazas != null ? acc.fuente_etiqueta : "sin_fuente"} />
                  </div>
                  <div className={styles.stat}>
                    <small>Primer curso</small>
                    <b>{precioLabel(precio)}</b>
                    <Tag value={precio.valor != null ? precio.etiqueta : "sin_fuente"} />
                  </div>
                </div>
                <Link href={`/urbiuni/${t.slug}`} className={styles.more}>Ver ficha completa →</Link>
              </article>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <nav className={styles.pager} aria-label="Páginas de resultados">
          {current > 1 && <Link href={link(current - 1)} className={styles.chip}>← Anteriores</Link>}
          <span className={styles.chip}>Página {current} de {pages}</span>
          {current < pages && <Link href={link(current + 1)} className={styles.chip}>Siguientes →</Link>}
        </nav>
      )}

      <section className={styles.promo}>
        <small>Base12 Academy</small>
        <b>¿Te faltan décimas para el grado que quieres? Prepara la PAU con Base12.</b>
        <Link href="/bachillerato-pau">Ver Bachillerato y PAU →</Link>
      </section>
    </UrbiShell>
  );
}
