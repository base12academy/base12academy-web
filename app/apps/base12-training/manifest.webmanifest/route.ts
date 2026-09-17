import { NextRequest, NextResponse } from "next/server";

const TRAINING_HOST = "training.base12academy.es";
const TRAINING_PATH = "/apps/base12-training";

export function GET(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const standaloneOrigin = host === TRAINING_HOST;

  return NextResponse.json({
    name: "Base12 Training",
    short_name: "B12 Training",
    description: "Preparación física de las cuatro pruebas de Tropa y Marinería con seguimiento de marcas y Carlos IA.",
    id: standaloneOrigin ? "/" : TRAINING_PATH,
    start_url: standaloneOrigin ? "/" : TRAINING_PATH,
    scope: standaloneOrigin ? "/" : TRAINING_PATH,
    display: "standalone",
    background_color: "#eef9f1",
    theme_color: "#176b45",
    orientation: "any",
    categories: ["sports", "fitness", "education"],
    shortcuts: [
      { name: "Plan", short_name: "Plan", url: `${TRAINING_PATH}/plan` },
      { name: "Biblioteca", short_name: "Biblioteca", url: `${TRAINING_PATH}/biblioteca` },
      { name: "Progreso", short_name: "Progreso", url: `${TRAINING_PATH}/progreso` }
    ],
    icons: [
      {
        src: "/images/training/base12-training-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/apps/base12-training/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/apps/base12-training/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
