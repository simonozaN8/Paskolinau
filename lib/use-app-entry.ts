"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Naviguoja į /dashboard/new-request; sesiją tikrina serveris (slapukas).
 * Svečiai grąžinami į ?from= puslapį su ?register=1.
 */
export function useAppEntryAction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = !!user;

  const handleEntry = useCallback(() => {
    const from = encodeURIComponent(pathname);
    router.push(`/dashboard/new-request?from=${from}`);
  }, [pathname, router]);

  return {
    handleEntry,
    isLoggedIn,
    pending: loading,
    showUnverified: false,
    closeUnverified: () => {},
  };
}
