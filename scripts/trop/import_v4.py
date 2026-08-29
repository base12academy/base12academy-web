#!/usr/bin/env python3
"""Valida e importa de forma idempotente los siete bancos TROP V4.

El modo predeterminado es solo lectura. Para escribir hay que indicar --apply y
proporcionar SUPABASE_SERVICE_ROLE_KEY y SUPABASE_URL (o
NEXT_PUBLIC_SUPABASE_URL) en el entorno.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


EXPECTED_VERSION = "TROP-V4-2026-08-29"
GLOBAL_AUDIT_NAME = "TROP_28000_AUDITORIA_FINAL_V4.json"
SOURCE_DEFAULT = Path(r"D:\Escritorio\Agente IA\Tropa y Marinería")
FACTORS = {
    "VERBAL": ("verbal", "Verbal", {"VB01", "VB02", "VB03"}),
    "NUMERICO": ("numerico", "Numérico", {"NU01", "NU02", "NU03"}),
    "ESPACIAL": ("espacial", "Espacial", {"ES01", "ES02", "ES03"}),
    "MECANICO": ("mecanico", "Mecánico", {"ME01", "ME03", "ME05"}),
    "PERCEPTIVO": ("perceptivo", "Perceptivo", {"PE01", "PE02", "PE03"}),
    "MEMORIA": ("memoria", "Memoria", {"MEM01", "MEM03", "MEM04"}),
    "ABSTRACTO": ("abstracto", "Abstracto", {"AB01", "AB04", "AB05"}),
}
ACCESS = {"ESENCIAL": "esencial", "OPERATIVA": "operativa", "INTEGRAL": "integral"}
USAGE = {"GENERAL": "general", "PRUEBA_MAR": "prueba_mar", "SIMULACRO": "simulacro", "ENTRENAMIENTO": "entrenamiento"}


def digest_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def row_hash(row: dict[str, str]) -> str:
    serialized = json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def content_signature(prompt: str, options: dict[str, str], stimulus: dict[str, Any]) -> str:
    payload = {"prompt": prompt, "options": options, "stimulus": stimulus}
    return hashlib.sha256(
        json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def stimulus_signature(stimulus: dict[str, Any]) -> str:
    return hashlib.sha256(
        json.dumps(stimulus, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def required_text(row: dict[str, str], field: str, question_id: str) -> str:
    value = str(row.get(field, "")).strip()
    if not value:
        raise ValueError(f"{question_id}: campo obligatorio vacío {field}")
    return value


def load_archive(source: Path, factor: str) -> tuple[list[dict[str, Any]], dict[str, dict[str, Any]], dict[str, Any]]:
    slug, aptitude_name, motors = FACTORS[factor]
    archive = source / f"TROP_{factor}_4000_DEFINITIVO_V4.zip"
    if not archive.is_file():
        raise FileNotFoundError(f"Falta {archive.name}")
    source_sha = digest_file(archive)
    csv_name = f"TROP_{factor}_4000.csv"
    audit_name = f"AUDITORIA_{factor}_4000.csv"
    with zipfile.ZipFile(archive) as zipped:
        with zipped.open(csv_name) as raw:
            rows = list(csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8-sig", newline="")))
        with zipped.open(audit_name) as raw:
            audit_rows = list(csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8-sig", newline="")))

    if len(rows) != 4000:
        raise ValueError(f"{archive.name}: se esperaban 4000 preguntas y hay {len(rows)}")
    if len(audit_rows) != 4000 or any(row.get("estado") != "PASS" or str(row.get("incidencias", "")).strip() for row in audit_rows):
        raise ValueError(f"{archive.name}: la auditoría interna no contiene 4000 PASS limpios")

    # La auditoría debe corresponder exactamente a las mismas 4.000 preguntas.
    audit_id_field = next(
        (field for field in ("question_id", "id_pregunta", "id") if audit_rows and field in audit_rows[0]),
        None,
    )
    if not audit_id_field:
        raise ValueError(
            f"{archive.name}: la auditoría no expone question_id/id_pregunta/id; "
            "se bloquea la importación hasta poder cruzar auditoría y banco"
        )
    bank_ids = [required_text(row, "question_id", f"{archive.name}:fila") for row in rows]
    audit_ids = [required_text(row, audit_id_field, f"{archive.name}:auditoría") for row in audit_rows]
    if len(set(audit_ids)) != 4000:
        raise ValueError(f"{archive.name}: la auditoría contiene IDs duplicados")
    if set(bank_ids) != set(audit_ids):
        only_bank = sorted(set(bank_ids) - set(audit_ids))[:5]
        only_audit = sorted(set(audit_ids) - set(bank_ids))[:5]
        raise ValueError(
            f"{archive.name}: banco y auditoría no cubren los mismos IDs; "
            f"solo_banco={only_bank}, solo_auditoria={only_audit}"
        )

    level_counts = Counter(str(row.get("nivel", "")) for row in rows)
    if level_counts != Counter({str(level): 800 for level in range(1, 6)}):
        raise ValueError(f"{archive.name}: distribución de niveles inválida {dict(level_counts)}")

    families: dict[str, dict[str, Any]] = {}
    questions: list[dict[str, Any]] = []
    ids: set[str] = set()
    signatures: set[str] = set()
    access_counts = Counter()
    letter_counts = Counter()
    for row in rows:
        question_id = required_text(row, "question_id", "sin-id")
        if question_id in ids:
            raise ValueError(f"{archive.name}: ID duplicado {question_id}")
        ids.add(question_id)
        if row.get("aptitud") != aptitude_name:
            raise ValueError(f"{question_id}: aptitud inesperada {row.get('aptitud')}")
        motor = required_text(row, "motor", question_id)
        if motor not in motors:
            raise ValueError(f"{question_id}: motor no aprobado {motor}")
        family_id = required_text(row, "familia_id", question_id)
        family_name = required_text(row, "familia", question_id)
        current_family = families.setdefault(family_id, {"family_id": family_id, "aptitude_slug": slug, "name": family_name, "evaluable": True, "transverse": False, "active": True})
        if current_family["name"] != family_name:
            raise ValueError(f"{family_id}: nombres de familia inconsistentes")
        correct = required_text(row, "correcta", question_id)
        if correct not in "ABCD":
            raise ValueError(f"{question_id}: respuesta correcta inválida")
        options = {letter: required_text(row, letter, question_id) for letter in "ABCD"}
        if len(set(options.values())) != 4:
            raise ValueError(f"{question_id}: opciones repetidas")
        stimulus = json.loads(required_text(row, "stimulus_json", question_id))
        if not isinstance(stimulus, dict) or not stimulus:
            raise ValueError(f"{question_id}: stimulus_json debe ser un objeto no vacío")
        access_raw = required_text(row, "access_min", question_id)
        usage_raw = required_text(row, "uso", question_id)
        if access_raw not in ACCESS or usage_raw not in USAGE:
            raise ValueError(f"{question_id}: acceso o uso no reconocido")
        if row.get("audit_status") != "VALIDADA_V4" or row.get("audit_version") != EXPECTED_VERSION:
            raise ValueError(f"{question_id}: estado o versión de auditoría inesperados")
        signature = content_signature(required_text(row, "pregunta", question_id), options, stimulus)
        if signature in signatures:
            raise ValueError(f"{archive.name}: duplicado exacto detectado en {question_id}")
        signatures.add(signature)
        letter_counts[correct] += 1
        normalized = {
            "question_id": question_id,
            "aptitude_slug": slug,
            "motor_code": motor,
            "family_id": family_id,
            "level": int(row["nivel"]),
            "access_min": ACCESS[access_raw],
            "usage": USAGE[usage_raw],
            "prompt": required_text(row, "pregunta", question_id),
            "options": options,
            "correct_option": correct,
            "explanation": required_text(row, "explicacion", question_id),
            "feedback": {letter: required_text(row, f"feedback_{letter}", question_id) for letter in "ABCD"},
            "error_codes": {letter: str(row.get(f"error_{letter}", "")).strip() or None for letter in "ABCD"},
            "stimulus": stimulus,
            "audit_status": "VALIDADA_V4",
            "audit_version": EXPECTED_VERSION,
            "source_archive": archive.name,
            "source_sha256": source_sha,
            "source_row_hash": row_hash(row),
            "active": True,
        }
        questions.append(normalized)
        access_counts[normalized["access_min"]] += 1
    if access_counts != Counter({"esencial": 2000, "operativa": 1000, "integral": 1000}):
        raise ValueError(f"{archive.name}: distribución de acceso inválida {dict(access_counts)}")
    if letter_counts != Counter({"A": 1000, "B": 1000, "C": 1000, "D": 1000}):
        raise ValueError(f"{archive.name}: distribución de letras correctas inválida {dict(letter_counts)}")
    summary = {
        "archive": archive.name,
        "source_sha256": source_sha,
        "questions": len(questions),
        "families": len(families),
        "levels": dict(sorted(level_counts.items())),
        "access_min": dict(sorted(access_counts.items())),
        "letters": dict(sorted(letter_counts.items())),
    }
    return questions, families, summary


def validate_global_audit(source: Path, summaries: list[dict[str, Any]]) -> dict[str, Any]:
    path = source / GLOBAL_AUDIT_NAME
    if not path.is_file():
        raise FileNotFoundError(
            f"Falta {GLOBAL_AUDIT_NAME}; la carga V4 queda bloqueada sin su auditoría global final"
        )
    report = json.loads(path.read_text(encoding="utf-8-sig"))
    if report.get("version") != EXPECTED_VERSION or report.get("passed") is not True:
        raise ValueError(f"{GLOBAL_AUDIT_NAME}: versión o estado global inesperados")
    global_data = report.get("global") or {}
    expected_global = {
        "total": 28000,
        "unique_ids": 28000,
        "unique_stimuli": 28000,
        "full_duplicate_extras": 0,
        "active_families": 108,
    }
    for key, expected in expected_global.items():
        if global_data.get(key) != expected:
            raise ValueError(
                f"{GLOBAL_AUDIT_NAME}: {key}={global_data.get(key)!r}, se esperaba {expected!r}"
            )

    by_archive = {summary["archive"]: summary for summary in summaries}
    aptitude_report = report.get("aptitudes") or {}
    for factor, (_slug, aptitude_name, _motors) in FACTORS.items():
        archive_name = f"TROP_{factor}_4000_DEFINITIVO_V4.zip"
        summary = by_archive.get(archive_name)
        audit = aptitude_report.get(aptitude_name)
        if summary is None or not isinstance(audit, dict):
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: falta el resumen de {aptitude_name}")
        if audit.get("rows") != 4000 or audit.get("audit_rows") != 4000 or audit.get("audit_nonpass") != 0:
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: conteos de auditoría inválidos para {aptitude_name}")
        if audit.get("unique_ids") != 4000 or audit.get("unique_stimuli") != 4000:
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: unicidad inválida para {aptitude_name}")
        if audit.get("families") != summary["families"]:
            raise ValueError(
                f"{GLOBAL_AUDIT_NAME}: familias de {aptitude_name}={audit.get('families')}, "
                f"pero el ZIP contiene {summary['families']}"
            )
        if audit.get("levels") != summary["levels"]:
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: niveles no coinciden para {aptitude_name}")
        access_expected = {key.upper(): value for key, value in summary["access_min"].items()}
        if audit.get("access") != access_expected:
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: accesos no coinciden para {aptitude_name}")
        if audit.get("letters") != summary["letters"]:
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: letras correctas no coinciden para {aptitude_name}")
        zero_checks = (
            "empty_options", "duplicate_option_rows", "fallback_distractors", "lowercase_luis",
            "memory_gender_defect", "old_verbal_grammar", "double_regla", "orthography_space",
            "artificial_suffix", "invalid_json", "mechanical_n1n2_fraction_options",
        )
        if any(audit.get(key) != 0 for key in zero_checks):
            raise ValueError(f"{GLOBAL_AUDIT_NAME}: {aptitude_name} contiene incidencias no nulas")
    if report.get("failures") != []:
        raise ValueError(f"{GLOBAL_AUDIT_NAME}: failures no está vacío")
    return report


class Postgrest:
    def __init__(self, url: str, service_key: str) -> None:
        self.base = url.rstrip("/") + "/rest/v1"
        self.headers = {"apikey": service_key, "Authorization": f"Bearer {service_key}", "Content-Type": "application/json"}

    def upsert(self, table: str, rows: list[dict[str, Any]], conflict: str) -> None:
        query = urllib.parse.urlencode({"on_conflict": conflict})
        request = urllib.request.Request(
            f"{self.base}/{table}?{query}",
            data=json.dumps(rows, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
            headers={**self.headers, "Prefer": "resolution=merge-duplicates,return=minimal"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                if response.status not in (200, 201, 204):
                    raise RuntimeError(f"Supabase respondió {response.status}")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:1000]
            raise RuntimeError(f"Error importando {table}: HTTP {exc.code}: {detail}") from exc

    def exact_count(self, table: str) -> int:
        request = urllib.request.Request(
            f"{self.base}/{table}?select=question_id",
            headers={**self.headers, "Prefer": "count=exact", "Range": "0-0"},
            method="GET",
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            content_range = response.headers.get("Content-Range", "")
        if "/" not in content_range:
            raise RuntimeError(f"Supabase no devolvió Content-Range para {table}")
        return int(content_range.rsplit("/", 1)[1])


def chunks(rows: list[dict[str, Any]], size: int):
    for index in range(0, len(rows), size):
        yield rows[index:index + size]


def main() -> int:
    parser = argparse.ArgumentParser(description="Valida/importa los siete bancos TROP DEFINITIVO_V4")
    parser.add_argument("--source", type=Path, default=SOURCE_DEFAULT)
    parser.add_argument("--apply", action="store_true", help="Escribe en Supabase; sin esta opción solo valida")
    parser.add_argument("--batch-size", type=int, default=200)
    args = parser.parse_args()
    if not 10 <= args.batch_size <= 500:
        parser.error("--batch-size debe estar entre 10 y 500")

    all_questions: list[dict[str, Any]] = []
    all_families: dict[str, dict[str, Any]] = {}
    summaries = []
    global_ids: set[str] = set()
    global_signatures: dict[str, str] = {}
    global_stimuli: dict[str, str] = {}
    for factor in FACTORS:
        questions, families, summary = load_archive(args.source, factor)
        overlap = global_ids.intersection(question["question_id"] for question in questions)
        if overlap:
            raise ValueError(f"IDs duplicados entre archivos: {sorted(overlap)[:5]}")
        global_ids.update(question["question_id"] for question in questions)
        for question in questions:
            signature = content_signature(question["prompt"], question["options"], question["stimulus"])
            previous = global_signatures.get(signature)
            if previous:
                raise ValueError(
                    f"Duplicado exacto entre archivos: {previous} y {question['question_id']}"
                )
            global_signatures[signature] = question["question_id"]
            stimulus_sig = stimulus_signature(question["stimulus"])
            previous_stimulus = global_stimuli.get(stimulus_sig)
            if previous_stimulus:
                raise ValueError(
                    f"Stimulus repetido entre archivos: {previous_stimulus} y {question['question_id']}"
                )
            global_stimuli[stimulus_sig] = question["question_id"]
        for family_id, family in families.items():
            if family_id in all_families and all_families[family_id] != family:
                raise ValueError(f"Familia global inconsistente: {family_id}")
            all_families[family_id] = family
        all_questions.extend(questions)
        summaries.append(summary)
    if len(all_questions) != 28000 or len(global_ids) != 28000 or len(all_families) != 108:
        raise ValueError(f"Totales inválidos: preguntas={len(all_questions)}, IDs={len(global_ids)}, familias={len(all_families)}")
    if len(global_signatures) != 28000 or len(global_stimuli) != 28000:
        raise ValueError(
            f"Unicidad global inválida: firmas={len(global_signatures)}, stimuli={len(global_stimuli)}"
        )
    validate_global_audit(args.source, summaries)

    report = {
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "questions": 28000,
        "families": 108,
        "unique_content_signatures": 28000,
        "unique_stimuli": 28000,
        "global_audit": GLOBAL_AUDIT_NAME,
        "archives": summaries,
    }
    if not args.apply:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0

    supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not service_key:
        raise RuntimeError("--apply requiere SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY")
    client = Postgrest(supabase_url, service_key)
    datetime_module = __import__("datetime")
    validated_at = datetime_module.datetime.now(datetime_module.timezone.utc).isoformat()
    for summary in summaries:
        client.upsert("trop_import_batches", [{
            "source_archive": summary["archive"],
            "source_sha256": summary["source_sha256"],
            "audit_version": EXPECTED_VERSION,
            "question_count": summary["questions"],
            "status": "validated",
            "summary": {**summary, "validated_at": validated_at},
            "imported_at": None,
        }], "source_sha256")

    try:
        for summary in summaries:
            client.upsert("trop_import_batches", [{
                "source_archive": summary["archive"],
                "source_sha256": summary["source_sha256"],
                "audit_version": EXPECTED_VERSION,
                "question_count": summary["questions"],
                "status": "importing",
                "summary": summary,
                "imported_at": None,
            }], "source_sha256")
        client.upsert("trop_families", list(all_families.values()), "family_id")
        for batch in chunks(all_questions, args.batch_size):
            client.upsert("trop_questions", batch, "question_id")
        database_count = client.exact_count("trop_questions")
        if database_count != 28000:
            raise RuntimeError(f"La verificación posterior devolvió {database_count} preguntas, no 28000")
    except Exception as exc:
        failed_at = datetime_module.datetime.now(datetime_module.timezone.utc).isoformat()
        for summary in summaries:
            try:
                client.upsert("trop_import_batches", [{
                    "source_archive": summary["archive"],
                    "source_sha256": summary["source_sha256"],
                    "audit_version": EXPECTED_VERSION,
                    "question_count": summary["questions"],
                    "status": "failed",
                    "summary": {**summary, "failed_at": failed_at, "error": str(exc)[:500]},
                    "imported_at": None,
                }], "source_sha256")
            except Exception:
                pass
        raise

    completed_at = datetime_module.datetime.now(datetime_module.timezone.utc).isoformat()
    for summary in summaries:
        client.upsert("trop_import_batches", [{
            "source_archive": summary["archive"],
            "source_sha256": summary["source_sha256"],
            "audit_version": EXPECTED_VERSION,
            "question_count": summary["questions"],
            "status": "completed",
            "summary": summary,
            "imported_at": completed_at,
        }], "source_sha256")
    report["database_questions"] = database_count
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
