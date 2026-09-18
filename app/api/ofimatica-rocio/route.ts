import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator, isPublicOfimaticaLesson } from "@/lib/course-access";
import questionsSource from "@/lib/rocio-questions.json";

type Question={
  code:string;lesson:string;type:string;difficulty:string;prompt:string;options:string[];
  answer:number;explanation:string;criterion:string;recovery:string;
};
const questions=questionsSource as Question[];

async function resolveAccess(req:NextRequest,lesson:string){
  const publicPreview=isPublicOfimaticaLesson(lesson);
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  const supabase=getSupabase();
  if(!token)return {allowed:publicPreview,user:null,enrollment:null,administrator:false,supabase,publicPreview};
  const {data}=await supabase.auth.getUser(token);
  if(!data.user)return {allowed:publicPreview,user:null,enrollment:null,administrator:false,supabase,publicPreview};
  if(isCourseAdministrator(data.user.email))return {allowed:true,user:data.user,enrollment:null,administrator:true,supabase,publicPreview};
  const now=new Date().toISOString();
  const {data:enrollment}=await supabase.from("course_enrollments").select("id,plan_slug").eq("user_id",data.user.id).eq("course_slug","ofimatica").eq("status","active").lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
  const group=Number(lesson.slice(1,3));
  const rank:Record<string,number>={esencial:6,estandar:9,standard:9,premium:11};
  const allowed=publicPreview||Boolean(enrollment&&rank[String(enrollment.plan_slug||"")]>=group);
  return {allowed,user:data.user,enrollment:enrollment||null,administrator:false,supabase,publicPreview};
}

export async function GET(req:NextRequest){
  const lesson=String(req.nextUrl.searchParams.get("lesson")||"").toUpperCase();
  if(!/^G\d{2}_V\d{2}$/.test(lesson))return NextResponse.json({error:"invalid_lesson"},{status:400});
  const access=await resolveAccess(req,lesson);
  if(!access.allowed)return NextResponse.json({error:access.user?"matriculation_required":"authentication_required"},{status:access.user?403:401});
  const items=questions.filter(q=>q.lesson===lesson).map(({answer,explanation,criterion,recovery,...q})=>q);
  return NextResponse.json({lesson,count:items.length,items});
}

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>({}));
  const lesson=String(body.lesson||"").toUpperCase();
  const code=String(body.code||"");
  const selected=Number(body.selected);
  if(!/^G\d{2}_V\d{2}$/.test(lesson)||!code||!Number.isInteger(selected)||selected<0||selected>3)return NextResponse.json({error:"invalid_submission"},{status:400});
  const access=await resolveAccess(req,lesson);
  if(!access.allowed)return NextResponse.json({error:access.user?"matriculation_required":"authentication_required"},{status:access.user?403:401});
  const q=questions.find(item=>item.lesson===lesson&&item.code===code);
  if(!q)return NextResponse.json({error:"question_not_found"},{status:404});
  const correct=selected===q.answer;
  if(access.user&&access.enrollment){
    const now=new Date().toISOString();
    const {error}=await access.supabase.from("course_learning_events").insert({
      user_id:access.user.id,
      enrollment_id:access.enrollment.id,
      course_slug:"ofimatica",
      content_id:q.code,
      event_type:"assessment_submitted",
      progress_percent:correct?100:0,
      metadata:{activityType:"rocio_closed",unit:lesson,feedback:correct?q.explanation:q.recovery,selected},
      occurred_at:now,
    });
    if(error)console.error("No se pudo registrar comprobación de Ofimática",error);
  }
  return NextResponse.json({ok:true,correct,correctAnswer:q.answer,explanation:q.explanation,criterion:q.criterion,recovery:q.recovery});
}
