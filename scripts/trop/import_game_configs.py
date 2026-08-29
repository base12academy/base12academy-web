import argparse
import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    root = Path(args.source)
    files = sorted(root.rglob("JUEGOS_*_CONFIG.json"))

    if len(files) != 7:
        raise RuntimeError(f"Se esperaban 7 archivos de juegos y se detectaron {len(files)}")

    rows = []
    motors = set()
    micros = set()

    for path in files:
        raw = path.read_bytes()
        data = json.loads(raw.decode("utf-8-sig"))

        if not isinstance(data, list):
            raise RuntimeError(f"Formato no válido: {path.name}")

        for item in data:
            motor = (item.get("motor_id") or item.get("id") or "").strip()
            micro = (item.get("microtemario_id") or item.get("microtemario") or "").strip()
            name = (item.get("nombre") or "").strip()
            sequence = (item.get("secuencia") or "").strip()

            if not motor or not micro or not name or not sequence:
                raise RuntimeError(f"Registro incompleto en {path.name}: {item}")

            if motor in motors:
                raise RuntimeError(f"Motor duplicado: {motor}")
            if micro in micros:
                raise RuntimeError(f"Microtemario duplicado: {micro}")

            motors.add(motor)
            micros.add(micro)

            rows.append({
                "motor_code": motor,
                "micro_id": micro,
                "game_name": name,
                "config_json": item,
                "source_file": path.name,
                "source_sha256": hashlib.sha256(raw).hexdigest(),
                "source_version": "TROP_JUEGOS_CONFIG-2026-08-29",
                "active": True,
            })

    if len(rows) != 21:
        raise RuntimeError(f"Se esperaban 21 juegos y se detectaron {len(rows)}")

    if args.apply:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise RuntimeError("Faltan variables de Supabase")

        endpoint = url.rstrip("/") + "/rest/v1/trop_game_configs?on_conflict=motor_code"
        payload = json.dumps(rows, ensure_ascii=False).encode("utf-8")

        request = urllib.request.Request(
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

        urllib.request.urlopen(request).read()

    print(json.dumps({
        "status": "PASS",
        "mode": "apply" if args.apply else "dry-run",
        "files": len(files),
        "games": len(rows),
        "motors": len(motors),
        "microtemarios": len(micros),
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)
