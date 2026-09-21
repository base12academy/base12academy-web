"use client";

import Image from "next/image";
import CourseAssistantChat from "@/components/CourseAssistantChat";
import CourseProgressSummary from "@/components/learning/CourseProgressSummary";
import Link from "next/link";
import { useMemo, useState } from "react";
import catalog from "@/data/historia/catalog.json";
import styles from "../course-interface.module.css";

type Section = "inicio" | "temas" | "cronologias" | "glosario" | "metodo" | "pau" | "videos";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "inicio", label: "Inicio", icon: "⌂" },
  { id: "temas", label: "Temas", icon: "▤" },
  { id: "cronologias", label: "Cronología interactiva", icon: "↕" },
  { id: "videos", label: "Microvídeos", icon: "▶" },
  { id: "glosario", label: "Glosario", icon: "Aa" },
  { id: "metodo", label: "Método PAU", icon: "◎" },
  { id: "pau", label: "PAU por comunidades", icon: "◇" },
];

export default function HistoriaEspanaPage() {
  const [rocioChatOpen,setRocioChatOpen]=useState(false);
  const [fernandoChatOpen,setFernandoChatOpen]=useState(false);
  const [section, setSection] = useState<Section>("inicio");
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("es");
  const featured = catalog.units[0];

  const cards = useMemo(() => {
    const matches = (value: string) => !query || value.toLocaleLowerCase("es").includes(query);
    if (section === "temas") return catalog.units.filter((item) => matches(`${item.title} ${item.guide} ${item.chapter}`)).map((item) => ({ href: `/dashboard/historia-espana/${item.id}`, eyebrow: `${item.chapter} · TEMA ${String(item.number).padStart(2, "0")}`, title: item.title, text: item.guide }));
    if (section === "cronologias") return catalog.chronologies.filter((item) => matches(item.title)).map((item) => ({ href: `/dashboard/historia-espana/${item.id}`, eyebrow: `CRONOLOGÍA ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Secuencia, hitos esenciales y relaciones causales." }));
    if (section === "glosario") return [{ href: "/dashboard/historia-espana/glosario-maestro", eyebrow: "CONSULTA", title: "Glosario maestro y 32 glosarios", text: "180 conceptos históricos definidos y conectados con cada tema." }];
    if (section === "metodo") return catalog.methods.map((item) => ({ href: `/dashboard/historia-espana/${item.id}`, eyebrow: `DESTREZA ${String(item.number).padStart(2, "0")}`, title: item.title, text: "Método paso a paso, ejemplo, errores frecuentes y control de Rocío." }));
    if (section === "pau") return catalog.territories.map((item) => ({ href: `/dashboard/historia-espana/pau-${item.id}`, eyebrow: "MODELO TERRITORIAL", title: item.title, text: item.exerciseCount ? `${item.exerciseCount} ejercicios territoriales específicos.` : "Formato, puntuación, destrezas y simulacros adaptados." }));
    if (section === "videos") return [...catalog.mainVideos, ...catalog.supportVideos].filter((item) => item.url && matches(`${item.title} ${"topic" in item ? item.topic : ""}`)).map((item) => ({ href: `/dashboard/historia-espana/video-${item.id}`, eyebrow: "VÍDEO", title: item.title, text: "Recurso audiovisual del paquete maestro de Historia de España." }));
    return [];
  }, [query, section]);

  return <div className={styles.page}>
    <header className={styles.topbar}>
      <Link href="/" className={styles.brand}><Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority /><strong>Historia de España</strong></Link>
      <label className={styles.topSearch}><span className={styles.srOnly}>Buscar en Historia de España</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en Historia de España…" /></label>
      <nav className={styles.topActions} aria-label="Navegación general"><Link href="/dashboard">▣ Plan de estudio</Link><button type="button">♢ Avisos</button><Link href="/dashboard">◯ Mi cuenta</Link></nav>
    </header>

    <div className={styles.layout}>
      <aside className={styles.leftRail}>
        <h2 className={styles.courseTitle}><span>▤</span><span>Historia de España<br /><small>2.º Bachillerato · PAU</small></span></h2>
        <CourseProgressSummary courseSlug="historia-espana" compact/><div className={styles.railRule} />
        <nav className={styles.railNav} aria-label="Recursos de Historia de España">
          {sections.map((item) => <button type="button" key={item.id} className={section === item.id ? styles.activeRail : ""} onClick={() => { setSection(item.id); setSearch(""); }}><span className={styles.navIcon}>{item.icon}</span><span>{item.label}</span></button>)}
          <Link href="/dashboard/historia-espana/entrenamiento"><span className={styles.navIcon}>✓</span><span>Entrenamiento</span></Link>
          <Link href="/dashboard/historia-espana/rocio"><span className={styles.navIcon}>✦</span><span>Rocío</span></Link>
          <Link href="/dashboard/historia-espana/entrenamiento"><span className={styles.navIcon}>▣</span><span>Simulacros</span></Link>
        </nav>
        <div className={styles.railFooter}><button type="button">⚙ Ajustes</button><button type="button">◐ Modo oscuro</button></div>
      </aside>

      <main className={styles.main}>{section === "inicio" ? <HistoryHome featured={featured} onOpen={setSection} /> : <SectionView section={section} search={search} setSearch={setSearch} cards={cards} />}</main>
      <HistoryRightRail onRocio={()=>setRocioChatOpen(true)} onFernando={()=>setFernandoChatOpen(true)} />
      <CourseAssistantChat entryPoint="rocio" courseSlug="historia-espana" contextTitle={"Historia de España · Tema "+featured.number+" · "+featured.title} open={rocioChatOpen} onClose={()=>setRocioChatOpen(false)}/>
      <CourseAssistantChat entryPoint="fernando" courseSlug="historia-espana" contextTitle={"Historia de España · Tema "+featured.number+" · "+featured.title} open={fernandoChatOpen} onClose={()=>setFernandoChatOpen(false)}/>
    </div>
  </div>;
}

function HistoryHome({ featured, onOpen }: { featured: (typeof catalog.units)[number]; onOpen: (section: Section) => void }) {
  const video = featured.videos[0];
  const videoId = youtubeId(video?.url);
  const related = catalog.supportVideos.filter((item) => ["apoyo-64", "apoyo-40", "apoyo-51"].includes(item.id));
  return <>
    <div className={styles.breadcrumb}>⌂ &nbsp;/&nbsp; Historia de España &nbsp;/&nbsp; Tema {featured.number}</div>
    <header className={styles.heroHeader}><div><h1>Tema {featured.number} · {featured.title}</h1><p>{featured.chapter}</p></div><button className={styles.bookmark} type="button" aria-label="Guardar tema">♡</button></header>
    <nav className={`${styles.modeTabs} ${styles.modeTabsFour}`} aria-label="Modos de estudio"><button type="button" className={styles.activeMode}>▶ Aprender</button><button type="button" onClick={() => onOpen("glosario")}>▤ Profundizar</button><Link href="/dashboard/historia-espana/entrenamiento">◎ Entrenar</Link><button type="button" onClick={() => onOpen("pau")}>◇ PAU</button></nav>
    <section className={styles.videoCard}><div className={styles.videoSplit}><div className={styles.videoFrame}>{videoId ? <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`Vídeo: ${video.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : null}</div><div className={styles.videoCopy}><small>VÍDEO PRINCIPAL · TEMA {featured.number}</small><h2>{video?.title ?? featured.title}</h2><p>{featured.guide}</p><Link className={styles.primaryLink} href={`/dashboard/historia-espana/${featured.id}`}>Abrir el tema →</Link></div></div></section>
    <div className={styles.cardGrid} style={{ marginTop: 12 }}>
      <Feature href={`/dashboard/historia-espana/${featured.id}`} icon="▣" title="Explicación" text="Resumen y explicación pedagógica del tema." action="Ver explicación" />
      <Feature href="/dashboard/historia-espana/glosario-maestro" icon="◉" title="Conceptos clave" text="Términos, instituciones y procesos esenciales." action="Ver conceptos" />
      <Feature href="/dashboard/historia-espana/cronologia-03" icon="↕" title="Cronología" text="Línea del tiempo desde los Reyes Católicos a los Austrias." action="Ver cronología" />
      <Feature href="/dashboard/historia-espana/entrenamiento" icon="◎" title="Entrenamiento" text="Test, cortas, fuentes y desarrollo." action="Practicar" />
    </div>
    <div className={styles.microHeader}><h2>Microvídeos relacionados ({related.length})</h2><button type="button" onClick={() => onOpen("videos")} className={styles.secondaryLink}>Ver todos</button></div>
    <div className={styles.microGrid}>{related.map((item) => <Link className={styles.microCard} href={`/dashboard/historia-espana/video-${item.id}`} key={item.id}><span className={styles.microThumb}>▶</span><strong>{item.title}</strong></Link>)}</div>
  </>;
}

function Feature({ href, icon, title, text, action }: { href: string; icon: string; title: string; text: string; action: string }) { return <Link href={href} className={styles.featureCard}><span className={styles.resourceIcon}>{icon}</span><h3>{title}</h3><p>{text}</p><b>{action} →</b></Link>; }

function SectionView({ section, search, setSearch, cards }: { section: Section; search: string; setSearch: (value: string) => void; cards: { href: string; eyebrow: string; title: string; text: string }[] }) {
  const label = sections.find((item) => item.id === section)?.label ?? "Historia de España";
  return <><div className={styles.breadcrumb}>⌂ &nbsp;/&nbsp; Historia de España &nbsp;/&nbsp; {label}</div><header className={styles.sectionHeader}><div><h1>{label}</h1><p>Contenido del paquete maestro de Historia de España.</p></div>{["temas", "cronologias", "videos"].includes(section) ? <input className={styles.sectionSearch} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar tema, proceso o concepto" /> : null}</header>{cards.length ? <div className={styles.resourceGrid}>{cards.map((item) => <Link href={item.href} className={styles.resourceListCard} key={item.href}><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.text}</p><b>Consultar →</b></Link>)}</div> : <p className={styles.empty}>No hay resultados para esta búsqueda.</p>}</>;
}

function HistoryRightRail({onRocio,onFernando}:{onRocio:()=>void;onFernando:()=>void}) { return <aside className={styles.rightRail}>
  <section className={styles.sideCard}><div className={styles.assistantHead}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, profesora IA" width={1536} height={1024} /><div><h3>Rocío</h3><p>Profesora IA · Pregúntame sobre este tema.</p></div><span className={styles.badge}>Beta</span></div><div className={styles.assistantPrompts}><span>Explícame la unión dinástica</span><span>¿Qué instituciones se reforzaron?</span><span>Resume la conquista de Granada</span></div><button className={`${styles.secondaryLink} ${styles.assistantAction}`} type="button" onClick={onRocio}>Preguntar a Rocío →</button></section>
  <section className={styles.sideCard}><div className={styles.assistantHead}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, tutor IA" width={1536} height={1024} /><div><h3>Fernando</h3><p>Tutor IA · Te ayuda con tu plan de estudio.</p></div><span className={styles.badge}>Beta</span></div><button className={`${styles.secondaryLink} ${styles.assistantAction}`} type="button" onClick={onFernando}>Hablar con Fernando →</button></section>
  <CourseProgressSummary courseSlug="historia-espana"/>
  <section className={styles.sideCard}><div className={styles.sideHeader}><span>▤ Glosario contextual</span><Link href="/dashboard/historia-espana/glosario-maestro">Ver todo</Link></div><dl className={styles.glossaryList}><Term name="Unión dinástica" text="Los monarcas comparten la Corona, pero cada territorio conserva sus leyes e instituciones." /><Term name="Corona de Castilla" text="Territorio central en la expansión y el gobierno de los Reyes Católicos." /><Term name="Corona de Aragón" text="Conjunto de territorios con instituciones y tradición política propias." /><Term name="Inquisición" text="Instrumento de la política religiosa de los Reyes Católicos." /></dl></section>
  </aside>; }

function Term({ name, text }: { name: string; text: string }) { return <div><dt>{name}</dt><dd>{text}</dd></div>; }
function youtubeId(url?: string | null) { if (!url) return ""; try { const parsed = new URL(url); if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0]; return parsed.searchParams.get("v") ?? ""; } catch { return ""; } }
