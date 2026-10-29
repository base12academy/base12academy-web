"use client";

import { useEffect, useState } from "react";
import { readAdConsent, saveAdConsent, startAdMeasurement } from "@/lib/google-ads";
import styles from "./AdMeasurementConsent.module.css";

export default function AdMeasurementConsent() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setOpen(readAdConsent() === null);
    startAdMeasurement();
  }, []);
  function choose(accepted: boolean) {
    if (!saveAdConsent(accepted)) {
      setError("No se ha podido guardar la elección. La medición permanece desactivada.");
      return;
    }
    setOpen(false);
    setError("");
  }
  return <>
    {open && <section className={styles.panel} aria-label="Preferencias de cookies">
      <h2>Tu elección sobre las cookies</h2>
      <p>Usamos cookies necesarias para que la web funcione. Si lo aceptas, Google Ads utilizará cookies e identificadores publicitarios para relacionar tus compras con nuestros anuncios. No activamos publicidad personalizada.</p>
      <p>Puedes rechazar esta medición y utilizar todos los servicios. <a href="/cookies">Más información y proveedores</a>.</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose(false)}>Rechazar opcionales</button>
        <button type="button" onClick={() => choose(true)}>Aceptar medición publicitaria</button>
      </div>
      {error && <p role="alert">{error}</p>}
    </section>}
    {!open && <button type="button" className={styles.settings} onClick={() => setOpen(true)}>Configurar cookies</button>}
  </>;
}
