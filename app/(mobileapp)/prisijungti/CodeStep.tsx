"use client";

import { useState } from "react";
import { ArrowRight, KeyRound, RefreshCw } from "lucide-react";

export function CodeStep({ email, devCode }: { email: string; devCode?: string }) {
  const [code, setCode]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function handleVerify() {
    const trimmed = code.trim().replace(/\D/g, "");
    if (trimmed.length < 4) { setError("Įveskite kodą"); return; }
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: trimmed }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Neteisingas kodas"); setLoading(false); return; }
      // Full page reload — ensures browser picks up the new session cookie
      window.location.replace("/pradzia");
    } catch {
      setError("Serverio klaida. Patikrinkite ryšį.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {devCode && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-center">
          <p className="text-xs text-amber-700">Kūrimo režimas — jūsų kodas:</p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-[0.35em] text-amber-900">
            {devCode}
          </p>
        </div>
      )}

      <div className="relative">
        <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
          placeholder="000000"
          className="w-full rounded-xl border border-slate-200 py-3.5 pl-10 pr-4 text-center text-2xl font-mono font-bold tracking-[0.4em] outline-none focus:border-[#00C853]/60 focus:ring-2 focus:ring-[#00C853]/20"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
      )}

      <button
        type="button"
        disabled={loading || code.trim().length < 4}
        onClick={handleVerify}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-4 text-sm font-semibold text-white disabled:opacity-60 active:opacity-80"
      >
        {loading
          ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          : <><span>Prisijungti</span> <ArrowRight className="h-4 w-4" /></>}
      </button>

      <a
        href="/prisijungti"
        className="flex w-full items-center justify-center gap-1.5 text-xs text-slate-400"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Keisti el. paštą
      </a>
    </div>
  );
}
