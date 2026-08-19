import re
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

from docx import Document


QUESTION_RE = re.compile(r"^(\d{1,2})\.\s+(.+)$")
OPTION_RE = re.compile(r"^([ABCD])[\)\.]\s*(.+)$")
SOLUTION_RE = re.compile(r"^(\d{1,2})\.\s+([ABCD])(?:\)|\s*[—–-])\s*(.*)$")


def _document_paragraphs(source):
    return [paragraph.text.strip() for paragraph in Document(source).paragraphs]


def parse_test_bank(source):
    paragraphs = _document_paragraphs(source)
    solution_start = next(
        (index for index, text in enumerate(paragraphs) if text.lower().startswith("solucionario")),
        None,
    )
    if solution_start is None:
        raise ValueError("El documento no contiene un solucionario")

    questions = {}
    current = None
    for text in paragraphs[:solution_start]:
        question_match = QUESTION_RE.match(text)
        option_match = OPTION_RE.match(text)
        if question_match:
            number = int(question_match.group(1))
            current = {"question": question_match.group(2).strip(), "options": []}
            questions[number] = current
        elif option_match and current is not None:
            current["options"].append(option_match.group(2).strip())

    solutions = {}
    current_solution = None
    for text in paragraphs[solution_start + 1:]:
        match = SOLUTION_RE.match(text)
        if match:
            number = int(match.group(1))
            current_solution = number
            solutions[number] = {
                "answer": "ABCD".index(match.group(2)),
                "explanation": match.group(3).strip(),
            }
            continue
        if current_solution is None or not text:
            continue
        if text.lower().startswith(("fuente:", "fuentes ", "programa oficial", "referencia ", "fecha de ")):
            continue
        if text.startswith(("Glosario del Tema", "Profesor IA", "Temario completo")):
            continue
        if not solutions[current_solution]["explanation"]:
            solutions[current_solution]["explanation"] = text

    result = []
    for number in range(1, 51):
        question = questions.get(number)
        solution = solutions.get(number)
        if not question or len(question["options"]) != 4 or not solution:
            raise ValueError(f"Pregunta {number} incompleta")
        result.append({**question, **solution})
    return result


def parse_test_bank_from_zip(zip_path: Path, member_name: str):
    with ZipFile(zip_path) as archive:
        with archive.open(member_name) as member:
            return parse_test_bank(BytesIO(member.read()))
