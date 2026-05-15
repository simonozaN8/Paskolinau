import Image from "next/image";
import { ArrowRight, KeyRound, Mail, RefreshCw } from "lucide-react";
import { sendCodeAction } from "./actions";

type Props = {
  searchParams: Promise<{ step?: string; email?: string; dev?: string; error?: string }>;
};

export default async function PrisijungtiPage({ searchParams }: Props) {
  const params = await searchParams;
  const step  = params.step === "code" ? "code" : "email";
  const email = params.email ?? "";
  const dev   = params.dev ?? "";
  const error = params.error ? decodeURIComponent(params.error) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white px-6">
      <div className="flex flex-col items-center pt-16 pb-10">
        <Image
          src="/Paskolinau_varpelis_logo.png"
          alt="Paskolinau.lt"
          width={80} height={80}
          className="h-20 w-20"
          priority
        />
        <h1 className="mt-4 text-2xl font-bold text-navy">
          Paskolinau<span className="text-[#00C853]">.lt</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Sukurk. Išsiųsk. Sistema pasirūpins.</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {step === "email" ? (
          <>
            <h2 className="text-lg font-bold text-navy">Prisijungti</h2>
            <p className="mt-1 text-sm text-slate-500">
              Įveskite el. paštą – atsiųsime prisijungimo kodą.
            </p>
            <form action={sendCodeAction} className="mt-5 space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  defaultValue={email}
                  placeholder="vardas@pastas.lt"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#00C853]/60 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
              )}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-4 text-sm font-semibold text-white active:opacity-80"
              >
                Gauti kodą <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-navy">Įveskite kodą</h2>
            <p className="mt-1 text-sm text-slate-500">Kodas išsiųstas į {email}</p>

            {dev && (
              <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-center">
                <p className="text-xs text-amber-700">Kūrimo režimas — jūsų kodas:</p>
                <p className="mt-1 font-mono text-3xl font-bold tracking-[0.35em] text-amber-900">
                  {dev}
                </p>
              </div>
            )}

            {/* Plain HTML POST — no JavaScript needed */}
            <form method="POST" action="/api/auth/login-form" className="mt-4 space-y-4">
              <input type="hidden" name="email" value={email} />

              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  placeholder="000000"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-10 pr-4 text-center text-2xl font-mono font-bold tracking-[0.4em] outline-none focus:border-[#00C853]/60 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-4 text-sm font-semibold text-white active:opacity-80"
              >
                Prisijungti <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <a
              href="/prisijungti"
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs text-slate-400"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Keisti el. paštą
            </a>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Neturite paskyros?{" "}
        <a href="/registracija" className="font-semibold text-[#00C853]">Registruotis</a>
      </p>
    </div>
  );
}
