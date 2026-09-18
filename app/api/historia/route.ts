import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isCourseAdministrator } from "@/lib/course-access";
import units from "@/data/historia/units.json";
import chronologies from "@/data/historia/chronologies.json";
import glossary from "@/data/historia/glossary.json";
import methodology from "@/data/historia/methodology.json";
import territories from "@/data/historia/territories.json";
import tests from "@/data/historia/test.json";
import shorts from "@/data/historia/short.json";
import sources from "@/data/historia/sources.json";
import developments from "@/data/historia/developments.json";
import errors from "@/data/historia/errors.json";
import chronologyExercises from "@/data/historia/chronology-exercises.json";
import territorial from "@/data/historia/territorial.json";
import rocio from "@/data/historia/rocio.json";
import mainVideos from "@/data/historia/main-videos.json";
import supportVideos from "@/data/historia/support-videos.json";

type JsonRecord = Record<string, unknown>;

const FULL_PLANS = new Set(["estandar", "standard", "premium"]);
const CORE_RESOURCES = new Set(["unit", "chronology", "glossary", "video"]);
const CORE_BANKS = new Set(["test", "source", "error"]);
const PAU_RESOURCES = new Set(["method", "territory"]);
const PAU_BANKS = new Set(["test", "short", "source", "development", "chronology", "territorial", "rocio"]);

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

async function accessFor(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { allowed: false, reason: "login_required", plan: null, plans: [] as string[] };
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { allowed: false, reason: "login_required", plan: null, plans: [] as string[] };
  if (isCourseAdministrator(data.user.email)) return { allowed: true, reason: "administrator", plan: "premium", plans: ["premium"] };
  const now = new Date().toISOString();
  const { data: enrollments } = await supabase.from("course_enrollments").select("plan_slug,expires_at").eq("user_id", data.user.id).eq("course_slug", "historia-espana").eq("status", "active").lte("starts_at", now);
  const plans = (enrollments || []).filter((item) => !item.expires_at || item.expires_at >= now).map((item) => String(item.plan_slug || "estandar"));
  return plans.length ? { allowed: true, reason: "enrollment", plan: bestPlan(plans), plans } : { allowed: false, reason: "subscription_required", plan: null, plans: [] as string[] };
}

function findResource(resource: string) {
  const [kind, ...rest] = resource.split(":");
  const id = rest.join(":");
  const sourcesByKind: Record<string, JsonRecord[]> = {
    unit: units as JsonRecord[], chronology: chronologies as JsonRecord[], method: methodology as JsonRecord[], territory: territories as JsonRecord[],
  };
  if (kind === "glossary" && id === "maestro") return { kind, item: glossary as JsonRecord };
  if (kind === "video") {
    const item = ([...(mainVideos as JsonRecord[]), ...(supportVideos as JsonRecord[])]).find((entry) => String(entry.id) === id && entry.url);
    return item ? { kind, item } : null;
  }
  const item = sourcesByKind[kind]?.find((entry) => String(entry.id) === id);
  return item ? { kind, item } : null;
}

function bankRows(type: string) {
  const sourcesByType: Record<string, JsonRecord[]> = {
    test: tests as JsonRecord[], short: shorts as JsonRecord[], source: sources as JsonRecord[], development: developments as JsonRecord[], error: errors as JsonRecord[], chronology: chronologyExercises as JsonRecord[], territorial: territorial as JsonRecord[], rocio: rocio as JsonRecord[],
  };
  return sourcesByType[type] || [];
}

function sanitizeBankItem(item:JsonRecord){
  const clean={...item};
  for(const key of ["Correcta","Letra correcta","Respuesta modelo","Respuesta modelo / correcta","Respuesta orientativa","Esquema de respuesta","Corrección correcta","Orden correcto","Feedback pedagógico","Feedback / rúbrica","Criterio de corrección","Explicación pedagógica","Explicación causal","Rúbrica Base12","Criterio","Criterio 1"]) delete clean[key];
  return clean;
}

function bankGroup(item: JsonRecord, type: string) {
  if (type === "chronology") return String(item["Cronología"] || "");
  if (type === "territorial") return String(item.Comunidad || "");
  return String(item["Vídeo"] || "");
}

export async function GET(req: NextRequest) {
  const resource = String(req.nextUrl.searchParams.get("resource") || "");
  const bankType = String(req.nextUrl.searchParams.get("bankType") || "");
  const isPublicPreview = resource === "unit:tema-01";
  const access = isPublicPreview ? { allowed: true, reason: "public_preview", plan: null, plans: [] as string[] } : await accessFor(req);
  if (!access.allowed) return NextResponse.json({ allowed: false, access: access.reason }, { status: access.reason === "login_required" ? 401 : 403 });
  const resourceKind = resource.split(":")[0] || "";
  if ((resource || bankType) && !planAllows(access, resourceKind, bankType)) return NextResponse.json({ allowed: false, access: "plan_upgrade_required", plan: access.plan }, { status: 403 });
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
    return NextResponse.json({ allowed: true, access: access.reason, plan: access.plan, type: bankType, group, total: filtered.length, offset, items: filtered.slice(offset, offset + limit).map(sanitizeBankItem) });
  }
  return NextResponse.json({ error: "Petición incompleta" }, { status: 400 });
}
