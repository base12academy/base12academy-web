"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TrainingLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMessage("Correo o contraseña incorrectos.");
      return;
    }
    window.location.assign("/");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef9f1", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 420, background: "#fff", border: "1px solid #d7e8dd", borderRadius: 20, padding: 32, boxShadow: "0 16px 44px rgba(23,107,69,.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <Image src="/images/training/base12-training-logo.png" alt="Base12 Training" width={110} height={125} style={{ objectFit: "contain" }} priority />
          <div><h1 style={{ margin: 0, fontSize: 26, color: "#143c2c" }}>Base12 Training</h1><p style={{ margin: "4px 0 0", color: "#557066" }}>Acceso a tu licencia</p></div>
        </div>
        <p style={{ color: "#4b635b", lineHeight: 1.55 }}>Inicia sesión con el correo al que está vinculada tu licencia de Training.</p>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={{ width: "100%", padding: 12, marginTop: 8, marginBottom: 12, borderRadius: 10, border: "1px solid #cfe0d5" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void handleLogin()} autoComplete="current-password" style={{ width: "100%", padding: 12, marginBottom: 14, borderRadius: 10, border: "1px solid #cfe0d5" }} />
        <button type="button" onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: 12, border: 0, borderRadius: 10, background: "#176b45", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: loading ? .65 : 1 }}>{loading ? "Entrando…" : "Entrar en Training"}</button>
        {message && <p role="status" style={{ marginTop: 12, color: "#b42318" }}>{message}</p>}
        <p style={{ marginTop: 16, fontSize: 14 }}><Link href="/reset-password" style={{ color: "#176b45", fontWeight: 700 }}>He olvidado mi contraseña</Link></p>
        <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14 }}>¿No tienes cuenta? <Link href="/register" style={{ color: "#176b45", fontWeight: 700 }}>Crear cuenta de Training</Link></p>
      </section>
    </main>
  );
}
