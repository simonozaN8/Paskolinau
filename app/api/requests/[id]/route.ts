import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const { id } = await params;
  const pr = await prisma.paymentRequest.findFirst({ where: { id, userId: user.id } });
  if (!pr) return NextResponse.json({ error: "Prašymas nerastas" }, { status: 404 });

  return NextResponse.json(pr);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const { id } = await params;
  const pr = await prisma.paymentRequest.findFirst({ where: { id, userId: user.id } });
  if (!pr) return NextResponse.json({ error: "Prašymas nerastas" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  if (typeof b.recipientName === "string" && b.recipientName.trim()) {
    data.recipientName = b.recipientName.trim();
  }
  if (typeof b.recipientEmail === "string") {
    data.recipientEmail = b.recipientEmail.trim().toLowerCase() || null;
  }
  if (typeof b.recipientPhone === "string") {
    data.recipientPhone = b.recipientPhone.trim() || null;
  }
  if (typeof b.description === "string" && b.description.trim()) {
    data.description = b.description.trim();
  }
  if (typeof b.itemDescription === "string") {
    data.itemDescription = b.itemDescription.trim() || null;
  }
  if (typeof b.amount === "number" && b.amount > 0) {
    data.amount = b.amount;
  }
  if (typeof b.dueDate === "string" && b.dueDate) {
    const d = new Date(b.dueDate);
    if (!isNaN(d.getTime())) data.dueDate = d;
  }
  if (typeof b.reminderType === "string" && b.reminderType.trim()) {
    data.reminderType = b.reminderType.trim();
  }
  if (typeof b.reminderDays === "number" && b.reminderDays >= 0) {
    data.reminderDays = b.reminderDays;
  }
  if (b.nextReminderAt === null) {
    data.nextReminderAt = null;
  } else if (typeof b.nextReminderAt === "string" && b.nextReminderAt) {
    const d = new Date(b.nextReminderAt);
    if (!isNaN(d.getTime())) data.nextReminderAt = d;
  }

  const email = (data.recipientEmail as string | null) ?? pr.recipientEmail;
  const phone = (data.recipientPhone as string | null) ?? pr.recipientPhone;
  if (!email && !phone) {
    return NextResponse.json(
      { error: "Nurodykite gavėjo el. paštą arba telefoną" },
      { status: 400 },
    );
  }

  const updated = await prisma.paymentRequest.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const { id } = await params;
  const pr = await prisma.paymentRequest.findFirst({ where: { id, userId: user.id } });
  if (!pr) return NextResponse.json({ error: "Prašymas nerastas" }, { status: 404 });

  await prisma.paymentRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
