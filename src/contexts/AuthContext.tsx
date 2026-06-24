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

const STORAGE_KEY = "monetai_user";
const USERS_KEY = "monetai_users";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Email hoặc mật khẩu không đúng." };
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email này đã được đăng ký." };
    }
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      password,
      plan: "creator",
      joinedAt: new Date().toISOString(),
      credits: 500,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
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
