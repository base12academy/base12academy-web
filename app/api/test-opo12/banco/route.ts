import {getRedsysCredentials} from "@/lib/redsys";
import {settleNotice} from "@/lib/test-opo12/payments";
export const dynamic="force-dynamic";
export async function POST(req:Request){
 try{const f=await req.formData();await settleNotice({Ds_SignatureVersion:String(f.get("Ds_SignatureVersion")||""),Ds_MerchantParameters:String(f.get("Ds_MerchantParameters")||""),Ds_Signature:String(f.get("Ds_Signature")||"")},getRedsysCredentials());return new Response("OK");}
 catch(e){return new Response("Notificación pendiente de validación",{status:e instanceof Error&&e.message==="settlement_failed"?503:400});}
}
