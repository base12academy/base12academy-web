export const oppositionTerritories = [
  ["Andalucía", "Almería|Cádiz|Córdoba|Granada|Huelva|Jaén|Málaga|Sevilla"],
  ["Aragón", "Huesca|Teruel|Zaragoza"],
  ["Asturias", "Asturias"],
  ["Illes Balears", "Illes Balears/Islas Baleares/Baleares"],
  ["Canarias", "Las Palmas|Santa Cruz de Tenerife"],
  ["Cantabria", "Cantabria"],
  ["Castilla-La Mancha", "Albacete|Ciudad Real|Cuenca|Guadalajara|Toledo"],
  ["Castilla y León", "Ávila|Burgos|León|Palencia|Salamanca|Segovia|Soria|Valladolid|Zamora"],
  ["Cataluña", "Barcelona|Girona/Gerona|Lleida/Lérida|Tarragona"],
  ["Comunitat Valenciana", "Alicante/Alacant|Castellón/Castelló|Valencia/València"],
  ["Extremadura", "Badajoz|Cáceres"],
  ["Galicia", "A Coruña/La Coruña|Lugo|Ourense/Orense|Pontevedra"],
  ["La Rioja", "La Rioja"],
  ["Madrid", "Madrid"],
  ["Murcia", "Murcia"],
  ["Navarra", "Navarra"],
  ["País Vasco", "Álava/Araba|Bizkaia/Vizcaya|Gipuzkoa/Guipúzcoa"],
  ["Ceuta", ""],
  ["Melilla", ""],
] as const;

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const provinces = new Map(oppositionTerritories.flatMap(([territory, names]) =>
  names.split("|").filter(Boolean).flatMap(name =>
    name.split("/").map(alias => [normalize(alias), { territory, province: name.split("/")[0] }] as const)
  )
));

export function boeGeography(title: string, department: string) {
  const local = title.match(/\b(?:Ayuntamiento|Diputación(?: Provincial)?)\s+de\s+([^,]+),/i)?.[1];
  const tagged = local?.match(/\(([^()]+)\)\s*$/)?.[1];
  const province = tagged && tagged.split("/").map(alias => provinces.get(normalize(alias))).find(Boolean);
  const locality = local && /\bAyuntamiento\s+de\b/i.test(title) ? local.replace(/\s*\([^()]+\)\s*$/, "") : null;
  const territory = oppositionTerritories.find(([name]) => {
    const heading = normalize(department);
    return (heading.startsWith("comunidad ") || heading.startsWith("ciudad ")) && heading.includes(normalize(name));
  })?.[0];
  const city = locality === "Ceuta" || locality === "Melilla" ? locality : null;
  return { territory: province ? province.territory : territory ?? city ?? "España", province: province ? province.province : null, locality };
}

export function madridDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
