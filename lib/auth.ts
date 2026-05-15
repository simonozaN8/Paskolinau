import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "psession";
const SESSION_DAYS = 30;
const CODE_MINUTES = 10;

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAuthCode(email: string): Promise<string> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_MINUTES * 60 * 1000);
  await prisma.authCode.create({ data: { email, code, expiresAt } });
  return code;
}

export async function verifyAuthCode(email: string, code: string): Promise<boolean> {
  const record = await prisma.authCode.findFirst({
    where: { email, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return false;
  await prisma.authCode.update({ where: { id: record.id }, data: { used: true } });
  return true;
}

export async function createSession(registrationId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { token, registrationId, expiresAt } });
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  // 1. Try cookie (web)
  const store = await cookies();
  let token = store.get(SESSION_COOKIE)?.value;

  // 2. Try Authorization: Bearer <token> (mobile app)
  if (!token) {
    const reqHeaders = await headers();
    const auth = reqHeaders.get("authorization") ?? "";
    if (auth.startsWith("Bearer ")) token = auth.slice(7).trim();
  }

  if (!token) return null;
  const session = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: { registration: true },
  });
  return session?.registration ?? null;
}
