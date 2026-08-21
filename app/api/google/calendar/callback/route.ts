import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import {
  getCalendarOAuthClient,
  getClassesCalendarId,
} from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_COOKIE = "b12_google_calendar_oauth_state";

function htmlPage(title: string, message: string, status = 200) {
  return new NextResponse(
    `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="font-family:Arial,sans-serif;max-width:680px;margin:60px auto;padding:0 24px;color:#172033">
  <h1>${title}</h1>
  <p>${message}</p>
</body>
</html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}

async function saveRefreshToken(refreshToken: string) {
  const envPath = path.join(process.cwd(), ".env.local");

  let contents = "";

  try {
    contents = await fs.readFile(envPath, "utf8");
  } catch {
    contents = "";
  }

  const key = "GOOGLE_CALENDAR_REFRESH_TOKEN";
  const line = `${key}=${refreshToken}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(contents)) {
    contents = contents.replace(pattern, line);
  } else {
    contents = `${contents.trimEnd()}\n${line}\n`;
  }

  await fs.writeFile(envPath, contents, "utf8");
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return htmlPage(
      "Operacion no permitida",
      "La configuracion OAuth solo puede realizarse en local.",
      403
    );
  }

  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError) {
    return htmlPage(
      "Autorizacion cancelada",
      "Google no ha concedido el acceso al calendario.",
      400
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  const receivedState = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (
    !code ||
    !receivedState ||
    !expectedState ||
    receivedState !== expectedState
  ) {
    return htmlPage(
      "Autorizacion no valida",
      "No se ha podido validar la respuesta OAuth.",
      400
    );
  }

  try {
    const oauthClient = getCalendarOAuthClient();
    const { tokens } = await oauthClient.getToken(code);

    if (!tokens.refresh_token) {
      return htmlPage(
        "Falta el token permanente",
        "Google no ha devuelto un refresh token. Vuelve a iniciar la autorizacion.",
        400
      );
    }

    oauthClient.setCredentials(tokens);

    const calendar = google.calendar({
      version: "v3",
      auth: oauthClient,
    });

    await calendar.events.list({
      calendarId: getClassesCalendarId(),
      timeMin: new Date().toISOString(),
      maxResults: 1,
      singleEvents: true,
    });

    await saveRefreshToken(tokens.refresh_token);
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN = tokens.refresh_token;

    const response = htmlPage(
      "Google Calendar conectado",
      'La cuenta ha autorizado correctamente el calendario "Horario de clases". El refresh token se ha guardado en .env.local.'
    );

    response.cookies.delete(STATE_COOKIE);

    return response;
  } catch (error) {
    console.error("Google Calendar OAuth error", error);

    return htmlPage(
      "No se pudo conectar Google Calendar",
      'Comprueba que la cuenta que has autorizado sea propietaria del calendario "Horario de clases".',
      500
    );
  }
}
