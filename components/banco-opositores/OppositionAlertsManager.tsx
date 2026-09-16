"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/banco-opositores/banco.module.css";

type Alert = {
  id: string;
  alert_type: "general" | "convocatoria";
  criteria: Record<string, string>;
  email_enabled: boolean;
  telegram_enabled: boolean;
  active: boolean;
  created_at: string;
  call: { title: string; slug: string } | null;
};

export default function OppositionAlertsManager({ token }: { token: string }) {
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(
    token ? "" : "Abre el enlace privado que te enviamos por correo al crear la alerta."
  );

  useEffect(() => {
    if (!token) return;
    fetch(`/api/banco-opositores/alertas?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "No se pudieron consultar las alertas.");
        setEmail(result.subscriber.email);
        setAlerts(result.alerts ?? []);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "No se pudieron consultar las alertas."))
      .finally(() => setLoading(false));
  }, [token]);

  async function toggle(alert: Alert) {
    const active = !alert.active;
    const response = await fetch("/api/banco-opositores/alertas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, alertId: alert.id, active }),
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "No se pudo actualizar la alerta.");
      return;
    }
    setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, active } : item));
  }

  return (
    <section className={styles.alertsShell}>
      <p className={styles.eyebrow}>Control privado</p>
      <h1>Mis alertas</h1>
      {email && <p className={styles.muted}>Avisos configurados para {email}. El consentimiento comercial permanece separado.</p>}
      {loading && <p className={styles.loadingText}>Consultando tus alertas…</p>}
      {error && <p className={styles.errorBox}>{error}</p>}
      {!loading && !error && !alerts.length && <div className={styles.emptyState}><h3>No tienes alertas</h3><p>Puedes crear una desde cualquier convocatoria o desde el buscador.</p></div>}
      <div className={styles.alertList}>
        {alerts.map((alert) => {
          const criteria = Object.values(alert.criteria ?? {}).filter(Boolean).join(" · ");
          return <article className={styles.alertItem} key={alert.id}><div><h2>{alert.call?.title || criteria || "Nuevas convocatorias"}</h2><p>{alert.alert_type === "convocatoria" ? "Seguimiento de una convocatoria" : "Alerta general"} · {[alert.email_enabled && "Email", alert.telegram_enabled && "Telegram"].filter(Boolean).join(" + ")}</p>{alert.call && <Link href={`/banco-opositores/convocatoria/${alert.call.slug}`}>Ver convocatoria</Link>}</div><button className={alert.active ? styles.outlineButton : styles.primaryButton} type="button" onClick={() => toggle(alert)}>{alert.active ? "Pausar" : "Reactivar"}</button></article>;
        })}
      </div>
      <p><Link className={styles.primaryButton} href="/banco-opositores">Crear nueva alerta</Link></p>
    </section>
  );
}
