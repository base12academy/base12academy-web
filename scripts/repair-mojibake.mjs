import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const cp1252Bytes = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function asCp1252Byte(character) {
  const codePoint = character.codePointAt(0);

  if (codePoint <= 0xff) {
    return codePoint;
  }

  return cp1252Bytes.get(codePoint);
}

function utf8SequenceLength(firstByte) {
  if (firstByte >= 0xc2 && firstByte <= 0xdf) return 2;
  if (firstByte >= 0xe0 && firstByte <= 0xef) return 3;
  if (firstByte >= 0xf0 && firstByte <= 0xf4) return 4;
  return 0;
}

function repairOnce(input) {
  const characters = Array.from(input);
  let output = "";

  for (let index = 0; index < characters.length; ) {
    const firstByte = asCp1252Byte(characters[index]);
    const length = firstByte === undefined ? 0 : utf8SequenceLength(firstByte);

    if (length > 0 && index + length <= characters.length) {
      const bytes = characters
        .slice(index, index + length)
        .map(asCp1252Byte);
      const hasValidContinuations = bytes
        .slice(1)
        .every((byte) => byte !== undefined && byte >= 0x80 && byte <= 0xbf);

      if (hasValidContinuations) {
        const decoded = Buffer.from(bytes).toString("utf8");

        if (!decoded.includes("\ufffd")) {
          output += decoded;
          index += length;
          continue;
        }
      }
    }

    output += characters[index];
    index += 1;
  }

  return output;
}

export function repairMojibake(input) {
  let repaired = input;

  for (let pass = 0; pass < 4; pass += 1) {
    const next = repairOnce(repaired);
    if (next === repaired) break;
    repaired = next;
  }

  return repaired;
}

async function run(paths) {
  for (const path of paths) {
    const source = await readFile(path, "utf8");
    const repaired = repairMojibake(source);

    if (repaired !== source) {
      await writeFile(path, repaired, "utf8");
      console.log(`Reparado: ${path}`);
    } else {
      console.log(`Sin cambios: ${path}`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const paths = process.argv.slice(2);

  if (paths.length === 0) {
    console.error("Indica al menos un archivo que reparar.");
    process.exitCode = 1;
  } else {
    await run(paths);
  }
}
