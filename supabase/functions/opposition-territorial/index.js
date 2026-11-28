import {
  bomeIssues, readAvilaFeed, readBocFeed, readBocmFeed, readBocylFeed, readBojaFeed, readBomeIssue,
  readDogFeed, verifyBojaArticle, ceutaIssueLinks, ceutaPdfPath, readCeutaSummary,
} from "../../../lib/opposition-bulletins.ts";

async function fetchOfficialResponse(url) {
  const response = await fetch(url, { headers: { "Accept-Encoding": "identity" }, signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} en la fuente oficial`);
  if (new URL(response.url).hostname !== new URL(url).hostname) {
    throw new Error("La sede oficial redirigió a otro dominio");
  }
  return response;
}

async function fetchOfficial(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await (await fetchOfficialResponse(url)).text();
    } catch (error) {
      if (attempt > 0) throw error;
    }
  }
  throw new Error("No se pudo leer la fuente oficial");
}

const collectors = {
  boja_atom: async () => {
    const records = readBojaFeed(await fetchOfficial("https://www.juntadeandalucia.es/boja/distribucion/s53.xml"));
    const verified = [];
    for (let start = 0; start < records.length; start += 8) {
      const batch = records.slice(start, start + 8);
      verified.push(...await Promise.all(batch.map(async record => verifyBojaArticle(record, await fetchOfficial(record.url)))));
    }
    return verified;
  },
  bocm_rss: async () => readBocmFeed(await fetchOfficial("https://www.bocm.es/ultimo-boletin.xml")),
  bocyl_rss: async feed => {
    if (typeof feed !== "string" || feed.length > 1_000_000) throw new Error("Falta el RSS oficial recibido por Supabase");
    return readBocylFeed(feed);
  },
  boc_rss: async () => readBocFeed(await fetchOfficial("https://www.gobiernodecanarias.org/boc/feeds/capitulo/autoridades_personal_oposiciones.rss")),
  dog_rss: async () => readDogFeed(await fetchOfficial("https://www.xunta.gal/diario-oficial-galicia/rss/Seccion7_gl.rss")),
  bop_avila_rss: async () => readAvilaFeed(await fetchOfficial("https://www.diputacionavila.es/bop/rss.xml")),
  bocce_sumario_pdf: async () => {
    const base = "https://www.ceuta.es";
    const issues = ceutaIssueLinks(await fetchOfficial(`${base}/ceuta/documentos/`)).slice(0, 2);
    const { getDocumentProxy } = await import("npm:unpdf@2.2.3");
    const records = [];
    for (const issue of issues) {
      const page = await fetchOfficial(`${base}${issue.path}?Itemid=`);
      const pdf = base + ceutaPdfPath(page, issue.issue, issue.date);
      const response = await fetchOfficialResponse(pdf);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > 12_000_000 || new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") {
        throw new Error("El fichero de la edición del BOCCE no es un PDF válido");
      }
      const document = await getDocumentProxy(bytes, { isEvalSupported: false });
      try {
        const pages = [];
        for (let pageNumber = 1; pageNumber <= Math.min(3, document.numPages); pageNumber++) {
          const text = await (await document.getPage(pageNumber)).getTextContent();
          pages.push(text.items.map(item => item.str ?? "").join(" "));
        }
        records.push(...readCeutaSummary(pages, { ...issue, pdf }));
      } finally {
        await document.cleanup?.();
      }
    }
    return records;
  },
  bome_sumario: async () => {
    const base = "https://bomemelilla.es";
    const paths = bomeIssues(await fetchOfficial(base)).slice(0, 8);
    return (await Promise.all(paths.map(async path => readBomeIssue(await fetchOfficial(base + path), path)))).flat();
  },
};

async function rpc(name, input) {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Configuración de Supabase incompleta");
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Supabase rechazó ${name} (HTTP ${response.status})`);
  return response.json();
}

Deno.serve(async request => {
  if (request.method !== "POST") return Response.json({ error: "Método no permitido" }, { status: 405 });
  const token = request.headers.get("x-opposition-worker-token") ?? "";
  if (!/^[0-9a-f]{64}$/.test(token)) return Response.json({ error: "No autorizado" }, { status: 401 });

  let method;
  try {
    if (!(await rpc("opposition_territorial_authorize", { worker_token: token }))) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    if (!body || typeof body.method !== "string" || !Object.prototype.hasOwnProperty.call(collectors, body.method)) {
      return Response.json({ error: "Fuente no reconocida" }, { status: 400 });
    }
    const sourceMethod = body.method;
    method = sourceMethod;
    const records = await collectors[sourceMethod](body.officialFeed);
    if (records.length > 400) throw new Error("La fuente supera el tamaño esperado");

    if (body.verify === true) {
      return Response.json({ ok: true, method, verified: records.length, latest: records.map(r => r.date).sort().at(-1) ?? null });
    }
    const result = await rpc("opposition_territorial_capture", { source_method: method, records });
    return Response.json({ ok: true, method, ...result });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Error consultando la fuente oficial";
    if (method) await rpc("opposition_territorial_failure", { source_method: method, failure: message }).catch(() => undefined);
    return Response.json({ ok: false, method, error: message }, { status: 502 });
  }
});
