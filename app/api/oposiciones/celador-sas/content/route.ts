import index from "@/lib/oppositions/celador-sas/index.json";
import { NextRequest, NextResponse } from "next/server";
import { COURSE,access,resource,sample,Theme,Resources } from "@/lib/oppositions/celador-sas/server";
export const dynamic="force-dynamic";
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(req:NextRequest){
 try{
  const ctx=await access(req);const id=(req.nextUrl.searchParams.get("theme")||"T01").toUpperCase();
  const mode=req.nextUrl.searchParams.get("mode")||"theme";
  if(!index.themes.some(t=>t.id===id))return json({error:"invalid_theme"},400);
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
   if(Number.isInteger(fixed)&&fixed>=1&&fixed<=r.simulations.length)return json({questions:r.simulations[fixed-1].questions,title:r.simulations[fixed-1].title});
   const {data,error}=await ctx.db.from("opposition_materials").select("payload").eq("course_slug",COURSE).like("resource_id","T%");
   if(error)return json({error:"question_bank_unavailable"},503);
   const themes=(data||[]).map(v=>v.payload as Theme).filter(t=>t.tests.length);
   if(themes.length!==index.themes.length)return json({error:"question_bank_unavailable"},503);
   const selected=sample(themes,20).map(t=>sample(t.tests,1)[0]);
   const ids=new Set(selected.map(q=>q.id));
   const extra=sample(themes.flatMap(t=>t.tests).filter(q=>!ids.has(q.id)),20-selected.length);
   return json({questions:sample([...selected,...extra],20),title:"Repaso aleatorio · 20 preguntas · los 19 temas"});
  }
  return json({error:"invalid_mode"},400);
 }catch{return json({error:"course_unavailable"},503);}
}

