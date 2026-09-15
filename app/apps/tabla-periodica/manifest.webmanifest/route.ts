import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "B12 Tabla Periódica Interactiva",
    short_name: "Tabla Periódica",
    description: "118 elementos y sus datos, con apoyo de IA.",
    id: "/apps/tabla-periodica",
    start_url: "/apps/tabla-periodica",
    scope: "/apps/tabla-periodica",
    display: "standalone",
    background_color: "#f3f7f5",
    theme_color: "#153c32",
    orientation: "any",
    icons: [
      { src: "/icons/tabla-periodica-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/tabla-periodica-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/tabla-periodica-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
