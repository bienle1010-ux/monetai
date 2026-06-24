"use client";

import { motion } from "framer-motion";
import { CreditCard, Check, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { plans } from "@/data/pricing";

export default function BillingPage() {
  const { user, updateUser } = useAuth();

  const handleUpgrade = (planId: string) => {
    if (planId === user?.plan) return;
    const creditsMap: Record<string, number> = { creator: 500, pro: 3000, agency: 999999, enterprise: 999999 };
    updateUser({ plan: planId as "creator" | "pro" | "agency" | "enterprise", credits: creditsMap[planId] ?? 500 });
    alert(`Đã nâng cấp lên gói ${planId}! (Demo mode - không tính phí)`);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Nâng cấp gói</h1>
            <p className="text-[#A0A0B0] text-sm">Gói hiện tại: <span className="text-[#FF6B00] capitalize font-semibold">{user?.plan}</span></p>
          </div>
        </div>
      </motion.div>

      <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FF6B00]" />
          <p className="text-[#A0A0B0] text-sm">
            <span className="text-white font-semibold">Demo Mode:</span> Chọn gói bất kỳ để test. Không tính phí thực.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan, i) => {
          const isCurrent = user?.plan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.popular ? "bg-[#1A1A2E] border-2 border-[#FF6B00]" : "bg-[#16161F] border border-[#2A2A3A]"
              } ${isCurrent ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.badge && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FF6B00] text-white text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Gói hiện tại</span>
                </div>
              )}

              <h3 className={`font-bold text-lg mb-1 ${plan.popular ? "text-white" : "text-white"}`}>{plan.name}</h3>
              {plan.price ? (
                <p className={`text-2xl font-bold mb-4 ${plan.popular ? "text-white" : "text-white"}`}>
                  {plan.price.toLocaleString("vi-VN")}₫<span className="text-sm font-normal text-[#A0A0B0]">/tháng</span>
                </p>
              ) : (
                <p className="text-2xl font-bold mb-4 text-white">Liên hệ</p>
              )}

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span className="text-[#A0A0B0] text-xs">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isCurrent
                    ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                    : plan.popular
                    ? "bg-[#FF6B00] hover:bg-[#E55A00] text-white"
                    : "border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                }`}
              >
                {isCurrent ? "Đang dùng" : "Chọn gói này"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
