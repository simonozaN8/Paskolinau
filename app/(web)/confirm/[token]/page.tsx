"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Euro,
  Handshake,
  Loader2,
  Package,
  Receipt,
  Timer,
  Users,
} from "lucide-react";
import { PaymentQrCard } from "@/components/requests/PaymentQrCard";
import type { PaymentDetails } from "@/lib/payment-details";
import type { Scenario } from "@/lib/request-types";
import { SCENARIO_META } from "@/lib/request-types";
import type { ComponentType } from "react";

type RequestDetails = {
  id: string;
  status: string;
  scenario: Scenario;
  senderName: string;
  recipientName: string;
  amount: number;
  itemDescription: string | null;
  dueDate: string;
  description: string;
  confirmedAt: string | null;
  paidAt: string | null;
  completedAt: string | null;
  createdAt: string;
  payment: PaymentDetails | null;
};

const ICONS: Record<Scenario, ComponentType<{ className?: string }>> = {
  loan: Handshake,
  "group-fee": Users,
  "split-bill": Receipt,
  "awaiting-share": Timer,
};

const STATUS_DISPLAY: Record<
  string,
  { label: string; cls: string; icon: ComponentType<{ className?: string }> }
> = {
  active: { label: "Laukia Jūsų atsakymo", cls: "bg-blue-50 text-blue-700 border-blue-100", icon: Clock },
  reminded: { label: "Priminta", cls: "bg-orange-50 text-orange-700 border-orange-100", icon: Clock },
  confirmed: { label: "Patvirtinta", cls: "bg-amber-50 text-amber-700 border-amber-100", icon: CheckCircle2 },
  paid: { label: "Grąžinta / sumokėta", cls: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
  completed: { label: "Įvykdyta", cls: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Atšauktas", cls: "bg-slate-100 text-slate-500 border-slate-200", icon: AlertCircle },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("lt-LT", { year: "numeric", month: "long", day: "numeric" });
}

export default function ConfirmPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [done, setDone] = useState<"confirm" | "returned" | null>(null);

  useEffect(() => {
    fetch(`/api/confirm/${token}`)
      .then((r) =>
        r.ok ? (r.json() as Promise<RequestDetails>) : r.json().then((d) => Promise.reject(d.error)),
      )
      .then(setData)
      .catch((e) => setError(typeof e === "string" ? e : "Prašymas nerastas"))
      .finally(() => setLoading(false));
  }, [token]);

  async function act(action: "confirm" | "paid") {
    setActing(true);
    setError(null);
    try {
      const res = await fetch(`/api/confirm/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action === "confirm" ? "confirm" : "returned" }),
      });
      const d = (await res.json()) as { status?: string; error?: string };
      if (!res.ok) {
        setError(d.error ?? "Klaida");
        return;
      }
      setDone(action === "confirm" ? "confirm" : "returned");
      if (data) setData({ ...data, status: d.status ?? data.status });
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
        <h1 className="text-xl font-bold text-navy">Prašymas nerastas</h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const Icon = ICONS[data.scenario];
  const meta = SCENARIO_META[data.scenario];
  const st = STATUS_DISPLAY[data.status] ?? STATUS_DISPLAY.active;
  const StatusIcon = st.icon;
  const isItem = !!data.itemDescription?.trim();
  const isClosed = ["paid", "completed", "cancelled"].includes(data.status);
  const canConfirm = ["active", "reminded"].includes(data.status);
  const canReturn = ["active", "confirmed", "reminded"].includes(data.status);

  const returnLabel = isItem ? "Grąžinta" : "Grąžinta / sumokėta";
  const confirmHelp = isItem
    ? "Patvirtinu, kad pasiėmiau daiktą ir pripažįstu įsipareigojimą jį grąžinti (kaip mini parašas po QR nuskaitymo)."
    : "Patvirtinu, kad pripažįstu skolą ir įsipareigoju grąžinti pinigus (kaip mini parašas po QR nuskaitymo).";
  const returnHelp = isItem
    ? "Daiktas jau grąžintas skolintojui (skolintojas patvirtins gavimą)."
    : "Suma jau pervesta arba grąžinta (skolintojas patvirtins gavimą).";

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      {done && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#00C853]/10 px-5 py-4 text-[#007a32]">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <p className="font-semibold">
            {done === "confirm"
              ? "Ačiū! Skolintojas matys, kad patvirtinote skolą."
              : "Ačiū! Skolintojas gavo pranešimą apie grąžinimą ir patvirtins gavimą."}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <Icon className="h-5 w-5 text-navy" />
            </span>
            <div>
              <p className="text-xs text-slate-400">{meta.label}</p>
              <p className="mt-0.5 font-bold text-navy">{data.senderName}</p>
              <p className="text-sm text-slate-500">prašo patvirtinti skolą</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${st.cls}`}
          >
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </span>
        </div>

        <div className="border-b border-slate-100 px-6 py-5">
          {isItem ? (
            <div>
              <div className="flex items-center gap-2 text-slate-500">
                <Package className="h-4 w-4" />
                <span className="text-sm">Paskolintas daiktas</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold text-navy">{data.itemDescription}</p>
              {data.amount > 0 && (
                <p className="mt-0.5 text-sm text-slate-500">Vertė: {data.amount.toFixed(2)} €</p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-slate-500">
                <Euro className="h-4 w-4" />
                <span className="text-sm">Skola</span>
              </div>
              <p className="mt-1.5 text-3xl font-bold tracking-tight text-navy">
                {data.amount.toFixed(2)} €
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 px-6 py-5">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Terminas</p>
              <p className="text-sm font-semibold text-navy">{fmt(data.dueDate)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {data.description}
          </div>
        </div>

        {data.payment && !isItem && (
          <div className="border-b border-slate-100 px-6 py-5">
            <PaymentQrCard payment={data.payment} />
          </div>
        )}

        {!isClosed && !done && (
          <div className="border-t border-slate-100 px-6 py-5">
            <p className="mb-4 text-sm font-semibold text-navy">Jūsų atsakymas</p>
            <div className="flex flex-col gap-3">
              {canConfirm && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => act("confirm")}
                    className="w-full rounded-xl border-2 border-navy bg-white py-3 text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    {acting ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      "Patvirtinu"
                    )}
                  </button>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{confirmHelp}</p>
                </div>
              )}
              {canReturn && (
                <div className="rounded-xl border border-[#00C853]/30 bg-[#00C853]/5 p-4">
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => act("paid")}
                    className="w-full rounded-xl bg-[#00C853] py-3 text-sm font-semibold text-white transition hover:bg-[#00b849] disabled:opacity-60"
                  >
                    {acting ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      returnLabel
                    )}
                  </button>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{returnHelp}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {isClosed && (
          <div className="border-t border-slate-100 px-6 py-4 text-center text-sm text-slate-500">
            Šis prašymas jau užregistruotas. Ačiū!
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        <Link href="https://paskolinau.lt" className="font-semibold text-navy hover:underline">
          Paskolinau.lt
        </Link>
        {" — oficiali mokėjimų ir skolų sistema"}
      </p>
    </div>
  );
}
