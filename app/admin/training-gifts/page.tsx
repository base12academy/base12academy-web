"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "base12academy@gmail.com";

type Stats = { max: number; reserved: number; redeemed: number; remaining: number };

export default function TrainingGiftAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [validDays, setValidDays] = useState("30");
  const [stats, setStats] = useState<Stats | null>(null);
  const [claimUrl, setClaimUrl] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function authHeaders() {
    const { data } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${data.session?.access_token || ""}` };
  }

  async function loadStats() {
    const response = await fetch("/api/admin/training-gifts", { headers: await authHeaders(), cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      setStats({ max: body.campaign.max_gifts, reserved: body.reservedCount, redeemed: body.redeemedCount, remaining: body.remainingCount });
    } else {
      setMessage(body.error || "No se pudo consultar la campaña.");
    }
  }

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const ok = data.user?.email?.toLowerCase() === ADMIN_EMAIL;
      setAuthorized(ok);
      setChecking(false);
      if (ok) await loadStats();
    })();
  }, []);

  async function createGift() {
    setLoading(true);
    setMessage("");
    setClaimUrl("");
    setEmailSent(null);
    const response = await fetch("/api/admin/training-gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ email, validDays: Number(validDays) }),
    });
    const body = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setMessage(body.error || "No se pudo crear el regalo.");
      return;
    }
    setClaimUrl(body.claimUrl);
    setEmailSent(body.emailSent === true);
    setStats({ max: stats?.max ?? 50, reserved: body.reservedCount, redeemed: body.redeemedCount, remaining: body.remainingCount });
  }

  if (checking) return <main style={{ padding: 32 }}>Comprobando acceso…</main>;
  if (!authorized) {
    return <main style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}><h1>Regalos Base12 Training</h1><p>Esta pantalla requiere iniciar sesión previamente con la cuenta administradora de Base12 Academy.</p><Link href="/admin">Ir a Administración</Link></main>;
  }

  return (
    <main style={{ padding: "32px 20px 60px", maxWidth: 860, margin: "0 auto", fontFamily: "Arial,Helvetica,sans-serif", color: "#17352d" }}>
      <Link href="/admin" style={{ color: "#176b45", fontWeight: 800 }}>← Administración</Link>
      <p style={{ margin: "24px 0 6px", color: "#4f8a64", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em" }}>Base12 Training</p>
      <h1 style={{ marginTop: 0 }}>50 aplicaciones para regalar</h1>
      <p>Cada enlace queda ligado al correo del destinatario, caduca si no se activa dentro del plazo elegido y, una vez canjeado, concede acceso durante 1 año desde la activación. La licencia personal del propietario no consume este cupo y no caduca.</p>

      {stats && <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "24px 0" }}>
        <strong style={{ padding: "12px 16px", borderRadius: 12, background: "#e8f4ec" }}>{stats.remaining} disponibles</strong>
        <span style={{ padding: "12px 16px", borderRadius: 12, background: "#f4f7f5" }}>{stats.reserved} reservadas de {stats.max}</span>
        <span style={{ padding: "12px 16px", borderRadius: 12, background: "#f4f7f5" }}>{stats.redeemed} activadas</span>
      </div>}

      <section style={{ padding: 22, border: "1px solid #d8e5dc", borderRadius: 18, background: "#fbfdfb" }}>
        <label style={{ display: "block", fontWeight: 800 }}>Correo del destinatario
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="destinatario@correo.es" style={{ width: "100%", boxSizing: "border-box", marginTop: 7, padding: 12, border: "1px solid #bfcfc5", borderRadius: 10, fontSize: 16 }} />
        </label>
        <label style={{ display: "block", fontWeight: 800, marginTop: 16 }}>Días para activar el enlace
          <input type="number" min="1" max="90" value={validDays} onChange={(event) => setValidDays(event.target.value)} style={{ width: "100%", boxSizing: "border-box", marginTop: 7, padding: 12, border: "1px solid #bfcfc5", borderRadius: 10, fontSize: 16 }} />
        </label>
        <button type="button" onClick={() => void createGift()} disabled={loading || !email || stats?.remaining === 0} style={{ marginTop: 18, padding: "13px 18px", border: 0, borderRadius: 11, background: "#176b45", color: "white", fontWeight: 900, cursor: "pointer", opacity: loading ? .6 : 1 }}>
          {loading ? "Creando y enviando…" : "Crear y enviar regalo"}
        </button>
      </section>

      {claimUrl && <section style={{ marginTop: 18, padding: 18, borderRadius: 15, background: "#ecfdf3", border: "1px solid #bbf7d0" }}>
        <strong>Regalo creado para {email.trim()}</strong>
        <p style={{ color: emailSent ? "#166534" : "#9a3412", fontWeight: 800 }}>{emailSent ? "Correo enviado correctamente." : "El enlace está creado, pero el correo automático no pudo enviarse."}</p>
        <input readOnly value={claimUrl} onFocus={(event) => event.currentTarget.select()} style={{ width: "100%", boxSizing: "border-box", padding: 11, border: "1px solid #a7d8b7", borderRadius: 9 }} />
      </section>}

      {message && <p style={{ marginTop: 18, color: "#9f1239", fontWeight: 800 }}>{message}</p>}
    </main>
  );
}
