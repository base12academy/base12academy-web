import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type BoeItem = {
  identificador: string;
  control?: string;
  titulo: string;
  url_html: string;
  url_xml?: string;
  url_pdf?: { texto?: string } | string;
};

type NormalizedPublication = {
  externalId: string;
  title: string;
  organisation: string;
  epigraph: string;
  publicationDate: string;
  officialUrl: string;
  xmlUrl: string | null;
  pdfUrl: string | null;
  bulletinIdentifier: string;
};

type BoeEpigraph = { nombre?: string; item?: BoeItem | BoeItem[] };
type BoeDepartment = { nombre?: string; epigrafe?: BoeEpigraph | BoeEpigraph[] };
type BoeSection = { codigo?: string; departamento?: BoeDepartment | BoeDepartment[] };
type BoeDiary = {
  sumario_diario?: { identificador?: string };
  seccion?: BoeSection | BoeSection[];
};
type BoePayload = {
  data?: {
    sumario?: {
      metadatos?: { fecha_publicacion?: string };
      diario?: BoeDiary | BoeDiary[];
    };
  };
};

type StoredCall = {
  id: string;
  slug: string;
  title: string;
  organisation?: string | null;
  administration?: string | null;
  territory?: string | null;
  province?: string | null;
  locality?: string | null;
  group_category?: string | null;
  specialty?: string | null;
  status?: string | null;
  publication_date?: string | null;
  related_external_ids?: string[] | null;
};

type AlertRow = {
  id: string;
  alert_type: "general" | "convocatoria";
  call_id: string | null;
  criteria: Record<string, string>;
  email_enabled: boolean;
  telegram_enabled: boolean;
  subscriber: {
    email: string;
    user_id: string | null;
    active: boolean;
  } | null;
};

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function publicationKind(title: string) {
  const text = normalize(title);
  if (/anula|dej.*sin efecto|desistimiento/.test(text)) {
    return { type: "anulacion", relevance: "critica" as const, status: "anulada" };
  }
  if (/amplia.*plazo|nuevo plazo|reabre.*plazo|reduccion.*plazo/.test(text)) {
    return { type: "cambio_plazo", relevance: "critica" as const, status: "actualizada" };
  }
  if (/fecha.*examen|fecha.*prueba|lugar.*examen/.test(text)) {
    return { type: "fecha_examen", relevance: "critica" as const, status: "examen convocado" };
  }
  if (/lista.*provisional|lista.*definitiva|relacion.*admitid/.test(text)) {
    return { type: "listas", relevance: "relevante" as const, status: "listas publicadas" };
  }
  if (/corrige|correccion|modifica|rectifica/.test(text)) {
    return { type: "modificacion", relevance: "relevante" as const, status: "actualizada" };
  }
  return { type: "convocatoria", relevance: "informativa" as const, status: "publicada" };
}

function getPdfUrl(item: BoeItem) {
  if (typeof item.url_pdf === "string") return item.url_pdf;
  return item.url_pdf?.texto ?? null;
}

function flattenBoe(payload: BoePayload): NormalizedPublication[] {
  const sumario = payload?.data?.sumario;
  const date = String(sumario?.metadatos?.fecha_publicacion ?? "");
  const result: NormalizedPublication[] = [];

  for (const diario of asArray(sumario?.diario)) {
    const bulletinIdentifier = String(diario?.sumario_diario?.identificador ?? `BOE-${date}`);
    for (const section of asArray(diario?.seccion)) {
      if (String(section?.codigo).toUpperCase() !== "2B") continue;
      for (const department of asArray(section?.departamento)) {
        for (const epigraph of asArray(department?.epigrafe)) {
          for (const item of asArray<BoeItem>(epigraph?.item)) {
            if (!item?.identificador || !item?.titulo || !item?.url_html) continue;
            result.push({
              externalId: item.identificador,
              title: item.titulo.trim(),
              organisation: String(department?.nombre ?? "Boletín Oficial del Estado"),
              epigraph: String(epigraph?.nombre ?? "Oposiciones y concursos"),
              publicationDate: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
              officialUrl: item.url_html,
              xmlUrl: item.url_xml ?? null,
              pdfUrl: getPdfUrl(item),
              bulletinIdentifier,
            });
          }
        }
      }
    }
  }

  return result;
}

async function relatedBoeIds(publication: NormalizedPublication) {
  if (!publication.xmlUrl || publicationKind(publication.title).type === "convocatoria") return [];
  try {
    const response = await fetch(publication.xmlUrl, {
      headers: { Accept: "application/xml" },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return [];
    const xml = await response.text();
    return [...new Set(xml.match(/BOE-A-\d{4}-\d+/g) ?? [])].filter(
      (id) => id !== publication.externalId
    );
  } catch {
    return [];
  }
}

function alertMatches(criteria: Record<string, string>, call: StoredCall) {
  const haystack = normalize(
    [call.title, call.organisation, call.administration, call.territory, call.province, call.locality, call.group_category, call.specialty]
      .filter(Boolean)
      .join(" ")
  );
  const comparisons: Array<[string | undefined, string]> = [
    [criteria.q, haystack],
    [criteria.territory, normalize(call.territory ?? "")],
    [criteria.administration, normalize(call.administration ?? "")],
    [criteria.category, normalize(call.specialty ?? call.title ?? "")],
    [criteria.group, normalize(call.group_category ?? "")],
    [criteria.status, normalize(call.status ?? "")],
  ];
  const textMatches = comparisons.every(([expected, actual]) => !expected || actual.includes(normalize(expected)));
  if (!textMatches) return false;
  if (criteria.date && String(call.publication_date ?? "") < criteria.date) return false;
  return true;
}

async function sendAlertEmail(input: {
  to: string;
  call: StoredCall;
  change: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) throw new Error("Falta la configuración de correo");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://base12academy.es").replace(/\/$/, "");
  const callUrl = `${siteUrl}/banco-opositores/convocatoria/${input.call.slug}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Alerta oficial: ${input.call.title}`.slice(0, 150),
      html: `<div style="font-family:Arial,sans-serif;color:#262626;line-height:1.6;max-width:640px;margin:auto">
        <h1 style="color:#6f0718;font-size:23px">Novedad oficial</h1>
        <h2 style="font-size:18px">${escapeHtml(input.call.title)}</h2>
        <p>${escapeHtml(input.change)}</p>
        <p><a href="${escapeHtml(callUrl)}" style="display:inline-block;background:#6f0718;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px">Ver ficha e historial</a></p>
        <p style="font-size:13px;color:#666">Contrasta siempre la información con la fuente oficial enlazada en la ficha.</p>
      </div>`,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Resend devolvió ${response.status}`);
  const data = (await response.json()) as { id?: string };
  return data.id ?? null;
}

async function notifyAlerts(input: {
  call: StoredCall;
  publicationId: string;
  change: string;
  isNewCall: boolean;
  relevance: "informativa" | "relevante" | "critica";
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("opposition_alerts")
    .select("id,alert_type,call_id,criteria,email_enabled,telegram_enabled,subscriber:opposition_subscribers(email,user_id,active)")
    .eq("active", true);
  if (error) throw error;

  const candidates = (data ?? []) as unknown as AlertRow[];
  let queued = 0;
  for (const alert of candidates) {
    if (!alert.subscriber?.active) continue;
    const followsCall = alert.alert_type === "convocatoria" && alert.call_id === input.call.id;
    const isGeneralMatch = alert.alert_type === "general" && input.isNewCall && alertMatches(alert.criteria ?? {}, input.call);
    if (!isGeneralMatch && !(followsCall && input.relevance !== "informativa")) continue;

    if (alert.email_enabled) {
      let status: "sent" | "failed" = "sent";
      let providerId: string | null = null;
      let errorMessage: string | null = null;
      try {
        providerId = await sendAlertEmail({ to: alert.subscriber.email, call: input.call, change: input.change });
        queued++;
      } catch (error) {
        status = "failed";
        errorMessage = error instanceof Error ? error.message.slice(0, 900) : "Error de correo";
      }
      await supabase.from("opposition_notification_log").upsert({
        alert_id: alert.id,
        publication_id: input.publicationId,
        call_id: input.call.id,
        channel: "email",
        status,
        provider_id: providerId,
        error_message: errorMessage,
        sent_at: status === "sent" ? new Date().toISOString() : null,
      }, { onConflict: "alert_id,call_id,publication_id,channel", ignoreDuplicates: true });
    }

    if (alert.telegram_enabled && alert.subscriber.user_id) {
      const { error: telegramError } = await supabase.from("telegram_notifications").upsert({
        user_id: alert.subscriber.user_id,
        source: "fernando",
        notification_type: "opposition_alert",
        title: "Banco de Opositores · Novedad oficial",
        message: `${input.call.title}\n\n${input.change}\n\nConsulta la ficha y la fuente oficial en Base12 Academy.`,
        scheduled_for: new Date().toISOString(),
        status: "pending",
        dedupe_key: `opposition:${alert.id}:${input.publicationId}`,
      }, { onConflict: "dedupe_key", ignoreDuplicates: true });
      await supabase.from("opposition_notification_log").upsert({
        alert_id: alert.id,
        publication_id: input.publicationId,
        call_id: input.call.id,
        channel: "telegram",
        status: telegramError ? "failed" : "pending",
        error_message: telegramError?.message?.slice(0, 900) ?? null,
      }, { onConflict: "alert_id,call_id,publication_id,channel", ignoreDuplicates: true });
      if (!telegramError) queued++;
    }

    await supabase.from("opposition_alerts").update({ last_notified_at: new Date().toISOString() }).eq("id", alert.id);
  }
  return queued;
}

function requestedDate(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("date")?.replace(/\D/g, "") ?? "";
  if (raw.length === 8) return raw;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Madrid",
  }).format(new Date()).replace(/-/g, "");
}

async function ingestBoe(request: NextRequest) {
  const supabase = getSupabase();
  const { data: source, error: sourceError } = await supabase
    .from("opposition_sources")
    .select("id,name")
    .eq("consultation_method", "boe_sumario_api")
    .eq("active", true)
    .single();
  if (sourceError) throw sourceError;

  const run = await supabase.from("opposition_ingestion_runs").insert({ source_id: source.id }).select("id").single();
  if (run.error) throw run.error;
  const date = requestedDate(request);
  let detected = 0;
  let created = 0;
  let updated = 0;
  let alertsQueued = 0;

  try {
    const response = await fetch(`https://www.boe.es/datosabiertos/api/boe/sumario/${date}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 404) {
      await supabase.from("opposition_ingestion_runs").update({
        finished_at: new Date().toISOString(), status: "success", details: { date, note: "Sin BOE publicado" },
      }).eq("id", run.data.id);
      return { source: "BOE", date, detected: 0, created: 0, updated: 0, alertsQueued: 0 };
    }
    if (!response.ok) throw new Error(`BOE API devolvió ${response.status}`);
    const publications = flattenBoe((await response.json()) as BoePayload);
    detected = publications.length;

    for (const publication of publications) {
      const { data: existingPublication } = await supabase
        .from("opposition_publications")
        .select("id")
        .eq("source_id", source.id)
        .eq("external_id", publication.externalId)
        .maybeSingle();
      if (existingPublication) continue;

      const kind = publicationKind(publication.title);
      const relatedIds = await relatedBoeIds(publication);
      let call: StoredCall | null = null;
      if (relatedIds.length) {
        const { data } = await supabase
          .from("opposition_calls")
          .select("*")
          .eq("source_id", source.id)
          .in("source_external_id", relatedIds)
          .limit(1)
          .maybeSingle();
        call = data as unknown as StoredCall | null;
      }

      const isNewCall = !call;
      if (!call) {
        const slug = `${slugify(publication.title)}-${publication.externalId.toLowerCase()}`;
        const { data, error } = await supabase.from("opposition_calls").insert({
          source_id: source.id,
          source_external_id: publication.externalId,
          related_external_ids: relatedIds,
          slug,
          title: publication.title,
          organisation: publication.organisation,
          administration: publication.organisation,
          territory: "España",
          specialty: publication.epigraph,
          status: kind.status,
          publication_date: publication.publicationDate,
          official_url: publication.officialUrl,
          bulletin_name: "Boletín Oficial del Estado",
          bulletin_identifier: publication.bulletinIdentifier,
          base12_course_slug: normalize(publication.title).includes("tropa y marineria") ? "tropa-y-marineria" : null,
        }).select("*").single();
        if (error) throw error;
        call = data as unknown as StoredCall;
        created++;
      } else {
        const mergedRelated = [...new Set([...(call.related_external_ids ?? []), publication.externalId, ...relatedIds])];
        const { data, error } = await supabase.from("opposition_calls").update({
          related_external_ids: mergedRelated,
          status: kind.status,
          last_official_update: new Date().toISOString(),
        }).eq("id", call.id).select("*").single();
        if (error) throw error;
        call = data as unknown as StoredCall;
        updated++;
      }

      if (!call) {
        throw new Error(`No se pudo resolver la convocatoria ${publication.externalId}`);
      }

      const changeSummary = kind.type === "convocatoria"
        ? `Publicación inicial detectada en ${publication.bulletinIdentifier}.`
        : `La fuente oficial publica una ${kind.type.replace(/_/g, " ")}: ${publication.title}`;
      const { data: history, error: historyError } = await supabase.from("opposition_publications").insert({
        call_id: call.id,
        source_id: source.id,
        external_id: publication.externalId,
        publication_type: kind.type,
        publication_date: publication.publicationDate,
        bulletin_name: "Boletín Oficial del Estado",
        bulletin_identifier: publication.bulletinIdentifier,
        official_url: publication.officialUrl,
        official_pdf_url: publication.pdfUrl,
        change_summary: changeSummary,
        relevance: kind.relevance,
      }).select("id").single();
      if (historyError) throw historyError;

      alertsQueued += await notifyAlerts({
        call,
        publicationId: history.id,
        change: changeSummary,
        isNewCall,
        relevance: kind.relevance,
      });
    }

    const finishedAt = new Date().toISOString();
    await supabase.from("opposition_sources").update({
      last_checked_at: finishedAt, last_success_at: finishedAt, last_error: null,
    }).eq("id", source.id);
    await supabase.from("opposition_ingestion_runs").update({
      finished_at: finishedAt,
      status: "success",
      publications_detected: detected,
      calls_created: created,
      calls_updated: updated,
      alerts_queued: alertsQueued,
      details: { date },
    }).eq("id", run.data.id);
    return { source: "BOE", date, detected, created, updated, alertsQueued };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    await supabase.from("opposition_sources").update({
      last_checked_at: new Date().toISOString(), last_error: message.slice(0, 1000),
    }).eq("id", source.id);
    await supabase.from("opposition_ingestion_runs").update({
      finished_at: new Date().toISOString(), status: "failed", error_message: message.slice(0, 1000),
      publications_detected: detected, calls_created: created, calls_updated: updated, alerts_queued: alertsQueued,
      details: { date },
    }).eq("id", run.data.id);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }
  try {
    const result = await ingestBoe(request);
    return NextResponse.json({ ok: true, results: [result] });
  } catch (error) {
    console.error("Error de ingestión del Banco de Opositores", error);
    return NextResponse.json({ ok: false, error: "La fuente oficial no pudo procesarse." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
