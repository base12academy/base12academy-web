"use client";

import Link from "next/link";
import { useState } from "react";
import catalog from "@/data/historia/catalog.json";
import styles from "../filosofia/filosofia.module.css";

type Section = "inicio" | "temas" | "cronologias" | "glosario" | "metodo" | "pau" | "videos";

const sectionLabels: { id: Section; label: string; hint: string }[] = [
  { id: "inicio", label: "Inicio", hint: "Mapa del curso" },
  { id: "temas", label: "Temas", hint: `${catalog.counts.units} explicaciones` },
  { id: "cronologias", label: "Cronologías", hint: `${catalog.counts.chronologyExercises} ejercicios` },
  { id: "glosario", label: "Glosario", hint: "Maestro y 32 temas" },
  { id: "metodo", label: "Método PAU", hint: `${catalog.counts.methods} destrezas` },
  { id: "pau", label: "PAU por territorio", hint: `${catalog.counts.territories} comunidades` },
  { id: "videos", label: "Vídeos", hint: `${catalog.counts.mainVideos + catalog.counts.supportVideos} recursos` },
];

export default function HistoriaEspanaPage() {
  const [section, setSection] = useState<Section>("inicio");
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("es");
  const matches = (value: string) => !query || value.toLocaleLowerCase("es").includes(query);
  const units = catalog.units.filter((item) => matches(`${item.title} ${item.guide} ${item.chapter}`));
  const mainVideos = catalog.mainVideos.filter((item) => item.url && matches(`${item.title} ${item.topic} ${item.code}`));
  const supportVideos = catalog.supportVideos.filter((item) => item.url && matches(item.title));

  return <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}><b>B12</b><span>Base12 Academy</span></Link>
      <p className={styles.eyebrow}>AULA</p>
      <h1>Historia de España</h1>
      <div className={styles.progress}><span /></div>
      <nav aria-label="Secciones del curso">
        {sectionLabels.map((item) => <button key={item.id} className={section === item.id ? styles.activeNav : ""} onClick={() => setSection(item.id)}><span>{item.label}</span><small>{item.hint}</small></button>)}
        <Link className={styles.trainingLink} href="/dashboard/historia-espana/entrenamiento">Entrenamiento <small>Test, cortas, fuentes y desarrollo</small></Link>
        <Link className={styles.libraryLink} href="/dashboard/historia-espana/rocio">Rocío <small>{catalog.counts.rocio.toLocaleString("es-ES")} actividades</small></Link>
      </nav>
    </aside>

    <main className={styles.main}>
      <div className={styles.topline}><Link href="/dashboard">← Área de estudio</Link><span>Paquete maestro · 07/09/2026</span></div>
      {section === "inicio" ? <Home onOpen={setSection} /> : <>
        <header className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>HISTORIA DE ESPAÑA</p><h2>{sectionLabels.find((item) => item.id === section)?.label}</h2></div>
          {(section === "temas" || section === "videos") && <label className={styles.search}><span>Buscar en esta sección</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tema, proceso o concepto" /></label>}
        </header>
        {section === "temas" && <CardGrid items={units.map((item) => ({ href: `/dashboard/historia-espana/${item.id}`, eyebrow: `${item.chapter} · TEMA ${String(item.number).padStart(2, "0")}`, title: item.title, text: item.guide }))} empty="No hay temas que coincidan con la búsqueda." />}
        {section === "cronologias" && <CardGrid items={catalog.chronologies.map((item) => ({ href: `/dashboard/historia-espana/${item.id}`, eyebrow: `CRONOLOGÍA ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Secuencia, hitos esenciales y relaciones causales." }))} />}
        {section === "glosario" && <CardGrid items={[{ href: "/dashboard/historia-espana/glosario-maestro", eyebrow: "CONSULTA", title: "Glosario maestro y 32 glosarios", text: "Conceptos históricos definidos y conectados con cada tema." }]} />}
        {section === "metodo" && <CardGrid items={catalog.methods.map((item) => ({ href: `/dashboard/historia-espana/${item.id}`, eyebrow: `DESTREZA ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Método paso a paso, ejemplo, errores frecuentes y control de Rocío." }))} />}
        {section === "pau" && <CardGrid items={catalog.territories.map((item) => ({ href: `/dashboard/historia-espana/pau-${item.id}`, eyebrow: "MODELO TERRITORIAL", title: item.title, text: item.exerciseCount ? `${item.exerciseCount} ejercicios territoriales específicos, además del núcleo común.` : "Formato, puntuación, destrezas y simulacros adaptados a la comunidad." }))} />}
        {section === "videos" && <>
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>CLASES PRINCIPALES</p><h2>Vídeos del temario</h2></div>
          <CardGrid compact items={mainVideos.map((item) => ({ href: `/dashboard/historia-espana/video-${item.id}`, eyebrow: `TEMA ${item.topic}`, title: item.title, text: item.code }))} empty="No hay vídeos que coincidan con la búsqueda." />
          {supportVideos.length ? <div style={{ marginTop: 48 }}><div className={styles.sectionTitle}><p className={styles.eyebrow}>AMPLIACIÓN</p><h2>Vídeos de apoyo</h2></div><CardGrid compact items={supportVideos.map((item) => ({ href: `/dashboard/historia-espana/video-${item.id}`, eyebrow: `APOYO ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Recurso complementario de Historia de España." }))} /></div> : null}
        </>}
      </>}
    </main>
  </div>;
}

function Home({ onOpen }: { onOpen: (section: Section) => void }) {
  const counts = catalog.counts;
  return <>
    <section className={styles.hero}><div><p className={styles.eyebrow}>2.º DE BACHILLERATO Y PAU</p><h2>Comprende los procesos.<br />Aprende a explicarlos.</h2><p>Un curso completo para dominar la cronología, relacionar causas y consecuencias, analizar fuentes y preparar el modelo PAU de tu comunidad.</p><div className={styles.heroActions}><Link href="/dashboard/historia-espana/tema-01">Ver una unidad abierta</Link><button onClick={() => onOpen("temas")}>Explorar el curso</button></div></div></section>
    <section className={styles.stats} aria-label="Contenido del curso"><Stat value={counts.units} label="temas" /><Stat value={counts.tests} label="preguntas test" /><Stat value={counts.shorts} label="preguntas cortas" /><Stat value={counts.sources} label="fuentes históricas" /><Stat value={counts.developments} label="desarrollos" /><Stat value={counts.rocio} label="actividades de Rocío" /></section>
    <section className={styles.learningPath}><div className={styles.sectionTitle}><p className={styles.eyebrow}>ITINERARIO</p><h2>Una ruta clara para estudiar</h2></div><div className={styles.pathGrid}><PathCard number="01" title="Comprender" text="32 explicaciones conectadas con los vídeos principales y los conceptos de cada proceso." onClick={() => onOpen("temas")} /><PathCard number="02" title="Ordenar" text="Cronologías esenciales y 96 ejercicios para dominar secuencias y relaciones causales." onClick={() => onOpen("cronologias")} /><PathCard number="03" title="Entrenar" text="Test, preguntas cortas, fuentes, desarrollos y detección de errores." href="/dashboard/historia-espana/entrenamiento" /><PathCard number="04" title="Preparar la PAU" text="14 destrezas y 17 adaptadores territoriales con reglas de simulacro." onClick={() => onOpen("pau")} /></div></section>
  </>;
}

function Stat({ value, label }: { value: number; label: string }) { return <div><strong>{value.toLocaleString("es-ES")}</strong><span>{label}</span></div>; }
function PathCard({ number, title, text, href, onClick }: { number: string; title: string; text: string; href?: string; onClick?: () => void }) { const content = <><span>{number}</span><h3>{title}</h3><p>{text}</p><b>Entrar →</b></>; return href ? <Link className={styles.pathCard} href={href}>{content}</Link> : <button className={styles.pathCard} onClick={onClick}>{content}</button>; }
function CardGrid({ items, empty, compact = false }: { items: { href: string; eyebrow: string; title: string; text: string }[]; empty?: string; compact?: boolean }) { if (!items.length) return <p className={styles.empty}>{empty}</p>; return <div className={`${styles.cardGrid} ${compact ? styles.compactGrid : ""}`}>{items.map((item) => <Link className={styles.resourceCard} href={item.href} key={item.href}><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.text}</p><b>Consultar →</b></Link>)}</div>; }
