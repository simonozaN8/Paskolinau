"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Send, Target, Upload, UserPlus } from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";
import type { DashRequest } from "@/components/dashboard/GroupRequestCard";

const STATUS_LABELS: Record<string, string> = {
  active: "Laukia", confirmed: "Patvirtinta", paid: "Sumokėta",
  completed: "Apmokėta", cancelled: "Atšaukta", reminded: "Priminta",
};
const STATUS_COLORS: Record<string, string> = {
  active: "bg-blue-50 text-blue-700", confirmed: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700", completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500", reminded: "bg-orange-50 text-orange-700",
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700", "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700", "bg-teal-100 text-teal-700",
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function GrupesRinkliavaPage() {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<DashRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [remindLoading, setRemindLoading] = useState(false);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then((all: DashRequest[]) => setMembers(all.filter((r) => r.groupId === id)))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [id]);

  async function sendReminders() {
    setRemindLoading(true);
    await Promise.all(
      members
        .filter((m) => !["paid", "completed"].includes(m.status))
        .map((m) =>
          fetch(`/api/requests/${m.id}/status`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "remind" }),
          }),
        ),
    );
    setRemindLoading(false);
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
    </div>
  );

  if (members.length === 0) return (
    <div className="flex min-h-screen flex-col">
      <MobileAppBar variant="back" title="Grupės rinkliava" showMore />
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Grupė nerasta</div>
    </div>
  );

  const first = members[0];
  const title = first.description;
  const totalGoal = members.reduce((s, m) => s + Number(m.amount), 0);
  const collected = members.filter((m) => ["paid", "completed"].includes(m.status)).reduce((s, m) => s + Number(m.amount), 0);
  const pct = totalGoal > 0 ? Math.round((collected / totalGoal) * 100) : 0;
  const createdDate = new Date(first.createdAt).toLocaleDateString("lt-LT");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <MobileAppBar variant="back" title="Grupės rinkliava" showMore />
      </div>

      {/* Summary card */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-start gap-3 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50">
            <Target className="h-6 w-6 text-orange-400" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-navy">{title}</p>
            <p className="text-xs text-slate-500">Rinkliava sukurta {createdDate}</p>
            <p className="text-xs text-slate-500">{members.length} narių</p>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
          <div className="px-4 py-3">
            <p className="text-xs text-slate-500">Tikslinė suma</p>
            <p className="text-base font-bold text-navy">{totalGoal.toFixed(2).replace(".", ",")} €</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-slate-500">Surinkta</p>
            <p className="text-base font-bold text-[#00C853]">{collected.toFixed(2).replace(".", ",")} €</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2.5">
              <div className="h-full rounded-full bg-[#00C853] transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-[#00C853]">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-navy">
          <Upload className="h-4 w-4" /> Importuoti kontaktus
        </button>
        <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-navy">
          <UserPlus className="h-4 w-4" /> Pridėti narį
        </button>
      </div>

      {/* Members */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-navy">Nariai ({members.length})</p>
          <button type="button" className="flex items-center gap-0.5 text-xs font-semibold text-[#00C853]">
            Žiūrėti visus <span className="ml-0.5">›</span>
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {members.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold", AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                {initials(m.recipientName)}
              </span>
              <p className="flex-1 text-sm font-medium text-navy">{m.recipientName}</p>
              <span className="text-sm font-semibold text-navy">
                {Number(m.amount).toFixed(2).replace(".", ",")} €
              </span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", STATUS_COLORS[m.status] ?? STATUS_COLORS.active)}>
                {STATUS_LABELS[m.status] ?? "Laukia"}
              </span>
              <span className="text-slate-300">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Send reminders */}
      <div className="mx-4 mt-4 mb-2">
        <button
          type="button"
          onClick={sendReminders}
          disabled={remindLoading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-navy py-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        >
          {remindLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Siųsti priminimus
        </button>
      </div>
    </div>
  );
}
