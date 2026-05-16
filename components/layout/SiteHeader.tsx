"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LogIn, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useStartRegistration } from "@/components/registration/StartRegistrationProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useStartRegistration();
  const { user, loading, openLogin, closeLogin, loginOpen, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <BrandLogo variant="header" onClick={closeMenu} />

          {/* Navigacija */}
          {!minimal && <nav className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(pathname, "");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium text-slate-700 transition-colors hover:text-navy",
                    active && "text-navy",
                  )}
                >
                  {active && (
                    <span className="absolute -top-3 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#00C853]" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>}

          {/* Veiksmai */}
          <div className="flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                    {user.firstName}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Paskyra
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Atsijungti
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={openLogin}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-slate-50"
                  >
                    <LogIn className="h-4 w-4" />
                    Prisijungti
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-deep"
                  >
                    Pradėti
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )
            )}
            {!minimal && (
              <button
                type="button"
                className="inline-flex rounded-lg border border-slate-200 p-2 text-navy lg:hidden"
                aria-expanded={menuOpen}
                aria-label="Meniu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobilusis meniu */}
        {menuOpen && !minimal && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-slate-700",
                    item.isActive(pathname, "") && "bg-slate-50 text-navy",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy"
                  >
                    <User className="h-4 w-4" /> {user.firstName} {user.lastName}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); logout(); }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Atsijungti
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); openLogin(); }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-navy"
                  >
                    <LogIn className="h-4 w-4" /> Prisijungti
                  </button>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); openModal(); }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white"
                  >
                    Pradėti <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {loginOpen && <LoginModal onClose={closeLogin} />}
    </>
  );
}
