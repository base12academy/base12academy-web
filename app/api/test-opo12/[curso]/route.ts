import {NextResponse} from "next/server";
import {getSupabase} from "@/lib/supabase/server";
import {testProgram,testProduct} from "@/lib/test-opo12/catalog";
import {present,correct,type Entry} from "@/lib/test-opo12/grading";
import {initialPayment} from "@/lib/test-opo12/payments";
export const dynamic="force-dynamic";
const json=(v:unknown,status=200)=>NextResponse.json(v,{status,headers:{"Cache-Control":"private, no-store"}});
type Args={params:Promise<{curso:string}>};
async function context(req:Request,ctx:Args){
 const {curso}=await ctx.params;const db=getSupabase();
 const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
 const user=token?(await db.auth.getUser(token)).data.user:null;
 return {db,user,curso,valid:!!testProgram(curso)};
}
export async function GET(req:Request,ctx:Args){
 const {db,user,curso,valid}=await context(req,ctx);if(!valid)return json({},404);if(!user)return json({signedIn:false});
 const url=new URL(req.url),page=Math.max(0,Number(url.searchParams.get("page"))||0);
 const now=new Date().toISOString();
 const [en,premium,sub,at]=await Promise.all([
  db.from("course_enrollments").select("starts_at,expires_at").eq("user_id",user.id).eq("course_slug",testProduct(curso)).eq("plan_slug","mensual").eq("status","active").gt("expires_at",now).maybeSingle(),
  db.from("course_enrollments").select("starts_at,expires_at").eq("user_id",user.id).eq("course_slug",curso).eq("plan_slug","premium").eq("status","active").lte("starts_at",now).or(`expires_at.is.null,expires_at.gt.${now}`).limit(1).maybeSingle(),
  db.from("test_opo12_subscriptions").select("state,renew,period_end").eq("student",user.id).eq("course",curso).maybeSingle(),
  db.from("test_opo12_attempts").select("id,title,kind,started_at,finished_at").eq("student",user.id).eq("course",curso).order("started_at",{ascending:false}).range(page*15,page*15+15)]);
 if(en.error||premium.error||sub.error||at.error)return json({error:"service_unavailable"},503);
 return json({signedIn:true,access:(!!en.data&&en.data.starts_at<=now)||!!premium.data,enrollment:en.data,subscription:sub.data,events:at.data.slice(0,15),more:at.data.length>15});
}
export async function POST(req:Request,ctx:Args){
 const {db,user,curso,valid}=await context(req,ctx);if(!valid)return json({},404);if(!user)return json({error:"login_required"},401);
 const body=await req.json().catch(()=>null);if(!body)return json({error:"invalid_request"},400);
 if(body.action==="checkout")return initialPayment(user.id,curso,body);
 const id=String(body.id||"");if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return json({error:"invalid_request"},400);
 if(body.action==="start"){
  const r=await db.rpc("test_opo12_start",{p_student:user.id,p_course:curso,p_kind:body.kind,p_set:body.set,p_request:id});
  if(r.error){const msg=r.error.message;return msg.includes("daily_limit")?json({error:"daily_limit"},429):msg.includes("subscription_required")?json({error:"subscription_required"},403):json({error:"start_failed"},409);}
 }
 const {data:row,error}=await db.from("test_opo12_attempts").select("id,title,items,settings,started_at,finished_at,result").eq("student",user.id).eq("course",curso).eq("id",id).maybeSingle();
 if(error||!row)return json({error:"attempt_not_found"},404);
 const task={id:row.id,title:row.title,questions:present(row.items as Entry[]),settings:row.settings,startedAt:row.started_at};
 if(row.finished_at)return json({task,result:row.result});
 if(body.action!=="start"){
  const now=new Date().toISOString();
  const [en,premium]=await Promise.all([
   db.from("course_enrollments").select("id").eq("user_id",user.id).eq("course_slug",testProduct(curso)).eq("plan_slug","mensual").eq("status","active").lte("starts_at",now).gt("expires_at",now).maybeSingle(),
   db.from("course_enrollments").select("id").eq("user_id",user.id).eq("course_slug",curso).eq("plan_slug","premium").eq("status","active").lte("starts_at",now).or(`expires_at.is.null,expires_at.gt.${now}`).limit(1).maybeSingle(),
  ]);
  if(en.error||premium.error)return json({error:"service_unavailable"},503);
  if(!en.data&&!premium.data)return json({error:"subscription_required"},403);
 }
 if(body.action==="start"||body.action==="resume")return json({task});
 if(body.action!=="finish")return json({error:"invalid_request"},400);
 let result;try{result=correct(row.items,body.answers,row.settings)}catch{return json({error:"invalid_answers"},400)}
 const r=await db.from("test_opo12_attempts").update({result,finished_at:new Date().toISOString()}).eq("student",user.id).eq("id",id).is("finished_at",null).select("result").maybeSingle();
 if(r.error)return json({error:"save_failed"},503);
 if(r.data)return json({task,result:r.data.result});
 const prior=await db.from("test_opo12_attempts").select("result").eq("student",user.id).eq("id",id).single();
 return prior.error?json({error:"save_failed"},503):json({task,result:prior.data.result});
}
