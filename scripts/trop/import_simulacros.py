import argparse
import csv
import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path

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
    "Razonamiento Abstracto": "abstracto",
    "Abstracto": "abstracto",
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

    source = Path(args.source)
    raw = source.read_bytes()
    source_sha = hashlib.sha256(raw).hexdigest()

    with source.open("r", encoding="utf-8-sig", newline="") as f:
        data = list(csv.DictReader(f))

    if len(data) != 2100:
        raise RuntimeError(f"Se esperaban 2100 filas y hay {len(data)}")

    simulacros = {}
    questions = []
    seen_questions = set()
    seen_slots = set()

    for row in data:
        sim = row["simulacro"].strip()
        factor = row["factor"].strip()

        if factor not in FACTOR_MAP:
            raise RuntimeError(f"Factor desconocido: {factor}")

        aptitude = FACTOR_MAP[factor]
        position = int(row["posicion"])
        qid = row["question_id"].strip()
        level = int(row["nivel"])
        correct = row["correcta"].strip()

        if not (1 <= position <= 15):
            raise RuntimeError(f"Posición inválida: {sim} {factor} {position}")
        if not (1 <= level <= 5):
            raise RuntimeError(f"Nivel inválido: {qid}")
        if correct not in {"A", "B", "C", "D"}:
            raise RuntimeError(f"Respuesta inválida: {qid}")
        if qid in seen_questions:
            raise RuntimeError(f"question_id duplicado: {qid}")

        slot = (sim, aptitude, position)
        if slot in seen_slots:
            raise RuntimeError(f"Posición duplicada: {slot}")

        seen_questions.add(qid)
        seen_slots.add(slot)

        try:
            stimulus = json.loads(row["stimulus_json"]) if row["stimulus_json"].strip() else {}
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"stimulus_json inválido en {qid}: {exc}")

        audit_data = {
            "question_id_original": row.get("question_id_original", ""),
            "motor_origen": row.get("motor_origen", ""),
            "target_motor": row.get("target_motor", ""),
            "fallback_motor": row.get("fallback_motor", ""),
            "mapping_note": row.get("mapping_note", ""),
            "decision_auditoria": row.get("decision_auditoria", ""),
            "motivo_auditoria": row.get("motivo_auditoria", ""),
            "question_id_previo": row.get("question_id_previo", ""),
        }

        canonical = json.dumps(row, ensure_ascii=False, sort_keys=True).encode("utf-8")
        row_hash = hashlib.sha256(canonical).hexdigest()

        questions.append({
            "simulacro_id": sim,
            "aptitude_slug": aptitude,
            "factor_position": position,
            "question_id": qid,
            "level": level,
            "motor_code": row["motor"].strip(),
            "correct_option": correct,
            "target_time_seconds": int(row["tiempo_objetivo_s"]),
            "prompt": row["pregunta"].strip(),
            "options": {
                "A": row["A"],
                "B": row["B"],
                "C": row["C"],
                "D": row["D"],
            },
            "explanation": row["explicacion"].strip(),
            "stimulus": stimulus,
            "audit_data": audit_data,
            "source_row_hash": row_hash,
        })

        if sim not in simulacros:
            order = int(sim.replace("SIM", ""))
            simulacros[sim] = {
                "simulacro_id": sim,
                "display_order": order,
                "title": f"Simulacro {order:02d}",
                "questions_total": 105,
                "active": True,
                "source_version": "TROP_SIMULACROS_20_7X15_BASE12_DEFINITIVOS-2026-08-29",
            }

    if len(simulacros) != 20:
        raise RuntimeError(f"Se esperaban 20 simulacros y hay {len(simulacros)}")

    counts = {}
    for q in questions:
        counts[q["simulacro_id"]] = counts.get(q["simulacro_id"], 0) + 1

    invalid = {k: v for k, v in counts.items() if v != 105}
    if invalid:
        raise RuntimeError(f"Simulacros con recuento incorrecto: {invalid}")

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        post_rows(
            url, key, "trop_simulacros",
            list(simulacros.values()),
            "simulacro_id"
        )

        for i in range(0, len(questions), 250):
            post_rows(
                url, key, "trop_simulacro_questions",
                questions[i:i+250],
                "simulacro_id,aptitude_slug,factor_position"
            )

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "simulacros": len(simulacros),
        "questions": len(questions),
        "source_sha256": source_sha,
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)


