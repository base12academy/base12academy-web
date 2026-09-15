"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallButton({
  appName = "Base12 Academy",
  iconSrc = "/images/base12-logo.png",
  buttonLabel = "Instalar app",
}: {
  appName?: string;
  iconSrc?: string;
  buttonLabel?: string;
} = {}) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
        .then((registration) => registration.update())
        .catch(() => undefined);
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
      const userAgent = navigator.userAgent;
      setPlatform(/android/i.test(userAgent) ? "android" : /iphone|ipad|ipod/i.test(userAgent) ? "ios" : "other");
      setIsChrome(/chrome|crios/i.test(userAgent) && !/edg|opr|samsungbrowser/i.test(userAgent));
      setShowHelp(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  }

  if (installed) return null;

  const automaticInstallAvailable = installPrompt !== null;
  const visibleLabel = automaticInstallAvailable ? buttonLabel : "Cómo instalar en este móvil";
  const chromeIntent = "intent://base12academy.es/apps/tabla-periodica#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Fbase12academy.es%2Fapps%2Ftabla-periodica;end";

  return (
    <>
      <button type="button" className="pwa-install-button" onClick={install} aria-haspopup="dialog">
        <span aria-hidden="true">↓</span> {visibleLabel}
      </button>
      {showHelp && (
        <div className="pwa-help-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowHelp(false)}>
          <section className="pwa-help-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-help-title">
            <button type="button" className="pwa-help-close" onClick={() => setShowHelp(false)} aria-label="Cerrar">×</button>
            <Image
              src={iconSrc}
              alt=""
              width={iconSrc.includes("tabla-periodica") ? 112 : 150}
              height={iconSrc.includes("tabla-periodica") ? 112 : 58}
              style={iconSrc.includes("tabla-periodica") ? { width: 112, height: 112, borderRadius: 24 } : undefined}
            />
            <h2 id="pwa-help-title">Instala {appName}</h2>
            <p><b>No se descarga un APK.</b> El navegador instala esta web como una aplicación y coloca su icono junto a las demás aplicaciones.</p>
            {platform === "android" && (
              <>
                <p><b>En Android:</b> abre el menú ⋮ del navegador y pulsa <b>Instalar aplicación</b> o <b>Añadir a pantalla de inicio</b>. Si estás dentro de Gmail, WhatsApp u otra aplicación, abre primero la página en Chrome.</p>
                {!isChrome && <a className="pwa-help-open-browser" href={chromeIntent}>Abrir ahora en Google Chrome</a>}
              </>
            )}
            {platform === "ios" && <p><b>En iPhone o iPad:</b> abre esta página en Safari, pulsa Compartir y elige <b>Añadir a pantalla de inicio</b>.</p>}
            {platform === "other" && <p><b>En ordenador:</b> abre el menú del navegador y selecciona <b>Instalar aplicación</b>. En Chrome también puede aparecer un icono de instalación en la barra de direcciones.</p>}
            <button type="button" className="pwa-help-understood" onClick={() => setShowHelp(false)}>Entendido</button>
          </section>
        </div>
      )}
    </>
  );
}
