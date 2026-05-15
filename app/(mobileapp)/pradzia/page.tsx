"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  FileText,
  Gift,
  Home,
  Package,
  Plane,
  Plus,
  ShoppingCart,
  UserPlus,
  PieChart,
  Users,
  Check,
} from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import type { DashRequest } from "@/components/dashboard/GroupRequestCard";

const STATUS_LABELS: Record<string, string> = {
  active: "Laukia",
  confirmed: "Patvirtinta",
  paid: "Sumokėta",
  completed: "Apmokėta",
  cancelled: "Atšaukta",
  reminded: "Priminta",
};
const STATUS_COLORS: Record<string, string> = {
  active:    "bg-blue-50 text-blue-700",
  confirmed: "bg-blue-50 text-blue-700",
  paid:      "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
  reminded:  "bg-orange-50 text-orange-700",
};

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  loan:            <ShoppingCart className="h-5 w-5 text-[#00C853]" />,
  "group-fee":     <Users className="h-5 w-5 text-[#00C853]" />,
  "split-bill":    <PieChart className="h-5 w-5 text-[#00C853]" />,
  "awaiting-share":<Gift className="h-5 w-5 text-[#00C853]" />,
};

const QUICK_ACTIONS = [
  { label: "Paskolinau", Icon: UserPlus, href: "/prasymas/naujas?scenario=loan" },
  { label: "Padalinau",  Icon: PieChart, href: "/prasymas/naujas?scenario=split-bill" },
  { label: "Surenku",    Icon: Users,    href: "/prasymas/naujas?scenario=group-fee" },
  { label: "Apmokėjau",  Icon: Bell,     href: "/prasymas/naujas?scenario=awaiting-share" },
] as const;

export default function PradziaPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DashRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const name = user?.firstName ?? "Vartotojau";
  const active    = requests.filter((r) => ["active", "confirmed"].includes(r.status)).length;
  const paid      = requests.filter((r) => ["paid", "completed"].includes(r.status)).length;
  const reminded  = requests.filter((r) => r.status === "reminded").length;
  const recent    = requests.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="logo" />

      {/* Greeting */}
      <div className="px-4 pt-1 pb-5">
        <h1 className="text-2xl font-bold text-navy">
          Labas, {name}! 👋
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Sukurk. Išsiųsk. Sistema pasirūpins.</p>
      </div>

      {/* Quick action grid */}
      <div className="grid grid-cols-4 gap-3 px-4 pb-5">
        {QUICK_ACTIONS.map(({ label, Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Icon className="h-6 w-6 text-navy" strokeWidth={1.8} />
            </span>
            <span className="text-[11px] font-medium text-navy">{label}</span>
          </Link>
        ))}
      </div>

      {/* CTA button */}
      <div className="px-4 pb-5">
        <Link
          href="/prasymas/naujas"
          className="flex w-full items-center justify-between rounded-2xl bg-navy px-5 py-4 text-sm font-semibold text-white shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Plus className="h-4 w-4" />
            </span>
            Naujas prašymas
          </div>
          <ChevronRight className="h-5 w-5 opacity-70" />
        </Link>
      </div>

      {/* Recent requests */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy">Naujausi prašymai</h2>
          <Link href="/istorija" className="flex items-center gap-0.5 text-xs font-semibold text-[#00C853]">
            Žiūrėti visus <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-slate-100 px-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#00C853] border-t-transparent" />
          </div>
        ) : recent.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-200" />
            Dar nėra prašymų
          </div>
        ) : (
          recent.map((req) => (
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
                  {req.dueDate ? new Date(req.dueDate).toLocaleDateString("lt-LT") : "—"}
                  {req.groupId ? " • Grupė" : ""}
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
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mx-4 mt-5 mb-2 grid grid-cols-3 divide-x divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {[
          { icon: <FileText className="h-5 w-5 text-navy" />, value: loading ? "…" : active,   label: "Aktyvūs prašymai"  },
          { icon: <Check    className="h-5 w-5 text-[#00C853]" />, value: loading ? "…" : paid, label: "Apmokėti prašymai" },
          { icon: <Bell     className="h-5 w-5 text-amber-500" />, value: loading ? "…" : reminded, label: "Primintina"   },
        ].map(({ icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-4">
            {icon}
            <span className="text-xl font-bold text-navy">{value}</span>
            <span className="text-center text-[10px] text-slate-500 leading-tight px-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
