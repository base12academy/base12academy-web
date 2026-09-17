import type { ReactNode } from "react";

export default function TrainingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        img[alt="Base12 Training"] {
          opacity: 1 !important;
          filter: none !important;
        }
        header img[alt="Base12 Training"] {
          width: 88px !important;
          height: 88px !important;
          object-fit: contain !important;
        }
      `}</style>
      {children}
    </>
  );
}
