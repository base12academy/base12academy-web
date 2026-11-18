"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./materials.module.css";

type MaterialsAccess = {
  plan: string;
  region: { label: string; href: string | null } | null;
  regions: { slug: string; label: string }[];
  suggestedRegion: string | null;
};
type PackageKind = "core" | "region";

const errors: Record<number, string> = {
  401: "Inicia sesión para acceder a los materiales.",
  403: "Tu cuenta necesita una matrícula activa en este curso.",
};

async function requestMaterials(slug: string, options: { kind?: PackageKind; region?: string } = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error(errors[401]);
  const params = options.kind ? `?package=${options.kind}` : "";
  const response = await fetch(`/api/oposiciones/haciendas-universidades/${slug}${params}`, {
    method: options.region ? "POST" : "GET",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: options.region ? JSON.stringify({ region: options.region }) : undefined,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(errors[response.status] || "El material no está disponible en este momento.");
  return response.json();
}

export default function Materials({ slug, title, classroomHref }: { slug: string; title: string; classroomHref?: string }) {
  const [access, setAccess] = useState<MaterialsAccess | null>(null);
  const [loadError, setLoadError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [chosenRegion, setChosenRegion] = useState("");

  useEffect(() => {
    let active = true;
    requestMaterials(slug).then(data => {
      if (active) {
        setAccess(data);
        setChosenRegion(data.suggestedRegion ?? "");
      }
    }).catch(error => {
      if (active) setLoadError(error.message);
    });
    return () => { active = false; };
  }, [slug]);

  async function download(kind: PackageKind) {
    setLoading(true);
    setDownloadError("");
    try {
      const { url } = await requestMaterials(slug, { kind });
      window.location.assign(url);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "No se ha podido iniciar la descarga.");
    } finally {
      setLoading(false);
    }
  }

  async function selectRegion() {
    setLoading(true);
    setDownloadError("");
    try {
      await requestMaterials(slug, { region: chosenRegion });
      setAccess(await requestMaterials(slug));
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "No se ha podido guardar el módulo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <Link href={classroomHref ?? "/dashboard/mis-cursos"}>{classroomHref ? "Volver al aula" : "Volver a Mis cursos"}</Link>
        <h1>{title}</h1>
        {loadError ? <p role="alert">{loadError}</p> : !access ? <p role="status">Cargando materiales…</p> : (
          <>
            <div className={styles.card}>
              <h2>Paquete {access.plan}</h2>
              <p>Materiales del bloque común del curso.</p>
              <button type="button" disabled={loading} onClick={() => download("core")}>Descargar paquete ZIP</button>
            </div>
            <div className={styles.card}>
              <h2>Módulo autonómico</h2>
              {access.region ? (
                <>
                  <p>{access.region.label}</p>
                  {access.region.href ? <Link className={styles.action} href={access.region.href}>Abrir módulo</Link>
                    : <button type="button" disabled={loading} onClick={() => download("region")}>Descargar módulo ZIP</button>}
                </>
              ) : (
                <form onSubmit={event => { event.preventDefault(); void selectRegion(); }}>
                  <label htmlFor="region">Elige la comunidad de tu oposición.</label>
                  <select id="region" value={chosenRegion} onChange={event => setChosenRegion(event.target.value)} required>
                    <option value="">Selecciona una comunidad autónoma</option>
                    {access.regions.map(region => <option key={region.slug} value={region.slug}>{region.label}</option>)}
                  </select>
                  <p>La comunidad que confirmes quedará asociada a esta matrícula.</p>
                  <button type="submit" disabled={loading || !chosenRegion}>Confirmar comunidad</button>
                </form>
              )}
            </div>
            {downloadError && <p role="alert">{downloadError}</p>}
          </>
        )}
      </div>
    </section>
  );
}
