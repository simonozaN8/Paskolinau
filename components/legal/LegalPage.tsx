import Link from "next/link";
import type { ReactNode } from "react";

type Section = { title: string; body: ReactNode };

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-sm font-medium text-[#00C853]">Paskolinau.lt</p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
      <p className="mt-3 text-slate-600">{subtitle}</p>
      <p className="mt-2 text-xs text-slate-400">Atnaujinta: {updated}</p>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold text-navy">{s.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">{s.body}</div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-slate-500">
        Klausimai?{" "}
        <Link href="/kontaktai" className="font-medium text-[#00C853] hover:underline">
          Susisiekite su mumis
        </Link>
        .
      </p>
    </article>
  );
}
