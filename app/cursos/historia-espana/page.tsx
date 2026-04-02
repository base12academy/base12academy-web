import Link from "next/link";

const COLORS = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#1f2937",
  muted: "#6b7280",
  primary: "#2563eb",
};

export default function CursoHistoriaEspanaPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* HERO */}
        <section
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
          }}
        >
          <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "12px" }}>
            Historia de España para la EBAU / PAU
          </h1>

          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: COLORS.primary,
              marginBottom: "16px",
            }}
          >
            Construye · Comprende · Domina
          </div>

          <p style={{ fontSize: "18px", color: COLORS.muted, marginBottom: "20px" }}>
            Preparación completa para entender el temario, estructurar respuestas
            correctamente y aspirar a nota alta.
          </p>

          <p style={{ fontSize: "14px", color: COLORS.muted }}>
            Acceso online completo
          </p>

          <p style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}>
            17 € / mes
          </p>

          <Link
            href="/comprar"
            style={{
              padding: "14px 22px",
              background: COLORS.primary,
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            Comprar acceso
          </Link>
        </section>

        {/* RESULTADO */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Qué vas a conseguir
          </h2>

          <div style={{ lineHeight: "1.8" }}>
            <p>✔️ Comprender el temario en profundidad</p>
            <p>✔️ Responder con estructura y claridad</p>
            <p>✔️ Evitar errores típicos de examen</p>
            <p>✔️ Mejorar tu nota de forma progresiva</p>
          </div>
        </section>

        {/* EN QUÉ CONSISTE */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            En qué consiste el curso
          </h2>

          <p style={{ color: COLORS.muted, lineHeight: "1.7" }}>
            El curso incluye temario estructurado por temas, vídeos explicativos,
            test y práctica guiada, junto con imágenes comentadas tipo EBAU / PAU.
          </p>
        </section>

        {/* MÉTODO (sin revelar todo) */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Cómo se estudia
          </h2>

          <p style={{ color: COLORS.muted, lineHeight: "1.7" }}>
            El curso sigue un método estructurado que permite avanzar tema a tema
            con comprensión real, evitando la memorización superficial y mejorando
            la capacidad de explicación.
          </p>
        </section>

        {/* TEST */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Cómo se trabajan los test
          </h2>

          <p style={{ color: COLORS.muted, lineHeight: "1.7" }}>
            Los test están diseñados para reforzar el aprendizaje, detectar errores
            y consolidar conocimientos, siguiendo una progresión adaptada al examen.
          </p>
        </section>

        {/* PARA QUIÉN */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Para quién es este curso
          </h2>

          <p style={{ color: COLORS.muted, lineHeight: "1.7" }}>
            Para estudiantes que quieren entender el temario, mejorar su forma de
            estudiar y preparar el examen con una base sólida para sacar mejor nota.
          </p>
        </section>

        {/* ACCESO + DATOS */}
        <section
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "20px",
            padding: "32px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Acceso al curso
          </h2>

          <p style={{ marginBottom: "12px" }}>
            El acceso se activa automáticamente tras el pago.
          </p>

          <p style={{ marginBottom: "20px", color: COLORS.muted }}>
            Para adaptar mejor la experiencia, se solicitarán algunos datos:
          </p>

          <div style={{ lineHeight: "1.8", marginBottom: "24px" }}>
            <p>✔️ Comunidad autónoma</p>
            <p>✔️ Centro educativo</p>
            <p>✔️ Fecha aproximada del examen</p>
          </div>

          <Link
            href="/comprar"
            style={{
              padding: "14px 22px",
              background: COLORS.primary,
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            Comprar acceso
          </Link>
        </section>
      </div>
    </main>
  );
}