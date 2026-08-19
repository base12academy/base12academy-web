import csv
import json
import re
from pathlib import Path

from docx import Document

SOURCE = Path(r"E:\Escritorio\Agente IA\Oposiciones\Junta de Andalucía\Administrativo JA")
OUTPUT = Path(__file__).resolve().parents[1] / "lib" / "administrativo-ja-content.json"


def read_csv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


glossary_rows = read_csv(SOURCE / "Glosarios" / "Glosarios_Administrativo_JA_Importacion.csv")
question_rows = read_csv(SOURCE / "Preguntas cerradas Rocío" / "Profesor_IA_Preguntas_Cerradas_Administrativo_JA_Importacion.csv")
test_rows = read_csv(SOURCE / "Tests" / "Banco_1250_Preguntas_Administrativo_JA_Importacion.csv")

videos = {
    1: "Q1hB77f1h3s", 2: "mVT3mjxmiqM", 3: "E4ivM8OKLKY", 4: "dzzB_hrLbuE",
    5: "5swEjEqzseA", 6: "fZBEiLwDXfc", 7: "5Q2ZnUVLZ0A", 8: "VHUasOjGRzw",
    9: "4U-So7FmMY0", 10: "dIbMjhPX_-o", 11: "QZIyzMqrSUc", 12: "aJViUwa2kHo",
    13: "aTRzceiqAnE", 14: "V0r0evriXt0", 15: "owcf_vkbDkQ", 16: "d8X3f36jIMI",
    17: "xct31rRadoM", 18: "_C1mmjwLRqM", 19: "joeN4WEEnzg", 20: "G3iaYj6qG6g",
    21: "QnG7xb34pAI", 22: "7-r9M7hEDlA", 23: "UoteiVXTk-Y", 24: "0830ku31Ar4",
    25: "nyeVlxoaz3g", 26: "yppjMSCD2PU", 27: "jynDErVAM2s", 28: "VR3w4hsn0Jc",
    29: "-Q5UbYBXRDk", 30: "ARFCqwSEiUc", 31: "ArFkj6A3pIw", 32: "NcZlM1qo3SQ",
    33: "52qmKZ0llac", 34: "XIP67AyjSF8", 35: "ECy5FZ_FLtY", 36: "RMCvmNkejfA",
    37: "_9GrO-Gh4K8", 38: "ioFZQpPuuhk", 39: "luQ-4E9tKAQ", 40: "Pj9kekccyGs",
    41: "KSBA7Cel_-M", 42: "2TspJdWvRqQ",
}

title_by_theme = {}
for row in glossary_rows:
    title_by_theme.setdefault(int(row["theme"]), row["theme_title"].strip())

themes = []
for number in range(1, 43):
    path = SOURCE / "Temario" / f"PAJA_Explicacion_T{number:02d}.docx"
    doc = Document(path)
    paragraphs = [re.sub(r"\s+", " ", p.text).strip() for p in doc.paragraphs]
    paragraphs = [p for p in paragraphs if p]
    title = title_by_theme.get(number, f"Tema {number}")
    while paragraphs and (paragraphs[0].lower().startswith("tema ") or paragraphs[0].lower() == title.lower()):
        paragraphs.pop(0)

    glossary = [
        {"term": row["term"].strip(), "definition": row["definition"].strip()}
        for row in glossary_rows if int(row["theme"]) == number
    ]
    rocio = [
        {"question": row["question"].strip(), "answer": row["answer"].strip()}
        for row in question_rows if int(row["theme"]) == number
    ]
    tests = []
    for row in test_rows:
        if int(row["theme"]) != number or len(tests) >= 10:
            continue
        tests.append({
            "question": row["stem"].strip(),
            "options": [row[f"option_{letter}"].strip() for letter in "abcd"],
            "answer": int(row["correct_index"]),
            "explanation": row["explanation"].strip(),
        })

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

OUTPUT.write_text(json.dumps({"course": "Administrativo/a de la Junta de Andalucía", "themes": themes}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{len(themes)} temas escritos en {OUTPUT}")
