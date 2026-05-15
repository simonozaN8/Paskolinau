import { Bell, PieChart, Users, UsersRound } from "lucide-react";

const cards = [
  {
    Icon: Users,
    title: "Paskolinau",
    text: "Draugui ar kolegai – aiškus prašymas ir automatiniai priminimai.",
  },
  {
    Icon: PieChart,
    title: "Padalinau",
    text: "Bendros išlaidos keliems žmonėms – kiekvienas mato savo dalį.",
  },
  {
    Icon: UsersRound,
    title: "Surenku",
    text: "Komandos ar grupės mokestį surinkti paprastai ir skaidriai.",
  },
  {
    Icon: Bell,
    title: "Primenu",
    text: "Vienkartinis ar pasikartojantis priminimas apie mokėjimą.",
  },
];

export function ScenariosSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          Naudojimo scenarijai
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {cards.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/40 p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                <Icon className="h-6 w-6 text-[#00C853]" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
