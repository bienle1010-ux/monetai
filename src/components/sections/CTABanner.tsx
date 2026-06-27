"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

export default function CTABanner() {
  const { config } = useContent();
  return (
    <section className="py-20 md:py-28 bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/20 via-transparent to-[#FF8C3A]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B00]/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] bg-clip-text text-transparent">
              {config.cta.title}
            </span>
          </h2>
          <p className="text-[#A0A0B0] text-lg mb-10 max-w-xl mx-auto">{config.cta.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold px-8 py-4 rounded-xl text-base transition-colors">
                {config.cta.btn1}<ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Link href="/#services" className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/5 font-semibold px-8 py-4 rounded-xl text-base transition-colors">
                <Play className="w-4 h-4" />{config.cta.btn2}
              </Link>
            </motion.div>
          </div>

          <p className="mt-8 text-[#A0A0B0] text-sm">
            Hơn <span className="text-white font-semibold">10.000+</span> người đã đăng ký · Thanh toán hoa hồng đúng hạn · Hỗ trợ tiếng Việt 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}
