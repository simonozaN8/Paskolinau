"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, KeyRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

type Step = "form" | "verify";

type Form = {
  firstName: string; lastName: string;
  phone: string; email: string; bankAccount: string;
};

const empty: Form = { firstName: "", lastName: "", phone: "", email: "", bankAccount: "" };

function Field({
  label, value, onChange, type = "text", placeholder, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#00C853]/60 focus:ring-2 focus:ring-[#00C853]/20"
      />
    </div>
  );
}

export default function RegistracijaPage() {
  const { refresh } = useAuth();
  const router = useRouter();

  const [step, setStep]   = useState<Step>("form");
  const [form, setForm]   = useState<Form>({ ...empty });
  const [code, setCode]   = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof Form) => (v: string) => { setForm((f) => ({ ...f, [k]: v })); setError(null); };

  async function handleRegister() {
    const { firstName, lastName, phone, email, bankAccount } = form;
    if (!firstName || !lastName || !phone || !email || !bankAccount) {
      setError("Užpildykite visus laukus"); return;
    }
    setLoading(true); setError(null);
    try {
      const regRes = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: email.trim().toLowerCase() }),
      });
      const regData = await regRes.json() as { error?: string };
      if (!regRes.ok) { setError(regData.error ?? "Klaida"); return; }

      const codeRes = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const codeData = await codeRes.json() as { devCode?: string };
      if (codeData.devCode) setDevCode(codeData.devCode);
      setStep("verify");
    } catch { setError("Serverio klaida."); }
    finally { setLoading(false); }
  }

  async function handleVerify() {
    if (code.length !== 6) { setError("Įveskite 6 skaitmenų kodą"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), code }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Neteisingas kodas"); return; }
      await refresh();
      router.replace("/pradzia");
    } catch { setError("Serverio klaida."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white px-5 pb-8">
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-6">
        <Image src="/Paskolinau_varpelis_logo.png" alt="Paskolinau.lt" width={60} height={60} className="h-14 w-14" priority />
        <h1 className="mt-3 text-xl font-bold text-navy">
          Paskolinau<span className="text-[#00C853]">.lt</span>
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">Sukurk. Išsiųsk. Sistema pasirūpins.</p>
      </div>

      {step === "form" ? (
        <>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">Sukurti paskyrą</h2>
            <p className="mt-0.5 text-xs text-slate-500">Užpildykite duomenis – el. paštu gausite patvirtinimo kodą.</p>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Vardas"   value={form.firstName} onChange={set("firstName")} placeholder="Jonas"    autoComplete="given-name" />
                <Field label="Pavardė"  value={form.lastName}  onChange={set("lastName")}  placeholder="Jonaitis" autoComplete="family-name" />
              </div>
              <Field label="Telefono numeris" value={form.phone}       onChange={set("phone")}       type="tel"   placeholder="+370 600 00 000"          autoComplete="tel" />
              <Field label="El. paštas"       value={form.email}       onChange={set("email")}       type="email" placeholder="vardas@pastas.lt"          autoComplete="email" />
              <Field label="Banko sąskaita (IBAN)" value={form.bankAccount} onChange={set("bankAccount")} placeholder="LT00 0000 0000 0000 0000" autoComplete="off" />
            </div>

            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

            <button type="button" onClick={handleRegister} disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 text-sm font-semibold text-white disabled:opacity-60">
              {loading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : <><ArrowRight className="h-4 w-4" /> Sukurti paskyrą</>}
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Jau turite paskyrą?{" "}
            <a href="/prisijungti" className="font-semibold text-[#00C853] underline-offset-2 hover:underline">Prisijungti</a>
          </p>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Check className="h-6 w-6 text-[#00C853]" />
            </div>
            <h2 className="text-base font-bold text-navy">Patvirtinkite el. paštą</h2>
            <p className="mt-1 text-xs text-slate-500">Išsiuntėme 6 skaitmenų kodą į <strong>{form.email}</strong></p>

            {devCode && (
              <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-center">
                <p className="text-xs text-amber-700">Kūrimo režimas — jūsų kodas:</p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-amber-900">{devCode}</p>
              </div>
            )}

            <div className="relative mt-4">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
                placeholder="000000"
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-10 pr-4 text-center text-xl font-mono font-bold tracking-[0.4em] outline-none focus:border-[#00C853]/60 focus:ring-2 focus:ring-[#00C853]/20"
              />
            </div>

            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

            <button type="button" onClick={handleVerify} disabled={loading || code.length !== 6}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C853] py-3.5 text-sm font-semibold text-white disabled:opacity-60">
              {loading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : <><Check className="h-4 w-4" /> Patvirtinti ir prisijungti</>}
            </button>
          </div>

          <button type="button" onClick={() => { setStep("form"); setCode(""); setError(null); }}
            className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600">
            ← Grįžti atgal
          </button>
        </>
      )}
    </div>
  );
}
