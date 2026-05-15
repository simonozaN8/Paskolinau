"use client";

import { Handshake, Receipt, Timer, Users, X } from "lucide-react";
import type { Scenario } from "@/lib/request-types";
import { SCENARIO_META } from "@/lib/request-types";
import type { ComponentType } from "react";

const SCENARIO_ICONS: Record<Scenario, ComponentType<{ className?: string }>> = {
  loan:            Handshake,
  "group-fee":     Users,
  "split-bill":    Receipt,
  "awaiting-share": Timer,
};

const SCENARIOS: Scenario[] = ["loan", "group-fee", "split-bill", "awaiting-share"];

type Props = {
  onSelect: (s: Scenario) => void;
  onClose: () => void;
};

export function ScenarioModal({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">

        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-navy">Koks prašymo tipas?</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pasirinkite scenarijų – forma prisitaikys automatiškai.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Uždaryti"
            className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <ul className="divide-y divide-slate-100">
          {SCENARIOS.map((s) => {
            const m = SCENARIO_META[s];
            const Icon = SCENARIO_ICONS[s];
            return (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => onSelect(s)}
                  className="group flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50 active:bg-slate-100"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition group-hover:border-[#00C853]/30 group-hover:bg-[#00C853]/5">
                    <Icon className="h-5 w-5 text-navy transition group-hover:text-[#00C853]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{m.label}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">{m.sublabel}</p>
                  </div>
                  <svg className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
