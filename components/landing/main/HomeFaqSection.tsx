import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";

const items: FaqItem[] = [
  {
    q: "Ar Paskolinau.lt yra nemokama?",
    a: "Taip – galite pradėti nemokamai su Free planu. Mokami planai suteikia daugiau aktyvių prašymų ir kanalų.",
  },
  {
    q: "Kaip veikia priminimai?",
    a: "Nustatote grafiką – sistema automatiškai siunčia el. paštu ar SMS (priklausomai nuo plano).",
  },
  {
    q: "Ar galiu naudoti komandoje?",
    a: "Team planas skirtas keliems nariams, vaidmenims ir bendrai istorijai.",
  },
  {
    q: "Ar mano duomenys saugūs?",
    a: "Taikome saugumo praktikas ir GDPR reikalavimus; prieigą kontroliuojate jūs.",
  },
];

export function HomeFaqSection() {
  return (
    <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">DUK</h2>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm sm:px-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
