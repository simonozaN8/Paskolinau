import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { MobileAuthGuard } from "@/components/mobile/MobileAuthGuard";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Paskolinau.lt",
  },
  other: {
    "Cache-Control": "no-store",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2A4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function MobileAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-sm bg-white">
        <MobileAuthGuard>
          <div className="pb-20">{children}</div>
          <MobileBottomNav />
        </MobileAuthGuard>
      </div>
    </div>
  );
}
