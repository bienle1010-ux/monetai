"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const benefits = [
  "500 lượt AI miễn phí mỗi tháng",
  "AI Content Generator & Video Script",
  "Truy cập Affiliate Marketplace",
  "Dashboard theo dõi doanh thu",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#111118] to-[#0A0A0F] border-r border-[#2A2A3A] p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FF6B00]/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-xl text-white">Monet<span className="text-[#FF6B00]">AI</span></span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">
            Bắt đầu kiếm tiền từ AI<br />ngay hôm nay
          </h2>
          <p className="text-[#A0A0B0] mb-10">
            Tham gia hàng nghìn người đang tạo thu nhập thụ động từ AI Commerce.
          </p>
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#FF6B00]" />
                </div>
                <span className="text-[#A0A0B0] text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#A0A0B0] text-sm relative">
          "Tôi kiếm được 5 triệu đầu tiên chỉ sau 2 tuần dùng MonetAI!"<br />
          <span className="text-white font-semibold">— Nguyễn Văn Hùng</span>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-bold text-lg text-white">Monet<span className="text-[#FF6B00]">AI</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2">Tạo tài khoản</h1>
          <p className="text-[#A0A0B0] text-sm mb-8">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-[#FF6B00] hover:underline font-medium">
              Đăng nhập
            </Link>
          </p>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                />
              </div>
            </div>

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
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Ít nhất 6 ký tự"
                  required
                  className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-12 py-3.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Tạo tài khoản miễn phí
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-[#A0A0B0]">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Link href="#" className="text-[#FF6B00] hover:underline">Điều khoản dịch vụ</Link>
            {" "}và{" "}
            <Link href="#" className="text-[#FF6B00] hover:underline">Chính sách bảo mật</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
