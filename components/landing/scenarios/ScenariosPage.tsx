"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Briefcase,
  Check,
  ExternalLink,
  Gift,
  Medal,
  Play,
  Shield,
  Trophy,
  User,
  Users,
  Utensils,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateRequestButton } from "@/components/ui/CreateRequestButton";

const tabs = [
  {
    id: "paskolinau",
    title: "Paskolinau",
    sub: "Paskolinau draugui",
    Icon: User,
  },
  {
    id: "padalinau",
    title: "Padalinau",
    sub: "Padalinau bendras išlaidas",
    Icon: Users,
  },
  {
    id: "surenk",
    title: "Surenku",
    sub: "Surenku komandos ar grupės mokestį",
    Icon: Users,
  },
  {
    id: "primenu",
    title: "Primenu",
    sub: "Primenu apie mokėjimą",
    Icon: Bell,
  },
] as const;

const blocks = [
  {
    id: "paskolinau",
    title: "Paskolinau draugui",
    bullets: [
      "Aiškiai nurodyta suma ir terminas",
      "Automatiniai priminimai pagal grafiką",
      "Statusas matomas abiem pusėms",
    ],
    cta: "Sukurti prašymą",
  },
  {
    id: "padalinau",
    title: "Padalinau bendras išlaidas",
    bullets: [
      "Kiekvienas mato savo dalį",
      "Vienas bendras priminimas",
      "Mažiau tarpininkavimo žinutėmis",
    ],
    cta: "Padalinti išlaidas",
  },
  {
    id: "surenk",
    title: "Surenku komandos ar grupės mokestį",
    bullets: [
      "Progresas ir tikslinė suma",
      "Narių statusai vienoje lentelėje",
      "Paruošti šablonai rinkliavai",
    ],
    cta: "Sukurti rinkliavą",
  },
  {
    id: "primenu",
    title: "Primenu apie mokėjimą",
    bullets: [
      "Pasikartojantys priminimai",
      "Pasirinktas kanalas: el. paštas / SMS",
      "Mažiau pamirštų sąskaitų",
    ],
    cta: "Nustatyti priminimus",
  },
] as const;

const examples = [
  { Icon: Trophy, title: "Krepšinio salė", text: "Salės nuoma komandai – surink mokestį iš narių.", link: "Sukurti rinkliavą" },
  { Icon: Gift, title: "Dovana", text: "Bendra dovana – padalink sumą draugų grupėje.", link: "Padalinti išlaidas" },
  { Icon: Briefcase, title: "Kelionė", text: "Bendros kelionės išlaidos ir aiškios dalys.", link: "Sukurti prašymą" },
  { Icon: Utensils, title: "Vakarienė", text: "Restorano sąskaita keliems žmonėms.", link: "Padalinti išlaidas" },
  { Icon: Medal, title: "Turnyras", text: "Startinis mokestis ir registracijos rinkliava.", link: "Sukurti rinkliavą" },
];

export function ScenariosPage() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("paskolinau");

  return (
    <>
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-20">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Viena sistema – keli{" "}
              <span className="text-[#00C853]">naudojimo scenarijai</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Nesvarbu, ar paskolinai draugui, padalinote išlaidas ar renkate komandos
              mokestį – viską valdykite vienoje vietoje su aiškiais statusais ir
              priminimais.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CreateRequestButton className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-deep">
                Sukurti prašymą
                <ArrowRight className="h-4 w-4" />
              </CreateRequestButton>
              <button
                type="button"
                onClick={() => document.getElementById("scenarijai")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/15">
                  <Play className="h-3.5 w-3.5 fill-navy text-navy" />
                </span>
                Peržiūrėti demo
              </button>
            </div>
          </div>
          <div className="relative mt-12 flex justify-center lg:mt-0">
            <div className="relative flex h-[280px] w-[280px] items-center justify-center rounded-full border-2 border-dashed border-slate-200 bg-slate-50/50 sm:h-[320px] sm:w-[320px]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-navy shadow-xl ring-4 ring-[#00C853]/30">
                <Bell className="h-12 w-12 text-[#00C853]" />
                <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#00C853] text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              </div>
              {[
                { Icon: User, pos: "left-2 top-10" },
                { Icon: ArrowUpRight, pos: "right-4 top-12" },
                { Icon: RefreshCw, pos: "bottom-14 left-6" },
                { Icon: Bell, pos: "bottom-10 right-8" },
              ].map(({ Icon, pos }, i) => (
                <span
                  key={i}
                  className={cn(
                    "absolute flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm",
                    pos,
                  )}
                >
                  <Icon className="h-5 w-5 text-navy" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="scenarijai" className="scroll-mt-20 border-b border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tabs.map((t) => {
              const isOn = active === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "flex flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition",
                    isOn
                      ? "border-navy ring-2 ring-navy/10"
                      : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  <t.Icon className="h-7 w-7 text-[#00C853]" />
                  <span className="mt-3 text-base font-bold text-navy">{t.title}</span>
                  <span className="mt-1 text-xs text-slate-600">{t.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-emerald-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              {blocks.map((b, idx) => {
                const on = active === b.id;
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "rounded-2xl border bg-white/90 p-6 shadow-sm backdrop-blur",
                      on ? "border-navy/20 ring-1 ring-navy/10" : "border-emerald-100/80",
                    )}
                  >
                    <div className="flex gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-6 w-6 text-slate-500" />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00C853] text-xs font-bold text-white">
                            {idx + 1}
                          </span>
                          <h3 className="text-lg font-bold text-navy">{b.title}</h3>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {b.bullets.map((x) => (
                            <li key={x} className="flex items-start gap-2 text-sm text-slate-600">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00C853]" />
                              {x}
                            </li>
                          ))}
                        </ul>
                        <CreateRequestButton className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-navy bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-50">
                          {b.cta}
                          <ArrowRight className="h-4 w-4" />
                        </CreateRequestButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00C853]">
                Akcentas
              </p>
              <h2 className="mt-2 text-2xl font-bold text-navy">Grupės rinkliavos</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#00C853]" />
                    <span className="font-semibold text-navy">Krepšinio salės nuoma</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    Aktyvus
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 p-4 text-center text-xs sm:text-sm">
                  <div>
                    <p className="font-bold text-navy">240,00 €</p>
                    <p className="text-slate-500">Tikslinė suma</p>
                  </div>
                  <div>
                    <p className="font-bold text-navy">180,00 €</p>
                    <p className="text-slate-500">Surinkta</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#00C853]">75%</p>
                    <p className="text-slate-500">Progresas</p>
                  </div>
                </div>
                <div className="px-4 pt-3">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-3/4 rounded-full bg-[#00C853]" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-navy">Nariai (8)</p>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[400px] text-left text-xs">
                      <thead>
                        <tr className="text-slate-500">
                          <th className="pb-2 font-medium">Narys</th>
                          <th className="pb-2 font-medium">Suma</th>
                          <th className="pb-2 font-medium">Statusas</th>
                          <th className="pb-2 font-medium">Mokėta</th>
                        </tr>
                      </thead>
                      <tbody className="text-navy">
                        {[
                          ["Jonas P.", "30 €", "Sumokėta", "✓ Geg 05", "ok"],
                          ["Mantas K.", "30 €", "Laukia", "—", "wait"],
                          ["Rūta S.", "30 €", "Priminta", "—", "warn"],
                          ["Tomas L.", "30 €", "Nepatvirtinta", "—", "gray"],
                        ].map(([n, s, st, d, k]) => (
                          <tr key={n} className="border-t border-slate-100">
                            <td className="py-2 font-medium">{n}</td>
                            <td className="py-2">{s}</td>
                            <td className="py-2">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                  k === "ok" && "bg-emerald-50 text-emerald-800",
                                  k === "wait" && "bg-sky-50 text-sky-800",
                                  k === "warn" && "bg-amber-50 text-amber-800",
                                  k === "gray" && "bg-slate-100 text-slate-600",
                                )}
                              >
                                {st}
                              </span>
                            </td>
                            <td className="py-2 text-slate-600">{d}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="space-y-3 border-t border-slate-100 p-4">
                  <CreateRequestButton className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-deep">
                    Sukurti grupės rinkliavą
                    <ArrowRight className="h-4 w-4" />
                  </CreateRequestButton>
                  <button
                    type="button"
                    onClick={() => document.getElementById("pavyzdziai")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#00C853] hover:underline"
                  >
                    Peržiūrėti pavyzdį
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pavyzdziai" className="scroll-mt-20 border-b border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy">
            Pavyzdžiai, kada{" "}
            <span className="text-[#00C853]">Paskolinau.lt</span> praverčia
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {examples.map((e) => (
              <div
                key={e.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm"
              >
                <e.Icon className="h-8 w-8 text-[#00C853]" />
                <h3 className="mt-4 font-bold text-navy">{e.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{e.text}</p>
                <CreateRequestButton className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline">
                  {e.link}
                  <ArrowRight className="h-3.5 w-3.5" />
                </CreateRequestButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/90 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="flex gap-4">
              <Shield className="h-10 w-10 shrink-0 text-[#00C853]" />
              <div>
                <p className="text-lg font-bold text-navy">Saugu. Patogu. Automatizuota.</p>
                <p className="mt-1 text-sm text-slate-600">
                  Duomenys saugomi ir valdomi pagal gerąją praktiką – mažiau streso,
                  daugiau aiškumo.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CreateRequestButton className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep">
                Sukurti prašymą
                <ArrowRight className="h-4 w-4" />
              </CreateRequestButton>
              <button
                type="button"
                onClick={() => document.getElementById("scenarijai")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#00C853] hover:underline"
              >
                Daugiau apie funkcijas
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
