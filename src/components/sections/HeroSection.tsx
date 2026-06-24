"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, ShoppingBag, Sparkles } from "lucide-react";

const stats = [
  { icon: ShoppingBag, label: "AI Tools", value: "200+" },
  { icon: Users, label: "AI Agents", value: "1.000+" },
  { icon: TrendingUp, label: "Đơn hàng", value: "1M+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F] pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#FF6B00]/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #FF6B00 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-[#FF6B00] text-sm font-medium">Nền tảng AI Commerce #1 Việt Nam</span>
              </div>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            >
              Earn{" "}
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] bg-clip-text text-transparent">
                More
              </span>{" "}
              With{" "}
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] bg-clip-text text-transparent">
                AI
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-[#A0A0B0] text-lg leading-relaxed mb-10 max-w-xl"
            >
              MonetAI kết nối người tạo sản phẩm AI, người quảng bá và khách hàng trên cùng một nền tảng. Kiếm tiền từ AI không cần kỹ năng kỹ thuật.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-base"
                >
                  Bắt đầu miễn phí
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/5 font-semibold px-7 py-3.5 rounded-lg transition-colors text-base"
                >
                  Khám phá dịch vụ
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-6"
            >
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">{value}</p>
                    <p className="text-[#A0A0B0] text-xs mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="relative z-10 bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#A0A0B0] text-sm">Doanh thu tháng này</p>
                    <p className="text-3xl font-bold text-white">12.500.000 ₫</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
                    <span className="text-green-400 text-sm font-semibold">+47.3%</span>
                  </div>
                </div>
                {/* Mini chart bars */}
                <div className="flex items-end gap-2 h-24 mb-4">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 75, 100, 85, 110].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#FF6B00]/80 to-[#FF8C3A]/60 rounded-t-sm"
                      style={{ height: `${h * 0.85}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-[#A0A0B0]">
                  <span>T1</span><span>T3</span><span>T5</span><span>T7</span><span>T9</span><span>T11</span>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 shadow-xl"
              >
                <p className="text-xs text-[#A0A0B0] mb-1">Hoa hồng hôm nay</p>
                <p className="text-white font-bold text-lg">850.000 ₫</p>
                <p className="text-green-400 text-xs mt-1">↑ 12 đơn hàng</p>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 shadow-xl"
              >
                <p className="text-xs text-[#A0A0B0] mb-1">Nội dung đã tạo</p>
                <p className="text-white font-bold text-lg">2.847</p>
                <p className="text-[#FF6B00] text-xs mt-1">bài viết & video</p>
              </motion.div>

              {/* Glow */}
              <div className="absolute inset-0 -z-10 bg-[#FF6B00]/10 blur-3xl rounded-3xl scale-110" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
