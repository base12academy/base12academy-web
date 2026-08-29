import argparse
import hashlib
import json
import os
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

SHEETS = {
    "Campos_Hoja",
    "Indicadores",
    "Estados_Evolucion",
    "Hitos",
    "Refuerzo_Positivo",
    "Integracion_Fernando",
    "Integracion_Parte",
    "Reglas_Siguiente_PM",
    "Historial_Eventos",
    "Implementacion",
}

def col_index(ref):
    letters = ""
    for ch in ref:
        if ch.isalpha():
            letters += ch
        else:
            break
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch.upper()) - 64
    return n - 1

def load_xlsx(path):
    z = zipfile.ZipFile(path)
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    relmap = {x.get("Id"): x.get("Target").lstrip("/") for x in rels}

    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        sr = ET.fromstring(z.read("xl/sharedStrings.xml"))
        shared = [
            "".join(t.text or "" for t in si.findall(".//m:t", NS))
            for si in sr.findall(".//m:si", NS)
        ]

    sheets = {}

    for s in wb.findall(".//m:sheet", NS):
        name = s.get("name")
        if name not in SHEETS:
            continue

        target = relmap[s.get("{" + NS["r"] + "}id")]
        if not target.startswith("xl/"):
            target = "xl/" + target

        root = ET.fromstring(z.read(target))
        rows = []

        for row in root.findall(".//m:row", NS):
            cells = {}
            for c in row.findall("m:c", NS):
                idx = col_index(c.get("r"))
                ctype = c.get("t")
                value = ""

                if ctype == "inlineStr":
                    value = "".join(t.text or "" for t in c.findall(".//m:t", NS))
                else:
                    v = c.find("m:v", NS)
                    if v is not None and v.text is not None:
                        value = v.text
                        if ctype == "s":
                            value = shared[int(value)]

                cells[idx] = value

            width = max(cells.keys(), default=-1) + 1
            rows.append((int(row.get("r")), [cells.get(i, "") for i in range(width)]))

        sheets[name] = rows

    return sheets

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    source = Path(args.source)
    raw = source.read_bytes()
    source_sha = hashlib.sha256(raw).hexdigest()

    sheets = load_xlsx(source)
    rows_out = []

    for sheet_name in sorted(SHEETS):
        rows = sheets[sheet_name]

        header_row = next(values for number, values in rows if number == 4)
        data_rows = [(number, values) for number, values in rows if number >= 5]

        for order, (excel_row, values) in enumerate(data_rows, start=1):
            padded = values + [""] * (len(header_row) - len(values))

            data = {
                str(header_row[i]).strip(): padded[i]
                for i in range(len(header_row))
                if str(header_row[i]).strip()
            }

            if not any(str(v).strip() for v in data.values()):
                continue

            rows_out.append({
                "rule_id": f"{sheet_name.upper()}-{order:03d}",
                "sheet_name": sheet_name,
                "row_order": order,
                "data_json": data,
                "source_file": source.name,
                "source_sha256": source_sha,
                "source_version": "TROP_PUNTO5_HOJA_DE_SERVICIO_DEFINITIVA-2026-08-29",
            })

    if len(rows_out) != 112:
        raise RuntimeError(f"Se esperaban 112 registros y se detectaron {len(rows_out)}")

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        endpoint = url.rstrip("/") + "/rest/v1/trop_service_sheet_rules?on_conflict=rule_id"
        payload = json.dumps(rows_out, ensure_ascii=False).encode("utf-8")

        req = urllib.request.Request(
            endpoint,
            data=payload,
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json; charset=utf-8",
                "Prefer": "resolution=merge-duplicates,return=minimal",
            },
        )

        urllib.request.urlopen(req).read()

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "rules": len(rows_out),
        "source_sha256": source_sha,
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)
