import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Opo12 · Simulacros de oposición",
  description: "Simulacros de oposición ajustados a la convocatoria oficial.",
  manifest: "/opo12/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Opo12" },
  icons: { icon: "/icons/opo12.svg", apple: "/icons/opo12.svg" },
};

export const viewport: Viewport = { themeColor: "#082B5C" };

export default function Opo12Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
