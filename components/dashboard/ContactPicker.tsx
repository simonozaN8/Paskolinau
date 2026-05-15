"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Phone,
  Plus,
  Search,
  Smartphone,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { RecipientEntry, SavedContact } from "@/lib/request-types";

/* ── Contact Picker API types ── */
declare global {
  interface Navigator {
    contacts?: {
      select(
        properties: string[],
        options?: { multiple?: boolean }
      ): Promise<{ name?: string[]; email?: string[]; tel?: string[] }[]>;
    };
  }
}

function hasContactsAPI(): boolean {
  return typeof navigator !== "undefined" && "contacts" in navigator;
}

/* ── helpers ── */

function newEntry(overrides?: Partial<RecipientEntry>): RecipientEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
    amount: 0,
    saveAsContact: false,
    ...overrides,
  };
}

/* ── Individual recipient row ── */

type RecipientRowProps = {
  entry: RecipientEntry;
  showAmount?: boolean;
  amountLabel?: string;
  canRemove: boolean;
  onChange: (updated: RecipientEntry) => void;
  onRemove: () => void;
};

function RecipientRow({
  entry,
  showAmount,
  amountLabel,
  canRemove,
  onChange,
  onRemove,
}: RecipientRowProps) {
  const up = (field: keyof RecipientEntry) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...entry, [field]: e.target.value });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
          <User className="h-3.5 w-3.5 text-slate-500" />
        </span>
        <div className="flex-1 font-medium text-sm text-navy truncate">
          {entry.name || <span className="text-slate-400 font-normal">Naujas gavėjas</span>}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Pašalinti"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-slate-600">
          Vardas *
          <input
            required
            type="text"
            value={entry.name}
            onChange={up("name")}
            placeholder="Jonas Jonaitis"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
          />
        </label>
        {showAmount && (
          <label className="block text-xs font-medium text-slate-600">
            {amountLabel ?? "Suma (€)"} *
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={entry.amount || ""}
              onChange={(e) => onChange({ ...entry, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
            />
          </label>
        )}
        <label className="block text-xs font-medium text-slate-600">
          El. paštas
          <input
            type="email"
            value={entry.email}
            onChange={up("email")}
            placeholder="jonas@pastas.lt"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
          />
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Telefonas
          <input
            type="tel"
            value={entry.phone}
            onChange={up("phone")}
            placeholder="+370 600 00 000"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
          />
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <input
          type="checkbox"
          checked={entry.saveAsContact}
          onChange={(e) => onChange({ ...entry, saveAsContact: e.target.checked })}
          className="rounded border-slate-300 accent-[#00C853]"
        />
        Išsaugoti į mano kontaktus
      </label>
    </div>
  );
}

/* ── Add-contact dropdown ── */

type AddPanelProps = {
  onAdd: (entry: RecipientEntry) => void;
  onClose: () => void;
};

function AddPanel({ onAdd, onClose }: AddPanelProps) {
  const [search, setSearch] = useState("");
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])) as Promise<SavedContact[]>)
      .then(setSavedContacts)
      .finally(() => setLoadingContacts(false));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = savedContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search)
  );

  async function pickFromDevice() {
    if (!hasContactsAPI()) return;
    try {
      const contacts = await navigator.contacts!.select(
        ["name", "email", "tel"],
        { multiple: false }
      );
      if (contacts.length > 0) {
        const c = contacts[0];
        onAdd(
          newEntry({
            name:  c.name?.[0]  ?? "",
            email: c.email?.[0] ?? "",
            phone: c.tel?.[0]   ?? "",
          })
        );
      }
    } catch {
      /* user cancelled or permission denied */
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={panelRef}
        className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
      >
        {hasContactsAPI() && (
          <div className="border-b border-slate-100 p-3">
            <button
              type="button"
              onClick={pickFromDevice}
              className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Smartphone className="h-4 w-4 text-[#00C853]" />
              Importuoti iš telefono kontaktų
            </button>
          </div>
        )}

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ieškoti išsaugotų kontaktų..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#00C853]/50 focus:ring-2 focus:ring-[#00C853]/20"
              autoFocus
            />
          </div>

          {loadingContacts ? (
            <p className="py-4 text-center text-xs text-slate-400">Kraunama…</p>
          ) : filtered.length > 0 ? (
            <ul className="mt-2 max-h-48 overflow-y-auto divide-y divide-slate-50">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onAdd(newEntry({ name: c.name, email: c.email ?? "", phone: c.phone ?? "" }))
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {c.name[0].toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy">{c.name}</p>
                      <p className="truncate text-xs text-slate-400">
                        {c.email ?? c.phone ?? "—"}
                      </p>
                    </div>
                    <Check className="ml-auto h-4 w-4 shrink-0 text-[#00C853] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-3 text-center text-xs text-slate-400">
              {search ? "Kontaktų nerasta" : "Dar nėra išsaugotų kontaktų"}
            </p>
          )}
        </div>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => onAdd(newEntry())}
            className="flex w-full items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" />
            Pridėti naują kontaktą rankiniu būdu
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Main ContactPicker ── */

export type ContactPickerProps = {
  entries: RecipientEntry[];
  multiple?: boolean;
  showAmount?: boolean;
  amountLabel?: string;
  onChange: (entries: RecipientEntry[]) => void;
};

export function ContactPicker({
  entries,
  multiple = false,
  showAmount = false,
  amountLabel,
  onChange,
}: ContactPickerProps) {
  const [addOpen, setAddOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  function addEntry(entry: RecipientEntry) {
    setAddOpen(false);
    onChange([...entries, entry]);
  }

  function updateEntry(idx: number, updated: RecipientEntry) {
    const next = [...entries];
    next[idx] = updated;
    onChange(next);
  }

  function removeEntry(idx: number) {
    onChange(entries.filter((_, i) => i !== idx));
  }

  const canAddMore = multiple || entries.length === 0;

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <RecipientRow
          key={entry.id}
          entry={entry}
          showAmount={showAmount}
          amountLabel={amountLabel}
          canRemove={entries.length > 1}
          onChange={(u) => updateEntry(i, u)}
          onRemove={() => removeEntry(i)}
        />
      ))}

      {canAddMore && (
        <div ref={wrapRef} className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-3 text-sm font-medium text-slate-600 transition hover:border-[#00C853]/40 hover:bg-[#00C853]/5 hover:text-[#00b849]"
          >
            <Plus className="h-4 w-4" />
            {entries.length === 0
              ? "Pridėti gavėją"
              : "Pridėti dar vieną gavėją"}
            <ChevronDown className={`h-4 w-4 transition-transform ${addOpen ? "rotate-180" : ""}`} />
          </button>
          {addOpen && (
            <AddPanel onAdd={addEntry} onClose={() => setAddOpen(false)} />
          )}
        </div>
      )}

      {/* Mobile fallback hint */}
      {!hasContactsAPI() && entries.some((e) => !e.phone) && (
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Phone className="h-3 w-3" />
          Jūsų naršyklė nepalaiko kontaktų importavimo – įveskite numerį rankiniu būdu.
        </p>
      )}

      {/* Summary chips (group) */}
      {multiple && entries.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {entries.map((e) => (
            <span
              key={e.id}
              className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-xs font-medium text-navy"
            >
              {e.name || "—"}
              <button
                type="button"
                onClick={() => removeEntry(entries.indexOf(e))}
                className="text-navy/40 hover:text-red-500"
                aria-label="Pašalinti"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
