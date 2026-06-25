"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: "creator" | "pro" | "agency" | "enterprise";
  avatar?: string;
  joinedAt: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY   = "monetai_user";
const USERS_KEY     = "monetai_users";
export const ADMIN_EMAIL     = "monetai.vn@gmail.com";
// credits === -1 means unlimited (admin / enterprise)
export const UNLIMITED_CREDITS = -1;

// Ensure the admin user always carries max privileges regardless of what was stored
function normalizeUser(u: User): User {
  if (u.email === ADMIN_EMAIL) {
    return { ...u, plan: "enterprise", credits: UNLIMITED_CREDITS };
  }
  return u;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        setUser(normalizeUser(parsed));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    // ── Admin: try server verification, fall back to localStorage ────────
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      let verified = false;

      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          verified = true;          // server confirmed
        } else if (res.status === 401) {
          return { success: false, error: "Mật khẩu admin không đúng." };
        }
        // 503 / other = env not configured on server → fall through to localStorage
      } catch {
        // Network error → fall through to localStorage
      }

      // Fallback: check localStorage (works if admin registered previously
      // or if ADMIN_PASSWORD env var is not yet set on the server)
      if (!verified) {
        const usersRaw = localStorage.getItem(USERS_KEY);
        const users: Array<User & { password: string }> = usersRaw
          ? JSON.parse(usersRaw)
          : [];
        const found = users.find(
          (u) => u.email === ADMIN_EMAIL && u.password === password
        );
        if (!found) {
          return { success: false, error: "Mật khẩu admin không đúng." };
        }
        verified = true;
      }

      if (!verified) {
        return { success: false, error: "Mật khẩu admin không đúng." };
      }

      const adminUser: User = {
        id: "admin-001",
        name: "Admin MonetAI",
        email: ADMIN_EMAIL,
        plan: "enterprise",
        credits: UNLIMITED_CREDITS,
        joinedAt: new Date().toISOString(),
      };
      setUser(adminUser);
      // Also save to USERS_KEY so future fallback logins work
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users: Array<User & { password: string }> = usersRaw
        ? JSON.parse(usersRaw)
        : [];
      const existingIdx = users.findIndex((u) => u.email === ADMIN_EMAIL);
      const adminRecord = { ...adminUser, password };
      if (existingIdx >= 0) users[existingIdx] = adminRecord;
      else users.push(adminRecord);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    // ── Regular users ──────────────────────────────────────────────────────
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Email hoặc mật khẩu không đúng." };
    const { password: _, ...userData } = found;
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email này đã được đăng ký." };
    }
    const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL;
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      password,
      plan: isAdmin ? "enterprise" : "creator",
      joinedAt: new Date().toISOString(),
      credits: isAdmin ? UNLIMITED_CREDITS : 5,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Gửi thông báo lên server → lưu DB + gửi email Excel
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, plan: "Creator" }),
    }).catch(() => {
      // Không block đăng ký nếu API lỗi
    });
    const { password: _, ...userData } = newUser;
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = normalizeUser({ ...user, ...updates });
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
