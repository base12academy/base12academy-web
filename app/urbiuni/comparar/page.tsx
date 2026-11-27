import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClearListButton, ListRedirect } from "@/components/urbiuni/UrbiList";
import { Tag, UrbiShell } from "@/components/urbiuni/UrbiShell";
import { SIN_NOTA_CORTE, centroAdscrito, fmt, getFicha, precioCurso, precioLabel, shortName } from "@/lib/urbiuni";
import styles from "../urbiuni.module.css";

export const metadata: Metadata = {
  title: "Comparar grados | UrbiUni",
  description: "Compara nota de corte, plazas, precio, empleabilidad y vida en la ciudad de los grados que has guardado.",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ g?: string }> };

export default async function CompararPage({ searchParams }: Props) {
  const { g } = await searchParams;
  const slugs = Array.from(new Set((g || "").split(",").map((s) => s.trim()).filter((s) => /^[a-z0-9-]{1,160}$/.test(s)))).slice(0, 10);

  if (slugs.length === 0) {
    return (
      <UrbiShell>
        <div className={styles.fichaHead}><h1>Tu lista</h1></div>
        <ListRedirect />
      </UrbiShell>
    );
  }

  const fichas = (await Promise.all(slugs.map((s) => getFicha(s)))).filter((f): f is NonNullable<typeof f> => f != null);
  const first = <T,>(rows: T[]) => rows[0] ?? null;

  const rows: Array<[string, (f: (typeof fichas)[number]) => ReactNode]> = [
    ["Universidad", (f) => <>{f.universidad?.nombre}<br /><small>{centroAdscrito(f.titulo) ? `Centro adscrito: ${centroAdscrito(f.titulo)}` : f.universidad?.tipo}</small></>],
    ["Ciudad", (f) => f.campus[0]?.municipio || f.universidad?.municipio || "Sin dato"],
    ["Campus", (f) => (f.campus.length ? f.campus.map((c) => c.nombre || c.municipio).join(", ") : "Sin dato")],
    ["Nota de corte", (f) => SIN_NOTA_CORTE[f.titulo.universidad_id] ? <div className={styles.cell}><b>No tiene</b><small>Sin límite de plazas</small><Tag value="oficial" /></div> : <div className={styles.cell}><b>{fmt.nota(f.acceso?.nota_corte)}</b>{f.acceso?.curso && <small>{f.acceso.curso}</small>}<Tag value={f.acceso?.nota_corte != null ? f.acceso.fuente_etiqueta : "sin_fuente"} /></div>],
    ["Plazas", (f) => (SIN_NOTA_CORTE[f.titulo.universidad_id] ? "Sin límite" : fmt.num(f.acceso?.plazas))],
    ["Primer curso", (f) => { const p = precioCurso(f.titulo); return <div className={styles.cell}><b>{precioLabel(p)}</b><Tag value={p.valor != null ? p.etiqueta : "sin_fuente"} /></div>; }],
    ["Modalidad", (f) => f.titulo.modalidad || "Sin dato"],
    ["Trabajan a los 4 años*", (f) => fmt.pct(first(f.empleo)?.afiliacion)],
    ["Base media de cotización*", (f) => fmt.euros(first(f.empleo)?.base_cotizacion)],
    ["Abandono del estudio*", (f) => fmt.pct(first(f.indicadores)?.abandono)],
    ["Terminan en el tiempo previsto*", (f) => fmt.pct(first(f.indicadores)?.graduacion)],
    ["Residencia desde", (f) => { const r = f.alojamiento.find((a) => a.precio_mes_desde != null); return r ? `${fmt.euros(r.precio_mes_desde)}/mes` : f.alojamiento.length ? "Sin precio publicado" : "Sin fuente"; }],
  ];

  return (
    <UrbiShell>
      <div className={styles.fichaHead}>
        <h1>Comparar grados</h1>
        <p>{fichas.length} {fichas.length === 1 ? "grado guardado" : "grados guardados"}. Guarda hasta 10 desde los resultados o desde cada ficha.</p>
      </div>

      {fichas.length === 0 ? (
        <div className={styles.empty}><p>No hemos encontrado esos grados.</p><Link href="/urbiuni/buscar">Buscar grados →</Link></div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col"><span className={styles.srOnly}>Dato</span></th>
                  {fichas.map((f) => <th key={f.titulo.id} scope="col"><Link href={`/urbiuni/${f.titulo.slug}`}>{shortName(f.titulo.denominacion)}</Link></th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, render]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {fichas.map((f) => <td key={f.titulo.id}>{render(f)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.footnote}>* Dato de la universidad en el ámbito de estudio del grado (Ministerio de Ciencia, Innovación y Universidades), no del grado concreto. Abre cada ficha para ver el detalle y la fuente.</p>
        </>
      )}

      <div className={styles.actions}>
        <Link href="/urbiuni/buscar" className={styles.button}>Añadir más grados</Link>
        <ClearListButton />
      </div>
    </UrbiShell>
  );
}
