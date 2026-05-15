"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const PUBLIC_PATHS = ["/prisijungti", "/registracija"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function MobileAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublicPath(pathname)) {
      router.replace("/prisijungti");
    }
    if (user && pathname === "/prisijungti") {
      router.replace("/pradzia");
    }
  }, [user, loading, pathname, router]);

  // Don't block render — just redirect silently after auth resolves.
  // Avoids infinite spinner on slow network.
  return <>{children}</>;
}
