export const bundledOppositionEnrollment = {
  "administrativos-haciendas-locales": true,
  "auxiliares-haciendas-locales": true,
  "administrativos-universidades": false,
  "auxiliares-universidades": false,
} as const;

export const plans = { esencial: "Esencial", estandar: "Estándar", premium: "Premium" } as const;
export type PackagePlan = keyof typeof plans;

type Course = { title: string; files: Record<PackagePlan, string> };
type Region = { label: string; aliases: string[]; files?: Record<PackagePlan, string> };

export const packageCourses: Record<string, Course> = {
  "administrativos-haciendas-locales": {
    "title": "Administrativos de Haciendas Locales",
    "files": {
      "esencial": "Base12_Haciendas_Locales_Esencial.zip",
      "estandar": "Base12_Haciendas_Locales_Estandar.zip",
      "premium": "Base12_Haciendas_Locales_Premium.zip"
    }
  },
  "auxiliares-haciendas-locales": {
    "title": "Auxiliares Administrativos de Haciendas Locales",
    "files": {
      "esencial": "Base12_Auxiliares_Ayuntamiento_C2_Esencial.zip",
      "estandar": "Base12_Auxiliares_Ayuntamiento_C2_Estandar.zip",
      "premium": "Base12_Auxiliares_Ayuntamiento_C2_Premium.zip"
    }
  },
  "administrativos-universidades": {
    "title": "Administrativos de Universidades",
    "files": {
      "esencial": "Base12_Administrativo_C1_Universidades_Esencial.zip",
      "estandar": "Base12_Administrativo_C1_Universidades_Estandar.zip",
      "premium": "Base12_Administrativo_C1_Universidades_Premium.zip"
    }
  },
  "auxiliares-universidades": {
    "title": "Auxiliares Administrativos de Universidades",
    "files": {
      "esencial": "Base12_Universidades_Auxiliar_C2_Esencial.zip",
      "estandar": "Base12_Universidades_Auxiliar_C2_Estandar.zip",
      "premium": "Base12_Universidades_Auxiliar_C2_Premium.zip"
    }
  }
};

export const packageRegions: Record<string, Region> = {
  "andalucia": {
    "label": "Andalucía",
    "aliases": []
  },
  "aragon": {
    "label": "Aragón",
    "aliases": []
  },
  "canarias": {
    "label": "Canarias",
    "aliases": []
  },
  "cantabria": {
    "label": "Cantabria",
    "aliases": []
  },
  "castilla-la-mancha": {
    "label": "Castilla-La Mancha",
    "aliases": []
  },
  "castilla-y-leon": {
    "label": "Castilla y León",
    "aliases": []
  },
  "cataluna": {
    "label": "Cataluña",
    "aliases": [
      "Catalunya"
    ]
  },
  "comunidad-de-madrid": {
    "label": "Comunidad de Madrid",
    "aliases": [
      "Madrid"
    ],
    "files": {
      "esencial": "Base12_Modulo_Autonomico_Comunidad_Madrid_Esencial_2026(1).zip",
      "estandar": "Base12_Modulo_Autonomico_Comunidad_Madrid_Estandar_2026(1).zip",
      "premium": "Base12_Modulo_Autonomico_Comunidad_Madrid_Premium_2026(1).zip"
    }
  },
  "comunidad-valenciana": {
    "label": "Comunitat Valenciana",
    "aliases": [
      "Comunidad Valenciana",
      "Valencia"
    ],
    "files": {
      "esencial": "Base12_Modulo_Autonomico_Valencia_Esencial_2026(1).zip",
      "estandar": "Base12_Modulo_Autonomico_Valencia_Estandar_2026(1).zip",
      "premium": "Base12_Modulo_Autonomico_Valencia_Premium_2026(1).zip"
    }
  },
  "extremadura": {
    "label": "Extremadura",
    "aliases": []
  },
  "galicia": {
    "label": "Galicia",
    "aliases": []
  },
  "illes-balears": {
    "label": "Illes Balears",
    "aliases": [
      "Islas Baleares",
      "Baleares"
    ]
  },
  "la-rioja": {
    "label": "La Rioja",
    "aliases": [
      "Rioja, La"
    ],
    "files": {
      "esencial": "Base12_Modulo_Autonomico_La_Rioja_Esencial_2026.zip",
      "estandar": "Base12_Modulo_Autonomico_La_Rioja_Estandar_2026.zip",
      "premium": "Base12_Modulo_Autonomico_La_Rioja_Premium_2026.zip"
    }
  },
  "navarra": {
    "label": "Comunidad Foral de Navarra",
    "aliases": [
      "Navarra"
    ],
    "files": {
      "esencial": "Base12_Modulo_Autonomico_Navarra_Esencial_2026.zip",
      "estandar": "Base12_Modulo_Autonomico_Navarra_Estandar_2026.zip",
      "premium": "Base12_Modulo_Autonomico_Navarra_Premium_2026.zip"
    }
  },
  "pais-vasco": {
    "label": "País Vasco",
    "aliases": [
      "Euskadi"
    ],
    "files": {
      "esencial": "Base12_Modulo_Autonomico_Pais_Vasco_Esencial_2026.zip",
      "estandar": "Base12_Modulo_Autonomico_Pais_Vasco_Estandar_2026.zip",
      "premium": "Base12_Modulo_Autonomico_Pais_Vasco_Premium_2026.zip"
    }
  },
  "principado-de-asturias": {
    "label": "Principado de Asturias",
    "aliases": [
      "Asturias"
    ]
  },
  "region-de-murcia": {
    "label": "Región de Murcia",
    "aliases": [
      "Murcia"
    ],
    "files": {
      "esencial": "Base12_Modulo_Autonomico_Murcia_Esencial_2026.zip",
      "estandar": "Base12_Modulo_Autonomico_Murcia_Estandar_2026.zip",
      "premium": "Base12_Modulo_Autonomico_Murcia_Premium_2026.zip"
    }
  }
};

export function packageCourse(slug: string) {
  return Object.hasOwn(packageCourses, slug) ? packageCourses[slug] : undefined;
}

export function packageRegion(slug: string) {
  return Object.hasOwn(packageRegions, slug) ? packageRegions[slug] : undefined;
}

export function normalizePlan(plan: string): PackagePlan | null {
  if (plan === "standard") return "estandar";
  return Object.hasOwn(plans, plan) ? (plan as PackagePlan) : null;
}

const planRank: Record<PackagePlan, number> = { esencial: 1, estandar: 2, premium: 3 };

export function strongestPlan<T extends { plan_slug: string }>(enrollments: T[]) {
  return enrollments.reduce<{ enrollment: T; plan: PackagePlan } | null>((best, enrollment) => {
    const plan = normalizePlan(enrollment.plan_slug);
    return plan && (!best || planRank[plan] > planRank[best.plan]) ? { enrollment, plan } : best;
  }, null);
}

const normalizeCommunity = (label: string) => label.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function regionFromProfile(community: string | null | undefined) {
  if (!community) return null;
  const normalized = normalizeCommunity(community);
  return Object.entries(packageRegions).find(([slug, region]) =>
    [slug, region.label, ...region.aliases].some(label => normalizeCommunity(label) === normalized)
  ) ?? null;
}

