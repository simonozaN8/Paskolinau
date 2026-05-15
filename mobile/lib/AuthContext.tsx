import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getStoredUser, getStoredToken, storeSession, clearSession, getMe, type ApiUser } from "./api";

type AuthState = {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: ApiUser) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<ApiUser | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [storedToken, storedUser] = await Promise.all([getStoredToken(), getStoredUser()]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        // Verify token is still valid
        try {
          const fresh = await getMe();
          setUser(fresh);
        } catch {
          await clearSession();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (newToken: string, newUser: ApiUser) => {
    await storeSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await getMe();
      setUser(fresh);
      const t = await getStoredToken();
      if (t) await storeSession(t, fresh);
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
