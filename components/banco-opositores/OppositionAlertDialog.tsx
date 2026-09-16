"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/app/banco-opositores/banco.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  callId?: string;
  callTitle?: string;
  criteria?: Record<string, string>;
};

export default function OppositionAlertDialog({
  open,
  onClose,
  callId,
  callTitle,
  criteria = {},
}: Props) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [serviceConsent, setServiceConsent] = useState(false);
  const [commercialConsent, setCommercialConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch("/api/banco-opositores/alertas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(data.session?.access_token
            ? { Authorization: `Bearer ${data.session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          type: callId ? "convocatoria" : "general",
          callId,
          email,
          fullName,
          criteria,
          emailEnabled,
          telegramEnabled,
          serviceConsent,
          commercialConsent,
        }),
      });
      const result = (await response.json()) as { error?: string; requiresLogin?: boolean };
      if (!response.ok) {
        if (result.requiresLogin) {
          throw new Error(`${result.error} Puedes acceder y volver después a esta ficha.`);
        }
        throw new Error(result.error || "No se pudo crear la alerta.");
      }
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear la alerta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="alert-title">
        <button className={styles.modalClose} type="button" onClick={onClose} aria-label="Cerrar">×</button>
        {success ? (
          <div className={styles.successBox}>
            <span aria-hidden="true">✓</span>
            <h2 id="alert-title">Alerta activada</h2>
            <p>Te hemos enviado el enlace privado para gestionar, pausar o eliminar tus alertas.</p>
            <button type="button" className={styles.primaryButton} onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className={styles.eyebrow}>Alerta gratuita</p>
            <h2 id="alert-title">{callTitle ? "Seguir esta convocatoria" : "Crear una alerta general"}</h2>
            <p className={styles.muted}>
              {callTitle
                ? `Te avisaremos de cambios oficiales relevantes en «${callTitle}».`
                : "Te avisaremos cuando aparezcan nuevas convocatorias que coincidan con tus criterios."}
            </p>

            <div className={styles.formGrid}>
              <label>Nombre <span>Opcional</span><input value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" /></label>
              <label>Correo electrónico<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
            </div>

            <fieldset className={styles.channelFieldset}>
              <legend>Elige cómo quieres recibir los avisos</legend>
              <label className={styles.channelCard}>
                <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
                <span aria-hidden="true">✉</span><b>Correo electrónico</b><small>Avisos de servicio</small>
              </label>
              <label className={styles.channelCard}>
                <input type="checkbox" checked={telegramEnabled} onChange={(e) => setTelegramEnabled(e.target.checked)} />
                <span aria-hidden="true">➤</span><b>Telegram</b><small>Requiere cuenta vinculada</small>
              </label>
            </fieldset>

            <label className={styles.consentRow}>
              <input type="checkbox" required checked={serviceConsent} onChange={(e) => setServiceConsent(e.target.checked)} />
              <span>Acepto recibir los avisos de servicio solicitados y el tratamiento necesario para gestionarlos. <b>Obligatorio</b></span>
            </label>
            <label className={styles.consentRow}>
              <input type="checkbox" checked={commercialConsent} onChange={(e) => setCommercialConsent(e.target.checked)} />
              <span>Quiero recibir información comercial de Base12. <em>Opcional e independiente</em></span>
            </label>

            {error && <p className={styles.errorBox} role="alert">{error}</p>}
            <button className={styles.primaryButton} type="submit" disabled={loading}>
              {loading ? "Activando…" : "Guardar y activar alerta"}
            </button>
            <p className={styles.microcopy}>Sin compromiso. Podrás pausar o eliminar la alerta desde el enlace privado enviado por correo.</p>
          </form>
        )}
      </section>
    </div>
  );
}
