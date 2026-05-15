import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthCode, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 }); }

  const b = body as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : null;
  const code  = typeof b.code  === "string" ? b.code.trim()               : null;

  if (!email || !code) return NextResponse.json({ error: "El. paštas ir kodas privalomi" }, { status: 400 });

  const valid = await verifyAuthCode(email, code);
  if (!valid) return NextResponse.json({ error: "Kodas neteisingas arba pasibaigęs" }, { status: 400 });

  const user = await prisma.registration.findFirst({ where: { email } });
  if (!user) return NextResponse.json({ error: "Naudotojas nerastas" }, { status: 404 });

  if (!user.emailVerified) {
    await prisma.registration.update({ where: { id: user.id }, data: { emailVerified: true } });
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({
    ok: true,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
}
