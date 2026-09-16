import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBCHEM_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON";
const OUTPUT = path.join(process.cwd(), "data", "chemistry", "elements.json");

const spanishNames = [
  "Hidrógeno", "Helio", "Litio", "Berilio", "Boro", "Carbono", "Nitrógeno", "Oxígeno", "Flúor", "Neón",
  "Sodio", "Magnesio", "Aluminio", "Silicio", "Fósforo", "Azufre", "Cloro", "Argón", "Potasio", "Calcio",
  "Escandio", "Titanio", "Vanadio", "Cromo", "Manganeso", "Hierro", "Cobalto", "Níquel", "Cobre", "Zinc",
  "Galio", "Germanio", "Arsénico", "Selenio", "Bromo", "Kriptón", "Rubidio", "Estroncio", "Itrio", "Circonio",
  "Niobio", "Molibdeno", "Tecnecio", "Rutenio", "Rodio", "Paladio", "Plata", "Cadmio", "Indio", "Estaño",
  "Antimonio", "Telurio", "Yodo", "Xenón", "Cesio", "Bario", "Lantano", "Cerio", "Praseodimio", "Neodimio",
  "Prometio", "Samario", "Europio", "Gadolinio", "Terbio", "Disprosio", "Holmio", "Erbio", "Tulio", "Iterbio",
  "Lutecio", "Hafnio", "Tántalo", "Wolframio", "Renio", "Osmio", "Iridio", "Platino", "Oro", "Mercurio",
  "Talio", "Plomo", "Bismuto", "Polonio", "Astato", "Radón", "Francio", "Radio", "Actinio", "Torio",
  "Protactinio", "Uranio", "Neptunio", "Plutonio", "Americio", "Curio", "Berkelio", "Californio", "Einstenio", "Fermio",
  "Mendelevio", "Nobelio", "Lawrencio", "Rutherfordio", "Dubnio", "Seaborgio", "Bohrio", "Hasio", "Meitnerio", "Darmstatio",
  "Roentgenio", "Copernicio", "Nihonio", "Flerovio", "Moscovio", "Livermorio", "Teneso", "Oganesón",
];

const aliases = {
  30: ["cinc"], 36: ["criptón"], 40: ["zirconio"], 53: ["iodo"], 73: ["tantalio"],
  74: ["volframio", "tungsteno"], 103: ["laurencio"], 108: ["hassio"], 110: ["darmstadtio"],
};

// CIAAW 2024, tabla abreviada. Para elementos sin peso atómico estándar se
// conserva entre corchetes el número másico publicado por PubChem/IUPAC.
const ciaaw2024 = {
  1:"1.0080",2:"4.0026",3:"6.94",4:"9.0122",5:"10.81",6:"12.011",7:"14.007",8:"15.999",9:"18.998",10:"20.180",
  11:"22.990",12:"24.305",13:"26.982",14:"28.085",15:"30.974",16:"32.06",17:"35.45",18:"39.95",19:"39.098",20:"40.078",
  21:"44.956",22:"47.867",23:"50.942",24:"51.996",25:"54.938",26:"55.845",27:"58.933",28:"58.693",29:"63.546",30:"65.38",
  31:"69.723",32:"72.630",33:"74.922",34:"78.971",35:"79.904",36:"83.798",37:"85.468",38:"87.62",39:"88.906",40:"91.222",
  41:"92.906",42:"95.95",44:"101.07",45:"102.91",46:"106.42",47:"107.87",48:"112.41",49:"114.82",50:"118.71",51:"121.76",
  52:"127.60",53:"126.90",54:"131.29",55:"132.91",56:"137.33",57:"138.91",58:"140.12",59:"140.91",60:"144.24",62:"150.36",
  63:"151.96",64:"157.25",65:"158.93",66:"162.50",67:"164.93",68:"167.26",69:"168.93",70:"173.05",71:"174.97",72:"178.49",
  73:"180.95",74:"183.84",75:"186.21",76:"190.23",77:"192.22",78:"195.08",79:"196.97",80:"200.59",81:"204.38",82:"207.2",
  83:"208.98",90:"232.04",91:"231.04",92:"238.03",
};

const categoryMap = {
  "Actinide": "actínido",
  "Alkali metal": "metal alcalino",
  "Alkaline earth metal": "metal alcalinotérreo",
  "Halogen": "halógeno",
  "Lanthanide": "lantánido",
  "Metalloid": "metaloide",
  "Noble gas": "gas noble",
  "Nonmetal": "no metal",
  "Post-transition metal": "metal postransición",
  "Transition metal": "metal de transición",
};

const stateMap = {
  "Expected to be a Gas": "gas previsto",
  "Expected to be a Solid": "sólido previsto",
  "Gas": "gas",
  "Liquid": "líquido",
  "Solid": "sólido",
};

function periodFor(atomicNumber) {
  if (atomicNumber <= 2) return 1;
  if (atomicNumber <= 10) return 2;
  if (atomicNumber <= 18) return 3;
  if (atomicNumber <= 36) return 4;
  if (atomicNumber <= 54) return 5;
  if (atomicNumber <= 86) return 6;
  return 7;
}

function groupFor(atomicNumber) {
  const shortPeriods = {
    1: 1, 2: 18,
    3: 1, 4: 2, 5: 13, 6: 14, 7: 15, 8: 16, 9: 17, 10: 18,
    11: 1, 12: 2, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18,
  };
  if (shortPeriods[atomicNumber]) return shortPeriods[atomicNumber];
  if (atomicNumber >= 19 && atomicNumber <= 36) return atomicNumber - 18;
  if (atomicNumber >= 37 && atomicNumber <= 54) return atomicNumber - 36;
  if (atomicNumber === 55 || atomicNumber === 87) return 1;
  if (atomicNumber === 56 || atomicNumber === 88) return 2;
  if (atomicNumber >= 72 && atomicNumber <= 86) return atomicNumber - 68;
  if (atomicNumber >= 104 && atomicNumber <= 118) return atomicNumber - 100;
  return null;
}

function blockFor(atomicNumber, group) {
  if ((atomicNumber >= 57 && atomicNumber <= 71) || (atomicNumber >= 89 && atomicNumber <= 103)) return "f";
  if (atomicNumber === 2 || (group !== null && group <= 2)) return "s";
  if (group !== null && group >= 13) return "p";
  return "d";
}

function numberOrNull(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

const response = await fetch(PUBCHEM_URL);
if (!response.ok) throw new Error(`PubChem respondió ${response.status}`);
const payload = await response.json();
const columns = payload.Table.Columns.Column;

const elements = payload.Table.Row.map(({ Cell }) => {
  const row = Object.fromEntries(columns.map((column, index) => [column, Cell[index] ?? ""]));
  const atomicNumber = Number(row.AtomicNumber);
  const group = groupFor(atomicNumber);
  const pubchemMass = row.AtomicMass;
  const representativeMassNumber = Math.round(Number(pubchemMass.replace(/[\[\]]/g, "")));
  const atomicMass = ciaaw2024[atomicNumber] ?? `[${representativeMassNumber}]`;
  const atomicMassKind = ciaaw2024[atomicNumber] ? "standard" : "longest-lived-isotope";

  return {
    atomicNumber,
    symbol: row.Symbol,
    name: spanishNames[atomicNumber - 1],
    englishName: row.Name,
    aliases: aliases[atomicNumber] ?? [],
    atomicMass,
    atomicMassKind,
    electronConfiguration: row.ElectronConfiguration.replace("(predicted)", "(prevista)").trim(),
    electronegativity: numberOrNull(row.Electronegativity),
    atomicRadiusPm: numberOrNull(row.AtomicRadius),
    ionizationEnergyEv: numberOrNull(row.IonizationEnergy),
    electronAffinityEv: numberOrNull(row.ElectronAffinity),
    oxidationStates: row.OxidationStates ? row.OxidationStates.split(",").map((value) => value.trim()) : [],
    standardState: stateMap[row.StandardState],
    meltingPointK: numberOrNull(row.MeltingPoint),
    boilingPointK: numberOrNull(row.BoilingPoint),
    densityGcm3: numberOrNull(row.Density),
    category: categoryMap[row.GroupBlock],
    discovered: row.YearDiscovered === "Ancient" ? "Antigüedad" : row.YearDiscovered,
    period: periodFor(atomicNumber),
    group,
    block: blockFor(atomicNumber, group),
  };
});

if (elements.length !== 118 || spanishNames.length !== 118) {
  throw new Error(`Se esperaban 118 elementos y se obtuvieron ${elements.length}`);
}

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sources: [
    { name: "PubChem Periodic Table (NIH)", url: PUBCHEM_URL, fields: "configuración electrónica, propiedades físicas, familia y descubrimiento" },
    { name: "CIAAW Abridged Standard Atomic Weights 2024", url: "https://ciaaw.org/abridged-atomic-weights.htm", fields: "pesos atómicos estándar abreviados" },
    { name: "RSEQ: nombres y símbolos en español", url: "https://rseq.org/mat-didacticos/nombres-y-simbolos-en-espanol-de-los-elementos-aceptados-por-la-iupac-el-28-de-noviembre-de-2016-acordados-por-la-rac-la-rae-la-rseq-y-la-fundeu/", fields: "nombres y variantes en español" },
  ],
  elements,
}, null, 2)}\n`, "utf8");

console.log(`Generados ${elements.length} elementos en ${OUTPUT}`);
