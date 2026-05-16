/** Mokėjimo rekvizitai ir SEPA (EPC) QR turinys banko programėlėms. */

export type PaymentDetails = {
  beneficiaryName: string;
  iban: string;
  amount: number;
  currency: "EUR";
  reference: string;
  description: string;
};

export function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

export function formatIbanDisplay(iban: string): string {
  const n = normalizeIban(iban);
  return n.replace(/(.{4})/g, "$1 ").trim();
}

export function buildPaymentReference(requestId: string): string {
  return `Paskolinau ${requestId.slice(0, 8)}`;
}

export function buildPaymentDetails(input: {
  beneficiaryName: string;
  bankAccount: string;
  amount: number;
  description: string;
  requestId: string;
}): PaymentDetails {
  return {
    beneficiaryName: input.beneficiaryName.trim(),
    iban: normalizeIban(input.bankAccount),
    amount: Math.round(input.amount * 100) / 100,
    currency: "EUR",
    reference: buildPaymentReference(input.requestId),
    description: input.description.trim(),
  };
}

/** Tekstas el. laiškui / SMS. */
export function formatPaymentText(p: PaymentDetails): string {
  return (
    `Mokėjimo rekvizitai:\n` +
    `Gavėjas: ${p.beneficiaryName}\n` +
    `IBAN: ${formatIbanDisplay(p.iban)}\n` +
    `Suma: ${p.amount.toFixed(2)} €\n` +
    `Paskirtis: ${p.reference}`
  );
}

/**
 * EPC069-12 SEPA Credit Transfer QR (atidaro banką su užpildytais laukais daugelyje EU bankų).
 */
export function buildEpcQrPayload(p: PaymentDetails): string {
  const amount = p.amount > 0 ? `EUR${p.amount.toFixed(2)}` : "";
  const lines = [
    "BCD",
    "002",
    "1",
    "SCT",
    p.beneficiaryName.slice(0, 70),
    p.iban,
    amount,
    "",
    p.reference.slice(0, 140),
    "",
    "",
    "",
    "",
  ];
  return lines.join("\n");
}
