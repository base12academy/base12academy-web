"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseSlug } from "@/lib/courses";
import styles from "./TropaCommercialPage.module.css";

type Props = {
  courseSlug: CourseSlug;
  productName: string;
};

export default function TropaCheckoutForm({ courseSlug, productName }: Props) {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [immediateAccess, setImmediateAccess] = useState(true);
  const [withdrawal, setWithdrawal] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    if (!terms || !privacy || (immediateAccess && !withdrawal)) {
      setError("Acepta primero los consentimientos obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/redsys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          termsAccepted: terms,
          privacyAcknowledged: privacy,
          immediateAccess,
          withdrawalAcknowledged: withdrawal,
          marketingConsent: marketing,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "No se pudo preparar el pago.");
      }

      if (
        !data.redsysUrl ||
        !data.dsSignatureVersion ||
        !data.dsMerchantParameters ||
        !data.signature
      ) {
        throw new Error("La pasarela de pago no ha respondido correctamente.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.redsysUrl;

      const fields = {
        Ds_SignatureVersion: data.dsSignatureVersion,
        Ds_MerchantParameters: data.dsMerchantParameters,
        Ds_Signature: data.signature,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "No se pudo preparar el pago."
      );
      setLoading(false);
    }
  }

  return (
    <section className={styles.checkout} aria-label={`Contratar ${productName}`}>
      <h2>Contratación segura</h2>
      <p>
        El pago se realiza con tarjeta a través del TPV virtual de Redsys. Después
        completarás el alta y podrás indicar si necesitas factura.
      </p>

      <div className={styles.consents}>
        <label>
          <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
          <span>He leído y acepto las <Link href="/terminos-contratacion">condiciones de contratación</Link> y las normas de uso. <b>Obligatorio</b></span>
        </label>
        <label>
          <input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} />
          <span>He leído la <Link href="/privacidad">política de privacidad</Link> y autorizo el tratamiento necesario para gestionar la matrícula. <b>Obligatorio</b></span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={immediateAccess}
            onChange={(event) => {
              setImmediateAccess(event.target.checked);
              if (!event.target.checked) setWithdrawal(false);
            }}
          />
          <span>Solicito que el acceso comience antes de finalizar el plazo de desistimiento.</span>
        </label>
        {immediateAccess && (
          <label>
            <input type="checkbox" checked={withdrawal} onChange={(event) => setWithdrawal(event.target.checked)} />
            <span>Comprendo las consecuencias legales del inicio de la prestación y del acceso al contenido digital. <b>Obligatorio</b></span>
          </label>
        )}
        <label>
          <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
          <span>Quiero recibir novedades y ofertas. <i>Opcional</i></span>
        </label>
      </div>

      {!immediateAccess && (
        <p className={styles.accessNotice}>El acceso se activará al finalizar el plazo legal de 14 días.</p>
      )}

      <button
        className={styles.purchase}
        type="button"
        onClick={checkout}
        disabled={loading || !terms || !privacy || (immediateAccess && !withdrawal)}
      >
        {loading ? "Conectando con Redsys…" : `Contratar ${productName}`}
      </button>

      {error && <p className={styles.checkoutError} role="alert">{error}</p>}
    </section>
  );
}
