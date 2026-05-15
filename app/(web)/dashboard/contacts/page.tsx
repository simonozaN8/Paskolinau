"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Mail,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import type { SavedContact } from "@/lib/request-types";

/* ─── Edit row ─── */

function EditRow({
  contact,
  onSave,
  onCancel,
}: {
  contact: SavedContact;
  onSave: (updated: Omit<SavedContact, "id">) => void;
  onCancel: () => void;
}) {
  const [name,  setName]  = useState(contact.name);
  const [email, setEmail] = useState(contact.email ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Vardas privalomas."); return; }
    if (!email.trim() && !phone.trim()) { setErr("Nurodykite el. paštą arba telefoną."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || null, phone: phone.trim() || null }),
      });
      const data = await res.json() as SavedContact & { error?: string };
      if (!res.ok) { setErr(data.error ?? "Klaida"); return; }
      onSave({ name: data.name, email: data.email, phone: data.phone });
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#00C853]/30 bg-white p-4 shadow-sm ring-2 ring-[#00C853]/15">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-xs font-medium text-slate-600">
          Vardas *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/30"
          />
        </label>
        <label className="block text-xs font-medium text-slate-600">
          El. paštas
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/30"
          />
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Telefonas
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/30"
          />
        </label>
      </div>
      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
          <X className="h-3 w-3" /> Atšaukti
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep disabled:opacity-60">
          <Save className="h-3 w-3" /> {saving ? "Saugoma…" : "Išsaugoti"}
        </button>
      </div>
    </form>
  );
}

/* ─── Add form ─── */

function AddForm({ onAdded, onCancel }: { onAdded: (c: SavedContact) => void; onCancel: () => void }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Vardas privalomas."); return; }
    if (!email.trim() && !phone.trim()) { setErr("Nurodykite el. paštą arba telefoną."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || null, phone: phone.trim() || null }),
      });
      const data = await res.json() as SavedContact & { error?: string };
      if (!res.ok) { setErr(data.error ?? "Klaida"); return; }
      onAdded(data);
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#00C853]/30 bg-[#00C853]/5 p-4 ring-2 ring-[#00C853]/15">
      <p className="mb-3 text-sm font-semibold text-navy">Naujas kontaktas</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-xs font-medium text-slate-600">
          Vardas *
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Jonas Jonaitis"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/30"
          />
        </label>
        <label className="block text-xs font-medium text-slate-600">
          El. paštas
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="jonas@pastas.lt"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/30"
          />
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Telefonas
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="+370 600 00 000"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/30"
          />
        </label>
      </div>
      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
          <X className="h-3 w-3" /> Atšaukti
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-[#00C853] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#00b849] disabled:opacity-60">
          <Check className="h-3 w-3" /> {saving ? "Saugoma…" : "Pridėti"}
        </button>
      </div>
    </form>
  );
}

/* ─── Main page ─── */

export default function ContactsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [contacts, setContacts]   = useState<SavedContact[]>([]);
  const [fetching, setFetching]   = useState(true);
  const [editId,   setEditId]     = useState<string | null>(null);
  const [adding,   setAdding]     = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/contacts")
      .then((r) => (r.ok ? r.json() : []) as Promise<SavedContact[]>)
      .then(setContacts)
      .finally(() => setFetching(false));
  }, [user]);

  async function deleteContact(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (res.ok) setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  if (loading || fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C853] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Grįžti į paskyrą
      </Link>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mano kontaktai</h1>
          <p className="mt-1 text-sm text-slate-500">
            {contacts.length === 0 ? "Dar nėra kontaktų" : `${contacts.length} kontakt${contacts.length === 1 ? "as" : "ų"}`}
          </p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" />
            Pridėti kontaktą
          </button>
        )}
      </div>

      <div className="space-y-3">
        {adding && (
          <AddForm
            onAdded={(c) => { setContacts((prev) => [c, ...prev]); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        )}

        {contacts.length === 0 && !adding && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
            <User className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Dar nėra išsaugotų kontaktų</p>
            <p className="mt-1 text-xs text-slate-400">
              Pridėkite kontaktą – kitą kartą galėsite pasirinkti jį kuriant prašymą
            </p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" />
              Pridėti pirmą kontaktą
            </button>
          </div>
        )}

        {contacts.map((c) =>
          editId === c.id ? (
            <EditRow
              key={c.id}
              contact={c}
              onSave={(updated) => {
                setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...c, ...updated } : x)));
                setEditId(null);
              }}
              onCancel={() => setEditId(null)}
            />
          ) : (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {c.name[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{c.name}</p>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                  {c.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />{c.email}
                    </span>
                  )}
                  {c.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />{c.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => { setEditId(c.id); setAdding(false); }}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                  aria-label="Redaguoti"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteContact(c.id)}
                  disabled={deleting === c.id}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  aria-label="Ištrinti"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
