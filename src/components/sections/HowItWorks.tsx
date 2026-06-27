"use client";

import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

export default function HowItWorks() {
  const { howItWorks, config } = useContent();

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
            {config.howItWorksTitle}
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Từ đăng ký đến nhận hoa hồng đầu tiên, mọi thứ đều đơn giản và tự động.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20px)] h-px bg-gradient-to-r from-[#FF6B00]/40 to-[#FF6B00]/10 z-0" />
              )}

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5 relative">
                  <span className="text-3xl">{s.icon}</span>
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
