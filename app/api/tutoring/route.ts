import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";

async function auth(req: NextRequest) { const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,""); if(!token)return null; const supabase=getSupabase(); const {data}=await supabase.auth.getUser(token); return data.user?{supabase,user:data.user}:null; }
export async function GET(req: NextRequest) {
  const ctx=await auth(req); if(!ctx)return NextResponse.json({error:"unauthorized"},{status:401}); const course=String(req.nextUrl.searchParams.get("course")||""); const now=new Date().toISOString();
  const {data: enrollment}=await ctx.supabase.from("course_enrollments").select("id,plan_slug").eq("user_id",ctx.user.id).eq("course_slug",course).eq("plan_slug","premium").eq("status","active").lte("starts_at",now).or(`expires_at.is.null,expires_at.gte.${now}`).limit(1).maybeSingle();
  if(!enrollment&&!isCourseAdministrator(ctx.user.email))return NextResponse.json({error:"premium_required"},{status:403});
  const {data:slots}=await ctx.supabase.from("tutoring_slots").select("id,starts_at,ends_at,status").eq("status","available").gte("starts_at",now).order("starts_at").limit(80);
  const {data:bookings}=await ctx.supabase.from("tutoring_bookings").select("id,slot_id,status,student_name,theme_id,subject,tutoring_slots(starts_at,ends_at)").eq("user_id",ctx.user.id).eq("course_slug",course).eq("status","booked");
  return NextResponse.json({slots:slots||[],bookings:bookings||[]});
}
export async function POST(req: NextRequest) {
  const ctx=await auth(req); if(!ctx)return NextResponse.json({error:"unauthorized"},{status:401}); const body=await req.json().catch(()=>({})); const course=String(body.courseSlug||""); const slotId=String(body.slotId||""); const studentName=String(body.studentName||"").trim(); const themeId=String(body.themeId||"").trim(); const subject=String(body.subject||"").trim(); const now=new Date().toISOString();
  if(studentName.length<2||studentName.length>120||!/^T\d{2,3}$/.test(themeId)||subject.length<5||subject.length>1000)return NextResponse.json({error:"booking_details_required"},{status:400});
  const {data:e}=await ctx.supabase.from("course_enrollments").select("id").eq("user_id",ctx.user.id).eq("course_slug",course).eq("plan_slug","premium").eq("status","active").lte("starts_at",now).or(`expires_at.is.null,expires_at.gte.${now}`).limit(1).maybeSingle(); if(!e)return NextResponse.json({error:"premium_required"},{status:403});
  const {data:slot}=await ctx.supabase.from("tutoring_slots").select("id,starts_at").eq("id",slotId).eq("status","available").gte("starts_at",now).single(); if(!slot)return NextResponse.json({error:"slot_unavailable"},{status:409});
  const d=new Date(slot.starts_at); const monday=new Date(d); monday.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7)); monday.setUTCHours(0,0,0,0); const sunday=new Date(monday); sunday.setUTCDate(monday.getUTCDate()+7);
  const {data:existing}=await ctx.supabase.from("tutoring_bookings").select("id,tutoring_slots!inner(starts_at)").eq("enrollment_id",e.id).eq("status","booked").gte("tutoring_slots.starts_at",monday.toISOString()).lt("tutoring_slots.starts_at",sunday.toISOString()).limit(1); if(existing?.length)return NextResponse.json({error:"weekly_limit"},{status:409});
  const {data,error}=await ctx.supabase.from("tutoring_bookings").insert({slot_id:slotId,enrollment_id:e.id,user_id:ctx.user.id,course_slug:course,student_name:studentName,theme_id:themeId,subject}).select("id").single(); if(error)return NextResponse.json({error:"slot_unavailable"},{status:409}); return NextResponse.json({booking:data});
}
export async function DELETE(req: NextRequest) { const ctx=await auth(req); if(!ctx)return NextResponse.json({error:"unauthorized"},{status:401}); const id=String(req.nextUrl.searchParams.get("id")||""); await ctx.supabase.from("tutoring_bookings").update({status:"cancelled",updated_at:new Date().toISOString()}).eq("id",id).eq("user_id",ctx.user.id).eq("status","booked"); return NextResponse.json({ok:true}); }
