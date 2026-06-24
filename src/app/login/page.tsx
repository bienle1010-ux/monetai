"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Đăng nhập thất bại.");
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    // Try to register a demo account first, then login
    const { register } = await import("@/contexts/AuthContext").then(() => {
      return { register: null };
    });
    // Direct login attempt with preset demo credentials
    setForm({ email: "demo@monetai.vn", password: "demo123456" });
    const res = await login("demo@monetai.vn", "demo123456");
    if (!res.success) {
      // Register demo account then login
      const regRes = await fetch("/api/demo-register", { method: "POST" }).catch(() => null);
      if (!regRes) {
        // Fallback: manually register via AuthContext
        const usersRaw = localStorage.getItem("monetai_users") || "[]";
        const users = JSON.parse(usersRaw);
        if (!users.find((u: { email: string }) => u.email === "demo@monetai.vn")) {
          users.push({
            id: "demo",
            name: "Demo User",
            email: "demo@monetai.vn",
            password: "demo123456",
            plan: "pro",
            joinedAt: new Date().toISOString(),
            credits: 3000,
          });
          localStorage.setItem("monetai_users", JSON.stringify(users));
        }
        const res2 = await login("demo@monetai.vn", "demo123456");
        if (res2.success) router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-xl text-white">Monet<span className="text-[#FF6B00]">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Chào mừng trở lại!</h1>
          <p className="text-[#A0A0B0] text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-[#FF6B00] hover:underline font-medium">
              Đăng ký miễn phí
            </Link>
          </p>
        </div>

        <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-8">
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                  className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#A0A0B0] text-xs font-medium">Mật khẩu</label>
                <Link href="#" className="text-xs text-[#FF6B00] hover:underline">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mật khẩu"
                  required
                  className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-12 py-3.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A3A]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#111118] px-3 text-xs text-[#A0A0B0]">hoặc</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full border border-[#2A2A3A] hover:border-[#FF6B00]/40 text-[#A0A0B0] hover:text-white py-3 rounded-xl text-sm font-medium transition-all"
          >
            Dùng tài khoản Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
