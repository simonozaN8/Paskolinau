import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { notifyRecipient } from "@/lib/notifications";
import type { Scenario } from "@/lib/request-types";

/** Vykdo suplanuotus priminimus (kviečiama iš paskyros ar cron). */
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const now = new Date();
  const due = await prisma.paymentRequest.findMany({
    where: {
      userId: user.id,
      nextReminderAt: { lte: now },
      status: { in: ["active", "confirmed", "reminded"] },
    },
    take: 20,
  });

  const senderName = `${user.firstName} ${user.lastName}`;
  let sent = 0;
  const errors: string[] = [];

  for (const pr of due) {
    if (!pr.confirmToken || (!pr.recipientEmail && !pr.recipientPhone)) continue;
    try {
      await notifyRecipient({
        recipientName: pr.recipientName,
        recipientEmail: pr.recipientEmail,
        recipientPhone: pr.recipientPhone,
        senderName,
        senderBankAccount: user.bankAccount,
        amount: pr.amount,
        itemDescription: pr.itemDescription,
        description: pr.description,
        dueDate: pr.dueDate,
        requestId: pr.id,
        confirmToken: pr.confirmToken,
        scenario: pr.scenario as Scenario,
        isReminder: true,
      });
      await prisma.paymentRequest.update({
        where: { id: pr.id },
        data: {
          status: "reminded",
          lastRemindedAt: now,
          nextReminderAt: null,
        },
      });
      sent++;
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "Klaida");
    }
  }

  return NextResponse.json({ ok: true, processed: due.length, sent, errors });
}
