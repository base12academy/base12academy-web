import { NextResponse } from "next/server";

const TRAINING_ORIGIN = "https://training.base12academy.es";

export function GET() {
  return NextResponse.json({
    name: "Base12 Training",
    short_name: "B12 Training",
    description: "Preparación física de las cuatro pruebas de Tropa y Marinería con seguimiento de marcas y Carlos IA.",
    id: `${TRAINING_ORIGIN}/base12-training-v8`,
    start_url: `${TRAINING_ORIGIN}/`,
    scope: `${TRAINING_ORIGIN}/`,
    display: "standalone",
    background_color: "#eef9f1",
    theme_color: "#176b45",
    orientation: "any",
    categories: ["sports", "fitness", "education"],
    shortcuts: [
      { name: "Plan", short_name: "Plan", url: `${TRAINING_ORIGIN}/apps/base12-training/plan` },
      { name: "Biblioteca", short_name: "Biblioteca", url: `${TRAINING_ORIGIN}/apps/base12-training/biblioteca` },
      { name: "Progreso", short_name: "Progreso", url: `${TRAINING_ORIGIN}/apps/base12-training/progreso` }
    ],
    icons: [
      {
        src: `${TRAINING_ORIGIN}/apps/base12-training/icon-192.png?v=8`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `${TRAINING_ORIGIN}/apps/base12-training/icon-512.png?v=8`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `${TRAINING_ORIGIN}/apps/base12-training/icon-maskable-512.png?v=8`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
