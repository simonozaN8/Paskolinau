"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({
  items,
  className,
  leadingIcon = "none",
}: {
  items: FaqItem[];
  className?: string;
  leadingIcon?: "none" | "help";
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={cn("divide-y divide-slate-200", className)}>
      {items.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center gap-3 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              {leadingIcon === "help" && (
                <HelpCircle className="h-5 w-5 shrink-0 text-[#00C853]" />
              )}
              <span className="flex-1 text-sm font-semibold text-navy sm:text-base">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-slate-400 transition",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <p
                className={cn(
                  "pb-4 text-sm leading-relaxed text-slate-600",
                  leadingIcon === "help" && "pl-8 sm:pl-11",
                )}
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FaqSearchHeader({
  title,
  placeholder,
  query,
  onQuery,
}: {
  title: string;
  placeholder: string;
  query: string;
  onQuery: (v: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold text-navy md:text-3xl">{title}</h2>
      <label className="relative w-full sm:max-w-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-[#00C853]/40 focus:ring-2 focus:ring-[#00C853]/15"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          ⌕
        </span>
      </label>
    </div>
  );
}

export function useFilteredFaq(items: FaqItem[], query: string) {
  return useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (i) => i.q.toLowerCase().includes(s) || i.a.toLowerCase().includes(s),
    );
  }, [items, query]);
}
