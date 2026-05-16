import { getConfirmBaseUrl, getSiteUrl } from "@/lib/urls";

export type RequestShare = {
  id: string;
  recipientName: string;
  confirmToken: string;
  confirmUrl: string;
};

/** Server-side patvirtinimo nuoroda (SMS, el. paštas, API). */
export function buildConfirmUrl(confirmToken: string): string {
  return `${getConfirmBaseUrl().replace(/\/$/, "")}/confirm/${confirmToken}`;
}

/** Kliento komponentams (naršyklė / PWA). */
export function buildClientConfirmUrl(confirmToken: string): string {
  if (typeof window !== "undefined") {
    const base =
      process.env.NEXT_PUBLIC_CONFIRM_BASE_URL?.trim() ||
      process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      window.location.origin;
    return `${base.replace(/\/$/, "")}/confirm/${confirmToken}`;
  }
  return buildConfirmUrl(confirmToken);
}

export function sharesFromTokens(
  items: { id: string; recipientName: string; confirmToken: string | null }[],
): RequestShare[] {
  return items
    .filter((x): x is typeof x & { confirmToken: string } => !!x.confirmToken)
    .map((x) => ({
      id: x.id,
      recipientName: x.recipientName,
      confirmToken: x.confirmToken,
      confirmUrl: buildConfirmUrl(x.confirmToken),
    }));
}

/** Numatyta bazė be `window` (dokumentacija, tipai). */
export function defaultConfirmSiteUrl(): string {
  return getSiteUrl();
}
