import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import { getMatematicasAplicadasEntitlement } from "@/lib/matematicas-aplicadas-ccss/entitlement";
import { getMatematicasAplicadasUnit } from "@/lib/matematicas-aplicadas-ccss/content";
import { getRocioQuestions, getShortQuestions } from "@/lib/matematicas-aplicadas-ccss/evaluation";
import { getPauProblems, MATEMATICAS_APLICADAS_PAU_PROFILES } from "@/lib/matematicas-aplicadas-ccss/pau";
import { getPauSimulation } from "@/lib/matematicas-aplicadas-ccss/pau-simulations";

const PREVIEW_UNIT="T01";
async function access(req:NextRequest){
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return {authenticated:false,administrator:false,hasCourse:false,hasPau:false};
  const supabase=getSupabase(); const {data,error}=await supabase.auth.getUser(token);
  if(error||!data.user)return {authenticated:false,administrator:false,hasCourse:false,hasPau:false};
  if(isCourseAdministrator(data.user.email))return {authenticated:true,administrator:true,hasCourse:true,hasPau:true};
  const now=new Date().toISOString();
  const {data:enrollments,error:enrollmentError}=await supabase.from("course_enrollments").select("plan_slug,expires_at").eq("user_id",data.user.id).eq("course_slug","matematicas-aplicadas-ccss").eq("status","active").lte("starts_at",now);
  if(enrollmentError)return {authenticated:true,administrator:false,hasCourse:false,hasPau:false,error:true};
  const plans=(enrollments||[]).filter(i=>!i.expires_at||i.expires_at>=now).map(i=>i.plan_slug);
  return {authenticated:true,administrator:false,...getMatematicasAplicadasEntitlement(plans)};
}
function denied(a:{authenticated:boolean}){return NextResponse.json({error:a.authenticated?"matriculation_required":"authentication_required"},{status:a.authenticated?403:401});}
export async function GET(req:NextRequest){
  const type=req.nextUrl.searchParams.get("type"); const a=await access(req);
  if("error" in a&&a.error)return NextResponse.json({error:"access_check_failed"},{status:500});
  if(type==="problems"){if(!a.administrator&&!a.hasPau)return denied(a);const block=req.nextUrl.searchParams.get("block")||undefined;const items=getPauProblems(block);return NextResponse.json({type,block:block||null,count:items.length,items});}
  if(type==="profiles"){if(!a.administrator&&!a.hasPau)return denied(a);return NextResponse.json({type,count:MATEMATICAS_APLICADAS_PAU_PROFILES.length,items:MATEMATICAS_APLICADAS_PAU_PROFILES});}
  if(type==="simulation"){if(!a.administrator&&!a.hasPau)return denied(a);const code=(req.nextUrl.searchParams.get("code")||"").toUpperCase();const simulation=getPauSimulation(code);if(!simulation)return NextResponse.json({error:"invalid_community"},{status:404});return NextResponse.json({type,simulation});}
  if(type!=="rocio"&&type!=="short")return NextResponse.json({error:"invalid_request"},{status:400});
  const unit=req.nextUrl.searchParams.get("unit")||"";
  if(!getMatematicasAplicadasUnit(unit))return NextResponse.json({error:"invalid_unit"},{status:400});
  const preview=unit===PREVIEW_UNIT;
  if(!preview&&!a.administrator&&!a.hasCourse&&!a.hasPau)return denied(a);
  const items=type==="rocio"?getRocioQuestions(unit):getShortQuestions(unit);
  return NextResponse.json({type,unit,preview,count:items.length,items});
}
