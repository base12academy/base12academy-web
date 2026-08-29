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

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

FACTOR_MAP = {
    "Verbal": "verbal",
    "Numérico": "numerico",
    "Numerico": "numerico",
    "Espacial": "espacial",
    "Mecánico": "mecanico",
    "Mecanico": "mecanico",
    "Perceptivo": "perceptivo",
    "Perceptiva": "perceptivo",
    "Perceptual": "perceptivo",
    "Memoria": "memoria",
    "Abstracto": "abstracto",
    "Razonamiento Abstracto": "abstracto",
}

RULE_SHEETS = {
    "Campos_Parte",
    "Calculos",
    "Reglas_Diagnostico",
    "Recomendaciones",
    "Mensajes_Positivos",
    "Salida_Fernando",
    "Salida_HojaServicio",
    "Flujo",
}

def col_index(ref):
    letters = re.match(r"[A-Z]+", ref).group(0)
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
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
            rows.append([cells.get(i, "") for i in range(width)])

        sheets[s.get("name")] = rows

    return sheets

def rows_as_dicts(rows, header_index):
    header = rows[header_index]
    result = []
    for row in rows[header_index + 1:]:
        if not any(str(x).strip() for x in row):
            continue
        padded = row + [""] * (len(header) - len(row))
        result.append({
            str(header[i]).strip(): padded[i]
            for i in range(len(header))
            if str(header[i]).strip()
        })
    return result

def post_rows(url, key, table, rows, conflict):
    endpoint = url.rstrip("/") + f"/rest/v1/{table}?on_conflict={conflict}"
    payload = json.dumps(rows, ensure_ascii=False).encode("utf-8")
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

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--operations", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    op_path = Path(args.operations)
    report_path = Path(args.report)

    op_sha = hashlib.sha256(op_path.read_bytes()).hexdigest()
    report_sha = hashlib.sha256(report_path.read_bytes()).hexdigest()

    op_book = load_xlsx(op_path)
    report_book = load_xlsx(report_path)

    sea_rows = rows_as_dicts(op_book["Pruebas_de_Mar"], 3)
    operation_rows = rows_as_dicts(op_book["Operaciones"], 2)
    form_rows = rows_as_dicts(op_book["Simulacros"], 0)

    sea_trials = []
    for r in sea_rows:
        if not r.get("Código", "").startswith("PM-"):
            continue
        sea_trials.append({
            "trial_code": r["Código"].strip(),
            "trial_name": r["Nombre"].strip(),
            "source_simulacro": r["Simulacro fuente"].strip(),
            "access_min": r["Acceso mínimo"].strip().lower(),
            "stage": r["Escalón"].strip(),
            "difficulty": r["Dificultad interna"].strip(),
            "variant": r["Variante"].strip(),
            "average_level": float(r["Nivel medio"]),
            "level_distribution": r["Distribución N1–N5"].strip(),
            "official_attempt": int(float(r["Tentativa oficial"])),
            "function_text": r["Función"].strip(),
            "source_version": "TROP_PUNTO3_OPERACIONES_DEFINITIVAS-2026-08-29",
            "active": True,
        })

    operations = []
    for r in operation_rows:
        if not r.get("Código", "").startswith("OPC-"):
            continue
        operations.append({
            "operation_code": r["Código"].strip(),
            "source_simulacro": r["Simulacro fuente"].strip(),
            "difficulty": r["Dificultad"].strip(),
            "variant": r["Variante"].strip(),
            "average_level": float(r["Nivel medio"]),
            "questions_total": int(float(r["Preguntas"])),
            "factors_total": int(float(r["Factores"])),
            "motors_per_factor": r["Motores/factor"].strip(),
            "strict_time": r["Tiempo estricto"].strip(),
            "destination": r["Destino"].strip(),
            "source_version": "TROP_PUNTO3_OPERACIONES_DEFINITIVAS-2026-08-29",
            "active": True,
        })

    questions = []
    seen_ids = set()
    seen_slots = set()

    for r in form_rows:
        form = r.get("simulacro", "").strip()
        if not form.startswith("OP-"):
            continue

        factor = r["factor"].strip()
        if factor not in FACTOR_MAP:
            raise RuntimeError(f"Factor desconocido: {factor}")

        qid = r["question_id"].strip()
        slot = (form, FACTOR_MAP[factor], int(r["posicion"]))

        if qid in seen_ids:
            raise RuntimeError(f"question_id duplicado: {qid}")
        if slot in seen_slots:
            raise RuntimeError(f"posición duplicada: {slot}")

        seen_ids.add(qid)
        seen_slots.add(slot)

        correct = r["correcta"].strip()
        if correct not in {"A", "B", "C", "D"}:
            raise RuntimeError(f"Respuesta inválida: {qid}")

        try:
            stimulus = json.loads(r["stimulus_json"]) if r["stimulus_json"].strip() else {}
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"stimulus_json inválido en {qid}: {exc}")

        audit_data = {
            "question_id_original": r.get("question_id_original", ""),
            "motor_origen": r.get("motor_origen", ""),
            "target_motor": r.get("target_motor", ""),
            "fallback_motor": r.get("fallback_motor", ""),
            "mapping_note": r.get("mapping_note", ""),
            "decision_auditoria": r.get("decision_auditoria", ""),
            "motivo_auditoria": r.get("motivo_auditoria", ""),
            "question_id_previo": r.get("question_id_previo", ""),
        }

        canonical = json.dumps(r, ensure_ascii=False, sort_keys=True).encode("utf-8")

        questions.append({
            "form_code": form,
            "usage_type": r["uso"].strip(),
            "difficulty": r["dificultad_simulacro"].strip(),
            "variant": r["variante_dificultad"].strip(),
            "aptitude_slug": FACTOR_MAP[factor],
            "factor_position": int(r["posicion"]),
            "question_id": qid,
            "level": int(r["nivel"]),
            "motor_code": r["motor"].strip(),
            "correct_option": correct,
            "target_time_seconds": int(float(r["tiempo_objetivo_s"])),
            "prompt": r["pregunta"].strip(),
            "options": {
                "A": r["A"],
                "B": r["B"],
                "C": r["C"],
                "D": r["D"],
            },
            "explanation": r["explicacion"].strip(),
            "stimulus": stimulus,
            "audit_data": audit_data,
            "source_simulacro_origin": r.get("simulacro_origen", "").strip() or None,
            "sea_trial_code": r.get("codigo_prueba_mar", "").strip() or None,
            "access_min": r.get("acceso_minimo", "").strip().lower() or None,
            "destination_name": r.get("destino_nombre", "").strip() or None,
            "stage": r.get("escalon_pm", "").strip() or None,
            "operation_code": r.get("codigo_operacion", "").strip() or None,
            "source_row_hash": hashlib.sha256(canonical).hexdigest(),
        })

    counts = {}
    for q in questions:
        counts[q["form_code"]] = counts.get(q["form_code"], 0) + 1

    if len(counts) != 15 or any(v != 105 for v in counts.values()):
        raise RuntimeError(f"Formas operativas incorrectas: {counts}")

    rules = []
    for sheet_name in sorted(RULE_SHEETS):
        rows = report_book[sheet_name]
        entries = rows_as_dicts(rows, 3)

        for i, data in enumerate(entries, start=1):
            if not any(str(v).strip() for v in data.values()):
                continue
            rules.append({
                "rule_id": f"{sheet_name.upper()}-{i:03d}",
                "sheet_name": sheet_name,
                "row_order": i,
                "data_json": data,
                "source_file": report_path.name,
                "source_sha256": report_sha,
                "source_version": "TROP_PUNTO4_PARTE_DE_OPERACIONES_DEFINITIVO-2026-08-29",
            })

    if len(sea_trials) != 7:
        raise RuntimeError(f"Se esperaban 7 Pruebas de Mar y hay {len(sea_trials)}")
    if len(operations) != 8:
        raise RuntimeError(f"Se esperaban 8 Operaciones y hay {len(operations)}")
    if len(questions) != 1575:
        raise RuntimeError(f"Se esperaban 1575 preguntas y hay {len(questions)}")

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        post_rows(url, key, "trop_sea_trials", sea_trials, "trial_code")
        post_rows(url, key, "trop_operations", operations, "operation_code")

        for i in range(0, len(questions), 250):
            post_rows(
                url, key, "trop_operation_form_questions",
                questions[i:i+250],
                "form_code,aptitude_slug,factor_position"
            )

        for i in range(0, len(rules), 250):
            post_rows(
                url, key, "trop_operations_rules",
                rules[i:i+250],
                "rule_id"
            )

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "sea_trials": len(sea_trials),
        "operations": len(operations),
        "forms": len(counts),
        "questions": len(questions),
        "operation_rules": len(rules),
        "operations_sha256": op_sha,
        "report_sha256": report_sha,
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)

