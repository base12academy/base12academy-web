"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Summary={events:number;assessments:number;scored:number;average:number|null;breakdown:{type:string;attempts:number;average:number|null}[]};

export default function CourseProgressSummary({courseSlug,compact=false}:{courseSlug:string;compact?:boolean}){
 const [summary,setSummary]=useState<Summary|null>(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let alive=true;void(async()=>{
   const {data}=await supabase.auth.getSession();const token=data.session?.access_token;
   if(!token){if(alive)setLoading(false);return;}
   const response=await fetch("/api/course-progress/summary?course="+encodeURIComponent(courseSlug),{headers:{Authorization:"Bearer "+token}});
   const payload=await response.json().catch(()=>null);
   if(alive){if(response.ok)setSummary(payload);setLoading(false);}
 })();return()=>{alive=false}},[courseSlug]);
 if(loading)return <div style={{fontSize:12,color:"#6a7d91"}}>Calculando progreso…</div>;
 if(!summary)return <div style={{fontSize:12,color:"#6a7d91"}}>Inicia sesión para ver tu progreso.</div>;
 if(compact)return <div style={{padding:"8px 0"}}><div style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12,color:"#607089"}}><span>Actividad registrada</span><strong style={{color:"#173f70"}}>{summary.assessments} entregas</strong></div><div style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12,color:"#607089",marginTop:4}}><span>Media orientativa</span><strong style={{color:"#173f70"}}>{summary.average==null?"Sin datos":summary.average+"%"}</strong></div></div>;
 return <section style={{border:"1px solid #e0e7ef",borderRadius:10,padding:13,background:"#fbfdff"}}><strong style={{display:"block",color:"#173f70",marginBottom:8}}>Tu progreso real</strong><div style={{display:"grid",gap:6,fontSize:12,color:"#607089"}}><div style={{display:"flex",justifyContent:"space-between"}}><span>Entregas registradas</span><b style={{color:"#173f70"}}>{summary.assessments}</b></div><div style={{display:"flex",justifyContent:"space-between"}}><span>Resultados valorados</span><b style={{color:"#173f70"}}>{summary.scored}</b></div><div style={{display:"flex",justifyContent:"space-between"}}><span>Media orientativa</span><b style={{color:"#173f70"}}>{summary.average==null?"Sin datos":summary.average+"%"}</b></div></div></section>;
}
