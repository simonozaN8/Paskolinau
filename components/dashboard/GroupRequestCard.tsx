"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Euro,
  Handshake,
  Package,
  Receipt,
  Timer,
  Users,
} from "lucide-react";
import type { Scenario } from "@/lib/request-types";
import { SCENARIO_META } from "@/lib/request-types";
import type { ComponentType } from "react";

/* ── types ── */
export type DashRequest = {
  id: string;
  scenario: string;
  groupId: string | null;
  recipientName: string;
  amount: number;
  itemDescription: string | null;
  description: string;
  dueDate: string;
  status: string;
  confirmedAt: string | null;
  paidAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

/* ── helpers ── */
const SCENARIO_ICONS: Record<Scenario, ComponentType<{ className?: string }>> = {
  loan:             Handshake,
  "group-fee":      Users,
  "split-bill":     Receipt,
  "awaiting-share": Timer,
};

export const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  active:    { label: "Laukia",       cls: "bg-blue-50 text-blue-700"        },
  confirmed: { label: "Patvirtinta",  cls: "bg-amber-50 text-amber-700"      },
  paid:      { label: "Sumokėta",     cls: "bg-emerald-50 text-emerald-700"  },
  completed: { label: "Įvykdyta",     cls: "bg-green-100 text-green-800"     },
  cancelled: { label: "Atšauktas",    cls: "bg-slate-100 text-slate-500"     },
};

function isPaid(s: string) { return s === "paid" || s === "completed"; }
function fmt(iso: string)  { return new Date(iso).toLocaleDateString("lt-LT", { month: "short", day: "numeric" }); }

/* ── Group card ── */

type Props = {
  requests: DashRequest[];
  onRefresh: () => void;
};

export function GroupRequestCard({ requests, onRefresh }: Props) {
  const [open, setOpen]       = useState(false);
  const [acting, setActing]   = useState<string | null>(null);

  const first   = requests[0];
  const scenario = first.scenario as Scenario;
  const meta    = SCENARIO_META[scenario] ?? SCENARIO_META.loan;
  const Icon    = SCENARIO_ICONS[scenario] ?? Handshake;

  const total   = requests.length;
  const paidN   = requests.filter((r) => isPaid(r.status)).length;
  const pct     = Math.round((paidN / total) * 100);
  const allDone = paidN === total;
  const totalAmt = requests.reduce((s, r) => s + r.amount, 0);

  /* overall badge */
  const badge = allDone
    ? STATUS_CFG.completed
    : paidN > 0
    ? { label: `${paidN}/${total} apmokėjo`, cls: "bg-amber-50 text-amber-700" }
    : STATUS_CFG.active;

  async function patchStatus(id: string, action: "complete" | "cancel" | "remind") {
    setActing(id + action);
    try {
      await fetch(`/api/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      onRefresh();
    } finally { setActing(null); }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
          <Icon className="h-5 w-5 text-navy" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate font-semibold text-navy">{first.description || meta.label}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
              {badge.label}
            </span>
          </div>

          {/* Stats row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              {totalAmt.toFixed(2)} € iš viso
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {total} {total === 1 ? "narys" : "nariai"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              iki {fmt(first.dueDate)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{paidN}/{total} apmokėjo</span>
              <span className={allDone ? "font-semibold text-[#00C853]" : ""}>{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-[#00C853]" : "bg-[#00C853]/70"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded — member table */}
      {open && (
        <div className="border-t border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                  <th className="px-4 py-2.5 text-left font-medium">Narys</th>
                  <th className="px-3 py-2.5 text-right font-medium">Suma</th>
                  <th className="px-3 py-2.5 text-left font-medium">Statusas</th>
                  <th className="px-3 py-2.5 text-left font-medium">Data</th>
                  <th className="px-3 py-2.5 text-right font-medium">Veiksmas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((r) => {
                  const st = STATUS_CFG[r.status] ?? STATUS_CFG.active;
                  const dateAt = r.completedAt ?? r.paidAt ?? r.confirmedAt;
                  const isActing = acting?.startsWith(r.id);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isPaid(r.status) && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#00C853]" />
                          )}
                          <span className="font-medium text-navy">{r.recipientName}</span>
                        </div>
                        {r.itemDescription && (
                          <p className="mt-0.5 flex items-center gap-1 text-slate-400">
                            <Package className="h-3 w-3" />
                            {r.itemDescription}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-navy">
                        {r.amount > 0 ? `${r.amount.toFixed(2)} €` : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-400">
                        {dateAt ? fmt(dateAt) : "—"}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status === "paid" && (
                            <button
                              type="button"
                              disabled={!!isActing}
                              onClick={() => patchStatus(r.id, "complete")}
                              className="rounded-lg bg-[#00C853]/10 px-2.5 py-1 text-[10px] font-semibold text-[#007a32] transition hover:bg-[#00C853]/20 disabled:opacity-50"
                            >
                              {acting === r.id + "complete" ? "…" : "Patvirtinti ✓"}
                            </button>
                          )}
                          {(r.status === "active" || r.status === "confirmed") && (
                            <button
                              type="button"
                              disabled={!!isActing}
                              onClick={() => patchStatus(r.id, "remind")}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                              <Bell className="h-3 w-3" />
                              {acting === r.id + "remind" ? "…" : "Priminti"}
                            </button>
                          )}
                          {r.status === "completed" && (
                            <span className="text-[10px] text-[#00C853]">✓ Įvykdyta</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Single request card (non-group) ── */

type SingleProps = {
  request: DashRequest;
  onRefresh: () => void;
};

export function SingleRequestCard({ request: r, onRefresh }: SingleProps) {
  const [acting, setActing] = useState(false);
  const st = STATUS_CFG[r.status] ?? STATUS_CFG.active;
  const due = fmt(r.dueDate);

  async function patchStatus(action: "complete" | "cancel" | "remind") {
    setActing(true);
    try {
      await fetch(`/api/requests/${r.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      onRefresh();
    } finally { setActing(false); }
  }

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">{r.recipientName}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {due}
          </span>
          {r.status === "active" && (
            <button
              type="button"
              disabled={acting}
              onClick={() => patchStatus("remind")}
              className="inline-flex items-center gap-0.5 text-slate-400 transition hover:text-navy disabled:opacity-40"
            >
              <Bell className="h-3 w-3" />
              Priminti
            </button>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {r.itemDescription ? (
          <span className="flex max-w-[90px] items-center gap-1 truncate text-xs font-semibold text-navy">
            <Package className="h-3 w-3 shrink-0 text-slate-400" />
            {r.itemDescription}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm font-semibold text-navy">
            <Euro className="h-3.5 w-3.5" />
            {r.amount.toFixed(2)}
          </span>
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.cls}`}>
          {st.label}
        </span>
        {r.status === "paid" && (
          <button
            type="button"
            disabled={acting}
            onClick={() => patchStatus("complete")}
            className="rounded-lg bg-[#00C853]/10 px-2 py-0.5 text-[10px] font-semibold text-[#007a32] hover:bg-[#00C853]/20"
          >
            {acting ? "…" : "✓"}
          </button>
        )}
      </div>
    </li>
  );
}
