"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Zap, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!user) return null;

  const planInfo: Record<string, { color: string; limit: string }> = {
    creator: { color: "#6B7280", limit: "500 credits/tháng" },
    pro: { color: "#FF6B00", limit: "3.000 credits/tháng" },
    agency: { color: "#8B5CF6", limit: "Không giới hạn" },
    enterprise: { color: "#10B981", limit: "Custom" },
  };
  const plan = planInfo[user.plan] ?? planInfo.creator;

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-white">Hồ sơ của tôi</h1>
        <p className="text-[#A0A0B0] text-sm">Quản lý thông tin tài khoản</p>
      </motion.div>

      {/* Avatar & plan */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-3xl shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{user.name}</h2>
            <p className="text-[#A0A0B0] text-sm mb-2">{user.email}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${plan.color}15`, color: plan.color }}>
              <Shield className="w-3.5 h-3.5" />
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-1"><Zap className="w-4 h-4 text-[#FF6B00]" /></div>
          <p className="text-white font-bold text-xl">{user.credits}</p>
          <p className="text-[#A0A0B0] text-xs mt-0.5">Credits còn lại</p>
        </div>
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center">
          <p className="text-white font-bold text-xl">0</p>
          <p className="text-[#A0A0B0] text-xs mt-0.5">Nội dung đã tạo</p>
        </div>
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center">
          <p className="text-white font-bold text-xl">0₫</p>
          <p className="text-[#A0A0B0] text-xs mt-0.5">Tổng hoa hồng</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 mb-5">
        <h3 className="text-white font-semibold mb-4">Thông tin cá nhân</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
              <input
                value={user.email}
                disabled
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-3 text-[#A0A0B0] text-sm cursor-not-allowed"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {saved ? "✓ Đã lưu!" : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Gói hiện tại</h3>
            <p className="text-[#A0A0B0] text-sm">{plan.limit}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold capitalize" style={{ color: plan.color }}>{user.plan}</span>
            <p className="text-[#A0A0B0] text-xs mt-0.5">Đang hoạt động</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#2A2A3A]">
          <a href="/dashboard/billing" className="flex items-center gap-2 text-[#FF6B00] text-sm font-medium hover:underline">
            <CreditCard className="w-4 h-4" />
            Nâng cấp gói →
          </a>
        </div>
      </div>
    </div>
  );
}
