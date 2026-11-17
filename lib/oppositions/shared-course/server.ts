import "server-only";
import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {getSupabase} from "@/lib/supabase/server";
import {isCourseAdministrator} from "@/lib/course-access";
import {reservePublicRocioTurn} from "@/lib/opposition-public-preview";

export type Question={id:string;question:string;options:string[];answer:number;explanation:string;topicCode?:string};
export type Theme={id:string;code:string;number:number;title:string;blocks:{type:string;text:string;rows?:string[][]}[];glossary:{term:string;definition:string}[];rocio:{question:string;answer:string}[];tests:Question[];publicPreview:boolean;studyEdition?:string};
type PracticalMeta={id:string;title:string;type:"quiz"|"office";durationMinutes:number;count:number;resourceId:string;reserveCount?:number;block?:string};
export type Index={courseSlug:string;title:string;shortTitle:string;level:string;region:string;durationMonths:number;enrollmentOpen:boolean;themes:{id:string;code:string;number:number;title:string;publicPreview:boolean}[];simulations:{id:string;title:string;count:number}[];cases?:PracticalMeta[];exams?:PracticalMeta[];counts:Record<string,number>};
type Resources={glossary:{term:string;definition:string;topics?:number[]}[];simulations:{id:string;title:string;count?:number}[];cases?:PracticalMeta[];exams?:PracticalMeta[]};

const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});

async function access(req:NextRequest,course:string){
 const db=getSupabase();const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
 if(!token)return {db,user:null,enrollment:null,administrator:false,plan:"esencial",allowed:false};
 const {data,error}=await db.auth.getUser(token);
 if(error||!data.user)return {db,user:null,enrollment:null,administrator:false,plan:"esencial",allowed:false};
 const administrator=isCourseAdministrator(data.user.email);
 if(administrator)return {db,user:data.user,enrollment:null,administrator,plan:"premium",allowed:true};
 const now=new Date().toISOString();
 const {data:rows,error:enrollmentError}=await db.from("course_enrollments").select("id,plan_slug")
  .eq("user_id",data.user.id).eq("course_slug",course).eq("status","active").lte("starts_at",now)
  .or(`expires_at.is.null,expires_at.gte.${now}`);
 const rank:Record<string,number>={esencial:1,estandar:2,standard:2,premium:3};
 const enrollment=(rows||[]).sort((a,b)=>(rank[b.plan_slug]||0)-(rank[a.plan_slug]||0))[0]||null;
 return {db,user:data.user,enrollment,administrator:false,plan:enrollment?.plan_slug||"esencial",allowed:!enrollmentError&&!!enrollment};
}
async function resource<T>(course:string,id:string):Promise<T|null>{
 const {data,error}=await getSupabase().from("opposition_materials").select("payload").eq("course_slug",course).eq("resource_id",id).maybeSingle();
 if(error)throw new Error("course_material_unavailable");return data?.payload as T||null;
}
function sample<T>(values:T[],n:number){const copy=[...values];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy.slice(0,n)}

export async function contentGET(req:NextRequest,index:Index){
 try{
  const course=index.courseSlug,ctx=await access(req,course),id=(req.nextUrl.searchParams.get("theme")||"T01").toUpperCase(),mode=req.nextUrl.searchParams.get("mode")||"theme";
  if(!index.themes.some(t=>t.id===id))return json({error:"invalid_theme"},400);
  if(!ctx.allowed&&(mode!=="theme"||id!=="T01"))return json({error:ctx.user?"subscription_required":"login_required"},ctx.user?403:401);
  const advanced=ctx.allowed&&ctx.plan!=="esencial";
  if(mode==="theme"){
   const theme=await resource<Theme>(course,id);if(!theme)return json({error:"theme_not_found"},404);
   const limit=!ctx.allowed&&id==="T01"?50:advanced?50:10;
   return json({theme:{...theme,tests:theme.tests.slice(0,limit)},plan:ctx.plan,access:ctx.administrator?"administrator":ctx.allowed?"enrollment":"public_preview",allowed:ctx.allowed});
  }
  if(!ctx.allowed)return json({error:"subscription_required"},403);
  if(mode==="history"){
   const {data,error}=await ctx.db.from("course_learning_events").select("id,content_id,event_type,progress_percent,metadata,occurred_at").eq("user_id",ctx.user!.id).eq("course_slug",course).order("occurred_at",{ascending:false}).limit(120);
   return error?json({error:"history_unavailable"},503):json({events:data||[]});
  }
  if(mode==="glossary")return json({glossary:(await resource<Resources>(course,"resources"))?.glossary||[]});
  if(!advanced)return json({error:"standard_required"},403);
  if(mode==="case"||mode==="exam"){
   const requested=String(req.nextUrl.searchParams.get("resource")||"").toUpperCase();
   if(!/^(CASE|EXAM)\d{2}[AB]?$/.test(requested))return json({error:"invalid_resource"},400);
   const list=mode==="case"?(index.cases||[]):(index.exams||[]);
   const metadata=list.find(item=>item.resourceId===requested);
   if(!metadata)return json({error:"invalid_resource"},400);
   const practical=await resource<Record<string,unknown>>(course,requested);
   return practical?json({resource:practical}):json({error:"practical_unavailable"},503);
  }
  if(mode==="simulation"){
   const fixed=Number(req.nextUrl.searchParams.get("fixed")||0);
   if(Number.isInteger(fixed)&&fixed>=1&&fixed<=index.simulations.length){
    const sim=await resource<{id:string;title:string;questions:Question[]}>(course,`SIM${String(fixed).padStart(2,"0")}`);
    return sim?json({questions:sim.questions,title:sim.title}):json({error:"simulation_unavailable"},503);
   }
   const {data,error}=await ctx.db.from("opposition_materials").select("payload").eq("course_slug",course).like("resource_id","T%");
   if(error)return json({error:"question_bank_unavailable"},503);
   const themes=sample((data||[]).map(v=>v.payload as Theme),20);
   return json({questions:sample(themes.map(t=>sample(t.tests,1)[0]).filter(Boolean),20),title:"Simulacro aleatorio · 20 preguntas · temario completo"});
  }
  return json({error:"invalid_mode"},400);
 }catch{return json({error:"course_unavailable"},503)}
}

export async function attemptPOST(req:NextRequest,index:Index){
 try{
  const course=index.courseSlug,ctx=await access(req,course),body=await req.json().catch(()=>null);
  if(!body||!Array.isArray(body.answers)||body.answers.length<1||body.answers.length>120)return json({error:"invalid_attempt"},400);
  const mode=String(body.mode||"theme"),theme=String(body.theme||"T01").toUpperCase(),publicTrial=!ctx.allowed;
  if(!["theme","simulation","case","exam"].includes(mode))return json({error:"invalid_mode"},400);
  if(publicTrial&&(mode!=="theme"||theme!=="T01"))return json({error:"subscription_required"},403);
  if(ctx.allowed&&ctx.plan==="esencial"&&(mode!=="theme"||body.answers.length>10))return json({error:"standard_required"},403);
  let questions:Question[]=[];
  if(mode==="theme"){
   if(!index.themes.some(t=>t.id===theme))return json({error:"invalid_theme"},400);
   questions=(await resource<Theme>(course,theme))?.tests||[];
  }else if(mode==="simulation"){
   if(!ctx.allowed||ctx.plan==="esencial")return json({error:"standard_required"},403);
   const fixed=String(body.simulation||"");
   if(fixed){questions=(await resource<{questions:Question[]}>(course,fixed))?.questions||[]}
   else{const {data}=await ctx.db.from("opposition_materials").select("payload").eq("course_slug",course).like("resource_id","T%");questions=(data||[]).flatMap(v=>(v.payload as Theme).tests)}
  }else{
   if(!ctx.allowed||ctx.plan==="esencial")return json({error:"standard_required"},403);
   const requested=String(body.resource||"").toUpperCase();
   if(!/^(CASE|EXAM)\d{2}[AB]?$/.test(requested))return json({error:"invalid_resource"},400);
   const list=mode==="case"?(index.cases||[]):(index.exams||[]);
   if(!list.some(item=>item.resourceId===requested))return json({error:"invalid_resource"},400);
   questions=(await resource<{questions:Question[]}>(course,requested))?.questions||[];
   if(!questions.length)return json({error:"practical_unavailable"},503);
  }
  const keys=new Map(questions.map(q=>[q.id,q])),seen=new Set<string>();let correct=0,incorrect=0,blank=0;
  const review:{id:string;selected:number|null;correct:number;explanation:string}[]=[];
  for(const a of body.answers){
   if(!a||typeof a.id!=="string"||seen.has(a.id)||!keys.has(a.id)||(a.selected!==null&&(!Number.isInteger(a.selected)||a.selected<0||a.selected>3)))return json({error:"invalid_answer"},400);
   seen.add(a.id);const q=keys.get(a.id)!;if(a.selected===null)blank++;else if(q.answer===a.selected)correct++;else incorrect++;
   review.push({id:a.id,selected:a.selected,correct:q.answer,explanation:q.explanation});
  }
  const total=body.answers.length,metadata={correct,incorrect,blank,total,score:Math.round((correct-incorrect/3)*100)/100,type:mode,plan:ctx.plan,resource:body.resource||null,questionIds:[...seen]};
  if(ctx.enrollment){const {error}=await ctx.db.from("course_learning_events").insert({user_id:ctx.user!.id,enrollment_id:ctx.enrollment.id,course_slug:course,content_id:mode==="theme"?theme:mode==="simulation"?String(body.simulation||"simulation"):String(body.resource),event_type:"assessment_submitted",progress_percent:Math.round(correct/total*100),metadata,occurred_at:new Date().toISOString()});if(error)return json({error:"attempt_not_saved"},503)}
  return json({ok:true,...metadata,review,saved:!!ctx.enrollment});
 }catch{return json({error:"attempt_unavailable"},503)}
}

export async function assistantPOST(req:NextRequest,index:Index){
 try{
  const course=index.courseSlug,ctx=await access(req,course),body=await req.json().catch(()=>null),assistant=body?.assistant==="fernando"?"fernando":"rocio",message=String(body?.message||"").trim();
  if(message.length<4||message.length>1800)return json({error:"invalid_message"},400);
  const publicTrial=!ctx.allowed;
  if(publicTrial&&(assistant!=="rocio"||body?.theme!=="T01"))return json({error:"subscription_required"},403);
  if(assistant==="fernando"&&(!ctx.allowed||ctx.plan==="esencial"))return json({error:"standard_required"},403);
  if(!process.env.OPENAI_API_KEY)return json({error:"assistant_unavailable"},503);
  let reservedId:string|null=null;
  if(publicTrial){const limit=await reservePublicRocioTurn(req,course);if(!limit.ok)return json({error:limit.retryAfter?"rate_limit":"assistant_unavailable",retryAfter:limit.retryAfter},limit.retryAfter?429:503)}
  else{
   const since=new Date(Date.now()-60_000).toISOString(),{count,error}=await ctx.db.from("opposition_assistant_turns").select("id",{count:"exact",head:true}).eq("user_id",ctx.user!.id).gte("created_at",since);
   if(error)return json({error:"assistant_unavailable"},503);if((count||0)>=5)return json({error:"rate_limit"},429);
   const {data,error:insertError}=await ctx.db.from("opposition_assistant_turns").insert({user_id:ctx.user!.id,course_slug:course,assistant,theme_id:String(body.theme||"T01").slice(0,8),question:message}).select("id").single();
   if(insertError)return json({error:"assistant_unavailable"},503);reservedId=data.id;
  }
  let context="";
  if(assistant==="rocio"){
   let lookup=ctx.db.from("opposition_materials").select("payload").eq("course_slug",course);lookup=publicTrial?lookup.eq("resource_id","T01"):lookup.like("resource_id","T%");
   const {data,error}=await lookup;if(error)return json({error:"assistant_unavailable"},503);
   const words=message.toLocaleLowerCase("es").match(/[a-záéíóúüñ]{4,}/g)||[],terms=[...new Set(words)];
   const snippets=(data||[]).flatMap(v=>{const t=v.payload as Theme;let heading=t.title;return t.blocks.flatMap(b=>{if(b.type==="heading"){heading=b.text;return []}const lower=b.text.toLocaleLowerCase("es"),score=terms.reduce((s,w)=>s+(lower.includes(w)?1:0),0)+(t.id===body.theme?.toUpperCase()?0.3:0);return [{score,text:`Tema ${t.code} · ${t.title} · ${heading}\n${b.text.slice(0,2200)}`}];})});
   snippets.sort((a,b)=>b.score-a.score);context=snippets.slice(0,14).map(s=>s.text).join("\n\n").slice(0,24000);
  }else{
   const {data}=await ctx.db.from("course_learning_events").select("content_id,event_type,progress_percent,metadata").eq("user_id",ctx.user!.id).eq("course_slug",course).order("occurred_at",{ascending:false}).limit(30);context=JSON.stringify({temario:index.themes,progreso:data||[],plan:body.studyPlan||null}).slice(0,18000);
  }
  const system=assistant==="rocio"?`Eres Rocío, profesora IA de Base12 para ${index.title}. Responde dudas académicas nuevas aunque no estén en el banco cerrado. Basa las afirmaciones del temario en los extractos proporcionados, cita tema y apartado, explica con claridad y no inventes. Si una norma o cifra puede haber cambiado y el contexto no basta, indícalo. No reveles el temario completo.`:`Eres Fernando, tutor IA de Base12 para ${index.title}. Ayuda a organizar el estudio y los repasos según fecha, tiempo y progreso. No inventes datos; deriva las dudas académicas a Rocío y la tutoría humana al calendario Premium.`;
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const result=await client.responses.create({model:"gpt-4.1-mini",max_output_tokens:1000,input:[{role:"system",content:system+(publicTrial?" La muestra pública se limita al tema 1.":"")+"\n\nCONTEXTO:\n"+context},{role:"user",content:message}]});
  const answer=result.output_text||"No he podido elaborar una respuesta. Inténtalo de nuevo.";if(reservedId)await ctx.db.from("opposition_assistant_turns").update({answer}).eq("id",reservedId);return json({answer});
 }catch(error){console.error("OPPOSITION_ASSISTANT_FAILURE",{course:index.courseSlug,error:error instanceof Error?error.name:"unknown"});return json({error:"assistant_unavailable"},503)}
}

