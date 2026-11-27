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
    { url: `${base}/tropa-y-marineria/base12-training`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cursos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/bachillerato-pau`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/urbiuni`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/urbiuni/buscar`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const supabase = getSupabase();
    // The API caps each response at 1,000 rows; .limit(20_000) alone silently
    // drops the remaining calls. Read bounded pages with a stable ordering.
    const calls: Array<{ slug: string; last_official_update: string; updated_at: string }> = [];
    for (let offset = 0; offset < 20_000; offset += 1000) {
      const { data, error } = await supabase
        .from("opposition_calls")
        .select("slug,last_official_update,updated_at")
        .eq("active", true)
        .order("id", { ascending: true })
        .range(offset, offset + 999);
      if (error) throw error;
      calls.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    return [
      ...staticRoutes,
      ...calls.map((call) => ({
        url: `${base}/banco-opositores/convocatoria/${call.slug}`,
        lastModified: call.updated_at || call.last_official_update,
        changeFrequency: "daily" as const,
        priority: 0.72,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
