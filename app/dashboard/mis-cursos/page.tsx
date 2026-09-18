"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Enrollment = {
  id: string;
  course_slug: string;
  plan_slug: string;
  status: string;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
};

const COURSES: Record<string,{title:string;href:string;description:string}> = {
  "historia-espana": { title:"Historia de España", href:"/dashboard/historia-espana", description:"Bachillerato y preparación PAU" },
  "historia-filosofia": { title:"Historia de la Filosofía", href:"/dashboard/filosofia", description:"Bachillerato y preparación PAU" },
  "matematicas-ii": { title:"Matemáticas II", href:"/dashboard/matematicas-ii", description:"Explicaciones, entrenamiento y PAU" },
  "matematicas-aplicadas-ccss": { title:"Matemáticas Aplicadas a las Ciencias Sociales II", href:"/dashboard/matematicas-aplicadas-ccss", description:"Explicaciones, entrenamiento y PAU" },
  "ofimatica": { title:"Competencias y Productividad Digital, Ofimática e IA", href:"/dashboard/ofimatica", description:"Competencias digitales y productividad" },
  "tropa-y-marineria": { title:"Tropa y Marinería", href:"/dashboard/tropa-y-marineria", description:"Entrenamiento psicotécnico" },
  "administrativo-ja": { title:"Administrativo de la Junta de Andalucía", href:"/dashboard/administrativo-ja", description:"Preparación de oposiciones" },
  "auxiliar-administrativo-ja": { title:"Auxiliar Administrativo de la Junta de Andalucía", href:"/dashboard/auxiliar-administrativo-ja", description:"Preparación de oposiciones" },
};

const PLAN_LABELS: Record<string,string> = {
  esencial:"Esencial", estandar:"Estándar", standard:"Estándar", premium:"Premium", pau:"PAU", operativa:"Operativa", integral:"Integral"
};

export default function MisCursosPage(){
  const [items,setItems]=useState<Enrollment[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{let alive=true;(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){if(alive){setError("Debes iniciar sesión para ver tus cursos.");setLoading(false);}return;}
    const {data,error}=await supabase
      .from("course_enrollments")
      .select("id,course_slug,plan_slug,status,starts_at,expires_at,created_at")
      .eq("user_id",user.id)
      .in("status",["active","pending"])
      .order("created_at",{ascending:false});
    if(!alive)return;
    if(error)setError("No se han podido cargar tus matrículas.");
    else setItems((data||[]) as Enrollment[]);
    setLoading(false);
  })();return()=>{alive=false};},[]);

  const courses=useMemo(()=>{
    const now=Date.now();
    const byCourse=new Map<string,Enrollment>();
    for(const enrollment of items){
      const start=Date.parse(enrollment.starts_at);
      const expiry=enrollment.expires_at?Date.parse(enrollment.expires_at):null;
      if(expiry!==null&&expiry<now)continue;
      const prev=byCourse.get(enrollment.course_slug);
      if(!prev||Date.parse(enrollment.created_at)>Date.parse(prev.created_at))byCourse.set(enrollment.course_slug,enrollment);
    }
    return Array.from(byCourse.values());
  },[items]);

  return <main style={{minHeight:"100vh",background:"#f5f8fc",padding:"36px 24px",color:"#11284d"}}>
    <section style={{maxWidth:1120,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,flexWrap:"wrap",marginBottom:24}}>
        <div><span style={{fontSize:12,fontWeight:900,color:"#c98200",letterSpacing:".08em"}}>BASE12 ACADEMY</span><h1 style={{fontSize:38,margin:"6px 0 4px"}}>Mis cursos</h1><p style={{margin:0,color:"#607089"}}>Elige el aula en la que quieres trabajar.</p></div>
        <div style={{display:"flex",gap:10}}><Link href="/dashboard/facturas" style={linkButton}>Mis facturas</Link><Link href="/" style={linkButton}>Inicio</Link></div>
      </div>

      {loading?<div style={panel}>Cargando tus matrículas…</div>:error?<div style={{...panel,color:"#9a3412"}}>{error}</div>:courses.length===0?<div style={panel}><h2 style={{marginTop:0}}>Todavía no tienes cursos activos</h2><p>Cuando contrates o actives una matrícula, aparecerá aquí.</p><Link href="/cursos" style={primaryButton}>Ver cursos</Link></div>:
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
        {courses.map(enrollment=>{
          const course=COURSES[enrollment.course_slug];
          const starts=Date.parse(enrollment.starts_at);
          const available=starts<=Date.now();
          const title=course?.title||enrollment.course_slug;
          const href=course?.href||"/dashboard";
          return <article key={enrollment.id} style={{...panel,padding:22}}>
            <span style={{fontSize:11,fontWeight:900,color:"#c98200",letterSpacing:".07em"}}>{PLAN_LABELS[enrollment.plan_slug]||enrollment.plan_slug}</span>
            <h2 style={{fontSize:22,margin:"8px 0"}}>{title}</h2>
            <p style={{color:"#607089",minHeight:42}}>{course?.description||"Curso Base12 Academy"}</p>
            {available?<Link href={href} style={primaryButton}>Entrar al aula</Link>:<div><strong style={{display:"block",color:"#9a3412",marginBottom:5}}>Acceso pendiente</strong><span style={{fontSize:13,color:"#607089"}}>Disponible desde {new Date(enrollment.starts_at).toLocaleDateString("es-ES")}</span></div>}
          </article>;
        })}
      </div>}
    </section>
  </main>;
}

const panel={background:"#fff",border:"1px solid #dbe5f1",borderRadius:18,padding:24,boxShadow:"0 10px 30px rgba(24,55,96,.06)"} as const;
const primaryButton={display:"inline-block",background:"#1457c7",color:"#fff",textDecoration:"none",fontWeight:800,padding:"11px 16px",borderRadius:10} as const;
const linkButton={display:"inline-block",background:"#fff",color:"#173b69",textDecoration:"none",fontWeight:700,padding:"10px 14px",border:"1px solid #dbe5f1",borderRadius:10} as const;
