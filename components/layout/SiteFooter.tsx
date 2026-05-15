import Link from "next/link";
import { Mail } from "lucide-react";
import { IconFacebook, IconInstagram, IconLinkedin } from "@/components/layout/SocialIcons";
import { BrandLogo } from "@/components/layout/BrandLogo";

const linkCol = (title: string, links: { label: string; href: string }[]) => (
  <div>
    <p className="mb-4 text-sm font-semibold text-white">{title}</p>
    <ul className="space-y-3 text-sm text-slate-300">
      {links.map((l) => (
        <li key={`${title}-${l.label}`}>
          <Link href={l.href} className="transition hover:text-white">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export function SiteFooter() {
  return (
    <footer className="bg-navy text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="lg:col-span-2">
            <BrandLogo variant="footer" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Paprasta ir patikima sistema, padedanti sukurti prašymą, išsiųsti jį
              skolininkui ir automatiškai priminti apie mokėjimą.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-slate-300 transition hover:border-white hover:text-white"
                aria-label="Facebook"
              >
                <IconFacebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-slate-300 transition hover:border-white hover:text-white"
                aria-label="LinkedIn"
              >
                <IconLinkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-slate-300 transition hover:border-white hover:text-white"
                aria-label="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:labas@paskolinau.lt"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-slate-300 transition hover:border-white hover:text-white"
                aria-label="El. paštas"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {linkCol("Produktas", [
            { label: "Kaip veikia", href: "/kaip-veikia" },
            { label: "Funkcijos", href: "/funkcijos" },
            { label: "Kainos", href: "/kainos" },
            { label: "Atnaujinimai", href: "/kaip-veikia" },
          ])}
          {linkCol("Pagalba", [
            { label: "DUK", href: "/duk" },
            { label: "Vadovai", href: "/kontaktai" },
            { label: "Privatumo politika", href: "/kontaktai" },
            { label: "Naudojimosi sąlygos", href: "/kontaktai" },
          ])}
          {linkCol("Įmonė", [
            { label: "Apie mus", href: "/kontaktai" },
            { label: "Kontaktai", href: "/kontaktai" },
            { label: "Karjera", href: "/kontaktai" },
          ])}
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Susisiekite</p>
            <a
              href="mailto:labas@paskolinau.lt"
              className="text-sm font-medium text-[#00C853] hover:underline"
            >
              labas@paskolinau.lt
            </a>
            <p className="mt-3 text-sm text-slate-400">Atsakome per 1 darbo dieną.</p>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-500">
          © 2024 Paskolinau.lt. Visos teisės saugomos.
        </div>
      </div>
    </footer>
  );
}
