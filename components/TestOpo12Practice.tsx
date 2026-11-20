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
 existing_subscription:"Ya tienes una suscripción para este programa.",login_required:"Inicia sesión para continuar.",
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
 const pending=useRef<{key:string;id:string}|null>(null),heading=useRef<HTMLHeadingElement>(null);
 const api=useCallback(async(body?:Record<string,unknown>,currentPage=0)=>{
  const {data}=await supabase.auth.getSession();
  const headers:Record<string,string>={};if(data.session)headers.Authorization="Bearer "+data.session.access_token;
  if(body)headers["Content-Type"]="application/json";
  const response=await fetch("/api/test-opo12/"+encodeURIComponent(slug)+"?page="+currentPage,{method:body?"POST":"GET",headers,body:body?JSON.stringify(body):undefined,cache:"no-store"});
  const value=await response.json();if(!response.ok)throw Error(errors[value.error]||"No se ha podido completar la operación. Vuelve a intentarlo.");
  return value;
 },[slug]);
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
 const back=encodeURIComponent(testCoursePath(slug));
 return <>
 {message&&<p role="alert" className={s.note}>{message}</p>}
 {failed?<p role="status">No se ha podido consultar la disponibilidad del curso.</p>:!open&&<p className={s.note}>Matrícula en preparación</p>}
 {!account&&!message&&<p role="status">Consultando acceso…</p>}
 {open&&account&&!account.signedIn&&<p><Link href={"/login?redirect="+back}>Acceder a mi cuenta</Link> · <Link href={"/register?redirect="+back}>Crear cuenta</Link></p>}
 {account?.subscription?.period_end&&<section className={s.card}><h2>Mi suscripción</h2><p>Periodo abonado hasta el {date(account.subscription.period_end)}. {account.subscription.renew?"Renovación automática activada.":"Renovación automática desactivada."}</p>{account.subscription.state==="attention"&&<p>El banco ha confirmado el pago del periodo. Para gestionar la renovación, contacta con Base12.</p>}{account.subscription.renew&&<button className={s.secondary} disabled={busy} onClick={()=>{if(window.confirm("¿Cancelar las próximas renovaciones? Conservarás el acceso hasta el final del periodo abonado."))void run(async()=>{await api({action:"cancel"});await refresh()})}}>Cancelar renovación</button>}</section>}
 {account?.enrollment&&!account.access&&Date.parse(account.enrollment.starts_at)>Date.now()&&<p>Tu acceso comienza el {date(account.enrollment.starts_at)}.</p>}
 {open&&account?.signedIn&&!account.access&&!(account.subscription?.period_end&&Date.parse(account.subscription.period_end)>Date.now())&&<form className={s.card} onSubmit={e=>{e.preventDefault();const fields=new FormData(e.currentTarget);void run(async()=>{
  const v=await api({action:"checkout",terms:fields.has("terms"),privacy:fields.has("privacy"),recurring:fields.has("recurring"),immediate,withdrawal:fields.has("withdrawal")});
  const form=document.createElement("form");form.method="POST";form.action=v.url;
  for(const [key,val] of Object.entries(v.fields)){const input=document.createElement("input");input.type="hidden";input.name=key;input.value=String(val);form.appendChild(input)}
  document.body.appendChild(form);form.submit();
 })}}><h2>Matrícula mensual</h2><label className={s.check}><input type="checkbox" name="terms" required/>Acepto las <Link href="/terminos-contratacion">condiciones de contratación</Link>.</label><label className={s.check}><input type="checkbox" name="privacy" required/>He leído la <Link href="/privacidad">política de privacidad</Link>.</label><label className={s.check}><input type="checkbox" name="recurring" required/>Autorizo el primer pago de 9,90 € y la renovación automática de 9,90 € cada mes para esta oposición hasta que cancele desde mi cuenta.</label><label className={s.check}><input type="checkbox" checked={immediate} onChange={e=>setImmediate(e.target.checked)}/>Solicito acceso inmediato. Si dejo esta casilla vacía, mi periodo de acceso empezará dentro de 14 días.</label>{immediate&&<label className={s.check}><input type="checkbox" name="withdrawal" required/>Entiendo que al iniciarse el suministro inmediato del contenido digital pierdo el derecho de desistimiento en los términos de las condiciones de contratación.</label>}<button className={s.action} disabled={busy}>Suscribirme y pagar 9,90 €</button></form>}
 {account?.access&&!task&&<section className={s.card}><h2>Comenzar un ejercicio</h2><div className={s.controls}><label>Modalidad <select value={kind} onChange={e=>{setKind(e.target.value);setChoice("")}}><option value="test">Test por temas</option><option value="simulacro">Simulacros</option></select></label>{selected&&<label>Ejercicio <select value={selected.id} onChange={e=>setChoice(e.target.value)}>{options.map(o=><option key={o.id} value={o.id}>{o.title}</option>)}</select></label>}<button className={s.action} disabled={busy||!selected} onClick={()=>void run(async()=>{
  const key=kind+":"+selected.id;if(pending.current?.key!==key)pending.current={key,id:crypto.randomUUID()};
  const v=await api({action:"start",kind,set:selected.id,id:pending.current.id});pending.current=null;show(v);await refresh()
 })}>Comenzar</button></div>{kind==="simulacro"&&<p>Hasta dos simulacros nuevos al día. El límite se restablece a medianoche, hora de Madrid.</p>}</section>}
 {task&&<section><h2 tabIndex={-1} ref={heading}>{task.title}</h2>{!result&&!!task.settings.minutes&&<p>Tiempo de referencia restante: {remaining(task,now)}</p>}{task.settings.rubric&&<p>{task.settings.rubric}</p>}
 {result?<><p className={s.note}>{result.written?"Compara tus respuestas de desarrollo con las soluciones.":result.right+" aciertos · "+result.wrong+" errores · "+result.blank+" en blanco · Puntuación: "+result.score}</p>{result.review.map((q,i)=><article className={s.quiz} key={i}><h3>{i+1}. {q.question}{q.reserve?" · Reserva":""}</h3>{q.context&&<p>{q.context}</p>}<p>Tu respuesta: {typeof q.selected==="number"?q.options?.[q.selected]:q.selected||"En blanco"}</p>{typeof q.correct==="number"&&<p>Respuesta correcta: {q.options?.[q.correct]}</p>}<p>{q.explanation}</p></article>)}</>:<><form onSubmit={e=>{e.preventDefault();void run(async()=>{show(await api({action:"finish",id:task.id,answers}));await refresh()})}}>{task.questions.map((q,i)=><fieldset key={i} className={s.quiz}><legend>{i+1}. {q.question}</legend>{q.context&&<p>{q.context}</p>}{q.responseType==="written"?<textarea aria-label={"Respuesta "+(i+1)} rows={3} maxLength={5000} value={String(answers[i]??"")} onChange={e=>answer(i,e.target.value)}/>:q.options?.map((o,j)=><label key={j}><input type="radio" name={"q"+i} checked={answers[i]===j} onChange={()=>answer(i,j)}/>{o}</label>)}{typeof answers[i]==="number"&&<button type="button" className={s.secondary} onClick={()=>answer(i,null)}>Dejar en blanco</button>}</fieldset>)}<button className={s.action} disabled={busy}>Entregar y ver la corrección</button></form></>}
 <p><button className={s.secondary} disabled={busy} onClick={()=>{setTask(null);setResult(null)}}>Volver a mis ejercicios</button></p></section>}
 {!task&&!!account?.events?.length&&<section><h2>Mi historial</h2><ul>{account.events.map(e=><li key={e.id}>{date(e.started_at)} · {e.title} <button className={s.secondary} disabled={busy} onClick={()=>void run(async()=>show(await api({action:"resume",id:e.id})))}>{e.finished_at?"Ver corrección":"Continuar"}</button></li>)}</ul></section>}
 {!task&&<div className={s.controls}>{page>0&&<button className={s.secondary} onClick={()=>setPage(page-1)}>Anterior</button>}{account?.more&&<button className={s.secondary} onClick={()=>setPage(page+1)}>Siguiente</button>}</div>}
 </>;
}
