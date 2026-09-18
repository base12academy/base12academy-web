"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TRAINING_HOST = "training.base12academy.es";
const TRAINING_URL = `https://${TRAINING_HOST}`;
const TRAINING_SW = "/training-sw.js";

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
      void navigator.serviceWorker.getRegistration("/").then(async (registration) => {
        const script = registration?.active?.scriptURL || registration?.waiting?.scriptURL || registration?.installing?.scriptURL || "";
        if (registration && !script.endsWith(TRAINING_SW)) {
          await registration.unregister();
          await navigator.serviceWorker.register(TRAINING_SW, { scope: "/", updateViaCache: "none" });
          return;
        }
        if (!registration) {
          await navigator.serviceWorker.register(TRAINING_SW, { scope: "/", updateViaCache: "none" });
          return;
        }
        await registration.update();
      }).catch(() => undefined);
    }

    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) setInstalled(true);

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
          <Image src="/images/training/base12-training-192.png" alt="" width={92} height={92} style={{ borderRadius: 16 }} />
          <h2 style={{ fontSize: 19, margin: "10px 0 8px" }}>Instala Base12 Training</h2>
          <p style={{ margin: 0, lineHeight: 1.45, fontSize: 14 }}>En Android o en ordenador, abre el menú del navegador y elige <b>Instalar aplicación</b>. En iPhone o iPad, abre la página en Safari, pulsa <b>Compartir</b> y después <b>Añadir a pantalla de inicio</b>.</p>
          <p style={{ margin: "10px 0 0", lineHeight: 1.45, fontSize: 13 }}>La aplicación se instala desde training.base12academy.es y queda separada del campus de Base12 Academy.</p>
        </div>
      )}
    </div>
  );
}
