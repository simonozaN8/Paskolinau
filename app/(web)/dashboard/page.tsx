"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Bell,
  BookUser,
  CreditCard,
  FileText,
  LogOut,
  Mail,
  Phone,
  Plus,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { CreateRequestButton } from "@/components/ui/CreateRequestButton";
import {
  GroupRequestCard,
  SingleRequestCard,
  type DashRequest,
} from "@/components/dashboard/GroupRequestCard";

/* ─── stat card ─── */
function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; color: string; bg: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-navy">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </div>
  );
}

/* ─── group utility ─── */
function groupRequests(requests: DashRequest[]): DashRequest[][] {
  const groupMap = new Map<string, DashRequest[]>();
  const singles: DashRequest[] = [];
  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  for (const req of sorted) {
    if (req.groupId) {
      if (!groupMap.has(req.groupId)) groupMap.set(req.groupId, []);
      groupMap.get(req.groupId)!.push(req);
    } else {
      singles.push(req);
    }
  }
  // interleave: groups first, then singles; maintain create order
  const groupArrays = Array.from(groupMap.values());
  return [...groupArrays, ...singles.map((r) => [r])];
}

/* ─── main page ─── */
export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [requests,   setRequests]   = useState<DashRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [refresh,    setRefresh]    = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user) return;
    setReqLoading(true);
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() as Promise<DashRequest[]> : Promise.resolve([])))
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setReqLoading(false));
  }, [user, refresh]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onRefresh = () => setRefresh((n) => n + 1);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C853] border-t-transparent" />
      </div>
    );
  }
  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const total   = requests.length;
  const pending = requests.filter((r) => ["active", "confirmed"].includes(r.status)).length;
  const done    = requests.filter((r) => ["paid", "completed"].includes(r.status)).length;

  const grouped = groupRequests(requests);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
            {initials}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-navy">Sveiki, {user.firstName}!</h1>
            <p className="text-sm text-slate-500">Paskyros valdymo centras</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Atsijungti
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText}   label="Prašymų sukurta"  value={reqLoading ? "…" : String(total)}   color="text-blue-600"    bg="bg-blue-50"    />
        <StatCard icon={Bell}       label="Laukia atsakymo"  value={reqLoading ? "…" : String(pending)} color="text-amber-600"   bg="bg-amber-50"   />
        <StatCard icon={TrendingUp} label="Apmokėta"         value={reqLoading ? "…" : String(done)}    color="text-[#00C853]"   bg="bg-emerald-50" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* Account info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-navy">Paskyros informacija</h2>
          <ul className="space-y-3 text-sm">
            {[
              { icon: User,       label: "Vardas, Pavardė", value: `${user.firstName} ${user.lastName}` },
              { icon: Mail,       label: "El. paštas",      value: user.email        },
              { icon: Phone,      label: "Telefonas",       value: user.phone        },
              { icon: CreditCard, label: "Banko sąskaita",  value: user.bankAccount  },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="font-medium text-slate-800">{value}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
            <CreateRequestButton className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep">
              <Plus className="h-4 w-4" />
              Naujas prašymas
            </CreateRequestButton>
            <Link
              href="/dashboard/contacts"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <BookUser className="h-4 w-4" />
              Mano kontaktai
            </Link>
          </div>
        </div>

        {/* Requests list */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#00C853]" />
                <h2 className="text-base font-semibold text-navy">Mano prašymai</h2>
              </div>
              <CreateRequestButton className="inline-flex items-center gap-1.5 rounded-xl border border-[#00C853]/30 bg-[#00C853]/5 px-3 py-1.5 text-xs font-semibold text-[#00b849] transition hover:bg-[#00C853]/10">
                <Plus className="h-3.5 w-3.5" />
                Naujas
              </CreateRequestButton>
            </div>

            {reqLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#00C853] border-t-transparent" />
              </div>
            ) : grouped.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Dar neturite mokėjimo prašymų</p>
                <p className="mt-1 text-xs text-slate-400">
                  Sukurkite pirmąjį prašymą ir sistema pasirūpins priminimais
                </p>
                <CreateRequestButton className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep">
                  Sukurti prašymą
                </CreateRequestButton>
              </div>
            ) : (
              <div className="space-y-3">
                {grouped.map((group) =>
                  group.length > 1 ? (
                    <GroupRequestCard
                      key={group[0].groupId!}
                      requests={group}
                      onRefresh={onRefresh}
                    />
                  ) : (
                    <ul key={group[0].id} className="divide-y divide-slate-100">
                      <SingleRequestCard
                        request={group[0]}
                        onRefresh={onRefresh}
                      />
                    </ul>
                  )
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
