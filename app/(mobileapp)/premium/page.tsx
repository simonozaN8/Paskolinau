"use client";

import { Check, FileText, Rocket, RotateCcw, Shield } from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";

const FEATURES = [
  "Automatiniai priminimai",
  "Grupės ir bendri rinkiniai",
  "Mokėjimų istorija",
  "PDF dokumentai",
  "Prioritetinis palaikymas",
];

const PLANS = [
  {
    id: "free", name: "Free", price: "0 €", period: "", note: "Visada nemokamai",
    features: [true, false, true, false, false],
    cta: "Dabartinis planas", ctaVariant: "outline", featured: false,
  },
  {
    id: "plus", name: "Plus", price: "4,99 €", period: "/mėn.", note: "Daugiau galimybių tau",
    features: [true, true, true, true, false],
    cta: "Pasirinkti Plus", ctaVariant: "navy", featured: true,
  },
  {
    id: "team", name: "Team", price: "9,99 €", period: "/mėn.", note: "Komandoms ir šeimoms",
    features: [true, true, true, true, true],
    cta: "Pasirinkti Team", ctaVariant: "outline", featured: false,
  },
] as const;

const DOCS = [
  { icon: <FileText className="h-6 w-6 text-red-500" />, label: "Skolos įrašas PDF", bg: "bg-red-50"    },
  { icon: <FileText className="h-6 w-6 text-blue-500" />, label: "Skolos raštelis",  bg: "bg-blue-50"   },
  { icon: <Shield   className="h-6 w-6 text-navy" />,     label: "Paskolos sutartis",bg: "bg-slate-50"  },
  { icon: <FileText className="h-6 w-6 text-green-500" />,label: "Mokėjimo grafikas",bg: "bg-green-50"  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="logo" />

      <div className="px-4 pb-2">
        <h1 className="text-2xl font-bold text-navy">Premium planai</h1>
        <p className="mt-1 text-sm text-slate-500">Pasirink planą, kuris geriausiai tinka tau.</p>
      </div>

      {/* Plans */}
      <div className="mt-4 grid grid-cols-3 gap-2 px-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border p-3",
              plan.featured ? "border-[#00C853] shadow-md" : "border-slate-200",
            )}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00C853] px-2 py-0.5 text-[10px] font-bold text-white">
                Populiariausias
              </span>
            )}
            <p className="text-sm font-bold text-navy">{plan.name}</p>
            <p className="mt-1 text-base font-bold text-navy">
              {plan.price}<span className="text-xs font-normal text-slate-500">{plan.period}</span>
            </p>
            <p className="mt-1 text-[10px] text-slate-500 leading-tight">{plan.note}</p>
            <ul className="mt-3 space-y-1.5">
              {FEATURES.map((f, i) => (
                <li key={f} className="flex items-start gap-1">
                  <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", plan.features[i] ? "text-[#00C853]" : "text-slate-200")} strokeWidth={3} />
                  <span className={cn("text-[10px] leading-tight", plan.features[i] ? "text-slate-700" : "text-slate-300")}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={cn(
                "mt-4 w-full rounded-xl py-2 text-[11px] font-semibold transition",
                plan.ctaVariant === "navy"
                  ? "bg-navy text-white"
                  : "border border-slate-200 text-navy",
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mx-4 mt-5 grid grid-cols-2 gap-3">
        {[
          { icon: <Shield   className="h-5 w-5 text-[#00C853]" />, title: "Saugus ir patikimas",  sub: "Jūsų duomenys apsaugoti."   },
          { icon: <RotateCcw className="h-5 w-5 text-[#00C853]" />, title: "Atsisakyk bet kada", sub: "Jokių įsipareigojimų."       },
        ].map(({ icon, title, sub }) => (
          <div key={title} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            {icon}
            <div>
              <p className="text-xs font-semibold text-navy">{title}</p>
              <p className="text-[11px] text-slate-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Premium documents */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-navy">Premium dokumentai</h2>
        <p className="mt-0.5 text-sm text-slate-500">Kurkite, eksportuokite ir siųskite svarbius dokumentus.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {DOCS.map(({ icon, label, bg }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", bg)}>
                {icon}
              </span>
              <p className="text-center text-xs font-semibold text-navy leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pt-5 pb-2">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-4 text-sm font-semibold text-white shadow-sm"
        >
          <Rocket className="h-5 w-5" />
          Pradėti 7 d. nemokamai
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">
          Po 7 dienų bus taikomas pasirinkto plano mokestis.
        </p>
      </div>
    </div>
  );
}
