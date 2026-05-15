"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Check,
  Euro,
  FileText,
  MessageCircle,
  Plus,
  QrCode,
  Mail,
  User,
} from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";

const SCENARIOS = [
  { id: "loan",            label: "Paskolinau",  Icon: User,        iconBg: "bg-blue-50"   },
  { id: "split-bill",      label: "Padalinau",   Icon: Euro,        iconBg: "bg-emerald-50"},
  { id: "group-fee",       label: "Surenku",     Icon: Bell,        iconBg: "bg-orange-50" },
  { id: "awaiting-share",  label: "Primenu",     Icon: Bell,        iconBg: "bg-purple-50" },
] as const;

const SEND_METHODS = [
  { id: "sms",   label: "SMS",       Icon: MessageCircle },
  { id: "email", label: "El. paštas", Icon: Mail         },
  { id: "qr",    label: "QR",        Icon: QrCode       },
] as const;

function initialScenario(raw: string | null): string {
  const allowed = ["loan", "split-bill", "group-fee", "awaiting-share"];
  return raw && allowed.includes(raw) ? raw : "loan";
}

export default function NaujasPrasymasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scenario, setScenario] = useState<string>(() =>
    initialScenario(searchParams.get("scenario")),
  );
  const [sendMethod, setSendMethod] = useState("sms");
  const [form, setForm] = useState({ recipient: "", amount: "", title: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    if (!form.recipient || !form.amount) { setError("Užpildykite privalomus laukus"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          recipients: [{ name: form.recipient, email: "", phone: form.recipient, amount: parseFloat(form.amount), saveAsContact: false }],
          dueDate: form.dueDate || null,
          description: form.title || form.recipient,
          attachments: [],
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Klaida"); return; }
      router.push("/pradzia");
    } catch { setError("Serverio klaida"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="back" title="Naujas prašymas" />

      <div className="px-4 pb-2">
        <h1 className="text-2xl font-bold text-navy">Naujas prašymas</h1>
        <p className="mt-0.5 text-sm text-slate-500">Sukurk. Išsiųsk. Sistema pasirūpins.</p>
      </div>

      {/* Scenario selector */}
      <div className="grid grid-cols-4 gap-2 px-4 pt-4 pb-5">
        {SCENARIOS.map(({ id, label, Icon, iconBg }) => {
          const on = scenario === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setScenario(id)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition",
                on ? "border-navy shadow-sm" : "border-slate-100",
              )}
            >
              {on && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#00C853]">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
              )}
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-full", iconBg)}>
                <Icon className="h-5 w-5 text-navy" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-semibold text-navy">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Form fields */}
      <div className="mx-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {[
          { icon: <User className="h-5 w-5 text-slate-400" />,         label: "Kam?",        key: "recipient" as const, placeholder: "Vardo, telefono ar el. pašto", arrow: true  },
          { icon: <Euro className="h-5 w-5 text-slate-400" />,         label: "Suma",        key: "amount"    as const, placeholder: "Įveskite sumą",                 arrow: false },
          { icon: <FileText className="h-5 w-5 text-slate-400" />,     label: "Pavadinimas", key: "title"     as const, placeholder: "Pvz. Vakarienė, Dovana, Kelionė",arrow: false },
          { icon: <CalendarDays className="h-5 w-5 text-slate-400" />, label: "Terminas",    key: "dueDate"   as const, placeholder: "Pasirinkite datą",               arrow: true  },
        ].map(({ icon, label, key, placeholder, arrow }, i, arr) => (
          <div key={key} className={cn("flex items-center gap-3 px-4 py-3.5", i < arr.length - 1 && "border-b border-slate-100")}>
            {icon}
            <span className="w-24 shrink-0 text-sm font-semibold text-navy">{label}</span>
            <input
              className="flex-1 text-sm text-slate-400 placeholder:text-slate-300 outline-none"
              placeholder={placeholder}
              value={form[key]}
              onChange={set(key)}
              type={key === "amount" ? "number" : key === "dueDate" ? "date" : "text"}
            />
            {key === "amount" && <span className="text-sm text-slate-400">€</span>}
          </div>
        ))}
      </div>

      {/* Send method */}
      <div className="px-4 pt-5">
        <h2 className="mb-3 text-sm font-semibold text-navy">Kaip siųsti prašymą?</h2>
        <div className="flex gap-2">
          {SEND_METHODS.map(({ id, label, Icon }) => {
            const on = sendMethod === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSendMethod(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                  on ? "border-[#00C853] bg-[#00C853]/5 text-[#00C853]" : "border-slate-200 text-slate-500",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info banner */}
      <div className="mx-4 mt-4 flex gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[#00C853]" />
        <div>
          <p className="text-sm font-semibold text-navy">Sistema pasirūpins.</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Prašymą galime išsiųsti už jus, o priminimus siųsime automatiškai.
          </p>
        </div>
      </div>

      {error && <p className="mx-4 mt-3 text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <div className="px-4 pt-5">
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Sukurti prašymą
            </>
          )}
        </button>
      </div>
    </div>
  );
}
