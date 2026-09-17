import { NextRequest, NextResponse } from "next/server";
import { authorizeTrainingRequest, isTrainingAuthorizationError } from "@/lib/training-access";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  return NextResponse.json({
    allowed: true,
    access: authorization.access,
    expiresAt: authorization.expiresAt,
  });
}
