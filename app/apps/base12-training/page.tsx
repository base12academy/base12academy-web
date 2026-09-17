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
      { url: "/images/banco-opositores/logo-base12-training.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/banco-opositores/logo-base12-training.png", type: "image/png" },
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
