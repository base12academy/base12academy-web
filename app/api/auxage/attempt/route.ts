import {NextRequest,NextResponse} from "next/server";
import {COURSE,access,resource,Theme,Resources,Question} from "@/lib/auxage/server";
export async function POST(req:NextRequest){
 try{
  const ctx=await access(req);if(!ctx.allowed)return NextResponse.json({error:"subscription_required"},{status:403});
  const body=await req.json().catch(()=>null);
  if(!body||!Array.isArray(body.answers)||body.answers.length<1||body.answers.length>50)return NextResponse.json({error:"invalid_attempt"},{status:400});
  const mode=String(body.mode||"theme");const theme=String(body.theme||"T01");
  if(!["theme","simulation","psychometric"].includes(mode))return NextResponse.json({error:"invalid_mode"},{status:400});
  if(ctx.plan==="esencial"&&(mode!=="theme"||(theme!=="T01"&&body.answers.length>10)))return NextResponse.json({error:"standard_required"},{status:403});
  let questions:Question[]=[];
  if(mode==="theme"){
   if(!/^T(?:0[1-9]|1[0-9]|2[0-8])$/.test(theme))return NextResponse.json({error:"invalid_theme"},{status:400});
   const t=await resource<Theme>(theme);questions=t?.tests.slice(0,ctx.plan==="esencial"&&theme!=="T01"?10:50)||[];
  }else{
   const r=await resource<Resources>("resources");questions=mode==="psychometric"?r?.psychometric||[]:r?.simulations.flat()||[];
   if(mode==="simulation"){
    const {data}=await ctx.db.from("opposition_materials").select("payload").eq("course_slug",COURSE).like("resource_id","T%");
    questions.push(...(data||[]).flatMap(v=>(v.payload as Theme).tests));
   }
  }
  const keys=new Map(questions.map(q=>[q.id,q]));const seen=new Set<string>();let correct=0,incorrect=0,blank=0;
  for(const a of body.answers){
   if(!a||typeof a.id!=="string"||seen.has(a.id)||!keys.has(a.id)||(a.selected!==null&&(!Number.isInteger(a.selected)||a.selected<0||a.selected>3)))return NextResponse.json({error:"invalid_answer"},{status:400});
   seen.add(a.id);if(a.selected===null)blank++;else if(keys.get(a.id)!.answer===a.selected)correct++;else incorrect++;
  }
  const total=body.answers.length;const metadata={correct,incorrect,blank,total,score:Math.round((correct-incorrect/3)*100)/100,type:mode,plan:ctx.plan,questionIds:[...seen]};
  if(ctx.enrollment){
   const {error}=await ctx.db.from("course_learning_events").insert({user_id:ctx.user!.id,enrollment_id:ctx.enrollment.id,course_slug:COURSE,content_id:mode==="theme"?theme:mode,event_type:"assessment_submitted",progress_percent:Math.round(correct/total*100),metadata,occurred_at:new Date().toISOString()});
   if(error)return NextResponse.json({error:"attempt_not_saved"},{status:503});
  }
  return NextResponse.json({ok:true,...metadata,saved:!!ctx.enrollment});
 }catch{return NextResponse.json({error:"attempt_unavailable"},{status:503});}
}
