import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuthCode } from "@/lib/auth";
import { sendEmail, isEmailConfigured } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const { email } = body as { email?: string };
  if (!email?.trim()) {
    return NextResponse.json({ error: "El. paštas privalomas" }, { status: 400 });
  }

  const trimmedEmail = email.trim().toLowerCase();

  let user;
  try {
    user = await prisma.registration.findFirst({ where: { email: trimmedEmail } });
  } catch (e) {
    console.error("[send-code] DB klaida:", e);
    return NextResponse.json(
      { error: "Duomenų bazės klaida. Patikrinkite DATABASE_URL ir LIBSQL_AUTH_TOKEN." },
      { status: 503 },
    );
  }
  if (!user) {
    return NextResponse.json({ error: "Tokio el. pašto neradome sistemoje" }, { status: 404 });
  }

  const code = await createAuthCode(trimmedEmail);
  const isDev = process.env.NODE_ENV !== "production";

  if (isEmailConfigured()) {
    try {
      await sendEmail({
        to: trimmedEmail,
        subject: "Jūsų prisijungimo kodas – Paskolinau.lt",
        text: `Sveiki!\n\nJūsų prisijungimo kodas: ${code}\n\nKodas galioja 15 minučių.\n\n— Paskolinau.lt`,
        html: `<p>Sveiki!</p><p>Jūsų prisijungimo kodas:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p><p style="color:#64748b">Kodas galioja 15 minučių.</p>`,
      });
    } catch (e) {
      console.error("[send-code] El. pašto klaida:", e);
      if (!isDev) {
        return NextResponse.json({ error: "Nepavyko išsiųsti kodo el. paštu" }, { status: 502 });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    ...(isDev && !isEmailConfigured() ? { dev: code } : {}),
  });
}
