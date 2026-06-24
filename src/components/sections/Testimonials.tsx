"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
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
            Đánh giá
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Khách hàng nói về MonetAI
          </h2>
          <p className="text-[#A0A0B0] text-lg max-w-2xl mx-auto">
            Hàng nghìn người đã thay đổi thu nhập nhờ MonetAI. Đây là câu chuyện của họ.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: "rgba(255,107,0,0.3)" }}
              className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />
                ))}
              </div>
              <p className="text-[#A0A0B0] text-sm leading-relaxed mb-6">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-[#A0A0B0] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
