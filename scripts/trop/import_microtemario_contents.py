import argparse
import hashlib
import io
import json
import os
import re
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DOC_PATTERN = re.compile(r'^(ABS|ESP|MEC|MEM|NUM|PER|VER)-\d+.*\.docx$')

SECTION_NAMES = [
    "Qué entrena y qué debe encontrar el alumno",
    "Método Base12",
    "Trucos Base12",
    "Trampas y distractores",
    "Ejemplo resuelto",
    "Corrección y retroalimentación Base12",
    "Progresión Base12 · niveles 1–5",
    "Criterio de dominio",
    "Transferencia a formato test",
]

def extract_paragraphs(data):
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    with zipfile.ZipFile(io.BytesIO(data)) as doc:
        root = ET.fromstring(doc.read("word/document.xml"))

    paragraphs = []
    for p in root.findall(".//w:p", ns):
        text = "".join(t.text or "" for t in p.findall(".//w:t", ns)).strip()
        if text:
            paragraphs.append(text)

    return paragraphs

def build_content(paragraphs):
    sections = {}
    current = "cabecera"
    sections[current] = []

    for text in paragraphs:
        if text in SECTION_NAMES:
            current = text
            sections.setdefault(current, [])
        else:
            sections[current].append(text)

    return {
        "paragraphs": paragraphs,
        "sections": sections,
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    source = Path(args.source)
    if not source.is_file():
        raise RuntimeError(f"No existe: {source}")

    zip_bytes = source.read_bytes()
    zip_sha = hashlib.sha256(zip_bytes).hexdigest()

    rows = []

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as outer:
        names = sorted(n for n in outer.namelist() if DOC_PATTERN.match(Path(n).name))

        if len(names) != 21:
            raise RuntimeError(f"Se esperaban 21 microtemarios y se detectaron {len(names)}")

        ids = set()

        for name in names:
            doc_bytes = outer.read(name)
            paragraphs = extract_paragraphs(doc_bytes)

            if not paragraphs:
                raise RuntimeError(f"Documento vacío: {name}")

            micro_id = paragraphs[0].strip()

            if not re.match(r'^(ABS|ESP|MEC|MEM|NUM|PER|VER)-\d+$', micro_id):
                raise RuntimeError(f"micro_id no válido en {name}: {micro_id}")

            if micro_id in ids:
                raise RuntimeError(f"micro_id duplicado: {micro_id}")

            ids.add(micro_id)

            full_text = "\n".join(paragraphs)
            content = build_content(paragraphs)

            required = [
                "Método Base12",
                "Trucos Base12",
                "Trampas y distractores",
                "Ejemplo resuelto",
                "Corrección y retroalimentación Base12",
                "Progresión Base12 · niveles 1–5",
                "Criterio de dominio",
                "Transferencia a formato test",
            ]

            missing = [x for x in required if x not in content["sections"]]
            if missing:
                raise RuntimeError(f"{micro_id} incompleto: {missing}")

            rows.append({
                "micro_id": micro_id,
                "full_text": full_text,
                "content_json": content,
                "source_document": Path(name).name,
                "source_document_sha256": hashlib.sha256(doc_bytes).hexdigest(),
                "source_zip": source.name,
                "source_zip_sha256": zip_sha,
                "source_version": "MICROTEMARIOS_BASE12_TROPA_Y_MARINERIA-2026-08-29",
            })

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        endpoint = url.rstrip("/") + "/rest/v1/trop_microtemario_contents?on_conflict=micro_id"

        data = json.dumps(rows, ensure_ascii=False).encode("utf-8")

        request = urllib.request.Request(
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

        urllib.request.urlopen(request).read()

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "microtemarios": len(rows),
        "source_zip_sha256": zip_sha,
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)
