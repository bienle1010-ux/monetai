"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, PenTool, Video, Bot, MessageSquare, Workflow, Store, GraduationCap, ArrowRight } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp, PenTool, Video, Bot, MessageSquare, Workflow, Store, GraduationCap,
};

export default function ServicesGrid() {
  const { services, config } = useContent();

  return (
    <section id="services" className="py-20 md:py-28 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF6B00] mb-4 bg-[#FF6B00]/10 px-3 py-1.5 rounded-full">Dịch vụ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">{config.servicesTitle}</h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">Toàn bộ hệ sinh thái AI Commerce trong một nền tảng.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
              <motion.div key={s.id || s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                <Link href={s.href}>
                  <motion.div whileHover={{ y: -4, boxShadow: `0 20px 40px ${s.color}22` }} whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="h-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-gray-200 cursor-pointer group transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${s.color}15` }}>
                      {Icon && <Icon className="w-6 h-6" style={{ color: s.color }} />}
                    </div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-2 text-sm leading-snug">{s.title}</h3>
                    <p className="text-[#6B7280] text-xs leading-relaxed mb-4">{s.description}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: s.color }}>
                      Khám phá <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
