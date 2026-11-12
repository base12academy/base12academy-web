import "server-only";
import {createHmac} from "crypto";
import {NextRequest} from "next/server";
import {getSupabase} from "@/lib/supabase/server";

export async function reservePublicRocioTurn(req:NextRequest,course:string){
 const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
 const ip=(req.headers.get("x-vercel-forwarded-for")||req.headers.get("x-forwarded-for")||"").split(",")[0].trim();
 if(!secret||!ip)return {ok:false,retryAfter:0};
 const ipHash=createHmac("sha256",secret).update(`rocio-preview:${ip}`).digest("hex");
 const {data,error}=await getSupabase().rpc("claim_opposition_preview_turn",{p_ip_hash:ipHash,p_course_slug:course});
 return {ok:!error&&data===0,retryAfter:error?0:Number(data)||0};
}
