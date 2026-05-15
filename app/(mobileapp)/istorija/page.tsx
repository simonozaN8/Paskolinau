"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Gift, PieChart, ShoppingCart, Users } from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";
import type { DashRequest } from "@/components/dashboard/GroupRequestCard";

const STATUS_LABELS: Record<string, string> = {
  active: "Laukia", confirmed: "Patvirtinta", paid: "Sumokėta",
  completed: "Apmokėta", cancelled: "Atšaukta", reminded: "Priminta",
};
const STATUS_COLORS: Record<string, string> = {
  active: "bg-blue-50 text-blue-700", confirmed: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700", completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500", reminded: "bg-orange-50 text-orange-700",
};
const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  loan:            <ShoppingCart className="h-5 w-5 text-[#00C853]" />,
  "group-fee":     <Users className="h-5 w-5 text-[#00C853]" />,
  "split-bill":    <PieChart className="h-5 w-5 text-[#00C853]" />,
  "awaiting-share":<Gift className="h-5 w-5 text-[#00C853]" />,
};

const TABS = ["Visi", "Aktyvūs", "Apmokėti", "Atšaukti"] as const;
type Tab = typeof TABS[number];

export default function IsториjaPage() {
  const [requests, setRequests] = useState<DashRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab] = useState<Tab>("Visi");

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = requests.filter((r) => {
    if (tab === "Aktyvūs")  return ["active", "confirmed", "reminded"].includes(r.status);
    if (tab === "Apmokėti") return ["paid", "completed"].includes(r.status);
    if (tab === "Atšaukti") return r.status === "cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="logo" />

      <div className="px-4 pb-3">
        <h1 className="text-xl font-bold text-navy">Istorija</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition",
              tab === t ? "bg-navy text-white" : "border border-slate-200 text-slate-600",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#00C853] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <FileText className="mb-3 h-12 w-12 text-slate-200" />
          <p className="text-sm text-slate-400">Prašymų nerasta</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 px-4">
          {filtered.map((req) => (
            <Link
              key={req.id}
              href={`/prasymas/${req.id}`}
              className="flex items-center gap-3 py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50">
                {SCENARIO_ICONS[req.scenario] ?? <FileText className="h-5 w-5 text-slate-400" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-navy">
                  {req.itemDescription ?? req.description}
                </p>
                <p className="text-xs text-slate-400">
                  {req.recipientName}
                  {" · "}
                  {req.dueDate ? new Date(req.dueDate).toLocaleDateString("lt-LT") : "—"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-navy">
                  {Number(req.amount).toFixed(2).replace(".", ",")} €
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", STATUS_COLORS[req.status] ?? STATUS_COLORS.active)}>
                  {STATUS_LABELS[req.status] ?? "Laukia"}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
