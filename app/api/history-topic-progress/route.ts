import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { temasHistoria } from "@/lib/temas";

function numericTheme(slug:string){const m=slug.match(/^tema-(\d+)$/);return m?Number(m[1]):null;}

export async function GET(req:NextRequest){
  const slug=String(req.nextUrl.searchParams.get("tema")||"");
  const index=temasHistoria.findIndex(item=>item.slug===slug);
  if(index<0)return NextResponse.json({error:"theme_not_found"},{status:404});
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return NextResponse.json({currentBest:0,previousBest:index===0?100:0});
  const supabase=getSupabase();const {data}=await supabase.auth.getUser(token);
  if(!data.user)return NextResponse.json({currentBest:0,previousBest:index===0?100:0});
  const prev=index>0?temasHistoria[index-1].slug:null;
  const ids=[slug,...(prev?[prev]:[])];
  const {data:events}=await supabase.from("course_learning_events").select("content_id,progress_percent").eq("user_id",data.user.id).eq("course_slug","historia-espana").eq("event_type","assessment_submitted").in("content_id",ids);
  const best=(id:string)=>Math.max(0,...(events||[]).filter(e=>e.content_id===id).map(e=>Number(e.progress_percent)||0));

  async function legacyBest(id:string|null){
    if(!id)return 100;
    const n=numericTheme(id);if(n==null)return 0;
    const [tests,shorts]=await Promise.all([
      supabase.from("intentos_test").select("score").eq("usuario_id",data.user!.id).eq("tema_id",n),
      supabase.from("intentos-cortas").select("score").eq("usuario_id",data.user!.id).eq("tema_id",n),
    ]);
    return Math.max(0,...(tests.data||[]).map(x=>Number(x.score)||0),...(shorts.data||[]).map(x=>Number(x.score)||0));
  }
  const currentBest=Math.max(best(slug),await legacyBest(slug));
  const previousBest=prev?Math.max(best(prev),await legacyBest(prev)):100;
  return NextResponse.json({currentBest,previousBest});
}
