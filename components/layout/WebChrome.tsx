"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function WebChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const minimalHeader = pathname === "/kontaktai";

  return (
    <>
      <SiteHeader minimal={minimalHeader} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
