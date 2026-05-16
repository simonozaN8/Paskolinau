import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privatumo politika – Paskolinau.lt",
  description: "Kaip Paskolinau.lt tvarko asmens duomenis.",
};

export default function PrivatumoPolitikaPage() {
  return (
    <LegalPage
      title="Privatumo politika"
      subtitle="Kaip renkame, naudojame ir saugome jūsų duomenis naudojantis Paskolinau.lt."
      updated="2026 m. gegužės 16 d."
      sections={[
        {
          title: "Kas mes esame",
          body: (
            <p>
              Paskolinau.lt – internetinė paslauga, skirta mokėjimo prašymams kurti,
              siųsti gavėjams ir automatiškai priminti apie įsipareigojimus. Duomenų
              valdytojas: UAB „Paskolinau“ (kontaktai:{" "}
              <a href="mailto:labas@paskolinau.lt" className="text-[#00C853] hover:underline">
                labas@paskolinau.lt
              </a>
              ).
            </p>
          ),
        },
        {
          title: "Kokius duomenis renkame",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Paskyros duomenys:</strong> vardas, pavardė, el. paštas, telefono
                numeris, banko sąskaitos numeris (IBAN) registracijos metu.
              </li>
              <li>
                <strong>Prašymų duomenys:</strong> gavėjo vardas, el. paštas arba telefonas,
                suma, aprašymas, terminas, scenarijus (paskola, padalinta sąskaita, grupė ir
                pan.), statusai (patvirtinta, grąžinta, priminta).
              </li>
              <li>
                <strong>Kontaktai:</strong> jūsų išsaugoti gavėjų kontaktai sistemoje.
              </li>
              <li>
                <strong>Prisijungimas:</strong> vienkartiniai prisijungimo kodai el. paštu,
                sesijos identifikatoriai.
              </li>
              <li>
                <strong>Kontaktų forma:</strong> vardas, el. paštas, žinutė, jei rašote mums.
              </li>
              <li>
                <strong>Techniniai duomenys:</strong> IP adresas, naršyklės tipas, serverio
                žurnalai (saugumui ir gedimų šalinimui).
              </li>
            </ul>
          ),
        },
        {
          title: "Kam naudojame duomenis",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Paskyros sukūrimui, prisijungimui ir autentifikavimui.</li>
              <li>Mokėjimo prašymų kūrimui, siuntimui ir būsenų fiksavimui.</li>
              <li>
                Automatiniams pranešimams gavėjams (el. paštas, SMS) – įskaitant nuorodas
                patvirtinti skolą ar pažymėti grąžinimą.
              </li>
              <li>Priminimams pagal jūsų nustatymus.</li>
              <li>Paslaugos tobulinimui, saugumui ir teisiniams įsipareigojimams.</li>
            </ul>
          ),
        },
        {
          title: "Teisinis pagrindas (BDAR)",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Sutarties vykdymas – kai naudojatės paslauga.</li>
              <li>Teisėtas interesas – saugumas, sukčiavimo prevencija, paslaugos veikimas.</li>
              <li>Sutikimas – kai pažymite sutikimą kontaktų formoje ar registracijoje.</li>
              <li>Teisinė prievolė – kai privalome saugoti duomenis pagal įstatymus.</li>
            </ul>
          ),
        },
        {
          title: "Gavėjams siunčiami duomenys",
          body: (
            <p>
              Kai sukuriate prašymą, pasirinkti gavėjai gauna pranešimą su prašymo
              informacija ir nuoroda į patvirtinimo puslapį. Pranešimus siunčia{" "}
              <strong>sistema Paskolinau.lt</strong>, ne jūs tiesiogiai iš savo el. pašto.
              Gavėjas mato jūsų vardą kaip prašymą užregistravusį asmenį.
            </p>
          ),
        },
        {
          title: "Subtarpininkai",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Hostingas ir infrastruktūra (pvz. Vercel).</li>
              <li>Duomenų bazė (Turso / LibSQL).</li>
              <li>El. pašto siuntimas (Resend arba SMTP).</li>
              <li>SMS siuntimas (Twilio).</li>
            </ul>
          ),
        },
        {
          title: "Saugojimo terminai",
          body: (
            <p>
              Duomenis saugome kol galioja paskyra ir pagrįstą laikotarpį po jos
              pabaigos (teisinėms pretenzijoms, apskaitai). Sesijos ir prisijungimo kodai –
              trumpai (minutės / dienos). Galite prašyti ištrinti paskyrą – susisiekite el.
              paštu.
            </p>
          ),
        },
        {
          title: "Jūsų teisės",
          body: (
            <p>
              Turite teisę susipažinti su duomenimis, juos ištaisyti, ištrinti, apriboti
              tvarkymą, nesutikti, gauti duomenis perkeltinu formatu ir pateikti skundą
              Valstybinei duomenų apsaugos inspekcijai. Kreipkitės:{" "}
              <a href="mailto:labas@paskolinau.lt" className="text-[#00C853] hover:underline">
                labas@paskolinau.lt
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
