"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type ClaimResponse = {
  ok?: boolean;
  newAccount?: boolean;
  email?: string;
  temporaryPassword?: string | null;
  nextStep?: string;
  error?: string;
  code?: string;
};

function AltaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkout = useMemo(
    () => searchParams.get("checkout")?.trim() || "",
    [searchParams]
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [existingAccount, setExistingAccount] = useState(false);
  const [existingPassword, setExistingPassword] = useState("");

  const [createdAccount, setCreatedAccount] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [nextStep, setNextStep] = useState("billing");

  async function claimOrder(accessToken?: string): Promise<ClaimResponse> {
    const response = await fetch("/api/checkout/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
      body: JSON.stringify({
        checkout,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      }),
    });

    const data = (await response.json().catch(() => ({}))) as ClaimResponse;

    if (!response.ok) {
      const err = new Error(data.error || "No se pudo crear o vincular el acceso.");
      (err as Error & { code?: string }).code = data.code;
      throw err;
    }

    return data;
  }

  async function signIn(emailValue: string, passwordValue: string) {
    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      });

    if (signInError || !data.session?.access_token) {
      throw new Error(
        signInError?.message || "No se pudo iniciar la sesión."
      );
    }

    return data.session.access_token;
  }

  async function handleCreateAccount(event: FormEvent) {
    event.preventDefault();

    if (!checkout) {
      setError(
        "No se ha podido identificar la compra. Vuelve a la confirmación del pago."
      );
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Completa nombre, correo electrónico y teléfono móvil.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setNotice("");

      const result = await claimOrder();

      setNextStep(result.nextStep || "billing");

      const tempPassword = result.temporaryPassword || "";

      if (!result.email || !tempPassword) {
        throw new Error(
          "La cuenta se ha creado, pero no se han podido recuperar las credenciales de acceso."
        );
      }

      await signIn(result.email, tempPassword);

      setTemporaryPassword(tempPassword);
      setCreatedAccount(true);
      setExistingAccount(false);
      setNotice(
        "Tu cuenta ya está creada y la compra ha quedado vinculada correctamente."
      );
    } catch (err) {
      const claimError = err as Error & { code?: string };

      if (claimError.code === "ACCOUNT_EXISTS") {
        setExistingAccount(true);
        setError("");
        setNotice(
          "Ese correo ya tiene una cuenta en Base12 Academy. Introduce tu contraseña habitual para vincular esta compra."
        );
        return;
      }

      setError(
        claimError.message || "No se pudo completar el alta."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleExistingAccount(event: FormEvent) {
    event.preventDefault();

    if (!existingPassword) {
      setError("Introduce la contraseña de tu cuenta Base12.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setNotice("");

      const accessToken = await signIn(
        email.trim().toLowerCase(),
        existingPassword
      );

      const result = await claimOrder(accessToken);

      router.replace(
        result.nextStep === "classes"
          ? "/dashboard/clases"
          : "/onboarding"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo vincular la compra a tu cuenta."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyTemporaryPassword() {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setPasswordCopied(true);
      window.setTimeout(() => setPasswordCopied(false), 1800);
    } catch {
      setError(
        "No se pudo copiar automáticamente. Selecciona la contraseña y cópiala manualmente."
      );
    }
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== newPasswordRepeat) {
      setError("Las dos contraseñas nuevas no coinciden.");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");

      /*
       * Algunos navegadores tardan en persistir la sesión creada justo
       * después de reclamar la compra. Antes de cambiar la contraseña,
       * comprobamos la sesión y, si se ha perdido, la recuperamos con las
       * credenciales temporales que todavía están en esta pantalla.
       */
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        if (!email.trim() || !temporaryPassword) {
          throw new Error(
            "La sesión ha caducado. Entra con la contraseña temporal y vuelve a intentarlo."
          );
        }

        await signIn(
          email.trim().toLowerCase(),
          temporaryPassword
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setPasswordChanged(true);
      setTemporaryPassword("");
      setNewPassword("");
      setNewPasswordRepeat("");
      setShowPasswordChange(false);
      setNotice("Contraseña actualizada correctamente.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cambiar la contraseña."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  function continueOnboarding() {
    router.replace(
      nextStep === "classes"
        ? "/dashboard/clases"
        : "/onboarding"
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f8fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 18px",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "#ffffff",
          border: "1px solid #dbe4f0",
          borderRadius: "22px",
          boxShadow: "0 22px 60px rgba(15,23,42,0.10)",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            padding: "26px 30px 20px",
            borderBottom: "1px solid #e5eaf1",
          }}
        >
          <img
            src="/images/base12-logo.png"
            alt="Base12 Academy"
            style={{
              height: "58px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              marginBottom: "18px",
            }}
          />

          <div
            style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "#eaf2ff",
              color: "#0751b5",
              fontSize: "12px",
              fontWeight: 800,
              marginBottom: "12px",
            }}
          >
            PAGO CONFIRMADO
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.15,
            }}
          >
            Crea tu acceso a Base12 Academy
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#526176",
              fontSize: "15px",
              lineHeight: 1.55,
            }}
          >
            Ahora vincularemos la compra a tu cuenta. Si ya tienes una cuenta
            Base12, utilizaremos la misma.
          </p>
        </header>

        <div style={{ padding: "26px 30px 30px" }}>
          {!createdAccount && !existingAccount && (
            <form onSubmit={handleCreateAccount}>
              <Field
                label="Nombre y apellidos"
                value={fullName}
                onChange={setFullName}
                autoComplete="name"
                placeholder="Nombre y apellidos"
              />

              <Field
                label="Correo electrónico"
                value={email}
                onChange={setEmail}
                type="email"
                autoComplete="email"
                placeholder="tu@correo.es"
              />

              <Field
                label="Teléfono móvil"
                value={phone}
                onChange={setPhone}
                type="tel"
                autoComplete="tel"
                placeholder="+34 600 000 000"
              />

              <button
                type="submit"
                disabled={loading}
                style={primaryButtonStyle(loading)}
              >
                {loading ? "Creando acceso..." : "Crear mi acceso"}
              </button>
            </form>
          )}

          {existingAccount && !createdAccount && (
            <form onSubmit={handleExistingAccount}>
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: "14px",
                  background: "#eef5ff",
                  border: "1px solid #bfdbfe",
                  marginBottom: "20px",
                  lineHeight: 1.5,
                }}
              >
                <strong>Ya tienes una cuenta Base12.</strong>
                <div style={{ marginTop: "5px", color: "#40516a" }}>
                  {email.trim().toLowerCase()}
                </div>
              </div>

              <Field
                label="Contraseña de tu cuenta"
                value={existingPassword}
                onChange={setExistingPassword}
                type="password"
                autoComplete="current-password"
                placeholder="Tu contraseña"
              />

              <button
                type="submit"
                disabled={loading}
                style={primaryButtonStyle(loading)}
              >
                {loading
                  ? "Vinculando compra..."
                  : "Entrar y vincular la compra"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                style={secondaryButtonStyle}
              >
                No recuerdo mi contraseña
              </button>

              <button
                type="button"
                onClick={() => {
                  setExistingAccount(false);
                  setExistingPassword("");
                  setError("");
                  setNotice("");
                }}
                style={textButtonStyle}
              >
                Corregir mis datos
              </button>
            </form>
          )}

          {createdAccount && (
            <div>
              <div
                style={{
                  padding: "18px",
                  borderRadius: "15px",
                  background: "#ecfdf3",
                  border: "1px solid #bbf7d0",
                  marginBottom: "20px",
                }}
              >
                <strong style={{ fontSize: "17px" }}>
                  Tu cuenta está preparada.
                </strong>
                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#3d5f4b",
                    lineHeight: 1.5,
                  }}
                >
                  La sesión ya está iniciada y la compra ha quedado vinculada a
                  este acceso.
                </p>
              </div>

              {!passwordChanged && temporaryPassword && (
                <>
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontWeight: 800,
                      fontSize: "14px",
                    }}
                  >
                    Contraseña generada
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "stretch",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        padding: "13px 14px",
                        borderRadius: "12px",
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        fontFamily: "Consolas, monospace",
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {temporaryPassword}
                    </div>

                    <button
                      type="button"
                      onClick={copyTemporaryPassword}
                      style={{
                        border: "1px solid #b8c6d9",
                        borderRadius: "12px",
                        background: "#ffffff",
                        padding: "0 16px",
                        cursor: "pointer",
                        fontWeight: 800,
                        color: "#0f3d7a",
                      }}
                    >
                      {passwordCopied ? "Copiada" : "Copiar"}
                    </button>
                  </div>

                  <p
                    style={{
                      margin: "0 0 20px",
                      color: "#64748b",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    Guárdala. Puedes utilizarla tal como está o cambiarla ahora
                    por otra que recuerdes mejor.
                  </p>

                  {!showPasswordChange ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordChange(true);
                        setError("");
                      }}
                      style={secondaryButtonStyle}
                    >
                      Cambiar contraseña ahora
                    </button>
                  ) : (
                    <form
                      onSubmit={handleChangePassword}
                      style={{
                        padding: "18px",
                        borderRadius: "14px",
                        border: "1px solid #dbe4f0",
                        background: "#f8fafc",
                        marginBottom: "16px",
                      }}
                    >
                      <Field
                        label="Nueva contraseña"
                        value={newPassword}
                        onChange={setNewPassword}
                        type="password"
                        autoComplete="new-password"
                        placeholder="Mínimo 8 caracteres"
                      />

                      <Field
                        label="Repite la nueva contraseña"
                        value={newPasswordRepeat}
                        onChange={setNewPasswordRepeat}
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repite la contraseña"
                      />

                      <button
                        type="submit"
                        disabled={changingPassword}
                        style={primaryButtonStyle(changingPassword)}
                      >
                        {changingPassword
                          ? "Guardando..."
                          : "Guardar nueva contraseña"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword("");
                          setNewPasswordRepeat("");
                          setError("");
                        }}
                        style={textButtonStyle}
                      >
                        Mantener la contraseña generada
                      </button>
                    </form>
                  )}
                </>
              )}

              {passwordChanged && (
                <div
                  style={{
                    padding: "15px 17px",
                    borderRadius: "14px",
                    background: "#eef5ff",
                    border: "1px solid #bfdbfe",
                    marginBottom: "18px",
                    color: "#174b8f",
                    lineHeight: 1.5,
                  }}
                >
                  La contraseña ha sido cambiada. A partir de ahora utilizarás
                  la nueva contraseña que acabas de elegir.
                </div>
              )}

              <button
                type="button"
                onClick={continueOnboarding}
                style={primaryButtonStyle(false)}
              >
                Continuar
              </button>
            </div>
          )}

          {notice && (
            <div
              style={{
                marginTop: "18px",
                padding: "13px 15px",
                borderRadius: "12px",
                background: "#eef5ff",
                border: "1px solid #bfdbfe",
                color: "#174b8f",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {notice}
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                marginTop: "18px",
                padding: "13px 15px",
                borderRadius: "12px",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#9f1239",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


export default function AltaPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#f5f8fc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 18px",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#0f172a",
          }}
        >
          Preparando tu acceso...
        </main>
      }
    >
      <AltaContent />
    </Suspense>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: FieldProps) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: "17px",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "14px",
          fontWeight: 800,
        }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px 14px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          fontSize: "15px",
          outline: "none",
        }}
      />
    </label>
  );
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    background: disabled ? "#94a3b8" : "#0b4fc2",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #b8c6d9",
  borderRadius: "12px",
  padding: "13px 18px",
  background: "#ffffff",
  color: "#0b4fc2",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
  marginTop: "12px",
};

const textButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#526176",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
  padding: "12px 8px 0",
};
