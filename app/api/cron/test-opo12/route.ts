import {renewDue} from "@/lib/test-opo12/payments";
export const dynamic="force-dynamic";
export async function GET(req:Request){
 if(!process.env.CRON_SECRET||req.headers.get("authorization")!=="Bearer "+process.env.CRON_SECRET)return new Response(null,{status:401});
 try{const result=await renewDue();return Response.json(result,{status:result.uncertain?503:200});}catch{return Response.json({error:"renewal_check_failed"},{status:503});}
}
