"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { DocPreviewModal, type DocKey } from "@/components/ui/DocPreviewModal";

const docs: { color: string; title: string; text: string; key: DocKey }[] = [
  { color: "bg-emerald-500", title: "Skolos įrašas PDF",   text: "Aiškiai suformuluotas įsipareigojimas.", key: "debt-record" },
  { color: "bg-sky-500",     title: "Skolos raštelis",     text: "Trumpas oficialus priminimas.",          key: "debt-note" },
  { color: "bg-violet-500",  title: "Mokėjimo grafikas",   text: "Dalys ir datos vienoje lentelėje.",      key: "payment-schedule" },
  { color: "bg-rose-500",    title: "Grupės sutartis",     text: "Narių įsipareigojimai ir sumos.",        key: "group-contract" },
  { color: "bg-amber-500",   title: "Priminimo šablonas",  text: "Paruoštas tekstas siuntimui.",           key: "reminder-template" },
  { color: "bg-indigo-500",  title: "Archyvo eksportas",   text: "CSV/PDF ataskaita buhalterijai.",        key: "archive-export" },
];

export function DocPreviewSection() {
  const [activeDoc, setActiveDoc] = useState<DocKey | null>(null);

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => (
          <div
            key={d.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${d.color} text-white`}>
              <FileText className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy">{d.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{d.text}</p>
            <button
              type="button"
              onClick={() => setActiveDoc(d.key)}
              className="mt-4 text-sm font-semibold text-[#00C853] hover:underline"
            >
              Žiūrėti pavyzdį →
            </button>
          </div>
        ))}
      </div>

      {activeDoc && (
        <DocPreviewModal docKey={activeDoc} onClose={() => setActiveDoc(null)} />
      )}
    </>
  );
}
