"use client";
import {useEffect,useState} from "react";
import s from "@/components/OppositionCourse.module.css";

type Question={id:string;question:string;options:string[]};
type Answer={id:string;selected:number|null};
type Review=Answer&{correct:number;explanation:string};
type Result={ok?:boolean;error?:string;correct?:number;incorrect?:number;blank?:number;saved?:boolean;score?:number;total?:number;review?:Review[]};
type Props={durationMinutes?:number;reserveCount?:number;title:string;questions:Question[];submitAnswers:(answers:Answer[])=>Promise<Result>;onSaved:()=>Promise<void>};

export default function UniversityPracticeQuiz({title,questions,submitAnswers,onSaved,durationMinutes,reserveCount=0}:Props){
 const [answers,setAnswers]=useState<Record<string,number|null>>({});
 const [marked,setMarked]=useState<Set<string>>(new Set());
 const [result,setResult]=useState<Result|null>(null);
 const [busy,setBusy]=useState(false);
 const [onlyMistakes,setOnlyMistakes]=useState(false);
 const answered=questions.filter(q=>Number.isInteger(answers[q.id])).length;
 const corrections=new Map((result?.review||[]).map(value=>[value.id,value]));
 const [deadline,setDeadline]=useState(()=>durationMinutes?Date.now()+durationMinutes*60000:0);
 const [seconds,setSeconds]=useState((durationMinutes??0)*60);
 useEffect(()=>{
  if(!deadline||result?.ok)return;
  const update=()=>setSeconds(Math.max(0,Math.ceil((deadline-Date.now())/1000)));
  update();const timer=window.setInterval(update,1000);return ()=>window.clearInterval(timer);
 },[deadline,result?.ok]);
 const expired=!!deadline&&seconds===0;
 const locked=busy||!!result?.ok||expired;
 const submit=async()=>{
  setBusy(true);setResult(null);
  try{
   const value=await submitAnswers(questions.map(q=>({id:q.id,selected:Number.isInteger(answers[q.id])?answers[q.id]:null})));
   setResult(value);
   if(value.ok&&value.saved)await onSaved().catch(()=>undefined);
  }catch{setResult({error:"connection_error"})}finally{setBusy(false)}
 };
 const retry=()=>{if(durationMinutes){setSeconds(durationMinutes*60);setDeadline(Date.now()+durationMinutes*60000)}setAnswers({});setMarked(new Set());setResult(null);setOnlyMistakes(false)};
 return <div>
  <h2>{title}</h2>
  {!!deadline&&!result?.ok&&<p>{expired?"Tiempo finalizado. Puedes corregir tus respuestas.":`Tiempo restante · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`}</p>}
  {reserveCount>0&&<p>{questions.length-reserveCount} preguntas evaluables y {reserveCount} de reserva. Las reservas se corrigen por separado y quedan fuera de la puntuación.</p>}
  {!result?.ok&&<><p>Responde primero. Después utiliza la explicación para identificar qué concepto o regla necesitas repasar.</p><p role="status">{answered} de {questions.length} respondidas · {questions.length-answered} en blanco · {marked.size} marcadas para revisar</p></>}
  {result?.ok&&<section className={s.notice} aria-label="Resultado del ejercicio"><h3>{result.correct} aciertos · {result.incorrect} errores · {result.blank} en blanco</h3>{durationMinutes&&<p>Puntuación neta: {result.score} sobre {result.total}.</p>}<p>{result.saved?"Resultado guardado en tu progreso.":"Ejercicio de muestra. La corrección no se guarda en tu progreso."}</p><p>Revisa la regla aplicada y explica por qué tu elección encaja o por qué debes cambiarla.</p><label><input type="checkbox" checked={onlyMistakes} onChange={e=>setOnlyMistakes(e.target.checked)}/>Mostrar solo errores y preguntas en blanco</label></section>}
  {questions.map((q,index)=>{
   const review=corrections.get(q.id);
   const correct=!!review&&review.selected===review.correct;
   if(result?.ok&&onlyMistakes&&correct)return null;
   return <fieldset className={s.question} key={q.id}>
    <legend>{reserveCount>0&&index>=questions.length-reserveCount?"Reserva · ":""}{index+1}. {q.question}</legend>
    {q.options.map((option,n)=><label key={n}><input type="radio" name={q.id} disabled={locked} checked={answers[q.id]===n} onChange={()=>setAnswers(values=>({...values,[q.id]:n}))}/><span><strong>{String.fromCharCode(65+n)}.</strong> {option}</span></label>)}
    {!result?.ok&&<div className={s.actions}><button type="button" className={s.secondary} disabled={locked||!Number.isInteger(answers[q.id])} onClick={()=>setAnswers(values=>({...values,[q.id]:null}))}>Dejar en blanco la pregunta {index+1}</button><button type="button" className={s.secondary} aria-pressed={marked.has(q.id)} disabled={busy} onClick={()=>setMarked(values=>{const next=new Set(values);if(next.has(q.id))next.delete(q.id);else next.add(q.id);return next})}>{marked.has(q.id)?"Quitar marca":"Marcar para revisar"} · {index+1}</button></div>}
    {review&&<div className={s.note}><p><strong>{review.selected===null?"En blanco":correct?"Acertada":"Incorrecta"}</strong></p>{review.selected!==null&&<p>Tu respuesta: {String.fromCharCode(65+review.selected)}. {q.options[review.selected]}</p>}<p><strong>Respuesta correcta:</strong> {String.fromCharCode(65+review.correct)}. {q.options[review.correct]}</p><p>{review.explanation}</p></div>}
   </fieldset>;
  })}
  {!result?.ok?<button type="button" className={s.primary} disabled={busy} onClick={()=>void submit()}>{busy?"Corrigiendo…":"Corregir ejercicio"}</button>:<button type="button" className={s.primary} onClick={retry}>Volver a practicar el ejercicio</button>}
  {result?.ok&&onlyMistakes&&result.incorrect===0&&result.blank===0&&<p>Has acertado todas las preguntas. Explica una de las reglas sin mirar antes de dar el tema por aprendido.</p>}
  {result?.error&&<p role="alert" className={s.notice}>No se ha podido completar la corrección. Tus respuestas siguen disponibles para intentarlo otra vez.</p>}
 </div>;
}
