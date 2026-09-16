export type LandingSearchParams = Record<
  string,
  string | string[] | undefined
>;

const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "gad_source",
] as const;

export type CampaignParams = Partial<Record<(typeof CAMPAIGN_KEYS)[number], string>>;

export function getCampaignParams(searchParams: LandingSearchParams): CampaignParams {
  return CAMPAIGN_KEYS.reduce<CampaignParams>((result, key) => {
    const rawValue = searchParams[key];
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim();
    }

    return result;
  }, {});
}

export function withCampaignParams(href: string, campaign: CampaignParams) {
  if (href.startsWith("#") || Object.keys(campaign).length === 0) {
    return href;
  }

  const [pathAndQuery, hash = ""] = href.split("#", 2);
  const [path, query = ""] = pathAndQuery.split("?", 2);
  const params = new URLSearchParams(query);

  for (const [key, value] of Object.entries(campaign)) {
    if (value) params.set(key, value);
  }

  const nextQuery = params.toString();
  return `${path}${nextQuery ? `?${nextQuery}` : ""}${hash ? `#${hash}` : ""}`;
}
