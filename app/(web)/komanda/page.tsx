import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, Users } from "lucide-react";
import { SITE_CONTACT } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Komanda – Paskolinau.lt",
  description: "Kas kuria Paskolinau.lt ir kodėl.",
};

export default function KomandaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/Paskolinau_varpelis_logo.png"
          alt="Paskolinau.lt"
          width={120}
          height={120}
          className="h-24 w-24"
          priority
        />
        <h1 className="mt-6 text-3xl font-bold text-navy sm:text-4xl">Komanda</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Paskolinau.lt kuria maža komanda Lietuvoje. Tikime, kad pinigų klausimai tarp
          draugų, kolegų ir grupių neturi virsti tyčia ar ginčais – tam ir sukūrėme
          sistemą, kuri primena už jus.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
          {
            Icon: Bell,
            title: "Misija",
            text: "Automatizuoti priminimus ir fiksuoti įsipareigojimus skaidriai.",
          },
          {
            Icon: Heart,
            title: "Vertės",
            text: "Paprastumas, pagarba abiem pusėms ir mažiau nemalonių pokalbių.",
          },
          {
            Icon: Users,
            title: "Bendruomenė",
            text: "Klausimus ir idėjas laukiame iš naudotojų – kartu tobuliname.",
          },
        ].map(({ Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
          >
            <Icon className="mx-auto h-9 w-9 text-[#00C853]" />
            <h2 className="mt-4 font-bold text-navy">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="font-semibold text-navy">Norite susisiekti?</p>
        <p className="mt-2 text-sm text-slate-600">
          <a href={`mailto:${SITE_CONTACT.email}`} className="text-[#00C853] hover:underline">
            {SITE_CONTACT.email}
          </a>
          {" · "}
          <a href={SITE_CONTACT.phoneHref} className="text-[#00C853] hover:underline">
            {SITE_CONTACT.phoneDisplay}
          </a>
        </p>
        <Link
          href="/kontaktai"
          className="mt-6 inline-flex rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Kontaktų puslapis
        </Link>
      </div>
    </div>
  );
}
