"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TRAINING_HOST = "training.base12academy.es";
const TRAINING_URL = `https://${TRAINING_HOST}`;

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function TrainingInstallButton() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.location.hostname !== TRAINING_HOST) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((registration) => registration.update())
        .catch(() => undefined);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (window.location.hostname !== TRAINING_HOST) {
      window.location.assign(TRAINING_URL);
      return;
    }

    if (!promptEvent) {
      setHelp(true);
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }

  if (installed) return null;

  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 60 }}>
      <button
        type="button"
        onClick={install}
        style={{ border: 0, borderRadius: 999, padding: "12px 17px", background: "#176b45", color: "#fff", fontWeight: 800, boxShadow: "0 8px 24px rgba(0,0,0,.18)", cursor: "pointer" }}
      >
        Instalar Base12 Training
      </button>
      {help && (
        <div role="dialog" aria-modal="true" aria-label="Instalar Base12 Training" style={{ position: "absolute", right: 0, bottom: 54, width: 310, maxWidth: "calc(100vw - 36px)", padding: 18, borderRadius: 16, background: "white", color: "#17352d", boxShadow: "0 14px 40px rgba(0,0,0,.22)", border: "1px solid #d8e5dc" }}>
          <button type="button" onClick={() => setHelp(false)} aria-label="Cerrar" style={{ position: "absolute", right: 10, top: 8, border: 0, background: "transparent", fontSize: 24, cursor: "pointer" }}>×</button>
          <Image src="/images/training/base12-training-192.png?v=5" alt="Logotipo oficial de Base12 Training" width={76} height={76} style={{ borderRadius: 16 }} />
          <h2 style={{ fontSize: 19, margin: "10px 0 8px" }}>Instala Base12 Training</h2>
          <p style={{ margin: 0, lineHeight: 1.45, fontSize: 14 }}>Si ya instalaste una versión anterior que abre Base12 Academy, desinstálala primero. Después recarga esta página y vuelve a instalar Base12 Training.</p>
          <p style={{ margin: "10px 0 0", lineHeight: 1.45, fontSize: 13 }}>La aplicación correcta se instalará desde training.base12academy.es y quedará vinculada al logotipo oficial de Training.</p>
        </div>
      )}
    </div>
  );
}
