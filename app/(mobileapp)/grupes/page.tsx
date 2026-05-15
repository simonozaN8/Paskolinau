"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Plus, Users } from "lucide-react";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";
import type { DashRequest } from "@/components/dashboard/GroupRequestCard";

type Group = { groupId: string; title: string; members: DashRequest[]; total: number; collected: number };

export default function GrupesPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then((all: DashRequest[]) => {
        const map = new Map<string, DashRequest[]>();
        all.filter((r) => r.groupId).forEach((r) => {
          if (!map.has(r.groupId!)) map.set(r.groupId!, []);
          map.get(r.groupId!)!.push(r);
        });
        const gs: Group[] = Array.from(map.entries()).map(([gid, members]) => ({
          groupId: gid,
          title: members[0].description,
          members,
          total: members.reduce((s, m) => s + Number(m.amount), 0),
          collected: members.filter((m) => ["paid","completed"].includes(m.status)).reduce((s, m) => s + Number(m.amount), 0),
        }));
        setGroups(gs);
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="logo" />

      <div className="flex items-center justify-between px-4 pb-4">
        <h1 className="text-xl font-bold text-navy">Grupės</h1>
        <Link
          href="/prasymas/naujas"
          className="flex items-center gap-1.5 rounded-xl bg-navy px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Nauja
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#00C853] border-t-transparent" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center py-16 px-6 text-center">
          <Users className="mb-3 h-12 w-12 text-slate-200" />
          <p className="text-sm font-medium text-slate-500">Dar nėra grupių</p>
          <p className="mt-1 text-xs text-slate-400">Sukurkite grupinę rinkliavą ar padalinkite išlaidas</p>
          <Link
            href="/prasymas/naujas"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Sukurti grupę
          </Link>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {groups.map((g) => {
            const pct = g.total > 0 ? Math.round((g.collected / g.total) * 100) : 0;
            const paid = g.members.filter((m) => ["paid","completed"].includes(m.status)).length;
            return (
              <Link
                key={g.groupId}
                href={`/grupes/${g.groupId}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50">
                  <Users className="h-5 w-5 text-orange-400" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-navy">{g.title}</p>
                  <p className="text-xs text-slate-500">{paid}/{g.members.length} sumokėjo</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-1.5">
                      <div className="h-full rounded-full bg-[#00C853]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-[#00C853]">{pct}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy">{g.total.toFixed(2).replace(".", ",")} €</p>
                  <p className="text-xs text-slate-400">{g.collected.toFixed(2).replace(".", ",")} € surinkta</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
