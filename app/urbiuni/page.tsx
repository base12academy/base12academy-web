import type { Metadata } from "next";
import Link from "next/link";
import { Tag, UrbiShell } from "@/components/urbiuni/UrbiShell";
import { CCAA, RAMAS } from "@/lib/urbiuni";
import styles from "./urbiuni.module.css";

export const metadata: Metadata = {
  title: "UrbiUni | Grados, notas de corte y universidades de España",
  description:
    "Busca grados universitarios de toda España, consulta la nota de corte, las plazas, el precio y la empleabilidad, y compara universidades. Gratis y con datos de fuentes oficiales.",
  alternates: { canonical: "/urbiuni" },
  openGraph: {
    title: "UrbiUni · Elige carrera sin perderte",
    description: "Grados, notas de corte y universidades de toda España, con datos de fuentes oficiales.",
    url: "/urbiuni",
    type: "website",
  },
};

export default function UrbiUniHome() {
  return (
    <UrbiShell>
      <section className={styles.hero}>
        <span className={styles.pill}>Para 2.º de Bachillerato · Gratis</span>
        <h1>Elige carrera sin perderte.</h1>
        <p>Grados, notas de corte, plazas, precios y empleabilidad de las universidades de toda España, con datos de fuentes oficiales.</p>
        <form action="/urbiuni/buscar" className={styles.searchForm} role="search">
          <label htmlFor="q" className={styles.srOnly}>¿Qué quieres estudiar?</label>
          <input id="q" name="q" type="search" placeholder="Ej.: Enfermería, Derecho, Biología…" />
          <button type="submit" className={styles.button}>Buscar</button>
        </form>
      </section>

      <div className={styles.doors}>
        <Link href="/urbiuni/buscar" className={`${styles.door} ${styles.doorDark}`}>
          <b>Sé qué quiero estudiar</b>
          <span>Busca tu grado y compara universidades</span>
        </Link>
        <Link href="#ramas" className={styles.door}>
          <b>Aún no lo tengo claro</b>
          <span>Explora los grados por ramas</span>
        </Link>
      </div>

      <section id="ramas" className={styles.section}>
        <h2>Explora por ramas</h2>
        <div className={styles.chips}>
          {RAMAS.map((rama) => (
            <Link key={rama} href={`/urbiuni/buscar?rama=${encodeURIComponent(rama)}`} className={styles.chip}>{rama}</Link>
          ))}
        </div>
      </section>

      <section className={styles.calc} aria-labelledby="calc-title">
        <h2 id="calc-title">¿Hasta dónde llega tu nota?</h2>
        <p>Escribe tu nota de acceso (sobre 14) y te marcamos qué grados están a tu alcance según la última nota de corte publicada.</p>
        <form action="/urbiuni/buscar" className={styles.calcForm}>
          <label className={styles.field}>Tu nota (sobre 14)
            <input name="nota" inputMode="decimal" placeholder="Ej.: 11,25" required pattern="[0-9]{1,2}([.,][0-9]{1,3})?" />
          </label>
          <label className={styles.field}>Qué quieres estudiar (opcional)
            <input name="q" placeholder="Ej.: Psicología" />
          </label>
          <label className={styles.field}>Comunidad (opcional)
            <select name="ccaa" defaultValue="">
              <option value="">Toda España</option>
              {CCAA.map((c) => <option key={c} value={c}>{c === "Estado" ? "A distancia (ámbito estatal)" : c}</option>)}
            </select>
          </label>
          <button type="submit" className={`${styles.button} ${styles.buttonDark}`}>Ver opciones</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Cada dato te dice de dónde sale</h2>
        <div className={styles.legend}>
          <div><Tag value="oficial" /> Universidad, ministerio, distrito de acceso o boletín oficial</div>
          <div><Tag value="no_oficial" /> Única fuente disponible, no oficial</div>
          <div><Tag value="sin_fuente" /> No hay dato publicado</div>
        </div>
      </section>

      <section className={styles.promo}>
        <small>Base12 Academy</small>
        <b>¿Te preparas la PAU? Te ayudamos a llegar a la nota que necesitas.</b>
        <Link href="/bachillerato-pau">Ver Bachillerato y PAU en Base12 →</Link>
      </section>
    </UrbiShell>
  );
}
