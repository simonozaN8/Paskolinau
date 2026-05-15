"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, MoreHorizontal } from "lucide-react";

type Props = {
  variant?: "logo" | "back";
  title?: string;
  showMore?: boolean;
  backHref?: string;
};

export function MobileAppBar({ variant = "logo", title, showMore, backHref }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {variant === "back" ? (
        <button
          type="button"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      ) : (
        <Link href="/pradzia" className="flex items-center gap-2">
          <Image
            src="/Paskolinau_varpelis_logo.png"
            alt="Paskolinau.lt"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="text-lg font-bold text-navy">
            Paskolinau<span className="text-[#00C853]">.lt</span>
          </span>
        </Link>
      )}

      {variant === "back" && title && (
        <h1 className="text-base font-semibold text-navy">{title}</h1>
      )}

      <div className="flex items-center gap-1">
        {showMore && (
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-slate-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#00C853]" />
        </button>
      </div>
    </div>
  );
}
