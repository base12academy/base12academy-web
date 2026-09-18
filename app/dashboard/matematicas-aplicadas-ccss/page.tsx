"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MATEMATICAS_APLICADAS_BLOCKS, MATEMATICAS_APLICADAS_STATS, MATEMATICAS_APLICADAS_UNITS } from "@/lib/matematicas-aplicadas-ccss/content";
import styles from "./matematicas-aplicadas.module.css";

type AccessState = { authenticated:boolean; administrator:boolean; hasCourse:boolean; hasPau:boolean; plans:string[]; previewUnit:string };
type VideoState = { embedUrl:string; url:string };
const INITIAL: AccessState = { authenticated:false, administrator:false, hasCourse:false, hasPau:false, plans:[], previewUnit:"T01" };

export default function MatematicasAplicadasPage() {
  const [selectedId,setSelectedId] = useState("T01");
  const [block,setBlock] = useState<(typeof MATEMATICAS_APLICADAS_BLOCKS)[number] | "Todos">("Todos");
  const [query,setQuery] = useState("");
  const [access,setAccess] = useState<AccessState>(INITIAL);
  const [checking,setChecking] = useState(true);
  const [video,setVideo] = useState<VideoState>({embedUrl:"",url:""});
  const [videoLoading,setVideoLoading] = useState(false);

  useEffect(()=>{ let alive=true; (async()=>{
    const {data}=await supabase.auth.getSession();
    const token=data.session?.access_token;
    const response=await fetch("/api/matematicas-aplicadas-ccss/access",{headers:token?{Authorization:`Bearer ${token}`}:undefined});
    const payload=await response.json().catch(()=>INITIAL);
    if(alive){setAccess({...INITIAL,...payload});setChecking(false);}
  })(); return()=>{alive=false}; },[]);

  const selected=MATEMATICAS_APLICADAS_UNITS.find(u=>u.id===selectedId) ?? MATEMATICAS_APLICADAS_UNITS[0];
  const filtered=useMemo(()=>{
    const needle=query.trim().toLocaleLowerCase("es");
    return MATEMATICAS_APLICADAS_UNITS.filter(u=>(block==="Todos"||u.block===block)&&(!needle||(`${u.id} ${u.title} ${u.block}`).toLocaleLowerCase("es").includes(needle)));
  },[block,query]);
  const canOpen=access.administrator||access.hasCourse||selected.id===access.previewUnit;

  useEffect(()=>{ let alive=true; (async()=>{
    if(!canOpen){setVideo({embedUrl:"",url:""});return;}
    setVideoLoading(true);
    const {data}=await supabase.auth.getSession();
    const token=data.session?.access_token;
    const response=await fetch(`/api/matematicas-aplicadas-ccss/video?unit=${encodeURIComponent(selected.id)}`,{headers:token?{Authorization:`Bearer ${token}`}:undefined});
    const payload=await response.json().catch(()=>({}));
    if(alive){setVideo(response.ok?{embedUrl:payload.embedUrl||"",url:payload.url||""}:{embedUrl:"",url:""});setVideoLoading(false);}
  })(); return()=>{alive=false}; },[selected.id,canOpen]);

  return <div className={styles.page}>
    <header className={styles.topbar}>
      <Link href="/" className={styles.brand}><Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority/><span><strong>Matemáticas Aplicadas CCSS II</strong><small>2.º Bachillerato · PAU</small></span></Link>
      <div className={styles.motto}>CONSTRUYE · COMPRENDE · DOMINA</div>
      <nav className={styles.topnav}><Link href="/">Inicio</Link><Link href="/dashboard">Mis cursos</Link><Link href="/dashboard">Mi cuenta</Link></nav>
    </header>

    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link href="/dashboard" className={styles.back}>← Volver a mis cursos</Link>
        <h1>MATEMÁTICAS APLICADAS CCSS II</h1>
        <p className={styles.meta}>44 explicaciones operativas</p>
        <div className={styles.modeSwitch}><button className={styles.activeMode}>Explicaciones</button><button onClick={()=>document.getElementById("pau")?.scrollIntoView({behavior:"smooth"})}>PAU</button></div>
        <label className={styles.searchLabel}>Buscar explicación<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Matrices, optimización, Bayes…"/></label>
        <nav className={styles.blocks} aria-label="Bloques de entrenamiento">
          <button onClick={()=>setBlock("Todos")} className={block==="Todos"?styles.activeBlock:""}>Todas</button>
          {MATEMATICAS_APLICADAS_BLOCKS.map(item=><button key={item} onClick={()=>setBlock(item)} className={block===item?styles.activeBlock:""}>{item}</button>)}
        </nav>
        <div className={styles.unitList}>{filtered.map(unit=>{
          const locked=!access.administrator&&!access.hasCourse&&unit.id!==access.previewUnit;
          return <button key={unit.id} className={selected.id===unit.id?styles.activeUnit:""} onClick={()=>setSelectedId(unit.id)}>
            <span>{unit.order}</span><div><strong>{unit.id}</strong><small>{unit.title}</small></div>{locked?<b aria-label="Bloqueado">◇</b>:null}
          </button>;
        })}</div>
      </aside>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>Matemáticas Aplicadas CCSS II / {selected.block} / {selected.id}</div>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>{selected.block} · Explicación {selected.order} de {MATEMATICAS_APLICADAS_STATS.explanations}</span>
            <h2>{selected.title}</h2>
            <p>No añadimos otro temario. Partimos del tipo de ejercicio que ya trabajas en tu centro: compréndelo, resuélvelo paso a paso, detecta errores y vuelve a resolverlo con datos distintos.</p>
            {canOpen?<div className={styles.heroActions}><button className={styles.primary} onClick={()=>document.getElementById("mapccss-video")?.scrollIntoView({behavior:"smooth"})}>Ver explicación</button><button className={styles.secondary} onClick={()=>document.getElementById("entrenamiento")?.scrollIntoView({behavior:"smooth"})}>Entrenar</button></div>:<div className={styles.lockNotice}><strong>Vista previa</strong><p>La primera explicación está abierta. El resto requiere una modalidad con curso completo.</p><Link href="/bachillerato-pau/matematicas-aplicadas-ccss#modalidades">Ver modalidades</Link></div>}
          </div>
          <div className={styles.mathPanel} aria-hidden="true"><span>f(x)</span><b>∫</b><em>P(A|B)</em><i>Σ</i><small>A · x = b</small></div>
        </section>

        {canOpen?<section id="mapccss-video" style={{marginTop:24,borderRadius:20,border:"1px solid #dbe4f0",background:"#fff",overflow:"hidden",boxShadow:"0 16px 45px rgba(15,23,42,.08)"}}>
          <div style={{padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
            <div><strong style={{display:"block",color:"#0a2a59",fontSize:18}}>{selected.id} · {selected.title}</strong><span style={{color:"#64748b",fontSize:13}}>Explicación audiovisual paso a paso</span></div>
            {video.url?<a href={video.url} target="_blank" rel="noreferrer" style={{color:"#0a2a59",fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"}}>Abrir en YouTube ↗</a>:null}
          </div>
          <div style={{aspectRatio:"16 / 9",background:"#07152d",display:"grid",placeItems:"center"}}>
            {videoLoading?<p style={{color:"#fff",fontWeight:700}}>Cargando vídeo…</p>:video.embedUrl?<iframe src={video.embedUrl} title={`${selected.id} · ${selected.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{width:"100%",height:"100%",border:0}}/>:<p style={{color:"#fff",fontWeight:700}}>No se ha podido cargar el vídeo.</p>}
          </div>
        </section>:null}

        <h3 className={styles.sectionTitle} id="entrenamiento">Trabaja esta explicación</h3>
        <div className={styles.resourceGrid}>
          <article className={styles.resourceCard}><span>▷</span><h4>Explicación</h4><p>Procedimiento completo y ejemplo resuelto paso a paso.</p><b>Comprender antes de repetir</b></article>
          <article className={styles.resourceCard}><span>✎</span><h4>Ejercicios y problemas</h4><p>Práctica guiada y transferencia con datos y contextos distintos.</p><b>Entrenar el procedimiento</b></article>
          <article className={styles.resourceCard}><span>✓</span><h4>Comprobación</h4><p>Errores previsibles, preguntas cortas y control de dominio.</p><b>Detectar dónde falla el proceso</b></article>
          <article className={styles.resourceCard}><span>⌁</span><h4>Entrenamiento PAU</h4><p>Problemas, modelos y simulacros según la modalidad contratada.</p><b>{access.hasPau||access.administrator?"Acceso PAU disponible":"Requiere Estándar o PAU"}</b></article>
        </div>

        <section className={styles.courseMap} id="pau">
          <div><h3>Mapa de explicaciones</h3><p>44 apoyos operativos organizados por familias de problemas y procedimientos. No es un temario alternativo.</p></div>
          <div className={styles.blockStats}>{MATEMATICAS_APLICADAS_BLOCKS.map(item=><span key={item}><b>{MATEMATICAS_APLICADAS_UNITS.filter(u=>u.block===item).length}</b>{item}</span>)}</div>
        </section>
      </main>

      <aside className={styles.rightbar}>
        <section className={styles.assistant}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, profesora IA" width={1536} height={1024}/><div><h3>Rocío</h3><strong>Profesora IA</strong><p>Te ayuda a comprender el procedimiento y localizar el primer paso que falla.</p><button type="button">Practicar con Rocío</button></div></section>
        <section className={styles.assistant}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, tutor IA" width={1536} height={1024}/><div><h3>Fernando</h3><strong>Tutor IA</strong><p>Organiza práctica, repasos y progresión hasta la PAU.</p><button type="button">Plan de estudio</button></div></section>
        <section className={styles.sideInfo}><strong>Objetivo Base12</strong><p>Explicar lo que ya has trabajado en el centro y entrenarte para resolver bien los ejercicios que determinan tu nota.</p></section>
        <p className={styles.accessNote}>{checking?"Comprobando acceso…":access.administrator?"Acceso administrador":access.plans.length?`Modalidad: ${access.plans.join(" · ")}`:"Vista previa de T01"}</p>
      </aside>
    </div>
  </div>;
}
