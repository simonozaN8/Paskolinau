export type Scenario =
  | "loan"
  | "group-fee"
  | "split-bill"
  | "awaiting-share";

export type LoanType = "money" | "item";

export type RecipientEntry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  paidAmount: number;
  saveAsContact: boolean;
};

export type SavedContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export type Attachment = {
  name: string;
  size: number;
  type: string;
  data: string;
};

export const SCENARIO_META: Record<
  Scenario,
  { label: string; sublabel: string; quickLabel: string }
> = {
  loan: {
    label: "Paskolinau daiktą ar pinigus",
    sublabel: "Vienas gavėjas, konkreti suma arba daiktas",
    quickLabel: "Paskolinau",
  },
  "group-fee": {
    label: "Surenku grupinę rinklevą",
    sublabel: "Keli gavėjai – masinis surinkimas",
    quickLabel: "Surenku",
  },
  "split-bill": {
    label: "Padalinau sąskaitą keliems",
    sublabel: "Čekis, dalys ir tarpusavio skolos",
    quickLabel: "Padalinau",
  },
  "awaiting-share": {
    label: "Apmokėjau ir laukiu dalies",
    sublabel: "Jūs sumokėjote – renkate kitų dalį",
    quickLabel: "Apmokėjau",
  },
};

export const SCENARIO_ORDER: Scenario[] = [
  "loan",
  "split-bill",
  "group-fee",
  "awaiting-share",
];
