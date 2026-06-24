"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Check, Zap, QrCode, Copy, CheckCircle2, RefreshCw, X } from "lucide-react";
import { useAuth, UNLIMITED_CREDITS } from "@/contexts/AuthContext";
import { plans } from "@/data/pricing";

const ADMIN_EMAIL = "monetai.vn@gmail.com";
const MB_ACCOUNT  = "0971166299";
const MB_NAME     = "LE VAN BIEN";
const BANK_ID     = "MB";

const CREDIT_PACKAGES = [
  { credits: 10,  price: 10_000  },
  { credits: 50,  price: 50_000  },
  { credits: 100, price: 100_000, badge: "PHỔ BIẾN" },
  { credits: 300, price: 300_000 },
  { credits: 500, price: 500_000, badge: "TIẾT KIỆM" },
];

function vietqrUrl(amount: number, email: string) {
  const info = encodeURIComponent(`MN ${email}`);
  const name = encodeURIComponent(MB_NAME);
  return `https://img.vietqr.io/image/${BANK_ID}-${MB_ACCOUNT}-compact2.png?amount=${amount}&addInfo=${info}&accountName=${name}`;
}

export default function BillingPage() {
  const { user, updateUser } = useAuth();
  const [selected, setSelected]   = useState<typeof CREDIT_PACKAGES[0] | null>(null);
  const [qrOpen, setQrOpen]       = useState(false);
  const [copied, setCopied]       = useState<string | null>(null);
  const [syncing, setSyncing]     = useState(false);
  const [syncMsg, setSyncMsg]     = useState("");

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const isUnlimited = isAdmin || user?.credits === UNLIMITED_CREDITS;
  const credits     = user?.credits ?? 0;

  const handleSelectPackage = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelected(pkg);
    setQrOpen(true);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Sync credits from Casso payments (Supabase)
  const handleSync = async () => {
    if (!user?.email || isUnlimited) return;
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch(`/api/payment/status?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.credits > credits) {
        updateUser({ credits: data.credits });
        setSyncMsg(`Cập nhật thành công! Credits: ${data.credits}`);
      } else {
        setSyncMsg("Chưa có thanh toán mới được ghi nhận.");
      }
    } catch {
      setSyncMsg("Lỗi kết nối. Thử lại sau.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(""), 4000);
    }
  };

  // Auto-sync credits on load
  useEffect(() => {
    if (user?.email && !isUnlimited) {
      fetch(`/api/payment/status?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.credits > (user.credits ?? 0)) {
            updateUser({ credits: data.credits });
          }
        })
        .catch(() => {});
    }
  }, [user?.email]);

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Nạp Credits</h1>
              <p className="text-[#A0A0B0] text-sm">
                Credits hiện tại:{" "}
                <span className={`font-bold ${isUnlimited ? "text-[#FF6B00]" : "text-white"}`}>
                  {isUnlimited ? "∞ Không giới hạn" : credits}
                </span>
              </p>
            </div>
          </div>

          {!isUnlimited && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 text-sm bg-[#16161F] border border-[#2A2A3A] hover:border-[#FF6B00]/30 text-[#A0A0B0] hover:text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Đang kiểm tra..." : "Đồng bộ credits"}
            </button>
          )}
        </div>

        {syncMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm px-4 py-2.5 rounded-xl border ${syncMsg.includes("thành công") ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
            {syncMsg}
          </motion.div>
        )}
      </motion.div>

      {isUnlimited ? (
        <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-2xl p-8 text-center mb-8">
          <Zap className="w-10 h-10 text-[#FF6B00] mx-auto mb-3" />
          <p className="text-white font-bold text-lg">Tài khoản Admin — Credits không giới hạn</p>
          <p className="text-[#A0A0B0] text-sm mt-1">Tạo nội dung không giới hạn số lần.</p>
        </div>
      ) : (
        <>
          {/* Pricing info */}
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-white text-sm font-semibold">1 credit = 1.000 ₫</span>
            <span className="text-[#A0A0B0] text-sm">— Chọn gói và quét mã QR để nạp</span>
          </div>

          {/* Credit packages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {CREDIT_PACKAGES.map((pkg, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectPackage(pkg)}
                className="relative bg-[#16161F] border border-[#2A2A3A] hover:border-[#FF6B00]/50 rounded-2xl p-4 text-center transition-all"
              >
                {pkg.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                )}
                <div className="text-[#FF6B00] font-bold text-2xl mb-0.5">{pkg.credits}</div>
                <div className="text-[#A0A0B0] text-xs mb-3">credits</div>
                <div className="text-white font-semibold">{pkg.price.toLocaleString("vi-VN")} ₫</div>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs bg-[#FF6B00]/15 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white py-1.5 rounded-xl transition-all font-medium">
                  <QrCode className="w-3.5 h-3.5" />
                  Quét QR
                </div>
              </motion.button>
            ))}
          </div>

          {/* Bank info */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00] text-xs font-bold">i</span>
              Thông tin chuyển khoản
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  { label: "Ngân hàng", value: "MB Bank (Ngân hàng Quân Đội)" },
                  { label: "Số tài khoản", value: MB_ACCOUNT, copy: true },
                  { label: "Chủ tài khoản", value: MB_NAME },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[#A0A0B0] text-sm">{row.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{row.value}</span>
                      {row.copy && (
                        <button onClick={() => handleCopy(row.value, row.label)} className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors">
                          {copied === row.label ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0A0A0F] rounded-xl p-4 space-y-2">
                <p className="text-[#FF6B00] text-xs font-semibold uppercase tracking-wide mb-3">Nội dung chuyển khoản</p>
                <div className="flex items-center justify-between">
                  <code className="text-white text-sm font-mono bg-[#16161F] px-3 py-1.5 rounded-lg">
                    MN {user?.email ?? "your@email.com"}
                  </code>
                  <button onClick={() => handleCopy(`MN ${user?.email ?? ""}`, "desc")} className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors ml-2">
                    {copied === "desc" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[#A0A0B0] text-xs mt-2">Hệ thống tự động nhận dạng và cộng credits ngay sau khi thanh toán.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Plans section */}
      <h2 className="text-white font-semibold mb-4">Gói đăng ký hàng tháng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan, i) => {
          const isCurrent = user?.plan === plan.id;
          return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 flex flex-col ${plan.popular ? "bg-[#1A1A2E] border-2 border-[#FF6B00]" : "bg-[#16161F] border border-[#2A2A3A]"} ${isCurrent ? "ring-2 ring-green-500" : ""}`}
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
                onClick={() => {
                  if (!isCurrent) {
                    updateUser({ plan: plan.id as "creator" | "pro" | "agency" | "enterprise" });
                    alert("Liên hệ monetai.vn@gmail.com hoặc 0562557777 để kích hoạt gói này.");
                  }
                }}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${isCurrent ? "bg-green-500/20 text-green-400 cursor-not-allowed" : plan.popular ? "bg-[#FF6B00] hover:bg-[#E55A00] text-white" : "border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"}`}
              >
                {isCurrent ? "Gói hiện tại" : "Liên hệ đăng ký"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setQrOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <button onClick={() => setQrOpen(false)} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <p className="text-white font-bold text-lg">Quét QR thanh toán</p>
                <p className="text-[#A0A0B0] text-sm mt-1">
                  Nạp <span className="text-[#FF6B00] font-bold">{selected.credits} credits</span> —{" "}
                  <span className="text-white font-semibold">{selected.price.toLocaleString("vi-VN")} ₫</span>
                </p>
              </div>

              {/* QR Code via VietQR */}
              <div className="bg-white rounded-2xl p-3 mx-auto w-fit mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vietqrUrl(selected.price, user?.email ?? "")}
                  alt="QR thanh toán MB Bank"
                  width={220}
                  height={220}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 text-sm mb-5">
                {[
                  { label: "Ngân hàng", value: "MB Bank" },
                  { label: "Số TK", value: MB_ACCOUNT },
                  { label: "Chủ TK", value: MB_NAME },
                  { label: "Số tiền", value: `${selected.price.toLocaleString("vi-VN")} ₫` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-[#A0A0B0]">{r.label}:</span>
                    <span className="text-white font-medium">{r.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1 border-t border-[#2A2A3A]">
                  <span className="text-[#A0A0B0]">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-[#FF6B00] text-xs font-mono">MN {user?.email}</code>
                    <button onClick={() => handleCopy(`MN ${user?.email ?? ""}`, "qr-desc")} className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors">
                      {copied === "qr-desc" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-3 text-xs text-[#A0A0B0] text-center">
                Sau khi chuyển khoản, bấm <strong className="text-white">&quot;Đồng bộ credits&quot;</strong> để cập nhật ngay
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
