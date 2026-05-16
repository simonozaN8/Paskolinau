"use client";

import { useAppEntryAction } from "@/lib/use-app-entry";

type Props = {
  children: React.ReactNode;
  loggedInLabel?: string;
  className?: string;
};

export function CreateRequestButton({
  children,
  loggedInLabel = "Sukurti prašymą",
  className,
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
    </button>
  );
}
