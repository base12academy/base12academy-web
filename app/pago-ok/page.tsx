import Link from "next/link";

export default function PagoOkPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "48px 24px",
        color: "#111827",
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #86efac",
              borderRadius: "999px",
              padding: "8px 14px",
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            Pago realizado correctamente
          </div>

          <h1
            style={{
              fontSize: "36px",
              lineHeight: "1.2",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Ya puedes entrar a Base12 Academy
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#4b5563",
              marginBottom: "24px",
            }}
          >
            Hemos recibido tu pago. Si tu operación ha sido aprobada, tu acceso
            queda activado automáticamente.
          </p>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
              Qué hacer ahora
            </p>

            <div style={{ display: "grid", gap: "10px", lineHeight: "1.7" }}>
              <p>1. Entra con tu usuario.</p>
              <p>2. Accede al dashboard.</p>
              <p>3. Empieza a estudiar Historia de España.</p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
  <Link
    href="/login"
    style={{
      display: "inline-block",
      textAlign: "center",
      padding: "16px 20px",
      background: "#2563eb",
      color: "white",
      borderRadius: "14px",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    Entrar ahora
  </Link>

  <Link
    href="/dashboard/seleccion-temas"
    style={{
      display: "inline-block",
      textAlign: "center",
      padding: "14px 20px",
      background: "#111827",
      color: "white",
      borderRadius: "14px",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    Elegir mis 25 temas
  </Link>

  <Link
    href="/dashboard"
    style={{
      display: "inline-block",
      textAlign: "center",
      padding: "14px 20px",
      background: "#e5e7eb",
      color: "#111827",
      borderRadius: "14px",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    Ir al dashboard
  </Link>
</div>

          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              lineHeight: "1.7",
            }}
          >
            Si acabas de pagar y todavía no ves el acceso, entra de nuevo con tu
            cuenta y espera unos segundos. Si el problema continúa, escribe a
            base12academy@gmail.com o WhatsApp 604 896 760.
          </p>
        </div>
      </section>
    </main>
  );
}