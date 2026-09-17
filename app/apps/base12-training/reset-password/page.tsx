"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const SPECIAL_CHARACTERS = "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~";

export default function TrainingResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [done, setDone] = useState(false);
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = [...password].some((character) => SPECIAL_CHARACTERS.includes(character));

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (window.location.hash.includes("type=recovery") && data.session) setRecoveryReady(true);
    };
    void check();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const requestReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) { setMessage("Introduce un correo válido."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: "https://training.base12academy.es/reset-password",
    });
    setMessage(error ? `No se pudo enviar el correo: ${error.message}` : "Te hemos enviado un enlace para crear una contraseña nueva.");
  };

  const savePassword = async () => {
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) { setMessage("La contraseña no cumple los requisitos."); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setMessage("El enlace no es válido o ha caducado. Solicita uno nuevo."); return; }
    await supabase.auth.signOut();
    setDone(true);
    setMessage("Contraseña actualizada. Ya puedes iniciar sesión en Training.");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef9f1", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 430, background: "#fff", border: "1px solid #d7e8dd", borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}><Image src="/images/training/base12-training-192.png?v=7" alt="Base12 Training" width={68} height={68} style={{ borderRadius: 16 }} /><h1 style={{ margin: 0, color: "#143c2c" }}>Recuperar contraseña</h1></div>
        {!recoveryReady && !done ? <><p style={{ color: "#4b635b" }}>Escribe el correo vinculado a tu licencia de Training.</p><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Correo electrónico" autoComplete="email" style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 10, border: "1px solid #cfe0d5" }} /><button type="button" onClick={requestReset} style={{ width: "100%", padding: 12, border: 0, borderRadius: 10, background: "#176b45", color: "#fff", fontWeight: 800 }}>Enviar enlace</button></> : recoveryReady && !done ? <><p style={{ color: "#4b635b" }}>Elige tu nueva contraseña.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nueva contraseña" autoComplete="new-password" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 10, border: "1px solid #cfe0d5" }} /><div style={{ marginBottom: 14, fontSize: 14, color: "#445b52" }}><div>{hasMinLength ? "✓" : "○"} Al menos 8 caracteres</div><div>{hasUppercase ? "✓" : "○"} Una mayúscula</div><div>{hasLowercase ? "✓" : "○"} Una minúscula</div><div>{hasNumber ? "✓" : "○"} Un número</div><div>{hasSpecial ? "✓" : "○"} Un carácter especial</div></div><button type="button" onClick={savePassword} style={{ width: "100%", padding: 12, border: 0, borderRadius: 10, background: "#176b45", color: "#fff", fontWeight: 800 }}>Guardar contraseña</button></> : null}
        {message && <p role="status" style={{ marginTop: 14, color: done ? "#166534" : "#445b52", lineHeight: 1.5 }}>{message}</p>}
        <p style={{ marginTop: 18, marginBottom: 0 }}><Link href="/login" style={{ color: "#176b45", fontWeight: 700 }}>Volver a iniciar sesión</Link></p>
      </section>
    </main>
  );
}
