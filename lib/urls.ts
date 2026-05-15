/** Vieša svetainė (marketing, footer). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://paskolinau.lt";
}

/**
 * Bazinis URL patvirtinimo nuorodoms SMS/el. pašte.
 * Produkcijoje – paskolinau.lt; lokaliai galite palikti CONFIRM_PUBLIC_URL arba IP.
 */
export function getConfirmBaseUrl(): string {
  return (
    process.env.CONFIRM_PUBLIC_URL?.trim() ||
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    getSiteUrl()
  );
}
