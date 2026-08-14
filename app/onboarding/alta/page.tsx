"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AltaAlumnoPage() {
  const router = useRouter();

  const [checkoutToken, setCheckoutToken] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [existingAccount, setExistingAccount] = useState(false);
  const [existingPassword, setExistingPassword] = useState("");

  const [generatedPassword, setGeneratedPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("checkout")?.trim() ?? "";

    if (!token) {
      setError(
        "No se ha encontrado la referencia de la compra."
      );
      return;
    }

    setCheckoutToken(token);
  }, []);

  async function claimPurchase(accessToken?: string) {
    const response = await fetch("/api/checkout/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify({
        checkout: checkoutToken,
        fullName,
        email,
        phone,
      }),
    });

    const data = await response.json().catch(() => ({}));

    return {
      response,
      data,
    };
  }

  async function handleCreateAccount() {
    if (!checkoutToken || loading) return;

    setLoading(true);
    setError("");

    try {
      const normalizedName = fullName.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = phone.trim();

      if (normalizedName.length < 3) {
        throw new Error(
          "Indica tu nombre y apellidos."
        );
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        throw new Error(
          "Indica un correo electrónico válido."
        );
      }

      if (normalizedPhone.length < 6) {
        throw new Error(
          "Indica un número de móvil válido."
        );
      }

      const { response, data } =
        await claimPurchase();

      if (
        response.status === 409 &&
        data.code === "ACCOUNT_EXISTS"
      ) {
        setExistingAccount(true);
        setError(
          "Ya existe una cuenta Base12 con este correo. Introduce su contraseña para vincular esta nueva compra."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo completar el alta."
        );
      }

      if (
        data.newAccount &&
        data.temporaryPassword
      ) {
        /*
         * La contraseña se genera en el servidor.
         * Iniciamos automáticamente la sesión
         * del alumno.
         */
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: data.temporaryPassword,
          });

        if (loginError) {
          throw new Error(
            "La cuenta se ha creado, pero no se pudo iniciar la sesión automáticamente."
          );
        }

        /*
         * La mostramos una sola vez para que
         * el alumno pueda guardarla.
         */
        setGeneratedPassword(
          data.temporaryPassword
        );

        return;
      }

      router.replace("/onboarding");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo completar el alta."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleExistingAccount() {
    if (!checkoutToken || loading) return;

    setLoading(true);
    setError("");

    try {
      const normalizedEmail =
        email.trim().toLowerCase();

      if (!existingPassword) {
        throw new Error(
          "Introduce la contraseña de tu cuenta Base12."
        );
      }

      const {
        data: loginData,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: existingPassword,
        });

      if (
        loginError ||
        !loginData.session?.access_token
      ) {
        throw new Error(
          "El correo o la contraseña no son correctos."
        );
      }

      const { response, data } =
        await claimPurchase(
          loginData.session.access_token
        );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo vincular la compra."
        );
      }

      router.replace("/onboarding");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo vincular la cuenta."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyPassword() {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(
        generatedPassword
      );
    } catch {
      // El alumno puede copiarla manualmente.
    }
  }

  if (generatedPassword) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f7faff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          color: "#102447",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "620px",
            background: "#ffffff",
            border: "1px solid #dbe5f3",
            borderRadius: "20px",
            padding: "34px",
            boxShadow:
              "0 16px 45px rgba(15,49,92,0.10)",
          }}
        >
          <img
            src="/images/base12-logo.png"
            alt="Base12 Academy"
            style={{
              height: "58px",
              width: "auto",
              objectFit: "contain",
              marginBottom: "28px",
            }}
          />

          <h1
            style={{
              fontFamily: "Georgia, serif",
              color: "#102d62",
              margin: "0 0 12px",
            }}
          >
            Tu cuenta está creada
          </h1>

          <p
            style={{
              color: "#50617e",
              lineHeight: 1.6,
            }}
          >
            Base12 ha generado tu contraseña de
            acceso. Guárdala para poder entrar de
            nuevo con tu correo electrónico.
          </p>

          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              borderRadius: "14px",
              background: "#f1f6ff",
              border: "1px solid #d4e2f7",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#607089",
                marginBottom: "8px",
              }}
            >
              TU CONTRASEÑA
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "14px",
              }}
            >
              <strong
                style={{
                  fontSize: "20px",
                  letterSpacing: "0.5px",
                  wordBreak: "break-all",
                }}
              >
                {generatedPassword}
              </strong>

              <button
                type="button"
                onClick={copyPassword}
                style={{
                  border:
                    "1px solid #b9cbea",
                  background: "#ffffff",
                  color: "#155eef",
                  borderRadius: "9px",
                  padding: "9px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Copiar
              </button>
            </div>
          </div>

          <p
            style={{
              marginTop: "16px",
              color: "#607089",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Podrás cambiarla posteriormente desde
            tu cuenta.
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace("/onboarding")
            }
            style={{
              width: "100%",
              marginTop: "22px",
              border: "none",
              borderRadius: "11px",
              padding: "14px 20px",
              background: "#155eef",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continuar con mi alta →
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7faff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#102447",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "#ffffff",
          border: "1px solid #dbe5f3",
          borderRadius: "20px",
          padding: "34px",
          boxShadow:
            "0 16px 45px rgba(15,49,92,0.10)",
        }}
      >
        <img
          src="/images/base12-logo.png"
          alt="Base12 Academy"
          style={{
            height: "58px",
            width: "auto",
            objectFit: "contain",
            marginBottom: "26px",
          }}
        />

        <h1
          style={{
            fontFamily: "Georgia, serif",
            color: "#102d62",
            margin: "0 0 10px",
          }}
        >
          Crea tu acceso a Base12 Academy
        </h1>

        <p
          style={{
            margin: "0 0 26px",
            color: "#50617e",
            lineHeight: 1.6,
          }}
        >
          Tu pago ya está confirmado. Completa
          estos datos para crear tu cuenta y
          vincularla con tu matrícula.
        </p>

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <label
            style={{
              display: "grid",
              gap: "7px",
              fontWeight: 700,
              color: "#16346b",
            }}
          >
            Nombre y apellidos
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Ej.: Ana Martín García"
              disabled={existingAccount}
              style={inputStyle}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "7px",
              fontWeight: 700,
              color: "#16346b",
            }}
          >
            Correo electrónico
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="ana@correo.com"
              disabled={existingAccount}
              style={inputStyle}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "7px",
              fontWeight: 700,
              color: "#16346b",
            }}
          >
            Nº de móvil
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="+34 612 345 678"
              disabled={existingAccount}
              style={inputStyle}
            />
          </label>

          {existingAccount && (
            <label
              style={{
                display: "grid",
                gap: "7px",
                fontWeight: 700,
                color: "#16346b",
              }}
            >
              Contraseña de tu cuenta Base12
              <input
                type="password"
                autoComplete="current-password"
                value={existingPassword}
                onChange={(event) =>
                  setExistingPassword(
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </label>
          )}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              marginTop: "20px",
              padding: "13px 15px",
              borderRadius: "10px",
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#9f1239",
              lineHeight: 1.5,
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={loading || !checkoutToken}
          onClick={
            existingAccount
              ? handleExistingAccount
              : handleCreateAccount
          }
          style={{
            width: "100%",
            marginTop: "24px",
            border: "none",
            borderRadius: "11px",
            padding: "14px 20px",
            background: "#155eef",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 700,
            cursor:
              loading || !checkoutToken
                ? "wait"
                : "pointer",
            opacity:
              loading || !checkoutToken
                ? 0.7
                : 1,
          }}
        >
          {loading
            ? "Creando tu acceso..."
            : existingAccount
              ? "Vincular compra a mi cuenta"
              : "Crear mi cuenta y continuar"}
        </button>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #cad7ea",
  borderRadius: "10px",
  fontSize: "15px",
  color: "#102447",
  background: "#ffffff",
  boxSizing: "border-box",
};