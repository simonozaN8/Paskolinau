import { API_BASE } from "./api";

export type RequestShare = {
  id: string;
  recipientName: string;
  confirmToken: string;
  confirmUrl: string;
};

/** Patvirtinimo nuoroda (QR turinys) – visada viešas paskolinau.lt domenas. */
export function buildConfirmUrl(confirmToken: string): string {
  const base = (
    process.env.EXPO_PUBLIC_SITE_URL?.trim() ||
    process.env.EXPO_PUBLIC_CONFIRM_BASE_URL?.trim() ||
    API_BASE
  ).replace(/\/$/, "");
  return `${base}/confirm/${confirmToken}`;
}
