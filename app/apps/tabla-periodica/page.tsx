import type { Metadata } from "next";
import PeriodicTableApp from "./PeriodicTableApp";

export const metadata: Metadata = {
  title: "Tabla Periódica Interactiva | Base12 Academy",
  description: "Explora los 118 elementos, compara propiedades periódicas y resuelve dudas con Clara.",
  manifest: "/apps/tabla-periodica/manifest.webmanifest",
  applicationName: "Tabla Periódica Interactiva",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tabla Periódica",
  },
  icons: {
    icon: [
      { url: "/icons/tabla-periodica-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/tabla-periodica-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/tabla-periodica-apple.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function PeriodicTablePage() {
  return <PeriodicTableApp />;
}
