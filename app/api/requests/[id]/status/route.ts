import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { notifyRecipient } from "@/lib/notifications";
import type { Scenario } from "@/lib/request-types";

type Params = { params: Promise<{ id: string }> };

const VALID_ACTIONS = ["complete", "cancel", "remind", "schedule_remind"] as const;
type Action = typeof VALID_ACTIONS[number];

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const { id } = await params;

  const pr = await prisma.paymentRequest.findFirst({ where: { id, userId: user.id } });
  if (!pr) return NextResponse.json({ error: "Prašymas nerastas" }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 }); }

  const action = (body as Record<string, unknown>).action as Action;
  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Neteisinga action reikšmė" }, { status: 400 });
  }

  if (action === "schedule_remind") {
    const scheduledAtRaw = (body as Record<string, unknown>).scheduledAt;
    if (typeof scheduledAtRaw !== "string" || !scheduledAtRaw) {
      return NextResponse.json({ error: "Nurodykite scheduledAt (ISO data)" }, { status: 400 });
    }
    const scheduledAt = new Date(scheduledAtRaw);
    if (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      return NextResponse.json({ error: "Priminimo laikas turi būti ateityje" }, { status: 400 });
    }
    const updated = await prisma.paymentRequest.update({
      where: { id },
      data: { nextReminderAt: scheduledAt },
    });
    return NextResponse.json({ ok: true, action: "schedule_remind", request: updated });
  }

  if (action === "remind") {
    if (!pr.recipientEmail && !pr.recipientPhone) {
      return NextResponse.json(
        { error: "Gavėjas neturi telefono ar el. pašto – priminti negalima" },
        { status: 400 },
      );
    }
    const sender = await prisma.registration.findUnique({ where: { id: user.id } });
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Paskolinau.lt";
    if (!pr.confirmToken) {
      return NextResponse.json({ error: "Prašymas neturi patvirtinimo nuorodos" }, { status: 400 });
    }

    let result;
    try {
      result = await notifyRecipient({
        recipientName: pr.recipientName,
        recipientEmail: pr.recipientEmail,
        recipientPhone: pr.recipientPhone,
        senderName,
        senderBankAccount: sender?.bankAccount,
        amount: pr.amount,
        itemDescription: pr.itemDescription,
        description: pr.description,
        dueDate: pr.dueDate,
        requestId: pr.id,
        confirmToken: pr.confirmToken,
        scenario: pr.scenario as Scenario,
        isReminder: true,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Nepavyko išsiųsti priminimo";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const updated = await prisma.paymentRequest.update({
      where: { id },
      data: { status: "reminded", lastRemindedAt: new Date(), nextReminderAt: null },
    });
    return NextResponse.json({
      ok: true,
      action: "remind",
      channels: result.channels,
      warnings: result.errors,
      request: updated,
    });
  }

  if (action === "complete") {
    if (pr.status !== "paid") {
      return NextResponse.json({ error: "Galima patvirtinti tik 'Sumokėta' statusą" }, { status: 400 });
    }
    const updated = await prisma.paymentRequest.update({
      where: { id },
      data: { status: "completed", completedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  if (action === "cancel") {
    const updated = await prisma.paymentRequest.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Nežinoma klaida" }, { status: 500 });
}
