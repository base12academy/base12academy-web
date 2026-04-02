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
          {/* URGENCIA */}
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Acceso inmediato hasta tu examen · Últimas semanas de preparación
          </div>

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
              fontSize: "38px",
              lineHeight: "1.2",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Prepara Historia de España para la PAU sin perder tiempo
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#4b5563",
              marginBottom: "20px",
            }}
          >
            Temario completo, test, preguntas cortas y preparación directa para
            examen.
          </p>

          {/* BULLETS */}
          <div style={{ marginBottom: "20px", fontSize: "15px" }}>
            <p>✓ Acceso inmediato tras el pago</p>
            <p>✓ Todo el contenido de Historia de España listo</p>
            <p>✓ Enfocado a aprobar la PAU</p>
          </div>

          {/* PRECIO */}
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Acceso completo
            </p>
            <div
              style={{
                fontSize: "42px",
                fontWeight: "bold",
              }}
            >
              29 €
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
            <button
              onClick={handlePago}
              disabled={loading}
              style={{
                padding: "16px 20px",
                background: "#2563eb",
                color: "white",
                borderRadius: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "Conectando con el banco..." : "Acceder ahora"}
            </button>

            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                textAlign: "center",
              }}
            >
              Pago seguro con Redsys · Acceso automático tras el pago
            </p>

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

          {/* QUÉ INCLUYE */}
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              Qué incluye
            </p>

            <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
              <p>• Temas completos organizados</p>
              <p>• Test y preguntas cortas</p>
              <p>• Imágenes y textos históricos</p>
              <p>• Preparación directa para examen</p>
            </div>
          </div>

          {/* SOPORTE */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              Soporte
            </p>

            <p style={{ fontSize: "14px" }}>
              Email: base12academy@gmail.com
            </p>
            <p style={{ fontSize: "14px" }}>WhatsApp: 604 896 760</p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/dashboard"
            style={{ color: "#2563eb", fontWeight: "bold" }}
          >
            ← Volver
          </Link>
        </div>
      </section>
    </main>
  );
}