"use client";

import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const markInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  async function install() {
    if (!installPrompt) {
      setShowHelp(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  }

  if (installed) return null;

  return (
    <>
      <button type="button" className="pwa-install-button" onClick={install} aria-haspopup="dialog">
        <span aria-hidden="true">↓</span> Instalar app
      </button>
      {showHelp && (
        <div className="pwa-help-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowHelp(false)}>
          <section className="pwa-help-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-help-title">
            <button type="button" className="pwa-help-close" onClick={() => setShowHelp(false)} aria-label="Cerrar">×</button>
            <img src="/images/base12-logo.png" alt="" />
            <h2 id="pwa-help-title">Instala Base12 Academy</h2>
            <p><b>En iPhone o iPad:</b> abre esta página en Safari, pulsa Compartir y elige "Añadir a pantalla de inicio".</p>
            <p><b>En Android u ordenador:</b> abre el menú del navegador y selecciona "Instalar aplicación" o "Añadir a pantalla de inicio".</p>
            <button type="button" className="pwa-help-understood" onClick={() => setShowHelp(false)}>Entendido</button>
          </section>
        </div>
      )}
    </>
  );
}
