/** Kelionės / grupės išlaidų atsiskaitymas – kas kam kiek skolingas. */

export type TripParticipant = { id: string; name: string };

export type TripExpense = {
  id: string;
  payerId: string;
  amount: number;
  label: string;
  /** Kam dalijamos išlaidos (tušti = visi). */
  splitAmong: string[];
};

export type SettlementLine = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
};

/** Kiekvieno balansas: teigiamas = kiti jam skolingi, neigiamas = jis skolingas. */
export function computeBalances(
  participants: TripParticipant[],
  expenses: TripExpense[],
): Record<string, number> {
  const balances: Record<string, number> = {};
  for (const p of participants) balances[p.id] = 0;

  for (const exp of expenses) {
    const involved =
      exp.splitAmong.length > 0
        ? exp.splitAmong.filter((id) => balances[id] !== undefined)
        : participants.map((p) => p.id);
    if (!involved.length) continue;
    const share = exp.amount / involved.length;
    balances[exp.payerId] = (balances[exp.payerId] ?? 0) + exp.amount;
    for (const id of involved) {
      balances[id] = (balances[id] ?? 0) - share;
    }
  }

  return balances;
}

/** Supaprastina skolas į mažiausią skaičių pavedimų. */
export function simplifySettlements(
  participants: TripParticipant[],
  balances: Record<string, number>,
): SettlementLine[] {
  const nameById = Object.fromEntries(participants.map((p) => [p.id, p.name]));
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  for (const [id, bal] of Object.entries(balances)) {
    if (bal > 0.005) creditors.push({ id, amount: bal });
    else if (bal < -0.005) debtors.push({ id, amount: -bal });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const lines: SettlementLine[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const pay = Math.min(creditors[ci].amount, debtors[di].amount);
    if (pay > 0.005) {
      lines.push({
        from: debtors[di].id,
        fromName: nameById[debtors[di].id] ?? "?",
        to: creditors[ci].id,
        toName: nameById[creditors[ci].id] ?? "?",
        amount: Math.round(pay * 100) / 100,
      });
    }
    creditors[ci].amount -= pay;
    debtors[di].amount -= pay;
    if (creditors[ci].amount < 0.005) ci++;
    if (debtors[di].amount < 0.005) di++;
  }

  return lines;
}
