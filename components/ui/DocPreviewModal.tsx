"use client";

import { useEffect } from "react";
import { X, FileText } from "lucide-react";

type DocKey =
  | "debt-record"
  | "debt-note"
  | "payment-schedule"
  | "group-contract"
  | "reminder-template"
  | "archive-export";

type DocMeta = {
  title: string;
  color: string;
  preview: React.ReactNode;
};

const today = new Date().toLocaleDateString("lt-LT");

const DOCS: Record<DocKey, DocMeta> = {
  "debt-record": {
    title: "Skolos įrašas PDF",
    color: "bg-emerald-500",
    preview: (
      <div className="space-y-4 font-mono text-xs text-slate-700">
        <div className="border-b border-slate-200 pb-3 text-center">
          <p className="text-base font-bold text-navy">SKOLOS ĮRAŠAS</p>
          <p className="text-slate-500">Data: {today}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><span className="font-semibold">Kreditorius:</span><br />Jonas Jonaitis</div>
          <div><span className="font-semibold">Skolininkas:</span><br />Tomas Tomaitis</div>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="font-semibold">Skolos suma: <span className="text-emerald-700">120,00 €</span></p>
          <p>Terminas: 2026-06-01</p>
          <p>Priežastis: Komandos nuoma</p>
        </div>
        <div className="space-y-1 border-t border-slate-200 pt-3">
          <p>Kreditorius patvirtina, kad šie duomenys yra teisingi.</p>
          <div className="mt-4 flex justify-between">
            <div className="border-t border-slate-400 pt-1 text-center text-[10px] w-28">Parašas</div>
            <div className="border-t border-slate-400 pt-1 text-center text-[10px] w-28">Data</div>
          </div>
        </div>
      </div>
    ),
  },
  "debt-note": {
    title: "Skolos raštelis",
    color: "bg-sky-500",
    preview: (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="border-b border-slate-200 pb-2">
          <p className="text-sm font-bold text-navy">SKOLOS RAŠTELIS</p>
          <p className="text-slate-500">Nr. SR-2026-0042 · {today}</p>
        </div>
        <p>
          Aš, <strong>Tomas Tomaitis</strong>, patvirtinu, kad esu skolingas
          (-a) asmeniui <strong>Jonas Jonaitis</strong> sumą:
        </p>
        <div className="rounded border-l-4 border-sky-400 bg-sky-50 px-3 py-2">
          <p className="text-lg font-bold text-sky-800">120,00 €</p>
          <p className="text-slate-600">Grąžinimo terminas: 2026-06-01</p>
        </div>
        <p className="text-slate-500">
          Sutinku grąžinti aukščiau nurodytą sumą iki nurodyto termino.
        </p>
        <div className="flex justify-between pt-2 border-t border-slate-200">
          <div className="text-center text-[10px]">
            <div className="mb-1 w-24 border-t border-slate-400" />
            Skolininkas
          </div>
          <div className="text-center text-[10px]">
            <div className="mb-1 w-24 border-t border-slate-400" />
            {today}
          </div>
        </div>
      </div>
    ),
  },
  "payment-schedule": {
    title: "Mokėjimo grafikas",
    color: "bg-violet-500",
    preview: (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="border-b border-slate-200 pb-2">
          <p className="text-sm font-bold text-navy">MOKĖJIMO GRAFIKAS</p>
          <p className="text-slate-500">Bendra suma: 300,00 € · 3 dalys</p>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-violet-50 text-violet-800">
              <th className="px-2 py-1.5 font-semibold">Dalis</th>
              <th className="px-2 py-1.5 font-semibold">Suma</th>
              <th className="px-2 py-1.5 font-semibold">Terminas</th>
              <th className="px-2 py-1.5 font-semibold">Statusas</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 1, s: "100,00 €", d: "2026-04-01", st: "Apmokėta", c: "text-emerald-700" },
              { n: 2, s: "100,00 €", d: "2026-05-01", st: "Apmokėta", c: "text-emerald-700" },
              { n: 3, s: "100,00 €", d: "2026-06-01", st: "Laukiama", c: "text-amber-700" },
            ].map((r) => (
              <tr key={r.n} className="border-t border-slate-100">
                <td className="px-2 py-1.5">{r.n}</td>
                <td className="px-2 py-1.5 font-medium">{r.s}</td>
                <td className="px-2 py-1.5">{r.d}</td>
                <td className={`px-2 py-1.5 font-semibold ${r.c}`}>{r.st}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  "group-contract": {
    title: "Grupės sutartis",
    color: "bg-rose-500",
    preview: (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="border-b border-slate-200 pb-2">
          <p className="text-sm font-bold text-navy">GRUPĖS MOKĖJIMO SUTARTIS</p>
          <p className="text-slate-500">Renginio mokestis · {today}</p>
        </div>
        <p>Sutarties šalys susitarė dėl šių įnašų:</p>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-rose-50 text-rose-800">
              <th className="px-2 py-1.5 font-semibold">Narys</th>
              <th className="px-2 py-1.5 font-semibold">Suma</th>
              <th className="px-2 py-1.5 font-semibold">Statusas</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: "Jonas J.", s: "50,00 €", st: "Sumokėta" },
              { n: "Rūta K.", s: "50,00 €", st: "Sumokėta" },
              { n: "Tomas M.", s: "50,00 €", st: "Laukiama" },
              { n: "Ona P.", s: "50,00 €", st: "Laukiama" },
            ].map((r) => (
              <tr key={r.n} className="border-t border-slate-100">
                <td className="px-2 py-1.5 font-medium">{r.n}</td>
                <td className="px-2 py-1.5">{r.s}</td>
                <td className={`px-2 py-1.5 font-semibold ${r.st === "Sumokėta" ? "text-emerald-700" : "text-amber-700"}`}>{r.st}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-slate-200 pt-2 text-slate-500">
          Bendra suma: <strong>200,00 €</strong> · Surinkta: <strong>100,00 €</strong>
        </p>
      </div>
    ),
  },
  "reminder-template": {
    title: "Priminimo šablonas",
    color: "bg-amber-500",
    preview: (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="border-b border-slate-200 pb-2">
          <p className="text-sm font-bold text-navy">PRIMINIMO ŠABLONAS</p>
          <p className="text-slate-500">El. paštas / SMS · automatinis</p>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50 p-3 space-y-2">
          <p className="font-semibold text-amber-900">Tema: Priminimas apie neapmokėtą prašymą</p>
          <p className="whitespace-pre-line text-amber-900/80">
            {`Sveiki, [Vardas],

primename, kad turite neapmokėtą prašymą:

  Suma: [Suma] €
  Terminas: [Data]
  Nuoroda: [Nuoroda]

Jei jau apmokėjote – ignoruokite šį pranešimą.

Pagarbiai,
[Siuntėjo vardas]`}
          </p>
        </div>
        <p className="text-slate-400">Kintamieji automatiškai pakeičiami sistemos.</p>
      </div>
    ),
  },
  "archive-export": {
    title: "Archyvo eksportas",
    color: "bg-indigo-500",
    preview: (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="border-b border-slate-200 pb-2">
          <p className="text-sm font-bold text-navy">ARCHYVO EKSPORTAS (CSV)</p>
          <p className="text-slate-500">Laikotarpis: 2026-01-01 – {today}</p>
        </div>
        <div className="overflow-x-auto rounded border border-slate-200 bg-slate-50 p-2 font-mono">
          <p className="text-indigo-700 font-semibold">id,asmuo,suma,terminas,statusas</p>
          <p>PR-001,Tomas T.,120.00,2026-04-01,apmoketa</p>
          <p>PR-002,Rūta K.,45.00,2026-05-01,apmoketa</p>
          <p>PR-003,Marius B.,300.00,2026-06-01,aktyvi</p>
          <p>PR-004,Ona P.,15.00,2026-03-01,uzdaryta</p>
        </div>
        <p className="text-slate-500">
          Iš viso įrašų: <strong>4</strong> · Suma: <strong>480,00 €</strong>
        </p>
        <div className="rounded border border-indigo-100 bg-indigo-50 px-3 py-2 text-indigo-800">
          Eksportas galimas CSV ir PDF formatu iš paskyros nustatymų.
        </div>
      </div>
    ),
  },
};

type Props = {
  docKey: DocKey;
  onClose: () => void;
};

export function DocPreviewModal({ docKey, onClose }: Props) {
  const doc = DOCS[docKey];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Uždaryti"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${doc.color} text-white`}>
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-navy">{doc.title}</h2>
              <p className="text-xs text-slate-500">Dokumento pavyzdys</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            aria-label="Uždaryti"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-inner">
            {doc.preview}
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-4 text-center">
          <p className="text-xs text-slate-400">
            Realūs dokumentai generuojami automatiškai iš jūsų paskyros duomenų.
          </p>
        </div>
      </div>
    </div>
  );
}

export type { DocKey };
