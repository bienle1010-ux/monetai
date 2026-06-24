"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại.");
        return;
      }

      localStorage.setItem("monetai_admin_token", data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Lỗi kết nối. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 mb-4">
            <Shield className="w-8 h-8 text-[#FF6B00]" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Monet<span className="text-[#FF6B00]">AI</span> Admin
          </h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Trang quản trị nội bộ</p>
        </div>

        {/* Form */}
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Email quản trị</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@monetai.vn"
                required
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0B0]/50 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 pr-12 text-white placeholder-[#A0A0B0]/50 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition-colors p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-[#A0A0B0] text-xs mt-6">
          Trang này chỉ dành cho quản trị viên MonetAI
        </p>
      </motion.div>
    </div>
  );
}
