"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import {
  readMeasurementConsent,
  saveMeasurementConsent,
  startGoogleMeasurement,
  type MeasurementConsent,
} from "@/lib/google-ads";
import styles from "./AdMeasurementConsent.module.css";

export default function AdMeasurementConsent() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<MeasurementConsent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = readMeasurementConsent();
    setConsent(saved);
    setOpen(saved === null);
    startGoogleMeasurement();
  }, []);

  function choose(next: MeasurementConsent) {
    if (!saveMeasurementConsent(next)) {
      setError("No se ha podido guardar la elección. La medición permanece desactivada.");
      return;
    }
    setConsent(next);
    setOpen(false);
    setError("");
    startGoogleMeasurement();
  }

  return <>
    {consent?.analytics && <Analytics />}
    {open && <section className={styles.panel} aria-label="Preferencias de cookies">
      <h2>Tu elección sobre las cookies</h2>
      <p>Usamos cookies necesarias para que la web funcione. Puedes aceptar solo la analítica para ayudarnos a conocer el uso de la web, o añadir la medición publicitaria de Google Ads para relacionar compras confirmadas con nuestros anuncios. No activamos publicidad personalizada.</p>
      <p>Puedes rechazar ambas opciones y utilizar todos los servicios. <a href="/cookies">Más información y proveedores</a>.</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose({ analytics: false, ads: false })}>Rechazar opcionales</button>
        <button type="button" onClick={() => choose({ analytics: true, ads: false })}>Aceptar analítica</button>
        <button type="button" onClick={() => choose({ analytics: true, ads: true })}>Aceptar analítica y publicidad</button>
      </div>
      {error && <p role="alert">{error}</p>}
    </section>}
    {!open && <button type="button" className={styles.settings} onClick={() => setOpen(true)}>Configurar cookies</button>}
  </>;
}
