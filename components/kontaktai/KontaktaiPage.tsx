import { Bell, Mail, MapPin, Phone, RefreshCw, Shield } from "lucide-react";
import { SITE_CONTACT } from "@/lib/site-contact";
import Image from "next/image";
import { ContactForm } from "@/components/kontaktai/ContactForm";
import { DukBlock } from "@/components/kontaktai/DukBlock";
import { RegistrationButton } from "@/components/ui/RegistrationButton";

export function KontaktaiPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="flex justify-center lg:col-span-3 lg:justify-start">
              <Image
                src="/Paskolinau_varpelis_logo.png"
                alt="Paskolinau.lt varpelis"
                width={192}
                height={192}
                className="h-40 w-40 sm:h-48 sm:w-48"
                priority
              />
            </div>
            <div className="text-center lg:col-span-5 lg:text-left">
              <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
                Turite klausimų?
                <br />
                <span className="text-[#00C853]">Padėsime.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600">
                Mielai atsakysime į visus klausimus apie produktą, kainas ir
                integracijas. Parašykite – susisieksime per vieną darbo dieną.
              </p>
            </div>
            <div className="flex justify-center lg:col-span-4 lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-[#00C853]/40" />
                  <div className="h-2 w-5/6 rounded-full bg-sky-200/80" />
                  <div className="h-2 w-4/6 rounded-full bg-slate-200" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Bell className="h-6 w-6 text-[#00C853]" />
                  <span className="text-xs font-medium text-slate-500">Pokalbio santrauka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <ContactForm />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-navy">Kontaktinė informacija</h2>
            <p className="mt-2 text-sm text-slate-500">Pasiekiame jums patogiausiu būdu.</p>
            <ul className="mt-8 space-y-6">
              <li className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <a
                    href={`mailto:${SITE_CONTACT.email}`}
                    className="font-semibold text-sky-700 hover:underline"
                  >
                    {SITE_CONTACT.email}
                  </a>
                  <p className="text-sm text-slate-500">El. paštas</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <a
                    href={SITE_CONTACT.phoneHref}
                    className="font-semibold text-sky-700 hover:underline"
                  >
                    {SITE_CONTACT.phoneDisplay}
                  </a>
                  <p className="text-sm text-slate-500">Darbo dienomis 9:00 – 18:00</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-sky-700">Vilnius, Lietuva</p>
                  <p className="text-sm text-slate-500">
                    Dirbame nuotoliniu būdu visoje Lietuvoje
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-10 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-sm font-bold text-navy">Įmonės informacija</p>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2">
                  <dt className="text-slate-500">Pavadinimas</dt>
                  <dd className="text-right font-medium text-navy">UAB „Paskolinau“</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2">
                  <dt className="text-slate-500">Įm. kodas</dt>
                  <dd className="text-right font-medium text-navy">305012345</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2">
                  <dt className="text-slate-500">PVM kodas</dt>
                  <dd className="text-right font-medium text-navy">LT100000000000</dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-slate-500">Adresas</dt>
                  <dd className="text-right font-medium text-navy">
                    Konstitucijos pr. 12, Vilnius
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <DukBlock />

      <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy">Apie Paskolinau.lt</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Mes kuriame įrankį, kuris mažina stresą dėl pinigų tarp draugų ir komandų –
            su aiškiais statusais, priminimais ir istorija.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                Icon: Shield,
                title: "Patikima",
                text: "Duomenų saugumas ir skaidri prieiga pagal GDPR.",
              },
              {
                Icon: Bell,
                title: "Primena",
                text: "Automatiniai priminimai – mažiau tylos ir neatitikimų.",
              },
              {
                Icon: RefreshCw,
                title: "Padeda grąžinti",
                text: "Sukurta procesui nuo prašymo iki apmokėjimo.",
              },
            ].map(({ Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <Icon className="mx-auto h-10 w-10 text-[#00C853]" />
                <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-emerald-100 bg-white/80 p-8 shadow-sm lg:flex-row lg:justify-between lg:p-10">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <Bell className="h-8 w-8 text-[#00C853]" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">
                  Pradėkite nemokamai šiandien
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Išbandykite visus pagrindinius žingsnius be rizikos.
                </p>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <RegistrationButton
                className="inline-flex items-center gap-2 rounded-xl bg-[#00C853] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:brightness-95"
                showArrow
              >
                Pradėti nemokamai
              </RegistrationButton>
              <p className="mt-2 text-xs text-slate-500">
                7 dienų nemokamas bandomasis laikotarpis
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
