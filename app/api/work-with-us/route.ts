import { requestClientIp, verifyTurnstileToken } from "@/lib/turnstile";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECIPIENT = "profesionales@base12academy.es";
const MAX_CV_BYTES = 3 * 1024 * 1024;

const ROLE_LABELS: Record<string, string> = {
  "profesor-bachillerato": "Profesor de Bachillerato",
  "preparador-oposiciones": "Preparador Oposiciones",
  "preparador-fisico": "Preparador Físico",
};

const SOCIAL_SECURITY_PREFERENCES: Record<string, string> = {
  "cuenta-ajena": "Alta por cuenta ajena",
  autonomo: "Alta como trabajador/a autónomo/a",
  "a-valorar": "A valorar según la colaboración",
};

const CV_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCvSignature(filename: string, bytes: Buffer) {
  const extension = filename.toLowerCase().split(".").pop() || "";
  if (extension === "pdf") {
    return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  if (extension === "doc") {
    return bytes.subarray(0, 8).equals(
      Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    );
  }
  if (extension === "docx") {
    return bytes.subarray(0, 2).toString("ascii") === "PK";
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const token = field(form, "turnstileToken");
    const verified = await verifyTurnstileToken({
      token,
      remoteIp: requestClientIp(request),
    });

    if (!verified) {
      return NextResponse.json(
        { ok: false, error: "Completa la verificación anti-bots antes de enviar." },
        { status: 403 }
      );
    }

    const role = field(form, "role");
    const email = field(form, "email").toLowerCase();

    if (!ROLE_LABELS[role]) {
      return NextResponse.json({ ok: false, error: "Selecciona una opción válida." }, { status: 400 });
    }
    if (!validEmail(email)) {
      return NextResponse.json({ ok: false, error: "Indica un correo electrónico válido." }, { status: 400 });
    }
    if (form.get("privacyAccepted") !== "on") {
      return NextResponse.json({ ok: false, error: "Debes autorizar el tratamiento indicado en la Política de privacidad." }, { status: 400 });
    }

    const details: Array<[string, string]> = [["Correo electrónico", email]];
    let cvAttachment: { filename: string; content: string; content_type: string } | null = null;

    if (role === "preparador-fisico") {
      const qualification = field(form, "qualification");
      const locality = field(form, "locality");
      const province = field(form, "province");
      const proposal = field(form, "proposal");

      if (qualification.length < 2 || qualification.length > 180) {
        return NextResponse.json({ ok: false, error: "Indica tu titulación." }, { status: 400 });
      }
      if (locality.length < 2 || locality.length > 120) {
        return NextResponse.json({ ok: false, error: "Indica tu localidad." }, { status: 400 });
      }
      if (province.length < 2 || province.length > 120) {
        return NextResponse.json({ ok: false, error: "Indica tu provincia." }, { status: 400 });
      }
      if (proposal.length < 10 || proposal.length > 5000) {
        return NextResponse.json({ ok: false, error: "Describe brevemente tu propuesta de colaboración." }, { status: 400 });
      }

      details.push(
        ["Titulación", qualification],
        ["Localidad", locality],
        ["Provincia", province],
        ["Propuesta de colaboración", proposal]
      );
    } else {
      const specialty = field(form, "specialty");
      const preference = field(form, "socialSecurityPreference");

      if (specialty.length < 2 || specialty.length > 180) {
        return NextResponse.json({ ok: false, error: "Indica tu especialidad." }, { status: 400 });
      }
      if (!SOCIAL_SECURITY_PREFERENCES[preference]) {
        return NextResponse.json({ ok: false, error: "Selecciona tu preferencia de alta en la Seguridad Social." }, { status: 400 });
      }

      const cvValue = form.get("cv");
      if (!(cvValue instanceof File) || cvValue.size === 0) {
        return NextResponse.json({ ok: false, error: "Adjunta tu currículum en PDF, DOC o DOCX." }, { status: 400 });
      }
      if (cvValue.size > MAX_CV_BYTES) {
        return NextResponse.json({ ok: false, error: "El currículum no puede superar los 3 MB." }, { status: 413 });
      }

      const originalFilename = cvValue.name || "curriculum";
      const extension = originalFilename.toLowerCase().split(".").pop() || "";
      const expectedType = CV_TYPES[extension];
      if (!expectedType || (cvValue.type && cvValue.type !== expectedType)) {
        return NextResponse.json({ ok: false, error: "Adjunta el currículum como PDF, DOC o DOCX." }, { status: 400 });
      }

      const bytes = Buffer.from(await cvValue.arrayBuffer());
      if (!validateCvSignature(originalFilename, bytes)) {
        return NextResponse.json({ ok: false, error: "El archivo no parece ser un documento PDF, DOC o DOCX válido." }, { status: 400 });
      }

      const safeFilename = originalFilename
        .normalize("NFKC")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(-120);
      cvAttachment = {
        filename: safeFilename || "curriculum." + extension,
        content: bytes.toString("base64"),
        content_type: expectedType,
      };

      details.push(
        ["Especialidad", specialty],
        ["Preferencia de alta en la Seguridad Social", SOCIAL_SECURITY_PREFERENCES[preference]]
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !from) {
      console.error("No se pudo enviar la candidatura: falta la configuración de correo.");
      return NextResponse.json(
        { ok: false, error: "El envío no está disponible ahora. Inténtalo más tarde." },
        { status: 503 }
      );
    }

    const message = [
      "Nueva candidatura recibida desde base12academy.es",
      "",
      "Opción: " + ROLE_LABELS[role],
      ...details.flatMap(([label, value]) => [label + ":", value, ""]),
      "La persona ha autorizado el envío de sus datos a " + RECIPIENT + ".",
    ].join("\n");

    const attachments = cvAttachment
      ? [{ filename: cvAttachment.filename, content: cvAttachment.content, content_type: cvAttachment.content_type }]
      : undefined;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [RECIPIENT],
        reply_to: email,
        subject: "[Trabaja con nosotros] " + ROLE_LABELS[role] + " · " + email,
        text: message,
        ...(attachments ? { attachments } : {}),
      }),
      cache: "no-store",
    });

    if (!emailResponse.ok) {
      console.error("El proveedor de correo rechazó una candidatura.", { status: emailResponse.status });
      return NextResponse.json(
        { ok: false, error: "No se pudo enviar la candidatura. Inténtalo de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error en el formulario Trabaja con nosotros.", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar la candidatura. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
