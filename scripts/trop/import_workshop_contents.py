import argparse, hashlib, json, os, re, sys, urllib.request, zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

FIELDS = {
    "OBJETIVO": "objective",
    "IDEA CLAVE": "key_idea",
    "PROCEDIMIENTO": "procedure",
    "ERROR A EVITAR": "error_to_avoid",
    "PRÁCTICA": "practice",
    "REGISTRO": "record",
    "NOTA": "note",
}

def extract(path):
    ns = {"w":"http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))

    items = []
    for p in root.findall(".//w:p", ns):
        s = p.find("./w:pPr/w:pStyle", ns)
        style = s.get("{%s}val" % ns["w"]) if s is not None else "Normal"
        text = "".join(t.text or "" for t in p.findall(".//w:t", ns)).strip()
        if text:
            items.append((style, text))

    fichas, current, field = [], None, None

    for style, text in items:
        if style == "Heading2" and re.match(r"^B\d+_T\d+\s*·", text):
            if current:
                fichas.append(current)
            workshop_id = text.split("·", 1)[0].strip()
            current = {
                "workshop_id": workshop_id,
                "objective": "", "key_idea": "", "procedure": "",
                "error_to_avoid": "", "practice": "", "record": "",
                "note": None,
            }
            field = None
            continue

        if current and text in FIELDS:
            field = FIELDS[text]
            if field == "note":
                current[field] = ""
            continue

        if current and field:
            current[field] = ((current[field] or "") + " " + text).strip()

    if current:
        fichas.append(current)

    return fichas

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True)
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    source = Path(args.source)
    fichas = extract(source)

    required = ["objective","key_idea","procedure","error_to_avoid","practice","record"]

    if len(fichas) != 124:
        raise RuntimeError(f"Esperadas 124 fichas; detectadas {len(fichas)}")

    for f in fichas:
        missing = [k for k in required if not f[k]]
        if missing:
            raise RuntimeError(f"{f['workshop_id']} incompleta: {missing}")

    sha = hashlib.sha256(source.read_bytes()).hexdigest()

    rows = [{
        **f,
        "source_document": source.name,
        "source_sha256": sha,
        "source_version": "TROP_PUNTO6_RECURSOS_ESCRITOS_DEFINITIVOS-2026-08-29",
    } for f in fichas]

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        endpoint = url.rstrip("/") + "/rest/v1/trop_workshop_contents?on_conflict=workshop_id"

        for i in range(0, len(rows), 50):
            data = json.dumps(rows[i:i+50], ensure_ascii=False).encode("utf-8")
            req = urllib.request.Request(
                endpoint,
                data=data,
                method="POST",
                headers={
                    "apikey": key,
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                    "Prefer": "resolution=merge-duplicates,return=minimal",
                },
            )
            urllib.request.urlopen(req).read()

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "fichas": len(rows),
        "source_sha256": sha,
    }, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("ERROR:", e)
        sys.exit(1)
