"use client";

import { Check } from "lucide-react";
import { useAppEntryAction } from "@/lib/use-app-entry";

const plans = [
  {
    name: "Free",
    price: "0 €",
    period: "/ mėn.",
    desc: "Puikiai tinka pradžiai.",
    features: [
      "1 aktyvus prašymas",
      "El. pašto priminimai",
      "Pagrindinė istorija",
    ],
    cta: "Pradėti nemokamai",
    featured: false,
  },
  {
    name: "Plus",
    price: "4,99 €",
    period: "/ mėn.",
    desc: "Daugumai naudotojų.",
    badge: "POPULIARIAUSIA",
    features: [
      "Iki 5 aktyvių prašymų",
      "SMS ir el. paštas",
      "Grupės rinkliavos",
      "Išplėstinė istorija",
    ],
    cta: "Pradėti 7 d. nemokamai",
    featured: true,
  },
  {
    name: "Team",
    price: "9,99 €",
    period: "/ mėn.",
    desc: "Komandoms ir organizacijoms.",
    features: [
      "Neriboti prašymai",
      "Komandos nariai",
      "Vaidmenys ir teisės",
      "Prioritetinė pagalba",
    ],
    cta: "Išbandyti",
    featured: false,
  },
];

function PlanCard({
  plan,
}: {
  plan: (typeof plans)[number];
}) {
  const { handleEntry, isLoggedIn, pending } = useAppEntryAction();

  return (
    <div
        className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
          plan.featured
            ? "border-[#00C853]/40 shadow-md shadow-emerald-100/50 ring-2 ring-[#00C853]/20"
            : "border-slate-200"
        }`}
      >
        {plan.badge && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00C853] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {plan.badge}
          </span>
        )}
        <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-navy">{plan.price}</span>
          <span className="text-slate-500">{plan.period}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">{plan.desc}</p>
        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00C853]" />
              {f}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleEntry}
          disabled={pending}
          className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:opacity-60 ${
            plan.featured
              ? "bg-navy text-white hover:bg-navy-deep"
              : "border-2 border-navy bg-white text-navy hover:bg-slate-50"
          }`}
        >
          {isLoggedIn ? "Sukurti prašymą" : plan.cta}
        </button>
    </div>
  );
}

export function PricingTeaserSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">Kainos</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.name} plan={p} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          7 dienų nemokamas bandomasis laikotarpis. Atsisakyk bet kada.
        </p>
      </div>
    </section>
  );
}
