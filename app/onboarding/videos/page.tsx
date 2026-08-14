"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const onboardingVideos = [
  {
    step: "vb01",
    src: "/videos/VB01_Bienvenida_y_primer_recorrido_NUEVO.mp4",
    label: "Bienvenida y primer recorrido",
  },
  {
    step: "vb02",
    src: "/videos/VB02_Trabajar_cada_contenido.mp4",
    label: "Cómo trabajar cada contenido",
  },
  {
    step: "vb03",
    src: "/videos/VB03_Retos_progreso_y_acompanamiento.mp4",
    label: "Retos, progreso y acompañamiento",
  },
] as const;

export default function OnboardingVideosPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [error, setError] = useState("");

  async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        setLoading(true);
        setError("");

        const accessToken = await getAccessToken();

        if (!accessToken) {
          router.replace("/login");
          return;
        }

        const response = await fetch("/api/onboarding", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || "No se pudo cargar el progreso de bienvenida."
          );
        }

        if (!active) return;

        if (data.currentStep === "vb02") {
          setIndex(1);
        } else if (data.currentStep === "vb03") {
          setIndex(2);
        } else if (data.currentStep === "completed") {
          router.replace("/dashboard");
          return;
        } else {
          setIndex(0);
        }
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la bienvenida."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const video = videoRef.current;

    if (!video) return;

    video.load();

    const playVideo = async () => {
      try {
        await video.play();
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
      }
    };

    playVideo();
  }, [index, loading]);

  async function handleVideoEnded() {
    if (saving) return;

    try {
      setSaving(true);
      setError("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        router.replace("/login");
        return;
      }

      const currentVideo = onboardingVideos[index];

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          step: currentVideo.step,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo registrar el progreso de bienvenida."
        );
      }

      if (index < onboardingVideos.length - 1) {
        setIndex((current) => current + 1);
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo continuar con la bienvenida."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStartVideo() {
    const video = videoRef.current;

    if (!video) return;

    try {
      await video.play();
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#06152f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Preparando tu bienvenida...
      </main>
    );
  }

  const currentVideo = onboardingVideos[index];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#06152f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
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
          key={currentVideo.src}
          ref={videoRef}
          src={currentVideo.src}
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

        <div
          style={{
            marginTop: "14px",
            color: "#ffffff",
            textAlign: "center",
            fontSize: "14px",
            opacity: 0.82,
          }}
        >
          {currentVideo.label} · {index + 1} de {onboardingVideos.length}
        </div>

        {autoplayBlocked && !saving && (
          <div
            style={{
              position: "absolute",
              inset: "0 0 34px 0",
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
              Continuar bienvenida
            </button>
          </div>
        )}

        {saving && (
          <div
            style={{
              position: "absolute",
              inset: "0 0 34px 0",
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
            Continuando...
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
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}
      </section>
    </main>
  );
}