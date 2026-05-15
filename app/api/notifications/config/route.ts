import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/email";
import { isSmsConfigured } from "@/lib/sms";

/** Patikrina ar serveris sukonfigūruotas siųsti el. paštą / SMS. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Neprisijungta" }, { status: 401 });

  return NextResponse.json({
    email: isEmailConfigured(),
    sms: isSmsConfigured(),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? null,
  });
}
