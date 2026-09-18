"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WrittenAssessment from "@/components/learning/WrittenAssessment";
import CourseAssistantChat from "@/components/CourseAssistantChat";
import ChoiceAssessment from "@/components/learning/ChoiceAssessment";
import {
  MATEMATICAS_APLICADAS_BLOCKS,
  MATEMATICAS_APLICADAS_STATS,
  MATEMATICAS_APLICADAS_UNITS,
} from "@/lib/matematicas-aplicadas-ccss/content";
import styles from "./matematicas-aplicadas.module.css";

type AccessState={authenticated:boolean;administrator:boolean;hasCourse:boolean;hasPau:boolean;plans:string[];previewUnit:string};
type VideoState={embedUrl:string;url:string};
type Letter="A"|"B"|"C"|"D";
type RocioItem={id:string;question:string;options:Record<Letter,string>;correct:Letter;feedback:string;recovery:string};
type ShortItem={id:string;question:string;expectedAnswer:string;rubric:string};
type ProblemItem={id:string;block:string;statement:string;solution:string;rubric:string};
type ProfileItem={code:string;community:string;status:string;format:string;source:string};
type SimulationGroup={label:string;points:number;choose:number;problems:ProblemItem[]};
type SimulationItem={code:string;community:string;status:string;profile:string;groups:SimulationGroup[]};
type GlossaryTerm={term:string;definition:string;utility:string;error:string;example:string};
type GlossarySection={section:number;title:string;terms:GlossaryTerm[]};
type ResourcePayload=
  |{type:"rocio";items:RocioItem[]}
  |{type:"short";items:ShortItem[]}
  |{type:"problems";items:ProblemItem[]}
  |{type:"profiles";items:ProfileItem[]}
  |{type:"simulation";simulation:SimulationItem}
  |{type:"glossary";count:number;sections:GlossarySection[]};

const INITIAL:AccessState={authenticated:false,administrator:false,hasCourse:false,hasPau:false,plans:[],previewUnit:"T01"};

export default function MatematicasAplicadasPage(){
  const [selectedId,setSelectedId]=useState("T01");
  const [block,setBlock]=useState<(typeof MATEMATICAS_APLICADAS_BLOCKS)[number]|"Todos">("Todos");
  const [query,setQuery]=useState("");
  const [access,setAccess]=useState<AccessState>(INITIAL);
  const [checking,setChecking]=useState(true);
  const [video,setVideo]=useState<VideoState>({embedUrl:"",url:""});
  const [videoLoading,setVideoLoading]=useState(false);
  const [videoOpen,setVideoOpen]=useState(false);
  const [rocioChatOpen,setRocioChatOpen]=useState(false);
  const [fernandoChatOpen,setFernandoChatOpen]=useState(false);
  const [resource,setResource]=useState<"rocio"|"short"|"problems"|"profiles"|"simulation"|"glossary"|null>(null);
  const [resourceData,setResourceData]=useState<ResourcePayload|null>(null);
  const [resourceLoading,setResourceLoading]=useState(false);
  const [resourceError,setResourceError]=useState("");

  useEffect(()=>{let alive=true;(async()=>{
    const {data}=await supabase.auth.getSession();
    const token=data.session?.access_token;
    const response=await fetch("/api/matematicas-aplicadas-ccss/access",{headers:token?{Authorization:`Bearer ${token}`}:undefined});
    const payload=await response.json().catch(()=>INITIAL);
    if(alive){setAccess({...INITIAL,...payload});setChecking(false)}
  })();return()=>{alive=false}},[]);

  const selected=MATEMATICAS_APLICADAS_UNITS.find(u=>u.id===selectedId)??MATEMATICAS_APLICADAS_UNITS[0];
  const filtered=useMemo(()=>{
    const needle=query.trim().toLocaleLowerCase("es");
    return MATEMATICAS_APLICADAS_UNITS.filter(u=>(block==="Todos"||u.block===block)&&(!needle||`${u.id} ${u.title} ${u.block}`.toLocaleLowerCase("es").includes(needle)));
  },[block,query]);
  const canOpen=access.administrator||access.hasCourse||selected.id===access.previewUnit;
  const canPau=access.administrator||access.hasPau;

  useEffect(()=>{let alive=true;(async()=>{
    if(!canOpen){setVideo({embedUrl:"",url:""});return}
    setVideoLoading(true);
    const {data}=await supabase.auth.getSession();
    const token=data.session?.access_token;
    const response=await fetch(`/api/matematicas-aplicadas-ccss/video?unit=${encodeURIComponent(selected.id)}`,{headers:token?{Authorization:`Bearer ${token}`}:undefined});
    const payload=await response.json().catch(()=>({}));
    if(alive){setVideo(response.ok?{embedUrl:payload.embedUrl||"",url:payload.url||""}:{embedUrl:"",url:""});setVideoLoading(false)}
  })();return()=>{alive=false}},[selected.id,canOpen]);

  useEffect(()=>{setResource(null);setResourceData(null);setResourceError("")},[selectedId]);

  async function openResource(type:"rocio"|"short"|"problems"|"profiles"|"simulation"|"glossary",code?:string){
    setResource(type);setResourceData(null);setResourceError("");setResourceLoading(true);
    const {data}=await supabase.auth.getSession();
    const token=data.session?.access_token;
    const endpoint=type==="glossary"
      ? "/api/matematicas-aplicadas-ccss/glossary"
      : `/api/matematicas-aplicadas-ccss/evaluation?type=${type}${type==="rocio"||type==="short"?`&unit=${selected.id}`:type==="simulation"&&code?`&code=${encodeURIComponent(code)}`:""}`;
    const response=await fetch(endpoint,{headers:token?{Authorization:`Bearer ${token}`}:undefined});
    const payload=await response.json().catch(()=>({}));
    if(response.ok){
      setResourceData(type==="glossary"?{type:"glossary",count:payload.count||0,sections:payload.sections||[]} as ResourcePayload:payload as ResourcePayload);
    }else{
      setResourceError(payload?.error==="authentication_required"?"Inicia sesión para acceder a este recurso.":payload?.error==="matriculation_required"?"Este recurso requiere acceso a la asignatura.":"No se ha podido cargar el recurso.");
    }
    setResourceLoading(false);
    setTimeout(()=>document.getElementById("macs-resource")?.scrollIntoView({behavior:"smooth",block:"start"}),60);
  }

  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  const openVideo=()=>{if(canOpen)setVideoOpen(true);};
  const closeVideo=()=>setVideoOpen(false);
  const embedWithPreferences=video.embedUrl?video.embedUrl+(video.embedUrl.includes("?")?"&":"?")+"rel=0&modestbranding=1&playsinline=1":"";

  return <div className={styles.page}>
    <header className={styles.topbar}>
      <Link href="/" className={styles.brand}>
        <Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority/>
        <span><strong>Base12 Academy</strong></span>
      </Link>
      <div className={styles.motto}>CONSTRUYE · COMPRENDE · DOMINA</div>
      <nav className={styles.topnav}>
        <Link href="/">Inicio</Link>
        <Link href="/dashboard/mis-cursos">Mis cursos</Link>
        <Link href="/comunidad">Comunidad</Link>
        <Link href="/ayuda">Ayuda</Link>
        <Link href="/dashboard">Mi cuenta</Link>
      </nav>
    </header>

    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.courseIdentity}>
          <h1>Matemáticas Aplicadas a las CCSS II</h1>
          <p>2.º Bachillerato · PAU</p>
          <div className={styles.progressHeader}><span>Explicaciones</span><b>{selected.order} / 44</b></div>
          <div className={styles.progressTrack}><span style={{width:`${Math.max(3,(selected.order/44)*100)}%`}}/></div>
        </div>

        <nav className={styles.sideNav}>
          <button onClick={()=>scrollTo("inicio")} className={styles.activeNav}>⌂ <span>Inicio</span></button>
          <button onClick={()=>scrollTo("explicaciones")}>▤ <span>Explicaciones (44)</span></button>
          <button onClick={()=>openResource("glossary")}>Aᶻ <span>Glosario</span></button>
          <button onClick={()=>scrollTo("comprobaciones")}>✓ <span>Comprobaciones</span></button>
          <button onClick={()=>scrollTo("pau")}>▧ <span>PAU por comunidades</span></button>
        </nav>

        <section className={styles.explanationPicker} id="explicaciones">
          <div className={styles.pickerHeading}><strong>Explicaciones</strong><span>44</span></div>
          <label>Buscar<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Matrices, Bayes, optimización…"/></label>
          <div className={styles.blockFilters}>
            <button onClick={()=>setBlock("Todos")} className={block==="Todos"?styles.filterActive:""}>Todas</button>
            {MATEMATICAS_APLICADAS_BLOCKS.map(item=><button key={item} onClick={()=>setBlock(item)} className={block===item?styles.filterActive:""}>{item}</button>)}
          </div>
          <div className={styles.unitList}>
            {filtered.map(unit=>{
              const locked=!access.administrator&&!access.hasCourse&&unit.id!==access.previewUnit;
              return <button key={unit.id} className={selected.id===unit.id?styles.activeUnit:""} onClick={()=>setSelectedId(unit.id)}>
                <span>{unit.order}</span><div><strong>{unit.id}</strong><small>{unit.title}</small></div>{locked?<b>◇</b>:null}
              </button>
            })}
          </div>
        </section>
      </aside>

      <main className={styles.main} id="inicio">
        <div className={styles.breadcrumb}>Matemáticas Aplicadas a las CCSS II <span>›</span> Explicación {selected.order} de 44</div>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>EXPLICACIÓN {selected.order} DE {MATEMATICAS_APLICADAS_STATS.explanations}</span>
            <h2>{selected.title}</h2>
            <h3 className={styles.heroSubtitle}>{selected.block} · procedimiento y aplicación</h3>
            <p>Comprende el procedimiento, reconoce cuándo utilizarlo y entrénalo con ejercicios del mismo tipo que trabajas en tu centro.</p>
            <blockquote>Comprende qué te pide el ejercicio, decide el procedimiento y comprueba el resultado.</blockquote>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.heroGrid}/>
            <div className={styles.chart}>
              <i/><i/><i/><i/><i/><i/><span/>
            </div>
            <div className={styles.heroWords}>Analiza<br/>Interpreta<br/>Decide<br/>Domina</div>
            <div className={styles.heroDesk}/>
            <div className={styles.heroCup}><Image src="/images/base12-logo.png" alt="" width={60} height={60}/></div>
            <div className={styles.heroPencils}><i/><i/><i/><i/></div>
            <div className={styles.books}><b>Estadística</b><b>Probabilidad</b><b>Funciones</b><b>Aplicaciones a las CCSS</b></div>
          </div>
        </section>

        {canOpen?<section className={styles.primaryResources}>
          <button onClick={()=>scrollTo("inicio")} className={styles.primaryCard}>
            <span className={styles.cardIcon}>▤</span><strong>1. EXPLICACIÓN</strong><small>Desarrollo completo de la explicación</small><b>Leer explicación →</b>
          </button>
          <button onClick={openVideo} className={styles.videoCard} disabled={!canOpen}>
            <span className={styles.cardIcon}>▶</span><strong>2. VÍDEO DE APOYO</strong><small>Reproduce el vídeo sin salir de Base12</small><b>{videoLoading?"Cargando…":"Ver vídeo →"}</b>
          </button>
          <button onClick={()=>openResource("glossary")} className={styles.glossaryCard}>
            <span className={styles.cardIcon}>Aᶻ</span><strong>3. GLOSARIO</strong><small>Términos y conceptos clave</small><b>Abrir glosario →</b>
          </button>
          <button onClick={()=>setRocioChatOpen(true)} className={styles.rocioCard}>
            <Image className={styles.miniAvatar} src="/images/rocio-profesora-ia.png" alt="" width={90} height={90}/>
            <strong>4. ROCÍO</strong><small>Pregunta directamente tus dudas sobre la explicación</small><b>Preguntar a Rocío →</b>
          </button>
        </section>:<section className={styles.lockNotice}><strong>Vista previa</strong><p>La primera explicación está abierta. El resto requiere una modalidad con curso completo.</p><Link href="/bachillerato-pau/matematicas-aplicadas-ccss#modalidades">Ver modalidades</Link></section>}


        <div className={styles.hierarchyNote}>
          <strong>Orden recomendado de trabajo</strong>
          <span>Explicación → Vídeo de apoyo → Glosario → Rocío</span>
          <small>Después, pasa al entrenamiento y a la preparación PAU.</small>
        </div>

        <section className={styles.trainingArea} id="comprobaciones">
          <div className={styles.checksPanel}>
            <h3>Entrenamiento</h3>
            <div className={styles.trainingCards}>
              <button onClick={()=>openResource("rocio")}><span>✓</span><strong>Comprobación con Rocío</strong><small>3 preguntas cerradas por explicación</small><b>Comprobar →</b></button>
              <button onClick={()=>openResource("short")}><span>◯</span><strong>Preguntas cortas</strong><small>2 por explicación</small><b>Resolver →</b></button>
              <button onClick={()=>openResource("problems")} disabled={!canPau}><span>▤</span><strong>Preguntas tipo PAU</strong><small>48 con solución y rúbrica</small><b>Practicar →</b></button>
              <button onClick={()=>openResource("profiles")} disabled={!canPau}><span>▥</span><strong>Simulacros</strong><small>17 territoriales</small><b>Empezar →</b></button>
              <button id="pau" onClick={()=>openResource("profiles")} disabled={!canPau}><span className={styles.spainIcon}>ES</span><strong>PAU por comunidades</strong><small>Perfiles y criterios territoriales</small><b>Seleccionar →</b></button>
            </div>
          </div>
        </section>

        {resource?<section id="macs-resource" className={styles.resourcePanel}>
          <div className={styles.resourceHeader}>
            <div><span>RECURSO BASE12</span><h3>{resource==="rocio"?`Rocío · ${selected.title}`:resource==="short"?`Preguntas cortas · ${selected.title}`:resource==="problems"?"Preguntas tipo PAU · 48":resource==="profiles"?"PAU por comunidades y simulacros":resource==="glossary"?"Glosario de Matemáticas Aplicadas":"Simulacro PAU"}</h3></div>
            <button onClick={()=>setResource(null)}>Cerrar ×</button>
          </div>
          {resourceLoading?<p>Cargando…</p>:resourceError?<p className={styles.error}>{resourceError}</p>:resourceData?.type==="rocio"?<RocioPanel items={resourceData.items}/>:resourceData?.type==="short"?<ShortPanel items={resourceData.items}/>:resourceData?.type==="problems"?<ProblemsPanel items={resourceData.items}/>:resourceData?.type==="profiles"?<ProfilesPanel items={resourceData.items} onSimulation={(code)=>openResource("simulation",code)}/>:resourceData?.type==="simulation"?<SimulationPanel simulation={resourceData.simulation}/>:resourceData?.type==="glossary"?<GlossaryPanel count={resourceData.count} sections={resourceData.sections}/>:null}
        </section>:null}
      </main>


      <CourseAssistantChat entryPoint="rocio" courseSlug="matematicas-aplicadas-ccss" contextTitle={selected.id+" · "+selected.title} open={rocioChatOpen} onClose={()=>setRocioChatOpen(false)}/>
      <CourseAssistantChat entryPoint="fernando" courseSlug="matematicas-aplicadas-ccss" contextTitle={selected.id+" · "+selected.title} open={fernandoChatOpen} onClose={()=>setFernandoChatOpen(false)}/>

      {videoOpen?<div className={styles.videoModalBackdrop} role="presentation" onMouseDown={closeVideo}>
        <section className={styles.videoModal} role="dialog" aria-modal="true" aria-label="Vídeo de apoyo" onMouseDown={e=>e.stopPropagation()}>
          <header className={styles.videoModalHeader}>
            <div>
              <span>VÍDEO DE APOYO · EXPLICACIÓN {selected.order} DE 44</span>
              <h2>{selected.title}</h2>
            </div>
            <button type="button" onClick={closeVideo} aria-label="Cerrar vídeo">×</button>
          </header>
          <div className={styles.videoModalBody}>
            <div className={styles.videoPlayerArea}>
              <div className={styles.videoPlayer}>
                {videoLoading?<p>Cargando vídeo…</p>:embedWithPreferences?<iframe src={embedWithPreferences} title={selected.id+" · "+selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>:<p>No se ha podido cargar el vídeo.</p>}
              </div>
              <div className={styles.videoNav}>
                <button type="button" disabled={selected.order===1} onClick={()=>setSelectedId("T"+String(selected.order-1).padStart(2,"0"))}>← Anterior</button>
                <span>{selected.id} · {selected.order} / 44</span>
                <button type="button" disabled={selected.order===44} onClick={()=>setSelectedId("T"+String(selected.order+1).padStart(2,"0"))}>Siguiente →</button>
              </div>
            </div>
            <aside className={styles.courseVideos}>
              <div className={styles.courseVideosHeading}>
                <strong>Otros vídeos de Matemáticas Aplicadas</strong>
                <span>44 explicaciones Base12</span>
              </div>
              <div className={styles.courseVideosList}>
                {MATEMATICAS_APLICADAS_UNITS.map(unit=>{
                  const locked=!access.administrator&&!access.hasCourse&&unit.id!==access.previewUnit;
                  return <button type="button" key={unit.id} disabled={locked} className={selected.id===unit.id?styles.activeCourseVideo:""} onClick={()=>setSelectedId(unit.id)}>
                    <span>{unit.order}</span>
                    <div><strong>{unit.id}</strong><small>{unit.title}</small></div>
                    <b>{locked?"◇":"▶"}</b>
                  </button>
                })}
              </div>
            </aside>
          </div>
        </section>
      </div>:null}

      <aside className={styles.rightbar}>
        <section className={styles.assistant}>
          <Image src="/images/rocio-profesora-ia.png" alt="Rocío, profesora IA" width={1536} height={1024}/>
          <h3>Rocío</h3><strong>Profesora IA</strong>
          <p>Te explica los conceptos y procedimientos de forma clara y te ayuda a localizar el primer paso que falla.</p>
          <button type="button" onClick={()=>setRocioChatOpen(true)}>Preguntar a Rocío</button>
        </section>
        <section className={styles.assistant}>
          <Image src="/images/fernando-tutor-ia.png" alt="Fernando, tutor IA" width={1536} height={1024}/>
          <h3>Fernando</h3><strong>Tutor IA</strong>
          <p>Te ayuda a planificar, mantener el ritmo y organizar repasos hasta la PAU.</p>
          <button type="button" onClick={()=>setFernandoChatOpen(true)}>Hablar con Fernando</button>
        </section>
        <section className={styles.objective}><span>◎</span><div><strong>Tu objetivo</strong><p>Comprender los procedimientos, entrenarlos y mejorar tus resultados.</p></div></section>
        <p className={styles.accessNote}>{checking?"Comprobando acceso…":access.administrator?"Acceso administrador":access.plans.length?`Modalidad: ${access.plans.join(" · ")}`:"Vista previa de T01"}</p>
      </aside>
    </div>
  </div>
}

function RocioPanel({items}:{items:RocioItem[]}){return <div className={styles.panelGrid}>{items.map((item,index)=><article key={item.id} className={styles.panelItem}><strong>Pregunta {index+1}</strong><p>{item.question}</p><ChoiceAssessment courseSlug="matematicas-aplicadas-ccss" contentId={item.id} activityType="rocio_closed" prompt={item.question} options={(["A","B","C","D"] as Letter[]).map(letter=>({value:letter,label:item.options[letter]}))} correctAnswer={item.correct} feedback={item.feedback} recovery={item.recovery}/></article>)}</div>}
function ShortPanel({items}:{items:ShortItem[]}){return <div className={styles.panelGrid}>{items.map((item,index)=><article key={item.id} className={styles.panelItem}><strong>Pregunta {index+1}</strong><p>{item.question}</p><WrittenAssessment courseSlug="matematicas-aplicadas-ccss" contentId={item.id} activityType="short" prompt={item.question} expectedAnswer={item.expectedAnswer} rubric={item.rubric}/></article>)}</div>}
function ProblemsPanel({items}:{items:ProblemItem[]}){const [filter,setFilter]=useState("Todos");const blocks=["Todos","Álgebra y modelización","Análisis","Probabilidad, estadística e inferencia"];const visible=filter==="Todos"?items:items.filter(i=>i.block===filter);return <><div className={styles.problemFilters}>{blocks.map(b=><button key={b} onClick={()=>setFilter(b)} className={filter===b?styles.problemFilterActive:""}>{b}</button>)}</div><div className={styles.panelGrid}>{visible.map(item=><article key={item.id} className={styles.panelItem}><div className={styles.itemTop}><strong>{item.id}</strong><span>{item.block}</span></div><p>{item.statement}</p><WrittenAssessment courseSlug="matematicas-aplicadas-ccss" contentId={item.id} activityType="pau_problem" prompt={item.statement} expectedAnswer={item.solution} rubric={item.rubric} rows={9}/></article>)}</div></>}
function ProfilesPanel({items,onSimulation}:{items:ProfileItem[];onSimulation:(code:string)=>void}){return <div className={styles.panelGrid}>{items.map(item=><article key={item.code} className={styles.panelItem}><strong>{item.code} · {item.community}</strong><p className={styles.profileStatus}>{item.status}</p><p>{item.format}</p><button type="button" onClick={()=>onSimulation(item.code)}>Abrir simulacro</button></article>)}</div>}
function SimulationPanel({simulation}:{simulation:SimulationItem}){return <div><div className={styles.simulationIntro}><strong>{simulation.code} · {simulation.community}</strong><p>{simulation.profile}</p><small>{simulation.status}</small></div><div className={styles.panelGrid}>{simulation.groups.map(group=><section key={group.label} className={styles.panelItem}><div className={styles.itemTop}><strong>{group.label}</strong><span>{group.points} puntos</span></div>{group.problems.length>1?<p>Elige {group.choose} de {group.problems.length}</p>:null}{group.problems.map(problem=><article key={problem.id} className={styles.innerProblem}><b>{problem.id}</b><p>{problem.statement}</p><WrittenAssessment courseSlug="matematicas-aplicadas-ccss" contentId={simulation.code+":"+problem.id} activityType="simulation" prompt={problem.statement} expectedAnswer={problem.solution} rubric={problem.rubric} group={simulation.code} rows={10}/></article>)}</section>)}</div></div>}
function GlossaryPanel({count,sections}:{count:number;sections:GlossarySection[]}){return <div><p className={styles.glossaryCount}>{count} términos de apoyo</p><div className={styles.panelGrid}>{sections.map(section=><section key={section.section} className={styles.panelItem}><h4>{section.title}</h4>{section.terms.map(term=><details key={term.term} className={styles.glossaryTerm}><summary>{term.term}</summary><p>{term.definition}</p><small><b>Para qué sirve:</b> {term.utility}</small><small><b>Error frecuente:</b> {term.error}</small><small><b>Ejemplo:</b> {term.example}</small></details>)}</section>)}</div></div>}
