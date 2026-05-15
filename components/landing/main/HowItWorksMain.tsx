import {
  BellRing,
  CheckCircle2,
  FileText,
  Send,
} from "lucide-react";

const steps = [
  {
    n: 1,
    title: "1. Sukuri",
    text: "Įvedi sumą, terminą ir kontaktą – prašymas sugeneruojamas automatiškai.",
    Icon: FileText,
  },
  {
    n: 2,
    title: "2. Išsiųsti",
    text: "Nusiunči nuorodą el. paštu ar žinute – skolininkas mato aiškią informaciją.",
    Icon: Send,
  },
  {
    n: 3,
    title: "3. Primename",
    text: "Sistema siunčia priminimus pagal tavo nustatytą grafiką.",
    Icon: BellRing,
  },
  {
    n: 4,
    title: "4. Uždarai",
    text: "Pažymi apmokėjimą, eksportuoji istoriją ar dokumentą.",
    Icon: CheckCircle2,
  },
];

function Arrow() {
  return (
    <div className="hidden items-center justify-center lg:flex lg:w-10">
      <div className="h-px w-full border-t-2 border-dashed border-slate-300" />
      <span className="text-slate-400">→</span>
    </div>
  );
}

export function HowItWorksMain() {
  return (
    <section id="kaip-veikia" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          Kaip tai veikia
        </h2>
        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
          {steps.map((s, i) => (
            <div key={s.n} className="contents lg:flex lg:flex-1 lg:items-stretch">
              <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00C853] text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <s.Icon className="h-10 w-10 text-[#00C853]" strokeWidth={1.25} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
              {i < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
