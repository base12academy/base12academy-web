import Link from "next/link";
import { tropaPlans, type TropaPlan } from "@/lib/tropa-commercial";
import styles from "./TropaCommercialPage.module.css";

function Header() {
  return <header className={styles.header}><div className={styles.headerInner}>
    <Link href="/"><img className={styles.logo} src="/images/base12-logo.png" alt="Base12 Academy" /></Link>
    <nav className={styles.nav} aria-label="Navegación principal"><Link href="/#catalogo">Catálogo</Link><Link className={styles.login} href="/login">Acceso alumnos</Link></nav>
  </div></header>;
}

function Price({ plan }: { plan: TropaPlan }) {
  return <><div className={styles.prices} aria-label={`Antes ${plan.previousPrice}; ahora ${plan.currentPrice}`}><span className={styles.previous}>{plan.previousPrice}</span><strong className={styles.current}>{plan.currentPrice}</strong></div><span className={styles.discount}>40 € de descuento</span></>;
}

export function TropaLanding() {
  return <div className={styles.page}><Header /><main className={styles.main}>
    <section className={styles.hero}><p className={styles.eyebrow}>Tropa y Marinería</p><h1>Elige tu nivel de entrenamiento</h1><p className={styles.intro}>Tres paquetes comerciales acumulativos, organizados para avanzar desde una base amplia hasta el máximo alcance de preparación previsto por Base12 Academy.</p></section>
    <section className={styles.plans} aria-label="Paquetes de Tropa y Marinería">{tropaPlans.map(plan => <article className={styles.card} key={plan.slug}><h2>{plan.name}</h2><Price plan={plan} /><p>{plan.description}</p><ul className={styles.list}>{plan.includes.map(item => <li key={item}>{item}</li>)}</ul><p className={styles.difference}><b>Diferencia principal:</b> {plan.difference}</p><Link className={styles.link} href={`/tropa-y-marineria/${plan.slug}`}>Ver paquete {plan.name}</Link></article>)}</section>
    <p className={styles.notice}><b>Contratación todavía cerrada.</b> Estas páginas presentan las modalidades comerciales. No habilitan pagos, pedidos, matrícula ni acceso a contenidos.</p>
  </main></div>;
}

export function TropaPlanPage({ plan }: { plan: TropaPlan }) {
  const others = tropaPlans.filter(item => item.slug !== plan.slug);
  return <div className={styles.page}><Header /><main className={styles.main}><Link className={styles.back} href="/tropa-y-marineria">← Ver los tres paquetes</Link>
    <section className={styles.hero}><p className={styles.eyebrow}>Tropa y Marinería · Paquete</p><h1>{plan.name}</h1><p className={styles.intro}>{plan.description}</p><Price plan={plan} /></section>
    <div className={styles.detailGrid}><section className={styles.panel}><h2>Qué incluye</h2><ul className={styles.list}>{plan.includes.map(item => <li key={item}>{item}</li>)}</ul><h2>Diferencia respecto a los demás paquetes</h2><p>{plan.difference}</p><button className={styles.closed} type="button" disabled>Contratación disponible próximamente</button></section>
    <aside className={styles.panel}><h2>Compara también</h2>{others.map(item => <p key={item.slug}><Link href={`/tropa-y-marineria/${item.slug}`}>{item.name} · {item.currentPrice}</Link></p>)}</aside></div>
    <p className={styles.notice}>La interfaz es exclusivamente informativa. No expone temas, vídeos, tests, documentos, recursos pedagógicos, asistentes, planificación ni simulacros.</p>
  </main></div>;
}
