"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowRight, X } from "lucide-react";
import { EmailVerifyModal } from "@/components/auth/EmailVerifyModal";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  bankAccount: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  bankAccount: "",
};

type Ctx = {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
};

const StartRegistrationContext = createContext<Ctx | null>(null);

export function useStartRegistration() {
  const v = useContext(StartRegistrationContext);
  if (!v) throw new Error("useStartRegistration outside StartRegistrationProvider");
  return v;
}

export function StartRegistrationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const openModal  = useCallback(() => setOpen(true),  []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openModal, closeModal, isOpen }),
    [openModal, closeModal, isOpen],
  );

  const handleVerifyClose = useCallback(() => {
    setVerifyEmail(null);
    setDevCode(null);
  }, []);

  return (
    <StartRegistrationContext.Provider value={value}>
      {children}
      {isOpen && (
        <StartRegistrationModal
          onClose={closeModal}
          onRegistered={(email, code) => {
            closeModal();
            setVerifyEmail(email);
            setDevCode(code ?? null);
          }}
        />
      )}
      {verifyEmail && (
        <EmailVerifyModal
          email={verifyEmail}
          devCode={devCode}
          onClose={handleVerifyClose}
        />
      )}
    </StartRegistrationContext.Provider>
  );
}

/* ---------- Registracijos modalas ---------- */

type RegistrationModalProps = {
  onClose: () => void;
  onRegistered: (email: string, devCode?: string) => void;
};

function StartRegistrationModal({ onClose, onRegistered }: RegistrationModalProps) {
  const [form, setForm]         = useState<FormState>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isExistingEmail, setIsExistingEmail] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const update =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setError(null);
      setIsExistingEmail(false);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // 1. Sukurti paskyrą
      const regRes = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const regData = await regRes.json() as { error?: string; id?: string };
      if (!regRes.ok) {
        if (regRes.status === 409) setIsExistingEmail(true);
        setError(regData.error ?? "Įvyko klaida");
        return;
      }

      // 2. Išsiųsti patvirtinimo kodą
      const codeRes = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
      });
      const codeData = await codeRes.json() as { ok?: boolean; devCode?: string };

      onRegistered(form.email.trim().toLowerCase(), codeData.devCode);
    } catch {
      setError("Nepavyko prisijungti prie serverio.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Uždaryti"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="start-modal-title" className="text-xl font-bold text-navy sm:text-2xl">
              Sukurti paskyrą
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Užpildykite duomenis – el. paštu gausite patvirtinimo kodą.
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Vardas
              <input
                required
                value={form.firstName}
                onChange={update("firstName")}
                autoComplete="given-name"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                placeholder="Jonas"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Pavardė
              <input
                required
                value={form.lastName}
                onChange={update("lastName")}
                autoComplete="family-name"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                placeholder="Jonaitis"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Telefono numeris
            <input
              required
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              autoComplete="tel"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
              placeholder="+370 600 00 000"
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
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
              placeholder="vardas@pastas.lt"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Banko sąskaita
            <input
              required
              value={form.bankAccount}
              onChange={update("bankAccount")}
              autoComplete="off"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
              placeholder="LT00 0000 0000 0000 0000"
            />
          </label>

          {error && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${isExistingEmail ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-800"}`}
              role="alert"
            >
              {error}
              {isExistingEmail && (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-1 block font-semibold underline hover:no-underline"
                >
                  Uždaryti ir naudokite „Prisijungti&quot; mygtuką →
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
            >
              {submitting ? "Kuriama…" : "Sukurti paskyrą"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
