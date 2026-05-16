import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Naudojimosi taisyklės – Paskolinau.lt",
  description: "Paskolinau.lt paslaugos naudojimosi sąlygos.",
};

export default function NaudojimosiTaisyklesPage() {
  return (
    <LegalPage
      title="Naudojimosi taisyklės"
      subtitle="Sąlygos, taikomos naudojantis Paskolinau.lt platforma."
      updated="2026 m. gegužės 16 d."
      sections={[
        {
          title: "Kas yra Paskolinau.lt",
          body: (
            <p>
              Paskolinau.lt – įrankis mokėjimo prašymams registruoti, gavėjams informuoti
              ir automatiškai priminti. Sistema padeda fiksuoti įsipareigojimus ir sumažinti
              nemalonius asmeninius priminimus – bet <strong>nekeičia</strong> civilinių
              sandorių ar skolų teisinės galios.
            </p>
          ),
        },
        {
          title: "Paskyra ir registracija",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Registracijai reikia tikslaus el. pašto, telefono ir banko sąskaitos.</li>
              <li>Esate atsakingi už prisijungimo duomenų saugumą.</li>
              <li>Draudžiama naudoti svetimą tapatybę ar klaidinančią informaciją.</li>
            </ul>
          ),
        },
        {
          title: "Prašymai ir scenarijai",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Paskolinau</strong> – pinigų ar daiktų skola vienam gavėjui.
              </li>
              <li>
                <strong>Padalinau</strong> – bendros sąskaitos dalijimas keliems asmenims.
              </li>
              <li>
                <strong>Surenku</strong> – grupinė rinkliava keliems dalyviams.
              </li>
              <li>
                <strong>Apmokėjau</strong> – jūs sumokėjote už kitus ir laukiate dalies.
              </li>
              <li>
                Gavėjas gali paspausti <strong>Patvirtinu</strong> (pripažįsta skolą) arba{" "}
                <strong>Grąžinta</strong> (pažymi grąžinimą). Galutinį patvirtinimą atlieka
                prašymą sukūręs naudotojas.
              </li>
            </ul>
          ),
        },
        {
          title: "Pranešimai",
          body: (
            <p>
              Sistema siunčia el. laiškus ir/ar SMS gavėjams jūsų nurodytais kontaktais.
              Pranešimuose nurodoma, kad juos siunčia <strong>Paskolinau.lt</strong>, ir pateikiama
              nuoroda į patvirtinimo puslapį. Jūs patvirtinate, kad turite teisę naudoti
              pateiktus gavėjų kontaktus ir kad informacija yra tiksli.
            </p>
          ),
        },
        {
          title: "Ko paslauga negarantuoja",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Kad gavėjas sumokės ar grąžins skolą.</li>
              <li>Kad pranešimai visada bus pristatyti (priklauso nuo operatorių).</li>
              <li>Teisinio skolos išieškojimo ar notarinio dokumento galios.</li>
            </ul>
          ),
        },
        {
          title: "Draudžiama naudoti paslaugą",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Šmeižui, grasinimams, neteisėtiems reikalavimams.</li>
              <li>Spamui ar masiniams nepageidaujamiems pranešimams.</li>
              <li>Sistemos saugumo pažeidimui ar bandymams apeiti technines ribas.</li>
            </ul>
          ),
        },
        {
          title: "Atsakomybės ribojimas",
          body: (
            <p>
              Paslauga teikiama „kaip yra“. Neatsakome už netiesioginius nuostolius,
              prarastą pelną ar ginčus tarp naudotojų. Maksimali mūsų atsakomybė – pagal
              galiojančius įstatymus ir pasirinktą mokamą planą (jei taikoma).
            </p>
          ),
        },
        {
          title: "Pakeitimai ir kontaktai",
          body: (
            <p>
              Taisykles galime atnaujinti; nauja versija skelbiama šiame puslapyje.
              Klausimai:{" "}
              <a href="mailto:labas@paskolinau.lt" className="text-[#00C853] hover:underline">
                labas@paskolinau.lt
              </a>
              , tel.{" "}
              <a href="tel:+37063063337" className="text-[#00C853] hover:underline">
                +370 630 63337
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
