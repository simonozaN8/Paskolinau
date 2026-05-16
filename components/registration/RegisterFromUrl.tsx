"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useStartRegistration } from "@/components/registration/StartRegistrationProvider";

function RegisterFromUrlInner() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useStartRegistration();

  useEffect(() => {
    if (params.get("register") !== "1") return;
    openModal();
    const next = new URLSearchParams(params.toString());
    next.delete("register");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [params, pathname, openModal, router]);

  return null;
}

/** Atidaro registracijos modalą, kai URL turi ?register=1 */
export function RegisterFromUrl() {
  return (
    <Suspense fallback={null}>
      <RegisterFromUrlInner />
    </Suspense>
  );
}
