"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");

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
      setMessage("Error: no se ha creado user en Auth");
      return;
    }

    const referralCode =
      "B12-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase.from("perfiles").upsert([
      {
        id: user.id,
        email: user.email,
        referral_code: referralCode,
      },
    ]);

    if (error) {
      setMessage("Error DB: " + error.message);
      return;
    }

    setMessage("Usuario registrado correctamente ✅");
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1>Registro</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <button onClick={handleRegister}>
        Registrarse
      </button>

      <p style={{ marginTop: "10px" }}>{message}</p>
    </div>
  );
}