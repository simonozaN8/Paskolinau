import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const res = NextResponse.redirect(new URL("/prisijungti", request.url), 303);
  return res;
}
