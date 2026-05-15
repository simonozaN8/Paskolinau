import {
  Check,
  Grid3X3,
  Home,
  LayoutList,
  User,
} from "lucide-react";

const features = [
  {
    title: "QR patvirtinimai",
    text: "Greitas patvirtinimas telefonu – mažiau ginčų dėl apmokėjimo.",
  },
  {
    title: "SMS ir el. paštas",
    text: "Priminimai automatiškai – pasiekia ten, kur patogiausia.",
  },
  {
    title: "Grupės rinkliavos",
    text: "Surink mokesčius komandai ar renginiui su progreso sekimu.",
  },
  {
    title: "Mokėjimo statusai",
    text: "Aktyvus, priminta, apmokėta – viskas matoma iš karto.",
  },
  {
    title: "Dokumentai ir eksportas",
    text: "Istorija ir eksportas ataskaitoms ar buhalterijai.",
  },
];

const rows = [
  ["Komandos nuoma", "Tomas", "120 €", "Geg 18", "paid", "Apmokėta"],
  ["Padalinom sąsk.", "Rūta", "45 €", "Geg 20", "remind", "Priminta"],
  ["Kliento sąskaita", "Marius", "300 €", "Geg 22", "active", "Aktyvus"],
  ["Senas prašymas", "Ona", "15 €", "Bal 02", "closed", "Uždaryta"],
];

function badge(kind: string, label: string) {
  const styles: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-800",
    remind: "bg-sky-50 text-sky-800",
    active: "bg-blue-50 text-blue-800",
    closed: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${styles[kind]}`}
    >
      {label}
    </span>
  );
}

export function WhyWorthSection() {
  return (
    <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          Kodėl verta
        </h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <div className="flex border-b border-slate-100 bg-slate-50/80">
              <aside className="flex w-12 flex-col items-center gap-4 border-r border-slate-100 py-4">
                <Home className="h-4 w-4 text-slate-400" />
                <LayoutList className="h-4 w-4 text-[#00C853]" />
                <Grid3X3 className="h-4 w-4 text-slate-400" />
                <User className="h-4 w-4 text-slate-400" />
              </aside>
              <div className="min-w-0 flex-1 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-navy">Visi prašymai</p>
                  <div className="flex gap-2 text-[10px]">
                    <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600">
                      Visi statusai ▾
                    </span>
                    <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600">
                      Laikotarpis ▾
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-xs">
                    <thead>
                      <tr className="text-slate-500">
                        <th className="pb-2 font-medium">Prašymas</th>
                        <th className="pb-2 font-medium">Asmuo</th>
                        <th className="pb-2 font-medium">Suma</th>
                        <th className="pb-2 font-medium">Terminas</th>
                        <th className="pb-2 font-medium">Statusas</th>
                      </tr>
                    </thead>
                    <tbody className="text-navy">
                      {rows.map(([a, b, c, d, k, l]) => (
                        <tr key={a} className="border-t border-slate-100">
                          <td className="py-2.5 font-medium">{a}</td>
                          <td className="py-2.5 text-slate-600">{b}</td>
                          <td className="py-2.5">{c}</td>
                          <td className="py-2.5 text-slate-600">{d}</td>
                          <td className="py-2.5">{badge(k, l)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00C853] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-bold text-navy">{f.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
