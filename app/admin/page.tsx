"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "base12academy+administracion@gmail.com";

export default function AdminPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      const currentEmail = data.user?.email?.toLowerCase();
      setAuthorized(currentEmail === ADMIN_EMAIL);
      setChecking(false);
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    setMessage("");

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setMessage("Esta cuenta no tiene permisos de administración.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || data.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setMessage("Correo o contraseña incorrectos.");
      return;
    }

    setAuthorized(true);
    setPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthorized(false);
  };

  if (checking) {
    return <main className="legal-page"><p>Comprobando acceso…</p></main>;
  }

  if (!authorized) {
    return (
      <main className="legal-page" style={{ maxWidth: 520 }}>
        <Link href="/" className="legal-back">← Volver a Base12 Academy</Link>
        <h1>Acceso de administración</h1>
        <p>Área reservada para la cuenta administradora de Base12 Academy.</p>
        <label style={{ display: "block", marginTop: 22, fontWeight: 700 }}>Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          style={{ width: "100%", padding: 12, marginTop: 7, border: "1px solid #cbd5e1", borderRadius: 10 }}
        />
        <label style={{ display: "block", marginTop: 16, fontWeight: 700 }}>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleLogin()}
          autoComplete="current-password"
          style={{ width: "100%", padding: 12, marginTop: 7, border: "1px solid #cbd5e1", borderRadius: 10 }}
        />
        <button onClick={handleLogin} style={{ width: "100%", padding: 13, marginTop: 22, border: 0, borderRadius: 10, background: "#0f3f92", color: "white", fontWeight: 800, cursor: "pointer" }}>
          Entrar como administrador
        </button>
        {message && <p style={{ color: "#b91c1c", marginTop: 14 }}>{message}</p>}
      </main>
    );
  }

  return (
    <main className="legal-page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, color: "#475569" }}>Base12 Academy</p>
          <h1 style={{ marginTop: 4 }}>Administración</h1>
        </div>
        <button onClick={handleLogout} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Cerrar sesión</button>
      </div>
      <p>Sesión autorizada para {ADMIN_EMAIL}.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
        <a href="https://vercel.com/base12academys-projects/base12academy-web" target="_blank" rel="noreferrer" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Publicación web</strong><br /><span style={{ color: "#64748b" }}>Abrir Vercel</span></a>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Alumnos y datos</strong><br /><span style={{ color: "#64748b" }}>Abrir Supabase</span></a>
        <Link href="/dashboard" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Campus</strong><br /><span style={{ color: "#64748b" }}>Revisar el área de estudio</span></Link>
        <Link href="/" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Web pública</strong><br /><span style={{ color: "#64748b" }}>Comprobar cursos y precios</span></Link>
      </div>
    </main>
  );
}
