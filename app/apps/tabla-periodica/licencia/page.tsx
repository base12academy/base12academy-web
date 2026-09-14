"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PERIODIC_TABLE_CATALOG_SLUG,
  PERIODIC_TABLE_LICENSE_PRICE_CENTS,
} from "@/lib/chemistry/periodic-table-product";
import styles from "./license.module.css";

const priceInCents = PERIODIC_TABLE_LICENSE_PRICE_CENTS;

export default function PeriodicTableLicensePage() {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [withdrawal, setWithdrawal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (!terms || !privacy || (immediate && !withdrawal)) {
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
          courseSlug: PERIODIC_TABLE_CATALOG_SLUG,
          termsAccepted: terms,
          privacyAcknowledged: privacy,
          immediateAccess: immediate,
          withdrawalAcknowledged: withdrawal,
          marketingConsent: false,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo preparar el pago.");

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
      setError(checkoutError instanceof Error ? checkoutError.message : "No se pudo iniciar el pago.");
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/apps/tabla-periodica" className={styles.back}>← Volver a la tabla</Link>
        <p className={styles.eyebrow}>Licencia independiente Base12</p>
        <h1>Tabla Periódica Interactiva</h1>
        <p className={styles.intro}>Una única aplicación con los 118 elementos, fichas, familias, tendencias, comparación y Clara. No incluye ni requiere vídeos o contenidos de un curso.</p>

        <div className={styles.offer}>
          <div><span>Acceso personal</span><strong>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(priceInCents / 100)}</strong><small>Pago único · acceso permanente</small></div>
          <ul><li>Las mismas funciones que el acceso incluido</li><li>Clara con IA y respaldo químico local, también después de la compra</li><li>Datos verificados y trazables</li><li>Sin niveles ni extras ligados al curso</li></ul>
        </div>

        <div className={styles.consents}>
          <label><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /><span>Acepto los <Link href="/terminos-contratacion">términos de contratación</Link>. <b>Obligatorio</b></span></label>
          <label><input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} /><span>He leído la <Link href="/privacidad">política de privacidad</Link>. <b>Obligatorio</b></span></label>
          <label><input type="checkbox" checked={immediate} onChange={(event) => { setImmediate(event.target.checked); if (!event.target.checked) setWithdrawal(false); }} /><span>Solicito que el acceso comience antes de finalizar el plazo de desistimiento.</span></label>
          {immediate && <label><input type="checkbox" checked={withdrawal} onChange={(event) => setWithdrawal(event.target.checked)} /><span>Conozco las consecuencias del inicio inmediato del contenido digital. <b>Obligatorio para acceso inmediato</b></span></label>}
        </div>
        <button type="button" onClick={startCheckout} disabled={loading}>{loading ? "Conectando con Redsys…" : "Comprar por 9,99 €"}</button>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
    </main>
  );
}
