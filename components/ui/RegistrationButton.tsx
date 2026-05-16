"use client";

import { ArrowRight } from "lucide-react";
import { useAppEntryAction } from "@/lib/use-app-entry";

type Props = {
  children: React.ReactNode;
  loggedInLabel?: string;
  className?: string;
  showArrow?: boolean;
};

export function RegistrationButton({
  children,
  loggedInLabel = "Sukurti prašymą",
  className,
  showArrow = false,
}: Props) {
  const { handleEntry, isLoggedIn, pending } = useAppEntryAction();

  return (
    <button
      type="button"
      onClick={handleEntry}
      disabled={pending}
      className={className}
    >
      {isLoggedIn ? loggedInLabel : children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
