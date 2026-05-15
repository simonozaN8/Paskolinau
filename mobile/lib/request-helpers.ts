import type { RecipientEntry } from "./request-types";

export function newEntry(overrides?: Partial<RecipientEntry>): RecipientEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: "",
    email: "",
    phone: "",
    amount: 0,
    paidAmount: 0,
    saveAsContact: false,
    ...overrides,
  };
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function isGroupScenario(scenario: string) {
  return scenario !== "loan";
}

export function recalcAmounts(
  entries: RecipientEntry[],
  total: string,
  equally: boolean,
): RecipientEntry[] {
  if (!equally || !entries.length) return entries;
  const per = parseFloat(total) / entries.length;
  if (isNaN(per)) return entries;
  const rounded = Math.round(per * 100) / 100;
  return entries.map((e) => ({ ...e, amount: rounded }));
}

export function formatEur(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}
