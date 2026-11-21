import { unstable_cache } from "next/cache";
import { parseBoeDetails } from "./boe-details";

export const getBoeOfficialDetails = unstable_cache(async (externalId: string) => {
  if (!/^BOE-A-\d{4}-\d+$/.test(externalId)) return null;
  try {
    const response = await fetch(`https://www.boe.es/diario_boe/xml.php?id=${externalId}`, {
      headers: { Accept: "application/xml" },
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) throw new Error(`BOE ${response.status}`);
    const details = parseBoeDetails(await response.text(), externalId);
    if (!details) throw new Error("BOE sin texto identificable");
    return details;
  } catch (error) {
    // Throw so transient failures are not cached as empty official publications.
    console.warn(`No se pudo ampliar la ficha ${externalId}`, error);
    throw error;
  }
}, ["boe-official-details-v1"], { revalidate: 86_400 });
