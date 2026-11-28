import Link from "next/link";
import type { OppositionCall } from "@/lib/oppositions";
import styles from "@/app/banco-opositores/banco.module.css";

const fields = [
  ["Organismo", "organisation"],
  ["Territorio", "territory"],
  ["Grupo", "group_category"],
  ["Plazas", "vacancies"],
  ["Sistema de acceso", "access_system"],
  ["Inicio de solicitudes", "application_start"],
  ["Fin de solicitudes", "application_end"],
  ["Fecha de examen", "exam_date"],
  ["Estado", "status"],
] as const;

export default function OppositionComparison({ calls, remove }: {
  calls: OppositionCall[];
  remove: (id: string) => void;
}) {
  if (!calls.length) return null;
  return (
    <section className={styles.searchPanel} aria-labelledby="comparison-heading">
      <h2 id="comparison-heading">Comparar convocatorias</h2>
      <div className={styles.tableScroll}>
        <table className={styles.comparison}>
          <thead><tr><th scope="col">Dato oficial</th>{calls.map(call => (
            <th key={call.id} scope="col">
              <Link href={`/banco-opositores/convocatoria/${call.slug}`}>{call.title}</Link>
              <button type="button" className={styles.outlineButton} onClick={() => remove(call.id)} aria-label={`Quitar ${call.title} de la comparación`}>Quitar</button>
            </th>
          ))}</tr></thead>
          <tbody>{fields.map(([label, key]) => (
            <tr key={key}><th scope="row">{label}</th>{calls.map(call => <td key={call.id}>{call[key] ?? "No consta"}</td>)}</tr>
          ))}<tr><th scope="row">Publicación oficial</th>{calls.map(call => (
            <td key={call.id}><a href={call.official_url} target="_blank" rel="noreferrer">{call.official_call_identifier || call.source_external_id}</a></td>
          ))}</tr></tbody>
        </table>
      </div>
    </section>
  );
}
