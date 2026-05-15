import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthCode, createSession, SESSION_COOKIE } from "@/lib/auth";

// Accepts a plain HTML form POST — works without JavaScript.
// Sets cookie via NextResponse.cookies (most reliable method).
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const code  = ((formData.get("code")  as string) ?? "").trim().replace(/\D/g, "");

  const errRedirect = (msg: string) =>
    NextResponse.redirect(
      new URL(
        `/prisijungti?step=code&email=${encodeURIComponent(email)}&error=${encodeURIComponent(msg)}`,
        request.url,
      ),
      303,
    );

  if (!email || code.length < 4) return errRedirect("Įveskite kodą");

  const ok = await verifyAuthCode(email, code);
  if (!ok) return errRedirect("Neteisingas arba pasibaigęs kodas");

  const user = await prisma.registration.findFirst({ where: { email } });
  if (!user) return errRedirect("Vartotojas nerastas");

  const token = await createSession(user.id);

  const res = NextResponse.redirect(new URL("/pradzia", request.url), 303);
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return res;
}
