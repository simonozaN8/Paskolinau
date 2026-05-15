"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X, Mail, KeyRound, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

type Step = "email" | "code";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { refresh } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  useEffect(() => {
    if (step === "code") codeInputRef.current?.focus();
  }, [step]);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; devCode?: string };
      if (!res.ok) { setError(data.error ?? "Įvyko klaida"); return; }
      if (data.devCode) setDevCode(data.devCode);
      setStep("code");
    } catch { setError("Nepavyko prisijungti prie serverio."); }
    finally { setLoading(false); }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Įvyko klaida"); return; }
      await refresh();
      onClose();
      router.push("/dashboard");
    } catch { setError("Nepavyko prisijungti prie serverio."); }
    finally { setLoading(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Uždaryti"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="login-modal-title" className="text-xl font-bold text-navy sm:text-2xl">
              Prisijungti
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {step === "email"
                ? "Įveskite el. paštą – atsiųsime prisijungimo kodą."
                : `Kodas išsiųstas į ${email}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy"
            aria-label="Uždaryti"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "email" ? (
          <form className="mt-6 space-y-4" onSubmit={sendCode}>
            <label className="block text-sm font-medium text-slate-700">
              El. paštas
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  autoComplete="email"
                  placeholder="vardas@pastas.lt"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
            >
              {loading ? "Siunčiama…" : "Gauti kodą"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={verifyCode}>
            <label className="block text-sm font-medium text-slate-700">
              6 skaitmenų kodas
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={codeInputRef}
                  required
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
                  placeholder="000000"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm tracking-widest outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </div>
            </label>

            {devCode && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <span className="font-semibold">Kūrimo režimas – kodas:</span>{" "}
                <span className="font-mono font-bold tracking-widest">{devCode}</span>
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
              >
                {loading ? "Tikrinama…" : "Prisijungti"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(null); setDevCode(null); }}
                className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-navy"
              >
                <RefreshCw className="h-3 w-3" /> Keisti el. paštą
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
