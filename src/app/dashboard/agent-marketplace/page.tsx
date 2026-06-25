"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bot, Star, Search, X, Copy, CheckCircle2, QrCode,
  Send, Sparkles, ChevronRight, Zap, Users, Package,
  MessageSquare, Plus, ArrowRight,
} from "lucide-react";
import { useAuth, UNLIMITED_CREDITS, ADMIN_EMAIL } from "@/contexts/AuthContext";
import { agents, AGENT_CATEGORIES, type AgentData } from "@/data/agents";
import type { ChatMessage } from "@/app/api/agent/chat/route";

const MB_ACCOUNT  = "0971166299";
const MB_NAME     = "LE VAN BIEN";
const DEMO_LIMIT  = 4; // free demo messages per agent

const BADGE_STYLES: Record<string, string> = {
  HOT:       "bg-red-500 text-white",
  MỚI:       "bg-blue-500 text-white",
  "BÁN CHẠY": "bg-[#FF6B00] text-white",
};

function vietqrUrl(amount: number, email: string, agentName: string) {
  const info = encodeURIComponent(`AGENT ${agentName} ${email}`);
  return `https://img.vietqr.io/image/MB-${MB_ACCOUNT}-compact2.png?amount=${amount}&addInfo=${info}&accountName=${encodeURIComponent(MB_NAME)}`;
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-white font-bold text-lg leading-none">{value}</p>
        <p className="text-[#A0A0B0] text-xs">{label}</p>
      </div>
    </div>
  );
}

// ── Agent card ─────────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  onDemo,
  onBuy,
}: {
  agent: AgentData;
  onDemo: (a: AgentData) => void;
  onBuy: (a: AgentData) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-[#16161F] border border-[#2A2A3A] hover:border-[#FF6B00]/30 rounded-2xl p-5 flex flex-col transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-2xl shrink-0">
          {agent.icon}
        </div>
        <div className="flex items-center gap-2">
          {agent.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[agent.badge]}`}>
              {agent.badge}
            </span>
          )}
          <span className="text-[10px] font-medium bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">
            {agent.category}
          </span>
        </div>
      </div>

      {/* Name + tagline */}
      <h3 className="text-white font-semibold text-sm mb-0.5 leading-snug">{agent.name}</h3>
      <p className="text-[#FF6B00] text-xs font-medium mb-2">{agent.tagline}</p>
      <p className="text-[#A0A0B0] text-xs leading-relaxed mb-3 flex-1">{agent.description}</p>

      {/* Features */}
      <ul className="space-y-1.5 mb-4">
        {agent.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-[#A0A0B0]">
            <CheckCircle2 className="w-3 h-3 text-[#FF6B00] shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {/* Rating + seller */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-medium">{agent.rating}</span>
          <span className="text-[#A0A0B0] text-xs">({agent.reviews})</span>
        </div>
        <span className="text-[#A0A0B0] text-[11px] truncate max-w-[100px]">{agent.seller}</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-white font-bold text-lg">
          {agent.price.toLocaleString("vi-VN")}₫
        </span>
        <span className="text-[#A0A0B0] text-xs">/{agent.priceType}</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onDemo(agent)}
          className="flex items-center justify-center gap-1.5 border border-[#FF6B00]/40 text-[#FF6B00] hover:bg-[#FF6B00]/10 text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Dùng thử
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onBuy(agent)}
          className="flex items-center justify-center gap-1.5 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          Mua ngay
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Demo chat modal ─────────────────────────────────────────────────────────────
function DemoModal({
  agent,
  isAdmin,
  onClose,
}: {
  agent: AgentData;
  isAdmin: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: agent.demoGreeting },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [, setDemoUsed]   = useState(0);
  const [copied, setCopied]       = useState(false);
  const messagesEndRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const remaining    = isAdmin ? Infinity : DEMO_LIMIT - userMsgCount;
  const isExhausted  = !isAdmin && remaining <= 0;

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || isExhausted) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setDemoUsed((n) => n + 1);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: agent.systemPrompt,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "Xin lỗi, có lỗi xảy ra." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Không kết nối được AI lúc này. Vui lòng thử lại sau." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "Bạn" : agent.name}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="relative bg-[#16161F] border border-[#2A2A3A] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A3A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-xl">
              {agent.icon}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{agent.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs">Đang hoạt động</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyAll} title="Sao chép hội thoại"
              className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors p-1.5 rounded-lg hover:bg-[#FF6B00]/10">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="text-[#A0A0B0] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo counter */}
        <div className="px-4 py-2 bg-[#0A0A0F] border-b border-[#2A2A3A] shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[#A0A0B0] text-xs">{isAdmin ? "Chế độ Admin" : "Demo miễn phí"}</span>
            {isAdmin ? (
              <span className="text-[#FF6B00] text-xs font-bold">∞ Không giới hạn</span>
            ) : (
              <div className="flex items-center gap-1">
                {Array.from({ length: DEMO_LIMIT }).map((_, i) => (
                  <div key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${i < userMsgCount ? "bg-[#FF6B00]" : "bg-[#2A2A3A]"}`} />
                ))}
                <span className="text-[#A0A0B0] text-xs ml-1">{Math.max(0, remaining as number)} còn lại</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5">
                  {agent.icon}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#FF6B00] text-white rounded-br-sm"
                    : "bg-[#1A1A28] text-[#E0E0F0] rounded-bl-sm border border-[#2A2A3A]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-sm">
                {agent.icon}
              </div>
              <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A0A0B0] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Demo exhausted */}
          {isExhausted && !loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-2xl p-4 text-center"
            >
              <Sparkles className="w-6 h-6 text-[#FF6B00] mx-auto mb-2" />
              <p className="text-white text-sm font-semibold mb-1">Hết lượt demo miễn phí</p>
              <p className="text-[#A0A0B0] text-xs mb-3">
                Mua {agent.name} để dùng không giới hạn với toàn bộ tính năng
              </p>
              <div className="text-[#FF6B00] font-bold text-base">
                {agent.price.toLocaleString("vi-VN")}₫/{agent.priceType}
              </div>
            </motion.div>
          )}

          {/* Suggestion chips (only when single greeting shown) */}
          {messages.length === 1 && !loading && (
            <div className="space-y-2">
              <p className="text-[#5A5A7A] text-xs text-center">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {agent.demoSuggestions.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-xs bg-[#1A1A28] border border-[#2A2A3A] hover:border-[#FF6B00]/40 text-[#A0A0B0] hover:text-[#FF6B00] px-3 py-1.5 rounded-full transition-all text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#2A2A3A] shrink-0">
          {isExhausted ? (
            <button onClick={onClose}
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Mua {agent.name} ngay
            </button>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading || isExhausted}
                placeholder={loading ? "Đang xử lý..." : "Nhập tin nhắn..."}
                className="flex-1 bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-colors disabled:opacity-50"
              />
              <button type="submit" disabled={loading || !input.trim() || isExhausted}
                className="w-10 h-10 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          )}
          <p className="text-[#5A5A7A] text-[10px] text-center mt-2">
            Powered by MonetAI · GPT-4o / Gemini / Claude
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Buy modal ─────────────────────────────────────────────────────────────────
function BuyModal({
  agent,
  userEmail,
  onClose,
}: {
  agent: AgentData;
  userEmail: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const desc = `AGENT ${agent.name} ${userEmail}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6B00]/15 flex items-center justify-center mx-auto mb-3 text-3xl">
            {agent.icon}
          </div>
          <p className="text-white font-bold text-lg">{agent.name}</p>
          <p className="text-[#FF6B00] font-bold text-2xl mt-1">
            {agent.price.toLocaleString("vi-VN")} ₫
            <span className="text-[#A0A0B0] text-sm font-normal">/{agent.priceType}</span>
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {(["Quét QR", "Chuyển khoản", "Kích hoạt"] as const).map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] text-[10px] font-bold shrink-0">
                {i + 1}
              </div>
              <span className="text-[#A0A0B0] text-[10px] whitespace-nowrap">{step}</span>
              {i < 2 && <div className="w-3 h-px bg-[#2A2A3A] mx-0.5" />}
            </div>
          ))}
        </div>

        {/* QR */}
        <div className="bg-white rounded-2xl p-3 mx-auto w-fit mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vietqrUrl(agent.price, userEmail, agent.name)}
            alt="QR thanh toán"
            width={200}
            height={200}
            className="rounded-xl"
          />
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm mb-4">
          {[
            { label: "Ngân hàng", value: "MB Bank" },
            { label: "Số TK",     value: MB_ACCOUNT },
            { label: "Chủ TK",    value: MB_NAME },
            { label: "Số tiền",   value: `${agent.price.toLocaleString("vi-VN")} ₫` },
          ].map((r) => (
            <div key={r.label} className="flex justify-between">
              <span className="text-[#A0A0B0]">{r.label}:</span>
              <span className="text-white font-medium">{r.value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-1 border-t border-[#2A2A3A]">
            <span className="text-[#A0A0B0] shrink-0">Nội dung CK:</span>
            <div className="flex items-center gap-2 ml-2 min-w-0">
              <code className="text-[#FF6B00] text-xs font-mono truncate">{desc}</code>
              <button onClick={() => handleCopy(desc, "desc")} className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors shrink-0">
                {copied === "desc" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-3 text-xs text-center text-[#A0A0B0]">
          Sau khi thanh toán, liên hệ{" "}
          <strong className="text-white">0562 557 777</strong> hoặc{" "}
          <strong className="text-white">monetai.vn@gmail.com</strong> để kích hoạt trong 30 phút
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AgentMarketplacePage() {
  const { user }                        = useAuth();
  const [search, setSearch]             = useState("");
  const [activeCategory, setCategory]   = useState("Tất cả");
  const [demoAgent, setDemoAgent]       = useState<AgentData | null>(null);
  const [buyAgent, setBuyAgent]         = useState<AgentData | null>(null);

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const isUnlimited = isAdmin || user?.credits === UNLIMITED_CREDITS;

  const filtered = agents.filter((a) => {
    const matchCat    = activeCategory === "Tất cả" || a.category === activeCategory;
    const q           = search.toLowerCase();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.tagline.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = agents.filter((a) => a.badge);
  const totalReviews = agents.reduce((s, a) => s + a.reviews, 0);

  return (
    <div>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-[#111118] to-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 mb-6 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #FF6B00 0%, transparent 60%)" }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-[#FF6B00]" />
              <span className="text-[#FF6B00] text-xs font-semibold uppercase tracking-widest">AI Agent Marketplace</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Thuê AI làm việc thay bạn
            </h1>
            <p className="text-[#A0A0B0] text-sm max-w-md">
              16 AI Agent chuyên biệt — bán hàng, nội dung, CSKH, marketing, SEO. Dùng thử miễn phí ngay.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 items-center">
            <StatCard icon={<Bot className="w-5 h-5 text-[#FF6B00]" />} value={`${agents.length}`} label="AI Agents" />
            <StatCard icon={<Package className="w-5 h-5 text-[#FF6B00]" />} value={`${AGENT_CATEGORIES.length - 1}`} label="Danh mục" />
            <StatCard icon={<Users className="w-5 h-5 text-[#FF6B00]" />} value={`${totalReviews.toLocaleString()}+`} label="Đánh giá" />
            <Link
              href="/dashboard/agent-marketplace/sell"
              className="flex items-center gap-2 border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Đăng bán Agent
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Featured agents (badges) ─────────────────────────────────────── */}
      {featured.length > 0 && activeCategory === "Tất cả" && !search && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-white font-semibold text-sm">Nổi bật & Bán chạy</h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {featured.map((agent) => (
              <div key={agent.id}
                className="flex-shrink-0 w-64 bg-gradient-to-br from-[#1A1A28] to-[#16161F] border border-[#FF6B00]/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{agent.icon}</span>
                  {agent.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[agent.badge]}`}>
                      {agent.badge}
                    </span>
                  )}
                </div>
                <p className="text-white font-semibold text-sm">{agent.name}</p>
                <p className="text-[#A0A0B0] text-xs mt-0.5 mb-3 line-clamp-2">{agent.tagline}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#FF6B00] font-bold text-sm">
                    {agent.price.toLocaleString("vi-VN")}₫
                    <span className="text-[#A0A0B0] text-[10px] font-normal">/{agent.priceType}</span>
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setDemoAgent(agent)}
                      className="text-[10px] border border-[#FF6B00]/30 text-[#FF6B00] px-2 py-1 rounded-lg hover:bg-[#FF6B00]/10 transition-colors font-medium"
                    >
                      Thử
                    </button>
                    <button onClick={() => setBuyAgent(agent)}
                      className="text-[10px] bg-[#FF6B00] text-white px-2 py-1 rounded-lg hover:bg-[#E55A00] transition-colors font-medium"
                    >
                      Mua
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Search + filters ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm AI Agent..."
            className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]/30 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {AGENT_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.label)}
              className={`text-sm px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === cat.label
                  ? "bg-[#FF6B00] text-white"
                  : "bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white hover:border-[#FF6B00]/30"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count + sell CTA ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#A0A0B0] text-sm">
          <span className="text-white font-semibold">{filtered.length}</span> agent
          {search && <span> · kết quả cho "<span className="text-[#FF6B00]">{search}</span>"</span>}
        </p>
        <Link
          href="/dashboard/agent-marketplace/sell"
          className="flex items-center gap-1.5 text-xs bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-3 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Bán Agent của bạn
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── Agent grid ───────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
            >
              <AgentCard
                agent={agent}
                onDemo={setDemoAgent}
                onBuy={setBuyAgent}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[#A0A0B0]">
          <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium text-white mb-1">Không tìm thấy agent nào</p>
          <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
          <button onClick={() => { setSearch(""); setCategory("Tất cả"); }}
            className="mt-4 text-sm text-[#FF6B00] hover:underline">
            Xem tất cả agent
          </button>
        </div>
      )}

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-10 bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold mb-5 text-center flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#FF6B00]" />
          Cách sử dụng AI Agent Marketplace
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              icon: "🔍",
              title: "Dùng thử miễn phí",
              desc: "Nhấn 'Dùng thử' để chat trực tiếp với agent. 4 tin nhắn demo hoàn toàn miễn phí.",
            },
            {
              step: "2",
              icon: "💳",
              title: "Thanh toán QR",
              desc: "Chọn agent phù hợp, quét mã QR MB Bank để thanh toán nhanh chóng.",
            },
            {
              step: "3",
              icon: "⚡",
              title: "Kích hoạt trong 30 phút",
              desc: "Liên hệ MonetAI sau khi thanh toán. Agent được kích hoạt và cài đặt trong vòng 30 phút.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-[#A0A0B0] text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-[#2A2A3A] flex flex-wrap items-center justify-between gap-3">
          <p className="text-[#A0A0B0] text-sm">
            Cần tư vấn thêm?{" "}
            <a href="tel:0562557777" className="text-[#FF6B00] hover:underline font-medium">0562 557 777</a>
            {" · "}
            <a href="mailto:monetai.vn@gmail.com" className="text-[#FF6B00] hover:underline font-medium">monetai.vn@gmail.com</a>
          </p>
          <div className="flex items-center gap-1 text-[#A0A0B0] text-xs">
            <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
            Cam kết kích hoạt trong 30 phút hoặc hoàn tiền 100%
          </div>
        </div>
      </motion.div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {demoAgent && (
          <DemoModal
            agent={demoAgent}
            isAdmin={isAdmin}
            onClose={() => setDemoAgent(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {buyAgent && (
          <BuyModal
            agent={buyAgent}
            userEmail={user?.email ?? ""}
            onClose={() => setBuyAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
