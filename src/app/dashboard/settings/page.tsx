"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  const [notif, setNotif] = useState({ email: true, browser: false, weekly: true });

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#A0A0B0]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cài đặt</h1>
            <p className="text-[#A0A0B0] text-sm">Tùy chỉnh trải nghiệm của bạn</p>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-white font-semibold">Thông báo</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: "email", label: "Email thông báo", desc: "Nhận email khi có hoa hồng mới hoặc đơn hàng" },
            { key: "browser", label: "Thông báo trình duyệt", desc: "Hiển thị thông báo ngay trên màn hình" },
            { key: "weekly", label: "Báo cáo tuần", desc: "Tổng kết doanh thu và hiệu suất mỗi tuần" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-[#A0A0B0] text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotif({ ...notif, [item.key]: !notif[item.key as keyof typeof notif] })}
                className={`relative w-11 h-6 rounded-full transition-colors ${notif[item.key as keyof typeof notif] ? "bg-[#FF6B00]" : "bg-[#2A2A3A]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notif[item.key as keyof typeof notif] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-white font-semibold">Ngôn ngữ</h3>
        </div>
        <select className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#FF6B00] outline-none">
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Security */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-white font-semibold">Bảo mật</h3>
        </div>
        <button className="text-[#FF6B00] text-sm font-medium hover:underline">
          Đổi mật khẩu →
        </button>
      </div>
    </div>
  );
}
