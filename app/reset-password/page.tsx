"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  useEffect(() => {
    const recoveryRequested = searchParams.get("recovery") === "1" || window.location.hash.includes("type=recovery");
    const errorDescription = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("error_description");

    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (errorDescription) setMessage(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
      if (recoveryRequested && data.session) setRecoveryReady(true);
    };
    void checkRecoverySession();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, [searchParams]);

  const handleRequest = async () => {
    setLoading(true);
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      setMessage("Introduce un correo electrónico válido.");
      setLoading(false);
      return;
    }

    const recoveryUrl = new URL("/reset-password", window.location.origin);
    recoveryUrl.searchParams.set("recovery", "1");
    recoveryUrl.searchParams.set("redirect", redirect);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: recoveryUrl.toString(),
    });

    setLoading(false);
    if (error) {
      setMessage(`No se pudo enviar el correo de recuperación: ${error.message}`);
      return;
    }
    setMessage("Te hemos enviado un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.");
  };

  const handleReset = async () => {
    setLoading(true);
    setMessage("");
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage("El enlace no es válido o ha caducado. Solicita un correo de recuperación nuevo.");
      return;
    }

    await supabase.auth.signOut();
    setPasswordUpdated(true);
    setMessage("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 430, padding: 32, borderRadius: 16, border: "1px solid #e5e7eb", background: "white" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Recuperar contraseña</h1>
        {!recoveryReady && !passwordUpdated ? (
          <>
            <p style={{ color: "#64748b", lineHeight: 1.55 }}>Escribe el correo de tu cuenta de Base12. Recibirás un enlace seguro para elegir una contraseña nueva.</p>
            <input
              type="email"
              aria-label="Correo electrónico"
              placeholder="Correo electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && void handleRequest()}
              autoComplete="email"
              style={{ width: "100%", padding: 12, marginTop: 12, borderRadius: 9, border: "1px solid #cbd5e1" }}
            />
            <button type="button" onClick={handleRequest} disabled={loading} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 9, background: "#1d4ed8", color: "white", border: 0, fontWeight: 700, cursor: "pointer" }}>
              {loading ? "Enviando…" : "Enviar enlace de recuperación"}
            </button>
          </>
        ) : recoveryReady && !passwordUpdated ? (
          <>
            <p style={{ color: "#64748b", lineHeight: 1.55 }}>Elige la contraseña que utilizarás a partir de ahora.</p>
            <input
              type="password"
              aria-label="Nueva contraseña"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              style={{ width: "100%", padding: 12, marginTop: 12, borderRadius: 9, border: "1px solid #cbd5e1" }}
            />
            <div style={{ marginTop: 10, fontSize: 14, color: "#374151" }}>
              <div>{hasMinLength ? "✓" : "○"} Al menos 8 caracteres</div>
              <div>{hasUppercase ? "✓" : "○"} Una mayúscula</div>
              <div>{hasLowercase ? "✓" : "○"} Una minúscula</div>
              <div>{hasNumber ? "✓" : "○"} Un número</div>
            </div>
            <button type="button" onClick={handleReset} disabled={loading} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 9, background: "#1d4ed8", color: "white", border: 0, fontWeight: 700, cursor: "pointer" }}>
              {loading ? "Actualizando…" : "Guardar contraseña nueva"}
            </button>
          </>
        ) : null}
        {message && <p role="status" style={{ marginTop: 16, color: passwordUpdated ? "#166534" : "#334155", lineHeight: 1.5 }}>{message}</p>}
        <p style={{ marginTop: 18, marginBottom: 0 }}>
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: "#2563eb", fontWeight: 700 }}>Volver a iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main style={{ padding: 32 }}>Cargando…</main>}><ResetPasswordForm /></Suspense>;
}
