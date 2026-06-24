"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, PenTool, Video, Bot, MessageSquare, Workflow, Store, GraduationCap, ArrowRight, DollarSign, Users, BarChart2, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const quickLinks = [
  { label: "AI Content", href: "/dashboard/content-generator", icon: PenTool, color: "#3B82F6" },
  { label: "AI Video", href: "/dashboard/video-script", icon: Video, color: "#8B5CF6" },
  { label: "Affiliate", href: "/dashboard/affiliate", icon: TrendingUp, color: "#FF6B00" },
  { label: "AI Agents", href: "/dashboard/agent-marketplace", icon: Bot, color: "#10B981" },
  { label: "Prompts", href: "/dashboard/prompt-marketplace", icon: MessageSquare, color: "#EC4899" },
  { label: "Automation", href: "/dashboard/automation-builder", icon: Workflow, color: "#F59E0B" },
  { label: "SaaS", href: "/dashboard/saas-marketplace", icon: Store, color: "#06B6D4" },
  { label: "Academy", href: "/dashboard/academy", icon: GraduationCap, color: "#6366F1" },
];

const stats = [
  { label: "Doanh thu tháng", value: "0 ₫", icon: DollarSign, change: "+0%", color: "#FF6B00" },
  { label: "Lượt click", value: "0", icon: BarChart2, change: "+0%", color: "#3B82F6" },
  { label: "Đơn hàng", value: "0", icon: TrendingUp, change: "+0%", color: "#10B981" },
  { label: "Credits còn lại", value: "", icon: Zap, change: "", color: "#F59E0B", dynamic: "credits" },
];

const recentActivity = [
  { text: "Chào mừng bạn đến với MonetAI!", time: "Vừa xong", type: "info" },
  { text: "Tài khoản Creator đã được kích hoạt", time: "Vừa xong", type: "success" },
  { text: "500 AI credits đã được thêm vào tài khoản", time: "Vừa xong", type: "success" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">
          Chào mừng, {user?.name?.split(" ").pop()}! 👋
        </h1>
        <p className="text-[#A0A0B0]">Bắt đầu kiếm tiền với AI ngay hôm nay.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              {s.change && <span className="text-green-400 text-xs font-medium">{s.change}</span>}
            </div>
            <p className="text-2xl font-bold text-white">
              {s.dynamic === "credits" ? user?.credits ?? 0 : s.value}
            </p>
            <p className="text-[#A0A0B0] text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick access */}
        <div className="lg:col-span-2">
          <h2 className="text-white font-semibold mb-4">Truy cập nhanh</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              >
                <Link href={l.href}>
                  <motion.div
                    whileHover={{ y: -2, borderColor: `${l.color}40` }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center cursor-pointer transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${l.color}15` }}
                    >
                      <l.icon className="w-5 h-5" style={{ color: l.color }} />
                    </div>
                    <p className="text-white text-xs font-medium">{l.label}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Getting started */}
          <div className="mt-6 bg-gradient-to-br from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">🚀 Bắt đầu ngay</h3>
            <div className="space-y-3">
              {[
                { step: 1, text: "Tạo nội dung Affiliate đầu tiên", href: "/dashboard/content-generator" },
                { step: 2, text: "Tìm sản phẩm AI để quảng bá", href: "/dashboard/affiliate" },
                { step: 3, text: "Xem khóa học AI Affiliate miễn phí", href: "/dashboard/academy" },
              ].map((item) => (
                <Link
                  key={item.step}
                  href={item.href}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] text-xs font-bold shrink-0">
                    {item.step}
                  </div>
                  <span className="text-[#A0A0B0] group-hover:text-white text-sm transition-colors">{item.text}</span>
                  <ArrowRight className="w-4 h-4 text-[#A0A0B0] group-hover:text-[#FF6B00] ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-white font-semibold mb-4">Hoạt động gần đây</h2>
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4">
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === "success" ? "bg-green-400" : "bg-[#FF6B00]"}`} />
                  <div>
                    <p className="text-white text-sm leading-snug">{a.text}</p>
                    <p className="text-[#A0A0B0] text-xs mt-0.5">{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A2A3A]">
              <p className="text-[#A0A0B0] text-xs text-center">
                Gói hiện tại: <span className="text-[#FF6B00] font-semibold capitalize">{user?.plan}</span>
              </p>
              <Link
                href="/dashboard/billing"
                className="mt-3 w-full block text-center text-xs font-semibold text-[#FF6B00] border border-[#FF6B00]/30 rounded-xl py-2.5 hover:bg-[#FF6B00]/10 transition-colors"
              >
                Nâng cấp gói
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
