import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name  = typeof b.name  === "string" ? b.name.trim()  : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : null;
  const phone = typeof b.phone === "string" ? b.phone.trim() : null;

  if (!name) return NextResponse.json({ error: "Vardas privalomas" }, { status: 400 });
  if (!email && !phone) return NextResponse.json({ error: "Nurodykite el. paštą arba telefoną" }, { status: 400 });

  const contact = await prisma.contact.create({
    data: { userId: user.id, name, email: email || null, phone: phone || null },
  });

  return NextResponse.json(contact);
}
