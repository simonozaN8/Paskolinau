import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 }); }

  const { firstName, lastName, phone, bankAccount } = body as Record<string, string>;

  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: "Vardas ir pavardė privalomi" }, { status: 400 });
  }

  const updated = await prisma.registration.update({
    where: { id: user.id },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() ?? user.phone,
      bankAccount: bankAccount?.trim() ?? user.bankAccount,
    },
  });

  return NextResponse.json({
    id: updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    emailVerified: updated.emailVerified,
    phone: updated.phone,
    bankAccount: updated.bankAccount,
  });
}
