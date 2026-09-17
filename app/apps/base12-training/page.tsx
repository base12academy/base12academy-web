import type { Metadata } from "next";
import TrainingApp from "@/components/training/TrainingApp";
import TrainingInstallButton from "@/components/training/TrainingInstallButton";

export const metadata: Metadata = {
  title: "Base12 Training | Base12 Academy",
  description: "Entrena las cuatro pruebas físicas de Tropa y Marinería, registra tus marcas y progresa con Carlos IA.",
  applicationName: "Base12 Training",
  manifest: "/apps/base12-training/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Base12 Training",
  },
  icons: {
    icon: [
      { url: "/images/training/base12-training-192.png", sizes: "192x192", type: "image/png" },
      { url: "/apps/base12-training/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/images/training/base12-training-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function Base12TrainingAppPage() {
  return (
    <>
      <TrainingApp />
      <TrainingInstallButton />
    </>
  );
}
