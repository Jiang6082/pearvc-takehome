import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { User } from "../types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("fw_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("fw_token")));

  useEffect(() => {
    const token = localStorage.getItem("fw_token");
    if (!token) return;
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("fw_user", JSON.stringify(res.data.user));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function completeAuth(path: string, payload: Record<string, string>) {
    const res = await api.post(path, payload);
    localStorage.setItem("fw_token", res.data.token);
    localStorage.setItem("fw_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  }

  async function login(email: string, password: string) {
    await completeAuth("/auth/login", { email, password });
  }

  async function register(name: string, email: string, password: string) {
    await completeAuth("/auth/register", { name, email, password });
  }

  function logout() {
    localStorage.removeItem("fw_token");
    localStorage.removeItem("fw_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
