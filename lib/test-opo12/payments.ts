import "server-only";
import {NextResponse} from "next/server";
import {getSupabase} from "@/lib/supabase/server";
import {createRedsysSignature,decodeMerchantParameters,getRedsysCredentials,safeEqual,type RedsysCredentials} from "@/lib/redsys";
import {testCoursePath} from "./catalog";

const version="HMAC_SHA256_V1";
const agreement="Pago único de 9,90 € por un mes de acceso a esta oposición. Cada renovación requiere un nuevo pago del alumno.";
const origin=()=>new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://base12academy.es").origin;
const bank=(cred:RedsysCredentials)=>cred.environment==="PROD"?"https://sis.redsys.es":"https://sis-t.redsys.es:25443";
const message=(error:string,status:number)=>NextResponse.json({error},{status,headers:{"Cache-Control":"no-store"}});

export function bankFields(order:string,cred:RedsysCredentials,extra:Record<string,string>){
 const payload={DS_MERCHANT_AMOUNT:"990",DS_MERCHANT_CURRENCY:"978",DS_MERCHANT_ORDER:order,DS_MERCHANT_MERCHANTCODE:cred.merchantCode,DS_MERCHANT_TERMINAL:cred.terminal,DS_MERCHANT_TRANSACTIONTYPE:"0",...extra};
 const packed=Buffer.from(JSON.stringify(payload),"utf8").toString("base64");
 return {Ds_SignatureVersion:version,Ds_MerchantParameters:packed,Ds_Signature:createRedsysSignature(packed,order,cred.signingKey)};
}
export async function initialPayment(user:string,course:string,body:Record<string,unknown>){
 if(body.terms!==true||body.privacy!==true||body.mode!=="manual"||body.recurring===true||(body.immediate===true&&body.withdrawal!==true))return message("consent_required",400);
 const cred=getRedsysCredentials(),db=getSupabase();
 const result=await db.rpc("test_opo12_checkout",{p_student:user,p_course:course,p_immediate:body.immediate===true,p_terms:{agreement,version:"TEST-OPO12-MANUAL-2026-11",course,mode:"manual",expectedEnd:body.expectedEnd||null,recurring:false,immediate:body.immediate===true,withdrawal:body.withdrawal===true,privacy:true,terms:true}});
 if(result.error)return message(result.error.message.includes("course_closed")?"course_closed":result.error.message.includes("period_changed")?"period_changed":result.error.message.includes("early_access_consent")?"early_access_consent":"pending_payment",409);
 const back=origin()+testCoursePath(course);
 return NextResponse.json({url:bank(cred)+"/sis/realizarPago",fields:bankFields(String(result.data),cred,{DS_MERCHANT_MERCHANTURL:origin()+"/api/test-opo12/banco",DS_MERCHANT_URLOK:back+"?pago=recibido",DS_MERCHANT_URLKO:back+"?pago=interrumpido"})},{headers:{"Cache-Control":"no-store"}});
}
export type Notice={Ds_SignatureVersion?:string;Ds_MerchantParameters?:string;Ds_Signature?:string};
export function verifyNotice(n:Notice,cred:RedsysCredentials,expectedOrder?:string){
 if(n.Ds_SignatureVersion!==version||!n.Ds_MerchantParameters||!n.Ds_Signature)throw Error("invalid_notice");
 const raw=decodeMerchantParameters(n.Ds_MerchantParameters);
 const d=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k.toLowerCase(),String(v)]));
 const order=d.ds_order;if(!/^7912\d{8}$/.test(order)||expectedOrder&&order!==expectedOrder)throw Error("unexpected_order");
 if(!safeEqual(createRedsysSignature(n.Ds_MerchantParameters,order,cred.signingKey),n.Ds_Signature))throw Error("invalid_signature");
 if(d.ds_merchantcode!==cred.merchantCode||!/^\d+$/.test(d.ds_terminal)||Number(d.ds_terminal)!==Number(cred.terminal)||d.ds_amount!=="990"||d.ds_currency!=="978"||d.ds_transactiontype!=="0"||!/^\d{1,4}$/.test(d.ds_response))throw Error("unexpected_payment");
 return {order,code:Number(d.ds_response)};
}
export async function settleNotice(n:Notice,cred:RedsysCredentials,expectedOrder?:string){
 const v=verifyNotice(n,cred,expectedOrder);const db=getSupabase();
 const r=await db.rpc("test_opo12_settle",{p_order:v.order,p_approved:v.code<100,p_code:v.code,p_credential:null});
 if(r.error)throw Error("settlement_failed");return r.data;
}
