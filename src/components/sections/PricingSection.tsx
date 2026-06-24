"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { plans } from "@/data/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF6B00] mb-4 bg-[#FF6B00]/10 px-3 py-1.5 rounded-full">
            Bảng giá
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi bạn phát triển. Không phí ẩn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? "bg-[#1A1A2E] border-2 border-[#FF6B00] shadow-xl"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FF6B00] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-xl mb-1 ${plan.popular ? "text-white" : "text-[#1A1A2E]"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-[#A0A0B0]" : "text-[#6B7280]"}`}>
                  {plan.description}
                </p>
                {plan.price ? (
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.popular ? "text-white" : "text-[#1A1A2E]"}`}>
                      {plan.price.toLocaleString("vi-VN")}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-[#A0A0B0]" : "text-[#6B7280]"}`}>
                      ₫/{plan.period}
                    </span>
                  </div>
                ) : (
                  <p className={`text-2xl font-bold ${plan.popular ? "text-white" : "text-[#1A1A2E]"}`}>
                    Liên hệ
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span className={`text-sm ${plan.popular ? "text-[#A0A0B0]" : "text-[#6B7280]"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link
                  href="/register"
                  className={`w-full py-3 rounded-lg text-sm font-semibold text-center block transition-colors ${
                    plan.popular
                      ? "bg-[#FF6B00] hover:bg-[#E55A00] text-white"
                      : "border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
