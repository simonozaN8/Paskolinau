"use client";

import { useAppEntryAction } from "@/lib/use-app-entry";

type Props = {
  cta: string;
  loggedInLabel?: string;
  featured?: boolean;
};

export function PlanCtaButton({
  cta,
  loggedInLabel = "Sukurti prašymą",
  featured,
}: Props) {
  const { handleEntry, isLoggedIn, pending } = useAppEntryAction();

  return (
    <button
      type="button"
      onClick={handleEntry}
      disabled={pending}
      className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:opacity-60 ${
        featured
          ? "bg-navy text-white hover:bg-navy-deep"
          : "border-2 border-navy bg-white text-navy hover:bg-slate-50"
      }`}
    >
      {isLoggedIn ? loggedInLabel : cta}
    </button>
  );
}
