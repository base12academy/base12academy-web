"use client";

import Link from "next/link";
import { useState } from "react";
import catalog from "@/data/filosofia/catalog.json";
import baseStyles from "./filosofia.module.css";
import videoStyles from "./video.module.css";

const styles = { ...baseStyles, ...videoStyles };

type Section = "inicio" | "autores" | "corrientes" | "comparaciones" | "glosario" | "metodologia" | "talleres" | "pau";

const sectionLabels: { id: Section; label: string; hint: string }[] = [
  { id: "inicio", label: "Inicio", hint: "Mapa del curso" },
  { id: "autores", label: "Filósofos", hint: "35 autores" },
  { id: "corrientes", label: "Corrientes", hint: "13 bloques" },
  { id: "comparaciones", label: "Comparaciones", hint: "14 relaciones" },
  { id: "glosario", label: "Glosario", hint: "189 conceptos" },
  { id: "metodologia", label: "Método PAU", hint: "16 destrezas" },
  { id: "talleres", label: "Talleres", hint: "Práctica guiada" },
  { id: "pau", label: "PAU por territorio", hint: "17 comunidades" },
];

export default function FilosofiaPage() {
  const [section, setSection] = useState<Section>("inicio");
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("es");
  const matches = (value: string) => !query || value.toLocaleLowerCase("es").includes(query);

  const authors = catalog.authors.filter((item) => matches(`${item.title} ${item.period} ${item.guide} ${item.concepts.join(" ")}`));
  const currents = catalog.blocks.filter((item) => matches(`${item.title} ${item.period} ${item.concepts.join(" ")}`));
  const comparisons = catalog.comparisons.filter((item) => matches(`${item.title} ${item.axis} ${item.authorA} ${item.authorB}`));
  const glossary = catalog.glossary.filter((item) => matches(`${item.title} ${item.period} ${item.authors}`));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}><b>B12</b><span>Base12 Academy</span></Link>
        <p className={styles.eyebrow}>AULA</p>
        <h1>Historia de la Filosofía</h1>
        <div className={styles.progress}><span /></div>
        <nav aria-label="Secciones del curso">
          {sectionLabels.map((item) => (
            <button key={item.id} className={section === item.id ? styles.activeNav : ""} onClick={() => setSection(item.id)}>
              <span>{item.label}</span><small>{item.hint}</small>
            </button>
          ))}
          <Link className={styles.trainingLink} href="/dashboard/filosofia/entrenamiento">Entrenamiento <small>Test, cortas, largas y Rocío</small></Link>
          <Link className={styles.libraryLink} href="/dashboard/filosofia/biblioteca-conceptos-transversales">Biblioteca <small>Conceptos, obras y pensamientos</small></Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.topline}><Link href="/dashboard">← Área de estudio</Link><span>Paquete maestro · 06/09/2026</span></div>
        {section === "inicio" ? (
          <Home onOpen={setSection} />
        ) : (
          <>
            <header className={styles.sectionHeader}>
              <div><p className={styles.eyebrow}>HISTORIA DE LA FILOSOFÍA</p><h2>{sectionLabels.find((item) => item.id === section)?.label}</h2></div>
              {(section === "autores" || section === "corrientes" || section === "comparaciones" || section === "glosario") && (
                <label className={styles.search}><span>Buscar en esta sección</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Autor, concepto o problema" /></label>
              )}
            </header>
            {section === "autores" && <CardGrid items={authors.map((item) => ({ href: `/dashboard/filosofia/autor-${item.id}`, eyebrow: item.period, title: item.title, text: item.guide, tags: item.concepts.slice(0, 4) }))} empty="No hay autores que coincidan con la búsqueda." />}
            {section === "corrientes" && <CardGrid items={currents.map((item) => ({ href: `/dashboard/filosofia/corriente-${item.id}`, eyebrow: item.period, title: item.title, text: item.concepts.slice(0, 6).join(" · ") }))} empty="No hay corrientes que coincidan con la búsqueda." />}
            {section === "comparaciones" && <CardGrid items={comparisons.map((item) => ({ href: `/dashboard/filosofia/comparacion-${item.id}`, eyebrow: `COMPARACIÓN ${item.number}`, title: `${item.authorA} y ${item.authorB}`, text: item.axis }))} empty="No hay comparaciones que coincidan con la búsqueda." />}
            {section === "glosario" && <CardGrid compact items={glossary.map((item) => ({ href: `/dashboard/filosofia/concepto-${item.id}`, eyebrow: item.period, title: item.title, text: item.authors }))} empty="No hay conceptos que coincidan con la búsqueda." />}
            {section === "metodologia" && <CardGrid items={catalog.methodology.map((item) => ({ href: `/dashboard/filosofia/metodo-${item.id}`, eyebrow: `DESTREZA ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Explicación, procedimiento, práctica y autocorrección." }))} />}
            {section === "talleres" && <CardGrid items={catalog.workshops.map((item) => ({ href: `/dashboard/filosofia/taller-${item.id}`, eyebrow: "PRÁCTICA COMPLEMENTARIA", title: item.title, text: "Actividades graduadas, rúbricas y entrenamiento de competencia filosófica." }))} />}
            {section === "pau" && <CardGrid items={catalog.territories.map((item) => ({ href: `/dashboard/filosofia/pau-${item.id}`, eyebrow: "MODELO TERRITORIAL", title: item.title, text: "Banco de preguntas, método y simulacros adaptados al territorio." }))} />}
          </>
        )}
      </main>
    </div>
  );
}

function Home({ onOpen }: { onOpen: (section: Section) => void }) {
  const counts = catalog.counts;
  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>2.º DE BACHILLERATO Y PAU</p>
          <h2>Comprende las ideas.<br />Aprende a relacionarlas.</h2>
          <p>Un curso de apoyo para contextualizar autores, aclarar conceptos, entrenar respuestas y preparar el modelo PAU de tu comunidad.</p>
          <div className={styles.heroActions}><Link href="/dashboard/filosofia/autor-socrates">Ver una unidad abierta</Link><button onClick={() => onOpen("autores")}>Explorar el curso</button></div>
        </div>
      </section>

      <section className={styles.stats} aria-label="Contenido del curso">
        <Stat value={counts.authors} label="filósofos" />
        <Stat value={counts.blocks} label="corrientes y bloques" />
        <Stat value={counts.comparisons} label="comparaciones" />
        <Stat value={counts.glossary} label="conceptos" />
        <Stat value={counts.tests + counts.shorts + counts.longs} label="preguntas generales" />
        <Stat value={counts.rocioAuthors + counts.rocioPau} label="preguntas de Rocío" />
      </section>

      <section className={styles.learningPath}>
        <div className={styles.sectionTitle}><p className={styles.eyebrow}>ITINERARIO</p><h2>Una ruta clara para estudiar</h2></div>
        <div className={styles.pathGrid}>
          <PathCard number="01" title="Comprender" text="Autores, corrientes y comparaciones explicados dentro de su problema histórico." onClick={() => onOpen("autores")} />
          <PathCard number="02" title="Consultar" text="Glosario, conceptos transversales, obras y pensamientos esenciales." onClick={() => onOpen("glosario")} />
          <PathCard number="03" title="Entrenar" text="Test, preguntas cortas y desarrollos organizados en 17 bancos." href="/dashboard/filosofia/entrenamiento" />
          <PathCard number="04" title="Preparar la PAU" text="16 destrezas, talleres y 17 modelos territoriales con simulacros." onClick={() => onOpen("metodologia")} />
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) { return <div><strong>{value.toLocaleString("es-ES")}</strong><span>{label}</span></div>; }

function PathCard({ number, title, text, href, onClick }: { number: string; title: string; text: string; href?: string; onClick?: () => void }) {
  const content = <><span>{number}</span><h3>{title}</h3><p>{text}</p><b>Entrar →</b></>;
  return href ? <Link className={styles.pathCard} href={href}>{content}</Link> : <button className={styles.pathCard} onClick={onClick}>{content}</button>;
}

function CardGrid({ items, empty, compact = false }: { items: { href: string; eyebrow: string; title: string; text: string; tags?: string[] }[]; empty?: string; compact?: boolean }) {
  if (!items.length) return <p className={styles.empty}>{empty}</p>;
  return <div className={`${styles.cardGrid} ${compact ? styles.compactGrid : ""}`}>{items.map((item) => <Link className={styles.resourceCard} href={item.href} key={item.href}><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.text}</p>{item.tags?.length ? <div>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}<b>Consultar →</b></Link>)}</div>;
}
