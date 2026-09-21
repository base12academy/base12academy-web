import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getShortQuestionsByTopic } from "@/lib/exams/getShortQuestions";
import { getShortFileSlug } from "@/lib/exams/getShortFileSlug";
import { normalizeText } from "@/lib/exams/normalizeText";
import { getNextTopic } from "@/lib/temas";

type ShortQuestion={id:string;question:string;answerGuide:string;keywords:string[]};

function themeNumber(theme:string){const m=theme.match(/^tema-(\d+)/);return m?Number(m[1]):0;}
function bank(theme:string):ShortQuestion[]{try{return getShortQuestionsByTopic(getShortFileSlug(theme)) as ShortQuestion[]}catch{return []}}

async function ctx(req:NextRequest){
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");if(!token)return null;
  const supabase=getSupabase();const {data}=await supabase.auth.getUser(token);if(!data.user)return null;
  const now=new Date().toISOString();
  const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",data.user.id).eq("course_slug","historia-espana").in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
  return {supabase,user:data.user,enrollment:enrollment||null};
}

export async function GET(req:NextRequest){
  const theme=String(req.nextUrl.searchParams.get("tema")||"tema-1");
  const c=await ctx(req);if(!c)return NextResponse.json({error:"authentication_required"},{status:401});if(!c.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
  const items=[...bank(theme)].sort(()=>Math.random()-0.5).slice(0,5).map(({answerGuide,keywords,...q})=>q);
  return NextResponse.json({tema:theme,questions:items});
}

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>({}));
  const theme=String(body.tema||"tema-1");const answers=body.answers&&typeof body.answers==="object"?body.answers as Record<string,string>:{};const ids:string[]=Array.isArray(body.questionIds)?body.questionIds.map((value:unknown)=>String(value)):[];
  const c=await ctx(req);if(!c)return NextResponse.json({error:"authentication_required"},{status:401});if(!c.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
  const source=bank(theme);const selected=ids.map((id:string)=>source.find((q:ShortQuestion)=>q.id===id)).filter((item:ShortQuestion|undefined):item is ShortQuestion=>Boolean(item));
  if(!selected.length)return NextResponse.json({error:"invalid_submission"},{status:400});
  const results=selected.map(q=>{
    const normalized=normalizeText(String(answers[q.id]||""));const keywords:string[]=Array.isArray(q.keywords)?q.keywords:[];const matched=keywords.filter((k:string)=>normalized.includes(normalizeText(k)));const min=Math.max(1,Math.ceil(keywords.length*.6));const correct=keywords.length>0&&matched.length>=min;
    return {id:q.id,correct,matchedKeywords:matched,totalKeywords:keywords.length,keywords,answerGuide:q.answerGuide};
  });
  const correct=results.filter((r:{correct:boolean})=>r.correct).length;const score=Math.round(correct/selected.length*100);const now=new Date().toISOString();const n=themeNumber(theme);
  if(n>0)await c.supabase.from("intentos-cortas").insert({usuario_id:c.user.id,tema_id:n,score,fecha:now});
  await c.supabase.from("course_learning_events").insert({user_id:c.user.id,enrollment_id:c.enrollment.id,course_slug:"historia-espana",content_id:theme,event_type:"assessment_submitted",progress_percent:score,metadata:{activityType:"legacy_short_questions",correct,total:selected.length},occurred_at:now});
  let unlocked=false;
  if(n>0){
    const {data:attempts}=await c.supabase.from("intentos-cortas").select("score").eq("usuario_id",c.user.id).eq("tema_id",n);
    const approved=((attempts||[]) as {score:number|null}[]).filter((i:{score:number|null})=>Number(i.score)>=80).length;
    const next=getNextTopic(theme);
    if(approved>=4&&next){
      const {data:profile}=await c.supabase.from("perfiles").select("temas_activos").eq("user_id",c.user.id).maybeSingle();const active=Array.isArray(profile?.temas_activos)?profile.temas_activos:[];
      if(!active.includes(next))await c.supabase.from("perfiles").update({temas_activos:[...active,next]}).eq("user_id",c.user.id);
      unlocked=true;
    }
  }
  return NextResponse.json({ok:true,score,correct,total:selected.length,results,unlocked,nextTheme:getNextTopic(theme)});
}
