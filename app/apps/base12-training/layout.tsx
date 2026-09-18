import type { ReactNode } from "react";

export default function TrainingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        img[alt="Base12 Training"] {
          opacity: 1 !important;
          filter: none !important;
          object-fit: contain !important;
          object-position: center !important;
          clip-path: none !important;
          overflow: visible !important;
          mix-blend-mode: multiply;
        }
        header img[alt="Base12 Training"] {
          width: 140px !important;
          height: auto !important;
          max-height: none !important;
          display: block !important;
        }
      `}</style>
      {children}
    </>
  );
}
