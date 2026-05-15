"use client";

import {
  ArrowRight,
  Bell,
  Check,
  FileText,
  Play,
  QrCode,
  Send,
  Shield,
  History,
  Users,
  Cloud,
  Lock,
  BadgeCheck,
} from "lucide-react";
import { BrowserFrame } from "@/components/mockups/BrowserFrame";
import { PaymentRequestHeroMockup } from "@/components/mockups/PaymentRequestHeroMockup";
import { FlowDiagram } from "@/components/landing/howitworks/FlowDiagram";
import { CreateRequestButton } from "@/components/ui/CreateRequestButton";

const steps = [
  {
    n: 1,
    Icon: FileText,
    title: "Sukuri prašymą",
    text: "Įvedi sumą, terminą ir kontaktą. Sukuri aiškų, profesionalų prašymą.",
  },
  {
    n: 2,
    Icon: Send,
    title: "Išsiunti nuorodą",
    text: "Pasidalini nuoroda – skolininkas mato viską, ko reikia.",
  },
  {
    n: 3,
    Icon: Bell,
    title: "Gauni priminimus",
    text: "Sistema seka terminus ir primena automatiškai.",
  },
  {
    n: 4,
    Icon: Check,
    title: "Uždarai ciklą",
    text: "Pažymi apmokėjimą ir išsaugai istoriją.",
  },
];

const features = [
  {
    Icon: QrCode,
    title: "QR patvirtinimai",
    text: "Greitas patvirtinimas telefonu.",
    benefit: "Mažiau klaidų, daugiau patikimumo",
  },
  {
    Icon: Send,
    title: "SMS / el. paštas",
    text: "Priminimai automatiškai per pasirinktą kanalą.",
    benefit: "Didesnis pasiekiamumas",
  },
  {
    Icon: Users,
    title: "Grupės rinkliavos",
    text: "Surink mokesčius komandai ar renginiui.",
    benefit: "Vienoje vietoje",
  },
  {
    Icon: BadgeCheck,
    title: "Mokėjimo statusai",
    text: "Aktyvus, priimta, uždaryta – aiškiai matoma.",
    benefit: "Mažiau chaosas",
  },
  {
    Icon: History,
    title: "Istorija ir ataskaitos",
    text: "Peržiūra ir eksportas bet kuriuo metu.",
    benefit: "Skaidrumas",
  },
  {
    Icon: FileText,
    title: "Dokumentų generavimas",
    text: "Paruoškite įrašus ir eksportą spaudžiant mygtuką.",
    benefit: "Sutaupo laiką",
  },
];

const process = [
  { Icon: FileText, title: "1. Sukuri prašymą", sub: "Įvedi duomenis" },
  { Icon: Send, title: "2. Išsiunti", sub: "Nuoroda aktyvi" },
  { Icon: Bell, title: "3. Priminimas", sub: "Automatinis" },
  { Icon: Check, title: "4. Patvirtinimas", sub: "QR ar ranka" },
  { Icon: BadgeCheck, title: "5. Statusas", sub: "Matomas visiems" },
  { Icon: History, title: "6. Archyvas", sub: "Istorija saugoma" },
];

export function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Kaip veikia Paskolinau.lt
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Keturi paprasti žingsniai: sukuri prašymą, išsiunti nuorodą, sistema
              primena, o tu pažymi apmokėjimą. Viskas skaidru ir be papildomų
              įrankių.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CreateRequestButton className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-deep">
                Sukurti prašymą
                <ArrowRight className="h-4 w-4" />
              </CreateRequestButton>
              <button
                type="button"
                onClick={() => document.getElementById("zingsniai")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-navy bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/20">
                  <Play className="h-3.5 w-3.5 fill-navy text-navy" />
                </span>
                Peržiūrėti demo
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {["Sutaupo laiką", "Mažiau pamiršimų", "Aiški tvarka"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Check className="h-4 w-4 text-[#00C853]" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 lg:mt-0">
            <FlowDiagram />
          </div>
        </div>
      </section>

      <section id="zingsniai" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
            4 paprasti žingsniai
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00C853] text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <s.Icon className="h-10 w-10 text-[#00C853]" strokeWidth={1.25} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
            Paskolinau.lt funkcijos
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/40 p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <f.Icon className="h-6 w-6 text-[#00C853]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{f.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{f.text}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-200/80 pt-4 text-sm font-medium text-emerald-800">
                  <Check className="h-4 w-4 text-[#00C853]" />
                  {f.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            Visas procesas – nuo prašymo iki apmokėjimo
          </h2>
          <div className="mt-12 flex items-start gap-2 overflow-x-auto pb-2 lg:justify-between">
            {process.map((p, i) => (
              <div key={p.title} className="flex items-start">
                <div className="flex w-[100px] shrink-0 flex-col items-center text-center sm:w-[120px]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                    <p.Icon className="h-6 w-6 text-[#00C853]" />
                  </span>
                  <p className="mt-3 text-[11px] font-bold leading-snug text-navy sm:text-xs">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">{p.sub}</p>
                </div>
                {i < process.length - 1 && (
                  <div
                    className="mx-1 mt-6 hidden h-0 w-6 shrink-0 border-t-2 border-dashed border-slate-300 sm:block lg:w-10"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
            Sukurta patogiam naudojimui
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <BrowserFrame>
              <div className="p-3">
                <PaymentRequestHeroMockup />
              </div>
            </BrowserFrame>
            <BrowserFrame>
              <div className="p-4">
                <WhyWorthSectionTableOnly />
              </div>
            </BrowserFrame>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Shield, t: "Saugūs duomenys" },
              { Icon: Lock, t: "Privatumas" },
              { Icon: BadgeCheck, t: "Patikima sistema" },
              { Icon: Cloud, t: "Atsarginės kopijos" },
            ].map(({ Icon, t }) => (
              <div
                key={t}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
              >
                <Icon className="h-6 w-6 text-[#00C853]" />
                <span className="text-sm font-semibold text-navy">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:justify-between lg:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Bell className="h-9 w-9 text-[#00C853]" />
            </div>
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">Paruošta išbandyti?</h2>
              <p className="mt-3 text-slate-600">
                Sukurk pirmą prašymą per kelias minutes ir pamatyk, kaip veikia
                priminimai bei statusai.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <CreateRequestButton className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-deep">
                Sukurti nemokamai
                <ArrowRight className="h-4 w-4" />
              </CreateRequestButton>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-navy bg-white px-6 py-3.5 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                <Play className="h-4 w-4" />
                Peržiūrėti demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function WhyWorthSectionTableOnly() {
  const rows = [
    ["Komandos nuoma", "Tomas", "120 €", "Geg 18", "Aktyvus", "active"],
    ["Padalinom sąsk.", "Rūta", "45 €", "Geg 20", "Priimta", "blue"],
    ["Kliento sąskaita", "Marius", "300 €", "Geg 22", "Aktyvus", "active"],
    ["Senas prašymas", "Ona", "15 €", "Bal 02", "Uždaryta", "closed"],
  ];
  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-800",
    blue: "bg-sky-50 text-sky-800",
    closed: "bg-slate-100 text-slate-600",
  };
  return (
    <div>
      <p className="text-sm font-bold text-navy">Visi prašymai</p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[360px] text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-3 py-2 font-medium">Pavadinimas</th>
              <th className="px-3 py-2 font-medium">Autorius</th>
              <th className="px-3 py-2 font-medium">Suma</th>
              <th className="px-3 py-2 font-medium">Terminas</th>
              <th className="px-3 py-2 font-medium">Statusas</th>
            </tr>
          </thead>
          <tbody className="text-navy">
            {rows.map(([a, b, c, d, label, k]) => (
              <tr key={a} className="border-t border-slate-100">
                <td className="px-3 py-2.5 font-medium">{a}</td>
                <td className="px-3 py-2.5 text-slate-600">{b}</td>
                <td className="px-3 py-2.5">{c}</td>
                <td className="px-3 py-2.5 text-slate-600">{d}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[k]}`}
                  >
                    {label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
