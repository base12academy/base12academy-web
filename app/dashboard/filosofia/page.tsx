"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import catalog from "@/data/filosofia/catalog.json";
import styles from "../course-interface.module.css";

type Section = "inicio" | "autores" | "corrientes" | "comparaciones" | "glosario" | "metodologia" | "talleres" | "pau";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "autores", label: "Filósofos", icon: "♙" },
  { id: "corrientes", label: "Movimientos", icon: "⌘" },
  { id: "comparaciones", label: "Comparaciones", icon: "⚖" },
  { id: "glosario", label: "Glosario", icon: "▤" },
  { id: "metodologia", label: "Método PAU", icon: "◎" },
  { id: "talleres", label: "Talleres", icon: "✎" },
  { id: "pau", label: "PAU por territorio", icon: "▣" },
];

const periods = ["Filosofía antigua", "Filosofía medieval", "Filosofía moderna", "Filosofía contemporánea"];

export default function FilosofiaPage() {
  const [section, setSection] = useState<Section>("inicio");
  const [period, setPeriod] = useState("Filosofía contemporánea");
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("es");
  const featured = catalog.authors.find((item) => item.id === "friedrich-nietzsche") ?? catalog.authors[0];

  const cards = useMemo(() => {
    const matches = (value: string) => !query || value.toLocaleLowerCase("es").includes(query);
    if (section === "autores") return catalog.authors.filter((item) => (!period || item.period === period) && matches(`${item.title} ${item.period} ${item.guide} ${item.concepts.join(" ")}`)).map((item) => ({ href: `/dashboard/filosofia/autor-${item.id}`, eyebrow: item.period, title: item.title, text: item.guide }));
    if (section === "corrientes") return catalog.blocks.filter((item) => matches(`${item.title} ${item.period} ${item.concepts.join(" ")}`)).map((item) => ({ href: `/dashboard/filosofia/corriente-${item.id}`, eyebrow: item.period, title: item.title, text: item.concepts.slice(0, 6).join(" · ") }));
    if (section === "comparaciones") return catalog.comparisons.filter((item) => matches(`${item.authorA} ${item.authorB} ${item.axis}`)).map((item) => ({ href: `/dashboard/filosofia/comparacion-${item.id}`, eyebrow: `COMPARACIÓN ${item.number}`, title: `${item.authorA} y ${item.authorB}`, text: item.axis }));
    if (section === "glosario") return catalog.glossary.filter((item) => matches(`${item.title} ${item.period} ${item.authors}`)).map((item) => ({ href: `/dashboard/filosofia/concepto-${item.id}`, eyebrow: item.period, title: item.title, text: item.authors }));
    if (section === "metodologia") return catalog.methodology.map((item) => ({ href: `/dashboard/filosofia/metodo-${item.id}`, eyebrow: `DESTREZA ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Explicación, procedimiento, práctica y autocorrección." }));
    if (section === "talleres") return catalog.workshops.map((item) => ({ href: `/dashboard/filosofia/taller-${item.id}`, eyebrow: "PRÁCTICA GUIADA", title: item.title, text: "Actividades graduadas y entrenamiento filosófico." }));
    if (section === "pau") return catalog.territories.map((item) => ({ href: `/dashboard/filosofia/pau-${item.id}`, eyebrow: "MODELO TERRITORIAL", title: item.title, text: "Banco de preguntas, método y simulacros adaptados al territorio." }));
    return [];
  }, [period, query, section]);

  const openPeriod = (nextPeriod: string) => {
    setPeriod(nextPeriod);
    setSection("autores");
    setSearch("");
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority />
          <strong>Historia de la Filosofía</strong>
        </Link>
        <label className={styles.topSearch}>
          <span className={styles.srOnly}>Buscar en Historia de la Filosofía</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en Historia de la Filosofía…" />
        </label>
        <nav className={styles.topActions} aria-label="Navegación general">
          <button type="button">⌕ Buscar</button>
          <Link href="/dashboard">▣ Plan de estudio</Link>
          <Link href="/dashboard">◯ Mi cuenta</Link>
        </nav>
      </header>

      <div className={styles.layout}>
        <aside className={styles.leftRail}>
          <h2 className={styles.courseTitle}><span>▤</span> Historia de la Filosofía</h2>
          <div className={styles.progressLabel}><span>Progreso del curso</span><strong>62%</strong></div>
          <div className={styles.progress} aria-label="Progreso del curso: 62%"><span style={{ width: "62%" }} /></div>
          <div className={styles.railRule} />
          <nav className={styles.railNav} aria-label="Temario">
            {periods.map((item, index) => <button key={item} type="button" className={section === "autores" && period === item ? styles.activeRail : ""} onClick={() => openPeriod(item)}><span className={styles.navIcon}>{["♜", "†", "✎", "♟"][index]}</span><span>{item}</span></button>)}
          </nav>
          <p className={styles.railHeading}>Acceso rápido</p>
          <nav className={styles.railNav} aria-label="Recursos de Filosofía">
            {sections.map((item) => <button type="button" key={item.id} className={section === item.id ? styles.activeRail : ""} onClick={() => { setSection(item.id); setSearch(""); }}><span className={styles.navIcon}>{item.icon}</span><span>{item.label}</span></button>)}
            <Link href="/dashboard/filosofia/entrenamiento"><span className={styles.navIcon}>✓</span><span>Entrenamiento</span></Link>
          </nav>
          <div className={styles.railFooter}><button type="button">⚙ Ajustes</button><button type="button">◐ Modo oscuro</button></div>
        </aside>

        <main className={styles.main}>
          {section === "inicio" ? <PhilosophyHome featured={featured} onOpen={setSection} /> : <SectionView section={section} period={period} search={search} setSearch={setSearch} cards={cards} />}
        </main>

        <PhilosophyRightRail featured={featured} />
      </div>
    </div>
  );
}

function PhilosophyHome({ featured, onOpen }: { featured: (typeof catalog.authors)[number]; onOpen: (section: Section) => void }) {
  const videoId = youtubeId(featured.video?.url);
  return <>
    <div className={styles.breadcrumb}>⌂ &nbsp;/&nbsp; Temario &nbsp;/&nbsp; Filosofía contemporánea &nbsp;/&nbsp; {featured.title}</div>
    <header className={styles.heroHeader}><div><h1>{featured.title}</h1><p>{featured.period}</p></div><button className={styles.bookmark} type="button" aria-label="Guardar autor">♡</button></header>
    <nav className={styles.modeTabs} aria-label="Modos de estudio"><button type="button" className={styles.activeMode}>▤ Aprender</button><Link href="/dashboard/filosofia/entrenamiento">◎ Entrenar</Link><button type="button" onClick={() => onOpen("pau")}>▣ PAU</button></nav>
    <section className={styles.videoCard}>
      <div className={styles.videoSplit}>
        <div className={styles.videoFrame}>{videoId ? <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`Vídeo: ${featured.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : null}</div>
        <div className={styles.videoCopy}><small>● VÍDEO PRINCIPAL</small><h2>{featured.title} · Pensamiento y crítica de la moral</h2><p>{featured.guide}</p><Link className={styles.primaryLink} href={`/dashboard/filosofia/autor-${featured.id}`}>Continuar →</Link></div>
      </div>
    </section>
    <h2 className={styles.groupTitle}>Recursos de aprendizaje</h2>
    <div className={styles.cardGrid}>
      <Feature href={`/dashboard/filosofia/autor-${featured.id}`} icon="▣" title="Explicación" text="Desarrollo completo del pensamiento del autor." action="Ver tema" />
      <Feature href={`/dashboard/filosofia/autor-${featured.id}`} icon="◉" title="Conceptos clave" text={featured.concepts.slice(0, 4).join(", ")} action="Ver conceptos" />
      <Feature href="/dashboard/filosofia/concepto-nihilismo" icon="▤" title="Glosario" text="Términos esenciales conectados con el autor." action="Consultar" />
      <Feature href="/dashboard/filosofia/comparacion-2-platon-nietzsche" icon="⌘" title="Comparaciones relacionadas" text="Relaciones y diferencias con otros filósofos del temario." action="Explorar" />
    </div>
    <h2 className={styles.groupTitle}>Entrena lo que has aprendido</h2>
    <div className={styles.cardGrid}>
      <Feature href="/dashboard/filosofia/entrenamiento" icon="☷" title="Test de conceptos" text="Pon a prueba tus conocimientos." action="Hacer test" training />
      <Feature href="/dashboard/filosofia/entrenamiento" icon="▣" title="Preguntas cortas" text="Practica con preguntas tipo examen." action="Practicar" training />
      <Feature href="/dashboard/filosofia/entrenamiento" icon="✎" title="Desarrollo" text="Entrena la redacción de temas." action="Ver ejercicios" training />
      <Feature href="/dashboard/filosofia/comparacion-2-platon-nietzsche" icon="⚖" title="Comparaciones" text="Compara a Nietzsche con otros filósofos." action="Comenzar" training />
    </div>
    <div className={styles.pauStrip}><span className={styles.resourceIcon}>◇</span><div><strong>Prepara tu PAU</strong><small>Ejercicios, exámenes resueltos y orientaciones de tu comunidad.</small></div><select aria-label="Comunidad autónoma" defaultValue="andalucia"><option value="andalucia">Andalucía</option><option value="madrid">Madrid</option><option value="comunitat-valenciana">Comunidad Valenciana</option></select><Link className={styles.primaryLink} href="/dashboard/filosofia/pau-andalucia">Ver recursos →</Link></div>
  </>;
}

function Feature({ href, icon, title, text, action, training = false }: { href: string; icon: string; title: string; text: string; action: string; training?: boolean }) {
  return <Link href={href} className={training ? styles.trainingCard : styles.featureCard}><span className={styles.resourceIcon}>{icon}</span><h3>{title}</h3><p>{text}</p><b>{action} →</b></Link>;
}

function SectionView({ section, period, search, setSearch, cards }: { section: Section; period: string; search: string; setSearch: (value: string) => void; cards: { href: string; eyebrow: string; title: string; text: string }[] }) {
  const label = section === "autores" ? period : sections.find((item) => item.id === section)?.label ?? "Historia de la Filosofía";
  return <><div className={styles.breadcrumb}>⌂ &nbsp;/&nbsp; Historia de la Filosofía &nbsp;/&nbsp; {label}</div><header className={styles.sectionHeader}><div><h1>{label}</h1><p>Todos los recursos del paquete maestro, organizados para estudiar y entrenar.</p></div>{["autores", "corrientes", "comparaciones", "glosario"].includes(section) ? <input className={styles.sectionSearch} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar autor, concepto o problema" /> : null}</header>{cards.length ? <div className={styles.resourceGrid}>{cards.map((item) => <Link href={item.href} className={styles.resourceListCard} key={item.href}><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.text}</p><b>Consultar →</b></Link>)}</div> : <p className={styles.empty}>No hay resultados para esta búsqueda.</p>}</>;
}

function PhilosophyRightRail({ featured }: { featured: (typeof catalog.authors)[number] }) {
  return <aside className={styles.rightRail}>
    <section className={styles.sideCard}><div className={styles.sideHeader}><span>▤ Glosario contextual</span><Link href="/dashboard/filosofia/concepto-nihilismo">Ver todo</Link></div><dl className={styles.glossaryList}><Term name="Nihilismo" text="Pérdida de fuerza de los valores supremos y problema de crear nuevos valores." /><Term name="Ressentiment" text="Afecto reactivo que invierte los valores y condena moralmente al fuerte." /><Term name="Superhombre" text="Figura de superación y creación afirmativa de nuevos valores." /><Term name="Transvaloración" text="Revisión radical de los valores heredados tras la crisis de la moral tradicional." /></dl></section>
    <section className={styles.sideCard}><div className={styles.assistantHead}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, profesora IA" width={1536} height={1024} /><div><h3>Profesora IA · Rocío</h3><p>Pregúntame sobre {featured.title} y su filosofía.</p></div><span className={styles.badge}>Beta</span></div><div className={styles.assistantPrompts}><span>Explícame el nihilismo</span><span>Compáralo con Platón</span><span>No entiendo el eterno retorno</span></div><Link className={`${styles.secondaryLink} ${styles.assistantAction}`} href="/dashboard/filosofia/entrenamiento">Practicar con Rocío →</Link></section>
    <section className={styles.sideCard}><div className={styles.assistantHead}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, tutor IA" width={1536} height={1024} /><div><h3>Tutor IA · Fernando</h3><p>Te ayuda a planificar el estudio y mantener el ritmo.</p></div><span className={styles.badge}>Beta</span></div><div className={styles.assistantPrompts}><span>Plan de estudio</span><span>Repaso de temas</span><span>Siguientes pasos</span></div><Link className={`${styles.secondaryLink} ${styles.assistantAction}`} href="/dashboard/plan-estudio?course=historia-filosofia">Abrir plan de estudio →</Link></section>
    <section className={styles.sideCard}><div className={styles.sideHeader}><span>▥ Tu progreso</span><Link href="/dashboard">Ver detalle</Link></div><ul className={styles.progressList}><li className={styles.completeItem}><span>✓</span><span>Vídeo</span><b>Completado</b></li><li className={styles.completeItem}><span>✓</span><span>Explicación</span><b>Completado</b></li><li><span>◔</span><span>Conceptos clave</span><b>8 / 12</b></li><li><span>◔</span><span>Test de conceptos</span><b>78%</b></li><li><span>○</span><span>Desarrollo</span><b>Pendiente</b></li></ul></section>
  </aside>;
}

function Term({ name, text }: { name: string; text: string }) { return <div><dt>{name}</dt><dd>{text}</dd></div>; }

function youtubeId(url?: string | null) {
  if (!url) return "";
  try { const parsed = new URL(url); if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0]; return parsed.searchParams.get("v") ?? ""; } catch { return ""; }
}
