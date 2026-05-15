export type Scenario =
  | "loan"           // Paskolinau daiktą ar pinigus
  | "group-fee"      // Surenku grupinę rinklevą
  | "split-bill"     // Padalinau sąskaitą keliems asmenims
  | "awaiting-share" // Apmokėjau ir laukiu dalies

export type LoanType = "money" | "item"

export type AmountMode = "per-person" | "total"

export type RecipientEntry = {
  id: string          // local React key (crypto.randomUUID)
  name: string
  email: string
  phone: string
  amount: number      // per-recipient amount (calculated on client before submit)
  saveAsContact: boolean
}

export type SavedContact = {
  id: string
  name: string
  email: string | null
  phone: string | null
}

export type Attachment = {
  name: string
  size: number
  type: string
  data: string // base64 data URL
}

export const SCENARIO_META: Record<
  Scenario,
  { label: string; sublabel: string }
> = {
  loan: {
    label: "Paskolinau daiktą ar pinigus",
    sublabel: "Vienas gavėjas, konkreti suma arba daiktas",
  },
  "group-fee": {
    label: "Surenku grupinę rinklevą",
    sublabel: "Keli gavėjai, kiekvienas moka savo dalį",
  },
  "split-bill": {
    label: "Padalinau sąskaitą keliems",
    sublabel: "Bendra suma dalijama lygiomis dalimis",
  },
  "awaiting-share": {
    label: "Apmokėjau ir laukiu dalies",
    sublabel: "Jau sumokėjau – prašau grąžinti dalį",
  },
}
