"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../../lib/supabaseClient";
import { courses, type CourseSlug } from "../../../../lib/courses";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ComprarPage({ params }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [courseSlug, setCourseSlug] = useState<CourseSlug>("historia-espana");
  const [codigo, setCodigo] = useState("");
  const [mensajeCodigo, setMensajeCodigo] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [immediateAccess, setImmediateAccess] = useState(false);
  const [withdrawalAcknowledged, setWithdrawalAcknowledged] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const slug = resolvedParams.slug as CourseSlug;

      if (courses[slug]) {
        setCourseSlug(slug);
      }

      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };

    loadData();
  }, [params]);

  const course = courses[courseSlug];

  const handlePago = async () => {
    if (!userId) {
      alert("Debes iniciar sesión antes de realizar el pago.");
      return;
    }

    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      alert("Tu sesión ha caducado. Vuelve a iniciar sesión.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/redsys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        courseSlug,
        termsAccepted,
        privacyAcknowledged,
        immediateAccess,
        withdrawalAcknowledged,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "No se pudo preparar el pago.");
      setLoading(false);
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.redsysUrl;

    const version = document.createElement("input");
    version.type = "hidden";
    version.name = "Ds_SignatureVersion";
    version.value = data.dsSignatureVersion;
    form.appendChild(version);

    const paramsInput = document.createElement("input");
    paramsInput.type = "hidden";
    paramsInput.name = "Ds_MerchantParameters";
    paramsInput.value = data.dsMerchantParameters;
    form.appendChild(paramsInput);

    const signature = document.createElement("input");
    signature.type = "hidden";
    signature.name = "Ds_Signature";
    signature.value = data.signature;
    form.appendChild(signature);

    document.body.appendChild(form);
    form.submit();
  };

  const handleCodigo = async () => {
    setMensajeCodigo("");

    if (!userId) {
      setMensajeCodigo("Debes iniciar sesión antes de activar un código.");
      return;
    }

    if (!codigo.trim()) {
      setMensajeCodigo("Introduce un código.");
      return;
    }

    setLoadingCode(true);

    if (!termsAccepted || !privacyAcknowledged) {
      setMensajeCodigo("Acepta primero las condiciones y la política de privacidad.");
      setLoadingCode(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    const response = await fetch("/api/access-codes/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        code: codigo.trim().toUpperCase(),
        termsAccepted,
        privacyAcknowledged,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMensajeCodigo(result.error || "No se pudo activar la clave.");
      setLoadingCode(false);
      return;
    }

    setMensajeCodigo("✅ Clave personal aplicada. Tu acceso ya está activado.");
    setCodigo("");
    setLoadingCode(false);
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
            Accede ahora a la preparación completa de {course.title}
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
            imágenes, textos históricos y preparación enfocada a PAU.
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
            {course.price} €
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
              Quedan pocas semanas para la PAU. Este acceso está pensado
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
              Activar con código
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Introduce tu código"
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                }}
              />

              <button
                onClick={handleCodigo}
                disabled={loadingCode}
                style={{
                  padding: "14px 20px",
                  background: "#111827",
                  color: "white",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loadingCode ? "Validando código..." : "Activar con código"}
              </button>

              {mensajeCodigo ? (
                <p style={{ margin: 0, fontSize: "14px" }}>{mensajeCodigo}</p>
              ) : null}
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
            <label>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
              />{" "}
              He leído y acepto las condiciones de contratación y las normas de uso.
            </label>
            <label>
              <input
                type="checkbox"
                checked={privacyAcknowledged}
                onChange={(event) => setPrivacyAcknowledged(event.target.checked)}
              />{" "}
              He leído la política de privacidad.
            </label>
            <label>
              <input
                type="checkbox"
                checked={immediateAccess}
                onChange={(event) => {
                  setImmediateAccess(event.target.checked);
                  if (!event.target.checked) setWithdrawalAcknowledged(false);
                }}
              />{" "}
              Solicito expresamente que el acceso comience antes de finalizar los 14 días.
            </label>
            {immediateAccess && (
              <label>
                <input
                  type="checkbox"
                  checked={withdrawalAcknowledged}
                  onChange={(event) => setWithdrawalAcknowledged(event.target.checked)}
                />{" "}
                Comprendo las consecuencias sobre el derecho de desistimiento al comenzar la prestación y acceder al contenido digital.
              </label>
            )}
            {!immediateAccess && (
              <p>El acceso se activará cuando finalice el plazo legal de 14 días.</p>
            )}
            <button
              onClick={handlePago}
              disabled={
                loading ||
                !termsAccepted ||
                !privacyAcknowledged ||
                (immediateAccess && !withdrawalAcknowledged)
              }
              style={{
                padding: "14px 20px",
                background: "#2563eb",
                color: "white",
                borderRadius: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
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
