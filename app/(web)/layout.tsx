import type { ReactNode } from "react";
import { WebChrome } from "@/components/layout/WebChrome";

export default function WebLayout({ children }: { children: ReactNode }) {
  return <WebChrome>{children}</WebChrome>;
}
