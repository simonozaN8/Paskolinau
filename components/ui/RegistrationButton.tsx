"use client";

import { useStartRegistration } from "@/components/registration/StartRegistrationProvider";
import { ArrowRight } from "lucide-react";

type Props = {
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
};

export function RegistrationButton({ children, className, showArrow = false }: Props) {
  const { openModal } = useStartRegistration();

  return (
    <button type="button" onClick={openModal} className={className}>
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
