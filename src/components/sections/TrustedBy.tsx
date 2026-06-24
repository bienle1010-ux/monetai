"use client";

import { motion } from "framer-motion";

const brands = ["OpenAI", "Anthropic", "Google", "Microsoft", "Adobe", "AWS", "Notion", "Canva"];

export default function TrustedBy() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[#6B7280] text-sm font-medium mb-10 uppercase tracking-widest"
        >
          Sản phẩm từ các thương hiệu hàng đầu
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {brands.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-[#9CA3AF] hover:text-[#6B7280] font-bold text-lg transition-colors cursor-default"
            >
              {b}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
