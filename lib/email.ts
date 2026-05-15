import nodemailer from "nodemailer";

export type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

async function sendViaResend({ to, subject, text, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.EMAIL_FROM ?? "Paskolinau.lt <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: html ?? text.replace(/\n/g, "<br>"),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend klaida: ${err}`);
  }
}

async function sendViaSmtp({ to, subject, text, html }: SendEmailParams) {
  const host = process.env.SMTP_HOST!;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "Paskolinau.lt <noreply@paskolinau.lt>",
    to,
    subject,
    text,
    html: html ?? text.replace(/\n/g, "<br>"),
  });
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    await sendViaResend(params);
    return;
  }
  if (process.env.SMTP_HOST) {
    await sendViaSmtp(params);
    return;
  }
  throw new Error(
    "El. pašto siuntimas nesukonfigūruotas. Pridėkite RESEND_API_KEY arba SMTP_HOST į .env failą.",
  );
}

export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
}
