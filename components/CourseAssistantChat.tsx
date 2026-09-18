"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type EntryPoint="rocio"|"fernando";
type Props={entryPoint:EntryPoint;courseSlug:string;contextTitle?:string;open:boolean;onClose:()=>void};
type PlanForm={studyDays:string;studyTime:string;sessionDuration:string;examDate:string;examPlace:string;objective:string};

const EMPTY_PLAN:PlanForm={studyDays:"",studyTime:"",sessionDuration:"",examDate:"",examPlace:"",objective:""};

export default function CourseAssistantChat({entryPoint,courseSlug,contextTitle="",open,onClose}:Props){
 const isRocio=entryPoint==="rocio";
 const [message,setMessage]=useState("");
 const [messages,setMessages]=useState<{from:"user"|"assistant";text:string;role?:string}[]>([]);
 const [sending,setSending]=useState(false);
 const [plan,setPlan]=useState<PlanForm>(EMPTY_PLAN);
 const [planLoading,setPlanLoading]=useState(false);
 const [planNeeded,setPlanNeeded]=useState(false);
 const [planSaving,setPlanSaving]=useState(false);
 const [planMessage,setPlanMessage]=useState("");
 const bodyRef=useRef<HTMLDivElement>(null);

 useEffect(()=>{
   if(!open)return;
   let alive=true;
   void(async()=>{
     if(isRocio){
       if(alive&&!messages.length)setMessages([{from:"assistant",text:"Soy Rocío. Pregúntame lo que necesites. Si tu consulta corresponde a otro servicio de Base12, responderá internamente el rol adecuado sin sacarte de esta conversación."}]);
       return;
     }
     setPlanLoading(true);
     const {data}=await supabase.auth.getSession();
     const token=data.session?.access_token;
     if(!token){
       if(alive){
         if(!messages.length)setMessages([{from:"assistant",text:"Soy Fernando. Para consultar tu planificación y progreso necesito que inicies sesión. También puedes preguntarme cualquier otra cuestión de Base12."}]);
         setPlanLoading(false);
       }
       return;
     }
     const response=await fetch("/api/study-plan?course="+encodeURIComponent(courseSlug),{headers:{Authorization:"Bearer "+token}});
     const payload=await response.json().catch(()=>({}));
     if(!alive)return;
     if(response.ok&&payload.plan){
       const p=payload.plan;
       setPlan({studyDays:(p.study_days||[]).join(", "),studyTime:p.study_time||"",sessionDuration:p.session_duration_minutes?String(p.session_duration_minutes):"",examDate:p.exam_date||"",examPlace:p.exam_place||"",objective:p.objective||""});
       setPlanNeeded(false);
       if(!messages.length)setMessages([{from:"assistant",text:"Soy Fernando. Ya tengo tu plan de estudio. Puedo ayudarte a decidir qué trabajar ahora, revisar tu progreso, reorganizar sesiones o preparar una recuperación si te has retrasado."}]);
     }else{
       setPlanNeeded(true);
       if(!messages.length)setMessages([{from:"assistant",text:"Soy Fernando. Antes de organizar tu estudio necesito conocer seis datos: qué días puedes estudiar, a qué hora, cuánto dura cada sesión, cuándo es tu examen, dónde será si lo sabes y qué objetivo quieres conseguir. Puedes indicarlos aquí debajo y después seguir hablando conmigo."}]);
     }
     setPlanLoading(false);
   })();
   return()=>{alive=false};
 },[open,isRocio,courseSlug,messages.length]);

 useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTop=bodyRef.current.scrollHeight;},[messages,planNeeded]);

 if(!open)return null;

 async function savePlan(){
   const duration=Number((plan.sessionDuration.match(/\d+/)||["0"])[0]);
   if(!plan.studyDays.trim()||!plan.studyTime.trim()||!duration){setPlanMessage("Indica al menos los días de estudio, el horario y la duración de las sesiones.");return;}
   setPlanSaving(true);setPlanMessage("");
   const {data}=await supabase.auth.getSession();const token=data.session?.access_token;
   if(!token){setPlanMessage("Debes iniciar sesión para guardar el plan.");setPlanSaving(false);return;}
   const response=await fetch("/api/study-plan",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({courseSlug,...plan,sessionDurationMinutes:duration})});
   const payload=await response.json().catch(()=>({}));
   if(response.ok){setPlanNeeded(false);setPlanMessage("Plan guardado.");setMessages(v=>[...v,{from:"assistant",text:"Ya tengo la información básica. A partir de ahora utilizaré tu plan y tus resultados registrados para ayudarte a organizar el estudio."}]);}
   else setPlanMessage(payload.error==="matriculation_required"?"No se ha encontrado una matrícula activa de esta asignatura.":"No se ha podido guardar el plan.");
   setPlanSaving(false);
 }

 async function send(){
   const text=message.trim();if(!text||sending)return;
   setMessage("");setSending(true);setMessages(v=>[...v,{from:"user",text}]);
   try{
     const {data}=await supabase.auth.getSession();const token=data.session?.access_token;
     const response=await fetch("/api/base12-assistant",{method:"POST",headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:JSON.stringify({entryPoint,courseSlug,contextTitle,message:text,history:messages.slice(-8)})});
     const payload=await response.json().catch(()=>({}));
     setMessages(v=>[...v,{from:"assistant",text:response.ok?(payload.answer||"No he podido responder."):"Ahora mismo no he podido resolver la consulta.",role:payload.role}]);
   }catch{setMessages(v=>[...v,{from:"assistant",text:"Ahora mismo no he podido resolver la consulta."}]);}
   finally{setSending(false);}
 }

 const avatar=isRocio?"/images/rocio-profesora-ia.png":"/images/fernando-tutor-ia.png";
 const name=isRocio?"Rocío":"Fernando";
 const roleLabel=(role?:string)=>role==="secretaria"?"Secretaría":role==="jefatura"?"Jefatura de Estudios":role==="commercial"?"Comercial":role==="direccion"?"Dirección Académica":role==="rocio"?"Rocío":role==="fernando"?"Fernando":"";

 return <div style={{position:"fixed",inset:0,zIndex:1300,background:"rgba(5,19,40,.72)",display:"grid",placeItems:"center",padding:16}} onMouseDown={onClose}>
   <section style={{width:"min(760px,95vw)",height:"min(760px,94vh)",background:"#fff",borderRadius:18,overflow:"hidden",display:"grid",gridTemplateRows:"auto 1fr auto",boxShadow:"0 28px 70px rgba(0,0,0,.32)"}} onMouseDown={e=>e.stopPropagation()}>
     <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:"1px solid #dce6ef"}}>
       <div style={{display:"flex",alignItems:"center",gap:11}}><Image src={avatar} alt="" width={58} height={58} style={{width:50,height:50,objectFit:"cover",borderRadius:"50%"}}/><div><strong style={{display:"block",color:"#0b3c75",fontSize:18}}>{name}</strong><small style={{color:"#60758d"}}>{isRocio?"Profesora IA":"Tutor IA"} · {contextTitle||courseSlug}</small></div></div>
       <button type="button" onClick={onClose} style={{border:"1px solid #d5e0ea",background:"#fff",borderRadius:"50%",width:36,height:36,fontSize:22,cursor:"pointer"}}>×</button>
     </header>
     <div ref={bodyRef} style={{overflowY:"auto",padding:16,background:"#f8fbff"}}>
       {messages.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start",marginBottom:10}}><div style={{maxWidth:"84%",background:m.from==="user"?"#176fd6":"#fff",color:m.from==="user"?"#fff":"#173f70",border:m.from==="user"?"none":"1px solid #dbe5ef",borderRadius:12,padding:"10px 12px",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.from==="assistant"&&m.role&&m.role!==entryPoint?<small style={{display:"block",fontWeight:900,color:"#6b7f95",marginBottom:4}}>{roleLabel(m.role)}</small>:null}{m.text}</div></div>)}
       {!isRocio&&planLoading?<p style={{color:"#60758d",fontSize:13}}>Consultando tu planificación…</p>:null}
       {!isRocio&&planNeeded?<div style={{background:"#fff",border:"1px solid #dbe5ef",borderRadius:12,padding:14,marginTop:10}}>
         <strong style={{color:"#173f70"}}>Datos iniciales para Fernando</strong>
         <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,marginTop:12}}>
           <PlanField label="Días de estudio" value={plan.studyDays} onChange={v=>setPlan({...plan,studyDays:v})} placeholder="Lunes, miércoles y viernes"/>
           <PlanField label="Horario habitual" value={plan.studyTime} onChange={v=>setPlan({...plan,studyTime:v})} placeholder="18:00"/>
           <PlanField label="Duración de cada sesión" value={plan.sessionDuration} onChange={v=>setPlan({...plan,sessionDuration:v})} placeholder="90 minutos"/>
           <PlanField label="Fecha del examen" value={plan.examDate} onChange={v=>setPlan({...plan,examDate:v})} type="date"/>
           <PlanField label="Lugar del examen" value={plan.examPlace} onChange={v=>setPlan({...plan,examPlace:v})} placeholder="Opcional"/>
           <PlanField label="Objetivo" value={plan.objective} onChange={v=>setPlan({...plan,objective:v})} placeholder="Ej.: sacar un 8 en la PAU"/>
         </div>
         <button type="button" onClick={savePlan} disabled={planSaving} style={{marginTop:12,border:0,borderRadius:9,background:"#176fd6",color:"#fff",padding:"9px 13px",fontWeight:800,cursor:"pointer"}}>{planSaving?"Guardando…":"Guardar y continuar con Fernando"}</button>
         {planMessage?<p style={{fontSize:12,fontWeight:700,color:"#315d88"}}>{planMessage}</p>:null}
       </div>:null}
       {sending?<p style={{color:"#60758d",fontSize:13}}>Preparando respuesta…</p>:null}
     </div>
     <div style={{display:"flex",gap:8,padding:12,borderTop:"1px solid #dce6ef",background:"#fff"}}>
       <textarea value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void send();}}} placeholder="Escribe tu pregunta…" rows={2} style={{flex:1,resize:"none",border:"1px solid #c7d7e6",borderRadius:10,padding:"10px 11px",font:"inherit"}}/>
       <button type="button" onClick={send} disabled={sending||!message.trim()} style={{border:0,borderRadius:10,background:"#176fd6",color:"#fff",padding:"0 16px",fontWeight:800,cursor:"pointer"}}>Enviar</button>
     </div>
   </section>
 </div>;
}

function PlanField({label,value,onChange,placeholder="",type="text"}:{label:string;value:string;onChange:(value:string)=>void;placeholder?:string;type?:string}){
 return <label style={{display:"block"}}><span style={{display:"block",fontSize:11,fontWeight:800,color:"#365c82",marginBottom:5}}>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",boxSizing:"border-box",border:"1px solid #c8d7e7",borderRadius:8,padding:"9px 10px",font:"inherit",color:"#173f70"}}/></label>;
}
