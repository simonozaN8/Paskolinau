"use client";

import { useState } from "react";
import { FaqAccordion, FaqSearchHeader, useFilteredFaq, type FaqItem } from "@/components/ui/FaqAccordion";

const ALL: FaqItem[] = [
  {
    q: "Ar Paskolinau.lt yra nemokama?",
    a: "Galite pradėti nemokamai su Free planu. Mokami planai suteikia daugiau funkcijų ir kanalų.",
  },
  {
    q: "Kaip veikia priminimai?",
    a: "Nustatote grafiką – sistema siunčia pranešimus pagal jūsų pasirinktą kanalą ir laiką.",
  },
  {
    q: "Ar galiu eksportuoti duomenis?",
    a: "Taip – priklausomai nuo plano, galite eksportuoti istoriją ir ataskaitas.",
  },
  {
    q: "Kaip užtikrinamas saugumas?",
    a: "Taikome šifravimą ir prieigos kontrolę; duomenų tvarkymas atitinka GDPR.",
  },
  {
    q: "Ar yra komandinis planas?",
    a: "Team planas skirtas keliems nariams, rolėms ir centralizuotai istorijai.",
  },
  {
    q: "Kaip atšaukti prenumeratą?",
    a: "Prenumeratą galite atšaukti paskyros nustatymuose – be papildomų mokesčių.",
  },
  {
    q: "Kokiais kanalais siunčiami priminimai?",
    a: "El. paštas visuose planuose; SMS – Plus ir Team planuose.",
  },
  {
    q: "Ar palaikomos grupės rinkliavos?",
    a: "Taip – galite stebėti progresą, narius ir jų statusus vienoje vietoje.",
  },
];

export function DukBlock() {
  const [query, setQuery] = useState("");
  const filtered = useFilteredFaq(ALL, query);

  return (
    <section id="duk" className="scroll-mt-28 border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FaqSearchHeader
          title="Dažniausiai užduodami klausimai (DUK)"
          placeholder="Ieškoti atsakymo..."
          query={query}
          onQuery={setQuery}
        />
        <div className="rounded-2xl border border-slate-200 bg-white px-2 shadow-sm sm:px-6">
          <FaqAccordion key={query} items={filtered} leadingIcon="help" />
        </div>
      </div>
    </section>
  );
}
