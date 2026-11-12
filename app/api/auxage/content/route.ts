import { NextRequest, NextResponse } from "next/server";
import { COURSE,access,resource,sample,Theme,Resources } from "@/lib/auxage/server";
export const dynamic="force-dynamic";
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(req:NextRequest){
 try{
  const ctx=await access(req);const id=(req.nextUrl.searchParams.get("theme")||"T01").toUpperCase();
  const mode=req.nextUrl.searchParams.get("mode")||"theme";
  if(!/^T(?:0[1-9]|1[0-9]|2[0-8])$/.test(id))return json({error:"invalid_theme"},400);
  if(!ctx.allowed&&(mode!=="theme"||id!=="T01"))return json({error:ctx.user?"subscription_required":"login_required"},ctx.user?403:401);
  const plan=ctx.allowed?ctx.plan:"esencial";const advanced=plan!=="esencial";
  if(mode==="theme"){
   const t=await resource<Theme>(id);if(!t)return json({error:"theme_not_found"},404);
   return json({theme:{...t,tests:t.tests.slice(0,advanced||id==="T01"?50:10)},plan,access:ctx.administrator?"administrator":ctx.allowed?"enrollment":"public_preview",allowed:ctx.allowed});
  }
  if(mode==="history"){
   const {data,error}=await ctx.db.from("course_learning_events").select("id,content_id,event_type,progress_percent,metadata,occurred_at").eq("user_id",ctx.user!.id).eq("course_slug",COURSE).order("occurred_at",{ascending:false}).limit(120);
   if(error)return json({error:"history_unavailable"},503);return json({events:data||[]});
  }
  if(mode==="glossary")return json({glossary:(await resource<Resources>("resources"))?.glossary||[]});
  if(!advanced)return json({error:"standard_required"},403);
  const r=await resource<Resources>("resources");if(!r)return json({error:"resources_unavailable"},503);
  if(mode==="simulation"){
   const fixed=Number(req.nextUrl.searchParams.get("fixed")||0);
   if(Number.isInteger(fixed)&&fixed>=1&&fixed<=10)return json({questions:r.simulations[fixed-1],title:`Simulacro ${fixed} · 50 preguntas`});
   const {data,error}=await ctx.db.from("opposition_materials").select("payload").eq("course_slug",COURSE).like("resource_id","T%");
   if(error)return json({error:"question_bank_unavailable"},503);
   // Draw 20 different topics first, then one question per topic: broad syllabus coverage per attempt.
   const themes=sample((data||[]).map(v=>v.payload as Theme),20);
   return json({questions:sample(themes.map(t=>sample(t.tests,1)[0]),20),title:"Simulacro aleatorio · 20 preguntas · temario completo"});
  }
  if(mode==="psychometric"){
   const category=req.nextUrl.searchParams.get("category")||"";
   const pool=category?r.psychometric.filter(q=>q.category===category):r.psychometric;
   return json({questions:sample(pool,20),title:category||"Entrenamiento psicotécnico mixto"});
  }
  return json({error:"invalid_mode"},400);
 }catch{return json({error:"course_unavailable"},503);}
}
