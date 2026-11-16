import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/opo12",
    name: "Opo12 · Simulacros de oposición",
    short_name: "Opo12",
    description: "Simulacros de oposición con el formato de la convocatoria oficial.",
    start_url: "/opo12",
    scope: "/opo12",
    display: "standalone",
    background_color: "#F4F7FA",
    theme_color: "#082B5C",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/opo12.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/opo12.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
