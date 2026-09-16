import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://base12academy.es").replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/banco-opositores", "/banco-opositores/convocatoria/"],
      disallow: ["/api/", "/dashboard/", "/admin/", "/banco-opositores/alertas"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
