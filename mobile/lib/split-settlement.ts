import type { RecipientEntry } from "./request-types";

export type SettlementLine = {
  from: string;
  to: string;
  amount: number;
};

/** Minimalizuoja pavedimus tarp dalyvių pagal sumokėta vs. dalį. */
export function computeSettlements(
  participants: Pick<RecipientEntry, "name" | "amount" | "paidAmount">[],
): SettlementLine[] {
  const balances = participants
    .filter((p) => p.name.trim())
    .map((p) => ({
      name: p.name.trim(),
      balance: Math.round((p.paidAmount - p.amount) * 100) / 100,
    }))
    .filter((p) => Math.abs(p.balance) > 0.005);

  const creditors = balances
    .filter((b) => b.balance > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.balance - a.balance);
  const debtors = balances
    .filter((b) => b.balance < 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.balance - b.balance);

  const lines: SettlementLine[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const pay = Math.min(creditors[i].balance, -debtors[j].balance);
    const amount = Math.round(pay * 100) / 100;
    if (amount > 0) {
      lines.push({ from: debtors[j].name, to: creditors[i].name, amount });
    }
    creditors[i].balance -= amount;
    debtors[j].balance += amount;
    if (creditors[i].balance < 0.005) i++;
    if (debtors[j].balance > -0.005) j++;
  }

  return lines;
}
