import "server-only";
import crypto from "node:crypto";
import {NextResponse} from "next/server";
import {getSupabase} from "@/lib/supabase/server";
import {createRedsysSignature,decodeMerchantParameters,getRedsysCredentials,safeEqual,type RedsysCredentials} from "@/lib/redsys";
import {testCoursePath} from "./catalog";

const version="HMAC_SHA256_V1";
const agreement="Autorizo el primer pago de 9,90 € y la renovación automática de 9,90 € cada mes para esta oposición hasta que cancele desde mi cuenta.";
const origin=()=>new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://base12academy.es").origin;
const bank=(cred:RedsysCredentials)=>cred.environment==="PROD"?"https://sis.redsys.es":"https://sis-t.redsys.es:25443";
const message=(error:string,status:number)=>NextResponse.json({error},{status,headers:{"Cache-Control":"no-store"}});

export function bankFields(order:string,cred:RedsysCredentials,extra:Record<string,string>){
 const payload={DS_MERCHANT_AMOUNT:"990",DS_MERCHANT_CURRENCY:"978",DS_MERCHANT_ORDER:order,DS_MERCHANT_MERCHANTCODE:cred.merchantCode,DS_MERCHANT_TERMINAL:cred.terminal,DS_MERCHANT_TRANSACTIONTYPE:"0",...extra};
 const packed=Buffer.from(JSON.stringify(payload),"utf8").toString("base64");
 return {Ds_SignatureVersion:version,Ds_MerchantParameters:packed,Ds_Signature:createRedsysSignature(packed,order,cred.signingKey)};
}
function vaultKey(cred:RedsysCredentials){
 return crypto.hkdfSync("sha256",Buffer.from(cred.signingKey,"base64"),Buffer.from(cred.merchantCode+"-"+cred.terminal),Buffer.from("BASE12 TEST OPO12 card-reference v1"),32);
}
export function protectReference(value:string,cred:RedsysCredentials){
 const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv("aes-256-gcm",Buffer.from(vaultKey(cred)),iv);
 const data=Buffer.concat([cipher.update(value,"utf8"),cipher.final()]);
 return [iv,cipher.getAuthTag(),data].map(v=>v.toString("base64url")).join(".");
}
function revealReference(value:string,cred:RedsysCredentials){
 const [iv,tag,raw]=value.split(".").map(v=>Buffer.from(v,"base64url"));
 const cipher=crypto.createDecipheriv("aes-256-gcm",Buffer.from(vaultKey(cred)),iv);cipher.setAuthTag(tag);
 return JSON.parse(Buffer.concat([cipher.update(raw),cipher.final()]).toString("utf8")) as {id:string;tx:string};
}
export async function initialPayment(user:string,course:string,body:Record<string,unknown>){
 if(body.terms!==true||body.privacy!==true||body.recurring!==true||(body.immediate===true&&body.withdrawal!==true))return message("consent_required",400);
 const cred=getRedsysCredentials(),db=getSupabase();
 const result=await db.rpc("test_opo12_checkout",{p_student:user,p_course:course,p_immediate:body.immediate===true,p_terms:{agreement,version:"TEST-OPO12-2026-11",course,recurring:true,immediate:body.immediate===true,withdrawal:body.withdrawal===true,privacy:true,terms:true}});
 if(result.error)return message(result.error.message.includes("course_closed")?"course_closed":result.error.message.includes("existing_subscription")?"existing_subscription":"pending_payment",409);
 const back=origin()+testCoursePath(course);
 return NextResponse.json({url:bank(cred)+"/sis/realizarPago",fields:bankFields(String(result.data),cred,{DS_MERCHANT_IDENTIFIER:"REQUIRED",DS_MERCHANT_COF_INI:"S",DS_MERCHANT_COF_TYPE:"R",DS_MERCHANT_PAYMETHODS:"C",DS_MERCHANT_MERCHANTURL:origin()+"/api/test-opo12/banco",DS_MERCHANT_URLOK:back+"?pago=recibido",DS_MERCHANT_URLKO:back+"?pago=interrumpido"})},{headers:{"Cache-Control":"no-store"}});
}
export type Notice={Ds_SignatureVersion?:string;Ds_MerchantParameters?:string;Ds_Signature?:string};
export function verifyNotice(n:Notice,cred:RedsysCredentials,expectedOrder?:string){
 if(n.Ds_SignatureVersion!==version||!n.Ds_MerchantParameters||!n.Ds_Signature)throw Error("invalid_notice");
 const raw=decodeMerchantParameters(n.Ds_MerchantParameters);
 const d=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k.toLowerCase(),String(v)]));
 const order=d.ds_order;if(!/^7912\d{8}$/.test(order)||expectedOrder&&order!==expectedOrder)throw Error("unexpected_order");
 if(!safeEqual(createRedsysSignature(n.Ds_MerchantParameters,order,cred.signingKey),n.Ds_Signature))throw Error("invalid_signature");
 if(d.ds_merchantcode!==cred.merchantCode||!/^\d+$/.test(d.ds_terminal)||Number(d.ds_terminal)!==Number(cred.terminal)||d.ds_amount!=="990"||d.ds_currency!=="978"||d.ds_transactiontype!=="0"||!/^\d{1,4}$/.test(d.ds_response))throw Error("unexpected_payment");
 return {order,code:Number(d.ds_response),reference:d.ds_merchant_identifier,txn:d.ds_merchant_cof_txnid||""};
}
export async function settleNotice(n:Notice,cred:RedsysCredentials,expectedOrder?:string){
 const v=verifyNotice(n,cred,expectedOrder);const db=getSupabase();
 const encrypted=v.reference&&v.reference!=="REQUIRED"?protectReference(JSON.stringify({id:v.reference,tx:v.txn}),cred):null;
 const r=await db.rpc("test_opo12_settle",{p_order:v.order,p_approved:v.code<100,p_code:v.code,p_credential:encrypted});
 if(r.error)throw Error("settlement_failed");return r.data;
}
export async function renewDue(){
 const db=getSupabase(),cred=getRedsysCredentials();
 const {data,error}=await db.rpc("test_opo12_due");
 if(error)throw Error("read_failed");let processed=0,uncertain=0;
 for(const sub of data||[]){
  const reserved=await db.rpc("test_opo12_reserve_renewal",{p_sub:sub.id});if(reserved.error)throw Error("reservation_failed");if(!reserved.data)continue;
  const ord=String(reserved.data);const item=await db.from("test_opo12_subscriptions").select("renew,credential").eq("id",sub.id).single();
  if(item.error)throw Error("subscription_read_failed");
  if(!item.data.renew||!item.data.credential)continue;
  try{
   const ref=revealReference(item.data.credential,cred);
   const form=bankFields(ord,cred,{DS_MERCHANT_IDENTIFIER:ref.id,DS_MERCHANT_COF_INI:"N",DS_MERCHANT_COF_TYPE:"R",DS_MERCHANT_EXCEP_SCA:"MIT",DS_MERCHANT_DIRECTPAYMENT:"true",...(ref.tx?{DS_MERCHANT_COF_TXNID:ref.tx}:{}),DS_MERCHANT_MERCHANTURL:origin()+"/api/test-opo12/banco"});
   const response=await fetch(bank(cred)+"/sis/rest/trataPeticionREST",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form),signal:AbortSignal.timeout(12000),cache:"no-store"});
   if(!response.ok)throw Error("bank_unavailable");
   await settleNotice(await response.json(),cred,ord);processed++;
  }catch{uncertain++;const marked=await db.from("test_opo12_payments").update({status:"unknown"}).eq("order_id",ord).eq("status","pending");if(marked.error)throw Error("pending_reconciliation");}
 }
 return {processed,uncertain};
}
