import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSupabase } from "@/lib/supabase/server";
import InvoicePDF, { type InvoiceRecord } from "@/lib/pdf/InvoicePDF";

export async function issueInvoice(enrollmentId: string, userId: string, description: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("issue_base12_invoice", {
    p_user_id: userId,
    p_enrollment_id: enrollmentId,
    p_description: description,
  }).single();
  if (error || !data) throw error ?? new Error("No se pudo emitir la factura");
  return data as InvoiceRecord;
}

export async function renderInvoice(invoice: InvoiceRecord) {
  return renderToBuffer(React.createElement(InvoicePDF, { invoice }) as never);
}

export async function emailInvoice(invoice: InvoiceRecord) {
  if (invoice.email_sent_at) return true;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const technicalFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !technicalFrom) throw new Error("Falta la configuración de Resend");
  const address = technicalFrom.match(/<([^>]+)>/)?.[1] ?? technicalFrom;
  const pdf = await renderInvoice(invoice);
  const amount = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })
    .format(invoice.total_amount_cents / 100);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Secretaría Base12 Academy <${address}>`,
      reply_to: "base12academy+secretaria@gmail.com",
      to: [invoice.customer_email],
      subject: `Factura ${invoice.invoice_number} · Base12 Academy`,
      html: `<p>Hola,</p><p>Adjuntamos la factura <strong>${invoice.invoice_number}</strong> correspondiente a ${invoice.description}, por un importe de <strong>${amount}</strong>.</p><p>La operación está exenta de IVA. Encontrarás la factura adjunta en PDF.</p><p>Secretaría Base12 Academy</p>`,
      attachments: [{ filename: `factura-${invoice.invoice_number}.pdf`, content: pdf.toString("base64") }],
    }),
  });
  if (!response.ok) throw new Error(`Resend rechazó la factura (${response.status})`);
  await getSupabase().from("base12_invoices").update({ email_sent_at: new Date().toISOString() }).eq("id", invoice.id).is("email_sent_at", null);
  return true;
}
