"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectTema() {
  const params = useParams();
  const router = useRouter();

  const slug = params.tema as string;

  useEffect(() => {
    router.replace(`/dashboard/tema/${slug}`);
  }, [slug, router]);

  return <p style={{ padding: "32px" }}>Redirigiendo...</p>;
}