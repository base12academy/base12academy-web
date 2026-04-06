"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleReset = async () => {
    setLoading(true);
    setMessage("");

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("Contraseña actualizada correctamente ✅");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20 }}>
      <h1>Restablecer contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: "10px", fontSize: "14px", color: "#374151" }}>
        <div>{hasMinLength ? "✅" : "⬜"} Al menos 8 caracteres</div>
        <div>{hasUppercase ? "✅" : "⬜"} Una mayúscula</div>
        <div>{hasLowercase ? "✅" : "⬜"} Una minúscula</div>
        <div>{hasNumber ? "✅" : "⬜"} Un número</div>
      </div>

      <button
        onClick={handleReset}
        disabled={loading}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "#1d4ed8",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Actualizando..." : "Actualizar contraseña"}
      </button>

      {message && (
        <p style={{ marginTop: "15px", color: "#333" }}>{message}</p>
      )}
    </div>
  );
}