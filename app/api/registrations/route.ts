import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 });
  }

  const { firstName, lastName, phone, email, bankAccount } = body as Record<
    string,
    unknown
  >;

  const fields = { firstName, lastName, phone, email, bankAccount };
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val !== "string" || val.trim() === "") {
      return NextResponse.json(
        { error: `Laukas „${key}“ yra privalomas` },
        { status: 400 },
      );
    }
  }

  const fn = (firstName as string).trim();
  const ln = (lastName as string).trim();
  const ph = (phone as string).trim();
  const em = (email as string).trim().toLowerCase();
  const ba = (bankAccount as string).trim();

  if (!emailRe.test(em)) {
    return NextResponse.json({ error: "Neteisingas el. pašto formatas" }, { status: 400 });
  }

  // Patikrinti ar el. paštas jau užregistruotas
  const existing = await prisma.registration.findFirst({ where: { email: em } });
  if (existing) {
    return NextResponse.json(
      { error: "Šis el. paštas jau užregistruotas. Prisijunkite prie esamos paskyros." },
      { status: 409 },
    );
  }

  try {
    const row = await prisma.registration.create({
      data: {
        firstName: fn,
        lastName: ln,
        phone: ph,
        email: em,
        bankAccount: ba,
      },
    });
    return NextResponse.json({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Nepavyko išsaugoti. Patikrinkite duomenų bazės konfigūraciją." },
      { status: 500 },
    );
  }
}
