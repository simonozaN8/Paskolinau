import { NextResponse } from "next/server";
import { sharesFromTokens } from "@/lib/confirm-url";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import type { Scenario } from "@/lib/request-types";
import { notifyRecipient } from "@/lib/notifications";

/* ── GET /api/requests ── */

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  const requests = await prisma.paymentRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

/* ── POST /api/requests ── */

type RecipientBody = {
  name: string;
  email: string | null;
  phone: string | null;
  amount: number;
  saveAsContact: boolean;
};

type AttachmentBody = {
  name: string;
  size: number;
  type: string;
  data: string;
};

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });
  if (!user.emailVerified) {
    return NextResponse.json({ error: "Patvirtinkite el. paštą prieš kurdami prašymą" }, { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 }); }

  const b = body as Record<string, unknown>;

  const scenario        = (b.scenario as Scenario) ?? "loan";
  const recipients      = Array.isArray(b.recipients) ? (b.recipients as RecipientBody[]) : [];
  const dueDateRaw      = typeof b.dueDate       === "string" ? b.dueDate       : "";
  const description     = typeof b.description   === "string" ? b.description.trim() : "";
  const itemDescription = typeof b.itemDescription === "string" ? b.itemDescription.trim() : null;
  const reminderType    = typeof b.reminderType  === "string" ? b.reminderType  : "weekly";
  const reminderDays    = typeof b.reminderDays  === "number" ? b.reminderDays  : 7;
  const attachments     = Array.isArray(b.attachments) ? (b.attachments as AttachmentBody[]) : [];
  const consent         = b.consent === true;

  /* validacija */
  if (!recipients.length) return NextResponse.json({ error: "Bent vienas gavėjas privalomas" }, { status: 400 });
  for (const r of recipients) {
    if (!r.name?.trim()) return NextResponse.json({ error: `Gavėjo vardas privalomas` }, { status: 400 });
    if (!r.email && !r.phone) return NextResponse.json({ error: `Gavėjui „${r.name}" nurodykite el. paštą arba telefoną` }, { status: 400 });
    if (isNaN(r.amount) || r.amount <= 0) return NextResponse.json({ error: `Suma gavėjui „${r.name}" turi būti teigiamas skaičius` }, { status: 400 });
  }
  if (!dueDateRaw) return NextResponse.json({ error: "Terminas privalomas" }, { status: 400 });
  const dueDate = new Date(dueDateRaw);
  if (isNaN(dueDate.getTime())) return NextResponse.json({ error: "Netinkama termino data" }, { status: 400 });
  if (dueDate <= new Date()) return NextResponse.json({ error: "Terminas turi būti ateityje" }, { status: 400 });
  if (!description) return NextResponse.json({ error: "Aprašymas privalomas" }, { status: 400 });
  if (!consent) return NextResponse.json({ error: "Turite sutikti su sąlygomis" }, { status: 400 });

  /* failų išsaugojimas */
  const savedAttachments: { name: string; size: number; type: string; path: string }[] = [];
  if (attachments.length > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", user.id);
    await fs.mkdir(uploadDir, { recursive: true });
    for (const att of attachments.slice(0, 3)) {
      if (!att.data) continue;
      const base64 = att.data.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");
      const safeName = `${Date.now()}-${att.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      await fs.writeFile(path.join(uploadDir, safeName), buffer);
      savedAttachments.push({ name: att.name, size: att.size, type: att.type, path: `/uploads/${user.id}/${safeName}` });
    }
  }

  /* grupės ID (jungia susijusius prašymus) */
  const groupId = recipients.length > 1 ? crypto.randomUUID() : null;
  const attachmentsJson = JSON.stringify(savedAttachments);
  const senderName = `${user.firstName} ${user.lastName}`;
  const dueDateStr = dueDate.toLocaleDateString("lt-LT");

  /* sukurti po vieną prašymą kiekvienam gavėjui */
  const created = await Promise.all(
    recipients.map((r) =>
      prisma.paymentRequest.create({
        data: {
          userId: user.id,
          scenario,
          groupId,
          recipientName:  r.name.trim(),
          recipientEmail: r.email?.trim().toLowerCase() || null,
          recipientPhone: r.phone?.trim() || null,
          amount:         r.amount,
          itemDescription: itemDescription || null,
          dueDate,
          description,
          reminderType,
          reminderDays,
          attachments: attachmentsJson,
          notificationSent: false,
          confirmToken: crypto.randomUUID(),
        },
      })
    )
  );

  /* išsiųsti pranešimus + atnaujinti flag */
  await Promise.all(
    created.map(async (pr, i) => {
      const r = recipients[i];
      try {
        await notifyRecipient({
          recipientName: pr.recipientName,
          recipientEmail: pr.recipientEmail,
          recipientPhone: pr.recipientPhone,
          senderName,
          amount: pr.amount,
          itemDescription: pr.itemDescription,
          description: pr.description,
          dueDate: pr.dueDate,
          requestId: pr.id,
          confirmToken: pr.confirmToken!,
          scenario,
        });
        await prisma.paymentRequest.update({
          where: { id: pr.id },
          data: { notificationSent: true },
        });
      } catch (e) {
        console.error(`[NOTIFY] Nepavyko išsiųsti pranešimo ${pr.id}:`, e);
      }

      /* išsaugoti naujus kontaktus jei prašyta */
      if (r.saveAsContact) {
        const exists = await prisma.contact.findFirst({
          where: {
            userId: user.id,
            name: r.name.trim(),
          },
        });
        if (!exists) {
          await prisma.contact.create({
            data: {
              userId: user.id,
              name:  r.name.trim(),
              email: r.email?.trim().toLowerCase() || null,
              phone: r.phone?.trim() || null,
            },
          });
        }
      }
    })
  );

  return NextResponse.json({
    ids: created.map((pr) => pr.id),
    shares: sharesFromTokens(created),
    groupId,
    count: created.length,
    totalAmount: created.reduce((s, pr) => s + pr.amount, 0),
  });
}
