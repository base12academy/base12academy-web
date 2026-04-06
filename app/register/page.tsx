"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaExamen, setFechaExamen] = useState("");
  const [message, setMessage] = useState("");

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const [codigoAcceso, setCodigoAcceso] = useState("");

  const handleRegister = async () => {
    setMessage("");

    if (!email.includes("@")) {
      setMessage("Introduce un correo válido");
      return;
    }

    if (!fechaExamen) {
      setMessage("Debes indicar la fecha de tu examen");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      );
      return;
    }

    const response = await supabase.auth.signUp({
      email,
      password,
    });

    if (response.error) {
      setMessage("Error auth: " + response.error.message);
      return;
    }

    const user = response.data?.user;

    if (!user) {
      setMessage("Error: no se ha creado el usuario");
      return;
    }

    const referralCode =
      "B12-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const accesoManual = codigoAcceso === "FAMILIA2026";

    const { error } = await supabase.from("perfiles").upsert([
  {
    user_id: user.id,
    email: user.email,
    referral_code: referralCode,
    fecha_examen: fechaExamen,
    acceso: accesoManual,
  },
]);

    if (error) {
      setMessage("Error DB: " + error.message);
      return;
    }

    setMessage("Registro correcto. Revisa tu correo para confirmar la cuenta.");
  };

  return (
    <div style={{ padding: "32px", maxWidth: "420px", margin: "0 auto" }}>
      <h1>Registro</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          marginBottom: "12px",
          padding: "10px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          padding: "10px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

<input
  type="date"
  value={fechaExamen}
  onChange={(e) => setFechaExamen(e.target.value)}
  style={{
    display: "block",
    marginBottom: "12px",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

<input
  type="text"
  placeholder="Código de acceso (opcional)"
  value={codigoAcceso}
  onChange={(e) => setCodigoAcceso(e.target.value)}
  style={{
    display: "block",
    marginBottom: "12px",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

      <div style={{ marginBottom: "14px", fontSize: "14px", color: "#374151" }}>
        <div>{hasMinLength ? "✅" : "⬜"} Al menos 8 caracteres</div>
        <div>{hasUppercase ? "✅" : "⬜"} Una mayúscula</div>
        <div>{hasLowercase ? "✅" : "⬜"} Una minúscula</div>
        <div>{hasNumber ? "✅" : "⬜"} Un número</div>
      </div>

      <button
        onClick={handleRegister}
        style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: "#111827",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Registrarse
      </button>

      <p style={{ marginTop: "12px" }}>{message}</p>
    </div>
  );
}