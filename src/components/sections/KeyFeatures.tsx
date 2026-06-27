"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

type LucideIconName = keyof typeof LucideIcons;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons[name as LucideIconName] ?? LucideIcons.Zap) as React.ComponentType<{ className?: string }>;
  return <Icon className={className} />;
}

export default function KeyFeatures() {
  const { features, config } = useContent();

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
            {config.featuresTitle}
          </h2>
          <p className="text-[#A0A0B0] text-lg max-w-2xl mx-auto">
            {features.length} tính năng AI mạnh mẽ giúp bạn kiếm tiền nhanh hơn, thông minh hơn mà không cần kỹ năng kỹ thuật.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(255,107,0,0.3)" }}
              className="flex items-center gap-4 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 cursor-default transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                <DynamicIcon name={f.icon} className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <p className="text-white text-sm font-medium leading-snug">{f.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
