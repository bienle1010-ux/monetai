"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Check, Zap, QrCode, Copy, CheckCircle2,
  RefreshCw, X, Clock, ArrowDownCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAuth, UNLIMITED_CREDITS, ADMIN_EMAIL } from "@/contexts/AuthContext";
import { plans } from "@/data/pricing";

const MB_ACCOUNT  = "0971166299";
const MB_NAME     = "LE VAN BIEN";
const BANK_ID     = "MB";
const POLL_MS     = 8_000; // poll every 8s while QR is open

const CREDIT_PACKAGES = [
  { credits: 10,  price: 10_000  },
  { credits: 50,  price: 50_000  },
  { credits: 100, price: 100_000, badge: "PHỔ BIẾN" },
  { credits: 300, price: 300_000 },
  { credits: 500, price: 500_000, badge: "TIẾT KIỆM" },
];

interface Payment {
  id: number;
  amount: number;
  credits: number;
  description: string;
  paid_at: string;
  tid: string;
}

function vietqrUrl(amount: number, email: string) {
  const info = encodeURIComponent(`MN ${email}`);
  const name = encodeURIComponent(MB_NAME);
  return `https://img.vietqr.io/image/${BANK_ID}-${MB_ACCOUNT}-compact2.png?amount=${amount}&addInfo=${info}&accountName=${name}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function BillingPage() {
  const { user, updateUser } = useAuth();
  const [selected, setSelected]       = useState<typeof CREDIT_PACKAGES[0] | null>(null);
  const [qrOpen, setQrOpen]           = useState(false);
  const [paySuccess, setPaySuccess]   = useState(false);
  const [newCredits, setNewCredits]   = useState(0);
  const [copied, setCopied]           = useState<string | null>(null);
  const [syncing, setSyncing]         = useState(false);
  const [syncMsg, setSyncMsg]         = useState("");
  const [payments, setPayments]       = useState<Payment[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const pollRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseCreditsRef = useRef<number>(0);

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const isUnlimited = isAdmin || user?.credits === UNLIMITED_CREDITS;
  const credits     = user?.credits ?? 0;

  // ── Auto-sync on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (user?.email && !isUnlimited) {
      fetch(`/api/payment/status?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.credits > (user.credits ?? 0)) updateUser({ credits: data.credits });
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // ── Polling while QR modal is open ──────────────────────────────────────
  const stopPoll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const startPoll = useCallback(() => {
    if (!user?.email || isUnlimited) return;
    baseCreditsRef.current = user.credits ?? 0;
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/payment/status?email=${encodeURIComponent(user.email!)}`);
        const data = await res.json();
        if (data.credits > baseCreditsRef.current) {
          const gained = data.credits - baseCreditsRef.current;
          updateUser({ credits: data.credits });
          setNewCredits(gained);
          setPaySuccess(true);
          stopPoll();
        }
      } catch { /* ignore network error */ }
    }, POLL_MS);
  }, [user?.email, user?.credits, isUnlimited, updateUser, stopPoll]);

  useEffect(() => {
    if (qrOpen && !paySuccess) startPoll();
    else stopPoll();
    return stopPoll;
  }, [qrOpen, paySuccess, startPoll, stopPoll]);

  // ── Close QR modal ───────────────────────────────────────────────────────
  const closeQr = () => {
    setQrOpen(false);
    setPaySuccess(false);
    setNewCredits(0);
    stopPoll();
  };

  const handleSelectPackage = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelected(pkg);
    setPaySuccess(false);
    setQrOpen(true);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── Manual sync ──────────────────────────────────────────────────────────
  const handleSync = async () => {
    if (!user?.email || isUnlimited) return;
    setSyncing(true);
    setSyncMsg("");
    try {
      const res  = await fetch(`/api/payment/status?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.credits > credits) {
        updateUser({ credits: data.credits });
        setSyncMsg(`✅ Cập nhật thành công! Credits: ${data.credits}`);
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

  // ── Load payment history ─────────────────────────────────────────────────
  const loadHistory = async () => {
    if (!user?.email || historyLoading) return;
    setHistoryLoading(true);
    try {
      const res  = await fetch(`/api/payment/history?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setPayments(data.payments ?? []);
    } catch { /* ignore */ }
    setHistoryLoading(false);
  };

  const toggleHistory = () => {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next && payments.length === 0) loadHistory();
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
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
            className={`mt-3 text-sm px-4 py-2.5 rounded-xl border ${
              syncMsg.startsWith("✅")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
            }`}>
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
          {/* ── Pricing info ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-white text-sm font-semibold">1 credit = 1.000 ₫</span>
            <span className="text-[#A0A0B0] text-sm">— Chọn gói và quét mã QR để nạp</span>
          </div>

          {/* ── Credit packages ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {CREDIT_PACKAGES.map((pkg, i) => (
              <motion.button key={i} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
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

          {/* ── Bank info ────────────────────────────────────────────────── */}
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
                <p className="text-[#A0A0B0] text-xs mt-2">
                  Hệ thống tự động nhận dạng và cộng credits sau khi chuyển khoản thành công.
                </p>
              </div>
            </div>
          </div>

          {/* ── Payment history ──────────────────────────────────────────── */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden mb-8">
            <button
              onClick={toggleHistory}
              className="w-full flex items-center justify-between p-5 hover:bg-[#1A1A28] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-white font-semibold text-sm">Lịch sử nạp tiền</span>
                {payments.length > 0 && (
                  <span className="bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold px-2 py-0.5 rounded-full">
                    {payments.length}
                  </span>
                )}
              </div>
              {historyOpen
                ? <ChevronUp className="w-4 h-4 text-[#A0A0B0]" />
                : <ChevronDown className="w-4 h-4 text-[#A0A0B0]" />}
            </button>

            <AnimatePresence>
              {historyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#2A2A3A] px-5 pb-5">
                    {historyLoading ? (
                      <div className="py-8 text-center text-[#A0A0B0] text-sm flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Đang tải...
                      </div>
                    ) : payments.length === 0 ? (
                      <div className="py-8 text-center text-[#A0A0B0] text-sm">
                        <ArrowDownCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        Chưa có giao dịch nào
                      </div>
                    ) : (
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-[#A0A0B0] text-xs uppercase tracking-wide">
                              <th className="text-left pb-3 font-medium">Thời gian</th>
                              <th className="text-right pb-3 font-medium">Số tiền</th>
                              <th className="text-right pb-3 font-medium">Credits</th>
                              <th className="text-left pb-3 font-medium pl-4">Nội dung</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2A2A3A]">
                            {payments.map((p) => (
                              <tr key={p.id}>
                                <td className="py-3 text-[#A0A0B0] whitespace-nowrap text-xs">{fmtDate(p.paid_at)}</td>
                                <td className="py-3 text-right text-white font-medium whitespace-nowrap">
                                  {p.amount.toLocaleString("vi-VN")} ₫
                                </td>
                                <td className="py-3 text-right">
                                  <span className="bg-[#FF6B00]/15 text-[#FF6B00] text-xs font-bold px-2 py-0.5 rounded-full">
                                    +{p.credits}
                                  </span>
                                </td>
                                <td className="py-3 pl-4 text-[#A0A0B0] text-xs truncate max-w-[160px]">
                                  {p.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ── Monthly plans ────────────────────────────────────────────────── */}
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
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isCurrent
                    ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                    : plan.popular
                    ? "bg-[#FF6B00] hover:bg-[#E55A00] text-white"
                    : "border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                }`}
              >
                {isCurrent ? "Gói hiện tại" : "Liên hệ đăng ký"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── QR Payment Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {qrOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeQr} />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={closeQr} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white transition-colors z-10">
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {paySuccess ? (
                  /* ── Success screen ── */
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h3 className="text-white font-bold text-xl mb-1">Thanh toán thành công!</h3>
                    <p className="text-[#A0A0B0] text-sm mb-4">Đã cộng vào tài khoản của bạn</p>
                    <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl py-4 px-6 mb-4">
                      <p className="text-[#FF6B00] text-3xl font-bold">+{newCredits}</p>
                      <p className="text-[#A0A0B0] text-sm">credits</p>
                    </div>
                    <p className="text-white text-sm font-medium">
                      Số dư hiện tại:{" "}
                      <span className="text-[#FF6B00] font-bold">{user?.credits}</span> credits
                    </p>
                    <button onClick={closeQr}
                      className="mt-5 w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Tiếp tục sử dụng
                    </button>
                  </motion.div>
                ) : (
                  /* ── QR screen ── */
                  <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Step indicators */}
                    <div className="flex items-center justify-center gap-1.5 mb-5">
                      {(["Quét QR", "Chuyển khoản", "Nhận credits"] as const).map((step, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] text-[10px] font-bold shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-[#A0A0B0] text-[10px] whitespace-nowrap">{step}</span>
                          {i < 2 && <div className="w-3 h-px bg-[#2A2A3A] mx-0.5" />}
                        </div>
                      ))}
                    </div>

                    <div className="text-center mb-4">
                      <p className="text-white font-bold text-lg">
                        Nạp <span className="text-[#FF6B00]">{selected.credits} credits</span>
                      </p>
                      <p className="text-[#A0A0B0] text-sm">{selected.price.toLocaleString("vi-VN")} ₫</p>
                    </div>

                    {/* QR image */}
                    <div className="bg-white rounded-2xl p-3 mx-auto w-fit mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={vietqrUrl(selected.price, user?.email ?? "")}
                        alt="QR thanh toán MB Bank"
                        width={210}
                        height={210}
                        className="rounded-xl"
                      />
                    </div>

                    {/* Bank details */}
                    <div className="space-y-2 text-sm mb-4">
                      {[
                        { label: "Ngân hàng", value: "MB Bank" },
                        { label: "Số TK",     value: MB_ACCOUNT },
                        { label: "Chủ TK",    value: MB_NAME },
                        { label: "Số tiền",   value: `${selected.price.toLocaleString("vi-VN")} ₫` },
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
                          <button onClick={() => handleCopy(`MN ${user?.email ?? ""}`, "qr-desc")}
                            className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors">
                            {copied === "qr-desc"
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Live waiting indicator */}
                    <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-3 flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse" />
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-ping opacity-40" />
                      </div>
                      <p className="text-[#A0A0B0] text-xs leading-relaxed">
                        Đang chờ thanh toán… Credits sẽ được cộng tự động sau khi chuyển khoản thành công.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
