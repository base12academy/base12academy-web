"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PagoOkPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

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

  const handleVideoEnded = () => {
    router.replace("/onboarding");
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
          onEnded={handleVideoEnded}
          style={{
            width: "100%",
            display: "block",
            borderRadius: "18px",
            background: "#000000",
            boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          }}
        />

        {autoplayBlocked && (
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
      </section>
    </main>
  );
}
