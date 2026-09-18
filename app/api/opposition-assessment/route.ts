import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import administrativo from "@/lib/administrativo-ja-content.json";
import auxiliar from "@/lib/auxiliar-administrativo-ja-content.json";

const courses={"administrativo-ja":administrativo,"auxiliar-administrativo-ja":auxiliar} as const;

function questionId(themeId:string,index:number){return themeId+"-Q"+String(index+1).padStart(2,"0");}

async function access(req:NextRequest,courseSlug:string){
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return {user:null,enrollment:null,administrator:false,supabase:getSupabase()};
  const supabase=getSupabase();
  const {data}=await supabase.auth.getUser(token);
  if(!data.user)return {user:null,enrollment:null,administrator:false,supabase};
  if(isCourseAdministrator(data.user.email))return {user:data.user,enrollment:null,administrator:true,supabase};
  const now=new Date().toISOString();
  const {data:enrollment}=await supabase.from("course_enrollments").select("id,plan_slug").eq("user_id",data.user.id).eq("course_slug",courseSlug).in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
  return {user:data.user,enrollment:enrollment||null,administrator:false,supabase};
}

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>({}));
  const courseSlug=String(body.courseSlug||"").toLowerCase();
  const themeId=String(body.themeId||"").toUpperCase();
  const mode=String(body.mode||"question");
  const course=courses[courseSlug as keyof typeof courses];
  if(!course)return NextResponse.json({error:"course_not_found"},{status:404});
  const theme=course.themes.find(item=>item.id===themeId);
  if(!theme)return NextResponse.json({error:"theme_not_found"},{status:404});
  const ctx=await access(req,courseSlug);
  const allowed=theme.publicPreview||ctx.administrator||Boolean(ctx.enrollment);
  if(!allowed)return NextResponse.json({error:ctx.user?"matriculation_required":"authentication_required"},{status:ctx.user?403:401});

  if(mode==="question"){
    const id=String(body.questionId||"");
    const index=theme.tests.findIndex((_,idx)=>questionId(themeId,idx)===id);
    const selected=Number(body.selected);
    if(index<0||!Number.isInteger(selected)||selected<0||selected>3)return NextResponse.json({error:"invalid_submission"},{status:400});
    const question=theme.tests[index];
    const correct=selected===Number(question.answer);
    return NextResponse.json({ok:true,correct,correctAnswer:Number(question.answer),explanation:String(question.explanation||"")});
  }

  if(mode==="attempt"){
    if(!ctx.user||(!ctx.enrollment&&!ctx.administrator))return NextResponse.json({error:"authentication_required"},{status:401});
    if(!ctx.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
    const answers=body.answers&&typeof body.answers==="object"?body.answers as Record<string,number>:{};
    const entries=Object.entries(answers);
    if(!entries.length)return NextResponse.json({error:"invalid_submission"},{status:400});
    let correct=0;
    let total=0;
    const details:{questionId:string;selected:number;correct:boolean}[]=[];
    for(const [id,raw] of entries){
      const index=theme.tests.findIndex((_,idx)=>questionId(themeId,idx)===id);
      const selected=Number(raw);
      if(index<0||!Number.isInteger(selected)||selected<0||selected>3)continue;
      total++;
      const ok=selected===Number(theme.tests[index].answer);
      if(ok)correct++;
      details.push({questionId:id,selected,correct:ok});
    }
    if(!total)return NextResponse.json({error:"invalid_submission"},{status:400});
    const score=Math.round(correct/total*100);
    const now=new Date().toISOString();
    const {error}=await ctx.supabase.from("course_learning_events").insert({
      user_id:ctx.user.id,
      enrollment_id:ctx.enrollment.id,
      course_slug:courseSlug,
      content_id:themeId,
      event_type:"assessment_submitted",
      progress_percent:score,
      metadata:{activityType:"opposition_test",correct,total,plan:String(ctx.enrollment.plan_slug||""),details},
      occurred_at:now,
    });
    if(error)return NextResponse.json({error:"progress_not_saved"},{status:500});
    return NextResponse.json({ok:true,score,correct,total});
  }
  return NextResponse.json({error:"invalid_request"},{status:400});
}
