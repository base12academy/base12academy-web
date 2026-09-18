import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { historiaTests } from "@/src/data/historia/tests";

type Question={id:string;question:string;options:string[];correctAnswer:number};

function themeNumber(theme:string){
  const match=theme.match(/^tema-(\d+)/);
  return match?Number(match[1]):0;
}

async function context(req:NextRequest){
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return null;
  const supabase=getSupabase();
  const {data}=await supabase.auth.getUser(token);
  if(!data.user)return null;
  const now=new Date().toISOString();
  const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",data.user.id).eq("course_slug","historia-espana").in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
  return {supabase,user:data.user,enrollment:enrollment||null};
}

export async function GET(req:NextRequest){
  const theme=String(req.nextUrl.searchParams.get("tema")||"tema-1");
  const ctx=await context(req);
  if(!ctx)return NextResponse.json({error:"authentication_required"},{status:401});
  if(!ctx.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
  const bank=(historiaTests[theme as keyof typeof historiaTests]||[]) as Question[];
  if(!bank.length)return NextResponse.json({tema:theme,questions:[]});
  const shuffled=[...bank].sort(()=>Math.random()-0.5).slice(0,20);
  return NextResponse.json({tema:theme,questions:shuffled.map(({correctAnswer,...q})=>q)});
}

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>({}));
  const theme=String(body.tema||"tema-1");
  const answers=body.answers&&typeof body.answers==="object"?body.answers as Record<string,number>:{};
  const questionIds:string[]=Array.isArray(body.questionIds)?body.questionIds.map((value:unknown)=>String(value)):[];
  const ctx=await context(req);
  if(!ctx)return NextResponse.json({error:"authentication_required"},{status:401});
  if(!ctx.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
  const bank=(historiaTests[theme as keyof typeof historiaTests]||[]) as Question[];
  const selected=questionIds.map((id:string)=>bank.find((q:Question)=>q.id===id)).filter((item:Question|undefined):item is Question=>Boolean(item));
  if(!selected.length)return NextResponse.json({error:"invalid_submission"},{status:400});
  const corrections=selected.map(q=>({id:q.id,correctAnswer:q.correctAnswer,selected:answers[q.id],correct:answers[q.id]===q.correctAnswer}));
  const correct=corrections.filter(x=>x.correct).length;
  const percentage=Math.round(correct/selected.length*100);
  const number=themeNumber(theme);
  const now=new Date().toISOString();

  if(number>0){
    await ctx.supabase.from("intentos_test").insert({usuario_id:ctx.user.id,tema_id:number,score:percentage,tiempo_total:0,fecha:now});
  }
  await ctx.supabase.from("course_learning_events").insert({
    user_id:ctx.user.id,enrollment_id:ctx.enrollment.id,course_slug:"historia-espana",content_id:theme,event_type:"assessment_submitted",progress_percent:percentage,
    metadata:{activityType:"legacy_theme_test",correct,total:selected.length},occurred_at:now
  });

  let unlocked=false;
  if(number>0){
    const {data:intentos}=await ctx.supabase.from("intentos_test").select("score").eq("usuario_id",ctx.user.id).eq("tema_id",number);
    const approved=((intentos||[]) as {score:number|null}[]).filter((item:{score:number|null})=>Number(item.score)>=80).length;
    if(approved>=5){
      const nextTheme="tema-"+String(number+1);
      const {data:profile}=await ctx.supabase.from("perfiles").select("temas_activos").eq("user_id",ctx.user.id).maybeSingle();
      const active=Array.isArray(profile?.temas_activos)?profile.temas_activos:[];
      if(!active.includes(nextTheme)){
        await ctx.supabase.from("perfiles").update({temas_activos:[...active,nextTheme]}).eq("user_id",ctx.user.id);
      }
      unlocked=true;
    }
  }
  return NextResponse.json({ok:true,score:percentage,correct,total:selected.length,corrections,unlocked});
}
