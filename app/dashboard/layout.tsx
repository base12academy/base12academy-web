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

  const isHistoria =
    pathname === "/dashboard/historia-espana" ||
    pathname.startsWith("/dashboard/tema/");

  const linkStyle = (path: string) => ({
    color: pathname === path ? "white" : "#9ca3af",
    textDecoration: "none",
    fontWeight: pathname === path ? "bold" : "normal",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isHistoria ? (
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
              Área de estudio
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
              {temasHistoria.map((tema) => (
                <Link
                  key={tema.slug}
                  href={`/dashboard/tema/${tema.slug}`}
                  style={{
                    color: pathname === `/dashboard/tema/${tema.slug}` ? "white" : "#9ca3af",
                    textDecoration: "none",
                    fontWeight:
                      pathname === `/dashboard/tema/${tema.slug}` ? "bold" : "normal",
                  }}
                >
                  {tema.titulo}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
      ) : null}

      <main style={{ flex: 1, padding: "40px" }}>
        {children}
        <ChatBot />
      </main>
    </div>
  );
}