"use client";

import { ArrowRight, Play, RefreshCw, Shield, Bell } from "lucide-react";
import { BrowserFrame } from "@/components/mockups/BrowserFrame";
import { PaymentRequestHeroMockup } from "@/components/mockups/PaymentRequestHeroMockup";
import { CreateRequestButton } from "@/components/ui/CreateRequestButton";

export function HeroSection() {
  function scrollToDemo() {
    document.getElementById("kaip-veikia")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="border-b border-slate-100 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
            Sukurk. Išsiųsk.{" "}
            <span className="text-[#00C853]">Sistema pasirūpins.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            Sukurk mokėjimo prašymą keliais paspaudimais, išsiųsk jį draugui ar
            klientui, o sistema automatiškai primins, seks statusą ir padės
            išvengti neaiškumų.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Viskas vienoje vietoje: nuo priminimų iki aiškios istorijos ir
            dokumentų.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CreateRequestButton className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-deep">
              Sukurti prašymą
              <ArrowRight className="h-4 w-4" />
            </CreateRequestButton>
            <button
              type="button"
              onClick={scrollToDemo}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-navy bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/20">
                <Play className="h-3.5 w-3.5 fill-navy text-navy" />
              </span>
              Peržiūrėti demo
            </button>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 border-t border-slate-200/80 pt-8">
            {[
              { Icon: Shield, label: "Patikima" },
              { Icon: Bell, label: "Primena" },
              { Icon: RefreshCw, label: "Padeda grąžinti" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                  <Icon className="h-4 w-4 text-[#00C853]" />
                </span>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <BrowserFrame>
            <PaymentRequestHeroMockup />
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
