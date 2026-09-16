"use client";

import Image from "next/image";
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
  const [immediate, setImmediate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (!terms || !immediate) {
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
          privacyAcknowledged: true,
          immediateAccess: immediate,
          withdrawalAcknowledged: immediate,
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
        <div className={styles.licenseHero}>
          <div>
            <p className={styles.eyebrow}>Compra única Base12</p>
            <h1>Tabla Periódica Interactiva</h1>
            <p className={styles.intro}>Convierte la tabla periódica en una herramienta para comprender la química: encuentra cada elemento, descubre sus propiedades y compara tendencias con ayuda de Clara.</p>
          </div>
          <div className={styles.licenseClara}>
            <Image
              src="/images/clara-tabla-periodica.png"
              alt="Clara, asistente de química de Base12"
              width={170}
              height={210}
              priority
            />
          </div>
        </div>

        <div className={styles.offer}>
          <div><span>Acceso personal</span><strong>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(priceInCents / 100)}</strong><small>Pago único · acceso permanente</small></div>
          <ul><li>Fichas completas de los 118 elementos</li><li>Familias y tendencias explicadas visualmente</li><li>Comparación directa entre elementos</li><li>Clara te ayuda a comprender y resolver dudas</li></ul>
        </div>

        <div className={styles.consents}>
          <label><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /><span>Acepto los <Link href="/terminos-contratacion">términos de contratación</Link>. <b>Obligatorio</b></span></label>
          <label><input type="checkbox" checked={immediate} onChange={(event) => setImmediate(event.target.checked)} /><span>Solicito el acceso inmediato y conozco que, cuando comience el suministro digital, perderé el derecho de desistimiento. <b>Obligatorio</b></span></label>
          <p className={styles.privacyNotice}>Usaremos tus datos para gestionar la compra y darte acceso a la aplicación. Consulta la <Link href="/privacidad">política de privacidad</Link>.</p>
        </div>
        <button type="button" onClick={startCheckout} disabled={loading}>{loading ? "Conectando con Redsys…" : "Comprar aplicación · 9,99 €"}</button>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
    </main>
  );
}
