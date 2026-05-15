import type { DashRequest } from "./types";

export type HistoryTab = "Visi" | "Aktyvūs" | "Apmokėti" | "Atšaukti";

export function matchesHistoryTab(r: DashRequest, tab: HistoryTab): boolean {
  if (tab === "Aktyvūs") return ["active", "confirmed", "reminded"].includes(r.status);
  if (tab === "Apmokėti") return ["paid", "completed"].includes(r.status);
  if (tab === "Atšaukti") return r.status === "cancelled";
  return true;
}

export function isPaidStatus(status: string) {
  return status === "paid" || status === "completed";
}

/** Grupuoja pagal groupId; vieniški prašymai – masyvas su 1 elementu. */
export function groupRequests(requests: DashRequest[]): DashRequest[][] {
  const groupMap = new Map<string, DashRequest[]>();
  const singles: DashRequest[] = [];
  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  for (const req of sorted) {
    if (req.groupId) {
      if (!groupMap.has(req.groupId)) groupMap.set(req.groupId, []);
      groupMap.get(req.groupId)!.push(req);
    } else {
      singles.push(req);
    }
  }

  const groupArrays = Array.from(groupMap.values()).map((g) =>
    [...g].sort((a, b) => a.recipientName.localeCompare(b.recipientName, "lt")),
  );

  return [...groupArrays, ...singles.map((r) => [r])];
}

/** Filtruoja grupes: rodoma jei bent vienas narys atitinka tab. */
export function filterGroupedByTab(groups: DashRequest[][], tab: HistoryTab): DashRequest[][] {
  return groups.filter((group) => group.some((r) => matchesHistoryTab(r, tab)));
}
