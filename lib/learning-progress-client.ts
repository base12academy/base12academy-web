import { supabase } from "@/lib/supabaseClient";

export type AssessmentSubmission={courseSlug:string;contentId:string;activityType:string;prompt:string;answer:string;attemptId?:string;group?:string;unit?:string};

export async function submitAssessment(payload:AssessmentSubmission){
  const {data}=await supabase.auth.getSession();
  const token=data.session?.access_token;
  const response=await fetch("/api/assessment-submit",{method:"POST",headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:JSON.stringify(payload)});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||"assessment_failed");
  return result as {ok:boolean;score:number|null;feedback:string;gradingMode:string;expectedAnswer?:string;rubric?:string;correctAnswer?:string};
}