import React from "react";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { getSupabase } from "@/lib/supabase/server";
import InvoicePDF,{type InvoiceRecord} from "@/lib/pdf/InvoicePDF";
export const runtime="nodejs";
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");if(!token)return NextResponse.json({error:"Debes iniciar sesión"},{status:401});const s=getSupabase();const {data:{user}}=await s.auth.getUser(token);if(!user)return NextResponse.json({error:"Sesión no válida"},{status:401});const {id}=await params;const {data}=await s.from("base12_invoices").select("*").eq("id",id).eq("user_id",user.id).maybeSingle();if(!data)return NextResponse.json({error:"Factura no encontrada"},{status:404});const stream=await renderToStream(React.createElement(InvoicePDF,{invoice:data as InvoiceRecord}) as never);return new NextResponse(stream as never,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="factura-${data.invoice_number}.pdf"`,"Cache-Control":"private, no-store"}})}
