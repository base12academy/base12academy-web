import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import authors from "@/data/filosofia/authors.json";
import blocks from "@/data/filosofia/blocks.json";
import comparisons from "@/data/filosofia/comparisons.json";
import glossary from "@/data/filosofia/glossary.json";
import library from "@/data/filosofia/library.json";
import methodology from "@/data/filosofia/methodology.json";
import workshops from "@/data/filosofia/workshops.json";
import territories from "@/data/filosofia/territories.json";
import tests from "@/data/filosofia/test.json";
import shorts from "@/data/filosofia/short.json";
import longs from "@/data/filosofia/long.json";
import rocioAuthors from "@/data/filosofia/rocio-authors.json";
import rocioPau from "@/data/filosofia/rocio-pau.json";

type JsonRecord = Record<string, unknown>;

const FULL_PLANS = new Set(["estandar", "standard", "premium"]);
const CORE_RESOURCES = new Set(["author", "block", "comparison", "glossary", "library"]);
const CORE_BANKS = new Set(["test", "rocio-authors"]);
const PAU_RESOURCES = new Set(["comparison", "method", "workshop", "territory"]);
const PAU_BANKS = new Set(["test", "short", "long", "rocio-authors", "rocio-pau"]);

function bestPlan(plans: string[]) {
  const priority: Record<string, number> = { premium: 4, estandar: 3, standard: 3, esencial: 2, pau: 1 };
  return [...plans].sort((a, b) => (priority[b] || 0) - (priority[a] || 0))[0] || null;
}

function planAllows(access: { reason: string; plans: string[] }, resourceKind: string, bankType: string) {
  if (access.reason === "administrator" || access.reason === "public_preview") return true;
  if (access.plans.some((plan) => FULL_PLANS.has(plan))) return true;
  if (resourceKind && access.plans.includes("esencial") && CORE_RESOURCES.has(resourceKind)) return true;
  if (bankType && access.plans.includes("esencial") && CORE_BANKS.has(bankType)) return true;
  if (resourceKind && access.plans.includes("pau") && PAU_RESOURCES.has(resourceKind)) return true;
  if (bankType && access.plans.includes("pau") && PAU_BANKS.has(bankType)) return true;
  return false;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function accessFor(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { allowed: false, reason: "login_required", plan: null, plans: [] as string[] };

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { allowed: false, reason: "login_required", plan: null, plans: [] as string[] };
  if (isCourseAdministrator(data.user.email)) return { allowed: true, reason: "administrator", plan: "premium", plans: ["premium"] };

  const now = new Date().toISOString();
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("plan_slug,expires_at")
    .eq("user_id", data.user.id)
    .eq("course_slug", "historia-filosofia")
    .eq("status", "active")
    .lte("starts_at", now);

  const plans = (enrollments || []).filter((item) => !item.expires_at || item.expires_at >= now).map((item) => String(item.plan_slug || "estandar"));
  return plans.length
    ? { allowed: true, reason: "enrollment", plan: bestPlan(plans), plans }
    : { allowed: false, reason: "subscription_required", plan: null, plans: [] as string[] };
}

function findResource(resource: string) {
  const [kind, ...rest] = resource.split(":");
  const id = rest.join(":");
  const sources: Record<string, JsonRecord[]> = {
    author: authors as JsonRecord[],
    block: blocks as JsonRecord[],
    comparison: comparisons as JsonRecord[],
    library: library as JsonRecord[],
    method: methodology as JsonRecord[],
    workshop: workshops as JsonRecord[],
    territory: territories as JsonRecord[],
  };
  if (kind === "glossary") {
    const item = (glossary as JsonRecord[]).find((entry) => slugify(String(entry["Nombre preferido"] || "")) === id);
    return item ? { kind, item } : null;
  }
  const source = sources[kind];
  const item = source?.find((entry) => String(entry.id) === id);
  return item ? { kind, item } : null;
}

function bankRows(type: string) {
  const sources: Record<string, JsonRecord[]> = {
    test: tests as JsonRecord[], short: shorts as JsonRecord[], long: longs as JsonRecord[],
    "rocio-authors": rocioAuthors as JsonRecord[], "rocio-pau": rocioPau as JsonRecord[],
  };
  return sources[type] || [];
}

function sanitizeBankItem(item:JsonRecord){
  const clean={...item};
  for(const key of ["Correcta","Respuesta correcta","Elementos esperados","Feedback","Retroalimentación"]) delete clean[key];
  return clean;
}

function bankGroup(item: JsonRecord, type: string) {
  if (type === "rocio-authors") return String(item["Autor / bloque"] || "");
  if (type === "rocio-pau") return String(item.Recurso || "");
  return String(item.Banco || "");
}

export async function GET(req: NextRequest) {
  const resource = String(req.nextUrl.searchParams.get("resource") || "");
  const bankType = String(req.nextUrl.searchParams.get("bankType") || "");
  const isPublicPreview = resource === "author:socrates";
  const access = isPublicPreview ? { allowed: true, reason: "public_preview", plan: null, plans: [] as string[] } : await accessFor(req);

  if (!access.allowed) {
    return NextResponse.json({ allowed: false, access: access.reason }, { status: access.reason === "login_required" ? 401 : 403 });
  }

  const resourceKind = resource.split(":")[0] || "";
  if ((resource || bankType) && !planAllows(access, resourceKind, bankType)) {
    return NextResponse.json({ allowed: false, access: "plan_upgrade_required", plan: access.plan }, { status: 403 });
  }

  if (resource) {
    const result = findResource(resource);
    if (!result) return NextResponse.json({ error: "Contenido no encontrado" }, { status: 404 });
    return NextResponse.json({ allowed: true, access: access.reason, plan: access.plan, ...result });
  }

  if (bankType) {
    const rows = bankRows(bankType);
    if (!rows.length) return NextResponse.json({ error: "Banco no encontrado" }, { status: 404 });
    const group = String(req.nextUrl.searchParams.get("group") || "");
    const offset = Math.max(0, Number(req.nextUrl.searchParams.get("offset") || 0));
    const limit = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get("limit") || 10)));
    const filtered = group ? rows.filter((item) => bankGroup(item, bankType) === group) : rows;
    const page = filtered.slice(offset, offset + limit);
    return NextResponse.json({ allowed: true, access: access.reason, plan: access.plan, type: bankType, group, total: filtered.length, offset, items: page.map(sanitizeBankItem) });
  }

  return NextResponse.json({ error: "Petición incompleta" }, { status: 400 });
}
