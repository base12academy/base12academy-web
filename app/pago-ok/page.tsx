"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PagoOkPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const startVideo = async () => {
      try {
        await video.play();
      } catch {
        setAutoplayBlocked(true);
      }
    };

    startVideo();
  }, []);

  const completeCommunicationsVideo = async () => {
    if (finishing) return;

    try {
      setFinishing(true);
      setError("");

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          step: "communications_video",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo registrar el vídeo de bienvenida."
        );
      }

      router.replace("/onboarding");
    } catch (err) {
      setFinishing(false);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo continuar con el onboarding."
      );
    }
  };

  const handleStartVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      await video.play();
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#06152f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
        }}
      >
        <video
          ref={videoRef}
          src="/videos/VB00_Bienvenida_Comunicaciones.mp4"
          autoPlay
          playsInline
          controls
          onEnded={completeCommunicationsVideo}
          style={{
            width: "100%",
            display: "block",
            borderRadius: "18px",
            background: "#000000",
            boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          }}
        />

        {autoplayBlocked && !finishing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(6,21,47,0.72)",
              borderRadius: "18px",
            }}
          >
            <button
              type="button"
              onClick={handleStartVideo}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "18px 30px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              Comenzar bienvenida
            </button>
          </div>
        )}

        {finishing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(6,21,47,0.82)",
              borderRadius: "18px",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Preparando tu acceso...
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "14px 18px",
              borderRadius: "12px",
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#9f1239",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {error}

            <button
              type="button"
              onClick={completeCommunicationsVideo}
              style={{
                marginLeft: "12px",
                border: "none",
                background: "#155eef",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "8px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
          </div>
        )}
      </section>
    </main>
  );
}