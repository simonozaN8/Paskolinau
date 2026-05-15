import { DukBlock } from "@/components/kontaktai/DukBlock";

export const metadata = {
  title: "DUK – Dažniausiai užduodami klausimai | Paskolinau.lt",
};

export default function DukPage() {
  return (
    <main className="min-h-screen bg-white">
      <DukBlock />
    </main>
  );
}
