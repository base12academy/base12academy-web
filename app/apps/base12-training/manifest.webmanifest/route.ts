import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Base12 Training",
    short_name: "B12 Training",
    description: "Preparación física de las cuatro pruebas de Tropa y Marinería con seguimiento de marcas y Carlos IA.",
    id: "/apps/base12-training",
    start_url: "/apps/base12-training",
    scope: "/apps/base12-training",
    display: "standalone",
    background_color: "#eef9f1",
    theme_color: "#176b45",
    orientation: "any",
    shortcuts: [
      { name: "Plan", short_name: "Plan", url: "/apps/base12-training/plan" },
      { name: "Biblioteca", short_name: "Biblioteca", url: "/apps/base12-training/biblioteca" },
      { name: "Progreso", short_name: "Progreso", url: "/apps/base12-training/progreso" }
    ],
    icons: [
      {
        src: "/images/banco-opositores/logo-base12-training.png",
        sizes: "any",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/images/banco-opositores/logo-base12-training.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
