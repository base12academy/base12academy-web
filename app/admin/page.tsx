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
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [codeCourse, setCodeCourse] = useState("ofimatica");
  const [codePlan, setCodePlan] = useState("esencial");
  const [accessMonths, setAccessMonths] = useState("6");
  const [validDays, setValidDays] = useState("30");
  const [generatedCode, setGeneratedCode] = useState("");
  const [generatingCode, setGeneratingCode] = useState(false);

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

  const handleGenerateCode = async () => {
    setMessage("");
    setGeneratedCode("");
    setGeneratingCode(true);
    const { data } = await supabase.auth.getSession();
    const response = await fetch("/api/admin/access-codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session?.access_token}`,
      },
      body: JSON.stringify({
        email: beneficiaryEmail,
        courseSlug: codeCourse,
        planSlug: codePlan,
        accessMonths: Number(accessMonths),
        validDays: Number(validDays),
      }),
    });
    const result = await response.json();
    if (!response.ok) setMessage(result.error || "No se pudo crear la clave.");
    else setGeneratedCode(result.code);
    setGeneratingCode(false);
  };

  const codeEmailHref = generatedCode
    ? `mailto:${encodeURIComponent(beneficiaryEmail.trim())}?subject=${encodeURIComponent("Tu clave personal de acceso a Base12 Academy")}&body=${encodeURIComponent(
        `Hola:\n\nTe enviamos una clave personal para acceder gratuitamente al curso ${codeCourse}, modalidad ${codePlan}, durante ${accessMonths} meses.\n\nCLAVE PERSONAL: ${generatedCode}\n\nEsta clave es individual, de un solo uso e intransferible. Solo puede vincularse a una cuenta de Base12 Academy registrada con este mismo correo electrónico: ${beneficiaryEmail.trim()}\n\nPara utilizarla:\n1. Regístrate o inicia sesión en Base12 Academy con este correo.\n2. Abre la pantalla de acceso al curso.\n3. Introduce la clave en el apartado \"Activar con clave\".\n4. Acepta las condiciones de contratación y la política de privacidad.\n\nLa clave debe canjearse en un plazo de ${validDays} días. Una vez vinculada, no podrá utilizarse en otra cuenta.\n\nUn saludo,\nAdministración de Base12 Academy\nImagen Digital Ménace, S. L. U.`
      )}`
    : "#";

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
      <section style={{ marginTop: 24, padding: 22, border: "1px solid #dbe3ef", borderRadius: 16 }}>
        <h2>Crear una clave personal gratuita</h2>
        <p>La clave quedará ligada al correo indicado, será de un solo uso y no podrá utilizarla otra cuenta.</p>
        <div style={{ display: "grid", gap: 12, maxWidth: 620 }}>
          <label>Correo del beneficiario<input type="email" value={beneficiaryEmail} onChange={(e) => setBeneficiaryEmail(e.target.value)} style={{ width: "100%", padding: 10 }} /></label>
          <label>Curso (identificador)<input value={codeCourse} onChange={(e) => setCodeCourse(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} style={{ width: "100%", padding: 10 }} /></label>
          <label>Modalidad
            <select value={codePlan} onChange={(e) => setCodePlan(e.target.value)} style={{ width: "100%", padding: 10 }}>
              <option value="esencial">Esencial</option><option value="estandar">Estándar</option><option value="premium">Premium</option><option value="pau">PAU</option><option value="standard">General</option>
            </select>
          </label>
          <label>Meses de acceso<input type="number" min="1" max="36" value={accessMonths} onChange={(e) => setAccessMonths(e.target.value)} style={{ width: "100%", padding: 10 }} /></label>
          <label>Días para utilizar la clave<input type="number" min="1" max="365" value={validDays} onChange={(e) => setValidDays(e.target.value)} style={{ width: "100%", padding: 10 }} /></label>
          <button onClick={handleGenerateCode} disabled={generatingCode || !beneficiaryEmail} style={{ padding: 12, border: 0, borderRadius: 10, background: "#0f3f92", color: "white", fontWeight: 800 }}>
            {generatingCode ? "Creando…" : "Crear clave personal"}
          </button>
          {generatedCode && (
            <div style={{ padding: 14, background: "#ecfdf5", borderRadius: 10 }}>
              <p><b>Clave:</b> <code>{generatedCode}</code><br />Guárdala ahora: no volverá a mostrarse.</p>
              <a href={codeEmailHref} style={{ display: "inline-block", marginTop: 8, padding: "10px 14px", borderRadius: 9, background: "#166534", color: "white", textDecoration: "none", fontWeight: 800 }}>
                Preparar correo con la clave
              </a>
              <p style={{ marginBottom: 0, fontSize: 13 }}>Se abrirá el correo ya redactado para que puedas revisarlo antes de enviarlo.</p>
            </div>
          )}
        </div>
      </section>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
        <a href="https://vercel.com/base12academys-projects/base12academy-web" target="_blank" rel="noreferrer" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Publicación web</strong><br /><span style={{ color: "#64748b" }}>Abrir Vercel</span></a>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Alumnos y datos</strong><br /><span style={{ color: "#64748b" }}>Abrir Supabase</span></a>
        <Link href="/dashboard" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Campus</strong><br /><span style={{ color: "#64748b" }}>Revisar el área de estudio</span></Link>
        <Link href="/" style={{ padding: 20, border: "1px solid #dbe3ef", borderRadius: 16, textDecoration: "none", color: "#0f172a" }}><strong>Web pública</strong><br /><span style={{ color: "#64748b" }}>Comprobar cursos y precios</span></Link>
      </div>
    </main>
  );
}
