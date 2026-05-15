"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  Hash,
  Link2,
  Loader2,
  QrCode,
  ShoppingCart,
} from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";

type Req = {
  id: string; recipientName: string; amount: number; description: string;
  itemDescription: string | null; dueDate: string | null; status: string;
  scenario: string; createdAt: string; confirmedAt: string | null;
  paidAt: string | null; completedAt: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  active: "Laukia", confirmed: "Patvirtinta", paid: "Sumokėta",
  completed: "Apmokėta", cancelled: "Atšaukta", reminded: "Priminta",
};
const STATUS_COLORS: Record<string, string> = {
  active: "bg-blue-50 text-blue-700", confirmed: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700", completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500", reminded: "bg-orange-50 text-orange-700",
};

function fmt(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("lt-LT");
}
function fmtDt(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleString("lt-LT", { dateStyle: "short", timeStyle: "short" });
}

export default function PrasymasPage() {
  const { id } = useParams<{ id: string }>();
  const [req, setReq] = useState<Req | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Req[]) => setReq(list.find((x) => x.id === id) ?? null))
      .catch(() => setReq(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function remind() {
    setActionLoading(true);
    await fetch(`/api/requests/${id}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remind" }),
    });
    setActionLoading(false);
  }

  async function complete() {
    setActionLoading(true);
    const res = await fetch(`/api/requests/${id}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    if (res.ok) {
      const updated = await fetch("/api/requests").then((r) => r.json());
      setReq((updated as Req[]).find((x) => x.id === id) ?? null);
    }
    setActionLoading(false);
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/confirm/${id}` : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
    </div>
  );

  if (!req) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-8 text-center">
      <p className="text-navy font-semibold">Prašymas nerastas</p>
    </div>
  );

  const title = req.itemDescription ?? req.description;

  type Step = { label: string; sub: string; date: string | null; status: "done" | "eye" | "pending" | "waiting"; badge?: string };
  const steps: Step[] = [
    { label: "Sukurta",    sub: "Prašymas sukurtas",              date: fmtDt(req.createdAt),   status: "done"    },
    { label: "Išsiųsta",   sub: `Prašymas išsiųstas ${req.recipientName}`, date: fmtDt(req.createdAt), status: "done" },
    { label: "Peržiūrėta", sub: `${req.recipientName} peržiūrėjo prašymą`, date: req.confirmedAt ? fmtDt(req.confirmedAt) : null, status: req.confirmedAt ? "eye" : "pending", badge: req.confirmedAt ? undefined : "Laukia" },
    { label: "Apmokėjau",  sub: "Laukiama mokėjimo",               date: req.paidAt ? fmtDt(req.paidAt) : null, status: req.paidAt ? "done" : "waiting", badge: req.paidAt ? undefined : "Laukia patvirtinimo" },
    { label: "Gavau",      sub: "Patvirtinkite, kai gausite mokėjimą", date: req.completedAt ? fmtDt(req.completedAt) : null, status: req.completedAt ? "done" : "pending", badge: req.completedAt ? undefined : "Laukia" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <MobileAppBar variant="back" title="Mokėjimo prašymas" />
      </div>

      {/* Request card */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-start gap-3 p-4 pb-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50">
            <ShoppingCart className="h-6 w-6 text-[#00C853]" />
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-navy">{title}</p>
              <p className="text-base font-bold text-navy">{Number(req.amount).toFixed(2).replace(".", ",")} €</p>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-slate-500">Kam: {req.recipientName}</p>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", STATUS_COLORS[req.status] ?? STATUS_COLORS.active)}>
                {STATUS_LABELS[req.status] ?? "Laukia"}
              </span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {[
            { icon: <CalendarDays className="h-4 w-4 text-slate-400" />, label: "Terminas",         value: fmt(req.dueDate) ?? "—"           },
            { icon: <CreditCard   className="h-4 w-4 text-slate-400" />, label: "Mokėjimo būdas",   value: "Bankinis pavedimas"               },
            { icon: <Hash         className="h-4 w-4 text-slate-400" />, label: "Prašymo ID",        value: `#${req.id.slice(0, 12).toUpperCase()}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3">
              {icon}
              <span className="flex-1 text-sm text-slate-600">{label}</span>
              <span className="text-sm font-medium text-navy">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-navy">Prašymo būsena</p>
        </div>
        <div className="px-4 py-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                  step.status === "done"    && "border-[#00C853] bg-[#00C853]",
                  step.status === "eye"     && "border-[#00C853] bg-[#00C853]",
                  step.status === "waiting" && "border-dashed border-slate-300 bg-white",
                  step.status === "pending" && "border-slate-200 bg-white",
                )}>
                  {step.status === "done"    && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  {step.status === "eye"     && <Eye   className="h-3.5 w-3.5 text-white" />}
                </span>
                {i < steps.length - 1 && (
                  <span className={cn("my-1 w-0.5 flex-1 rounded", step.status === "done" ? "bg-[#00C853]" : "bg-slate-100")} style={{ minHeight: 20 }} />
                )}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy">{step.label}</p>
                  {step.date && <p className="text-xs text-slate-400">{step.date}</p>}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <p className="text-xs text-slate-500">{step.sub}</p>
                  {step.badge && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{step.badge}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mt-3 flex gap-3">
        <button
          type="button"
          onClick={remind}
          disabled={actionLoading}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-navy disabled:opacity-60"
        >
          <Bell className="h-4 w-4" /> Priminti
        </button>
        <button
          type="button"
          onClick={complete}
          disabled={actionLoading || req.status === "completed"}
          className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-[#00C853] py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Pažymėti gavimą
        </button>
      </div>

      {/* QR / link */}
      <div className="mx-4 mt-3 mb-4 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50">
          <QrCode className="h-8 w-8 text-navy" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-navy">Mokėjimo nuoroda</p>
          <p className="mt-0.5 text-xs text-slate-500">Pasidalinkite nuoroda arba QR kodu, kad gavėjas galėtų greitai atlikti mokėjimą.</p>
          <button
            type="button"
            onClick={copyLink}
            className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#00C853]"
          >
            <Link2 className="h-3.5 w-3.5" />
            {copied ? "Nukopijuota!" : "Kopijuoti nuorodą"}
          </button>
        </div>
      </div>
    </div>
  );
}
