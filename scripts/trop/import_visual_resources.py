#!/usr/bin/env python3
"""Audita y carga el repositorio visual maestro TROP sin duplicarlo por producto."""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import mimetypes
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from collections import Counter
from pathlib import Path
from typing import Any, Callable


APTITUDES = {
    "VERBAL": "verbal",
    "NUMERICO": "numerico",
    "ESPACIAL": "espacial",
    "MECANICA": "mecanico",
    "PERCEPTIVO": "perceptivo",
    "MEMORIA": "memoria",
    "RAZONAMIENTO_ABSTRACTO": "abstracto",
}
VERSION = "TROP-RECURSOS-VISUALES-LATEST-2026-08-31"
PACKAGE_APTITUDES = {
    "1": "verbal",
    "2": "numerico",
    "3": "espacial",
    "4": "mecanico",
    "5": "perceptivo",
    "6": "memoria",
    "7": "abstracto",
}


def extended_path(path: Path) -> Path:
    absolute = path.resolve()
    if os.name == "nt" and not str(absolute).startswith("\\\\?\\"):
        return Path("\\\\?\\" + str(absolute))
    return absolute


def read_file(path: Path) -> bytes:
    return extended_path(path).read_bytes()


def modified_ns(path: Path) -> int:
    return extended_path(path).stat().st_mtime_ns


def read_zip_member(path: Path, member: str) -> bytes:
    with zipfile.ZipFile(extended_path(path)) as archive:
        return archive.read(member)


def ascii_key(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9_-]+", "-", normalized.lower()).strip("-") or "resource"


def family_ref(path_parts: tuple[str, ...], source_id: str) -> str:
    joined = "/".join((*path_parts, source_id))
    match = re.search(r"\b(B[1-7]_T\d{2})\b", joined, flags=re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return ascii_key(path_parts[-1] if path_parts else "general")[:80]


def version_rank(*values: str) -> int:
    versions = [int(match) for value in values for match in re.findall(r"(?:^|[_\- ])V(\d+)(?:$|[_\-. ])", value, flags=re.IGNORECASE)]
    return max(versions, default=0)


def csv_rows(raw: bytes) -> list[dict[str, str]]:
    text = raw.decode("utf-8-sig")
    try:
        dialect = csv.Sniffer().sniff(text[:4096], delimiters=",;")
    except csv.Error:
        dialect = csv.excel
    return list(csv.DictReader(io.StringIO(text), dialect=dialect))


def add_asset(
    assets: dict[str, dict[str, Any]],
    aptitude: str,
    relative_parts: tuple[str, ...],
    filename: str,
    raw: bytes,
    loader: Callable[[], bytes],
    container: str,
    modified_ns: int,
) -> str | None:
    extension = Path(filename).suffix.lower()
    if extension not in (".png", ".svg") or not raw:
        return None
    source_id = Path(filename).stem
    sha = hashlib.sha256(raw).hexdigest()
    family = family_ref(relative_parts, source_id)
    logical = f"{aptitude}/{family}/{ascii_key(source_id)}"
    detected_version = version_rank(container, filename, *relative_parts)
    precedence = (detected_version, modified_ns, container.lower())
    existing = assets.get(logical)
    if existing:
        if existing["source_sha256"] == sha:
            return "duplicate"
        if precedence <= existing["_precedence"]:
            return "superseded"
    logical_hash = hashlib.sha256(logical.encode("utf-8")).hexdigest()[:10]
    object_path = f"{aptitude}/{ascii_key(family)}/{sha[:16]}-{logical_hash}-{ascii_key(source_id)}{extension}"
    assets[logical] = {
        "resource_key": logical,
        "source_id": source_id,
        "aptitude_slug": aptitude,
        "family_ref": family,
        "object_path": object_path,
        "mime_type": "image/svg+xml" if extension == ".svg" else "image/png",
        "size_bytes": len(raw),
        "source_sha256": sha,
        "metadata": {
            "container": container,
            "original_filename": filename,
            "detected_version": detected_version or None,
            "precedence_rule": "highest_version_then_latest_modified",
        },
        "source_version": VERSION,
        "active": True,
        "_loader": loader,
        "_precedence": precedence,
    }
    return "superseded" if existing is not None else None


def audit_manifest(raw: bytes, available_names: set[str]) -> tuple[int, list[str]]:
    rows = csv_rows(raw)
    if not rows:
        return 0, []
    filename_field = next((field for field in ("archivo", "filename", "file") if field in rows[0]), None)
    if not filename_field:
        return 0, []
    missing = [row.get(filename_field, "").strip() for row in rows if row.get(filename_field, "").strip() not in available_names]
    return len(rows), missing


def aptitude_roots(root: Path) -> list[tuple[str, Path]]:
    """Admite tanto un master de siete carpetas como el repositorio editorial completo."""
    candidates: list[tuple[str, Path]] = []
    package_roots: list[Path] = []
    curated_paths: set[Path] = set()
    for child in root.iterdir():
        if not child.is_dir():
            continue
        normalized = ascii_key(child.name).upper().replace("-", "_")
        direct = APTITUDES.get(normalized)
        if direct:
            candidates.append((direct, child))
            curated_paths.add(child)
            continue
        package_match = re.match(r"TROP_PAQUETE_0([1-7])(?:_|$)", normalized)
        if package_match:
            package_roots.append(child)
            candidates.append((PACKAGE_APTITUDES[package_match.group(1)], child))

    # El repositorio completo conserva además masters visuales auditados fuera
    # de los paquetes. Se incluyen y la deduplicación SHA evita multiplicarlos.
    if package_roots:
        for directory in root.rglob("*"):
            if not directory.is_dir():
                continue
            normalized = ascii_key(directory.name).upper().replace("-", "_")
            aptitude = APTITUDES.get(normalized)
            if not aptitude:
                continue
            if any(package_root in directory.parents for package_root in package_roots):
                continue
            ancestor_keys = {ascii_key(parent.name).upper().replace("-", "_") for parent in directory.parents}
            if not any("RECURSOS_VISUALES" in key for key in ancestor_keys):
                continue
            candidates.append((aptitude, directory))
            curated_paths.add(directory)

    curated_aptitudes = {aptitude for aptitude, directory in candidates if directory in curated_paths}
    candidates = [
        (aptitude, directory)
        for aptitude, directory in candidates
        if aptitude not in curated_aptitudes or directory in curated_paths
    ]

    unique: dict[tuple[str, str], tuple[str, Path]] = {}
    for aptitude, directory in candidates:
        unique[(aptitude, str(directory.resolve()).lower())] = (aptitude, directory)
    if not unique:
        raise ValueError(f"No se localizaron carpetas visuales TROP bajo {root}")
    return sorted(unique.values(), key=lambda item: (item[0], str(item[1])))


def inventory(root: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    if not root.is_dir():
        raise FileNotFoundError(f"No existe el repositorio visual: {root}")
    assets: dict[str, dict[str, Any]] = {}
    packaged_duplicates = 0
    version_conflicts_resolved = 0
    version_conflicts_by_aptitude: Counter[str] = Counter()
    manifest_rows = 0
    manifests = 0
    pending_manifest_references: list[tuple[str, str, list[str]]] = []

    for aptitude, aptitude_dir in aptitude_roots(root):
        for file_path in sorted(aptitude_dir.rglob("*")):
            relative = file_path.relative_to(aptitude_dir)
            if file_path.suffix.lower() in (".png", ".svg"):
                raw = read_file(file_path)
                resolution = add_asset(
                    assets, aptitude, relative.parts[:-1], file_path.name, raw,
                    loader=lambda path=file_path: read_file(path),
                    container=str(relative),
                    modified_ns=modified_ns(file_path),
                )
                packaged_duplicates += int(resolution == "duplicate")
                version_conflicts_resolved += int(resolution == "superseded")
                version_conflicts_by_aptitude[aptitude] += int(resolution == "superseded")
            elif file_path.name.lower() == "manifest.csv":
                available = {path.name for path in file_path.parent.iterdir()}
                checked, missing = audit_manifest(read_file(file_path), available)
                manifest_rows += checked
                if missing:
                    pending_manifest_references.append((aptitude, str(relative), missing))
                manifests += 1
            elif file_path.suffix.lower() == ".zip":
                if ascii_key(file_path.stem).startswith("trop_7_paquetes_psicotecnicos"):
                    continue
                with zipfile.ZipFile(extended_path(file_path)) as zipped:
                    names = zipped.namelist()
                    basenames = {Path(name).name for name in names if not name.endswith("/")}
                    for name in names:
                        if name.endswith("/"):
                            continue
                        member_name = Path(name).name
                        suffix = Path(member_name).suffix.lower()
                        if suffix in (".png", ".svg"):
                            raw = zipped.read(name)
                            resolution = add_asset(
                                assets, aptitude, tuple(Path(name).parts[:-1]) or (file_path.stem,),
                                member_name, raw,
                                loader=lambda archive=file_path, member=name: read_zip_member(archive, member),
                                container=f"{relative}!{name}",
                                modified_ns=modified_ns(file_path),
                            )
                            packaged_duplicates += int(resolution == "duplicate")
                            version_conflicts_resolved += int(resolution == "superseded")
                            version_conflicts_by_aptitude[aptitude] += int(resolution == "superseded")
                        elif member_name.lower() == "manifest.csv":
                            checked, missing = audit_manifest(zipped.read(name), basenames)
                            manifest_rows += checked
                            if missing:
                                pending_manifest_references.append((aptitude, f"{relative}!{name}", missing))
                            manifests += 1

    rows = list(assets.values())
    available_by_aptitude = {
        aptitude: {str(row["metadata"]["original_filename"]) for row in rows if row["aptitude_slug"] == aptitude}
        for aptitude in APTITUDES.values()
    }
    unresolved: list[str] = []
    for aptitude, label, missing in pending_manifest_references:
        still_missing = [name for name in missing if Path(name).name not in available_by_aptitude[aptitude]]
        if still_missing:
            unresolved.append(f"{label}: {still_missing[:5]}")
    if unresolved:
        raise ValueError(f"Manifiestos con referencias inexistentes: {unresolved[:5]}")
    numeric_v5 = {
        row["source_id"] for row in rows
        if row["aptitude_slug"] == "numerico" and re.fullmatch(r"B2_T\d{2}_\d{3}", row["source_id"])
    }
    if len(numeric_v5) != 540:
        raise ValueError(f"Numérico V5: se esperaban 540 recursos B2_Txx y hay {len(numeric_v5)}")
    counts = Counter(row["aptitude_slug"] for row in rows)
    report = {
        "status": "PASS",
        "resources": len(rows),
        "resources_by_aptitude": dict(sorted(counts.items())),
        "numeric_v5_resources": len(numeric_v5),
        "manifests_checked": manifests,
        "manifest_rows_checked": manifest_rows,
        "duplicate_packaging_collapsed": packaged_duplicates,
        "version_conflicts_resolved": version_conflicts_resolved,
        "version_conflicts_by_aptitude": dict(sorted(version_conflicts_by_aptitude.items())),
        "total_bytes": sum(row["size_bytes"] for row in rows),
    }
    return rows, report


def request(url: str, key: str, method: str, body: bytes | None, headers: dict[str, str]) -> None:
    req = urllib.request.Request(
        url, data=body, method=method,
        headers={"apikey": key, "Authorization": f"Bearer {key}", **headers},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            if response.status not in (200, 201, 204):
                raise RuntimeError(f"HTTP {response.status}")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:1000]
        raise RuntimeError(f"HTTP {exc.code}: {detail}") from exc


def apply(rows: list[dict[str, Any]], url: str, key: str, batch_size: int) -> None:
    rest = url.rstrip("/") + "/rest/v1"
    request(
        f"{rest}/trop_visual_resources?active=eq.true", key, "PATCH",
        json.dumps({"active": False}).encode(),
        {"Content-Type": "application/json", "Prefer": "return=minimal"},
    )
    for index, row in enumerate(rows, start=1):
        raw = row["_loader"]()
        object_url = url.rstrip("/") + "/storage/v1/object/trop-resources/" + urllib.parse.quote(row["object_path"], safe="/")
        request(object_url, key, "POST", raw, {"Content-Type": row["mime_type"], "x-upsert": "true"})
        if index % batch_size == 0 or index == len(rows):
            batch = [{key_name: value for key_name, value in item.items() if not key_name.startswith("_")} for item in rows[index - (index % batch_size or batch_size):index]]
            query = urllib.parse.urlencode({"on_conflict": "resource_key"})
            request(
                f"{rest}/trop_visual_resources?{query}", key, "POST",
                json.dumps(batch, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
                {"Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal"},
            )
            print(f"Recursos visuales cargados: {index}/{len(rows)}", file=sys.stderr, flush=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--export-dir", type=Path, help="Materializa el master vigente para una carga por CLI")
    parser.add_argument("--batch-size", type=int, default=100)
    args = parser.parse_args()
    rows, report = inventory(args.source)
    if args.export_dir:
        export_root = args.export_dir.resolve()
        export_root.mkdir(parents=True, exist_ok=True)
        for index, row in enumerate(rows, start=1):
            destination = export_root / row["object_path"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(row["_loader"]())
            if index % 250 == 0 or index == len(rows):
                print(f"Recursos visuales exportados: {index}/{len(rows)}", file=sys.stderr, flush=True)
        report["export_dir"] = str(export_root)
        report["exported_resources"] = len(rows)
    report["mode"] = "apply" if args.apply else "dry-run"
    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise RuntimeError("Faltan variables del Supabase local")
        apply(rows, url, key, args.batch_size)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
