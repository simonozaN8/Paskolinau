import {
  Bell,
  CheckCircle2,
  FileText,
  Send,
} from "lucide-react";

const cards = [
  {
    step: 1,
    title: "Sukurti prašymą",
    extra: "120,00 €",
    Icon: FileText,
  },
  { step: 2, title: "Išsiųsti", Icon: Send },
  { step: 3, title: "Sistema primena", Icon: Bell },
  { step: 4, title: "Pažymi kaip apmokėta", Icon: CheckCircle2 },
];

export function FlowDiagram() {
  return (
    <div className="relative mx-auto max-w-xl py-8 lg:max-w-none">
      <div className="relative mx-auto flex h-[min(520px,85vw)] w-[min(520px,85vw)] items-center justify-center rounded-full border-2 border-dashed border-slate-200 bg-white/50 lg:h-[440px] lg:w-[440px]">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-4 ring-[#00C853]/20">
          <Bell className="h-14 w-14 text-[#00C853]" />
        </div>
        {cards.map((c, i) => {
          const angle = (i / 4) * 2 * Math.PI - Math.PI / 2;
          const r = 42;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return (
            <div
              key={c.step}
              className="absolute w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[220px]"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00C853] text-xs font-bold text-white">
                    {c.step}
                  </span>
                  <c.Icon className="h-6 w-6 text-[#00C853]" />
                </div>
                <p className="mt-3 text-sm font-bold text-navy">{c.title}</p>
                {c.extra && (
                  <p className="mt-1 text-xs font-semibold text-slate-500">{c.extra}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
        Diagrama: 4 žingsnių ciklas aplink centralų varpą
      </p>
    </div>
  );
}
