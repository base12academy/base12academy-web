"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const SPECIAL_CHARACTERS = "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~";

export default function TrainingRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = [...password].some((character) => SPECIAL_CHARACTERS.includes(character));

  const handleRegister = async () => {
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) { setMessage("Introduce un correo válido."); return; }
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setMessage("La contraseña no cumple los requisitos indicados.");
      return;
    }
    const response = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: "https://training.base12academy.es/" },
    });
    if (response.error) { setMessage(`No se pudo crear la cuenta: ${response.error.message}`); return; }
    if (response.data.user) {
      await supabase.from("perfiles").upsert([{
        user_id: response.data.user.id,
        email: response.data.user.email,
        referral_code: "B12-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        acceso: false,
      }]);
    }
    if (response.data.session) { window.location.assign("/"); return; }
    setDone(true);
    setMessage("Cuenta creada. Revisa tu correo y confirma la dirección para entrar en Base12 Training.");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef9f1", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 430, background: "#fff", border: "1px solid #d7e8dd", borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}><Image src="/images/training/base12-training-logo.png" alt="Base12 Training" width={104} height={118} style={{ objectFit: "contain" }} /><h1 style={{ margin: 0, color: "#143c2c" }}>Crear cuenta de Training</h1></div>
        <p style={{ color: "#4b635b", lineHeight: 1.55 }}>Usa el correo al que quedará vinculada tu licencia. Compartir la aplicación no da acceso a otra cuenta.</p>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 10, border: "1px solid #cfe0d5" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 10, border: "1px solid #cfe0d5" }} />
        <div style={{ marginBottom: 14, fontSize: 14, color: "#445b52" }}><div>{hasMinLength ? "✓" : "○"} Al menos 8 caracteres</div><div>{hasUppercase ? "✓" : "○"} Una mayúscula</div><div>{hasLowercase ? "✓" : "○"} Una minúscula</div><div>{hasNumber ? "✓" : "○"} Un número</div><div>{hasSpecial ? "✓" : "○"} Un carácter especial</div></div>
        <button type="button" onClick={handleRegister} disabled={done} style={{ width: "100%", padding: 12, border: 0, borderRadius: 10, background: "#176b45", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: done ? .6 : 1 }}>Crear cuenta</button>
        {message && <p role="status" style={{ marginTop: 14, color: done ? "#166534" : "#7a271a", lineHeight: 1.5 }}>{message}</p>}
        <p style={{ marginTop: 18, marginBottom: 0 }}>¿Ya tienes cuenta? <Link href="/login" style={{ color: "#176b45", fontWeight: 700 }}>Iniciar sesión</Link></p>
      </section>
    </main>
  );
}
