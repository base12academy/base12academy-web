"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Correo o contraseña incorrectos");
      return;
    }
    window.location.assign(redirect);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, background: "white", padding: 32, borderRadius: 16, border: "1px solid #e5e7eb" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Acceso al campus</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Accede a tu cuenta para continuar.</p>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void handleLogin()} autoComplete="current-password" style={{ width: "100%", padding: 12, marginBottom: 8, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.</p>
        <div style={{ marginBottom: 16 }}><Link href={`/reset-password?email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(redirect)}`} style={{ fontSize: 14, color: "#2563eb" }}>¿Has olvidado tu contraseña?</Link></div>
        <button type="button" onClick={handleLogin} style={{ width: "100%", padding: 12, background: "#2563eb", color: "white", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer" }}>Entrar</button>
        {message && <p style={{ marginTop: 12, color: "red", fontSize: 14 }}>{message}</p>}
        <p style={{ marginTop: 16, fontSize: 14 }}>¿No tienes cuenta? <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} style={{ color: "#2563eb" }}>Crear cuenta</Link></p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main style={{ padding: 32 }}>Cargando…</main>}><LoginForm /></Suspense>;
}
