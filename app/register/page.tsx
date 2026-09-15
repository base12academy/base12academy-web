"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const isGiftRegistration = redirect.startsWith("/apps/tabla-periodica/regalo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaExamen, setFechaExamen] = useState("");
  const [codigoAcceso, setCodigoAcceso] = useState("");
  const [message, setMessage] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleRegister = async () => {
    setMessage("");
    if (!email.includes("@")) {
      setMessage("Introduce un correo válido");
      return;
    }
    if (!isGiftRegistration && !fechaExamen) {
      setMessage("Debes indicar la fecha de tu examen");
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
      return;
    }

    const response = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}${redirect}` },
    });
    if (response.error) {
      setMessage("No se pudo crear la cuenta: " + response.error.message);
      return;
    }
    const user = response.data.user;
    if (!user) {
      setMessage("No se ha podido crear el usuario.");
      return;
    }

    const profile: Record<string, unknown> = {
      user_id: user.id,
      email: user.email,
      referral_code: "B12-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      acceso: codigoAcceso === "FAMILIA2026",
    };
    if (fechaExamen) profile.fecha_examen = fechaExamen;
    const { error } = await supabase.from("perfiles").upsert([profile]);
    if (error) {
      setMessage("La cuenta se ha creado, pero no se pudo completar el perfil. Escribe a Base12 Academy.");
      return;
    }

    if (response.data.session) {
      window.location.assign(redirect);
      return;
    }
    setRegistrationComplete(true);
    setMessage("Registro correcto. Revisa tu correo y confirma la cuenta; volverás a este enlace para activar el regalo.");
  };

  return (
    <main style={{ padding: 32, maxWidth: 420, margin: "0 auto" }}>
      <h1>{isGiftRegistration ? "Crea tu cuenta gratuita" : "Registro"}</h1>
      {isGiftRegistration && <p style={{ color: "#4b635b", lineHeight: 1.55 }}>Usa el mismo correo al que Base12 Academy envió el regalo.</p>}
      <input type="email" placeholder="Correo electrónico" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={{ display: "block", marginBottom: 12, padding: 10, width: "100%", borderRadius: 8, border: "1px solid #ccc" }} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" style={{ display: "block", marginBottom: 10, padding: 10, width: "100%", borderRadius: 8, border: "1px solid #ccc" }} />
      {!isGiftRegistration && (
        <>
          <input type="date" aria-label="Fecha del examen" value={fechaExamen} onChange={(event) => setFechaExamen(event.target.value)} style={{ display: "block", marginBottom: 12, padding: 10, width: "100%", borderRadius: 8, border: "1px solid #ccc" }} />
          <input type="text" placeholder="Código de acceso (opcional)" value={codigoAcceso} onChange={(event) => setCodigoAcceso(event.target.value)} style={{ display: "block", marginBottom: 12, padding: 10, width: "100%", borderRadius: 8, border: "1px solid #ccc" }} />
        </>
      )}
      <div style={{ marginBottom: 14, fontSize: 14, color: "#374151" }}>
        <div>{hasMinLength ? "✓" : "○"} Al menos 8 caracteres</div>
        <div>{hasUppercase ? "✓" : "○"} Una mayúscula</div>
        <div>{hasLowercase ? "✓" : "○"} Una minúscula</div>
        <div>{hasNumber ? "✓" : "○"} Un número</div>
      </div>
      <button type="button" onClick={handleRegister} disabled={registrationComplete} style={{ padding: "12px 16px", borderRadius: 8, background: "#111827", color: "white", border: "none", cursor: "pointer", width: "100%", opacity: registrationComplete ? .6 : 1 }}>Registrarse</button>
      <p style={{ marginTop: 12 }}>{message}</p>
      {registrationComplete && <Link href={redirect} style={{ color: "#166534", fontWeight: 800 }}>Volver al regalo</Link>}
      <p style={{ marginTop: 18, fontSize: 14 }}>¿Ya tienes cuenta? <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: "#2563eb" }}>Iniciar sesión</Link></p>
    </main>
  );
}

export default function RegisterPage() {
  return <Suspense fallback={<main style={{ padding: 32 }}>Cargando…</main>}><RegisterForm /></Suspense>;
}
