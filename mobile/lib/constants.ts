import type { DashRequest } from "./types";

export const STATUS_LABELS: Record<string, string> = {
  active: "Laukia",
  confirmed: "Patvirtinta",
  paid: "Sumokėta",
  completed: "Apmokėta",
  cancelled: "Atšaukta",
  reminded: "Priminta",
};

export const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  active: { bg: "#EFF6FF", text: "#1D4ED8" },
  confirmed: { bg: "#EFF6FF", text: "#1D4ED8" },
  paid: { bg: "#ECFDF5", text: "#047857" },
  completed: { bg: "#ECFDF5", text: "#047857" },
  cancelled: { bg: "#F1F5F9", text: "#64748B" },
  reminded: { bg: "#FFF7ED", text: "#C2410C" },
};

export function formatMoney(amount: number | string): string {
  return `${Number(amount).toFixed(2).replace(".", ",")} €`;
}

export function formatDate(d?: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("lt-LT");
}

export function formatDateTime(d?: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("lt-LT", { dateStyle: "short", timeStyle: "short" });
}

export function requestTitle(req: DashRequest): string {
  return req.itemDescription ?? req.description ?? "—";
}
