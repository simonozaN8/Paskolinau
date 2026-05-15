"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, KeyRound, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

type Props = {
  email: string;
  devCode?: string | null;
  onClose: () => void;
};

export function EmailVerifyModal({ email, devCode: initialDevCode, onClose }: Props) {
  const { refresh } = useAuth();
  const router = useRouter();

  const [code, setCode]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [done, setDone]     = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !done) onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, done]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Įvyko klaida"); return; }
      setDone(true);
      await refresh();
      setTimeout(() => { onClose(); router.push("/dashboard"); }, 1800);
    } catch { setError("Nepavyko prisijungti prie serverio."); }
    finally { setLoading(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-modal-title"
    >
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-8">
        {!done ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="verify-modal-title" className="text-xl font-bold text-navy sm:text-2xl">
                  Patvirtinkite el. paštą
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Išsiuntėme 6 skaitmenų kodą į{" "}
                  <span className="font-semibold text-navy">{email}</span>
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

            <form className="mt-6 space-y-4" onSubmit={verify}>
              <label className="block text-sm font-medium text-slate-700">
                Patvirtinimo kodas
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={inputRef}
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

              {initialDevCode && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <span className="font-semibold">Kūrimo režimas – kodas:</span>{" "}
                  <span className="font-mono font-bold tracking-widest">{initialDevCode}</span>
                </p>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C853] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00b849] disabled:opacity-60"
              >
                {loading ? "Tikrinama…" : "Patvirtinti"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle className="h-16 w-16 text-[#00C853]" />
            <h2 className="text-xl font-bold text-navy">El. paštas patvirtintas!</h2>
            <p className="text-sm text-slate-600">Nukreipiame į jūsų paskyrą…</p>
          </div>
        )}
      </div>
    </div>
  );
}
