import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Base12 Training",
    template: "%s · Base12 Training",
  },
  description: "Aplicación de preparación física para las pruebas de Tropa y Marinería.",
  robots: { index: false, follow: false },
};

export default function TrainingLayout({ children }: { children: ReactNode }) {
  return children;
}
