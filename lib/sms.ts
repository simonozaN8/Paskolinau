import twilio from "twilio";
import { normalizePhoneE164 } from "./phone";

export async function sendSms(to: string, body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    throw new Error(
      "SMS siuntimas nesukonfigūruotas. Pridėkite TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN ir TWILIO_FROM_NUMBER į .env failą.",
    );
  }

  const client = twilio(sid, token);
  const normalized = normalizePhoneE164(to);

  await client.messages.create({
    body,
    from,
    to: normalized,
  });
}

export function isSmsConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
}
