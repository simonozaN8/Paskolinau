"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Euro,
  FileText,
  Handshake,
  Package,
  Paperclip,
  Receipt,
  Timer,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type {
  Attachment,
  LoanType,
  RecipientEntry,
  Scenario,
} from "@/lib/request-types";
import { SCENARIO_META } from "@/lib/request-types";
import type { ComponentType } from "react";

const SCENARIO_ICONS: Record<Scenario, ComponentType<{ className?: string }>> = {
  loan:             Handshake,
  "group-fee":      Users,
  "split-bill":     Receipt,
  "awaiting-share": Timer,
};
import { ScenarioModal } from "@/components/dashboard/ScenarioModal";
import { ContactPicker } from "@/components/dashboard/ContactPicker";

/* ─────────────── helpers ─────────────── */

type ReminderType = "none" | "3d" | "7d" | "custom";

const REMINDER_OPTIONS: { value: ReminderType; label: string }[] = [
  { value: "none", label: "Nesiųsti priminimų" },
  { value: "3d",   label: "Kas 3 dienas"       },
  { value: "7d",   label: "Kas 7 dienas"        },
  { value: "custom", label: "Nustatyti pačiam"  },
];

function todayISO() { return new Date().toISOString().split("T")[0]; }
function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
async function readBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

const isGroup = (s: Scenario) => s !== "loan";

/* ─────────────── Success screen ─────────────── */

function SuccessScreen({
  ids, count, totalAmount, onNew,
}: { ids: string[]; count: number; totalAmount: number; onNew: () => void }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <CheckCircle2 className="h-20 w-20 text-[#00C853]" strokeWidth={1.25} />
      <div>
        <h2 className="text-2xl font-bold text-navy">
          {count > 1 ? `${count} prašymai sukurti!` : "Prašymas sukurtas!"}
        </h2>
        <p className="mt-2 text-slate-600">
          Pranešimai išsiųsti gavėjams. Bendra suma:{" "}
          <span className="font-semibold text-navy">{totalAmount.toFixed(2)} €</span>.
        </p>
      </div>
      <div className="w-full max-w-sm space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
        <p className="text-xs text-slate-500">Prašymo {ids.length > 1 ? "ID sąrašas" : "ID"}</p>
        {ids.map((id) => (
          <p key={id} className="font-mono text-sm font-semibold text-navy">{id}</p>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
        >
          Peržiūrėti paskyrą <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNew}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Sukurti kitą prašymą
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Main form ─────────────── */

export function CreateRequestForm() {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loanType, setLoanType] = useState<LoanType>("money");
  const [recipients, setRecipients] = useState<RecipientEntry[]>([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [splitEqually, setSplitEqually] = useState(true);
  const [itemDescription, setItemDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [reminderType, setReminderType] = useState<ReminderType>("7d");
  const [reminderDays, setReminderDays] = useState("7");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ ids: string[]; count: number; totalAmount: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── derived ── */
  const multi = scenario ? isGroup(scenario) : false;

  function recalcAmounts(entries: RecipientEntry[], total: string, equally: boolean) {
    if (!equally || !entries.length) return entries;
    const per = parseFloat(total) / entries.length;
    return entries.map((e) => ({ ...e, amount: isNaN(per) ? 0 : Math.round(per * 100) / 100 }));
  }

  function handleRecipientsChange(next: RecipientEntry[]) {
    const updated = multi && splitEqually ? recalcAmounts(next, totalAmount, true) : next;
    setRecipients(updated);
  }

  function handleTotalChange(val: string) {
    setTotalAmount(val);
    if (multi && splitEqually) {
      setRecipients((prev) => recalcAmounts(prev, val, true));
    }
  }

  function handleSplitToggle(equally: boolean) {
    setSplitEqually(equally);
    if (equally) setRecipients((prev) => recalcAmounts(prev, totalAmount, true));
  }

  /* ── file upload ── */
  const MAX_FILES = 3, MAX_BYTES = 5 * 1024 * 1024;

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = MAX_FILES - attachments.length;
    if (remaining <= 0) { setFileError(`Max ${MAX_FILES} failai.`); return; }
    const curBytes = attachments.reduce((s, a) => s + a.size, 0);
    for (const file of files.slice(0, remaining)) {
      if (curBytes + file.size > MAX_BYTES) { setFileError("5 MB limitas viršytas."); break; }
      const data = await readBase64(file);
      setAttachments((p) => [...p, { name: file.name, size: file.size, type: file.type, data }]);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  /* ── submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!scenario) return;
    if (!recipients.length) { setError("Pridėkite bent vieną gavėją."); return; }
    for (const r of recipients) {
      if (!r.email && !r.phone) {
        setError(`Gavėjui „${r.name || "?"}" nurodykite el. paštą arba telefoną.`);
        return;
      }
    }

    const rdDays =
      reminderType === "none" ? 0 :
      reminderType === "3d"   ? 3 :
      reminderType === "7d"   ? 7 :
      parseInt(reminderDays, 10) || 7;

    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          recipients,
          dueDate,
          description: description.trim(),
          itemDescription: loanType === "item" ? itemDescription.trim() : null,
          reminderType,
          reminderDays: rdDays,
          attachments,
          consent,
        }),
      });
      const data = await res.json() as {
        ids?: string[]; count?: number; totalAmount?: number; error?: string;
      };
      if (!res.ok) { setError(data.error ?? "Įvyko klaida."); return; }
      setSuccess({ ids: data.ids!, count: data.count!, totalAmount: data.totalAmount! });
    } catch {
      setError("Nepavyko prisijungti prie serverio.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setScenario(null); setLoanType("money"); setRecipients([]);
    setTotalAmount(""); setSplitEqually(true); setItemDescription("");
    setDueDate(""); setDescription(""); setReminderType("7d");
    setReminderDays("7"); setAttachments([]); setConsent(false);
    setSuccess(null); setError(null);
  }

  /* ── renders ── */
  if (success) return <SuccessScreen {...success} onNew={reset} />;

  return (
    <>
      {/* Scenario picker overlay */}
      {!scenario && (
        <ScenarioModal
          onSelect={setScenario}
          onClose={() => router.back()}
        />
      )}

      {/* Scenario badge + change */}
      {scenario && (() => {
        const Icon = SCENARIO_ICONS[scenario];
        const m = SCENARIO_META[scenario];
        return (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px] text-navy" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">{m.label}</p>
              <p className="text-xs text-slate-400">{m.sublabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setScenario(null)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-3 w-3" />
              Keisti
            </button>
          </div>
        );
      })()}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── 1. Gavėjai ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-navy">
            {multi ? "Gavėjai" : "Gavėjas"}
          </h2>

          {/* Loan type toggle */}
          {scenario === "loan" && (
            <div className="mb-4 flex gap-2">
              {(["money", "item"] as LoanType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLoanType(t)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    loanType === t
                      ? "border-[#00C853]/40 bg-[#00C853]/5 text-[#00b849] ring-2 ring-[#00C853]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t === "money" ? <Euro className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                  {t === "money" ? "Pinigai" : "Daiktas"}
                </button>
              ))}
            </div>
          )}

          <ContactPicker
            entries={recipients}
            multiple={multi}
            showAmount={multi && !splitEqually}
            amountLabel="Suma (€)"
            onChange={handleRecipientsChange}
          />
        </section>

        {/* ── 2. Suma ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-navy">
            <Euro className="h-4 w-4 text-[#00C853]" />
            {scenario === "loan" && loanType === "item" ? "Daikto aprašymas" : "Suma ir terminas"}
          </h2>

          <div className="space-y-4">
            {/* Loan item description */}
            {scenario === "loan" && loanType === "item" && (
              <label className="block text-sm font-medium text-slate-700">
                Daikto pavadinimas / aprašymas *
                <input
                  required
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="pvz.: Gitara, Fotoaparatas, Knyga..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </label>
            )}

            {/* Amount */}
            {!(scenario === "loan" && loanType === "item") && !multi && (
              <label className="block text-sm font-medium text-slate-700">
                Suma (€) *
                <div className="relative mt-1.5">
                  <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      recipients[0]?.amount
                        ? String(recipients[0].amount)
                        : ""
                    }
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setRecipients((prev) =>
                        prev.length
                          ? [{ ...prev[0], amount: v }]
                          : [{ id: crypto.randomUUID(), name: "", email: "", phone: "", amount: v, saveAsContact: false }]
                      );
                    }}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                  />
                </div>
              </label>
            )}

            {/* Group total + split mode */}
            {multi && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  {scenario === "group-fee" ? "Suma vienam (€) arba bendra suma *" : "Bendra suma (€) *"}
                  <div className="relative mt-1.5">
                    <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={totalAmount}
                      onChange={(e) => handleTotalChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                    />
                  </div>
                </label>
                <div className="flex gap-2">
                  {[
                    { val: true,  label: "Padalinti lygiomis dalimis" },
                    { val: false, label: "Nustatyti kiekvienam atskirai" },
                  ].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => handleSplitToggle(val)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        splitEqually === val
                          ? "border-[#00C853]/40 bg-[#00C853]/5 text-[#00b849] ring-2 ring-[#00C853]/20"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {splitEqually && recipients.length > 0 && totalAmount && (
                  <p className="text-xs text-slate-500">
                    Kiekvienam: <strong>{(parseFloat(totalAmount) / recipients.length).toFixed(2)} €</strong>
                    {" "}({recipients.length} {recipients.length === 1 ? "asmuo" : "asmenys"})
                  </p>
                )}
              </div>
            )}

            {/* Loan item – optional value */}
            {scenario === "loan" && loanType === "item" && (
              <label className="block text-sm font-medium text-slate-700">
                Apytikslė vertė (€) – neprivaloma
                <div className="relative mt-1.5">
                  <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={recipients[0]?.amount || ""}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setRecipients((prev) =>
                        prev.length
                          ? [{ ...prev[0], amount: v }]
                          : [{ id: crypto.randomUUID(), name: "", email: "", phone: "", amount: v, saveAsContact: false }]
                      );
                    }}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                  />
                </div>
              </label>
            )}

            {/* Due date */}
            <label className="block text-sm font-medium text-slate-700">
              Grąžinimo / apmokėjimo terminas *
              <div className="relative mt-1.5">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="date"
                  value={dueDate}
                  min={todayISO()}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </div>
            </label>

            {/* Description */}
            <label className="block text-sm font-medium text-slate-700">
              Aprašymas *
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  scenario === "group-fee"      ? "Renginio pavadinimas, mokestis..." :
                  scenario === "split-bill"     ? "Kokia sąskaita buvo padalinta..." :
                  scenario === "awaiting-share" ? "Ką apmokėjau, kieno dalis..." :
                  "Už ką skolinama, kontekstas..."
                }
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
              />
            </label>
          </div>
        </section>

        {/* ── 3. Priminimai ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-navy">
            <Bell className="h-4 w-4 text-[#00C853]" />
            Priminimai
            {multi && <span className="ml-1 text-xs font-normal text-slate-400">(kiekvienas gavėjas gauna atskirai)</span>}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {REMINDER_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  reminderType === opt.value
                    ? "border-[#00C853]/40 bg-[#00C853]/5 ring-2 ring-[#00C853]/20"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="reminderType"
                  value={opt.value}
                  checked={reminderType === opt.value}
                  onChange={() => setReminderType(opt.value)}
                  className="accent-[#00C853]"
                />
                <span className="text-sm font-medium text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
          {reminderType === "custom" && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700">
                Kas kiek dienų?
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={reminderDays}
                  onChange={(e) => setReminderDays(e.target.value)}
                  className="mt-1.5 w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
                />
              </label>
            </div>
          )}
        </section>

        {/* ── 4. Failai ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-navy">
            <Paperclip className="h-4 w-4 text-[#00C853]" />
            Prisegti failai
            <span className="ml-auto text-xs font-normal text-slate-400">
              {attachments.length}/{MAX_FILES} ·{" "}
              {formatSize(attachments.reduce((s, a) => s + a.size, 0))} / 5 MB
            </span>
          </h2>
          {attachments.length < MAX_FILES && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition hover:border-[#00C853]/40 hover:bg-[#00C853]/5">
              <Paperclip className="mb-1.5 h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Spustelėkite norėdami pridėti</span>
              <span className="mt-0.5 text-xs text-slate-400">PDF, Word, paveikslėliai · max 5 MB iš viso</span>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={handleFiles}
                className="sr-only"
              />
            </label>
          )}
          {fileError && (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{fileError}</p>
          )}
          {attachments.length > 0 && (
            <ul className="mt-3 space-y-2">
              {attachments.map((att, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{att.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{formatSize(att.size)}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Pašalinti"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── 5. Sutikimas + submit ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#00C853]"
            />
            <span>
              Patvirtinu, kad pateikta informacija yra teisinga. Sutinku, kad
              gavėjams būtų išsiųsti pranešimai ir priminimai pagal pasirinktą grafiką.
            </span>
          </label>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              <X className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              disabled={submitting || !scenario}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
            >
              {submitting
                ? "Kuriama…"
                : multi && recipients.length > 1
                ? `Sukurti ${recipients.length} prašymus`
                : "Sukurti prašymą"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </section>

      </form>
    </>
  );
}
