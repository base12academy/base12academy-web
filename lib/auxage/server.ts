import "server-only";
import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";

export const COURSE = "auxiliar-administrativo-estado";
export type Question = { id:string; question:string; options:string[]; answer:number; explanation:string; topicCode?:string };
export type Theme = { id:string; code:string; number:number; title:string; blocks:{type:string;text:string}[]; glossary:{term:string;definition:string}[]; rocio:{question:string;answer:string}[]; tests:Question[]; publicPreview:boolean; studyEdition:string };
export type Resources = { glossary:{term:string;definition:string;topics:string[]}[]; simulations:Question[][]; psychometric:(Question&{category:string})[] };

export async function access(req:NextRequest) {
  const db=getSupabase();
  const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return {db,user:null,enrollment:null,administrator:false,plan:"esencial",allowed:false};
  const {data,error}=await db.auth.getUser(token);
  if(error||!data.user)return {db,user:null,enrollment:null,administrator:false,plan:"esencial",allowed:false};
  const administrator=isCourseAdministrator(data.user.email);
  if(administrator)return {db,user:data.user,enrollment:null,administrator,plan:"premium",allowed:true};
  const now=new Date().toISOString();
  const {data:rows,error:enrollmentError}=await db.from("course_enrollments").select("id,plan_slug")
    .eq("user_id",data.user.id).eq("course_slug",COURSE).eq("status","active").lte("starts_at",now)
    .or(`expires_at.is.null,expires_at.gte.${now}`);
  const rank:Record<string,number>={esencial:1,estandar:2,standard:2,premium:3};
  const enrollment=(rows||[]).sort((a,b)=>(rank[b.plan_slug]||0)-(rank[a.plan_slug]||0))[0]||null;
  return {db,user:data.user,enrollment,administrator:false,plan:enrollment?.plan_slug||"esencial",allowed:!enrollmentError&&!!enrollment};
}
export async function resource<T>(id:string):Promise<T|null> {
  const {data,error}=await getSupabase().from("opposition_materials").select("payload").eq("course_slug",COURSE).eq("resource_id",id).maybeSingle();
  if(error)throw new Error("course_material_unavailable");
  return data?.payload as T||null;
}
export function sample<T>(values:T[],n:number):T[]{
  const copy=[...values];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy.slice(0,n);
}
