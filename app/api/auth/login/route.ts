import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthCode, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const { email, code } = body as { email?: string; code?: string };
  if (!email || !code) {
    return NextResponse.json({ error: "El. paštas ir kodas privalomi" }, { status: 400 });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const ok = await verifyAuthCode(trimmedEmail, code.trim());
  if (!ok) {
    return NextResponse.json({ error: "Neteisingas arba pasibaigęs kodas" }, { status: 401 });
  }

  const user = await prisma.registration.findFirst({ where: { email: trimmedEmail } });
  if (!user) {
    return NextResponse.json({ error: "Vartotojas nerastas" }, { status: 404 });
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
