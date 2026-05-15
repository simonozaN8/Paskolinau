import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.contact.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Kontaktas nerastas" }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name  = typeof b.name  === "string" ? b.name.trim()  : existing.name;
  const email = typeof b.email === "string" ? (b.email.trim().toLowerCase() || null) : existing.email;
  const phone = typeof b.phone === "string" ? (b.phone.trim() || null) : existing.phone;

  if (!name) return NextResponse.json({ error: "Vardas privalomas" }, { status: 400 });

  const updated = await prisma.contact.update({
    where: { id },
    data: { name, email, phone },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.contact.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Kontaktas nerastas" }, { status: 404 });

  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
