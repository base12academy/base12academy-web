import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase/server";
import { territoryPages } from "@/lib/oppositions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://base12academy.es").replace(/\/$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/banco-opositores`, changeFrequency: "daily", priority: 0.95 },
    ...territoryPages.map((territory) => ({
      url: `${base}/banco-opositores/${territory.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: `${base}/tropa-y-marineria`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cursos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/bachillerato-pau`, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("opposition_calls")
      .select("slug,last_official_update")
      .eq("active", true)
      .order("last_official_update", { ascending: false })
      .limit(20_000);
    return [
      ...staticRoutes,
      ...(data ?? []).map((call) => ({
        url: `${base}/banco-opositores/convocatoria/${call.slug}`,
        lastModified: call.last_official_update,
        changeFrequency: "daily" as const,
        priority: 0.72,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
