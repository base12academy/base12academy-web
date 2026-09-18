import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

const ALLOWED_COURSES = new Set(["matematicas-aplicadas-ccss","matematicas-ii","historia-espana","historia-filosofia"]);

export async function GET(req:NextRequest){
  const courseSlug=String(req.nextUrl.searchParams.get("course")||"");
  if(!ALLOWED_COURSES.has(courseSlug))return NextResponse.json({error:"invalid_course"},{status:400});
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return NextResponse.json({error:"authentication_required"},{status:401});
  const supabase=getSupabase(); const {data}=await supabase.auth.getUser(token);
  if(!data.user)return NextResponse.json({error:"authentication_required"},{status:401});
  const {data:events,error}=await supabase.from("course_learning_events").select("content_id,event_type,progress_percent,metadata,occurred_at").eq("user_id",data.user.id).eq("course_slug",courseSlug).order("occurred_at",{ascending:false}).limit(1000);
  if(error)return NextResponse.json({error:"progress_load_failed"},{status:500});
  const all=events||[];
  const assessments=all.filter((e:any)=>e.event_type==="assessment_submitted");
  const scored=assessments.filter((e:any)=>typeof e.progress_percent==="number");
  const average=scored.length?Math.round(scored.reduce((sum:number,e:any)=>sum+Number(e.progress_percent||0),0)/scored.length):null;
  const recent=assessments.slice(0,12).map((e:any)=>({contentId:e.content_id,score:e.progress_percent,activityType:e.metadata?.activityType||"practice",unit:e.metadata?.unit||"",feedback:e.metadata?.feedback||"",occurredAt:e.occurred_at}));
  const byType:Record<string,{attempts:number;scored:number;total:number}>={};
  for(const e of assessments as any[]){const key=String(e.metadata?.activityType||"practice");if(!byType[key])byType[key]={attempts:0,scored:0,total:0};byType[key].attempts++;if(typeof e.progress_percent==="number"){byType[key].scored++;byType[key].total+=Number(e.progress_percent||0);}}
  const breakdown=Object.entries(byType).map(([type,v])=>({type,attempts:v.attempts,average:v.scored?Math.round(v.total/v.scored):null}));
  return NextResponse.json({courseSlug,events:all.length,assessments:assessments.length,scored:scored.length,average,recent,breakdown});
}