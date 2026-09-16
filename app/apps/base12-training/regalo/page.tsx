"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import styles from "./regalo.module.css";

type LinkStatus = {
  loading: boolean;
  valid: boolean;
  expired: boolean;
  redeemed: boolean;
  expiresAt?: string;
};

function TrainingGiftContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("codigo")?.trim() ?? "";
  const [user, setUser] = useState<User | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [status, setStatus] = useState<LinkStatus>({ loading: true, valid: false, expired: false, redeemed: false });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState("");
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [{ data: userData }, response] = await Promise.all([
        supabase.auth.getUser(),
        code
          ? fetch(`/api/apps/base12-training/gift/status?codigo=${encodeURIComponent(code)}`, { cache: "no-store" })
          : Promise.resolve(null),
      ]);
      if (cancelled) return;
      setUser(userData.user ?? null);
      setCheckingUser(false);
      if (!response) {
        setStatus({ loading: false, valid: false, expired: false, redeemed: false });
        return;
      }
      const result = await response.json().catch(() => ({}));
      setStatus({
        loading: false,
        valid: result.valid === true,
        expired: result.expired === true,
        redeemed: result.redeemed === true,
        expiresAt: typeof result.expiresAt === "string" ? result.expiresAt : undefined,
      });
    }
    void load();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setCheckingUser(false);
    });
    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [code]);

  const returnPath = useMemo(
    () => `/apps/base12-training/regalo?codigo=${encodeURIComponent(code)}`,
    [code],
  );
  const formattedExpiry = status.expiresAt
    ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date(status.expiresAt))
    : null;

  async function redeemGift() {
    setMessage("");
    setRedeeming(true);
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) {
      setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
      setRedeeming(false);
      return;
    }

    const response = await fetch("/api/apps/base12-training/gift/redeem", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, termsAccepted, privacyAcknowledged }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(result.error || "No se pudo activar el regalo.");
      setRedeeming(false);
      return;
    }
    setActivated(true);
    setRedeeming(false);
  }

  const unavailable = !status.loading && (!status.valid || status.expired);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="Volver a Base12 Academy">
          <Image src="/images/base12-logo.png" alt="Base12 Academy" width={128} height={46} priority />
        </Link>
        <Link href="/tropa-y-marineria/base12-training">Conocer la aplicación</Link>
      </header>

      <section className={styles.card}>
        <div className={styles.visual}>
          <Image
            className={styles.appIcon}
            src="/images/banco-opositores/logo-base12-training.png"
            alt="Base12 Training"
            width={260}
            height={260}
            priority
          />
          <Image
            className={styles.carlos}
            src="/images/training/carlos.webp"
            alt="Carlos, entrenador IA de Base12 Training"
            width={250}
            height={320}
          />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Promoción Base12 · 50 regalos</p>
          <h1>Tu Base12 Training, de regalo</h1>
          <p className={styles.lead}>Acceso permanente a la preparación de las cuatro pruebas físicas de Tropa y Marinería, con seguimiento de marcas, objetivos progresivos y Carlos como entrenador IA.</p>

          <div className={styles.recipientNotice}>
            <strong>Enlace personal e intransferible</strong>
            <span>El regalo solo puede activarse con el correo electrónico al que se ha enviado este enlace.</span>
          </div>

          {status.loading || checkingUser ? (
            <p className={styles.status}>Comprobando tu regalo…</p>
          ) : unavailable ? (
            <div className={styles.errorBox} role="alert">
              <strong>{status.expired ? "Este enlace ha caducado" : "Este enlace no es válido"}</strong>
              <p>Escribe a Base12 Academy si crees que se trata de un error.</p>
            </div>
          ) : activated ? (
            <div className={styles.successBox}>
              <strong>Base12 Training ya es tuyo</strong>
              <p>Tu acceso permanente ha quedado asociado a {user?.email}.</p>
              <Link href="/apps/base12-training" className={styles.primaryButton}>Abrir Base12 Training</Link>
            </div>
          ) : !user ? (
            <div className={styles.authBox}>
              <h2>Identifícate con el correo destinatario</h2>
              <p>Crea tu cuenta gratuita o inicia sesión. Después volverás a este enlace para activar el regalo.</p>
              <div className={styles.actions}>
                <Link href={`/register?redirect=${encodeURIComponent(returnPath)}`} className={styles.primaryButton}>Crear cuenta gratuita</Link>
                <Link href={`/login?redirect=${encodeURIComponent(returnPath)}`} className={styles.secondaryButton}>Ya tengo cuenta</Link>
              </div>
            </div>
          ) : (
            <div className={styles.claimBox}>
              <p>Vas a activar el regalo para <strong>{user.email}</strong>.</p>
              {status.redeemed && <p className={styles.already}>Este enlace ya fue activado. Puedes comprobar de nuevo tu acceso.</p>}
              <label>
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
                <span>Acepto los <Link href="/terminos-contratacion" target="_blank">términos de uso</Link>.</span>
              </label>
              <label>
                <input type="checkbox" checked={privacyAcknowledged} onChange={(event) => setPrivacyAcknowledged(event.target.checked)} />
                <span>He leído la <Link href="/privacidad" target="_blank">política de privacidad</Link>.</span>
              </label>
              <button type="button" disabled={redeeming || !termsAccepted || !privacyAcknowledged} onClick={redeemGift} className={styles.primaryButton}>
                {redeeming ? "Activando…" : status.redeemed ? "Comprobar mi acceso" : "Activar mi regalo"}
              </button>
              {message && <p className={styles.message} role="alert">{message}</p>}
            </div>
          )}

          {formattedExpiry && !activated && !unavailable && <p className={styles.expiry}>Activa este enlace antes del {formattedExpiry}.</p>}
          <p className={styles.finePrint}>Promoción gratuita, sin pago ni suscripción. Una licencia permanente por enlace.</p>
        </div>
      </section>
    </main>
  );
}

export default function TrainingGiftPage() {
  return (
    <Suspense fallback={<main style={{ padding: 32 }}>Comprobando tu regalo…</main>}>
      <TrainingGiftContent />
    </Suspense>
  );
}
