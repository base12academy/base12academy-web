import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { C11000_EVALUABLE_QUESTIONS, C11000_TOTAL_QUESTIONS, OPO12_TIME_ZONE, OPO12_TRAINING_QUESTION_COUNTS } from "../lib/opo12/config.ts";
import { selectBalancedQuestions, selectReviewQuestions, selectTopicQuestions } from "../lib/opo12/selection.ts";
import { resolveSubscriptionState } from "../lib/opo12/subscription.ts";

test("el perfil C1.1000 reproduce la convocatoria", () => {
  assert.equal(C11000_TOTAL_QUESTIONS, 107);
  assert.equal(C11000_EVALUABLE_QUESTIONS, 100);
  assert.equal(OPO12_TIME_ZONE, "Europe/Madrid");
  assert.deepEqual(OPO12_TRAINING_QUESTION_COUNTS, [10, 20, 30, 50]);
});

test("la migración serializa inicios concurrentes y reanuda el intento abierto", async () => {
  const sql = await readFile(new URL("../supabase/migrations/20261116090000_opo12_foundation.sql", import.meta.url), "utf8");
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /at time zone 'Europe\/Madrid'/);
  assert.match(sql, /status in \('preparing', 'in_progress'\)/);
  assert.match(sql, /mode in \('simulation','topic','review'\)/);
  assert.match(sql, /private\.opo12_has_active_access/);
  assert.doesNotMatch(sql, /daily_slot|daily_limit_reached|generate_series\(1, 2\)/);
});

test("un intento no se publica hasta tener preguntas y soluciones", async () => {
  const route = await readFile(new URL("../app/api/opo12/attempt/route.ts", import.meta.url), "utf8");
  assert.match(route, /attempt_preparing/);
  assert.match(route, /status: "in_progress"/);
  assert.match(route, /\.eq\("status", "preparing"\)/);
  assert.match(route, /"Retry-After": "1"/);
  assert.match(route, /attempt_time_elapsed/);
  assert.match(route, /submittedAfterDeadline \? "expired" : "submitted"/);
});

test("la interfaz utiliza las API reales para guardar, entregar, consultar e informar incidencias", async () => {
  const page = await readFile(new URL("../app/opo12/page.tsx", import.meta.url), "utf8");
  const client = await readFile(new URL("../lib/opo12/client.ts", import.meta.url), "utf8");
  const overview = await readFile(new URL("../app/api/opo12/overview/route.ts", import.meta.url), "utf8");
  assert.match(page, /loadOpo12Overview/);
  assert.match(page, /startOpo12Attempt/);
  assert.match(page, /saveOpo12Answer/);
  assert.match(page, /submitOpo12Attempt/);
  assert.match(page, /createOpo12Incident/);
  assert.match(page, /formatCountdown/);
  assert.match(client, /Authorization: `Bearer \$\{token\}`/);
  assert.match(client, /attempt_preparation_timeout/);
  assert.doesNotMatch(client, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(overview, /\["preparing", "in_progress"\]\.includes\(attempt\.status\)/);
});

test("la interfaz conserva navegacion y entrega adaptadas al movil", async () => {
  const css = await readFile(new URL("../app/opo12/opo12.module.css", import.meta.url), "utf8");
  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /\.header nav\{position:fixed;bottom:0/);
  assert.match(css, /\.examActions\{position:fixed;bottom:0/);
  assert.match(css, /\.modeGrid\{grid-template-columns:1fr\}/);
});

test("el ciclo de impago se ejecuta a las 23:59 de Madrid y borra el historial al cancelar", async () => {
  const sql = await readFile(new URL("../supabase/migrations/20261116090000_opo12_foundation.sql", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/opo12/attempt/route.ts", import.meta.url), "utf8");
  assert.match(sql, /opo12_run_subscription_lifecycle/);
  assert.match(sql, /extract\(hour from v_local\) <> 23/);
  assert.match(sql, /extract\(minute from v_local\) <> 59/);
  assert.match(sql, /paid_through \+ 10 <= v_local_day/);
  assert.match(sql, /delete from public\.opo12_attempts/);
  assert.match(sql, /status not in \('preparing', 'in_progress'\)/);
  assert.match(sql, /59 21 \* \* \*/);
  assert.match(sql, /59 22 \* \* \*/);
  assert.match(sql, /opo12_failed_subscriptions_cutoff/);
  assert.match(sql, /opo12_stale_preparing_attempts/);
  assert.match(route, /purgedAfterDelivery/);
});

test("la selección reparte preguntas antes de repetir tema", () => {
  const pool = Array.from({ length: 42 }, (_, topic) => Array.from({ length: 3 }, (_, index) => ({
    id: `${topic}-${index}`,
    block: "theory",
    topic_code: `T${String(topic + 1).padStart(2, "0")}`,
  }))).flat();
  const selected = selectBalancedQuestions(pool, 79);
  const counts = selected.reduce((map, question) => map.set(question.topic_code, (map.get(question.topic_code) ?? 0) + 1), new Map());
  assert.equal(selected.length, 79);
  assert.ok(Math.max(...counts.values()) <= 2);
  assert.ok(Math.min(...counts.values()) >= 1);
});

test("el entrenamiento limita la selección a los temas elegidos", () => {
  const pool = Array.from({ length: 3 }, (_, topic) => Array.from({ length: 10 }, (_, index) => ({
    id: `${topic}-${index}`,
    block: "theory",
    topic_code: `T0${topic + 1}`,
  }))).flat();
  const selected = selectTopicQuestions(pool, ["T01", "T03"], 10);
  assert.equal(selected.length, 10);
  assert.ok(selected.every((question) => question.topic_code === "T01" || question.topic_code === "T03"));
});

test("el repaso usa solo preguntas falladas, en blanco o marcadas", () => {
  const pool = Array.from({ length: 10 }, (_, index) => ({ id: String(index), block: "theory", topic_code: "T01" }));
  const selected = selectReviewQuestions(pool, new Set(["2", "5", "8"]), 20);
  assert.deepEqual(new Set(selected.map((question) => question.id)), new Set(["2", "5", "8"]));
});

test("el rechazo restringe al día siguiente y cancela después del décimo día", () => {
  const failed = { status: "payment_failed", paidThrough: "2026-11-01" };
  assert.equal(resolveSubscriptionState(failed, "2026-11-01").state, "active");
  assert.deepEqual(resolveSubscriptionState(failed, "2026-11-02"), { state: "restricted", regularizationDaysRemaining: 10 });
  assert.deepEqual(resolveSubscriptionState(failed, "2026-11-11"), { state: "restricted", regularizationDaysRemaining: 1 });
  assert.deepEqual(resolveSubscriptionState(failed, "2026-11-12"), { state: "cancelled", regularizationDaysRemaining: 0 });
});

test("un acceso gratuito vigente prevalece sobre el estado de pago", () => {
  assert.equal(resolveSubscriptionState(null, "2026-11-12", true).state, "active");
});
