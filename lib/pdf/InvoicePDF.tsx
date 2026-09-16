import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type InvoiceRecord = {
  id:string; invoice_number:string; issued_at:string; operation_date:string|null;
  issuer_name:string; issuer_tax_id:string; issuer_address:string; customer_name:string;
  customer_tax_id:string; customer_address:string; customer_postal_code:string;
  customer_city:string; customer_province:string|null; customer_country:string;
  customer_email:string; description:string; payment_order_id:string; currency:string;
  base_amount_cents:number; vat_amount_cents:number; total_amount_cents:number; email_sent_at:string|null;
};

const s=StyleSheet.create({page:{padding:42,fontFamily:"Helvetica",fontSize:10,color:"#172033"},head:{backgroundColor:"#15294b",padding:20,color:"white",marginBottom:24},brand:{fontSize:22,fontFamily:"Helvetica-Bold"},title:{fontSize:17,marginTop:8},row:{flexDirection:"row",gap:28,marginBottom:22},box:{flex:1},label:{fontSize:8,color:"#64748b",marginBottom:4,textTransform:"uppercase"},strong:{fontFamily:"Helvetica-Bold",marginBottom:4},tableHead:{flexDirection:"row",backgroundColor:"#e8eef7",padding:9,fontFamily:"Helvetica-Bold"},tableRow:{flexDirection:"row",padding:9,borderBottomWidth:1,borderBottomColor:"#dbe3ee"},concept:{width:"55%"},amount:{width:"15%",textAlign:"right"},totals:{marginTop:16,marginLeft:"55%"},totalRow:{flexDirection:"row",justifyContent:"space-between",paddingVertical:5},grand:{fontFamily:"Helvetica-Bold",fontSize:13,borderTopWidth:1,borderTopColor:"#172033",paddingTop:8},note:{marginTop:28,padding:12,backgroundColor:"#f3f6fa",fontFamily:"Helvetica-Bold"},footer:{position:"absolute",bottom:30,left:42,right:42,fontSize:8,color:"#64748b",textAlign:"center"}});
const money=(n:number)=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(n/100);
const date=(v:string|null)=>v?new Intl.DateTimeFormat("es-ES").format(new Date(v)):"—";
export default function InvoicePDF({invoice:i}:{invoice:InvoiceRecord}){return <Document><Page size="A4" style={s.page}>
  <View style={s.head}><Text style={s.brand}>Base12 Academy</Text><Text style={s.title}>FACTURA {i.invoice_number}</Text></View>
  <View style={s.row}><View style={s.box}><Text style={s.label}>Emisor</Text><Text style={s.strong}>{i.issuer_name}</Text><Text>C.I.F.: {i.issuer_tax_id}</Text><Text>{i.issuer_address}</Text><Text>IVA: Exento</Text></View><View style={s.box}><Text style={s.label}>Destinatario</Text><Text style={s.strong}>{i.customer_name}</Text><Text>NIF/NIE/CIF: {i.customer_tax_id}</Text><Text>{i.customer_address}</Text><Text>{i.customer_postal_code} {i.customer_city}{i.customer_province?`, ${i.customer_province}`:""}</Text><Text>{i.customer_country}</Text></View></View>
  <View style={s.row}><View style={s.box}><Text style={s.label}>Fecha de expedición</Text><Text>{date(i.issued_at)}</Text></View><View style={s.box}><Text style={s.label}>Fecha de operación</Text><Text>{date(i.operation_date)}</Text></View><View style={s.box}><Text style={s.label}>Referencia del pedido</Text><Text>{i.payment_order_id}</Text></View></View>
  <View style={s.tableHead}><Text style={s.concept}>Concepto</Text><Text style={s.amount}>Base</Text><Text style={s.amount}>IVA</Text><Text style={s.amount}>Total</Text></View><View style={s.tableRow}><Text style={s.concept}>{i.description}</Text><Text style={s.amount}>{money(i.base_amount_cents)}</Text><Text style={s.amount}>Exento</Text><Text style={s.amount}>{money(i.total_amount_cents)}</Text></View>
  <View style={s.totals}><View style={s.totalRow}><Text>Base imponible</Text><Text>{money(i.base_amount_cents)}</Text></View><View style={s.totalRow}><Text>IVA: Exento</Text><Text>0,00 €</Text></View><View style={[s.totalRow,s.grand]}><Text>Total</Text><Text>{money(i.total_amount_cents)}</Text></View></View>
  <Text style={s.note}>Operación exenta de IVA</Text><Text style={s.footer}>{i.issuer_name} · C.I.F. {i.issuer_tax_id} · {i.issuer_address}</Text>
  </Page></Document>}
