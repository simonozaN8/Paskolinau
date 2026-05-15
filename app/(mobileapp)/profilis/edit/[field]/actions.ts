"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["firstName", "lastName", "phone", "bankAccount"] as const;
type Field = (typeof ALLOWED)[number];

export async function saveFieldAction(field: Field, formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/prisijungti");

  if (!ALLOWED.includes(field)) redirect("/profilis");

  const value = ((formData.get("value") as string) ?? "").trim();

  await prisma.registration.update({
    where: { id: user.id },
    data: { [field]: value },
  });

  redirect("/profilis");
}
