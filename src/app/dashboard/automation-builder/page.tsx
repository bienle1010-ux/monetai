"use client";

import { motion } from "framer-motion";
import { Workflow, MessageCircle, Mail, BarChart2, Users, ArrowRight, Zap } from "lucide-react";

const templates = [
  { icon: MessageCircle, name: "Chatbot Bán Hàng", description: "Tự động trả lời khách hàng 24/7 qua Messenger, Zalo, Website.", steps: ["Khách gửi tin nhắn", "AI phân tích nhu cầu", "Gợi ý sản phẩm phù hợp", "Chốt đơn tự động"], color: "#FF6B00", difficulty: "Dễ" },
  { icon: Mail, name: "Email Nurturing", description: "Chuỗi email tự động chuyển đổi lead thành khách hàng.", steps: ["Lead điền form", "Gửi email chào mừng", "Chuỗi 7 email educate", "Offer sản phẩm"], color: "#3B82F6", difficulty: "Trung bình" },
  { icon: BarChart2, name: "Marketing Automation", description: "Phễu marketing tự động từ awareness đến conversion.", steps: ["Chạy quảng cáo", "Thu thập lead", "Nurturing tự động", "Bán hàng"], color: "#8B5CF6", difficulty: "Nâng cao" },
  { icon: Users, name: "CRM Automation", description: "Quản lý khách hàng, theo dõi pipeline và nhắc nhở bán hàng.", steps: ["Tạo khách hàng mới", "Phân loại tự động", "Giao việc cho team", "Theo dõi kết quả"], color: "#10B981", difficulty: "Trung bình" },
];

export default function AutomationBuilderPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Workflow className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Automation Builder</h1>
            <p className="text-[#A0A0B0] text-sm">Xây dựng hệ thống tự động hóa AI không cần code</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Flows đang chạy", value: "0" },
          { label: "Actions/ngày", value: "0" },
          { label: "Tiết kiệm giờ/tuần", value: "0h" },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center">
            <p className="text-white font-bold text-2xl">{s.value}</p>
            <p className="text-[#A0A0B0] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Templates phổ biến</h2>
          <span className="text-[#A0A0B0] text-sm">Chọn template để bắt đầu</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ borderColor: `${t.color}40` }}
              className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}15` }}>
                  <t.icon className="w-5 h-5" style={{ color: t.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{t.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${t.color}15`, color: t.color }}>{t.difficulty}</span>
                  </div>
                  <p className="text-[#A0A0B0] text-xs">{t.description}</p>
                </div>
              </div>

              {/* Flow preview */}
              <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                {t.steps.map((step, j) => (
                  <div key={j} className="flex items-center gap-1 shrink-0">
                    <span className="text-xs bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2 py-1 rounded-lg whitespace-nowrap">{step}</span>
                    {j < t.steps.length - 1 && <ArrowRight className="w-3 h-3 text-[#A0A0B0] shrink-0" />}
                  </div>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border transition-all hover:text-white"
                style={{ borderColor: `${t.color}30`, color: t.color }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${t.color}10`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <Zap className="w-4 h-4" />
                Sử dụng template này
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Builder hint */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center shrink-0">
            <Workflow className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Tự xây dựng Automation Flow</h3>
            <p className="text-[#A0A0B0] text-sm mb-3">Kéo thả các blocks để tạo workflow tùy chỉnh. Không cần code, chỉ cần kéo và thả.</p>
            <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-[#1A1A2E] font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" />
              Mở Visual Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
