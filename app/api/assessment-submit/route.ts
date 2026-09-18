import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";

const ALLOWED_COURSES = new Set(["matematicas-aplicadas-ccss","matematicas-ii","historia-espana","historia-filosofia"]);

async function context(req: NextRequest, courseSlug: string) {
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return null;
  const supabase=getSupabase();
  const {data}=await supabase.auth.getUser(token);
  if(!data.user)return null;
  const now=new Date().toISOString();
  const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",data.user.id).eq("course_slug",courseSlug).in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
  return {supabase,user:data.user,enrollment:enrollment||null,administrator:isCourseAdministrator(data.user.email)};
}

function clamp(n:number){return Math.max(0,Math.min(100,Math.round(n)));}

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>({}));
  const courseSlug=String(body.courseSlug||"");
  const contentId=String(body.contentId||"").slice(0,180);
  const activityType=String(body.activityType||"practice").slice(0,80);
  const prompt=String(body.prompt||"").slice(0,6000);
  const answer=String(body.answer||"").trim().slice(0,12000);
  const expected=String(body.expectedAnswer||"").slice(0,12000);
  const rubric=String(body.rubric||"").slice(0,12000);
  if(!ALLOWED_COURSES.has(courseSlug)||!contentId||!answer)return NextResponse.json({error:"invalid_request"},{status:400});
  const ctx=await context(req,courseSlug);
  if(!ctx)return NextResponse.json({error:"authentication_required"},{status:401});
  if(!ctx.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});

  let score:number|null=null;
  let feedback="Respuesta entregada. Revisa después la pauta y compara tu procedimiento.";
  let gradingMode="recorded";

  if(typeof body.correct==="boolean"){
    score=body.correct?100:0;
    feedback=body.correct?String(body.feedback||"Respuesta correcta."):String(body.feedback||"Revisa el procedimiento y vuelve a intentarlo.");
    gradingMode="closed";
  } else if(process.env.OPENAI_API_KEY && (expected||rubric)) {
    try {
      const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
      const instruction="Evalúa una respuesta de alumno de Bachillerato de forma formativa. Devuelve SOLO JSON válido con score de 0 a 100 y feedback breve en español. Valora el procedimiento y el contenido según la respuesta esperada y la rúbrica. No penalices diferencias de redacción si la idea matemática, histórica o filosófica es correcta.";
      const userText="PREGUNTA:\n"+prompt+"\n\nRESPUESTA DEL ALUMNO:\n"+answer+"\n\nRESPUESTA ESPERADA / ORIENTATIVA:\n"+expected+"\n\nRÚBRICA:\n"+rubric;
      const response=await client.responses.create({model:"gpt-4.1-mini",input:[{role:"system",content:instruction},{role:"user",content:userText}]});
      const raw=response.output_text||"";
      const match=raw.match(/\{[\s\S]*\}/);
      const parsed=match?JSON.parse(match[0]):null;
      if(parsed&&Number.isFinite(Number(parsed.score))){score=clamp(Number(parsed.score));feedback=String(parsed.feedback||feedback).slice(0,3000);gradingMode="ai_formative";}
    } catch(error) { console.error("assessment grading failed",error); }
  }

  const now=new Date().toISOString();
  const metadata={activityType,prompt,answer,feedback,gradingMode,attemptId:String(body.attemptId||""),group:String(body.group||""),unit:String(body.unit||"")};
  const {error}=await ctx.supabase.from("course_learning_events").insert({user_id:ctx.user.id,enrollment_id:ctx.enrollment.id,course_slug:courseSlug,content_id:contentId,event_type:"assessment_submitted",progress_percent:score,metadata,occurred_at:now});
  if(error){console.error("assessment save failed",error);return NextResponse.json({error:"progress_not_saved"},{status:500});}
  return NextResponse.json({ok:true,score,feedback,gradingMode});
}