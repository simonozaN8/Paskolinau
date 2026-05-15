import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ArrowLeft, Check } from "lucide-react";
import { saveFieldAction } from "./actions";

const FIELD_META: Record<string, { label: string; hint?: string; type?: string }> = {
  firstName:   { label: "Vardas" },
  lastName:    { label: "Pavardė" },
  phone:       { label: "Telefono numeris", type: "tel" },
  bankAccount: { label: "Banko sąskaita (IBAN)", hint: "Šis IBAN bus rodomas gavėjui, kai siųsite prašymą." },
};

type Props = { params: Promise<{ field: string }> };

export default async function EditFieldPage({ params }: Props) {
  const { field } = await params;
  const meta = FIELD_META[field];
  if (!meta) redirect("/profilis");

  const user = await getSessionUser();
  if (!user) redirect("/prisijungti");

  const currentValue = (user as Record<string, unknown>)[field] as string ?? "";

  const action = saveFieldAction.bind(null, field as "firstName" | "lastName" | "phone" | "bankAccount");

  return (
    <div className="flex min-h-screen flex-col bg-white px-5 pt-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6">
        <a href="/profilis" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-navy" />
        </a>
        <h1 className="text-lg font-bold text-navy">{meta.label}</h1>
      </div>

      {/* Form — plain HTML POST, works without JavaScript */}
      <form action={action} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">{meta.label}</label>
          <input
            name="value"
            type={meta.type ?? "text"}
            defaultValue={currentValue}
            autoFocus
            className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#00C853]/60 focus:ring-2 focus:ring-[#00C853]/20"
          />
          {meta.hint && <p className="mt-1.5 text-xs text-slate-400">{meta.hint}</p>}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-4 text-sm font-semibold text-white active:opacity-80"
        >
          <Check className="h-4 w-4" /> Išsaugoti
        </button>
      </form>

      <a
        href="/profilis"
        className="mt-4 block text-center text-sm text-slate-400 hover:underline"
      >
        Atšaukti
      </a>
    </div>
  );
}
