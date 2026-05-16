"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const topics = [
  "Bendra informacija",
  "Techninė pagalba",
  "Sąskaitos ir planai",
  "Partnerystė",
];

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const empty: FormState = { name: "", email: "", topic: topics[0], message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ ...empty });
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setError(null);
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) {
      setError("Prašome sutikti su duomenų tvarkymu.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Įvyko klaida. Bandykite dar kartą.");
        return;
      }
      setSuccess(true);
      setForm({ ...empty });
      setAgree(false);
    } catch {
      setError("Nepavyko prisijungti prie serverio.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-10 shadow-sm text-center">
        <CheckCircle2 className="h-14 w-14 text-[#00C853]" strokeWidth={1.5} />
        <h2 className="text-xl font-bold text-navy">Žinutė išsiųsta!</h2>
        <p className="text-slate-600">
          Gavome jūsų žinutę. Atsakysime per 1 darbo dieną.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Siųsti dar vieną žinutę
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-navy">Parašykite mums</h2>
      <p className="mt-2 text-sm text-slate-500">Atsakome per 1 darbo dieną.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Jūsų vardas
            <input
              required
              type="text"
              value={form.name}
              onChange={update("name")}
              autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/40 focus:ring-2 focus:ring-[#00C853]/15"
              placeholder="Vardas"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            El. paštas
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/40 focus:ring-2 focus:ring-[#00C853]/15"
              placeholder="jusu@pastas.lt"
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Tema
          <select
            value={form.topic}
            onChange={update("topic")}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/40 focus:ring-2 focus:ring-[#00C853]/15"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Jūsų žinutė
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={update("message")}
            minLength={10}
            className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/40 focus:ring-2 focus:ring-[#00C853]/15"
            placeholder="Trumpai aprašykite klausimą..."
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#00C853] focus:ring-[#00C853]"
          />
          <span>
            Sutinku su{" "}
            <a href="/privatumo-politika" className="text-[#00C853] hover:underline">
              privatumo politika
            </a>{" "}
            ir kad mano duomenys būtų naudojami atsakymui pateikti.
          </span>
        </label>
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {submitting ? "Siunčiama…" : "Siųsti žinutę"}
          {!submitting && <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
