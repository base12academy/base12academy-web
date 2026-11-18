"""Convert the reviewed Haciendas Locales packages to the existing Base12 classroom format."""

import argparse
import io
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
VAL = "{" + NS["w"] + "}val"
COURSES = {
    "administrativos-haciendas-locales": (
        "Base12_Haciendas_Locales", "Administrativos de Haciendas Locales", "C1", 51,
    ),
    "auxiliares-haciendas-locales": (
        "Base12_Auxiliares_Ayuntamiento_C2", "Auxiliares Administrativos de Haciendas Locales", "C2", 30,
    ),
}


def paragraph_text(node):
    return "".join(child.text or "" for child in node.iterfind(".//w:t", NS)).strip()


def document(archive, filename):
    with ZipFile(io.BytesIO(archive.read(filename))) as source:
        root = ET.fromstring(source.read("word/document.xml"))
    blocks = []
    for element in root.find("w:body", NS):
        kind = element.tag.rsplit("}", 1)[-1]
        if kind == "p":
            style = element.find("w:pPr/w:pStyle", NS)
            text = paragraph_text(element)
            if text:
                blocks.append((style.get(VAL) if style is not None else "", text))
        if kind == "tbl":
            rows = [["\n".join(filter(None, map(paragraph_text, cell.findall("w:p", NS))))
                     for cell in row.findall("w:tc", NS)] for row in element.findall("w:tr", NS)]
            blocks.append(("table", rows))
    return blocks


def material(files, directory, prefix, solution=False):
    names = [
        name for name in files.namelist()
        if name.startswith(f"{directory}/{prefix}") and name.endswith(".docx")
        and ("solucionario" in name.lower()) == solution
    ]
    if len(names) != 1:
        raise ValueError(f"Expected one file matching {directory}/{prefix}: {names}")
    return document(files, names[0])


def questions(source, solutions, prefix, total):
    pairs = {}
    for _, text in solutions:
        if isinstance(text, str) and (match := re.fullmatch(r"(\d+)\.\s+([A-D])[.)]\s*(.+)", text)):
            number, key, explanation = match.groups()
            if number in pairs:
                raise ValueError(f"{prefix}: repeated solution {number}")
            pairs[number] = (key, explanation)
    result = []
    for _, text in source:
        if not isinstance(text, str):
            continue
        if match := re.fullmatch(r"(\d+)\.\s+(.+)", text):
            number, prompt = match.groups()
            if number not in pairs or int(number) != len(result) + 1:
                raise ValueError(f"{prefix}: unmatched question {number}")
            key, explanation = pairs[number]
            result.append({"id": f"{prefix}-{number}", "question": prompt, "options": [],
                           "answer": ord(key) - ord("A"), "explanation": explanation})
        elif match := re.fullmatch(r"([A-D])[.)]\s+(.+)", text):
            key, option = match.groups()
            if not result or len(result[-1]["options"]) != ord(key) - ord("A"):
                raise ValueError(f"{prefix}: option out of order")
            result[-1]["options"].append(option)
    if len(result) != total or len(pairs) != total or any(len(row["options"]) != 4 for row in result):
        raise ValueError(f"{prefix}: expected {total}, got {len(result)} questions and {len(pairs)} solutions")
    return result


def glossary(blocks):
    entries = []
    for style, text in blocks:
        if style.startswith("Heading") or style in {"table", "Title"} or ". " not in text:
            continue
        term, definition = text.split(". ", 1)
        if not term.startswith(("Tema ", "Voces ", "Consulta ", "Se recogen ")):
            entries.append({"term": term, "definition": definition})
    return entries


def rocio(blocks):
    closed, opened = [], []
    target, prompt = closed, []
    for style, text in blocks:
        if not isinstance(text, str):
            continue
        if style.startswith("Heading") and "preguntas abiertas" in text.lower():
            target, prompt = opened, []
        elif style.startswith("Heading") and (match := re.fullmatch(r"\d+\.\s+(.+)", text)):
            prompt = [match[1]]
        elif text.startswith("Respuesta esperada. ") and prompt:
            target.append({"question": "\n".join(prompt), "answer": text.removeprefix("Respuesta esperada. ")})
            prompt = []
        elif text.startswith("Criterio de corrección. "):
            if target:
                target[-1]["answer"] += "\n\n" + text
        elif prompt:
            prompt.append(text)
    return closed, opened


def chapter(blocks):
    result = []
    for style, text in blocks:
        if style == "table":
            result.append({"type": "table", "text": "\n".join(" · ".join(row) for row in text), "rows": text})
        else:
            kind = "heading" if style.startswith("Heading") else "source" if re.fullmatch(r"https://\S+", text) else "paragraph"
            result.append({"type": kind, "text": text})
    return result


def course_data(directory, slug, config):
    archive_prefix, title, level, total = config
    output = {}
    index = {"courseSlug": slug, "title": title, "shortTitle": title, "level": level,
             "region": "Haciendas Locales", "durationMonths": 12, "enrollmentOpen": False,
             "themes": [], "simulations": [], "simulationNote": "Practica con un modelo aleatorio de 20 preguntas o con los cinco simulacros completos del curso."}
    all_glossary = []
    with ZipFile(directory / f"{archive_prefix}_Esencial.zip") as essential, ZipFile(directory / f"{archive_prefix}_Estandar.zip") as standard:
        for number in range(1, total + 1):
            code = f"T{number:02}"
            prefix = f"Tema_{number:02}_"
            content = material(essential, "01_Temario", prefix)
            name = re.sub(r"^Tema\s+0*\d+\s*[.·:\-]?\s*", "", content[0][1], flags=re.I)
            if not name or name.lower() == "temario y explicaciones":
                name = re.sub(r"^Tema\s+0*\d+\s*[.·:\-]?\s*", "", content[1][1], flags=re.I)
            basics = questions(material(essential, "02_Comprobacion", prefix),
                               material(essential, "02_Comprobacion", prefix, True), code + "C", 10)
            bank = questions(material(standard, "05_Bancos", prefix),
                             material(standard, "05_Bancos", prefix, True), code + "B", 50)
            terms = glossary(material(essential, "03_Glosario", prefix))
            closed, opened = rocio(material(essential, "04_Rocio", prefix))
            if not name or not terms or not closed:
                raise ValueError(f"{slug} {code}: incomplete topic, glossary or Rocío")
            meta = {"id": code, "code": code, "number": number, "title": name, "publicPreview": number == 1}
            index["themes"].append(meta)
            output[code] = {**meta, "blocks": chapter(content), "glossary": terms, "rocio": closed,
                            "rocioOpen": opened, "checkTests": basics, "tests": bank}
            all_glossary.extend({**term, "topics": [number]} for term in terms)
        for number in range(1, 6):
            code = f"SIM{number:02}"
            prefix = f"Simulacro_{number:02}"
            questions_doc = material(standard, "06_Simulacros", prefix)
            answer_doc = material(standard, "06_Simulacros", prefix, True)
            simulation = {"id": code, "title": questions_doc[0][1], "count": 20}
            index["simulations"].append(simulation)
            output[code] = {**simulation, "questions": questions(questions_doc, answer_doc, code, 20)}
    index["counts"] = {"themes": total, "questions": total * 50, "glossary": len(all_glossary),
                       "closedRocio": sum(len(output[item["id"]]["rocio"]) for item in index["themes"]), "simulations": len(index["simulations"])}
    output["index"] = index
    output["resources"] = {"format": "base12-opposition-v2", "glossary": all_glossary, "simulations": index["simulations"]}
    return output


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("archives", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    data = {slug: course_data(args.archives, slug, config) for slug, config in COURSES.items()}
    args.output.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    for slug, resources in data.items():
        print(slug, resources["index"]["counts"])


if __name__ == "__main__":
    main()
