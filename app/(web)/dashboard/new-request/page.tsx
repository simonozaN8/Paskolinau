import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CreateRequestForm } from "@/components/dashboard/CreateRequestForm";
import { MailCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Sukurti prašymą – Paskolinau.lt" };

export default async function NewRequestPage() {
  const user = await getSessionUser();

  if (!user) redirect("/");

  if (!user.emailVerified) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <MailCheck className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-navy">El. paštas nepatvirtintas</h1>
        <p className="mt-3 text-slate-600">
          Patvirtinkite el. paštą, kad galėtumėte kurti prašymus.
          Patikrinkite savo pašto dėžutę – išsiuntėme patvirtinimo kodą
          registracijos metu.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Grįžti į paskyrą
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Grįžti į paskyrą
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Sukurti mokėjimo prašymą</h1>
        <p className="mt-1 text-sm text-slate-500">
          Užpildykite formą – sistema pasirūpins priminimais.
        </p>
      </div>

      <CreateRequestForm />
    </div>
  );
}
