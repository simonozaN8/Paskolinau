"use client";

import { MailCheck, X } from "lucide-react";

export function UnverifiedEmailModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Uždaryti"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy"
          aria-label="Uždaryti"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <MailCheck className="h-7 w-7 text-amber-500" />
          </span>
          <h2 className="text-lg font-bold text-navy">El. paštas nepatvirtintas</h2>
          <p className="text-sm text-slate-600">
            Patvirtinkite el. paštą, kad galėtumėte kurti prašymus.
          </p>
          <p className="text-xs text-slate-400">
            Patikrinkite savo pašto dėžutę – išsiuntėme patvirtinimo kodą registracijos metu.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
        >
          Supratau
        </button>
      </div>
    </div>
  );
}
