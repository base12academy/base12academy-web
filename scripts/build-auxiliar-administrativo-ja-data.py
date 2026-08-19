import csv
import json
import re
from pathlib import Path

from docx import Document
from test_bank_docx import parse_test_bank_from_zip

SOURCE = Path(r"E:\Escritorio\Agente IA\Oposiciones\Junta de Andalucía\Auxiliar Administrativo JA")
OUTPUT = Path(__file__).resolve().parents[1] / "lib" / "auxiliar-administrativo-ja-content.json"
INDEX_OUTPUT = Path(__file__).resolve().parents[1] / "lib" / "auxiliar-administrativo-ja-index.json"


def read_csv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def repair(value):
    value = (value or "").strip()
    replacements = {
        "Â¿": "¿", "Â¡": "¡", "Â«": "«", "Â»": "»", "Â·": "·",
        "Ã¡": "á", "Ã©": "é", "Ã­": "í", "Ã³": "ó", "Ãº": "ú",
        "Ã": "Á", "Ã‰": "É", "Ã": "Í", "Ã“": "Ó", "Ãš": "Ú",
        "Ã±": "ñ", "Ã‘": "Ñ", "Ã¼": "ü", "Ãœ": "Ü",
    }
    for broken, fixed in replacements.items():
        value = value.replace(broken, fixed)
    if "Ã" in value or "Â" in value:
        try:
            return value.encode("latin-1").decode("utf-8")
        except UnicodeError:
            return value
    return value


theme_rows = read_csv(SOURCE / "Temario" / "Temario_22_Temas_Auxiliar_Administrativo_JA_Importacion.csv")
glossary_rows = read_csv(SOURCE / "Glosarios" / "Glosarios_Auxiliar_Administrativo_JA_Importacion.csv")
question_rows = read_csv(SOURCE / "Preguntas cerradas Rocío" / "Preguntas_Cerradas_Profesor_IA_Auxiliar_Administrativo_JA_Importacion.csv")
TEST_ZIP = SOURCE / "Test" / "Bancos_Test_Auxiliar_JA_T01_T22_50_Preguntas.zip"

videos = {
    1: "Q1hB77f1h3s", 2: "E4ivM8OKLKY", 3: "5swEjEqzseA", 4: "fZBEiLwDXfc",
    5: "5Q2ZnUVLZ0A", 6: "HoRT7eBEJos", 7: "dIbMjhPX_-o", 8: "sNgyxYxYxcM",
    9: "ZIFO6U3it58", 10: "gYe7OgJ-4Q8", 11: "wuJEE8Eo5ZE", 12: "Exxfu9Ov3xs",
    13: "UHXurNDhBrk", 14: "v-A5EfcERuo", 15: "9mmJCd655Pc", 16: "HcC0Xb_aYiU",
    17: "1hyCQrZpPQw", 18: "ZamjZHD8hNk", 19: "s0jOHH6Wg6g", 20: "QGB_0MkivaU",
    21: "IC4L0y63wAU", 22: "LHwbeyl8RoQ",
}

title_by_theme = {int(row["theme"]): repair(row["title"]) for row in theme_rows}
themes = []
for number in range(1, 23):
    path = SOURCE / "Temario" / f"Tema_{number:02d}_Auxiliar_Administrativo_JA_Base12.docx"
    doc = Document(path)
    paragraphs = [repair(re.sub(r"\s+", " ", p.text)) for p in doc.paragraphs]
    paragraphs = [p for p in paragraphs if p]
    title = title_by_theme.get(number, f"Tema {number}")
    while paragraphs and (paragraphs[0].lower().startswith("tema ") or paragraphs[0].lower() == title.lower()):
        paragraphs.pop(0)

    glossary = [
        {"term": repair(row["term"]), "definition": repair(row["definition"])}
        for row in glossary_rows if int(row["theme"]) == number
    ]
    rocio = [
        {"question": repair(row["question"]), "answer": repair(row["answer"])}
        for row in question_rows if int(row["theme"]) == number
    ]
    tests = parse_test_bank_from_zip(
        TEST_ZIP, f"T{number:02d}_Banco_50_Preguntas_Auxiliar_JA.docx"
    )

    themes.append({
        "id": f"T{number:02d}",
        "number": number,
        "title": title,
        "videoUrl": f"https://www.youtube-nocookie.com/embed/{videos[number]}",
        "explanation": "\n\n".join(paragraphs),
        "glossary": glossary,
        "rocio": rocio,
        "tests": tests,
        "publicPreview": number == 1,
    })

OUTPUT.write_text(json.dumps({"course": "Auxiliar Administrativo de la Junta de Andalucía", "themes": themes}, ensure_ascii=False, indent=2), encoding="utf-8")
INDEX_OUTPUT.write_text(json.dumps({"course": "Auxiliar Administrativo de la Junta de Andalucía", "themes": [{key: theme[key] for key in ("id", "number", "title", "publicPreview")} for theme in themes]}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{len(themes)} temas escritos en {OUTPUT}")
