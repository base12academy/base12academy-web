import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { parseSessionDuration, parseStudyDays } from "@/lib/fernando-telegram";

const ALLOWED = new Set(["matematicas-aplicadas-ccss","matematicas-ii","historia-espana","historia-filosofia"]);
async function ctx(req:NextRequest,course:string){
 const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,""); if(!token)return null;
 const supabase=getSupabase(); const {data}=await supabase.auth.getUser(token); if(!data.user)return null;
 const now=new Date().toISOString();
 const {data:enrollment}=await supabase.from("course_enrollments").select("id,plan_slug").eq("user_id",data.user.id).eq("course_slug",course).in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
 return {supabase,user:data.user,enrollment:enrollment||null};
}
export async function GET(req:NextRequest){
 const course=String(req.nextUrl.searchParams.get("course")||""); if(!ALLOWED.has(course))return NextResponse.json({error:"invalid_course"},{status:400});
 const c=await ctx(req,course); if(!c)return NextResponse.json({error:"authentication_required"},{status:401}); if(!c.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
 const {data,error}=await c.supabase.from("study_plans").select("study_days,study_time,session_duration_minutes,exam_date,exam_place,objective,reminder_30_minutes,reminder_5_minutes").eq("user_id",c.user.id).eq("enrollment_id",c.enrollment.id).maybeSingle();
 if(error)return NextResponse.json({error:"plan_load_failed"},{status:500}); return NextResponse.json({plan:data||null});
}
export async function POST(req:NextRequest){
 const body=await req.json().catch(()=>({})); const course=String(body.courseSlug||""); if(!ALLOWED.has(course))return NextResponse.json({error:"invalid_course"},{status:400});
 const c=await ctx(req,course); if(!c)return NextResponse.json({error:"authentication_required"},{status:401}); if(!c.enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});
 const studyDays=parseStudyDays(body.studyDays); const studyTime=String(body.studyTime||"").trim(); const duration=parseSessionDuration(body.sessionDurationMinutes??body.sessionDuration);
 if(!studyDays.length||!studyTime||!Number.isFinite(duration)||duration<=0)return NextResponse.json({error:"planning_required"},{status:400});
 const {error}=await c.supabase.from("study_plans").upsert({user_id:c.user.id,enrollment_id:c.enrollment.id,study_days:studyDays,study_time:studyTime,session_duration_minutes:Math.round(duration),exam_date:body.examDate?String(body.examDate):null,exam_place:String(body.examPlace||"").trim()||null,objective:String(body.objective||"").trim()||null,timezone:"Europe/Madrid",reminder_30_minutes:true,reminder_5_minutes:true,updated_at:new Date().toISOString()},{onConflict:"user_id,enrollment_id"});
 if(error)return NextResponse.json({error:"plan_save_failed"},{status:500}); return NextResponse.json({ok:true});
}