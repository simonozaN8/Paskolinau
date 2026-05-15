"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Users, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/pradzia",  label: "Pradžia",  Icon: Home   },
  { href: "/istorija", label: "Istorija", Icon: Clock  },
  { href: "/grupes",   label: "Grupės",   Icon: Users  },
  { href: "/premium",  label: "Premium",  Icon: Shield },
  { href: "/profilis", label: "Profilis", Icon: User   },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname === "/prisijungti" || pathname === "/registracija") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-sm items-center justify-around px-2 py-2">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  active ? "text-[#00C853]" : "text-slate-400",
                )}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-[#00C853]" : "text-slate-400",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
