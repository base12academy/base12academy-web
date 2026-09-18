import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { courses } from "@/lib/courses";
import { isCourseAdministrator } from "@/lib/course-access";
import { commercialAnswer } from "@/lib/commercial-assistant";

type EntryPoint="commercial"|"rocio"|"fernando";
type Role="commercial"|"rocio"|"fernando"|"secretaria"|"jefatura"|"direccion";

function normalize(value:string){return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function has(text:string,...terms:string[]){return terms.some(term=>text.includes(normalize(term)));}
function classify(message:string,entryPoint:EntryPoint):Role{
 const text=normalize(message);
 if(has(text,"factura","pago","cobro","recibo","devolucion","cargo","he pagado","me han cobrado"))return "secretaria";
 if(has(text,"otro curso","otros cursos","que curso","cambiar de curso","itinerario","organizacion academica","jefe de estudios","jefatura","compatibilidad","puedo hacer"))return "jefatura";
 if(has(text,"precio","cuesta","descuento","oferta","contratar","modalidad","promocion"))return "commercial";
 if(has(text,"reclamacion","queja","director academico","direccion academica","revision humana"))return "direccion";
 if(has(text,"plan","planificar","progreso","avance","ritmo","que estudio","que hago hoy","voy retras","repaso","recuper","organizar","calendario"))return "fernando";
 if(has(text,"explica","no entiendo","duda","ejercicio","problema","concepto","por que","como se hace","respuesta","deriv","matriz","probabilidad","filosof","historia"))return "rocio";
 return entryPoint;
}
function courseCatalogSummary(){
 const seen=new Map<string,Set<string>>();
 for(const item of Object.values(courses)){const entry=seen.get(item.courseSlug)||new Set<string>();entry.add(item.title+" · "+(item.priceInCents/100).toFixed(2).replace(".00","")+" €");seen.set(item.courseSlug,entry);}
 return Array.from(seen.entries()).map(([slug,items])=>slug+": "+Array.from(items).join(" | ")).join("\n");
}
async function authenticatedUser(req:NextRequest){
 const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
 const supabase=getSupabase();
 if(!token)return {user:null,supabase};
 const {data}=await supabase.auth.getUser(token);
 return {user:data.user||null,supabase};
}
async function courseAccess(req:NextRequest,courseSlug:string){
 const {user,supabase}=await authenticatedUser(req);
 if(!user)return {allowed:false,user:null,supabase,reason:"authentication_required"};
 if(isCourseAdministrator(user.email))return {allowed:true,user,supabase,reason:"administrator"};
 if(!courseSlug)return {allowed:false,user,supabase,reason:"course_required"};
 const now=new Date().toISOString();
 const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",user.id).eq("course_slug",courseSlug).in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
 return {allowed:Boolean(enrollment),user,supabase,reason:enrollment?"enrollment":"matriculation_required"};
}
async function secretaryAnswer(req:NextRequest){
 const {user,supabase}=await authenticatedUser(req);
 if(!user)return "Secretaría atiende pagos, matrículas, justificantes y facturas. Para consultar una compra concreta debes iniciar sesión con la cuenta vinculada a la matrícula.";
 const {data:invoices}=await supabase.from("base12_invoices").select("invoice_number,description,total_amount_cents,currency").eq("user_id",user.id).order("issued_at",{ascending:false}).limit(5);
 const {data:enrollments}=await supabase.from("course_enrollments").select("course_slug,plan_slug,status").eq("user_id",user.id).order("created_at",{ascending:false}).limit(10);
 const inv=((invoices||[]) as {invoice_number:unknown;description:unknown;total_amount_cents:unknown;currency:unknown}[]).map((i)=>String(i.invoice_number)+": "+String(i.description)+" · "+(Number(i.total_amount_cents||0)/100).toFixed(2)+" "+String(i.currency||"EUR")).join("; ");
 const enr=((enrollments||[]) as {course_slug:unknown;plan_slug:unknown;status:unknown}[]).map((e)=>String(e.course_slug)+" · "+String(e.plan_slug)+" · "+String(e.status)).join("; ");
 return "Secretaría ha consultado tu cuenta. Matrículas: "+(enr||"no constan matrículas accesibles")+". Facturas recientes: "+(inv||"no constan facturas emitidas")+".";
}
async function progressContext(req:NextRequest,courseSlug:string){
 const {user,supabase}=await authenticatedUser(req);if(!user||!courseSlug)return "";
 const {data:events}=await supabase.from("course_learning_events").select("content_id,event_type,progress_percent,metadata,occurred_at").eq("user_id",user.id).eq("course_slug",courseSlug).order("occurred_at",{ascending:false}).limit(100);
 type ProgressEvent={content_id:string;event_type:string;progress_percent:number|null;metadata:Record<string,unknown>|null;occurred_at:string};
 const eventRows=(events||[]) as ProgressEvent[];
 const assessments=eventRows.filter((e:ProgressEvent)=>e.event_type==="assessment_submitted");const scored=assessments.filter((e:ProgressEvent)=>typeof e.progress_percent==="number");
 const avg=scored.length?Math.round(scored.reduce((s:number,e:ProgressEvent)=>s+Number(e.progress_percent||0),0)/scored.length):null;
 return "Progreso registrado: "+assessments.length+" entregas; "+scored.length+" valoradas"+(avg==null?"":"; media orientativa "+avg+"%")+". Últimos resultados: "+assessments.slice(0,8).map((e:ProgressEvent)=>String(e.content_id)+" "+(e.progress_percent==null?"sin puntuación":String(e.progress_percent)+"%")+" "+String(e.metadata?.feedback||"")).join(" | ");
}
async function studyPlanContext(req:NextRequest,courseSlug:string){
 const {user,supabase}=await authenticatedUser(req);if(!user||!courseSlug)return "";const now=new Date().toISOString();
 const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",user.id).eq("course_slug",courseSlug).in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
 if(!enrollment)return "";
 const {data:plan}=await supabase.from("study_plans").select("study_days,study_time,session_duration_minutes,exam_date,exam_place,objective").eq("user_id",user.id).eq("enrollment_id",enrollment.id).maybeSingle();
 if(!plan)return "No hay plan de estudio guardado todavía.";
 return "Plan actual: días "+((plan.study_days||[]) as string[]).join(", ")+"; horario "+String(plan.study_time||"no indicado")+"; sesión "+String(plan.session_duration_minutes||"no indicada")+" minutos; examen "+String(plan.exam_date||"no indicado")+"; objetivo "+String(plan.objective||"no indicado")+".";
}
async function aiAnswer(role:Role,message:string,entryPoint:EntryPoint,courseSlug:string,contextTitle:string,history:{from:string;text:string;role?:string}[],req:NextRequest){
 if(!process.env.OPENAI_API_KEY)return "Ahora mismo el asistente IA no está disponible.";
 let roleInstruction="";let privateContext="";
 if(role==="rocio")roleInstruction="Actúas como Rocío, Profesora IA de Base12 Academy. Enseñas y explicas contenidos, procedimientos y errores. No amplíes innecesariamente el temario.";
 else if(role==="fernando"){roleInstruction="Actúas como Fernando, Tutor IA de Base12 Academy. Organizas el estudio, haces seguimiento, detectas interrupciones y propones repasos y recuperación usando el progreso real del alumno.";privateContext=(await studyPlanContext(req,courseSlug))+"\n"+(await progressContext(req,courseSlug));}
 else if(role==="commercial"){roleInstruction="Actúas como el área Comercial de Base12 Academy. Informas sobre cursos, modalidades, precios, contratación y descuentos únicamente con los datos proporcionados. No inventes promociones.";privateContext=courseCatalogSummary();}
 else if(role==="jefatura"){roleInstruction="Actúas como Jefatura de Estudios de Base12 Academy. Resuelves organización académica, itinerarios y compatibilidad entre cursos. No inventes condiciones.";privateContext=courseCatalogSummary();}
 else if(role==="direccion")return "Tu consulta requiere revisión de Dirección Académica. La conversación puede recoger aquí los datos necesarios, pero la decisión o respuesta que corresponda a Dirección debe realizarla una persona del equipo; no voy a presentarme como si fuera esa persona.";
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const system=roleInstruction+"\nEl alumno ha entrado por el punto visible "+entryPoint+". La respuesta debe aparecer en ese mismo chat; no le pidas abrir otro asistente.\nCurso actual: "+(courseSlug||"no especificado")+".\nContexto visible: "+(contextTitle||"no especificado")+".\n"+privateContext+"\nResponde en español con claridad y sin inventar datos.";
 const prior=history.slice(-8).map(item=>({role:item.from==="user"?"user" as const:"assistant" as const,content:String(item.text||"").slice(0,2500)}));
 const response=await client.responses.create({model:"gpt-4.1-mini",input:[{role:"system",content:system},...prior,{role:"user",content:message}]});
 return response.output_text||"No he podido generar una respuesta.";
}
export async function POST(req:NextRequest){
 const body=await req.json().catch(()=>({}));
 const raw=String(body.entryPoint||"commercial");
 const entryPoint:EntryPoint=raw==="rocio"?"rocio":raw==="fernando"?"fernando":"commercial";
 const message=String(body.message||body.mensaje||"").trim().slice(0,2500);
 const community=String(body.community||body.comunidad||"").trim().slice(0,100);
 const courseSlug=String(body.courseSlug||"").trim().slice(0,100);
 const contextTitle=String(body.contextTitle||"").trim().slice(0,500);
 const history=Array.isArray(body.history)?body.history.slice(-8).map((item:Record<string,unknown>)=>({from:String(item.from||""),text:String(item.text||"").slice(0,2500),role:String(item.role||"")})):[];
 if(!message)return NextResponse.json({error:"invalid_request"},{status:400});

 if(entryPoint==="rocio"||entryPoint==="fernando"){
   const access=await courseAccess(req,courseSlug);
   if(!access.allowed)return NextResponse.json({error:access.reason},{status:access.reason==="authentication_required"?401:403});
 }

 const role=classify(message,entryPoint);
 if(entryPoint==="commercial"&&(role==="rocio"||role==="fernando")){
   const access=await courseAccess(req,courseSlug);
   if(!access.allowed)return NextResponse.json({answer:"Puedo orientarte desde aquí, pero para consultar contenido académico, progreso o planificación de un curso concreto necesitas iniciar sesión y tener acceso activo a ese curso.",role,entryPoint});
 }

 try{
   const answer=role==="secretaria"?await secretaryAnswer(req):role==="commercial"?commercialAnswer(message,community):await aiAnswer(role,message,entryPoint,courseSlug,contextTitle,history,req);
   return NextResponse.json({answer,role,entryPoint});
 }catch(error){
   console.error("Base12 assistant error",error);
   return NextResponse.json({error:"assistant_unavailable"},{status:503});
 }
}