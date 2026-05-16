"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Sparkles, Trash2, Users } from "lucide-react";
import {
  computeBalances,
  simplifySettlements,
  type TripExpense,
  type TripParticipant,
} from "@/lib/trip-settlement";

const TRIP_PRICE = "2,99 €";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function KelionePage() {
  const [participants, setParticipants] = useState<TripParticipant[]>([
    { id: "1", name: "Jonas" },
    { id: "2", name: "Ona" },
  ]);
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [tripName, setTripName] = useState("Draugų kelionė");
  const [finished, setFinished] = useState(false);

  const balances = useMemo(
    () => computeBalances(participants, expenses),
    [participants, expenses],
  );
  const settlements = useMemo(
    () => (finished ? simplifySettlements(participants, balances) : []),
    [finished, participants, balances],
  );

  function addPerson() {
    setParticipants((p) => [...p, { id: newId(), name: "" }]);
  }

  function addExpense() {
    if (participants.length < 2) return;
    setExpenses((e) => [
      ...e,
      {
        id: newId(),
        payerId: participants[0].id,
        amount: 0,
        label: "",
        splitAmong: participants.map((p) => p.id),
      },
    ]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Grįžti į paskyrą
      </Link>

      <div className="rounded-2xl border border-[#00C853]/30 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#00C853]">
          <Sparkles className="h-4 w-4" />
          Premium · Beta
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Kelionės atsiskaitymas</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Draugų kompanija, kelionė ar renginys: kas už ką mokėjo (pietūs, vakarienė,
          parduotuvė…) – pabaigoje sistema apskaičiuoja, kas kam kiek skolingas.
          Planuojama kaina: <strong className="text-navy">{TRIP_PRICE}</strong> už kelionę.
        </p>
        <input
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy"
          placeholder="Kelionės pavadinimas"
        />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <Users className="h-5 w-5" />
            Dalyviai
          </h2>
          <button
            type="button"
            onClick={addPerson}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00C853]"
          >
            <Plus className="h-4 w-4" />
            Pridėti
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {participants.map((p) => (
            <li key={p.id} className="flex gap-2">
              <input
                value={p.name}
                onChange={(e) =>
                  setParticipants((list) =>
                    list.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)),
                  )
                }
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Vardas"
              />
              {participants.length > 2 && (
                <button
                  type="button"
                  onClick={() =>
                    setParticipants((list) => list.filter((x) => x.id !== p.id))
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-navy">Išlaidos</h2>
          <button
            type="button"
            onClick={addExpense}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00C853]"
          >
            <Plus className="h-4 w-4" />
            Pridėti išlaidą
          </button>
        </div>
        {expenses.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Pridėkite pirmą išlaidą (pvz. „Pietūs restorane – 80 €, mokėjo Jonas“).
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {expenses.map((exp) => (
              <li
                key={exp.id}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
              >
                <input
                  value={exp.label}
                  onChange={(e) =>
                    setExpenses((list) =>
                      list.map((x) =>
                        x.id === exp.id ? { ...x, label: e.target.value } : x,
                      ),
                    )
                  }
                  placeholder="Aprašymas (pvz. Vakarienė)"
                  className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-xs text-slate-500">
                    Suma (€)
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={exp.amount || ""}
                      onChange={(e) =>
                        setExpenses((list) =>
                          list.map((x) =>
                            x.id === exp.id
                              ? { ...x, amount: parseFloat(e.target.value) || 0 }
                              : x,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    Mokėjo
                    <select
                      value={exp.payerId}
                      onChange={(e) =>
                        setExpenses((list) =>
                          list.map((x) =>
                            x.id === exp.id ? { ...x, payerId: e.target.value } : x,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      {participants.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name || "Be vardo"}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExpenses((list) => list.filter((x) => x.id !== exp.id))
                  }
                  className="mt-2 text-xs font-semibold text-red-600"
                >
                  Pašalinti
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!finished ? (
        <button
          type="button"
          onClick={() => setFinished(true)}
          disabled={expenses.length === 0}
          className="mt-8 w-full rounded-xl bg-navy py-3.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
        >
          Baigti kelionę ir skaičiuoti atsiskaitymus
        </button>
      ) : (
        <section className="mt-8 rounded-2xl border-2 border-[#00C853]/40 bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-navy">Atsiskaitymai</h2>
          <p className="mt-1 text-sm text-slate-600">
            Minimalus pavedimų skaičius, kad visi būtų „kvitai“.
          </p>
          {settlements.length === 0 ? (
            <p className="mt-4 text-sm text-emerald-700">Visi atsiskaitė – skolų nėra.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {settlements.map((s, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-navy">{s.fromName}</span>
                  <span className="text-slate-500">→</span>
                  <span className="font-semibold text-navy">{s.toName}</span>
                  <span className="ml-auto font-bold text-[#007a32]">
                    {s.amount.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-slate-500">
            Ši beta versija veikia naršyklėje. Netrukus galėsite išsaugoti kelionę ir
            siųsti priminimus dalyviams ({TRIP_PRICE}).
          </p>
        </section>
      )}
    </div>
  );
}
