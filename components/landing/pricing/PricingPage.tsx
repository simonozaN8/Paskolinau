import {
  ArrowRight,
  Bell,
  Building2,
  Check,
  Coins,
  Lock,
  Shield,
  User,
  Users,
} from "lucide-react";
import { BrowserFrame } from "@/components/mockups/BrowserFrame";
import { PaymentRequestCompactMockup } from "@/components/mockups/PaymentRequestHeroMockup";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { PlanCtaButton } from "@/components/landing/pricing/PlanCtaButton";
import { DocPreviewSection } from "@/components/landing/pricing/DocPreviewSection";
import { RegistrationButton } from "@/components/ui/RegistrationButton";

const freeFeatures = [
  "1 aktyvus prašymas",
  "El. pašto priminimai",
  "Pagrindiniai statusai",
  "Mobilusis vaizdas",
  "Pagalbos centras",
];

const plusFeatures = [
  "Iki 5 aktyvių prašymų",
  "SMS ir el. pašto priminimai",
  "QR patvirtinimai",
  "Grupės rinkliavos",
  "Istorija ir eksportas",
  "Prioritetiniai dokumentai",
  "7 dienų bandomasis laikotarpis",
];

const teamFeatures = [
  "Neriboti prašymai",
  "Komandos nariai ir rolės",
  "Viskas iš Plus",
  "Tikslinė pagalba",
  "SLA užtikrinimas",
  "Integracijų paruošimas",
];

const compareRows: {
  label: string;
  free: React.ReactNode;
  plus: React.ReactNode;
  team: React.ReactNode;
}[] = [
  { label: "Aktyvių prašymų skaičius", free: "1", plus: "5", team: "Neribota" },
  { label: "El. pašto priminimai", free: <Check className="mx-auto h-4 w-4 text-[#00C853]" />, plus: <Check className="mx-auto h-4 w-4 text-[#00C853]" />, team: <Check className="mx-auto h-4 w-4 text-[#00C853]" /> },
  { label: "SMS priminimai", free: "—", plus: <Check className="mx-auto h-4 w-4 text-[#00C853]" />, team: <Check className="mx-auto h-4 w-4 text-[#00C853]" /> },
  { label: "Grupės rinkliavos", free: "—", plus: <Check className="mx-auto h-4 w-4 text-[#00C853]" />, team: <Check className="mx-auto h-4 w-4 text-[#00C853]" /> },
  { label: "Komandos nariai", free: "—", plus: "—", team: <Check className="mx-auto h-4 w-4 text-[#00C853]" /> },
  { label: "Ataskaitų eksportas", free: "—", plus: <Check className="mx-auto h-4 w-4 text-[#00C853]" />, team: <Check className="mx-auto h-4 w-4 text-[#00C853]" /> },
];


const faqLeft: FaqItem[] = [
  { q: "Ar yra paslėptų mokesčių?", a: "Nėra – plano kaina fiksuota. Papildomai taikomas tik sėkmės mokestis nuo apmokėtos sumos." },
  { q: "Kada taikomas paslaugos mokestis?", a: "Tik tada, kai gaunate pinigus į savo sąskaitą ir pažymite prašymą kaip apmokėtą." },
];

const faqRight: FaqItem[] = [
  { q: "Ar galiu atšaukti prenumeratą?", a: "Taip, bet kuriuo metu – likęs laikotarpis nustos automatiškai pasibaigus periodui." },
  { q: "Ar duomenys priklauso man?", a: "Jūs valdote turinį ir eksportą; mes saugome duomenis pagal sutartį ir GDPR." },
];

export function PricingPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Aiškios kainos.{" "}
              <span className="text-[#00C853]">Maksimali nauda.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Pasirink planą, kuris geriausiai tinka tavo poreikiams. Mokėk tik tada,
              kai sistema padeda susigrąžinti skolą.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:max-w-lg">
              {[
                { Icon: Shield, t: "Saugus ir patikimas" },
                { Icon: Bell, t: "Automatiniai priminimai" },
                { Icon: Coins, t: "Padeda grąžinti skolas" },
                { Icon: Lock, t: "GDPR ir duomenų sauga" },
              ].map(({ Icon, t }) => (
                <div key={t} className="flex items-start gap-2 text-sm text-slate-700">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#00C853]" />
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <BrowserFrame>
              <div className="p-6">
                <PaymentRequestCompactMockup />
              </div>
            </BrowserFrame>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy">Kainos</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PlanCard
              name="Free"
              price="0 €"
              desc="Puikiai tinka pradžiai."
              features={freeFeatures}
              cta="Pradėti nemokamai"
            />
            <PlanCard
              name="Plus"
              price="4,99 €"
              desc="Daugumai naudotojų."
              features={plusFeatures}
              cta="Pradėti 7 d. nemokamai"
              featured
              badge="POPULIARIAUSIA"
            />
            <PlanCard
              name="Team"
              price="9,99 €"
              desc="Komandoms ir organizacijoms."
              features={teamFeatures}
              cta="Išbandyti"
            />
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-slate-600">
            <Check className="h-4 w-4 text-[#00C853]" />
            7 dienų nemokamas bandomasis laikotarpis. Atsisakyk bet kada.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy">Palygink planus</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-navy">
                  <th className="px-4 py-4 font-semibold">Funkcija</th>
                  <th className="px-4 py-4 font-semibold">Free</th>
                  <th className="px-4 py-4 font-semibold">Plus</th>
                  <th className="px-4 py-4 font-semibold">Team</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="border-t border-slate-100 px-4 py-3 font-medium text-slate-700">
                      {row.label}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-3 text-center text-slate-600">
                      {row.free}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-3 text-center text-slate-600">
                      {row.plus}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-3 text-center text-slate-600">
                      {row.team}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy">
            Premium dokumentai tavo apsaugai
          </h2>
          <DocPreviewSection />
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-100/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-navy">
                Mokame tik tada, kai gauni savo pinigus
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Paslaugos mokestis taikomas tik sėkmingam apmokėjimui. Jokių fiksuotų
                mokesčių už nepavykusius bandymus.
              </p>
            </div>
            <div className="hidden h-24 w-px bg-slate-200 lg:block" />
            <div className="grid grid-cols-3 gap-4 text-center lg:flex lg:gap-10">
              <div>
                <p className="text-3xl font-bold text-navy">1,5 %</p>
                <p className="mt-1 text-xs text-slate-600">Paslaugos mokestis</p>
              </div>
              <div className="border-x border-slate-200 px-2 lg:border-x-0 lg:px-6">
                <p className="text-3xl font-bold text-navy">0,29 €</p>
                <p className="mt-1 text-xs text-slate-600">Minimalus</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-navy">2,99 €</p>
                <p className="mt-1 text-xs text-slate-600">Maksimalus</p>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-emerald-50/80 p-6 ring-1 ring-emerald-100">
                <p className="text-sm font-bold text-emerald-900">Pavyzdys</p>
                <p className="mt-2 text-sm text-emerald-900/90">
                  Jei skola apmokėta 120,00 € – mokestis bus 1,80 € (1,5 %), ne didesnis
                  nei nustatytas maksimumas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-navy">
            Kam tinka kiekvienas planas?
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <AudienceCard
              Icon={User}
              title="Free – asmeniniam naudojimui"
              bullets={["Vienas aktyvus prašymas", "Asmeniniai priminimai", "Greitas startas"]}
            />
            <AudienceCard
              Icon={Users}
              title="Plus – dažnesniems skolinimams"
              bullets={["Kelios skolos vienu metu", "SMS kanalas", "Grupės rinkliavos"]}
            />
            <AudienceCard
              Icon={Building2}
              title="Team – komandoms ir įmonėms"
              bullets={["Nariai ir rolės", "Centralizuota istorija", "Prioritetinė pagalba"]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-navy">
            Dažniausiai užduodami klausimai
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 shadow-sm sm:px-6">
              <FaqAccordion items={faqLeft} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 shadow-sm sm:px-6">
              <FaqAccordion items={faqRight} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Bell className="h-9 w-9 text-[#00C853]" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-navy">
            Pasiruošęs susigrąžinti savo pinigus?
          </h2>
          <p className="mt-4 text-slate-600">
            Pradėk dabar – 7 dienos nemokamai. Jokių įsipareigojimų.
          </p>
          <RegistrationButton
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy px-8 py-4 text-sm font-semibold text-white hover:bg-navy-deep"
            showArrow
          >
            Pradėti 7 d. nemokamai
          </RegistrationButton>
        </div>
      </section>
    </>
  );
}

function PlanCard({
  name,
  price,
  desc,
  features,
  cta,
  featured,
  badge,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
        featured
          ? "border-[#00C853]/40 ring-2 ring-[#00C853]/25"
          : "border-slate-200"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00C853] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}
      <h3 className="text-xl font-bold text-navy">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-navy">{price}</span>
        <span className="text-slate-500">/ mėn.</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00C853]" />
            {f}
          </li>
        ))}
      </ul>
      <PlanCtaButton cta={cta} featured={featured} />
    </div>
  );
}

function AudienceCard({
  Icon,
  title,
  bullets,
}: {
  Icon: typeof User;
  title: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center shadow-sm">
      <Icon className="mx-auto h-12 w-12 text-[#00C853]" strokeWidth={1.25} />
      <h3 className="mt-6 text-lg font-bold text-navy">{title}</h3>
      <ul className="mt-6 space-y-3 text-left text-sm text-slate-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00C853]" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
