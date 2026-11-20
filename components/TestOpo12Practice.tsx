"use client";

import Link from "next/link";
import {useCallback,useEffect,useRef,useState} from "react";
import {supabase} from "@/lib/supabaseClient";
import {testCoursePath} from "@/lib/test-opo12/catalog";
import type {Content,Settings} from "@/lib/test-opo12/grading";
import s from "./TestOpo12.module.css";

type Item = Pick<Content,"question"|"options"|"context"|"responseType">;
type Answer = number|string|null;
type Review = Item & {selected:Answer;correct?:number;explanation:string;reserve:boolean};
type Result = {right:number;wrong:number;blank:number;written:number;score:number|null;review:Review[]};
type Task = {id:string;title:string;startedAt:string;settings:Settings;questions:Item[]};
type Model = {id:string;title:string;kind:string;settings:Settings};
type Account = {signedIn:boolean;access?:boolean;enrollment?:{starts_at:string;expires_at:string};subscription?:{state:string;renew:boolean;period_end:string};events?:{id:string;title:string;finished_at:string|null;started_at:string}[];more?:boolean};
const errors:Record<string,string> = {
 daily_limit:"Ya has iniciado tus dos simulacros de hoy. Puedes retomar cualquiera desde tu historial.",
 course_closed:"La matrícula está en preparación.",subscription_required:"Necesitas una suscripción activa para comenzar.",
 pending_payment:"Hay un pago pendiente de confirmación. Comprueba su estado antes de volver a intentarlo.",
 period_changed:"Tu fecha de acceso ha cambiado. Actualiza la página antes de pagar.", early_access_consent:"Revisa la solicitud de acceso para que el nuevo mes empiece al vencer el actual.",login_required:"Inicia sesión para continuar.",
 consent_required:"Revisa las condiciones y las autorizaciones de pago.",attempt_not_found:"Este ejercicio no está disponible en tu cuenta."
};
const date=(iso:string)=>new Date(iso).toLocaleDateString("es-ES",{timeZone:"Europe/Madrid"});
function remaining(task:Task,now:number){
 const seconds=Math.max(0,Math.ceil((Date.parse(task.startedAt)+(task.settings.minutes||0)*60000-now)/1000));
 return Math.floor(seconds/60)+" min "+String(seconds%60).padStart(2,"0")+" s";
}
export default function TestOpo12Practice({slug,open,failed,sets}:{slug:string;open:boolean;failed:boolean;sets:Model[]}){
 const [account,setAccount]=useState<Account|null>(null),[page,setPage]=useState(0);
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[kind,setKind]=useState("test"),[choice,setChoice]=useState("");
 const [task,setTask]=useState<Task|null>(null),[result,setResult]=useState<Result|null>(null),[answers,setAnswers]=useState<Answer[]>([]);
 const [now,setNow]=useState(Date.now),[immediate,setImmediate]=useState(false);
 const [bankReturn,setBankReturn]=useState<string|null>(null);
 const pending=useRef<{key:string;id:string}|null>(null),heading=useRef<HTMLHeadingElement>(null);
 const api=useCallback(async(body?:Record<string,unknown>,currentPage=0)=>{
  const {data}=await supabase.auth.getSession();
  const headers:Record<string,string>={};if(data.session)headers.Authorization="Bearer "+data.session.access_token;
  if(body)headers["Content-Type"]="application/json";
  const response=await fetch("/api/test-opo12/"+encodeURIComponent(slug)+"?page="+currentPage,{method:body?"POST":"GET",headers,body:body?JSON.stringify(body):undefined,cache:"no-store"});
  const value=await response.json();if(!response.ok)throw Error(errors[value.error]||"No se ha podido completar la operación. Vuelve a intentarlo.");
  return value;
 },[slug]);
 useEffect(()=>{setBankReturn(new URLSearchParams(window.location.search).get("pago"))},[]);
 useEffect(()=>{
  if(bankReturn!=="recibido"||!account?.signedIn||account.subscription?.period_end)return;
  let refreshes=0;let active=true;
  const timer=setInterval(async()=>{if(++refreshes>=6)clearInterval(timer);try{const next=await api(undefined,page);if(active)setAccount(next)}catch{}},5000);
  return ()=>{active=false;clearInterval(timer)};
 },[bankReturn,account?.signedIn,account?.subscription?.period_end,api,page]);
 const refresh=useCallback(async()=>{setAccount(await api(undefined,page))},[api,page]);
 useEffect(()=>{let active=true;api(undefined,page).then(v=>{if(active)setAccount(v)}).catch(()=>{if(active)setMessage("No se ha podido consultar tu cuenta. Recarga esta página.")});return ()=>{active=false}},[api,page]);
 useEffect(()=>{if(!task||result||!task.settings.minutes)return;const timer=setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(timer)},[task,result]);
 useEffect(()=>{if(task)heading.current?.focus()},[task]);
 async function run(fn:()=>Promise<void>){if(busy)return;setBusy(true);setMessage("");try{await fn()}catch(e){setMessage(e instanceof Error?e.message:"No se ha podido completar la operación.")}finally{setBusy(false)}}
 function show(value:{task:Task;result?:Result}){
  const next=value.task;let draft:Answer[]=next.questions.map(q=>q.responseType==="written"?"":null);
  try{const saved=JSON.parse(sessionStorage.getItem("test-opo12:"+next.id)||"null");if(Array.isArray(saved)&&saved.length===draft.length)draft=saved;if(value.result)sessionStorage.removeItem("test-opo12:"+next.id)}catch{}
  setTask(next);setResult(value.result||null);setAnswers(draft);setNow(Date.now());
 }
 function answer(i:number,value:Answer){const next=answers.slice();next[i]=value;setAnswers(next);try{sessionStorage.setItem("test-opo12:"+task?.id,JSON.stringify(next))}catch{}}
 const options=sets.filter(o=>o.kind===kind), selected=options.find(o=>o.id===choice)||options[0];
 const paidUntil=account?.subscription?.period_end;
 const extending=!!paidUntil&&Date.parse(paidUntil)>Date.now();
 const earlyConsent=extending&&Date.parse(paidUntil!)<Date.now()+14*86400000;
 const back=encodeURIComponent(testCoursePath(slug));
 return <>
 {bankReturn==="recibido"&&account?.signedIn&&!account.subscription?.period_end&&<p role="status" className={s.note}>Esperando la confirmación del banco. Tu matrícula aparecerá en Mis cursos cuando se confirme el pago.</p>}
 {bankReturn==="interrumpido"&&!account?.subscription?.period_end&&<p role="status" className={s.note}>El proceso de pago se ha interrumpido. Puedes consultar tu matrícula en Mis cursos.</p>}
 {message&&<p role="alert" className={s.note}>{message}</p>}
 {failed?<p role="status">No se ha podido consultar la disponibilidad del curso.</p>:!open&&<p className={s.note}>Matrícula en preparación</p>}
 {!account&&!message&&<p role="status">Consultando acceso…</p>}
 {open&&account&&!account.signedIn&&<p><Link href={"/login?redirect="+back}>Acceder a mi cuenta</Link> · <Link href={"/register?redirect="+back}>Crear cuenta</Link></p>}
 {account?.subscription?.period_end&&<section className={s.card}><h2>Mi acceso mensual</h2><p>Periodo abonado hasta el {date(account.subscription.period_end)}.</p></section>}
 {account?.enrollment&&!account.access&&Date.parse(account.enrollment.starts_at)>Date.now()&&<p>Tu acceso comienza el {date(account.enrollment.starts_at)}.</p>}
 {open&&account?.signedIn&&!task&&<form className={s.card} onSubmit={e=>{e.preventDefault();const fields=new FormData(e.currentTarget);void run(async()=>{
  const v=await api({action:"checkout",terms:fields.has("terms"),privacy:fields.has("privacy"),mode:"manual",expectedEnd:paidUntil||null,immediate,withdrawal:fields.has("withdrawal")});
  const form=document.createElement("form");form.method="POST";form.action=v.url;
  for(const [key,val] of Object.entries(v.fields)){const input=document.createElement("input");input.type="hidden";input.name=key;input.value=String(val);form.appendChild(input)}
  document.body.appendChild(form);form.submit();
 })}}><h2>{extending?"Renovar un mes":"Matrícula mensual"}</h2>
 <p>Pago único de 9,90 €. {extending?"El mes se añade al periodo que ya tienes pagado.":"Cuando termine este mes, podrás renovar desde aquí."}</p>
 <label className={s.check}><input type="checkbox" name="terms" required/>Acepto las <Link href="/terminos-contratacion">condiciones de contratación</Link>.</label>
 <label className={s.check}><input type="checkbox" name="privacy" required/>He leído la <Link href="/privacidad">política de privacidad</Link>.</label>
 {(!extending||earlyConsent)&&<label className={s.check}><input type="checkbox" checked={immediate} required={earlyConsent} onChange={e=>setImmediate(e.target.checked)}/>{extending?"Solicito que el nuevo mes comience al vencer el actual, dentro de los próximos 14 días.":"Solicito acceso inmediato. Si dejo esta casilla vacía, mi periodo de acceso empezará dentro de 14 días."}</label>}
 {immediate&&<label className={s.check}><input type="checkbox" name="withdrawal" required/>Entiendo las condiciones de desistimiento aplicables cuando comience el suministro del contenido digital a petición mía.</label>}
 <button className={s.action} disabled={busy}>{extending?"Renovar un mes por 9,90 €":"Pagar un mes · 9,90 €"}</button></form>}
 {account?.access&&!task&&<section className={s.card}><h2>Comenzar un ejercicio</h2><div className={s.controls}><label>Modalidad <select value={kind} onChange={e=>{setKind(e.target.value);setChoice("")}}><option value="test">Test por temas</option><option value="simulacro">Simulacros</option></select></label>{selected&&<label>Ejercicio <select value={selected.id} onChange={e=>setChoice(e.target.value)}>{options.map(o=><option key={o.id} value={o.id}>{o.title}</option>)}</select></label>}<button className={s.action} disabled={busy||!selected} onClick={()=>void run(async()=>{
  const key=kind+":"+selected.id;if(pending.current?.key!==key)pending.current={key,id:crypto.randomUUID()};
  const v=await api({action:"start",kind,set:selected.id,id:pending.current.id});pending.current=null;show(v);await refresh()
 })}>Comenzar</button></div>{kind==="simulacro"&&<p>Hasta dos simulacros nuevos al día. El límite se restablece a medianoche, hora de Madrid.</p>}</section>}
 {task&&<section><h2 tabIndex={-1} ref={heading}>{task.title}</h2>{!result&&!!task.settings.minutes&&<p>Tiempo de referencia restante: {remaining(task,now)}</p>}{task.settings.rubric&&<p>{task.settings.rubric}</p>}
 {result?<><p className={s.note}>{result.written?"Compara tus respuestas de desarrollo con las soluciones.":result.right+(result.right===1?" acierto · ":" aciertos · ")+result.wrong+(result.wrong===1?" error · ":" errores · ")+result.blank+" en blanco · Puntuación: "+result.score}</p>{result.review.map((q,i)=><article className={s.quiz} key={i}><h3>{i+1}. {q.question}{q.reserve?" · Reserva":""}</h3>{q.context&&<p>{q.context}</p>}<p>Tu respuesta: {typeof q.selected==="number"?q.options?.[q.selected]:q.selected||"En blanco"}</p>{typeof q.correct==="number"&&<p>Respuesta correcta: {q.options?.[q.correct]}</p>}<p>{q.explanation}</p></article>)}</>:<><form onSubmit={e=>{e.preventDefault();void run(async()=>{show(await api({action:"finish",id:task.id,answers}));await refresh()})}}>{task.questions.map((q,i)=><fieldset key={i} className={s.quiz}><legend>{i+1}. {q.question}</legend>{q.context&&<p>{q.context}</p>}{q.responseType==="written"?<textarea aria-label={"Respuesta "+(i+1)} rows={3} maxLength={5000} value={String(answers[i]??"")} onChange={e=>answer(i,e.target.value)}/>:q.options?.map((o,j)=><label key={j}><input type="radio" name={"q"+i} checked={answers[i]===j} onChange={()=>answer(i,j)}/>{o}</label>)}{typeof answers[i]==="number"&&<button type="button" className={s.secondary} onClick={()=>answer(i,null)}>Dejar en blanco</button>}</fieldset>)}<button className={s.action} disabled={busy}>Entregar y ver la corrección</button></form></>}
 <p><button className={s.secondary} disabled={busy} onClick={()=>{setTask(null);setResult(null)}}>Volver a mis ejercicios</button></p></section>}
 {!task&&!!account?.events?.length&&<section><h2>Mi historial</h2><ul>{account.events.map(e=><li key={e.id}>{date(e.started_at)} · {e.title} <button className={s.secondary} disabled={busy} onClick={()=>void run(async()=>show(await api({action:"resume",id:e.id})))}>{e.finished_at?"Ver corrección":"Continuar"}</button></li>)}</ul></section>}
 {!task&&<div className={s.controls}>{page>0&&<button className={s.secondary} onClick={()=>setPage(page-1)}>Anterior</button>}{account?.more&&<button className={s.secondary} onClick={()=>setPage(page+1)}>Siguiente</button>}</div>}
 {account?.signedIn&&<p><button className={s.secondary} disabled={busy} onClick={()=>void run(async()=>{const {error}=await supabase.auth.signOut({scope:"local"});if(error)throw Error("No se ha podido cerrar la sesión.");window.location.assign("/test-opo12")})}>Cerrar sesión en este dispositivo</button></p>}
 </>;
}
