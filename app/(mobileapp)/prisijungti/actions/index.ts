"use server";

import { redirect } from "next/navigation";
import { createAuthCode } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyAuthCode, createSession, setSessionCookie } from "@/lib/auth";

export async function sendCodeAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) redirect("/prisijungti?error=Įveskite+el.+paštą");

  const user = await prisma.registration.findFirst({ where: { email } });
  if (!user) redirect("/prisijungti?error=Tokio+el.+pašto+nėra+sistemoje");

  const code = await createAuthCode(email);
  const isDev = process.env.NODE_ENV === "development";

  redirect(
    `/prisijungti?step=code&email=${encodeURIComponent(email)}${isDev ? `&dev=${code}` : ""}`,
  );
}

export async function verifyCodeAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const code  = (formData.get("code") as string)?.trim();

  if (!email || !code) redirect(`/prisijungti?step=code&email=${encodeURIComponent(email ?? "")}&error=Įveskite+kodą`);

  const ok = await verifyAuthCode(email, code);
  if (!ok) redirect(`/prisijungti?step=code&email=${encodeURIComponent(email)}&error=Neteisingas+arba+pasibaigęs+kodas`);

  const user = await prisma.registration.findFirst({ where: { email } });
  if (!user) redirect("/prisijungti?error=Vartotojas+nerastas");

  const token = await createSession(user.id);
  await setSessionCookie(token);

  redirect("/pradzia");
}
