"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import SharedOppositionCourse from "@/components/SharedOppositionCourse";
import {supabase} from "@/lib/supabaseClient";
import s from "@/components/OppositionCourse.module.css";

type Index=Parameters<typeof SharedOppositionCourse>[0]['index'];
type Block={type:string;text:string;rows?:string[][]};
type Access={plan:string;region:{label:string;href:string}|null;regions:{slug:string;label:string}[];suggestedRegion:string|null;documents?:{title:string;blocks:Block[]}[]};
async function request(slug:string,region?:string){
 const {data:{session}}=await supabase.auth.getSession();
 if(!session)return null;
 const response=await fetch(`/api/oposiciones/haciendas-universidades/${slug}`,{method:region?"POST":"GET",cache:"no-store",headers:{Authorization:`Bearer ${session.access_token}`,"Content-Type":"application/json"},...(region?{body:JSON.stringify({region})}:{})});
 if(response.status===401||response.status===403)return null;
 if(!response.ok)throw new Error("No se ha podido consultar el paquete. Inténtalo de nuevo.");
 return response.json();
}
export default function UniversityClassroom({index}:{index:Index}){
 const [access,setAccess]=useState<Access|null>(null),[loading,setLoading]=useState(true),[region,setRegion]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{let current=true;request(index.courseSlug).then(value=>{if(current){setAccess(value);setRegion(value?.suggestedRegion||"")}}).catch(e=>{if(current)setError(e.message)}).finally(()=>{if(current)setLoading(false)});return()=>{current=false}},[index.courseSlug]);
 const choose=async()=>{setBusy(true);setError("");try{await request(index.courseSlug,region);setAccess(await request(index.courseSlug))}catch(e){setError(e instanceof Error?e.message:"No se ha podido guardar la comunidad.")}finally{setBusy(false)}};
 if(loading)return <p role="status">Preparando tu aula…</p>;
 return <>
  <section className={s.panel} style={{margin:"1rem"}} aria-label="Tu paquete de Universidades">
   <h2>{index.title} · Comunidad autónoma</h2>
   {error&&<p role="alert">{error}</p>}
   {access?<>
    <p>Paquete {access.plan}. Los contenidos se consultan dentro del aula.</p>
    {access.region?<><p>Comunidad elegida: <strong>{access.region.label}</strong></p><Link className={s.primary} href={access.region.href}>Abrir mi módulo autonómico</Link>
     <details className={s.qa}><summary>Recursos del paquete</summary><p>Guías, simulacros de respuesta breve y recursos adicionales según tu modalidad.</p>{access.documents?.map((doc,i)=><details key={i} className={s.qa}><summary>{doc.title}</summary><div className={s.reader}>{doc.blocks.map((b,j)=>b.type==="heading"?<h3 key={j}>{b.text}</h3>:b.type==="table"&&b.rows?<div key={j} style={{overflowX:"auto"}}><table className={s.supportTable}><tbody>{b.rows.map((row,k)=><tr key={k}>{row.map((cell,n)=><td key={n}>{cell}</td>)}</tr>)}</tbody></table></div>:<p key={j} style={{whiteSpace:"pre-wrap"}}>{b.text}</p>)}</div></details>)}</details>
    </>:<form onSubmit={e=>{e.preventDefault();void choose()}}><label htmlFor="university-region">Elige una comunidad autónoma para tu preparación.</label><select id="university-region" value={region} onChange={e=>setRegion(e.target.value)} required><option value="">Selecciona una comunidad autónoma</option>{access.regions.map(r=><option key={r.slug} value={r.slug}>{r.label}</option>)}</select><p>Tu paquete incluye una sola comunidad. La elección quedará vinculada a esta matrícula.</p><button className={s.primary} type="submit" disabled={!region||busy}>{busy?"Guardando…":"Confirmar comunidad"}</button></form>}
   </>:<p>El tema 1 está disponible como muestra. Al matricularte elegirás una comunidad autónoma para tu paquete.</p>}
  </section>
  {(!access||access.region)&&!error&&<SharedOppositionCourse index={index}/>}
 </>;
}
