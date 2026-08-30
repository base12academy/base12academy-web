import argparse
import hashlib
import json
import os
import re
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

APTITUDE_MAP = {
    "01_VERBAL": ("verbal", "V"),
    "02_NUMERICO": ("numerico", "N"),
    "03_ESPACIAL": ("espacial", "E"),
    "04_MECANICO": ("mecanico", "M"),
    "05_PERCEPTIVO": ("perceptivo", "P"),
    "06_MEMORIA": ("memoria", "MEM"),
    "07_ABSTRACTO": ("abstracto", "RA"),
}

def extract_docx(path):
    raw = path.read_bytes()
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))

    paragraphs = []
    sections = {}
    current = "cabecera"
    sections[current] = []

    for p in root.findall(".//w:p", NS):
        text = "".join(t.text or "" for t in p.findall(".//w:t", NS)).strip()
        if not text:
            continue

        style = p.find("w:pPr/w:pStyle", NS)
        style_name = style.get("{" + NS["w"] + "}val") if style is not None else ""

        paragraphs.append({"style": style_name, "text": text})

        if style_name == "Heading1":
            current = text
            sections.setdefault(current, [])
        else:
            sections[current].append({"style": style_name, "text": text})

    headings = [x["text"] for x in paragraphs if x["style"] == "Heading1"]

    if len(headings) != 9:
        raise RuntimeError(f"{path.name}: se esperaban 9 secciones y hay {len(headings)}")

    required = [
        "1. Misión del Varadero",
        "2. Entrada y clasificación del fallo",
        "3. Subvaraderos",
        "4. Secuencia de reparación",
        "5. Técnicas y reglas de bolsillo",
        "6. Construcción de ejercicios del Varadero",
        "7. Parte de Varadero",
        "8. Criterios de alta",
        "9. Mensajes de Fernando",
    ]

    if headings != required:
        raise RuntimeError(f"{path.name}: estructura inesperada: {headings}")

    title = next((x["text"] for x in paragraphs if x["style"] == "Title"), path.stem)

    return {
        "raw": raw,
        "title": title,
        "full_text": "\n".join(x["text"] for x in paragraphs),
        "content_json": {
            "paragraphs": paragraphs,
            "sections": sections,
        },
    }

def post_rows(url, key, table, rows, conflict):
    endpoint = url.rstrip("/") + f"/rest/v1/{table}?on_conflict={conflict}"
    data = json.dumps(rows, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=data,
        method="POST",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json; charset=utf-8",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
    )
    urllib.request.urlopen(req).read()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    root = Path(args.source)
    map_path = root / "08_Mapa_Tecnico_Varaderos_TROP.json"

    if not map_path.is_file():
        raise RuntimeError(f"No existe: {map_path}")

    map_raw = map_path.read_bytes()
    map_data = json.loads(map_raw.decode("utf-8-sig"))

    if map_data.get("concept") != "Varadero":
        raise RuntimeError("Mapa técnico no reconocido")

    if len(map_data.get("varaderos", [])) != 7:
        raise RuntimeError("El mapa técnico no contiene 7 Varaderos")

    system_row = {
        "system_id": "TROP-VARADEROS",
        "version": map_data.get("version", "TROP-VAR-1.0"),
        "config_json": map_data,
        "source_file": map_path.name,
        "source_sha256": hashlib.sha256(map_raw).hexdigest(),
    }

    rows = []

    docs = sorted(root.glob("[0-9][1-7]_*.docx"))

    if len(docs) != 7:
        raise RuntimeError(f"Se esperaban 7 DOCX y hay {len(docs)}")

    for path in docs:
        prefix = re.match(r"^(\d{2}_[A-Z]+)", path.stem)
        if not prefix:
            raise RuntimeError(f"Nombre inesperado: {path.name}")

        varadero_id = prefix.group(1)

        if varadero_id not in APTITUDE_MAP:
            raise RuntimeError(f"Varadero desconocido: {varadero_id}")

        aptitude_slug, varadero_code = APTITUDE_MAP[varadero_id]
        doc = extract_docx(path)

        rows.append({
            "varadero_id": varadero_id,
            "aptitude_slug": aptitude_slug,
            "varadero_code": varadero_code,
            "title": doc["title"],
            "full_text": doc["full_text"],
            "content_json": doc["content_json"],
            "source_document": path.name,
            "source_document_sha256": hashlib.sha256(doc["raw"]).hexdigest(),
            "source_version": "TROP_VARADEROS_BASE12-2026-08-30",
            "active": True,
        })

    if len({x["aptitude_slug"] for x in rows}) != 7:
        raise RuntimeError("Las 7 aptitudes no son únicas")

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        post_rows(
            url, key,
            "trop_varadero_system",
            [system_row],
            "system_id"
        )

        post_rows(
            url, key,
            "trop_varadero_contents",
            rows,
            "varadero_id"
        )

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "varaderos": len(rows),
        "system_version": system_row["version"],
        "entry_rules": len(map_data.get("entry_rules", [])),
        "exit_rules": len(map_data.get("exit_rules", [])),
        "phases": len(map_data.get("phases", [])),
        "subareas": sum(len(x.get("subareas", [])) for x in map_data.get("varaderos", [])),
        "map_sha256": system_row["source_sha256"],
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)
