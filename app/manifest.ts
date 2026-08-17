import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Base12 Academy",
    short_name: "Base12",
    description: "Formación online de Base12 Academy.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#0b4ea2",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/base12-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/base12-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/base12-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
