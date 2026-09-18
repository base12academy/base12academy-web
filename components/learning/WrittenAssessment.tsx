"use client";
import { useState } from "react";
import { submitAssessment } from "@/lib/learning-progress-client";

type Props={courseSlug:string;contentId:string;activityType:string;prompt:string;expectedAnswer?:string;rubric?:string;unit?:string;group?:string;rows?:number};

export default function WrittenAssessment({courseSlug,contentId,activityType,prompt,expectedAnswer="",rubric="",unit="",group="",rows=6}:Props){
  const [answer,setAnswer]=useState(""); const [sending,setSending]=useState(false);
  const [result,setResult]=useState<{score:number|null;feedback:string}|null>(null); const [error,setError]=useState("");
  async function submit(){
    if(!answer.trim()||sending)return; setSending(true); setError("");
    try{const data=await submitAssessment({courseSlug,contentId,activityType,prompt,answer,expectedAnswer,rubric,unit,group});setResult({score:data.score,feedback:data.feedback});}
    catch{setError("No se ha podido guardar la respuesta. Comprueba que has iniciado sesión y tienes acceso al curso.");}
    finally{setSending(false);}
  }
  return <div style={{marginTop:14}}>
    <label style={{display:"block",fontSize:13,fontWeight:800,color:"#173f70",marginBottom:7}}>Tu respuesta</label>
    <textarea value={answer} onChange={e=>setAnswer(e.target.value)} rows={rows} disabled={Boolean(result)} placeholder="Escribe aquí tu respuesta antes de consultar la solución." style={{width:"100%",boxSizing:"border-box",resize:"vertical",border:"1px solid #c8d7e7",borderRadius:10,padding:"12px 13px",font:"inherit",lineHeight:1.5,color:"#173f70",background:"#fff"}}/>
    {!result?<button type="button" onClick={submit} disabled={sending||!answer.trim()} style={{marginTop:10,border:"1px solid #176fd6",background:"#176fd6",color:"#fff",borderRadius:9,padding:"9px 14px",fontWeight:800,cursor:"pointer",opacity:sending||!answer.trim()?.55:1}}>{sending?"Corrigiendo y guardando…":"Entregar respuesta"}</button>:null}
    {error?<p style={{color:"#9f1239",fontWeight:700,fontSize:13}}>{error}</p>:null}
    {result?<div style={{marginTop:12,border:"1px solid #d6e5f2",background:"#f4f9ff",borderRadius:10,padding:13,color:"#173f70"}}><strong>{result.score==null?"Respuesta registrada":("Valoración orientativa: "+result.score+" / 100")}</strong><p style={{margin:"6px 0 0",lineHeight:1.5}}>{result.feedback}</p>{expectedAnswer?<details style={{marginTop:10}}><summary style={{cursor:"pointer",fontWeight:800,color:"#0b58ad"}}>Ver respuesta esperada y rúbrica</summary><p style={{whiteSpace:"pre-wrap",lineHeight:1.5}}>{expectedAnswer}</p>{rubric?<p style={{whiteSpace:"pre-wrap",fontSize:13,color:"#58718b"}}>{rubric}</p>:null}</details>:null}</div>:null}
  </div>;
}