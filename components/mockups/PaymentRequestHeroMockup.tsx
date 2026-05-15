import {
  Bell,
  BookUser,
  Check,
  Eye,
  Handshake,
  LayoutDashboard,
  Plus,
  Send,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── status dot ─── */
function StatusStep({
  label,
  done,
  active,
}: {
  label: string;
  done: boolean;
  active?: boolean;
}) {
  return (
    <li className="flex items-center gap-2.5 text-xs">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          done
            ? "bg-[#00C853] text-white"
            : active
            ? "border-2 border-[#00C853] bg-white"
            : "bg-slate-100",
        )}
      >
        {done && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className={done || active ? "font-medium text-navy" : "text-slate-400"}>
        {label}
      </span>
    </li>
  );
}

/* ─── main mockup ─── */
export function PaymentRequestHeroMockup({ className }: { className?: string }) {
  return (
    <div className={cn("p-3 sm:p-4", className)}>
      <div className="flex gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">

        {/* Sidebar */}
        <aside className="hidden w-12 shrink-0 flex-col items-center gap-5 border-r border-slate-100 pr-3 pt-1 sm:flex">
          <User className="h-5 w-5 text-slate-300" />
          <LayoutDashboard className="h-5 w-5 text-[#00C853]" />
          <BookUser className="h-5 w-5 text-slate-300" />
        </aside>

        <div className="min-w-0 flex-1 space-y-3">

          {/* Topbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Paskyra</p>
              <div className="mt-0.5 flex gap-3 text-xs font-semibold">
                <span className="text-[#00C853]">Prašymai</span>
                <span className="text-slate-400">Kontaktai</span>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus className="h-3 w-3" />
              Naujas prašymas
            </button>
          </div>

          {/* Card + status */}
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">

            {/* Request card */}
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {/* scenario badge */}
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    <Handshake className="h-3 w-3 text-navy" />
                    Paskolinau pinigus
                  </span>
                  <p className="text-sm font-semibold text-navy">Mokėjimo prašymas</p>
                  <p className="text-xs text-slate-400">Marija V. · priminimas kas 7 d.</p>
                </div>
                {/* status matches STATUS_LABELS.active */}
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                  Aktyvus
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold tracking-tight text-navy">45,00 €</p>

              <div className="mt-3 flex divide-x divide-slate-100 overflow-hidden rounded-xl border border-slate-100 text-xs">
                {[
                  ["Sukurta",    "13 geg."],
                  ["Terminas",   "28 geg."],
                  ["Gavėjas",    "Marija V."],
                  ["Priminimas", "Kas 7 d."],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-1 flex-col gap-0.5 px-3 py-2.5">
                    <p className="whitespace-nowrap text-slate-400">{k}</p>
                    <p className="whitespace-nowrap font-semibold text-navy">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status tracker */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 lg:w-48">
              <p className="text-xs font-semibold text-navy">Prašymo statusas</p>
              <ul className="mt-3 space-y-3">
                <StatusStep label="Sukurta"  done={true}  />
                <StatusStep label="Išsiųsta" done={true}  />
                <StatusStep label="Priminta" done={false} active={true} />
                <StatusStep label="Apmokėta" done={false} />
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-slate-50 sm:flex-none"
            >
              <Bell className="h-3.5 w-3.5 text-[#00C853]" />
              Siųsti priminimą
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-slate-50 sm:flex-none"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              Peržiūrėti detales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── compact variant ─── */
export function PaymentRequestCompactMockup() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            <Handshake className="h-2.5 w-2.5" />
            Paskolinau
          </span>
          <p className="text-sm font-semibold text-navy">Mokėjimo prašymas</p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
          Aktyvus
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-navy">45,00 €</p>
      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
        <div className="flex-1 rounded-lg bg-slate-50 p-2 text-center text-[10px] text-slate-600">
          <Bell className="mx-auto mb-1 h-4 w-4 text-[#00C853]" />
          Priminimas
        </div>
        <div className="flex-1 rounded-lg bg-slate-50 p-2 text-center text-[10px] text-slate-600">
          <Send className="mx-auto mb-1 h-4 w-4 text-navy" />
          Išsiųsta
        </div>
      </div>
    </div>
  );
}
