import { NextRequest, NextResponse } from "next/server";
import { authorizeTropaRequest, isTropaAuthorizationError } from "@/lib/tropa-access";

export async function GET(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { access } = authorization;
  return NextResponse.json({
    allowed: true,
    access: access.administrator ? "administrator" : "enrollment",
    planSlug: access.planSlug,
    label: access.label,
    questionCount: access.questionCount,
    motorCount: access.motorCount,
    aptitudeSlugs: access.aptitudeSlugs,
    individualProductSlugs: access.individualProductSlugs,
    availableMotors: access.availableMotors,
  });
}
