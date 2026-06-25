"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Star, CheckCircle2, Send, Lock, Sparkles, ArrowLeft,
  Loader2, ShieldCheck, Zap, ChevronDown, ChevronUp, Globe,
  Copy, Check, X, CreditCard, Clock, MessageSquare,
} from "lucide-react";
import { useAuth, ADMIN_EMAIL } from "@/contexts/AuthContext";
import type { ChatMessage, FileContext } from "@/app/api/agent/chat/route";
import {
  RegistryAgent, getRegistryAgent, hasPurchased, addPurchase, vietQRUrl,
} from "@/lib/agent-registry";
import { agents as HARDCODED_AGENTS, AgentData } from "@/data/agents";

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("vi-VN");

// Convert hardcoded AgentData → RegistryAgent shape for unified rendering
function agentFromHardcoded(a: AgentData): RegistryAgent {
  return {
    id:              a.id,
    name:            a.name,
    tagline:         a.tagline,
    description:     a.description,
    category:        a.category,
    icon:            a.icon,
    badge:           a.badge ?? "",
    price:           a.price,
    priceType:       a.priceType,
    features:        a.features,
    systemPrompt:    a.systemPrompt,
    demoGreeting:    a.demoGreeting,
    demoSuggestions: a.demoSuggestions,
    attachments:     [],
    sellerEmail:     "monetai.vn@gmail.com",
    sellerName:      a.seller,
    bankName:        "MB Bank",
    bankAccount:     "0971166299",
    bankHolder:      "MONET AI",
    status:          "active",
    deployedAt:      "2024-01-01T00:00:00Z",
    demoLimit:       3,
    totalSales:      a.reviews,
    totalRevenue:    a.reviews * a.price,
  };
}

function loadAgent(id: string): RegistryAgent | null {
  // Check user-deployed registry first
  const reg = getRegistryAgent(id);
  if (reg) return reg;
  // Fall back to hardcoded marketplace agents
  const hc = HARDCODED_AGENTS.find((a) => a.id === id);
  if (hc) return agentFromHardcoded(hc);
  return null;
}

// ── Purchase modal ──────────────────────────────────────────────────────────
function PurchaseModal({
  agent, userEmail, onClose, onConfirmed,
}: {
  agent: RegistryAgent;
  userEmail: string;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const [step,      setStep]      = useState<"qr" | "confirm" | "success">("qr");
  const [loading,   setLoading]   = useState(false);
  const [transferId, setTransferId] = useState("");
  const [copied,    setCopied]    = useState(false);

  const note = `MONETAI ${agent.id.slice(-8).toUpperCase()}`;
  const qrUrl = vietQRUrl(agent.id, agent.price);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const confirmPurchase = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    addPurchase(userEmail, agent.id);
    setStep("success");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A3A]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#FF6B00]" />
            <p className="text-white font-semibold text-sm">Mua quyền truy cập</p>
          </div>
          <button onClick={onClose} className="text-[#5A5A7A] hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Agent info */}
          <div className="flex items-center gap-3 bg-[#0A0A0F] rounded-xl p-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-2xl shrink-0">{agent.icon}</div>
            <div>
              <p className="text-white font-semibold text-sm">{agent.name}</p>
              <p className="text-[#FF6B00] text-xs font-semibold">{fmt(agent.price)}₫/{agent.priceType}</p>
            </div>
          </div>

          {/* Step: QR payment */}
          {step === "qr" && (
            <div className="space-y-4">
              <p className="text-[#A0A0B0] text-sm text-center">Quét QR để thanh toán</p>

              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="VietQR" width={220} height={220}
                  className="rounded-xl border border-[#2A2A3A] bg-white p-1"
                />
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { label: "Ngân hàng", value: "MB Bank" },
                  { label: "Số TK",     value: "0971166299", copy: true },
                  { label: "Chủ TK",    value: "MONET AI" },
                  { label: "Số tiền",   value: `${fmt(agent.price)}₫` },
                  { label: "Nội dung",  value: note, copy: true },
                ].map(({ label, value, copy: canCopy }) => (
                  <div key={label} className="flex items-center justify-between bg-[#0A0A0F] rounded-lg px-3 py-2">
                    <span className="text-[#5A5A7A]">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${label === "Nội dung" ? "text-[#FF6B00]" : "text-white"}`}>{value}</span>
                      {canCopy && (
                        <button onClick={() => copy(value)} className="text-[#5A5A7A] hover:text-white transition-colors">
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-400">
                Nhập đúng nội dung <strong>{note}</strong> để hệ thống tự xác nhận.
              </div>

              <button onClick={() => setStep("confirm")}
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Tôi đã chuyển khoản →
              </button>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <p className="text-[#A0A0B0] text-sm">Nhập mã giao dịch để xác nhận (tuỳ chọn):</p>
              <input value={transferId} onChange={(e) => setTransferId(e.target.value)}
                placeholder="VD: FT24234XXXXXXX (không bắt buộc)"
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
              />
              <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-4 text-xs text-[#A0A0B0] space-y-1">
                <p>✓ Thanh toán: <span className="text-white font-medium">{fmt(agent.price)}₫</span></p>
                <p>✓ Nội dung CK: <span className="text-[#FF6B00] font-medium">{note}</span></p>
                <div className="flex items-center gap-2 mt-2 text-yellow-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <p>Xác nhận thường mất 5–15 phút. Nhấn "Kích hoạt" để dùng ngay.</p>
                </div>
              </div>
              <button onClick={confirmPurchase} disabled={loading}
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loading ? "Đang xác nhận..." : "Kích hoạt truy cập"}
              </button>
              <button onClick={() => setStep("qr")} className="w-full text-[#5A5A7A] hover:text-white text-xs py-1 transition-colors">
                ← Quay lại QR
              </button>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg mb-1">Đã kích hoạt!</p>
                <p className="text-[#A0A0B0] text-sm">Bạn có thể sử dụng agent không giới hạn.</p>
              </div>
              <button onClick={onConfirmed}
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Bắt đầu sử dụng
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Demo wall overlay ────────────────────────────────────────────────────────
function DemoWall({ agent, onBuy, msgCount }: { agent: RegistryAgent; onBuy: () => void; msgCount: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/95 to-transparent rounded-b-2xl z-10 px-6 py-8 text-center">
      <div className="w-14 h-14 rounded-full bg-[#FF6B00]/20 border-2 border-[#FF6B00]/40 flex items-center justify-center mb-4">
        <Lock className="w-7 h-7 text-[#FF6B00]" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">Hết lượt dùng thử</h3>
      <p className="text-[#A0A0B0] text-sm mb-1">
        Bạn đã dùng hết <strong className="text-white">{msgCount} tin nhắn</strong> thử nghiệm miễn phí.
      </p>
      <p className="text-[#A0A0B0] text-sm mb-5">
        Mua để sử dụng không giới hạn với giá chỉ{" "}
        <strong className="text-[#FF6B00]">{fmt(agent.price)}₫/{agent.priceType}</strong>.
      </p>
      <motion.button onClick={onBuy} whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
      >
        <CreditCard className="w-4 h-4" /> Mua ngay — {fmt(agent.price)}₫/{agent.priceType}
      </motion.button>
      <p className="text-[#5A5A7A] text-xs mt-3">Thanh toán qua VietQR · MB Bank · Kích hoạt ngay</p>
    </div>
  );
}

// ── Chat section ────────────────────────────────────────────────────────────
function AgentChat({
  agent, isPurchased, demoCount, onDemoUsed, onBuy,
}: {
  agent:       RegistryAgent;
  isPurchased: boolean;
  demoCount:   number;
  onDemoUsed:  () => void;
  onBuy:       () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    ...(agent.demoGreeting ? [{ role: "assistant" as const, content: agent.demoGreeting }] : []),
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const isLocked = !isPurchased && demoCount >= agent.demoLimit && agent.price > 0;

  const sendMsg = async (text: string) => {
    if (!text.trim() || loading || isLocked) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    if (!isPurchased && agent.price > 0) onDemoUsed();

    try {
      const fileContents: FileContext[] = agent.attachments
        .filter((a) => a.isText && a.content)
        .map((a) => ({ name: a.name, content: a.content }));

      const res = await fetch("/api/agent/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          systemPrompt: agent.systemPrompt,
          messages:     next,
          fileContents: fileContents.length > 0 ? fileContents : undefined,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "Xin lỗi, có lỗi xảy ra." },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Không kết nối được AI lúc này." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden relative"
      style={{ height: "520px" }}
    >
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A3A] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-xl shrink-0">{agent.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{agent.name}</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px]">Online</span>
          </div>
        </div>
        {!isPurchased && agent.price > 0 && (
          <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 shrink-0">
            Demo: {Math.max(0, agent.demoLimit - demoCount)}/{agent.demoLimit}
          </div>
        )}
        {isPurchased && (
          <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 shrink-0 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Đã mua
          </div>
        )}
        {agent.price === 0 && (
          <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
            Miễn phí
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-base mr-2 shrink-0 mt-0.5">{agent.icon}</div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-[#FF6B00] text-white rounded-br-sm"
                : "bg-[#1A1A28] text-[#E0E0F0] rounded-bl-sm border border-[#2A2A3A]"
            }`}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-base shrink-0">{agent.icon}</div>
            <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-2xl rounded-bl-sm px-3.5 py-3 flex gap-1">
              {[0,1,2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A0A0B0] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Demo wall overlay */}
      {isLocked && <DemoWall agent={agent} onBuy={onBuy} msgCount={demoCount} />}

      {/* Suggestions (show initially) */}
      {messages.length <= 1 && !isLocked && agent.demoSuggestions.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {agent.demoSuggestions.slice(0, 3).map((s, i) => (
            <button key={i} onClick={() => sendMsg(s)}
              className="text-xs bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#FF6B00]/40 text-[#A0A0B0] hover:text-[#FF6B00] px-3 py-1.5 rounded-full transition-all truncate max-w-[200px]"
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-[#2A2A3A] shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); sendMsg(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || isLocked}
            placeholder={isLocked ? "Mua để tiếp tục..." : "Nhập tin nhắn..."}
            className="flex-1 bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-colors disabled:opacity-50"
          />
          <button type="submit"
            disabled={loading || !input.trim() || isLocked}
            className="w-10 h-10 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        {!isPurchased && agent.price > 0 && !isLocked && (
          <p className="text-[#5A5A7A] text-[10px] text-center mt-1.5">
            Còn {Math.max(0, agent.demoLimit - demoCount)} tin nhắn thử nghiệm miễn phí
          </p>
        )}
        <p className="text-[#2A2A3A] text-[10px] text-center mt-1">
          Powered by GPT-4o / Gemini / Claude
        </p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AgentPage() {
  const params = useParams();
  const id     = params.id as string;
  const { user } = useAuth();

  const [agent,       setAgent]       = useState<RegistryAgent | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [demoCount,   setDemoCount]   = useState(0);
  const [purchased,   setPurchased]   = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [faqOpen,     setFaqOpen]     = useState<number | null>(null);
  const [notFound,    setNotFound]    = useState(false);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const reload = useCallback(() => {
    const found = loadAgent(id);
    if (!found || found.status === "inactive") {
      setNotFound(true);
    } else {
      setAgent(found);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (user?.email && id) {
      setPurchased(hasPurchased(user.email, id));
    }
  }, [user, id]);

  const canUseUnlimited = isAdmin || purchased || (agent?.price === 0);

  const handleDemoUsed = () => setDemoCount((c) => c + 1);

  const handleConfirmed = () => {
    if (user?.email) {
      addPurchase(user.email, id);
      setPurchased(true);
    }
    setShowModal(false);
  };

  const handleBuy = () => {
    if (!user) {
      window.location.href = `/login?redirect=/agents/${id}`;
      return;
    }
    setShowModal(true);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound || !agent) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🤖</div>
        <h1 className="text-white text-2xl font-bold mb-2">Agent không tồn tại</h1>
        <p className="text-[#A0A0B0] mb-6">Agent này đã bị gỡ hoặc chưa được triển khai.</p>
        <Link href="/dashboard/agent-marketplace"
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Về Marketplace
        </Link>
      </div>
    );
  }

  const FAQS = [
    { q: "Tôi cần đăng nhập không?", a: `Bạn có thể dùng thử ${agent.demoLimit} tin nhắn miễn phí không cần đăng nhập. Để mua, cần tạo tài khoản MonetAI.` },
    { q: "Thanh toán bằng cách nào?", a: "Chuyển khoản qua VietQR (MB Bank). Quét mã QR, chuyển đúng số tiền và nội dung, hệ thống kích hoạt ngay." },
    { q: "Quyền truy cập có hết hạn không?", a: `Quyền truy cập theo ${agent.priceType === "tháng" ? "tháng, tự động gia hạn" : "một lần, vĩnh viễn"}.` },
    { q: "Agent có thể làm gì?", a: `${agent.name} được thiết kế cho lĩnh vực ${agent.category}. ${agent.description}` },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Navbar mini */}
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-[#2A2A3A]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/agent-marketplace"
              className="w-8 h-8 rounded-lg border border-[#2A2A3A] flex items-center justify-center text-[#A0A0B0] hover:text-white hover:border-[#FF6B00]/30 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <Link href="/" className="text-[#FF6B00] font-bold text-sm">MonetAI</Link>
            <span className="text-[#2A2A3A]">/</span>
            <span className="text-[#A0A0B0] text-sm truncate max-w-[160px]">{agent.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {!canUseUnlimited && agent.price > 0 && (
              <motion.button onClick={handleBuy} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Mua — {fmt(agent.price)}₫
              </motion.button>
            )}
            {!user && (
              <Link href={`/login?redirect=/agents/${id}`}
                className="text-[#A0A0B0] hover:text-white text-xs border border-[#2A2A3A] hover:border-[#FF6B00]/30 px-3 py-2 rounded-lg transition-all"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Left: agent info ────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero card */}
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/20 flex items-center justify-center text-3xl shrink-0">
                  {agent.icon}
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  {agent.badge && (
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      agent.badge === "HOT" ? "bg-red-500 text-white" :
                      agent.badge === "MỚI" ? "bg-blue-500 text-white" :
                      "bg-[#FF6B00] text-white"
                    }`}>{agent.badge}</span>
                  )}
                  <span className="text-[11px] bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2.5 py-1 rounded-full">{agent.category}</span>
                </div>
              </div>

              <h1 className="text-white text-xl font-bold mb-1">{agent.name}</h1>
              <p className="text-[#FF6B00] text-sm font-medium mb-2">{agent.tagline}</p>
              <p className="text-[#A0A0B0] text-sm leading-relaxed mb-4">{agent.description}</p>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-xs mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold">
                    {agent.id.startsWith("agent-") ? "5.0" : "4.9"}
                  </span>
                </div>
                <span className="text-[#2A2A3A]">·</span>
                <span className="text-[#A0A0B0]">{agent.totalSales} người dùng</span>
                <span className="text-[#2A2A3A]">·</span>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#5A5A7A]" />
                  <span className="text-[#5A5A7A]">{agent.sellerName}</span>
                </div>
              </div>

              {/* Price + CTA */}
              {agent.price > 0 ? (
                <div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-white font-bold text-2xl">{fmt(agent.price)}₫</span>
                    <span className="text-[#A0A0B0] text-sm">/{agent.priceType}</span>
                  </div>
                  {canUseUnlimited ? (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <p className="text-green-400 text-sm font-medium">Đã có quyền truy cập đầy đủ</p>
                    </div>
                  ) : (
                    <motion.button onClick={handleBuy} whileTap={{ scale: 0.97 }}
                      className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" /> Mua ngay — {fmt(agent.price)}₫/{agent.priceType}
                    </motion.button>
                  )}
                  {!canUseUnlimited && (
                    <p className="text-[#5A5A7A] text-xs text-center mt-2">
                      Dùng thử {agent.demoLimit} tin nhắn miễn phí
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <p className="text-blue-400 text-sm font-medium">Miễn phí — Sử dụng không giới hạn</p>
                </div>
              )}
            </div>

            {/* Features */}
            {agent.features.length > 0 && (
              <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                <p className="text-white font-semibold text-sm mb-3">Tính năng nổi bật</p>
                <div className="space-y-2">
                  {agent.features.map((ft, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span className="text-[#A0A0B0]">{ft}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4">
              <div className="space-y-2.5 text-xs">
                {[
                  { icon: <ShieldCheck className="w-4 h-4 text-green-400" />, text: "Thanh toán qua VietQR bảo mật" },
                  { icon: <Zap className="w-4 h-4 text-yellow-400" />,        text: "Kích hoạt ngay sau thanh toán" },
                  { icon: <MessageSquare className="w-4 h-4 text-blue-400" />, text: "Hỗ trợ 24/7 qua MonetAI" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-[#A0A0B0]">
                    {icon} {text}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden">
              <p className="text-white font-semibold text-sm px-4 py-3 border-b border-[#2A2A3A]">Câu hỏi thường gặp</p>
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-[#2A2A3A] last:border-0">
                  <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <p className="text-[#A0A0B0] text-xs font-medium pr-3">{faq.q}</p>
                    {faqOpen === i ? <ChevronUp className="w-3.5 h-3.5 text-[#5A5A7A] shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-[#5A5A7A] shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {faqOpen === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"
                      >
                        <p className="text-[#5A5A7A] text-xs px-4 pb-3 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: chat ──────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <AgentChat
              agent={agent}
              isPurchased={canUseUnlimited}
              demoCount={demoCount}
              onDemoUsed={handleDemoUsed}
              onBuy={handleBuy}
            />

            {/* Buy CTA below chat on mobile */}
            {!canUseUnlimited && agent.price > 0 && (
              <motion.button onClick={handleBuy} whileTap={{ scale: 0.97 }}
                className="mt-4 w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 lg:hidden"
              >
                <CreditCard className="w-4 h-4" /> Mua ngay — {fmt(agent.price)}₫/{agent.priceType}
              </motion.button>
            )}
          </div>

        </div>
      </div>

      {/* Purchase modal */}
      <AnimatePresence>
        {showModal && user && (
          <PurchaseModal
            agent={agent}
            userEmail={user.email}
            onClose={() => setShowModal(false)}
            onConfirmed={handleConfirmed}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
