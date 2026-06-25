"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, Search, Star, ExternalLink, ShoppingCart, X, Check,
  Copy, Link2, TrendingUp, Plus, Lock, LogIn, Zap, Package,
  ChevronDown, AlertCircle, Tag, BarChart2,
} from "lucide-react";
import Image from "next/image";

import { saasTools, SaaSTool, SAAS_CATEGORIES } from "@/data/saas-tools";
import {
  SaaSPurchase, AffiliateEntry, ListedTool,
  getPurchases, hasPurchased, addPurchase,
  getAffiliates, isAffiliate, joinAffiliate,
  getListedTools, listTool,
  saasVietQRUrl, affiliateLinkFor,
} from "@/lib/saas-registry";

// ─── constants ────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "monetai.vn@gmail.com";
const CYAN = "#06B6D4";
const CYAN_DARK = "#0891B2";

type Tab = "browse" | "affiliate" | "my" | "sell";

// ─── helpers ──────────────────────────────────────────────────────────────────
function useUser() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("monetai_user") ?? "null");
      if (u?.email) setUser(u);
    } catch {}
  }, []);
  return user;
}

function fmtVnd(n: number) { return n.toLocaleString("vi-VN") + "₫"; }
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  function doCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  return { copied, doCopy };
}

// ─── BadgeChip ────────────────────────────────────────────────────────────────
function BadgeChip({ badge }: { badge?: string }) {
  if (!badge) return null;
  const cls: Record<string, string> = {
    "BÁN CHẠY": "bg-red-500",
    HOT:         "bg-orange-500",
    MỚI:         "bg-blue-500",
    "ĐỘC QUYỀN": "bg-violet-600",
  };
  return (
    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${cls[badge] ?? "bg-cyan-500"}`}>
      {badge}
    </span>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} fill={i < Math.round(rating) ? "currentColor" : "none"} />
      ))}
      <span className="text-[#A0A0B0] ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── ToolCard ─────────────────────────────────────────────────────────────────
function ToolCard({ t, owned, onBuy, onAffiliate, isAff }: {
  t: SaaSTool;
  owned: boolean;
  isAff: boolean;
  onBuy: (t: SaaSTool) => void;
  onAffiliate: (t: SaaSTool) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 flex flex-col gap-3 hover:border-cyan-500/40 transition-all duration-300"
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(6,182,212,0.1)" }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0D0D14] border border-[#2A2A3A] flex items-center justify-center text-2xl flex-shrink-0">
            {t.logo}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm leading-tight">{t.name}</h3>
            <p className="text-[#A0A0B0] text-xs">{t.brand} · {t.userCount} người dùng</p>
          </div>
        </div>
        <BadgeChip badge={t.badge} />
      </div>

      {/* Description */}
      <p className="text-[#A0A0B0] text-xs leading-relaxed line-clamp-2">{t.description}</p>

      {/* Features toggle */}
      <button onClick={() => setExpanded(!expanded)}
        className="text-[11px] text-[#A0A0B0] hover:text-cyan-400 transition-colors flex items-center gap-1 self-start">
        <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        {expanded ? "Ẩn tính năng" : `Xem ${t.features.length} tính năng`}
      </button>
      {expanded && (
        <ul className="space-y-1">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5 text-xs text-[#A0A0B0]">
              <Check size={11} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Saving badge */}
      {t.savingPct > 0 && (
        <div className="inline-flex items-center gap-1 bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-[11px] px-2 py-0.5 rounded-full self-start">
          <Tag size={10} /> Rẻ hơn {t.savingPct}% so với giá gốc
        </div>
      )}

      {/* Rating + category */}
      <div className="flex items-center justify-between">
        <Stars rating={t.rating} />
        <span className="text-[10px] bg-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{t.category}</span>
      </div>

      {/* Price */}
      <div className="flex items-end justify-between pt-2 border-t border-[#2A2A3A]">
        <div>
          <p className="text-white font-bold text-base">{fmtVnd(t.priceVND)}<span className="text-xs font-normal text-[#A0A0B0]">/{t.priceType}</span></p>
          {t.savingPct > 0 && (
            <p className="text-[10px] text-[#A0A0B0]">Giá gốc ${t.originalPriceUSD}/tháng</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onBuy(t)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1 ${owned ? "bg-emerald-700" : ""}`}
            style={owned ? {} : { background: CYAN }}>
            {owned ? <><Check size={11} /> Đã mua</> : <><ShoppingCart size={11} /> Mua ngay</>}
          </motion.button>
          <button onClick={() => onAffiliate(t)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 border transition-all ${
              isAff ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" : "border-[#2A2A3A] text-[#A0A0B0] hover:border-cyan-500/30 hover:text-cyan-400"}`}>
            <Link2 size={11} />
            {isAff ? "Đang Affiliate" : `Affiliate +${t.affiliateCommission}%`}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── BuyModal ─────────────────────────────────────────────────────────────────
function BuyModal({ t, userEmail, onClose, onSuccess }: {
  t: SaaSTool; userEmail: string;
  onClose: () => void; onSuccess: (p: SaaSPurchase) => void;
}) {
  const [step, setStep] = useState<"qr" | "confirm" | "done">("qr");
  const [code, setCode] = useState("");
  const [err,  setErr]  = useState("");
  const qrUrl = saasVietQRUrl(t.id, t.priceVND);
  const note  = `MONETAI ${t.id.slice(-8).toUpperCase()}`;

  function confirm() {
    if (!code.trim()) { setErr("Nhập mã giao dịch để xác nhận."); return; }
    const exp = new Date();
    exp.setMonth(exp.getMonth() + 1);
    const p: SaaSPurchase = {
      toolId: t.id, toolName: t.name,
      purchasedAt: new Date().toISOString(),
      expiresAt: exp.toISOString(),
      accessNote: `Truy cập ${t.name} tại ${t.officialUrl} — MonetAI sẽ gửi thông tin tài khoản/key qua email trong vòng 24h.`,
      txCode: code,
    };
    addPurchase(userEmail, p);
    setStep("done");
    onSuccess(p);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white"><X size={18} /></button>

        {step === "qr" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{t.logo}</span>
              <div>
                <h2 className="font-bold text-white">{t.name}</h2>
                <p className="text-[#A0A0B0] text-sm">{t.brand}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: CYAN }}>{fmtVnd(t.priceVND)}</p>
              <p className="text-[#A0A0B0] text-xs mt-1">/{t.priceType} · Tiết kiệm {t.savingPct > 0 ? `${t.savingPct}% so với giá gốc` : "so với mua trực tiếp"}</p>
            </div>
            <div className="bg-[#0D0D14] rounded-xl p-4 flex flex-col items-center gap-3 border border-[#2A2A3A]">
              <Image src={qrUrl} alt="VietQR" width={200} height={200} className="rounded-lg" unoptimized />
              <div className="text-xs text-center text-[#A0A0B0] space-y-1">
                <p>MB Bank · 0971166299 · MONET AI</p>
                <p className="font-mono bg-[#2A2A3A] px-3 py-1 rounded text-white">{note}</p>
              </div>
            </div>
            <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-3 text-xs text-blue-300 flex gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>Sau khi thanh toán, thông tin truy cập sẽ được gửi qua email trong vòng 24 giờ.</span>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep("confirm")}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: CYAN }}>
              Tôi đã chuyển khoản →
            </motion.button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Xác nhận thanh toán</h2>
            <p className="text-[#A0A0B0] text-sm">Nhập mã giao dịch (Transaction ID) hoặc 6 số cuối STK.</p>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: MB2506123456"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <motion.button whileTap={{ scale: 0.95 }} onClick={confirm}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: CYAN }}>
              Kích hoạt đơn hàng
            </motion.button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Đặt hàng thành công!</h2>
            <p className="text-[#A0A0B0] text-sm">
              Bạn đã mua <strong className="text-white">{t.name}</strong>.<br />
              Thông tin truy cập sẽ gửi về email trong <strong className="text-white">24 giờ</strong>.
            </p>
            <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A] text-xs text-[#A0A0B0] text-left space-y-1">
              <p className="font-semibold text-white">Hướng dẫn tiếp theo:</p>
              <p>1. Kiểm tra email bạn đăng ký MonetAI</p>
              <p>2. Nhận thông tin tài khoản / license key</p>
              <p>3. Truy cập <span style={{ color: CYAN }}>{t.officialUrl}</span></p>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: CYAN }}>
              Hoàn tất
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── AffiliateModal ───────────────────────────────────────────────────────────
function AffiliateModal({ t, userEmail, alreadyJoined, onClose, onJoined }: {
  t: SaaSTool; userEmail: string; alreadyJoined: boolean;
  onClose: () => void; onJoined: () => void;
}) {
  const affLink = affiliateLinkFor(userEmail, t.id);
  const { copied, doCopy } = useCopy();
  const [joined, setJoined] = useState(alreadyJoined);

  function handleJoin() {
    joinAffiliate(userEmail, t.id, t.name);
    setJoined(true);
    onJoined();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-md p-6 relative space-y-5">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white"><X size={18} /></button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{t.logo}</span>
          <div>
            <h2 className="font-bold text-white">{t.name}</h2>
            <p className="text-[#A0A0B0] text-sm">Affiliate Program</p>
          </div>
        </div>

        {/* Commission */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Hoa hồng", value: `${t.affiliateCommission}%` },
            { label: "Giá SP", value: fmtVnd(t.priceVND) },
            { label: "Mỗi đơn", value: fmtVnd(Math.round(t.priceVND * t.affiliateCommission / 100)) },
          ].map((s) => (
            <div key={s.label} className="bg-[#0D0D14] rounded-xl p-3 border border-[#2A2A3A] text-center">
              <p className="font-bold text-white" style={{ color: s.label === "Hoa hồng" ? CYAN : undefined }}>{s.value}</p>
              <p className="text-[10px] text-[#A0A0B0] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Affiliate link */}
        {joined ? (
          <div className="space-y-2">
            <p className="text-sm text-white font-medium">Link Affiliate của bạn:</p>
            <div className="flex gap-2">
              <input readOnly value={affLink}
                className="flex-1 bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => doCopy(affLink, t.id)}
                className="px-3 py-2.5 rounded-xl font-semibold text-white text-xs flex items-center gap-1"
                style={{ background: copied === t.id ? "#10B981" : CYAN }}>
                {copied === t.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </motion.button>
            </div>

            {/* Promo materials */}
            <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A] space-y-2">
              <p className="text-xs font-semibold text-white">Nội dung quảng bá gợi ý:</p>
              <p className="text-xs text-[#A0A0B0] leading-relaxed">
                🔥 Đang dùng {t.name} và cực kỳ hài lòng! Tool này giúp tôi {t.tagline.toLowerCase()}.<br />
                Mua qua link MonetAI này để được giá tốt hơn chính hãng: {affLink}
              </p>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-3 text-xs text-emerald-400">
              ✅ Bạn đang tham gia chương trình affiliate. Mỗi đơn hàng thành công bạn nhận {t.affiliateCommission}% hoa hồng.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[#A0A0B0] text-sm">
              Tham gia chương trình affiliate miễn phí, nhận link cá nhân và kiếm {t.affiliateCommission}% hoa hồng mỗi đơn thành công.
            </p>
            <ul className="space-y-1.5 text-xs text-[#A0A0B0]">
              {["Đăng ký miễn phí, không cần mua sản phẩm","Nhận link theo dõi cá nhân hóa","Hoa hồng tự động ghi nhận","Thanh toán định kỳ theo chu kỳ"].map((s) => (
                <li key={s} className="flex items-center gap-1.5"><Check size={11} className="text-cyan-400" />{s}</li>
              ))}
            </ul>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleJoin}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: CYAN }}>
              <Link2 size={16} /> Tham gia ngay — Miễn phí
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── AffiliateTab ─────────────────────────────────────────────────────────────
function AffiliateTab({ email }: { email: string }) {
  const [list, setList] = useState<AffiliateEntry[]>([]);
  const { copied, doCopy } = useCopy();
  const [affTarget, setAffTarget] = useState<SaaSTool | null>(null);

  function reload() { setList(getAffiliates(email)); }
  useEffect(() => { reload(); }, [email]);

  const totalEarned = list.reduce((s, a) => s + a.earned, 0);
  const totalClicks = list.reduce((s, a) => s + a.clicks, 0);
  const totalSales  = list.reduce((s, a) => s + a.sales, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Đang promote", value: list.length },
          { label: "Tổng clicks",  value: totalClicks },
          { label: "Đã kiếm",      value: fmtVnd(totalEarned) },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center">
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-[#A0A0B0] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      {list.length === 0 && (
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">💰 Kiếm tiền với Affiliate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Chọn sản phẩm", desc: "Chọn bất kỳ SaaS tool nào trong Marketplace" },
              { step: "2", title: "Lấy link affiliate", desc: "Nhận link cá nhân hóa riêng của bạn" },
              { step: "3", title: "Share & kiếm tiền", desc: "Mỗi đơn hàng qua link bạn nhận 15-30%" },
            ].map((s) => (
              <div key={s.step} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center mx-auto text-white"
                  style={{ background: CYAN }}>
                  {s.step}
                </div>
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-[#A0A0B0] text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#A0A0B0] text-sm">
            Vào tab <strong className="text-white">Khám phá</strong> → click <strong className="text-white">Affiliate</strong> trên bất kỳ tool nào để bắt đầu.
          </p>
        </div>
      )}

      {/* Affiliate list */}
      {list.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-bold">Đang promote ({list.length} tools)</h3>
          {list.map((a) => {
            const tool = saasTools.find((t) => t.id === a.toolId);
            const link = affiliateLinkFor(email, a.toolId);
            return (
              <div key={a.toolId} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tool?.logo ?? "📦"}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{a.toolName}</p>
                      <div className="flex items-center gap-3 text-[11px] text-[#A0A0B0] mt-0.5">
                        <span>{a.clicks} clicks</span>
                        <span>{a.sales} đơn</span>
                        <span className="text-emerald-400 font-semibold">{fmtVnd(a.earned)} đã kiếm</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: CYAN + "20", color: CYAN }}>
                    +{tool?.affiliateCommission ?? 0}% mỗi đơn
                  </span>
                </div>
                <div className="flex gap-2">
                  <input readOnly value={link}
                    className="flex-1 bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-3 py-2 text-white text-xs focus:outline-none" />
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => doCopy(link, a.toolId)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1"
                    style={{ background: copied === a.toolId ? "#10B981" : CYAN }}>
                    {copied === a.toolId ? <Check size={12} /> : <Copy size={12} />}
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick add more tools */}
      <div>
        <h3 className="text-white font-bold mb-3">Tool có hoa hồng cao nhất</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...saasTools].sort((a, b) => b.affiliateCommission - a.affiliateCommission).slice(0, 4).map((t) => (
            <div key={t.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{t.logo}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold line-clamp-1">{t.name}</p>
                <p className="text-[#A0A0B0] text-xs">{fmtVnd(t.priceVND)}/{t.priceType}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm" style={{ color: CYAN }}>{t.affiliateCommission}%</p>
                <p className="text-[10px] text-[#A0A0B0]">hoa hồng</p>
              </div>
              {isAffiliate(email, t.id) ? (
                <span className="text-[11px] text-emerald-400 border border-emerald-700/40 px-2 py-1 rounded-lg">Đã join</span>
              ) : (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAffTarget(t)}
                  className="text-xs px-2 py-1 rounded-lg font-semibold text-white" style={{ background: CYAN }}>
                  Join
                </motion.button>
              )}
            </div>
          ))}
        </div>
      </div>

      {affTarget && (
        <AffiliateModal t={affTarget} userEmail={email}
          alreadyJoined={isAffiliate(email, affTarget.id)}
          onClose={() => setAffTarget(null)}
          onJoined={() => { reload(); setAffTarget(null); }} />
      )}
    </div>
  );
}

// ─── MyToolsTab ───────────────────────────────────────────────────────────────
function MyToolsTab({ email }: { email: string }) {
  const [purchases, setPurchases] = useState<SaaSPurchase[]>([]);
  const [listed,    setListed]    = useState<ListedTool[]>([]);

  useEffect(() => {
    setPurchases(getPurchases(email));
    setListed(getListedTools(email));
  }, [email]);

  return (
    <div className="space-y-8">
      {/* Purchased */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Package size={18} style={{ color: CYAN }} /> Tools đã mua ({purchases.length})
        </h3>
        {purchases.length === 0 ? (
          <p className="text-[#A0A0B0] text-sm">Chưa có tool nào. Khám phá Marketplace để mua!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {purchases.map((p) => {
              const tool = saasTools.find((t) => t.id === p.toolId);
              const expDate = new Date(p.expiresAt).toLocaleDateString("vi-VN");
              return (
                <div key={p.toolId} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tool?.logo ?? "📦"}</span>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm">{p.toolName}</p>
                      <p className="text-[10px] text-[#A0A0B0]">Hết hạn: {expDate}</p>
                    </div>
                    <span className="ml-auto text-[11px] bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-xs text-[#A0A0B0] leading-relaxed">{p.accessNote}</p>
                  <a href={tool?.officialUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs py-2 rounded-xl font-semibold text-white"
                    style={{ background: CYAN }}>
                    <ExternalLink size={12} /> Truy cập {p.toolName}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Listed tools */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Store size={18} style={{ color: CYAN }} /> Tool bạn đã đăng ({listed.length})
        </h3>
        {listed.length === 0 ? (
          <p className="text-[#A0A0B0] text-sm">Chưa có tool nào. Đăng sản phẩm để kiếm hoa hồng từ MonetAI!</p>
        ) : (
          <div className="space-y-3">
            {listed.map((l) => (
              <div key={l.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{l.name}</p>
                  <p className="text-xs text-[#A0A0B0]">{l.brand} · {l.category} · {fmtVnd(l.priceVND)}/tháng</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  l.status === "active" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"}`}>
                  {l.status === "active" ? "Đang bán" : "Chờ duyệt"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SellTab ──────────────────────────────────────────────────────────────────
interface SellForm {
  name: string; brand: string; description: string;
  category: string; priceVND: string; commission: string;
  officialUrl: string; features: string;
}
const BLANK_SELL: SellForm = {
  name: "", brand: "", description: "", category: "AI Chat",
  priceVND: "", commission: "20", officialUrl: "", features: "",
};

function SellTab({ userEmail }: { userEmail: string }) {
  const [form, setForm] = useState<SellForm>(BLANK_SELL);
  const [done, setDone] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  function f(k: keyof SellForm, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  function submit() {
    listTool(userEmail, {
      name:        form.name,
      brand:       form.brand,
      description: form.description,
      category:    form.category,
      priceVND:    parseInt(form.priceVND) || 0,
      commission:  parseInt(form.commission) || 20,
      officialUrl: form.officialUrl,
    });
    setSubmittedName(form.name);
    setDone(true);
  }

  const isValid = form.name.trim() && form.brand.trim() && form.description.trim() && form.priceVND && form.officialUrl;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center max-w-md mx-auto">
        <div className="text-6xl">📤</div>
        <h2 className="text-2xl font-bold text-white">Đã gửi yêu cầu!</h2>
        <p className="text-[#A0A0B0]">
          Tool <strong className="text-white">{submittedName}</strong> đã được gửi để MonetAI xem xét.
          Chúng tôi sẽ phản hồi trong 1-3 ngày làm việc.
        </p>
        <button onClick={() => { setDone(false); setForm(BLANK_SELL); }}
          className="py-3 px-8 rounded-xl font-semibold text-white" style={{ background: CYAN }}>
          Đăng tool khác
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Đăng sản phẩm SaaS</h2>
        <p className="text-[#A0A0B0] text-sm mt-1">
          Bán SaaS / AI Tool của bạn qua MonetAI và tiếp cận hàng chục nghìn khách hàng. MonetAI thu 20% trên mỗi đơn.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white font-medium block mb-1">Tên sản phẩm <span className="text-red-400">*</span></label>
          <input value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="VD: MyAI Pro"
            className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" />
        </div>
        <div>
          <label className="text-sm text-white font-medium block mb-1">Thương hiệu <span className="text-red-400">*</span></label>
          <input value={form.brand} onChange={(e) => f("brand", e.target.value)} placeholder="VD: MyCompany"
            className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" />
        </div>
      </div>

      <div>
        <label className="text-sm text-white font-medium block mb-1">Mô tả <span className="text-red-400">*</span></label>
        <textarea value={form.description} rows={3} onChange={(e) => f("description", e.target.value)}
          placeholder="Sản phẩm làm gì, dành cho ai, điểm khác biệt..."
          className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white font-medium block mb-1">Danh mục</label>
          <select value={form.category} onChange={(e) => f("category", e.target.value)}
            className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500">
            {SAAS_CATEGORIES.filter((c) => c !== "Tất cả").map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white font-medium block mb-1">Giá/tháng (VNĐ) <span className="text-red-400">*</span></label>
          <input type="number" value={form.priceVND} onChange={(e) => f("priceVND", e.target.value)} placeholder="VD: 199000"
            className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white font-medium block mb-1">URL chính thức <span className="text-red-400">*</span></label>
          <input value={form.officialUrl} onChange={(e) => f("officialUrl", e.target.value)} placeholder="https://your-saas.com"
            className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" />
        </div>
        <div>
          <label className="text-sm text-white font-medium block mb-1">Hoa hồng affiliate (%)</label>
          <input type="number" value={form.commission} onChange={(e) => f("commission", e.target.value)} placeholder="VD: 20"
            className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" />
        </div>
      </div>

      <div>
        <label className="text-sm text-white font-medium block mb-1">Tính năng nổi bật (mỗi dòng 1 tính năng)</label>
        <textarea value={form.features} rows={4} onChange={(e) => f("features", e.target.value)}
          placeholder={"Tính năng 1\nTính năng 2\nTính năng 3"}
          className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none" />
      </div>

      {/* Preview pricing */}
      {form.priceVND && parseInt(form.priceVND) > 0 && (
        <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A] text-xs text-[#A0A0B0] space-y-1">
          <p className="text-white font-semibold">Phân chia doanh thu:</p>
          <p>Giá bán: <span className="text-white">{fmtVnd(parseInt(form.priceVND))}/tháng</span></p>
          <p>Phí MonetAI (20%): <span className="text-white">{fmtVnd(Math.round(parseInt(form.priceVND) * 0.2))}</span></p>
          <p>Hoa hồng affiliate ({form.commission}%): <span className="text-white">{fmtVnd(Math.round(parseInt(form.priceVND) * parseInt(form.commission || "0") / 100))}</span></p>
          <p>Bạn nhận: <span className="text-emerald-400 font-bold">{fmtVnd(Math.round(parseInt(form.priceVND) * (1 - 0.2 - parseInt(form.commission || "0") / 100)))}</span></p>
        </div>
      )}

      <motion.button whileTap={{ scale: 0.95 }} onClick={submit} disabled={!isValid}
        className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40"
        style={{ background: CYAN }}>
        Gửi yêu cầu đăng sản phẩm →
      </motion.button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SaaSMarketplacePage() {
  const user    = useUser();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [tab,        setTab]        = useState<Tab>("browse");
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("Tất cả");
  const [sortBy,     setSortBy]     = useState<"popular" | "price_asc" | "price_desc" | "rating">("popular");
  const [buyTarget,  setBuyTarget]  = useState<SaaSTool | null>(null);
  const [affTarget,  setAffTarget]  = useState<SaaSTool | null>(null);
  const [purchases,  setPurchases]  = useState<string[]>([]);
  const [affiliates, setAffiliates] = useState<string[]>([]);

  const reload = useCallback(() => {
    if (!user?.email) return;
    setPurchases(getPurchases(user.email).map((p) => p.toolId));
    setAffiliates(getAffiliates(user.email).map((a) => a.toolId));
  }, [user?.email]);

  useEffect(() => { reload(); }, [reload]);

  const visible = saasTools
    .filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
          !t.brand.toLowerCase().includes(search.toLowerCase()) &&
          !t.description.toLowerCase().includes(search.toLowerCase()) &&
          !t.tags.some((tg) => tg.toLowerCase().includes(search.toLowerCase()))) return false;
      if (catFilter !== "Tất cả" && t.category !== catFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular")    return b.soldCount - a.soldCount;
      if (sortBy === "price_asc")  return a.priceVND - b.priceVND;
      if (sortBy === "price_desc") return b.priceVND - a.priceVND;
      return b.rating - a.rating;
    });

  const TABS: { key: Tab; label: string }[] = [
    { key: "browse",    label: "🛒 Marketplace" },
    { key: "affiliate", label: "💸 Affiliate"    },
    { key: "my",        label: "📦 Của tôi"      },
    { key: "sell",      label: "📤 Đăng SP"      },
  ];

  function AuthWall({ label }: { label: string }) {
    return (
      <div className="text-center py-24 space-y-4">
        <Lock size={48} className="mx-auto" style={{ color: CYAN }} />
        <h2 className="text-xl font-bold text-white">{label}</h2>
        <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: CYAN }}>
          <LogIn size={16} /> Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Sticky header */}
      <div className="bg-[#111118] border-b border-[#2A2A3A] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: CYAN }}>
                <Store size={14} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">AI SaaS Marketplace</h1>
            </div>
            <p className="text-xs text-[#A0A0B0] mt-0.5">{saasTools.length}+ AI tools hàng đầu · Giá tốt nhất VN · Affiliate 15-30%</p>
          </div>

          <div className="flex items-center gap-1 bg-[#16161F] rounded-xl p-1 border border-[#2A2A3A]">
            {TABS.map((t) => (
              <button key={t.key}
                onClick={() => { if (!user && t.key !== "browse") return; setTab(t.key); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "text-white" : "text-[#A0A0B0] hover:text-white"}`}
                style={tab === t.key ? { background: CYAN } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── BROWSE ── */}
        {tab === "browse" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm AI tool theo tên, brand, tính năng..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#16161F] border border-[#2A2A3A] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500" />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-[#16161F] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500">
                <option value="popular">Bán chạy nhất</option>
                <option value="rating">Đánh giá cao</option>
                <option value="price_asc">Giá: Thấp → Cao</option>
                <option value="price_desc">Giá: Cao → Thấp</option>
              </select>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {SAAS_CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${catFilter === c ? "border-cyan-500 text-cyan-400 bg-cyan-500/10" : "border-[#2A2A3A] text-[#A0A0B0] hover:border-cyan-500/30"}`}>
                  {c}
                </button>
              ))}
            </div>

            <p className="text-sm text-[#A0A0B0]">
              Hiển thị <span className="text-white font-semibold">{visible.length}</span> tools
              {catFilter !== "Tất cả" && ` trong "${catFilter}"`}
            </p>

            {visible.length === 0 ? (
              <div className="text-center py-20 text-[#A0A0B0]">
                <Search size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-white">Không tìm thấy tool nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visible.map((t) => (
                  <ToolCard key={t.id} t={t}
                    owned={isAdmin || purchases.includes(t.id)}
                    isAff={affiliates.includes(t.id)}
                    onBuy={(tool) => {
                      if (!user) { alert("Vui lòng đăng nhập."); return; }
                      setBuyTarget(tool);
                    }}
                    onAffiliate={(tool) => {
                      if (!user) { alert("Vui lòng đăng nhập."); return; }
                      setAffTarget(tool);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AFFILIATE ── */}
        {tab === "affiliate" && (
          user ? <AffiliateTab email={user.email} /> : <AuthWall label="Đăng nhập để tham gia Affiliate" />
        )}

        {/* ── MY TOOLS ── */}
        {tab === "my" && (
          user ? <MyToolsTab email={user.email} /> : <AuthWall label="Đăng nhập để xem tools của bạn" />
        )}

        {/* ── SELL ── */}
        {tab === "sell" && (
          user ? <SellTab userEmail={user.email} /> : <AuthWall label="Đăng nhập để đăng sản phẩm" />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {buyTarget && user && (
          <BuyModal key="buy" t={buyTarget} userEmail={user.email} onClose={() => setBuyTarget(null)}
            onSuccess={() => { reload(); setBuyTarget(null); }} />
        )}
        {affTarget && user && (
          <AffiliateModal key="aff" t={affTarget} userEmail={user.email}
            alreadyJoined={affiliates.includes(affTarget.id)}
            onClose={() => setAffTarget(null)}
            onJoined={() => { reload(); setAffTarget(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
