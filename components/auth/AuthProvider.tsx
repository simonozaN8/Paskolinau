"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  bankAccount: string;
  phone: string;
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  loginOpen: boolean;
  logout: () => Promise<void>;
  /** Grąžina dabartinį naudotoją (arba null po atnaujinimo). */
  refresh: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  // Start with server-provided user — no fetch needed on first render.
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(initialUser === null);
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userRef = useRef(user);
  userRef.current = user;

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
      if (res.ok) {
        const next = (await res.json()) as AuthUser;
        setUser(next);
        return next;
      }
      if (res.status === 401) {
        setUser(null);
        return null;
      }
      return userRef.current;
    } catch {
      return userRef.current;
    }
  }, []);

  // Only fetch on mount if no server-provided user was given
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialUser !== null) return;
    refresh().finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Re-check on every route change (handles post-login redirects)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    refresh();
  }, [pathname, refresh]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }, [router]);

  const openLogin  = useCallback(() => setLoginOpen(true),  []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const value = useMemo(
    () => ({ user, loading, openLogin, closeLogin, loginOpen, logout, refresh }),
    [user, loading, openLogin, closeLogin, loginOpen, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
