"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email o contraseña incorrectos");
      return;
    }

    window.location.assign("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          Acceso al campus
        </h1>

        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Accede a tu cuenta para continuar con tu preparación
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "8px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
          }}
        />

        {/* 👇 AVISO DE CONTRASEÑA */}
        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>
  La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.
</p>

<div style={{ marginBottom: "16px" }}>
  <Link href="/reset-password" style={{ fontSize: "14px", color: "#2563eb" }}>
    ¿Has olvidado tu contraseña?
  </Link>
</div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            borderRadius: "10px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>

          {message && (
          <p style={{ marginTop: "12px", color: "red", fontSize: "14px" }}>
            {message}
          </p>
        )}

                <p style={{ marginTop: "16px", fontSize: "14px" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" style={{ color: "#2563eb" }}>
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}