import { NextRequest, NextResponse } from "next/server";
import {
  authorizeTropaRequest,
  canAccessTropaAptitude,
  isTropaAuthorizationError,
} from "@/lib/tropa-access";
import { isTropaAptitudeSlug } from "@/lib/tropa-config";

export async function GET(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, access } = authorization;
  const aptitudeSlug = request.nextUrl.searchParams.get("aptitude") ?? "";
  const sourceId = request.nextUrl.searchParams.get("id") ?? "";
  if (!isTropaAptitudeSlug(aptitudeSlug) || !/^[A-Za-z0-9_-]{1,140}$/.test(sourceId)) {
    return NextResponse.json({ error: "invalid_resource" }, { status: 400 });
  }
  if (!canAccessTropaAptitude(access, aptitudeSlug)) {
    return NextResponse.json({ error: "resource_not_allowed" }, { status: 403 });
  }
  const { data: resource, error } = await supabase
    .from("trop_visual_resources")
    .select("object_path, mime_type, source_sha256")
    .eq("aptitude_slug", aptitudeSlug)
    .eq("source_id", sourceId)
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !resource) return NextResponse.json({ error: "resource_not_found" }, { status: 404 });
  const { data: blob, error: downloadError } = await supabase.storage
    .from("trop-resources")
    .download(resource.object_path);
  if (downloadError || !blob) return NextResponse.json({ error: "resource_unavailable" }, { status: 503 });
  return new NextResponse(await blob.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": resource.mime_type,
      "Cache-Control": "private, max-age=3600",
      ETag: `"${resource.source_sha256}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
