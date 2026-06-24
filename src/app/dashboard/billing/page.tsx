"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, ShoppingCart, Info } from "lucide-react";
import { useAuth, UNLIMITED_CREDITS } from "@/contexts/AuthContext";
import { plans } from "@/data/pricing";

const ADMIN_EMAIL = "monetai.vn@gmail.com";

const CREDIT_PACKAGES = [
  { credits: 10,  price: 10_000,  label: "Dùng thử",  badge: "" },
  { credits: 50,  price: 50_000,  label: "Cơ bản",    badge: "" },
  { credits: 100, price: 100_000, label: "Phổ biến",  badge: "HOT" },
  { credits: 300, price: 300_000, label: "Tiết kiệm", badge: "-0%" },
  { credits: 500, price: 500_000, label: "Chuyên gia", badge: "BEST" },
];

export default function BillingPage() {
  const { user, updateUser } = useAuth();
  const [buyingPkg, setBuyingPkg] = useState<number | null>(null);

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const isUnlimited = isAdmin || user?.credits === UNLIMITED_CREDITS;
  const credits     = user?.credits ?? 0;

  const handleUpgrade = (planId: string) => {
    if (planId === user?.plan) return;
    updateUser({ plan: planId as "creator" | "pro" | "agency" | "enterprise" });
    alert(`Đã chuyển gói ${planId}. (Demo)`);
  };

  const handleBuyCredits = (pkg: typeof CREDIT_PACKAGES[0], idx: number) => {
    setBuyingPkg(idx);
    setTimeout(() => {
      if (!isUnlimited && user) {
        updateUser({ credits: user.credits + pkg.credits });
      }
      alert(
        `Demo: Đã nạp ${pkg.credits} credits!\nThực tế: Chuyển khoản ${pkg.price.toLocaleString("vi-VN")} ₫ theo thông tin bên dưới.`
      );
      setBuyingPkg(null);
    }, 800);
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Nạp Credits & Nâng cấp gói</h1>
            <p className="text-[#A0A0B0] text-sm">
              Credits hiện tại:{" "}
              <span className={`font-bold ${isUnlimited ? "text-[#FF6B00]" : "text-white"}`}>
                {isUnlimited ? "∞ (Không giới hạn)" : credits}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Credits section ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Nạp Credits AI</h2>
          <div className="flex items-center gap-1.5 text-[#A0A0B0] text-xs bg-[#16161F] border border-[#2A2A3A] px-3 py-1.5 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
            1 credit = 1.000 ₫
          </div>
        </div>

        {isUnlimited ? (
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-2xl p-6 text-center">
            <Zap className="w-8 h-8 text-[#FF6B00] mx-auto mb-2" />
            <p className="text-white font-semibold">Tài khoản Admin — Credits không giới hạn</p>
            <p className="text-[#A0A0B0] text-sm mt-1">Bạn có thể tạo nội dung không giới hạn số lần.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
              {CREDIT_PACKAGES.map((pkg, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 text-center hover:border-[#FF6B00]/30 transition-all cursor-pointer"
                  onClick={() => handleBuyCredits(pkg, i)}
                >
                  {pkg.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                  <div className="text-[#FF6B00] font-bold text-xl mb-0.5">{pkg.credits}</div>
                  <div className="text-[#A0A0B0] text-xs mb-3">credits</div>
                  <div className="text-white font-semibold text-sm">{pkg.price.toLocaleString("vi-VN")} ₫</div>
                  <div className="text-[#A0A0B0] text-xs mt-0.5">{pkg.label}</div>
                  <button
                    disabled={buyingPkg === i}
                    className="mt-3 w-full bg-[#FF6B00]/15 hover:bg-[#FF6B00] hover:text-white text-[#FF6B00] text-xs font-semibold py-2 rounded-xl transition-all disabled:opacity-50"
                  >
                    {buyingPkg === i ? "Đang xử lý..." : "Nạp ngay"}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Payment info */}
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-[#FF6B00]" />
                <p className="text-white text-sm font-semibold">Hướng dẫn nạp tiền</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#A0A0B0] text-xs uppercase tracking-wide mb-2 font-medium">Chuyển khoản ngân hàng</p>
                  <div className="space-y-1.5">
                    {[
                      ["Ngân hàng", "Vietcombank / MB Bank"],
                      ["Số TK", "1234 5678 9012"],
                      ["Chủ TK", "MONET AI VIETNAM"],
                      ["Nội dung", `NAP CREDITS [email của bạn]`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-[#A0A0B0]">{k}:</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[#A0A0B0] text-xs uppercase tracking-wide mb-2 font-medium">Sau khi chuyển khoản</p>
                  <div className="space-y-2 text-[#A0A0B0] text-xs">
                    <p>1. Chụp ảnh biên lai chuyển khoản</p>
                    <p>2. Gửi vào Zalo/Email: <span className="text-white">monetai.vn@gmail.com</span></p>
                    <p>3. Credits được cộng trong <strong className="text-white">30 phút</strong></p>
                    <p>4. Hotline hỗ trợ: <strong className="text-white">0562 557 777</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Plans section ── */}
      <div>
        <h2 className="text-white font-semibold mb-4">Gói đăng ký hàng tháng</h2>
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
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Đang dùng</span>
                  </div>
                )}

                <h3 className="font-bold text-lg mb-1 text-white">{plan.name}</h3>
                {plan.price ? (
                  <p className="text-2xl font-bold mb-1 text-white">
                    {plan.price.toLocaleString("vi-VN")}₫<span className="text-sm font-normal text-[#A0A0B0]">/tháng</span>
                  </p>
                ) : (
                  <p className="text-2xl font-bold mb-1 text-white">Liên hệ</p>
                )}

                {/* Credits per plan */}
                <div className="flex items-center gap-1 mb-4">
                  <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span className="text-[#FF6B00] text-xs font-semibold">
                    {plan.id === "creator" ? "500" : plan.id === "pro" ? "3.000" : "Không giới hạn"} credits/tháng
                  </span>
                </div>

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
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-[#FF6B00] hover:bg-[#E55A00] text-white"
                      : "border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                  }`}
                >
                  {!isCurrent && <ShoppingCart className="w-4 h-4" />}
                  {isCurrent ? "Gói hiện tại" : "Đăng ký ngay"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
