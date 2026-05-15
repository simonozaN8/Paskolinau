"use client";

import { useStartRegistration } from "@/components/registration/StartRegistrationProvider";

type Props = {
  cta: string;
  featured?: boolean;
};

export function PlanCtaButton({ cta, featured }: Props) {
  const { openModal } = useStartRegistration();

  return (
    <button
      type="button"
      onClick={openModal}
      className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
        featured
          ? "bg-navy text-white hover:bg-navy-deep"
          : "border-2 border-navy bg-white text-navy hover:bg-slate-50"
      }`}
    >
      {cta}
    </button>
  );
}
