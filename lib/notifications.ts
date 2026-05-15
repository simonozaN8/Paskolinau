import type { Scenario } from "@/lib/request-types";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import { getConfirmBaseUrl, getSiteUrl } from "@/lib/urls";

const SCENARIO_REASON: Record<Scenario, string> = {
  loan: "pinigų ar daikto grąžinimo",
  "group-fee": "grupinės rinkliavos",
  "split-bill": "padalintos sąskaitos",
  "awaiting-share": "Jūsų dalies už bendras sąnaudas",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type NotifyPayload = {
  recipientName: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  senderName: string;
  amount: number;
  itemDescription: string | null;
  description: string;
  dueDate: Date;
  requestId: string;
  confirmToken: string;
  scenario: Scenario;
  isReminder?: boolean;
};

export type NotifyResult = {
  ok: boolean;
  channels: ("sms" | "email")[];
  confirmUrl: string;
  errors?: string[];
};

function formatAmount(amount: number, itemDescription: string | null): string {
  if (itemDescription?.trim()) {
    return `${itemDescription.trim()} (apytikslė vertė ${amount.toFixed(2)} €)`;
  }
  return `${amount.toFixed(2)} €`;
}

function buildMessages(payload: NotifyPayload) {
  const {
    recipientName,
    senderName,
    amount,
    itemDescription,
    description,
    dueDate,
    confirmToken,
    scenario,
    isReminder,
  } = payload;

  const confirmUrl = `${getConfirmBaseUrl()}/confirm/${confirmToken}`;
  const siteUrl = getSiteUrl();
  const dueStr = dueDate.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const amountText = formatAmount(amount, itemDescription);
  const reason = SCENARIO_REASON[scenario] ?? "mokėjimo";
  const safeName = escapeHtml(recipientName);
  const safeSender = escapeHtml(senderName);
  const safeDesc = escapeHtml(description);
  const safeAmount = escapeHtml(amountText);

  const subject = isReminder
    ? `${senderName} primena apie mokėjimą – Paskolinau.lt`
    : `${senderName} siunčia mokėjimo prašymą – Paskolinau.lt`;

  const headline = isReminder ? "Priminimas apie mokėjimą" : "Naujas mokėjimo prašymas";

  const isItem = !!itemDescription?.trim();

  const lead = isReminder
    ? `${senderName} primena, kad terminas artėja arba įsipareigojimas dar neįvykdytas.`
    : `${senderName} per Paskolinau.lt siunčia Jums prašymą patvirtinti skolą ir įsipareigojimą.`;

  const actionHint = isItem
    ? "Atidarykite nuorodą ir pasirinkite: „Patvirtinu“ (pripažįstu skolą) arba „Grąžinta“ (daiktas jau grąžintas)."
    : "Atidarykite nuorodą ir pasirinkite: „Patvirtinu“ (pripažįstu skolą) arba „Grąžinta“ (suma jau grąžinta).";

  const purpose = isReminder
    ? `Šis priminimas susijęs su <strong>${escapeHtml(reason)}</strong> ir prašymu: „${safeDesc}“.`
    : `Prašymas susijęs su <strong>${escapeHtml(reason)}</strong>: „${safeDesc}“.`;

  const text =
    `${headline}\n\n` +
    `Sveiki, ${recipientName},\n\n` +
    `${lead}\n\n` +
    `${isReminder ? "Primename dėl" : "Prašymas dėl"}: ${description}\n` +
    `Suma: ${amountText}\n` +
    `Mokėjimo terminas: ${dueStr}\n` +
    `Nuo: ${senderName}\n\n` +
    `${actionHint}\n\n` +
    `${confirmUrl}\n\n` +
    `Oficiali svetainė: ${siteUrl}\n\n` +
    `— Paskolinau.lt\n` +
    `Šis laiškas išsiųstas automatiškai. Jei negavote tokio prašymo, ignoruokite žinutę.`;

  const html = `<!DOCTYPE html>
<html lang="lt">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:#1A2B4A;padding:24px 28px;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Paskolinau<span style="color:#00C853;">.lt</span></p>
            <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">${headline}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1A2B4A;">Sveiki, <strong>${safeName}</strong>,</p>
            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">${escapeHtml(lead)}</p>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#475569;">${purpose}</p>
            <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#64748b;">${escapeHtml(actionHint)}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;">Kas siunčia</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1A2B4A;">${safeSender}</p>
              </td></tr>
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;">Suma</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1A2B4A;">${safeAmount}</p>
              </td></tr>
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;">Mokėjimo terminas</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1A2B4A;">${escapeHtml(dueStr)}</p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
              <tr><td style="border-radius:10px;background:#00C853;">
                <a href="${confirmUrl}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                  Peržiūrėti ir atsakyti (Patvirtinu / Grąžinta)
                </a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#94a3b8;text-align:center;">
              Jei mygtukas neveikia, nukopijuokite nuorodą:<br>
              <a href="${confirmUrl}" style="color:#00C853;word-break:break-all;">${confirmUrl}</a>
            </p>
            <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;text-align:center;">
              Oficiali svetainė: <a href="${siteUrl}" style="color:#1A2B4A;">${siteUrl}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;line-height:1.5;color:#94a3b8;text-align:center;">
              Šis pranešimas išsiųstas automatiškai per Paskolinau.lt. Jei negavote tokio prašymo, galite ignoruoti šį laišką.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const smsText = isReminder
    ? `Paskolinau.lt | ${senderName} primena: „${description}“. ${amountText}, terminas ${dueStr}. Patvirtinkite skolą: ${confirmUrl}`
    : `Paskolinau.lt | ${senderName} prašo patvirtinti skolą: „${description}“. ${amountText}, terminas ${dueStr}. Patvirtinu/Grąžinta: ${confirmUrl}`;

  return { subject, text, html, smsText, confirmUrl };
}

/** Siunčia SMS ir/ar el. paštą gavėjui. */
export async function notifyRecipient(payload: NotifyPayload): Promise<NotifyResult> {
  const { recipientEmail, recipientPhone, requestId, recipientName } = payload;
  const { subject, text, html, smsText, confirmUrl } = buildMessages(payload);

  const channels: ("sms" | "email")[] = [];
  const errors: string[] = [];

  if (recipientPhone?.trim()) {
    try {
      await sendSms(recipientPhone.trim(), smsText);
      channels.push("sms");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "SMS klaida";
      errors.push(msg);
      console.error(`[SMS][${requestId}] → ${recipientPhone}:`, msg);
    }
  }

  if (recipientEmail?.trim()) {
    try {
      await sendEmail({
        to: recipientEmail.trim().toLowerCase(),
        subject,
        text,
        html,
      });
      channels.push("email");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "El. pašto klaida";
      errors.push(msg);
      console.error(`[EMAIL][${requestId}] → ${recipientEmail}:`, msg);
    }
  }

  if (!channels.length) {
    if (!recipientEmail?.trim() && !recipientPhone?.trim()) {
      throw new Error(`Gavėjui „${recipientName}" nėra telefono nei el. pašto.`);
    }
    throw new Error(errors.length ? errors.join(" ") : "Nepavyko išsiųsti pranešimo.");
  }

  return { ok: true, channels, confirmUrl, errors: errors.length ? errors : undefined };
}
