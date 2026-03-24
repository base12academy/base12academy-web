"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { temasHistoria } from "../../../../lib/temas";
import { canAccessTopic, getTopicLockState } from "@/lib/topic-access";
import { supabase } from "@/lib/supabaseClient";

export default function TemaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  const tema = temasHistoria.find((t) => t.slug === slug);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const { data } = user
        ? await supabase
            .from("user_badges")
            .select("badge_id")
            .eq("user_id", user.id)
        : { data: [] as { badge_id: string }[] };

      const userBadges = data?.map((item) => item.badge_id) ?? [];
      const canAccess = canAccessTopic(slug, userBadges);
      const access = getTopicLockState(slug, userBadges);

      setAllowed(canAccess);
      setReason(access.reason);
      setLoading(false);
    };

    if (slug) {
      checkAccess();
    }
  }, [slug]);

  useEffect(() => {
    if (!loading && !tema) {
      router.replace("/dashboard");
    }
  }, [loading, tema, router]);

  if (!tema) {
    return null;
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          color: "#111827",
          padding: "40px 24px",
        }}
      >
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <p>Cargando...</p>
        </section>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          color: "#111827",
          padding: "40px 24px",
        }}
      >
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              marginBottom: "20px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ← Volver al dashboard
          </Link>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            🔒 Tema bloqueado
          </h1>

          <p style={{ color: "#4b5563", marginBottom: "24px" }}>
            {reason || "No puedes acceder todavía a este tema."}
          </p>

          <Link
            href="/dashboard/test"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: "12px",
              background: "#111827",
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Ir al test
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
        padding: "40px 24px",
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Volver al dashboard
        </Link>

        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          {tema.titulo}
        </h1>

        <p style={{ color: "#4b5563", marginBottom: "24px" }}>
          {tema.descripcion}
        </p>

        <div style={{ marginBottom: "24px" }}>
          <iframe
            width="100%"
            height="400"
            src={tema.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            title={tema.titulo}
            style={{ border: "none", borderRadius: "12px" }}
            allowFullScreen
          />
        </div>

        <article style={{ lineHeight: "1.8", marginBottom: "24px" }}>
          {tema.contenido}
        </article>

        {tema.slug === "tema-1" && (
          <Link
            href="/dashboard/test"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: "12px",
              background: "#111827",
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Hacer test del Tema 1
          </Link>
        )}
      </section>
    </main>
  );
}