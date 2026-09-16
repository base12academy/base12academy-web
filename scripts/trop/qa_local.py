#!/usr/bin/env python3
"""QA end-to-end de Tropa contra Next.js y Supabase locales."""

from __future__ import annotations

import argparse
import json
import os
import sys
import traceback
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any


PASSWORD = "Base12-QA-local-2026!"
APTITUDES = ["verbal", "numerico", "espacial", "mecanico", "perceptivo", "memoria", "abstracto"]
PROFILES = {
    "sin-tropa": None,
    "esencial": "esencial",
    "operativa": "operativa",
    "integral": "integral",
    "aptitud-verbal": "aptitud-verbal",
    "aptitud-numerica": "aptitud-numerica",
    "aptitud-espacial": "aptitud-espacial",
    "aptitud-mecanica": "aptitud-mecanica",
    "aptitud-perceptiva": "aptitud-perceptiva",
    "memoria": "memoria",
    "razonamiento-abstracto": "razonamiento-abstracto",
}
INDIVIDUAL_APTITUDE = {
    "aptitud-verbal": "verbal",
    "aptitud-numerica": "numerico",
    "aptitud-espacial": "espacial",
    "aptitud-mecanica": "mecanico",
    "aptitud-perceptiva": "perceptivo",
    "memoria": "memoria",
    "razonamiento-abstracto": "abstracto",
}
PLAN_EXPECTED = {
    "esencial": (14000, 7, 2000),
    "operativa": (21000, 14, 3000),
    "integral": (28000, 21, 4000),
}


@dataclass
class Response:
    status: int
    headers: Any
    raw: bytes

    def json(self) -> Any:
        return json.loads(self.raw.decode("utf-8")) if self.raw else {}


def http(method: str, url: str, headers: dict[str, str] | None = None, body: Any = None) -> Response:
    data = None if body is None else json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return Response(response.status, response.headers, response.read())
    except urllib.error.HTTPError as exc:
        return Response(exc.code, exc.headers, exc.read())


def expect(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


class Qa:
    def __init__(self, app_url: str, supabase_url: str, anon_key: str, service_key: str) -> None:
        self.app = app_url.rstrip("/")
        self.supabase = supabase_url.rstrip("/")
        self.anon_key = anon_key
        self.service_key = service_key
        self.results: list[dict[str, Any]] = []

    def record(self, check: str, **detail: Any) -> None:
        self.results.append({"check": check, "status": "PASS", **detail})

    def service_headers(self, extra: dict[str, str] | None = None) -> dict[str, str]:
        return {"apikey": self.service_key, "Authorization": f"Bearer {self.service_key}", "Content-Type": "application/json", **(extra or {})}

    def auth_headers(self, token: str) -> dict[str, str]:
        return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    def ensure_user(self, profile: str) -> tuple[str, str]:
        email = f"trop.qa.{profile}@example.test"
        users_response = http("GET", f"{self.supabase}/auth/v1/admin/users?page=1&per_page=1000", self.service_headers())
        expect(users_response.status == 200, f"No se pudieron listar usuarios QA: {users_response.status}")
        users_body = users_response.json()
        users = users_body.get("users", users_body if isinstance(users_body, list) else [])
        user = next((item for item in users if item.get("email") == email), None)
        if not user:
            created = http("POST", f"{self.supabase}/auth/v1/admin/users", self.service_headers(), {
                "email": email, "password": PASSWORD, "email_confirm": True,
                "user_metadata": {"purpose": "TROP_LOCAL_QA", "profile": profile},
            })
            expect(created.status in (200, 201), f"No se pudo crear {profile}: {created.status} {created.raw[:200]!r}")
            user = created.json()
        return str(user["id"]), email

    def enroll(self, user_id: str, plan_slug: str | None) -> None:
        if not plan_slug:
            return
        endpoint = f"{self.supabase}/rest/v1/course_enrollments?on_conflict=user_id,course_slug,plan_slug"
        response = http("POST", endpoint, self.service_headers({"Prefer": "resolution=merge-duplicates,return=minimal"}), {
            "user_id": user_id,
            "course_slug": "tropa-y-marineria",
            "plan_slug": plan_slug,
            "status": "active",
            "metadata": {"purpose": "TROP_LOCAL_QA"},
        })
        expect(response.status in (200, 201, 204), f"No se pudo matricular {plan_slug}: {response.status}")

    def sign_in(self, email: str) -> str:
        endpoint = f"{self.supabase}/auth/v1/token?grant_type=password"
        response = http("POST", endpoint, {"apikey": self.anon_key, "Content-Type": "application/json"}, {"email": email, "password": PASSWORD})
        expect(response.status == 200, f"Login falló para {email}: {response.status}")
        return str(response.json()["access_token"])

    def api(self, token: str, path: str, method: str = "GET", body: Any = None) -> Response:
        return http(method, f"{self.app}{path}", self.auth_headers(token), body)

    def validate_profile(self, profile: str, token: str) -> None:
        access_response = self.api(token, "/api/tropa/access")
        plan = PROFILES[profile]
        if plan is None:
            expect(access_response.status == 403, "El usuario sin Tropa obtuvo acceso")
            self.record("access_without_tropa_blocked", profile=profile)
            return
        expect(access_response.status == 200, f"Acceso {profile}: {access_response.status}")
        access = access_response.json()
        if plan in PLAN_EXPECTED:
            questions, motors, per_aptitude = PLAN_EXPECTED[plan]
            expect(access["questionCount"] == questions, f"{profile}: questionCount")
            expect(access["motorCount"] == motors, f"{profile}: motorCount")
            expect(len(access["aptitudeSlugs"]) == 7, f"{profile}: aptitudes")
            expected_aptitudes = APTITUDES
        else:
            expected_aptitude = INDIVIDUAL_APTITUDE[plan]
            expect(access["questionCount"] == 4000 and access["motorCount"] == 3, f"{profile}: grant individual")
            expect(access["aptitudeSlugs"] == [expected_aptitude], f"{profile}: aislamiento de aptitud")
            per_aptitude = 4000
            expected_aptitudes = [expected_aptitude]
        self.record("access_profile", profile=profile, questions=access["questionCount"], motors=access["motorCount"])

        allowed_aptitude = expected_aptitudes[0]
        for aptitude_slug in expected_aptitudes:
            questions_response = self.api(token, f"/api/tropa/questions?aptitude={aptitude_slug}&limit=3")
            expect(questions_response.status == 200, f"{profile}: no lee preguntas de {aptitude_slug}")
            questions_body = questions_response.json()
            expect(
                questions_body["totalAvailable"] == per_aptitude,
                f"{profile}: preguntas de {aptitude_slug}: {questions_body['totalAvailable']}",
            )
            expect(len(questions_body["questions"]) == 3, f"{profile}: lote de preguntas de {aptitude_slug}")
        self.record("question_filter", profile=profile, aptitudes=expected_aptitudes, available_each=per_aptitude)

        blocked_aptitude = next((item for item in APTITUDES if item not in expected_aptitudes), None)
        if blocked_aptitude:
            blocked = self.api(token, f"/api/tropa/questions?aptitude={blocked_aptitude}&limit=1")
            expect(blocked.status == 403, f"{profile}: pudo leer {blocked_aptitude}")
            self.record("cross_aptitude_block", profile=profile, blocked=blocked_aptitude)

        content_response = self.api(token, f"/api/tropa/content?aptitude={allowed_aptitude}")
        expect(content_response.status == 200, f"{profile}: contenido pedagógico")
        content = content_response.json()
        expect(len(content["microtemarios"]) == 3 and len(content["games"]) == 3, f"{profile}: motores/temarios")
        expect(len(content["workshops"]) > 0, f"{profile}: talleres")
        self.record("pedagogy_content", profile=profile, workshops=len(content["workshops"]), microtemarios=3)

        if plan in INDIVIDUAL_APTITUDE:
            simulacros = self.api(token, "/api/tropa/simulacros")
            expect(simulacros.status == 200 and len(simulacros.json()["simulacros"]) == 20, f"{profile}: catálogo de simulacros")
            simulacro_id = simulacros.json()["simulacros"][0]["simulacro_id"]
            simulacro = self.api(token, f"/api/tropa/simulacros?id={simulacro_id}")
            expect(simulacro.status == 200 and len(simulacro.json()["questions"]) == 15, f"{profile}: simulacro individual")
            self.record("individual_simulacro_scope", profile=profile, questions=15)

    def exercise_runtime(self, token: str) -> None:
        question_response = self.api(token, "/api/tropa/questions?aptitude=numerico&limit=1")
        question = question_response.json()["questions"][0]
        source_id = question.get("stimulus", {}).get("resource_v5_reference")
        expect(bool(source_id), "La pregunta Numérico V2 no enlaza recurso V5")
        resource = self.api(token, f"/api/tropa/resource?aptitude=numerico&id={urllib.parse.quote(source_id)}")
        expect(resource.status == 200 and resource.headers.get_content_type() == "image/png", "Recurso visual no disponible")
        self.record("numeric_v5_image", source_id=source_id, bytes=len(resource.raw))

        answer = self.api(token, "/api/tropa/answer", "POST", {"questionId": question["question_id"], "selectedOption": "A", "responseMs": 1234})
        expect(answer.status == 200 and "correctOption" in answer.json(), "Corrección/feedback falló")
        progress = self.api(token, "/api/tropa/progress")
        expect(progress.status == 200 and progress.json()["totalAnswered"] >= 1, "Progreso no registrado")
        self.record("answer_feedback_progress", total=progress.json()["totalAnswered"])

        simulacros = self.api(token, "/api/tropa/simulacros")
        expect(simulacros.status == 200 and len(simulacros.json()["simulacros"]) == 20, "Catálogo de simulacros")
        sim_id = simulacros.json()["simulacros"][0]["simulacro_id"]
        sim = self.api(token, f"/api/tropa/simulacros?id={sim_id}")
        sim_questions = sim.json()["questions"]
        expect(len(sim_questions) == 105, "Integral debe recibir 105 preguntas de simulacro")
        sim_answers = {item["question_id"]: "A" for item in sim_questions}
        sim_result = self.api(token, "/api/tropa/simulacros", "POST", {"simulacroId": sim_id, "answers": sim_answers})
        expect(sim_result.status == 200 and sim_result.json()["total"] == 105, "Corrección de simulacro")
        self.record("simulacro_runtime", simulacro=sim_id, questions=105)

        operations = self.api(token, "/api/tropa/operations")
        operations_body = operations.json()
        expect(operations.status == 200 and len(operations_body["seaTrials"]) == 7 and len(operations_body["operations"]) == 8, "Catálogo operativo")
        expect(
            len(operations_body["forms"]) == 15,
            f"Catálogo de 15 formas operativas: {len(operations_body.get('forms', []))} "
            f"{[item.get('form_code') for item in operations_body.get('forms', [])]}",
        )
        form_code = operations_body["forms"][0]["form_code"]
        form = self.api(token, f"/api/tropa/operations?form={form_code}")
        form_questions = form.json()["questions"]
        expect(len(form_questions) > 0, "Forma operativa vacía")
        form_answers = {item["question_id"]: "A" for item in form_questions}
        form_result = self.api(token, "/api/tropa/operations", "POST", {"formCode": form_code, "answers": form_answers})
        expect(form_result.status == 200, "Corrección de operación")
        self.record("operation_runtime", form=form_code, questions=len(form_questions))

        for role in ("rocio", "fernando"):
            tutor = self.api(token, "/api/tropa/ia", "POST", {
                "aptitude": "numerico",
                "role": role,
                "message": "Resume mi siguiente paso de estudio en una frase.",
            })
            if tutor.status == 503:
                self.results.append({"check": "ai_tutor", "status": "EXTERNAL_UNAVAILABLE", "role": role})
                continue
            expect(tutor.status == 200 and bool(tutor.json().get("answer")), f"Tutor IA {role}: {tutor.status}")
            self.record("ai_tutor", role=role)

    def session_reopen(self, email: str, token: str) -> None:
        logout = http("POST", f"{self.supabase}/auth/v1/logout", {"apikey": self.anon_key, "Authorization": f"Bearer {token}"})
        expect(logout.status in (200, 204), "No se pudo cerrar sesión")
        closed = self.api(token, "/api/tropa/access")
        expect(closed.status == 401, "El token siguió activo tras cerrar sesión")
        reopened = self.sign_in(email)
        expect(self.api(reopened, "/api/tropa/access").status == 200, "No se recuperó el acceso al reabrir sesión")
        self.record("session_close_reopen")

    def routes_and_regressions(self) -> None:
        routes = [
            "/", "/tropa-y-marineria", "/dashboard/tropa-y-marineria",
            "/dashboard/tropa-y-marineria/numerico", "/dashboard/tropa-y-marineria/simulacros",
            "/dashboard/tropa-y-marineria/operaciones", "/dashboard/ofimatica", "/dashboard/historia-espana",
        ]
        statuses = {}
        for route in routes:
            response = http("GET", self.app + route)
            statuses[route] = response.status
            expect(response.status == 200, f"Ruta rota {route}: {response.status}")
        self.record("routes_and_existing_courses", routes=statuses)

    def run(self) -> dict[str, Any]:
        tokens: dict[str, str] = {}
        emails: dict[str, str] = {}
        for profile, plan in PROFILES.items():
            user_id, email = self.ensure_user(profile)
            self.enroll(user_id, plan)
            emails[profile] = email
            tokens[profile] = self.sign_in(email)
            self.validate_profile(profile, tokens[profile])
        self.exercise_runtime(tokens["integral"])
        self.session_reopen(emails["integral"], tokens["integral"])
        self.routes_and_regressions()
        return {"status": "PASS", "profiles": len(PROFILES), "checks": self.results}


def env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Falta {name}")
    return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--app-url", default="http://127.0.0.1:3012")
    args = parser.parse_args()
    qa = Qa(
        args.app_url,
        env("NEXT_PUBLIC_SUPABASE_URL"),
        env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        env("SUPABASE_SERVICE_ROLE_KEY"),
    )
    print(json.dumps(qa.run(), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)
