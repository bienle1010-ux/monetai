"use client";

import { motion } from "framer-motion";
import { Zap, Search, Facebook, Smartphone, Target, Globe, BarChart2, Megaphone, ShoppingBag, Wallet, Users, PieChart } from "lucide-react";

const features = [
  { icon: Zap, title: "Một chạm tạo nội dung Affiliate" },
  { icon: Search, title: "Tự động nghiên cứu sản phẩm" },
  { icon: Facebook, title: "AI tạo bài Facebook" },
  { icon: Smartphone, title: "AI tạo video TikTok" },
  { icon: Target, title: "AI tạo CTA bán hàng" },
  { icon: Globe, title: "AI tối ưu SEO" },
  { icon: BarChart2, title: "Theo dõi doanh thu Affiliate" },
  { icon: Megaphone, title: "Quản lý chiến dịch Marketing" },
  { icon: ShoppingBag, title: "Marketplace AI lớn nhất VN" },
  { icon: Wallet, title: "Thanh toán hoa hồng tự động" },
  { icon: Users, title: "Hệ thống đa AI Agent" },
  { icon: PieChart, title: "Dashboard phân tích doanh thu" },
];

export default function KeyFeatures() {
  return (
    <section className="py-20 md:py-28 bg-[#111118]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF6B00] mb-4 bg-[#FF6B00]/10 px-3 py-1.5 rounded-full">
            Tính năng
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tại sao chọn MonetAI?
          </h2>
          <p className="text-[#A0A0B0] text-lg max-w-2xl mx-auto">
            12 tính năng AI mạnh mẽ giúp bạn kiếm tiền nhanh hơn, thông minh hơn mà không cần kỹ năng kỹ thuật.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(255,107,0,0.3)" }}
              className="flex items-center gap-4 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 cursor-default transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <p className="text-white text-sm font-medium leading-snug">{f.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
