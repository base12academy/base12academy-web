import type { Metadata } from "next";
import TrainingApp from "@/components/training/TrainingApp";
import TrainingInstallButton from "@/components/training/TrainingInstallButton";

const TRAINING_ORIGIN = "https://training.base12academy.es";

export const metadata: Metadata = {
  metadataBase: new URL(TRAINING_ORIGIN),
  title: "Base12 Training",
  description: "Entrena las cuatro pruebas físicas de Tropa y Marinería, registra tus marcas y progresa con Carlos IA.",
  applicationName: "Base12 Training",
  manifest: `${TRAINING_ORIGIN}/manifest.webmanifest`,
  alternates: {
    canonical: `${TRAINING_ORIGIN}/`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Base12 Training",
  },
  icons: {
    icon: [
      { url: `${TRAINING_ORIGIN}/apps/base12-training/icon-192.png?v=8`, sizes: "192x192", type: "image/png" },
      { url: `${TRAINING_ORIGIN}/apps/base12-training/icon-512.png?v=8`, sizes: "512x512", type: "image/png" },
    ],
    shortcut: [
      { url: `${TRAINING_ORIGIN}/apps/base12-training/icon-192.png?v=8`, type: "image/png" },
    ],
    apple: [
      { url: `${TRAINING_ORIGIN}/apps/base12-training/icon-192.png?v=8`, sizes: "192x192", type: "image/png" },
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
