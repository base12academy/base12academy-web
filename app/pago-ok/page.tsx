"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PagoOkPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [checkoutToken, setCheckoutToken] = useState("");
  const [paymentReady, setPaymentReady] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("checkout")?.trim() ?? "";

    if (!token) {
      setCheckingPayment(false);
      setError(
        "No se ha encontrado la referencia de la compra."
      );
      return;
    }

    setCheckoutToken(token);

    async function checkPayment(attempt = 0) {
      try {
        const response = await fetch(
          `/api/checkout/status?checkout=${encodeURIComponent(
            token
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json().catch(() => ({}));

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(
            data.error ||
              "No se ha podido comprobar el pago."
          );
        }

        if (data.linked) {
          setCheckingPayment(false);
          router.replace("/onboarding");
          return;
        }

        if (data.paid) {
          setCheckingPayment(false);

          /*
           * Clases Online no utiliza el v?deo general
           * de bienvenida de los cursos.
           */
          if (data.courseSlug === "clases-online") {
            router.replace(
              `/onboarding/alta?checkout=${encodeURIComponent(
                token
              )}&classes=1&plan=${encodeURIComponent(
                data.planSlug || ""
              )}`
            );
            return;
          }

          if (data.communicationsVideoCompleted) {
            router.replace(
              `/onboarding/alta?checkout=${encodeURIComponent(
                token
              )}`
            );
            return;
          }

          setPaymentReady(true);
          return;
        }

        /*
         * La notificación del banco puede llegar
         * unos segundos después que el navegador.
         */
        if (attempt < 20) {
          timer = setTimeout(
            () => checkPayment(attempt + 1),
            1500
          );
          return;
        }

        setCheckingPayment(false);
        setError(
          "El banco todavía no ha confirmado el pago. Espera unos segundos y vuelve a intentarlo."
        );
      } catch (err) {
        if (cancelled) return;

        setCheckingPayment(false);
        setError(
          err instanceof Error
            ? err.message
            : "No se ha podido comprobar el pago."
        );
      }
    }

    checkPayment();

    return () => {
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router]);

  useEffect(() => {
    if (!paymentReady) return;

    const video = videoRef.current;

    if (!video) return;

    const startVideo = async () => {
      try {
        await video.play();
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
      }
    };

    startVideo();
  }, [paymentReady]);

  async function completeCommunicationsVideo() {
    if (finishing || !checkoutToken) return;

    try {
      setFinishing(true);
      setError("");

      const response = await fetch(
        "/api/checkout/status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkout: checkoutToken,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo registrar la bienvenida."
        );
      }

      router.replace(
        `/onboarding/alta?checkout=${encodeURIComponent(
          checkoutToken
        )}`
      );
    } catch (err) {
      setFinishing(false);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo continuar con el alta."
      );
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

  if (checkingPayment) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#06152f",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Confirmando tu pago...
        </div>
      </main>
    );
  }

  if (error && !paymentReady) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#06152f",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              marginBottom: "16px",
              fontSize: "28px",
            }}
          >
            Estamos confirmando tu compra
          </h1>

          <p
            style={{
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "18px",
              border: "none",
              borderRadius: "999px",
              padding: "13px 22px",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Volver a comprobar
          </button>
        </div>
      </main>
    );
  }

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
            boxShadow:
              "0 24px 70px rgba(0,0,0,0.35)",
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
            Preparando tu alta...
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