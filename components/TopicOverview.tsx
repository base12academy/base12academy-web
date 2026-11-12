"use client";

import styles from "./TopicOverview.module.css";

type Resource = {id:string;label:string;description:string;icon?:string;onOpen:()=>void};
type Props = {number:number;title:string;loading?:boolean;available:boolean;headings?:string[];glossaryCount?:number;questionCount?:number;onRead:()=>void;onIndex:()=>void;resources:Resource[];accent?:"green"|"amber";videoUrl?:string};

/** A topic hub contains only resources supplied by the course, never mockup data. */
export default function TopicOverview({number,title,loading,available,headings=[],glossaryCount,questionCount,onRead,onIndex,resources,accent="green",videoUrl}:Props){
 const sections=Array.from(new Set(headings.map(t=>t.trim()).filter(t=>t&&t!==title&&!/^Artículo\s+\d|^Lectura del articulado$/i.test(t)))).slice(0,4);
 const video=videoUrl&&/^https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//i.test(videoUrl)?videoUrl:undefined;
 return <div className={`${styles.hub} ${accent==="amber"?styles.amber:""}`}>
  <div className={`${styles.lessonGrid} ${video?styles.withVideo:""}`}>
   <section className={styles.explanation} aria-label="Explicación actual">
    <div className={styles.heading}><span className={styles.book}><Glyph name="book"/></span><h2>Explicación actual</h2><span className={styles.tag}>Tema {number}</span></div>
    <p className={styles.intro}>{loading?"Preparando los recursos del tema…":available?"Estudia el articulado y las explicaciones del libro revisado de EC Libros. Después, comprueba lo aprendido y consulta tus dudas con Rocío.":"Consulta el índice y accede con tu matrícula para estudiar este tema. El tema 1 está abierto para probar el curso."}</p>
    {available&&sections.length>0&&<div className={styles.contents}><strong>En este tema</strong><ul>{sections.map(text=><li key={text}>{text}</li>)}</ul></div>}
    <div className={styles.facts}><span><Glyph name="book"/><span>Material principal<strong>Temario del libro</strong></span></span>{available&&glossaryCount!==undefined&&<span><Glyph name="glossary"/><span>Glosario del tema<strong>{glossaryCount} conceptos</strong></span></span>}{available&&questionCount!==undefined&&<span><Glyph name="test"/><span>Preguntas disponibles<strong>{questionCount} preguntas</strong></span></span>}</div>
    <button className={styles.read} onClick={onRead} disabled={loading}><Glyph name="book"/>{available?"Abrir explicación":"Ver acceso al tema"}<span aria-hidden="true">→</span></button>
   </section>
   {video&&<section className={styles.video}><h2>Vídeo de apoyo</h2><iframe src={video} title={`Vídeo del tema ${number}: ${title}`} allow="fullscreen; picture-in-picture" allowFullScreen loading="lazy"/><p>Síntesis del tema para acompañar la lectura del libro.</p></section>}
  </div>
  <div className={styles.quick}><button onClick={onIndex}><Glyph name="book"/><span><strong>Temario</strong><small>Consulta todos los temas del curso.</small></span><b>›</b></button>{resources.filter(r=>["temario","glosario","rocio"].includes(r.id)).map(r=><button key={r.id} onClick={r.onOpen}><Glyph name={r.icon||r.id}/><span><strong>{r.id==="temario"?"Explicación":r.id==="rocio"?"Rocío IA":"Glosario"}</strong><small>{r.id==="temario"?"Estudia el contenido de este tema.":r.id==="rocio"?"Plantea tus dudas sobre la materia.":"Consulta términos y conceptos clave."}</small></span><b>›</b></button>)}</div>
  <section className={styles.more}><h2>Más recursos del curso</h2><div className={styles.resources}>{resources.filter(r=>!["temario","glosario","rocio"].includes(r.id)).map(r=><button key={r.id} onClick={r.onOpen}><Glyph name={r.icon||r.id}/><span><strong>{r.label}</strong><small>{r.description}</small></span><b>›</b></button>)}</div></section>
 </div>;
}

function Glyph({name}:{name:string}){
 const paths:Record<string,string>={book:"M12 6C9 4 6 4 3 5v15c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v15",glossary:"M5 3h14v18H5zM8 7h8M8 11h8M8 15h5",test:"M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1",clock:"M4 21v-8h4v8M10 21V8h4v13M16 21V3h4v18",chart:"M3 20 10 13l4 3 7-12M15 4h6v6",chat:"M21 11a9 8 0 0 1-9 8H8l-5 3 1-6a8 8 0 0 1-1-5 9 8 0 0 1 18 0ZM8 11h.01M12 11h.01M16 11h.01",sources:"m3 9 9-6 9 6ZM5 10v9M10 10v9M14 10v9M19 10v9M3 21h18",calendar:"M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14l3 3 5-5"};
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.book}/></svg>;
}
