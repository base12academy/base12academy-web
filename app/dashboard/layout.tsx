"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatBot from "@/components/ChatBot";
import { temasHistoria } from "@/lib/temas";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const linkStyle = (path: string) => ({
    color: pathname === path ? "white" : "#9ca3af",
    textDecoration: "none",
    fontWeight: pathname === path ? "bold" : "normal",
  });

  return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "250px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Base12 Academy</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <Link href="/dashboard" style={linkStyle("/dashboard")}>
            Dashboard
          </Link>

          <Link
            href="/dashboard/historia-espana"
            style={linkStyle("/dashboard/historia-espana")}
          >
            Historia de España
          </Link>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginLeft: "12px",
            }}
          >
           {temasHistoria.map((tema) => {
  const icono =
    tema.estado === "completado"
      ? "✓"
      : tema.estado === "en-progreso"
      ? "⏳"
      : "🔒";

  const texto = `Tema ${tema.slug.split("-")[1]} ${icono}`;

  if (tema.estado === "bloqueado") {
    return (
      <span
        key={tema.slug}
        style={{
          color: "#6b7280",
          marginLeft: "12px",
          cursor: "not-allowed",
        }}
      >
        {texto}
      </span>
    );
  }

  return (
    <Link
      key={tema.slug}
      href={`/dashboard/historia-espana/${tema.slug}`}
      style={{
        ...linkStyle(`/dashboard/historia-espana/${tema.slug}`),
        marginLeft: "12px",
      }}
    >
      {texto}
    </Link>
  );
})}
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "40px" }}>
  {children}
  <ChatBot />
</main>
    </div>
    );
}