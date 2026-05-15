import { Building2, Bell, ChevronRight, FileText, LogOut, Mail, MessageCircle, Pencil, Phone, Shield, User } from "lucide-react";
import Link from "next/link";
import { MobileAppBar } from "@/components/mobile/MobileAppBar";
import { cn } from "@/lib/utils";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  bankAccount: string;
  phone: string;
};

export default function ProfilisClient({ initialUser }: { initialUser: UserData }) {
  const { firstName, lastName, email, emailVerified, phone, bankAccount } = initialUser;

  const ACCOUNT_FIELDS = [
    { field: "phone",       icon: <Phone     className="h-5 w-5 text-[#00C853]" />, label: "Telefono numeris",     value: phone       || "Nepridėta" },
    { field: "firstName",   icon: <User      className="h-5 w-5 text-[#00C853]" />, label: "Vardas",               value: firstName   || "—" },
    { field: "lastName",    icon: <User      className="h-5 w-5 text-[#00C853]" />, label: "Pavardė",              value: lastName    || "—" },
    { field: "bankAccount", icon: <Building2 className="h-5 w-5 text-[#00C853]" />, label: "Banko sąskaita (IBAN)", value: bankAccount || "Nepridėta" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <MobileAppBar variant="logo" />
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center bg-white pb-6 pt-2">
        <div className="relative">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <User className="h-10 w-10 text-slate-400" />
          </span>
          <Link
            href="/profilis/edit/firstName"
            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#00C853] text-white shadow"
          >
            <Pencil className="h-3 w-3" />
          </Link>
        </div>
        <p className="mt-3 text-lg font-bold text-navy">{firstName || "—"} {lastName || ""}</p>
        <p className="text-xs text-slate-500">{email}</p>
      </div>

      {/* Account fields — plain <a> links, no JS needed */}
      <div className="mt-4 px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Paskyros nustatymai</p>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {ACCOUNT_FIELDS.map(({ field, icon, label, value }, i, arr) => (
            <a
              key={field}
              href={`/profilis/edit/${field}`}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 active:bg-slate-50",
                i < arr.length - 1 && "border-b border-slate-100",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">{label}</p>
                <p className="truncate text-xs text-slate-500">{value}</p>
              </div>
              <Pencil className="h-4 w-4 shrink-0 text-slate-300" />
            </a>
          ))}
          <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
              <Mail className="h-5 w-5 text-[#00C853]" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy">El. paštas</p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {emailVerified ? "Patvirtintas" : "Nepatvirtintas"}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications (display only — toggles require JS) */}
      <div className="mt-4 px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Pranešimų nustatymai</p>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {[
            { icon: <MessageCircle className="h-5 w-5 text-[#00C853]" />, label: "SMS pranešimai",  sub: "Gaukite pranešimus į savo telefoną"  },
            { icon: <Mail          className="h-5 w-5 text-[#00C853]" />, label: "El. paštas",      sub: "Gaukite pranešimus į savo el. paštą" },
            { icon: <Bell          className="h-5 w-5 text-[#00C853]" />, label: "Push pranešimai", sub: "Gaukite pranešimus programėlėje"      },
          ].map(({ icon, label, sub }, i, arr) => (
            <div key={label} className={cn("flex items-center gap-3 px-4 py-3", i < arr.length - 1 && "border-b border-slate-100")}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">{icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
              <span className="h-7 w-12 rounded-full bg-[#00C853]" />
            </div>
          ))}
        </div>
      </div>

      {/* Links + Logout */}
      <div className="mt-4 mx-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <a
          href="/dashboard/contacts"
          className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 active:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50">
            <FileText className="h-5 w-5 text-slate-400" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">Mano kontaktai</p>
            <p className="text-xs text-slate-400">Valdykite savo kontaktų sąrašą</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </a>

        <a
          href="/kontaktai"
          className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 active:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50">
            <Shield className="h-5 w-5 text-slate-400" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">Privatumas</p>
            <p className="text-xs text-slate-400">Privatumo politika ir duomenų nustatymai</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </a>

        {/* Logout — posts to API route (avoids Server Action redirect scope issues on iOS PWA) */}
        <form method="POST" action="/api/auth/logout-redirect">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-slate-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50">
              <LogOut className="h-5 w-5 text-red-400" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-500">Atsijungti</p>
              <p className="text-xs text-slate-400">Atsijunkite nuo savo paskyros</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </button>
        </form>
      </div>

      <div className="pb-8" />
    </div>
  );
}
