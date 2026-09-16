import type { ReactNode } from "react";
import MatematicasIIGlossaryLauncher from "@/components/MatematicasIIGlossaryLauncher";

export default function MatematicasIILayout({ children }: { children: ReactNode }) {
  return <>
    {children}
    <MatematicasIIGlossaryLauncher />
  </>;
}
