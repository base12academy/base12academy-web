type TurnstileResponse = {
  success?: boolean;
  "error-codes"?: string[];
  hostname?: string;
};

export async function verifyTurnstileToken(input: {
  token: string;
  remoteIp?: string | null;
}) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    console.error("Turnstile no configurado: falta TURNSTILE_SECRET_KEY.");
    return false;
  }

  const token = input.token.trim();
  if (!token) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  if (input.remoteIp) {
    body.set("remoteip", input.remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Cloudflare Turnstile rechazó la validación HTTP", response.status);
      return false;
    }

    const result = (await response.json()) as TurnstileResponse;

    if (!result.success) {
      console.warn("Turnstile no validado", result["error-codes"] ?? []);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validando Turnstile", error);
    return false;
  }
}

export function requestClientIp(request: Request) {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return null;

  return forwarded.split(",")[0]?.trim() || null;
}
