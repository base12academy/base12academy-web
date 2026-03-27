"use client";
import { useState } from "react";
import Link from "next/link";

export default function ComprarPage() {
    const [loading, setLoading] = useState(false);

const handlePago = async () => {
  setLoading(true);

  const res = await fetch("/api/redsys", {
    method: "POST",
  });

  const data = await res.json();

  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.redsysUrl;

  const version = document.createElement("input");
  version.type = "hidden";
  version.name = "Ds_SignatureVersion";
  version.value = data.dsSignatureVersion;
  form.appendChild(version);

  const params = document.createElement("input");
  params.type = "hidden";
  params.name = "Ds_MerchantParameters";
  params.value = data.dsMerchantParameters;
  form.appendChild(params);

  const signature = document.createElement("input");
  signature.type = "hidden";
  signature.name = "Ds_Signature";
  signature.value = data.signature;
  form.appendChild(signature);

  document.body.appendChild(form);
  form.submit();
};
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
        padding: "48px 24px",
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Base12 Academy · Acceso completo
          </p>

          <h1
            style={{
              fontSize: "42px",
              lineHeight: "1.1",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Accede ahora a la preparación completa de Historia de España
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#4b5563",
              marginBottom: "24px",
            }}
          >
            Temario estructurado, índices de estudio, pruebas por tema,
            imágenes, textos históricos y preparación enfocada a EBAU / PAU.
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: "14px",
              background: "#111827",
              color: "white",
              fontWeight: "bold",
              fontSize: "22px",
              marginBottom: "24px",
            }}
          >
            29 €
          </div>

          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              Qué incluye el acceso
            </p>

            <div style={{ display: "grid", gap: "10px" }}>
              <p>✅ Acceso al contenido completo de los temas</p>
              <p>✅ Índices y estructura de estudio</p>
              <p>✅ Tests y pruebas por tema</p>
              <p>✅ Imágenes y textos históricos por bloques</p>
              <p>✅ Preparación orientada a examen</p>
            </div>
          </div>

          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Importante
            </p>

            <p style={{ lineHeight: "1.7" }}>
              Quedan pocas semanas para la EBAU / PAU. Este acceso está pensado
              para aprovechar al máximo el tramo final de preparación.
            </p>
          </div>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
              Cómo funciona
            </p>

            <div style={{ display: "grid", gap: "10px", lineHeight: "1.7" }}>
              <p>1. Realiza el pago con tarjeta en el TPV virtual.</p>
              <p>2. El sistema registra la compra.</p>
              <p>3. Tu acceso queda activado.</p>
              <p>4. Entra con tu usuario y empieza a estudiar.</p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
              Pago y soporte
            </p>

            <div style={{ display: "grid", gap: "10px", lineHeight: "1.7" }}>
              <p>
                <strong>Pago:</strong> Tarjeta en TPV virtual
              </p>
              <p>
                <strong>Email:</strong> base12academy@gmail.com
              </p>
              <p>
                <strong>WhatsApp:</strong> 604 896 760
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <button
  onClick={handlePago}
  disabled={loading}
  style={{
    padding: "14px 20px",
    background: "#2563eb",
    color: "white",
    borderRadius: "14px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer"
  }}
>
  {loading ? "Conectando con el banco..." : "Pagar ahora con tarjeta"}
</button>

            <Link
              href="/login"
              style={{
                display: "inline-block",
                textAlign: "center",
                padding: "14px 20px",
                background: "#111827",
                color: "white",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Ya tengo acceso, entrar
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/dashboard" style={{ color: "#2563eb", fontWeight: "bold" }}>
            ← Volver
          </Link>
        </div>
      </section>
    </main>
  );
}