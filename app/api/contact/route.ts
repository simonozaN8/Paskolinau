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

  const { name, email, topic, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Vardas yra privalomas" }, { status: 400 });
  }
  if (typeof email !== "string" || !emailRe.test(email.trim())) {
    return NextResponse.json({ error: "Neteisingas el. pašto formatas" }, { status: 400 });
  }
  if (typeof topic !== "string" || topic.trim() === "") {
    return NextResponse.json({ error: "Tema yra privaloma" }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json({ error: "Žinutė per trumpa (min. 10 simbolių)" }, { status: 400 });
  }

  try {
    const row = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        topic: topic.trim(),
        message: message.trim(),
      },
    });
    return NextResponse.json({ id: row.id, createdAt: row.createdAt.toISOString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Nepavyko išsaugoti žinutės" }, { status: 500 });
  }
}
