import { Bell, RefreshCw, Shield } from "lucide-react";

const items = [
  {
    Icon: Shield,
    title: "Patikima",
    text: "Jūsų duomenys saugūs ir atitinka GDPR reikalavimus.",
  },
  {
    Icon: Bell,
    title: "Primena",
    text: "Sistema laiku primins už jus – nei vienas prašymas nepamirštas.",
  },
  {
    Icon: RefreshCw,
    title: "Padeda grąžinti",
    text: "Sukurta skoloms susigrąžinimui – aukštesnis grąžinimo rodiklis.",
  },
];

export function ThreeHighlights() {
  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {items.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center shadow-sm"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Icon className="h-7 w-7 text-[#00C853]" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
