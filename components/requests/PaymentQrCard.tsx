"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import QRCode from "qrcode";
import {
  buildEpcQrPayload,
  formatIbanDisplay,
  type PaymentDetails,
} from "@/lib/payment-details";

type Props = {
  payment: PaymentDetails;
  compact?: boolean;
};

/** SEPA mokėjimo QR – banko programėlėje užpildo IBAN, sumą, paskirtį. */
export function PaymentQrCard({ payment, compact }: Props) {
  const epc = buildEpcQrPayload(payment);
  const size = compact ? 140 : 168;
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(epc, {
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
  }, [epc, size]);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
        <CreditCard className="h-4 w-4" />
        Mokėjimo rekvizitai
      </p>
      <div className={`mt-3 flex gap-4 ${compact ? "flex-row items-center" : "flex-col sm:flex-row"}`}>
        {dataUrl && (
          <div className="shrink-0 rounded-xl border border-white bg-white p-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="Mokėjimo QR" width={size} height={size} />
          </div>
        )}
        <ul className="min-w-0 flex-1 space-y-1 text-sm text-emerald-950">
          <li>
            <span className="text-emerald-700">Gavėjas:</span> {payment.beneficiaryName}
          </li>
          <li>
            <span className="text-emerald-700">IBAN:</span> {formatIbanDisplay(payment.iban)}
          </li>
          <li>
            <span className="text-emerald-700">Suma:</span> {payment.amount.toFixed(2)} €
          </li>
          <li>
            <span className="text-emerald-700">Paskirtis:</span> {payment.reference}
          </li>
        </ul>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-emerald-800">
        Nuskenuokite QR banko programėlėje – rekvizitai bus užpildyti, beliks patvirtinti
        mokėjimą. Tiesioginio banko jungties be atskiro sutarimo su bankais šiuo metu
        nėra – naudojamas europinis SEPA QR standartas.
      </p>
    </div>
  );
}
