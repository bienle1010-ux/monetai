"use client";

import { motion } from "framer-motion";
import { UserPlus, Package, Share2, Banknote } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Đăng ký miễn phí", description: "Tạo tài khoản MonetAI trong 30 giây. Không cần thẻ tín dụng, không phí ẩn." },
  { icon: Package, step: "02", title: "Chọn sản phẩm AI", description: "Duyệt 200+ AI Tools và 1.000+ AI Agents có chương trình Affiliate hấp dẫn." },
  { icon: Share2, step: "03", title: "Chia sẻ link Affiliate", description: "Nhận link riêng, tạo nội dung bán hàng bằng AI và chia sẻ lên mạng xã hội." },
  { icon: Banknote, step: "04", title: "Nhận hoa hồng", description: "Hoa hồng ghi nhận tự động, thanh toán định kỳ về tài khoản ngân hàng của bạn." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF6B00] mb-4 bg-[#FF6B00]/10 px-3 py-1.5 rounded-full">
            Cách hoạt động
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
            Kiếm tiền với MonetAI chỉ trong 4 bước
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Từ đăng ký đến nhận hoa hồng đầu tiên, mọi thứ đều đơn giản và tự động.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20px)] h-px bg-gradient-to-r from-[#FF6B00]/40 to-[#FF6B00]/10 z-0" />
              )}

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5 relative">
                  <s.icon className="w-9 h-9 text-[#FF6B00]" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6B00] rounded-full text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">{s.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
