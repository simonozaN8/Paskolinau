import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPaymentDetails } from "@/lib/payment-details";

type Params = { params: Promise<{ token: string }> };

/* ── GET /api/confirm/[token] — public ── */
export async function GET(_: Request, { params }: Params) {
  const { token } = await params;

  const pr = await prisma.paymentRequest.findUnique({
    where: { confirmToken: token },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, bankAccount: true } },
    },
  });

  if (!pr) return NextResponse.json({ error: "Prašymas nerastas" }, { status: 404 });

  const senderName = `${pr.user.firstName} ${pr.user.lastName}`;
  const payment =
    pr.amount > 0 && !pr.itemDescription?.trim() && pr.user.bankAccount?.trim()
      ? buildPaymentDetails({
          beneficiaryName: senderName,
          bankAccount: pr.user.bankAccount,
          amount: pr.amount,
          description: pr.description,
          requestId: pr.id,
        })
      : null;

  return NextResponse.json({
    id: pr.id,
    status: pr.status,
    scenario: pr.scenario,
    senderName,
    recipientName: pr.recipientName,
    amount: pr.amount,
    itemDescription: pr.itemDescription,
    dueDate: pr.dueDate.toISOString(),
    description: pr.description,
    confirmedAt: pr.confirmedAt?.toISOString() ?? null,
    paidAt: pr.paidAt?.toISOString() ?? null,
    completedAt: pr.completedAt?.toISOString() ?? null,
    createdAt: pr.createdAt.toISOString(),
    payment,
  });
}

/* ── POST /api/confirm/[token] — public ── */
export async function POST(request: Request, { params }: Params) {
  const { token } = await params;

  const pr = await prisma.paymentRequest.findUnique({ where: { confirmToken: token } });
  if (!pr) return NextResponse.json({ error: "Prašymas nerastas" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const action = (body as Record<string, unknown>).action as "confirm" | "paid" | "returned";

  if (action === "confirm") {
    if (!["active", "reminded"].includes(pr.status)) {
      return NextResponse.json(
        { error: "Skolą galima patvirtinti tik kol prašymas laukia atsakymo" },
        { status: 400 },
      );
    }
    const updated = await prisma.paymentRequest.update({
      where: { id: pr.id },
      data: { status: "confirmed", confirmedAt: new Date() },
    });
    return NextResponse.json({
      status: updated.status,
      confirmedAt: updated.confirmedAt?.toISOString(),
    });
  }

  if (action === "paid" || action === "returned") {
    if (["completed", "cancelled"].includes(pr.status)) {
      return NextResponse.json({ error: "Prašymas jau užbaigtas arba atšauktas" }, { status: 400 });
    }
    const updated = await prisma.paymentRequest.update({
      where: { id: pr.id },
      data: { status: "paid", paidAt: new Date() },
    });
    return NextResponse.json({
      status: updated.status,
      paidAt: updated.paidAt?.toISOString(),
    });
  }

  return NextResponse.json({ error: "Nežinoma action reikšmė" }, { status: 400 });
}
