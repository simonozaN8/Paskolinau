/** Normalizuoja LT telefono numerį į E.164 (+370...). */
export function normalizePhoneE164(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) {
    return "+" + trimmed.slice(1).replace(/\D/g, "");
  }

  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("370")) {
    return `+${digits}`;
  }

  // 8 6xx xxxxx (9 skaitmenų nuo 8)
  if (digits.startsWith("8") && digits.length === 9) {
    return `+370${digits.slice(1)}`;
  }

  // 06xx...
  if (digits.startsWith("06") && digits.length >= 10) {
    return `+370${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `+370${digits}`;
  }

  return `+${digits}`;
}
