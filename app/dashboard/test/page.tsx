"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BADGES } from "@/lib/badges";

type Question={id:string;question:string;options:string[]};
type Correction={id:string;correctAnswer:number;selected:number;correct:boolean};

export default function TestPage(){
  const [tema,setTema]=useState("tema-1");
  const [questions,setQuestions]=useState<Question[]>([]);
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [score,setScore]=useState<number|null>(null);
  const [corrections,setCorrections]=useState<Record<string,Correction>>({});
  const [showResults,setShowResults]=useState(false);
  const [earnedBadges,setEarnedBadges]=useState<string[]>([]);
  const [showSuccess,setShowSuccess]=useState(false);
  const [newBadge,setNewBadge]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{const params=new URLSearchParams(window.location.search);setTema(params.get("tema")||"tema-1")},[]);
  useEffect(()=>{const saved=localStorage.getItem("historia-badges");if(saved)setEarnedBadges(JSON.parse(saved))},[]);

  async function authHeaders():Promise<Record<string,string>>{
    const {data}=await supabase.auth.getSession();
    const token=data.session?.access_token;
    return token?{Authorization:"Bearer "+token}:{};
  }

  async function load(){
    setLoading(true);setError("");setAnswers({});setScore(null);setCorrections({});setShowResults(false);setShowSuccess(false);
    const headers=await authHeaders();
    const response=await fetch("/api/history-legacy-test?tema="+encodeURIComponent(tema),{headers});
    const data=await response.json().catch(()=>({}));
    if(response.ok)setQuestions(data.questions||[]);
    else{setQuestions([]);setError(data.error==="authentication_required"?"Debes iniciar sesión.":data.error==="matriculation_required"?"Necesitas una matrícula activa de Historia de España.":"No se ha podido cargar el test.");}
    setLoading(false);
  }
  useEffect(()=>{void load()},[tema]);

  async function handleSubmit(){
    const headers=await authHeaders();
    if(!("Authorization" in headers)){setError("Debes iniciar sesión.");return;}
    const response=await fetch("/api/history-legacy-test",{method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify({tema,answers,questionIds:questions.map(q=>q.id)})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok){setError("No se ha podido corregir el test.");return;}
    setScore(data.score);setShowResults(true);setShowSuccess(Boolean(data.unlocked));
    const byId:Record<string,Correction>={};for(const item of data.corrections||[])byId[item.id]=item;setCorrections(byId);

    const nextBadges=[...earnedBadges];
    if(data.score>=80&&!nextBadges.includes("primer_test_aprobado"))nextBadges.push("primer_test_aprobado");
    if(tema==="tema-1"&&data.score>=80&&!nextBadges.includes("test_tema1_80"))nextBadges.push("test_tema1_80");
    setEarnedBadges(nextBadges);localStorage.setItem("historia-badges",JSON.stringify(nextBadges));
    const {data:userData}=await supabase.auth.getUser();
    if(userData.user)for(const badgeId of nextBadges)await supabase.from("insignias_historia").upsert({user_id:userData.user.id,badge_id:badgeId});
    const last=nextBadges[nextBadges.length-1];if(last&&!earnedBadges.includes(last))setNewBadge(last);
  }

  const nextThemeNumber=(tema.match(/^tema-(\d+)/)?.[1]&&Number(tema.match(/^tema-(\d+)/)![1])+1)||null;

  return <div style={{padding:32,maxWidth:900,margin:"0 auto"}}>
    <h1>Test {tema}</h1>
    {error?<p style={{color:"#b42318"}}>{error}</p>:null}
    {loading?<p>Cargando preguntas…</p>:questions.length===0?<p>No hay preguntas para este tema.</p>:<>
      {questions.map((q,index)=><div key={q.id} style={{marginBottom:20}}><p><strong>{index+1}. {q.question}</strong></p>
        {q.options.map((opt,i)=>{
          const correction=corrections[q.id];let color="black";
          if(showResults&&correction){if(i===correction.correctAnswer)color="green";else if(i===answers[q.id])color="red";}
          return <div key={i}><label style={{color}}><input type="radio" name={q.id} checked={answers[q.id]===i} disabled={showResults} onChange={()=>setAnswers(prev=>({...prev,[q.id]:i}))}/>{opt}</label></div>;
        })}
      </div>)}
      {!showResults?<button onClick={()=>void handleSubmit()} disabled={questions.some(q=>answers[q.id]===undefined)}>Corregir</button>:<>
        <h2>Resultado: {score}%</h2>
        {showSuccess?<><div style={{marginTop:16,padding:16,background:"#dcfce7",border:"1px solid #16a34a",borderRadius:12,textAlign:"center",fontWeight:"bold"}}>Tema superado</div>{nextThemeNumber?<p><a href={"/dashboard/tema/tema-"+nextThemeNumber}>Ir al siguiente tema</a></p>:null}</>:null}
        <button onClick={()=>void load()}>Repetir</button>
      </>}
      {earnedBadges.length>0?<div style={{marginTop:24}}><h3>Medallas</h3>{earnedBadges.map(id=>{const badge=BADGES[id as keyof typeof BADGES];return badge?<div key={id} style={{padding:10,border:"1px solid #ddd",borderRadius:10,marginBottom:8}}><strong>{badge.title}</strong><p style={{fontSize:14,margin:0}}>{badge.description}</p></div>:null})}</div>:null}
      {newBadge?<div style={{position:"fixed",top:20,right:20,background:"#111827",color:"white",padding:16,borderRadius:12}}>Nueva medalla: {BADGES[newBadge as keyof typeof BADGES]?.title}</div>:null}
    </>}
  </div>;
}
