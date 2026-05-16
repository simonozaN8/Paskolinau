"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Clock,
  Loader2,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { ConfirmQrCard } from "@/components/requests/ConfirmQrCard";
import { STATUS_CFG, type DashRequest } from "@/components/dashboard/GroupRequestCard";

type FullRequest = DashRequest & {
  recipientEmail: string | null;
  recipientPhone: string | null;
  reminderType: string;
  reminderDays: number;
  nextReminderAt: string | null;
  lastRemindedAt: string | null;
};

type Props = {
  requestId: string | null;
  onClose: () => void;
  onRefresh: () => void;
};

function fmtDt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("lt-LT", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const REMINDER_OPTIONS = [
  { value: "none", label: "Be automatinio priminimo" },
  { value: "3d", label: "Kas 3 dienas" },
  { value: "7d", label: "Kas 7 dienas" },
  { value: "weekly", label: "Kas savaitę" },
  { value: "custom", label: "Pasirinktinai (dienomis)" },
] as const;

export function RequestDetailModal({ requestId, onClose, onRefresh }: Props) {
  const [req, setReq] = useState<FullRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reminderType, setReminderType] = useState("7d");
  const [reminderDays, setReminderDays] = useState("7");
  const [scheduleAt, setScheduleAt] = useState("");

  const load = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/requests/${requestId}`);
      if (!res.ok) throw new Error("Nepavyko užkrauti");
      const data = (await res.json()) as FullRequest;
      setReq(data);
      setReminderType(data.reminderType);
      setReminderDays(String(data.reminderDays));
      if (data.nextReminderAt) {
        const d = new Date(data.nextReminderAt);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setScheduleAt(local);
      } else {
        setScheduleAt("");
      }
    } catch {
      setError("Prašymas nerastas");
      setReq(null);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (requestId) load();
    else setReq(null);
  }, [requestId, load]);

  useEffect(() => {
    if (!requestId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [requestId, onClose]);

  async function saveReminderSettings() {
    if (!req) return;
    setActing("save");
    setError(null);
    try {
      const days =
        reminderType === "none" ? 0 :
        reminderType === "3d" ? 3 :
        reminderType === "7d" ? 7 :
        parseInt(reminderDays, 10) || 7;
      const res = await fetch(`/api/requests/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderType, reminderDays: days }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error ?? "Klaida");
      }
      await load();
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Klaida");
    } finally {
      setActing(null);
    }
  }

  async function remindNow() {
    if (!req) return;
    setActing("remind");
    setError(null);
    try {
      const res = await fetch(`/api/requests/${req.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remind" }),
      });
      const d = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(d.error ?? "Nepavyko išsiųsti");
      await load();
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Klaida");
    } finally {
      setActing(null);
    }
  }

  async function scheduleReminder() {
    if (!req || !scheduleAt) {
      setError("Pasirinkite priminimo datą ir laiką");
      return;
    }
    const at = new Date(scheduleAt);
    if (at <= new Date()) {
      setError("Laikas turi būti ateityje");
      return;
    }
    setActing("schedule");
    setError(null);
    try {
      const res = await fetch(`/api/requests/${req.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "schedule_remind", scheduledAt: at.toISOString() }),
      });
      const d = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(d.error ?? "Nepavyko suplanuoti");
      await load();
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Klaida");
    } finally {
      setActing(null);
    }
  }

  if (!requestId) return null;

  const st = req ? STATUS_CFG[req.status] ?? STATUS_CFG.active : null;
  const canRemind =
    req &&
    ["active", "confirmed", "reminded"].includes(req.status) &&
    (req.recipientEmail || req.recipientPhone);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        aria-label="Uždaryti"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-navy">Prašymo detalės</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
            </div>
          )}
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          {req && st && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xl font-bold text-navy">{req.recipientName}</p>
                  <p className="mt-1 text-sm text-slate-600">{req.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.cls}`}>
                  {st.label}
                </span>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Info icon={Clock} label="Sukurta" value={fmtDt(req.createdAt)} />
                <Info icon={Calendar} label="Terminas" value={fmtDt(req.dueDate)} />
                <Info
                  icon={Bell}
                  label="Paskutinis priminimas"
                  value={fmtDt(req.lastRemindedAt)}
                />
                <Info
                  icon={Bell}
                  label="Suplanuotas priminimas"
                  value={fmtDt(req.nextReminderAt)}
                />
                {req.recipientEmail && (
                  <Info icon={Mail} label="El. paštas" value={req.recipientEmail} />
                )}
                {req.recipientPhone && (
                  <Info icon={Phone} label="Telefonas" value={req.recipientPhone} />
                )}
              </div>

              <p className="text-2xl font-bold text-navy">
                {req.amount > 0 ? `${req.amount.toFixed(2)} €` : req.itemDescription ?? "—"}
              </p>

              {req.confirmToken && !["completed", "cancelled"].includes(req.status) && (
                <ConfirmQrCard
                  confirmToken={req.confirmToken}
                  recipientName={req.recipientName}
                  compact
                />
              )}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-navy">Priminimai</p>
                <p className="mt-1 text-xs text-slate-500">
                  Siųskite dabar arba suplanuokite būsimą priminimą gavėjui.
                </p>

                <label className="mt-4 block text-xs font-medium text-slate-600">
                  Automatinio priminimo dažnis (ateityje)
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {REMINDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {reminderType === "custom" && (
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={reminderDays}
                    onChange={(e) => setReminderDays(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Dienų intervalas"
                  />
                )}
                <button
                  type="button"
                  disabled={acting === "save"}
                  onClick={() => void saveReminderSettings()}
                  className="mt-2 text-xs font-semibold text-[#00C853] hover:underline disabled:opacity-50"
                >
                  Išsaugoti priminimų nustatymus
                </button>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <label className="block text-xs font-medium text-slate-600">
                    Suplanuoti priminimą (data ir laikas)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleAt}
                    onChange={(e) => setScheduleAt(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    disabled={!canRemind || acting === "schedule"}
                    onClick={() => void scheduleReminder()}
                    className="mt-3 w-full rounded-xl border border-navy bg-white py-2.5 text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    {acting === "schedule" ? "Planuojama…" : "Suplanuoti priminimą"}
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!canRemind || acting === "remind"}
                  onClick={() => void remindNow()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
                >
                  {acting === "remind" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  Siųsti priminimą dabar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
