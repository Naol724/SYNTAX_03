"use client";

/**
 * Auth Context
 * Replaces NextAuth — uses our JWT backend directly.
 * Wraps the entire admin section.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setToken, setRefreshToken, clearTokens, getToken } from "./api";

interface Admin {
  admin_id: string;
  email: string;
  username: string;
  full_name: string;
  role: "admin" | "super_admin";
  is_active: boolean;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from stored token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth
      .me()
      .then((data: any) => setAdmin(data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.auth.login(email, password);
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      clearTokens();
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, loading, login, logout, isAuthenticated: !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
