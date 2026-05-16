"use client";

import { useEffect, useState } from "react";
import { Link2, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { buildClientConfirmUrl } from "@/lib/confirm-url";

type Props = {
  confirmToken: string;
  recipientName?: string;
  compact?: boolean;
  className?: string;
};

export function ConfirmQrCard({
  confirmToken,
  recipientName,
  compact = false,
  className = "",
}: Props) {
  const confirmUrl = buildClientConfirmUrl(confirmToken);
  const size = compact ? 140 : 176;
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(confirmUrl, {
      width: size,
      margin: 2,
      color: { dark: "#0A1628", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [confirmUrl, size]);

  function copyLink() {
    void navigator.clipboard.writeText(confirmUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className={`flex gap-4 ${compact ? "flex-row items-center" : "flex-col sm:flex-row sm:items-start"}`}>
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-inner">
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dataUrl}
                alt="QR kodas patvirtinimui"
                width={size}
                height={size}
                className="block"
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-lg bg-slate-50"
                style={{ width: size, height: size }}
              >
                <QrCode className="h-10 w-10 animate-pulse text-slate-300" />
              </div>
            )}
          </div>
          {!compact && (
            <p className="max-w-[11rem] text-center text-[10px] leading-snug text-slate-500">
              Skolininkas nuskenuoja ir paspaudžia „Patvirtinu“
            </p>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy">
            <QrCode className="h-4 w-4 text-[#00C853]" />
            QR patvirtinimas
            {recipientName ? (
              <span className="font-normal text-slate-500">— {recipientName}</span>
            ) : null}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Unikalus QR kodas šiam prašymui. Skolininkas jį nuskenuoja telefonu —
            tai jo <strong className="font-medium text-navy">mini parašas</strong>,
            patvirtinantis, kad sutinka su skola.
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00C853] hover:underline"
          >
            <Link2 className="h-3.5 w-3.5" />
            {copied ? "Nukopijuota!" : "Kopijuoti nuorodą"}
          </button>
          {!compact && (
            <p className="mt-2 break-all font-mono text-[10px] text-slate-400">{confirmUrl}</p>
          )}
        </div>
      </div>
    </div>
  );
}
