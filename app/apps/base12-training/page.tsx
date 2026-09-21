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
      { url: `${TRAINING_ORIGIN}/icons/base12-training.ico?v=16`, type: "image/x-icon" },
      { url: `${TRAINING_ORIGIN}/images/training/base12-training-app-192-v16.png`, sizes: "192x192", type: "image/png" },
      { url: `${TRAINING_ORIGIN}/images/training/base12-training-app-512-v16.png`, sizes: "512x512", type: "image/png" },
    ],
    shortcut: [
      { url: `${TRAINING_ORIGIN}/images/training/base12-training-app-192-v16.png`, type: "image/png" },
    ],
    apple: [
      { url: `${TRAINING_ORIGIN}/images/training/base12-training-180-v16.png`, sizes: "180x180", type: "image/png" },
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
