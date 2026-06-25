"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Bot, CheckCircle2, Star, Plus, X,
  Banknote, Eye, Send, Sparkles, Tag, Upload, Clock,
  TrendingUp, ShieldCheck, AlertCircle, ChevronDown, ChevronUp,
  RefreshCw, Package, Info, FileText, FileUp, File,
  Paperclip, Trash2, MessageSquare, Loader2, Database,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatMessage, FileContext } from "@/app/api/agent/chat/route";
import { DeployTab } from "@/components/sell-agent/DeployTab";

// ── Constants ──────────────────────────────────────────────────────────────────
const SELLER_CUT  = 0.8;
const PAYOUT_DAYS = "7–10 ngày";
const LS_KEY      = "monetai_my_agents";
const MAX_FILES   = 5;
const MAX_FILE_MB = 5;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const TEXT_EXTS   = ["txt", "md", "csv", "json", "html", "xml", "yaml", "yml"];
const ALLOWED_EXTS = [...TEXT_EXTS, "pdf"];

const CATEGORIES  = [
  "Bán hàng", "Nội dung", "CSKH", "Marketing", "SEO",
  "E-commerce", "Giáo dục", "HR & Tuyển dụng", "Tài chính", "Khác",
];
const PRICE_TYPES = [
  { value: "tháng", label: "Hàng tháng (subscription)" },
  { value: "lần",   label: "Một lần (one-time)" },
];
const BANKS = [
  "MB Bank", "Vietcombank", "BIDV", "Agribank", "Techcombank",
  "VPBank", "TPBank", "ACB", "Sacombank", "VietinBank",
  "HDBank", "SHB", "OCB", "MSB", "SeABank", "Khác",
];
const ICON_OPTIONS = [
  "🤖","🤝","💬","📊","🎯","✍️","📱","🔍","🛒","💰",
  "🚀","⚡","🧠","💡","🔧","📈","🎭","🌟","💎","🏆",
  "🎬","📝","🔮","🎪","🌐","🔔","📣","💼","🏅","🎁",
];
const BADGE_OPTIONS = [
  { value: "",          label: "Không có" },
  { value: "MỚI",      label: "🆕 MỚI" },
  { value: "HOT",       label: "🔥 HOT" },
  { value: "BÁN CHẠY", label: "⭐ BÁN CHẠY" },
];
const STEPS = ["Thông tin cơ bản", "Tính năng & Demo", "Giá & Nhận tiền", "Xem lại & Đăng"];

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AttachmentFile {
  id:          string;
  name:        string;
  ext:         string;
  mimeType:    string;
  size:        number;
  isText:      boolean;
  content:     string;   // UTF-8 text for text files, empty for binary
  description: string;
  status:      "reading" | "ready" | "error";
  error?:      string;
}

interface SellForm {
  agentName: string; tagline: string; description: string;
  category: string; icon: string; badge: string;
  features: string[]; systemPrompt: string;
  demoGreeting: string; demoSuggestions: string[];
  price: string; priceType: "tháng" | "lần";
  bankName: string; bankAccount: string; bankHolder: string;
  attachments: AttachmentFile[];
  agreedToTerms: boolean;
}

interface SavedAgent {
  id: string; sellerEmail: string; sellerName: string;
  agentName: string; tagline: string; description: string;
  category: string; icon: string; badge: string;
  price: number; priceType: string;
  features: string[]; systemPrompt: string;
  demoGreeting: string; demoSuggestions: string[];
  bankName: string; bankAccount: string; bankHolder: string;
  attachments: AttachmentFile[];
  status: "pending" | "active" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  totalSales: number; totalRevenue: number;
  pendingPayout: number; totalPayout: number;
}

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  active:   "bg-green-500/15  text-green-400  border-green-500/30",
  rejected: "bg-red-500/15    text-red-400    border-red-500/30",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Đang duyệt", active: "Đang bán", rejected: "Bị từ chối",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("vi-VN");

function fmtSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function fileExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function FileTypeIcon({ ext }: { ext: string }) {
  const colors: Record<string, string> = {
    pdf:  "text-red-400",
    csv:  "text-green-400",
    json: "text-yellow-400",
    md:   "text-blue-400",
    txt:  "text-[#A0A0B0]",
  };
  return (
    <div className={`w-8 h-8 rounded-lg bg-[#0A0A0F] border border-[#2A2A3A] flex items-center justify-center shrink-0 ${colors[ext] ?? "text-[#A0A0B0]"}`}>
      <FileText className="w-4 h-4" />
    </div>
  );
}

function loadMyAgents(): SavedAgent[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}
function saveMyAgents(agents: SavedAgent[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(agents));
}

function validateStep(step: number, f: SellForm): string[] {
  const errs: string[] = [];
  if (step === 0) {
    if (!f.agentName.trim())   errs.push("Tên Agent không được để trống");
    if (!f.tagline.trim())     errs.push("Tagline không được để trống");
    if (!f.description.trim()) errs.push("Mô tả không được để trống");
    if (!f.category)           errs.push("Chọn danh mục");
  }
  if (step === 1) {
    if (f.features.filter(Boolean).length < 2) errs.push("Nhập ít nhất 2 tính năng");
    if (!f.systemPrompt.trim())  errs.push("System prompt không được để trống");
    if (!f.demoGreeting.trim())  errs.push("Lời chào demo không được để trống");
    if (f.demoSuggestions.filter(Boolean).length < 1) errs.push("Nhập ít nhất 1 gợi ý");
    if (f.attachments.some((a) => a.status === "reading")) errs.push("Đang đọc file, vui lòng chờ...");
  }
  if (step === 2) {
    const p = Number(f.price);
    if (!f.price || isNaN(p) || p < 10_000) errs.push("Giá tối thiểu 10.000₫");
    if (!f.bankName)             errs.push("Chọn ngân hàng");
    if (!f.bankAccount.trim())   errs.push("Nhập số tài khoản");
    if (!f.bankHolder.trim())    errs.push("Nhập tên chủ tài khoản");
  }
  if (step === 3 && !f.agreedToTerms) errs.push("Vui lòng đồng ý với điều khoản");
  return errs;
}

function defaultForm(): SellForm {
  return {
    agentName: "", tagline: "", description: "", category: "", icon: "🤖", badge: "",
    features: ["", "", "", ""], systemPrompt: "", demoGreeting: "",
    demoSuggestions: ["", "", ""],
    price: "", priceType: "tháng",
    bankName: "", bankAccount: "", bankHolder: "",
    attachments: [],
    agreedToTerms: false,
  };
}

// ── Preview card ───────────────────────────────────────────────────────────────
function PreviewCard({ f }: { f: SellForm }) {
  const price = Number(f.price) || 0;
  return (
    <div className="bg-[#16161F] border border-[#FF6B00]/30 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-2xl shrink-0">{f.icon || "🤖"}</div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {f.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              f.badge === "HOT" ? "bg-red-500 text-white" :
              f.badge === "MỚI" ? "bg-blue-500 text-white" : "bg-[#FF6B00] text-white"
            }`}>{f.badge}</span>
          )}
          {f.category && (
            <span className="text-[10px] font-medium bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{f.category}</span>
          )}
        </div>
      </div>
      <h3 className="text-white font-semibold text-sm mb-0.5">{f.agentName || "Tên Agent"}</h3>
      <p className="text-[#FF6B00] text-xs font-medium mb-2">{f.tagline || "Tagline của bạn"}</p>
      <p className="text-[#A0A0B0] text-xs leading-relaxed mb-3 line-clamp-2">{f.description || "Mô tả agent..."}</p>
      {f.features.filter(Boolean).slice(0, 3).map((ft, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-[#A0A0B0] mb-1.5">
          <CheckCircle2 className="w-3 h-3 text-[#FF6B00] shrink-0 mt-0.5" />{ft}
        </div>
      ))}
      {f.attachments.filter((a) => a.status === "ready").length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 mb-2">
          <Database className="w-3 h-3 text-blue-400" />
          <span className="text-blue-400 text-[11px] font-medium">
            {f.attachments.filter((a) => a.status === "ready").length} tài liệu đính kèm
          </span>
        </div>
      )}
      <div className="flex items-center gap-1 mt-3 mb-2">
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-white text-xs font-medium">5.0</span>
        <span className="text-[#A0A0B0] text-xs">(0)</span>
      </div>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-white font-bold text-lg">{price > 0 ? fmt(price) : "0"}₫</span>
        <span className="text-[#A0A0B0] text-xs">/{f.priceType}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-center gap-1 border border-[#FF6B00]/40 text-[#FF6B00] text-xs font-semibold py-2 rounded-xl">
          <Sparkles className="w-3 h-3" /> Dùng thử
        </div>
        <div className="flex items-center justify-center bg-[#FF6B00] text-white text-xs font-semibold py-2 rounded-xl">Mua ngay</div>
      </div>
    </div>
  );
}

// ── Test agent chat ────────────────────────────────────────────────────────────
function TestAgentChat({ form }: { form: SellForm }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const readyFiles = form.attachments.filter((a) => a.status === "ready" && a.isText && a.content);

  const buildSystemPrompt = () => {
    if (readyFiles.length === 0) return form.systemPrompt;
    return form.systemPrompt; // file content is passed via fileContents param
  };

  const sendMsg = async (text: string) => {
    if (!text.trim() || loading || !form.systemPrompt) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const fileContents: FileContext[] = readyFiles.map((f) => ({
        name:    f.name,
        content: f.content,
      }));

      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(),
          messages: next,
          fileContents: fileContents.length > 0 ? fileContents : undefined,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || data.error || "Xin lỗi, có lỗi xảy ra." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Không kết nối được AI lúc này." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!form.systemPrompt.trim()) {
    return (
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 text-center">
        <Bot className="w-10 h-10 mx-auto mb-2 text-[#2A2A3A]" />
        <p className="text-[#5A5A7A] text-sm">Điền System Prompt để test Agent</p>
      </div>
    );
  }

  return (
    <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden flex flex-col" style={{ height: "420px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A3A] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-base">{form.icon || "🤖"}</div>
          <div>
            <p className="text-white text-xs font-semibold">{form.agentName || "Agent Preview"}</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px]">Live test</span>
            </div>
          </div>
        </div>
        {readyFiles.length > 0 && (
          <div className="flex items-center gap-1 text-blue-400 text-[10px]">
            <Database className="w-3 h-3" />
            {readyFiles.length} file đính kèm
          </div>
        )}
        {messages.length > 0 && (
          <button onClick={() => setMessages([])}
            className="text-[#5A5A7A] hover:text-white transition-colors p-1"
            title="Xoá hội thoại"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-[#5A5A7A] text-xs">Gửi tin nhắn để test agent của bạn</p>
            {form.demoSuggestions.filter(Boolean).length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {form.demoSuggestions.filter(Boolean).slice(0, 2).map((s, i) => (
                  <button key={i} onClick={() => sendMsg(s)}
                    className="text-[10px] bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#FF6B00]/40 text-[#A0A0B0] hover:text-[#FF6B00] px-2.5 py-1 rounded-full transition-all"
                  >{s}</button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-[#FF6B00]/15 flex items-center justify-center text-sm mr-1.5 shrink-0 mt-0.5">{form.icon || "🤖"}</div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-[#FF6B00] text-white rounded-br-sm"
                : "bg-[#1A1A28] text-[#E0E0F0] rounded-bl-sm border border-[#2A2A3A]"
            }`}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-[#FF6B00]/15 flex items-center justify-center text-sm">{form.icon || "🤖"}</div>
            <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1">
              {[0,1,2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A0A0B0] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#2A2A3A] shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); sendMsg(input); }} className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={loading}
            placeholder="Nhập để test agent..."
            className="flex-1 bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-white text-xs placeholder:text-[#5A5A7A] outline-none transition-colors disabled:opacity-50"
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="w-8 h-8 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
        <p className="text-[#5A5A7A] text-[10px] text-center mt-1.5">Powered by GPT-4o / Gemini / Claude</p>
      </div>
    </div>
  );
}

// ── My agents panel ────────────────────────────────────────────────────────────
function MyAgentsPanel({ email }: { email: string }) {
  const [agents,   setAgents]   = useState<SavedAgent[]>([]);
  const [expanded, setExpand]   = useState<string | null>(null);

  const load = useCallback(() => {
    setAgents(loadMyAgents().filter((a) => a.sellerEmail === email));
  }, [email]);

  useEffect(() => { load(); }, [load]);

  if (agents.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-12 h-12 mx-auto mb-3 text-[#2A2A3A]" />
        <p className="text-white font-semibold mb-1">Chưa có agent nào</p>
        <p className="text-[#A0A0B0] text-sm">Chuyển sang tab "Đăng bán mới" để tạo agent đầu tiên</p>
      </div>
    );
  }

  const totalPending  = agents.reduce((s, a) => s + a.pendingPayout,  0);
  const totalReceived = agents.reduce((s, a) => s + a.totalPayout,    0);
  const totalSales    = agents.reduce((s, a) => s + a.totalSales,     0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tổng đơn bán",   value: String(totalSales),       icon: <TrendingUp  className="w-4 h-4 text-[#FF6B00]"  /> },
          { label: "Chờ thanh toán", value: `${fmt(totalPending)}₫`,  icon: <Clock        className="w-4 h-4 text-yellow-400" /> },
          { label: "Đã nhận",        value: `${fmt(totalReceived)}₫`, icon: <CheckCircle2 className="w-4 h-4 text-green-400"  /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-white font-bold text-base">{s.value}</p>
            <p className="text-[#A0A0B0] text-[11px]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-white font-semibold text-sm">{agents.length} Agent đã đăng</p>
        <button onClick={load} className="text-[#A0A0B0] hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {agents.map((agent) => (
        <div key={agent.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            onClick={() => setExpand(expanded === agent.id ? null : agent.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-xl shrink-0">{agent.icon}</div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">{agent.agentName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#A0A0B0] text-xs">{agent.tagline}</p>
                  {agent.attachments?.length > 0 && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Paperclip className="w-2.5 h-2.5" />
                      <span className="text-[10px]">{agent.attachments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[agent.status]}`}>
                {STATUS_LABEL[agent.status]}
              </span>
              {expanded === agent.id ? <ChevronUp className="w-4 h-4 text-[#A0A0B0]" /> : <ChevronDown className="w-4 h-4 text-[#A0A0B0]" />}
            </div>
          </button>

          <AnimatePresence>
            {expanded === agent.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-[#2A2A3A] pt-3 space-y-3">
                  {agent.status === "pending" && (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <p className="text-yellow-400 text-xs">Đang chờ MonetAI xét duyệt (1–3 ngày). Sau khi duyệt, agent sẽ xuất hiện trong marketplace.</p>
                    </div>
                  )}
                  {agent.status === "rejected" && agent.rejectionReason && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-xs">{agent.rejectionReason}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-4 text-xs">
                    {[
                      ["Giá bán",              `${fmt(agent.price)}₫/${agent.priceType}`],
                      ["Danh mục",             agent.category],
                      ["Đơn bán",              `${agent.totalSales} đơn`],
                      ["Doanh thu gộp",        `${fmt(agent.totalRevenue)}₫`],
                      ["Chờ TT (80%)",         `${fmt(agent.pendingPayout)}₫`],
                      ["Đã nhận",              `${fmt(agent.totalPayout)}₫`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-1.5 border-b border-[#2A2A3A]">
                        <span className="text-[#A0A0B0]">{label}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Attachments */}
                  {agent.attachments?.length > 0 && (
                    <div>
                      <p className="text-[#A0A0B0] text-xs font-medium mb-2 flex items-center gap-1.5">
                        <Paperclip className="w-3 h-3" /> Tài liệu đính kèm
                      </p>
                      <div className="space-y-1.5">
                        {agent.attachments.map((att) => (
                          <div key={att.id} className="flex items-center gap-2 bg-[#0A0A0F] rounded-lg px-3 py-1.5">
                            <FileTypeIcon ext={att.ext} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs truncate">{att.name}</p>
                              <p className="text-[#5A5A7A] text-[10px]">{fmtSize(att.size)} · {att.description || att.ext.toUpperCase()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[#5A5A7A] text-[11px] text-right">
                    Đăng {new Date(agent.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {totalPending > 0 && (
        <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-2xl p-4 flex items-start gap-3">
          <Banknote className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
          <p className="text-[#A0A0B0] text-xs leading-relaxed">
            <strong className="text-white">{fmt(totalPending)}₫</strong> sẽ được chuyển về trong {PAYOUT_DAYS}.
            Liên hệ: <strong className="text-white">0562 557 777</strong>
          </p>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function SellAgentPage() {
  const { user } = useAuth();

  const [tab,       setTab]       = useState<"sell" | "my" | "deploy">("sell");
  const [step,      setStep]      = useState(0);
  const [errors,    setErrors]    = useState<string[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form,      setForm]      = useState<SellForm>(defaultForm);
  const [dragOver,  setDragOver]  = useState(false);
  const [rightTab,  setRightTab]  = useState<"preview" | "test">("preview");
  const [myCount,   setMyCount]   = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) setMyCount(loadMyAgents().filter((a) => a.sellerEmail === user.email).length);
  }, [user, submitted]);

  // Switch right tab to "test" when entering step 1 (system prompt step)
  useEffect(() => {
    if (step === 1 && form.systemPrompt.trim()) setRightTab("test");
    else if (step !== 1) setRightTab("preview");
  }, [step, form.systemPrompt]);

  const set = (k: keyof SellForm, v: SellForm[keyof SellForm]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setFeature    = (i: number, v: string) =>
    setForm((p) => { const f = [...p.features]; f[i] = v; return { ...p, features: f }; });

  const setSuggestion = (i: number, v: string) =>
    setForm((p) => { const s = [...p.demoSuggestions]; s[i] = v; return { ...p, demoSuggestions: s }; });

  const addFeature = () =>
    setForm((p) => ({ ...p, features: [...p.features, ""] }));

  const removeFeature = (i: number) =>
    setForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));

  // ── File upload handlers ─────────────────────────────────────────────────────
  const processFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);

    const currentCount = form.attachments.length;
    const canAdd = MAX_FILES - currentCount;
    if (canAdd <= 0) return;

    const toProcess = files.slice(0, canAdd);

    for (const file of toProcess) {
      const ext = fileExt(file.name);

      // Validate extension
      if (!ALLOWED_EXTS.includes(ext)) {
        const errorEntry: AttachmentFile = {
          id: `${Date.now()}-${Math.random()}`, name: file.name, ext,
          mimeType: file.type, size: file.size,
          isText: false, content: "", description: "",
          status: "error", error: `Loại file không được hỗ trợ (.${ext}). Hỗ trợ: ${ALLOWED_EXTS.join(", ")}`,
        };
        setForm((p) => ({ ...p, attachments: [...p.attachments, errorEntry] }));
        continue;
      }

      // Validate size
      if (file.size > MAX_FILE_BYTES) {
        const errorEntry: AttachmentFile = {
          id: `${Date.now()}-${Math.random()}`, name: file.name, ext,
          mimeType: file.type, size: file.size,
          isText: false, content: "", description: "",
          status: "error", error: `File quá lớn (${fmtSize(file.size)}). Tối đa ${MAX_FILE_MB}MB.`,
        };
        setForm((p) => ({ ...p, attachments: [...p.attachments, errorEntry] }));
        continue;
      }

      const isText = TEXT_EXTS.includes(ext);
      const id     = `${Date.now()}-${Math.random()}`;

      // Add placeholder with reading status
      const placeholder: AttachmentFile = {
        id, name: file.name, ext, mimeType: file.type, size: file.size,
        isText, content: "", description: "", status: "reading",
      };
      setForm((p) => ({ ...p, attachments: [...p.attachments, placeholder] }));

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) ?? "";
        setForm((p) => ({
          ...p,
          attachments: p.attachments.map((a) =>
            a.id === id ? { ...a, content, status: "ready" as const } : a
          ),
        }));
      };
      reader.onerror = () => {
        setForm((p) => ({
          ...p,
          attachments: p.attachments.map((a) =>
            a.id === id ? { ...a, status: "error" as const, error: "Không đọc được file" } : a
          ),
        }));
      };

      if (isText) reader.readAsText(file, "UTF-8");
      else        reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeAttachment = (id: string) =>
    setForm((p) => ({ ...p, attachments: p.attachments.filter((a) => a.id !== id) }));

  const updateAttachDesc = (id: string, desc: string) =>
    setForm((p) => ({
      ...p,
      attachments: p.attachments.map((a) => a.id === id ? { ...a, description: desc } : a),
    }));

  // ── Navigation ───────────────────────────────────────────────────────────────
  const nextStep = () => {
    const errs = validateStep(step, form);
    if (errs.length > 0) { setErrors(errs); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setErrors([]);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => { setErrors([]); setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validateStep(3, form);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setLoading(true);

    const newAgent: SavedAgent = {
      id:             `agent-${Date.now()}`,
      sellerEmail:    user?.email  || "",
      sellerName:     user?.name   || "",
      agentName:      form.agentName,
      tagline:        form.tagline,
      description:    form.description,
      category:       form.category,
      icon:           form.icon,
      badge:          form.badge,
      price:          Number(form.price),
      priceType:      form.priceType,
      features:       form.features.filter(Boolean),
      systemPrompt:   form.systemPrompt,
      demoGreeting:   form.demoGreeting,
      demoSuggestions: form.demoSuggestions.filter(Boolean),
      bankName:       form.bankName,
      bankAccount:    form.bankAccount,
      bankHolder:     form.bankHolder,
      attachments:    form.attachments.filter((a) => a.status === "ready"),
      status:         "pending",
      createdAt:      new Date().toISOString(),
      totalSales: 0, totalRevenue: 0, pendingPayout: 0, totalPayout: 0,
    };

    // Save to localStorage immediately
    const existing = loadMyAgents();
    existing.push(newAgent);
    saveMyAgents(existing);

    // Background API sync (optional — works without Supabase table)
    fetch("/api/agent/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sellerEmail:     newAgent.sellerEmail,
        sellerName:      newAgent.sellerName,
        agentName:       newAgent.agentName,
        tagline:         newAgent.tagline,
        description:     newAgent.description,
        category:        newAgent.category,
        icon:            newAgent.icon,
        badge:           newAgent.badge || null,
        price:           newAgent.price,
        priceType:       newAgent.priceType,
        features:        newAgent.features,
        systemPrompt:    newAgent.systemPrompt,
        demoGreeting:    newAgent.demoGreeting,
        demoSuggestions: newAgent.demoSuggestions,
        bankName:        newAgent.bankName,
        bankAccount:     newAgent.bankAccount,
        bankHolder:      newAgent.bankHolder,
        attachmentCount: newAgent.attachments.length,
        attachmentNames: newAgent.attachments.map((a) => a.name),
      }),
    }).catch(() => {});

    setLoading(false);
    setSubmitted(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Bot className="w-12 h-12 text-[#2A2A3A] mb-3" />
        <p className="text-white font-semibold mb-2">Vui lòng đăng nhập</p>
        <Link href="/login" className="text-[#FF6B00] text-sm hover:underline">Đăng nhập →</Link>
      </div>
    );
  }

  const priceNum    = Number(form.price) || 0;
  const sellerEarns = Math.round(priceNum * SELLER_CUT);
  const monetaiCut  = priceNum - sellerEarns;

  // ── Success screen ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-10 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
        </motion.div>
        <h2 className="text-white text-2xl font-bold mb-2">Đã gửi thành công!</h2>
        <p className="text-[#A0A0B0] mb-1">Agent đang chờ MonetAI xét duyệt.</p>
        {form.attachments.filter((a) => a.status === "ready").length > 0 && (
          <p className="text-blue-400 text-sm mb-1">
            {form.attachments.filter((a) => a.status === "ready").length} tài liệu đính kèm đã được lưu.
          </p>
        )}
        <p className="text-[#5A5A7A] text-sm mb-7">Thường mất 1–3 ngày làm việc.</p>

        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 text-left mb-6 space-y-3">
          {[
            { e: "🔍", t: "MonetAI xét duyệt agent + tài liệu đính kèm" },
            { e: "✅", t: "Agent được tích hợp và đăng lên marketplace" },
            { e: "💰", t: "Khi có người mua, MonetAI nhận tiền và ghi nhận 80% cho bạn" },
            { e: "🏦", t: `Sau ${PAYOUT_DAYS}, 80% chuyển về tài khoản ngân hàng của bạn` },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-xl shrink-0">{r.e}</span>
              <p className="text-[#A0A0B0]">{r.t}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setStep(0); setForm(defaultForm()); setTab("my"); }}
            className="flex items-center gap-2 border border-[#2A2A3A] text-[#A0A0B0] hover:text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Package className="w-4 h-4" /> Xem agent của tôi
          </button>
          <Link href="/dashboard/agent-marketplace"
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Bot className="w-4 h-4" /> Về Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/agent-marketplace"
          className="w-9 h-9 rounded-xl border border-[#2A2A3A] flex items-center justify-center text-[#A0A0B0] hover:text-white hover:border-[#FF6B00]/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Bán AI Agent</h1>
          <p className="text-[#A0A0B0] text-xs">Đăng bán agent — nhận 80% doanh thu tự động</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-1 w-fit mb-6 flex-wrap">
        <button onClick={() => setTab("sell")}
          className={`text-sm px-4 py-2 rounded-lg transition-all font-medium ${
            tab === "sell" ? "bg-[#FF6B00] text-white" : "text-[#A0A0B0] hover:text-white"
          }`}
        >Đăng bán mới</button>

        <button onClick={() => setTab("deploy")}
          className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all font-medium ${
            tab === "deploy" ? "bg-[#FF6B00] text-white" : "text-[#A0A0B0] hover:text-white"
          }`}
        >
          <span>🚀</span> Tải lên & Triển khai
        </button>

        <button onClick={() => setTab("my")}
          className={`relative text-sm px-4 py-2 rounded-lg transition-all font-medium ${
            tab === "my" ? "bg-[#FF6B00] text-white" : "text-[#A0A0B0] hover:text-white"
          }`}
        >
          Agent của tôi
          {myCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 text-white text-[9px] font-bold flex items-center justify-center">{myCount}</span>
          )}
        </button>
      </div>

      {/* My agents tab */}
      {tab === "my" && <MyAgentsPanel email={user.email} />}

      {/* Deploy tab */}
      {tab === "deploy" && (
        <DeployTab userEmail={user.email} userName={user.name} />
      )}

      {/* Sell form */}
      {tab === "sell" && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: form */}
          <div className="lg:col-span-2">

            {/* Step progress */}
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 mb-4">
              <div className="flex items-start">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        i < step   ? "bg-green-500 text-white" :
                        i === step ? "bg-[#FF6B00] text-white" : "bg-[#2A2A3A] text-[#5A5A7A]"
                      }`}>
                        {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <p className={`text-[10px] mt-1 text-center hidden sm:block leading-tight ${i === step ? "text-white font-medium" : "text-[#5A5A7A]"}`}>{s}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-px flex-1 mx-2 mb-3 sm:mb-0 ${i < step ? "bg-green-500" : "bg-[#2A2A3A]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 space-y-1"
                >
                  {errors.map((e, i) => (
                    <p key={i} className="text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />{e}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 1: Basic info ─────────────────────────────────────── */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B00]" />
                  <h2 className="text-white font-semibold">Thông tin cơ bản</h2>
                </div>

                {/* Icon picker */}
                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Biểu tượng Agent</label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_OPTIONS.map((icon) => (
                      <button key={icon} type="button" onClick={() => set("icon", icon)}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                          form.icon === icon
                            ? "bg-[#FF6B00]/20 border-2 border-[#FF6B00]"
                            : "bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#FF6B00]/40"
                        }`}
                      >{icon}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Tên Agent <span className="text-red-400">*</span></label>
                  <input value={form.agentName} onChange={(e) => set("agentName", e.target.value)}
                    placeholder="VD: Sales Consultant Pro" maxLength={60}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
                  />
                  <p className="text-[#5A5A7A] text-[11px] mt-1 text-right">{form.agentName.length}/60</p>
                </div>

                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Tagline ngắn <span className="text-red-400">*</span></label>
                  <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)}
                    placeholder="VD: Tư vấn & chốt sale 24/7 không nghỉ" maxLength={80}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
                  />
                  <p className="text-[#5A5A7A] text-[11px] mt-1 text-right">{form.tagline.length}/80</p>
                </div>

                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Mô tả chi tiết <span className="text-red-400">*</span></label>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="Mô tả agent làm được gì, phù hợp với ai, lợi ích chính là gì..."
                    rows={3} maxLength={300}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all resize-none"
                  />
                  <p className="text-[#5A5A7A] text-[11px] mt-1 text-right">{form.description.length}/300</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Danh mục <span className="text-red-400">*</span></label>
                    <select value={form.category} onChange={(e) => set("category", e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Chọn danh mục...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Badge (tuỳ chọn)</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_OPTIONS.map((b) => (
                        <button key={b.value} type="button" onClick={() => set("badge", b.value)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                            form.badge === b.value
                              ? "bg-[#FF6B00] text-white"
                              : "bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] hover:border-[#FF6B00]/40"
                          }`}
                        >{b.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Features + Files + Demo ───────────────────────── */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                {/* Features */}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                      <h2 className="text-white font-semibold">Tính năng nổi bật</h2>
                    </div>
                    <span className="text-[#5A5A7A] text-xs">{form.features.filter(Boolean).length}/6</span>
                  </div>
                  <div className="space-y-2">
                    {form.features.map((ft, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[#FF6B00] text-xs w-5 text-center font-bold shrink-0">{i + 1}</span>
                        <input value={ft} onChange={(e) => setFeature(i, e.target.value)}
                          placeholder={`Tính năng ${i + 1}...`}
                          className="flex-1 bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
                        />
                        {form.features.length > 2 && (
                          <button type="button" onClick={() => removeFeature(i)}
                            className="text-[#5A5A7A] hover:text-red-400 transition-colors p-1"
                          ><X className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    ))}
                    {form.features.length < 6 && (
                      <button type="button" onClick={addFeature}
                        className="w-full border border-dashed border-[#2A2A3A] hover:border-[#FF6B00]/40 text-[#5A5A7A] hover:text-[#FF6B00] text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                      ><Plus className="w-3.5 h-3.5" /> Thêm tính năng</button>
                    )}
                  </div>
                </div>

                {/* System Prompt */}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-[#FF6B00]" />
                    <h2 className="text-white font-semibold">System Prompt</h2>
                    <div className="group relative ml-auto">
                      <Info className="w-3.5 h-3.5 text-[#5A5A7A] cursor-help" />
                      <div className="absolute right-0 top-5 w-56 bg-[#1A1A28] border border-[#2A2A3A] rounded-xl p-3 text-xs text-[#A0A0B0] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                        Hướng dẫn ẩn cho AI. Định nghĩa vai trò, nhiệm vụ và phong cách. File đính kèm sẽ tự động được thêm vào đây.
                      </div>
                    </div>
                  </div>
                  <p className="text-[#A0A0B0] text-xs mb-3">Định nghĩa vai trò và nhiệm vụ. Càng chi tiết, AI càng chuẩn xác.</p>
                  <textarea value={form.systemPrompt} onChange={(e) => set("systemPrompt", e.target.value)}
                    placeholder={`VD:\nBạn là [Tên Agent], chuyên gia về [lĩnh vực].\nNhiệm vụ: [mô tả cụ thể]\nPhong cách: [thân thiện / chuyên nghiệp]\nQuy tắc:\n- Luôn hỏi nhu cầu trước khi tư vấn\n- Sử dụng số liệu và ví dụ thực tế`}
                    rows={7} maxLength={2000}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all resize-none font-mono"
                  />
                  <p className="text-[#5A5A7A] text-[11px] mt-1 text-right">{form.systemPrompt.length}/2000</p>
                </div>

                {/* ── FILE UPLOAD SECTION ────────────────────────────────── */}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-[#FF6B00]" />
                      <h2 className="text-white font-semibold">Tài liệu đính kèm</h2>
                      <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-medium">AI Knowledge Base</span>
                    </div>
                    <span className="text-[#5A5A7A] text-xs">{form.attachments.length}/{MAX_FILES}</span>
                  </div>
                  <p className="text-[#A0A0B0] text-xs mb-4 leading-relaxed">
                    Upload file để AI Agent tham khảo khi trả lời. Nội dung file sẽ được tích hợp vào knowledge base của agent,
                    giúp agent trả lời chính xác hơn về sản phẩm, dịch vụ của bạn.
                  </p>

                  {/* Supported types info */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { ext: "TXT/MD",  desc: "Văn bản, hướng dẫn",    color: "text-[#A0A0B0]" },
                      { ext: "CSV",     desc: "Dữ liệu, danh sách",    color: "text-green-400"  },
                      { ext: "JSON",    desc: "Cấu hình, structured",  color: "text-yellow-400" },
                      { ext: "PDF",     desc: "Tài liệu, catalog",     color: "text-red-400"    },
                    ].map((t) => (
                      <div key={t.ext} className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-2 text-center">
                        <p className={`text-xs font-bold ${t.color}`}>{t.ext}</p>
                        <p className="text-[#5A5A7A] text-[10px] mt-0.5">{t.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Drop zone */}
                  {form.attachments.length < MAX_FILES && (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        dragOver
                          ? "border-[#FF6B00] bg-[#FF6B00]/5 scale-[1.01]"
                          : "border-[#2A2A3A] hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]/3"
                      }`}
                    >
                      <FileUp className="w-8 h-8 mx-auto mb-2 text-[#5A5A7A]" />
                      <p className="text-[#A0A0B0] text-sm">
                        Kéo thả hoặc <span className="text-[#FF6B00] font-medium">chọn file</span>
                      </p>
                      <p className="text-[#5A5A7A] text-xs mt-1">
                        TXT, MD, CSV, JSON, HTML, PDF · Tối đa {MAX_FILE_MB}MB/file · {MAX_FILES} file
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".txt,.md,.csv,.json,.html,.xml,.yaml,.yml,.pdf"
                        onChange={(e) => processFiles(e.target.files)}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* File list */}
                  {form.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {form.attachments.map((file) => (
                        <motion.div key={file.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className={`bg-[#0A0A0F] border rounded-xl p-3 transition-colors ${
                            file.status === "error"   ? "border-red-500/30" :
                            file.status === "ready"   ? "border-green-500/20" :
                            "border-[#2A2A3A]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileTypeIcon ext={file.ext} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium truncate">{file.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[#5A5A7A] text-[11px]">{fmtSize(file.size)}</p>
                                {file.isText && file.status === "ready" && (
                                  <span className="text-green-400 text-[10px] bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                                    ✓ Text đã đọc
                                  </span>
                                )}
                                {!file.isText && file.status === "ready" && (
                                  <span className="text-orange-400 text-[10px] bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-full">
                                    Binary (ảnh tham khảo)
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {file.status === "reading" && <Loader2 className="w-4 h-4 text-[#FF6B00] animate-spin" />}
                              {file.status === "ready"   && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                              {file.status === "error"   && <AlertCircle  className="w-4 h-4 text-red-400"   />}
                              <button onClick={() => removeAttachment(file.id)}
                                className="text-[#5A5A7A] hover:text-red-400 transition-colors p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {file.status === "error" && (
                            <p className="text-red-400 text-[11px] mt-1.5 pl-1">{file.error}</p>
                          )}

                          {file.status === "ready" && (
                            <div className="mt-2">
                              <input
                                value={file.description}
                                onChange={(e) => updateAttachDesc(file.id, e.target.value)}
                                placeholder="Mô tả file này dùng để làm gì (VD: Danh sách sản phẩm, FAQ, Chính sách...)"
                                className="w-full bg-[#16161F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-[#5A5A7A] outline-none transition-all"
                              />
                              {file.isText && file.content && (
                                <p className="text-[#5A5A7A] text-[10px] mt-1">
                                  {file.content.length.toLocaleString()} ký tự · AI sẽ đọc và tham khảo nội dung này
                                </p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Info banner */}
                  <div className="mt-4 flex items-start gap-2 bg-blue-500/5 border border-blue-500/15 rounded-xl p-3">
                    <Database className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="text-blue-400 font-medium mb-0.5">Cách hoạt động</p>
                      <p className="text-[#A0A0B0] leading-relaxed">
                        File text (TXT, CSV, JSON...) được đọc và tích hợp trực tiếp vào knowledge base của agent.
                        Khi có người dùng chat, AI sẽ tự động tham khảo nội dung file để trả lời chính xác hơn.
                        Bạn có thể test ngay bên phải →
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo greeting + suggestions */}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-[#FF6B00]" />
                    <h2 className="text-white font-semibold">Lời chào Demo</h2>
                  </div>
                  <p className="text-[#A0A0B0] text-xs mb-3">Tin nhắn đầu tiên agent gửi khi mở demo.</p>
                  <textarea value={form.demoGreeting} onChange={(e) => set("demoGreeting", e.target.value)}
                    placeholder="VD: Xin chào! Tôi là [Tên Agent] 👋 Tôi có thể giúp bạn [mô tả ngắn]. Bạn muốn bắt đầu với điều gì?"
                    rows={3} maxLength={400}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all resize-none"
                  />
                  <p className="text-[#5A5A7A] text-[11px] mt-1 text-right">{form.demoGreeting.length}/400</p>

                  <div className="mt-4">
                    <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Gợi ý câu hỏi (3 câu)</label>
                    {form.demoSuggestions.map((s, i) => (
                      <input key={i} value={s} onChange={(e) => setSuggestion(i, e.target.value)}
                        placeholder={`Gợi ý ${i + 1}: VD: "Làm thế nào để...?"`}
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all mb-2"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Pricing & Bank ─────────────────────────────────── */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-[#FF6B00]" />
                    <h2 className="text-white font-semibold">Định giá Agent</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Giá bán (₫) <span className="text-red-400">*</span></label>
                      <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                        placeholder="VD: 299000" min={10000} step={1000}
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
                      />
                      <p className="text-[#5A5A7A] text-[11px] mt-1">Tối thiểu 10.000₫</p>
                    </div>
                    <div>
                      <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Loại thanh toán</label>
                      <div className="space-y-2">
                        {PRICE_TYPES.map((pt) => (
                          <button key={pt.value} type="button"
                            onClick={() => set("priceType", pt.value as "tháng" | "lần")}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${
                              form.priceType === pt.value
                                ? "bg-[#FF6B00]/10 border-[#FF6B00]/40 text-white"
                                : "border-[#2A2A3A] text-[#A0A0B0] hover:border-[#FF6B00]/30"
                            }`}
                          >{pt.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {priceNum >= 10000 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-4"
                    >
                      <p className="text-[#A0A0B0] text-xs font-medium mb-3">Phân chia mỗi đơn:</p>
                      <div className="space-y-2 mb-3">
                        {[
                          { l: "Giá bán",                    v: `${fmt(priceNum)}₫`,    c: "text-white"      },
                          { l: "Bạn nhận (80%)",             v: `+${fmt(sellerEarns)}₫`, c: "text-green-400" },
                          { l: "Phí platform MonetAI (20%)", v: `-${fmt(monetaiCut)}₫`,  c: "text-[#A0A0B0]" },
                        ].map((r) => (
                          <div key={r.l} className="flex justify-between text-sm">
                            <span className="text-[#A0A0B0]">{r.l}</span>
                            <span className={`font-semibold ${r.c}`}>{r.v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="w-full bg-[#2A2A3A] rounded-full h-2 overflow-hidden">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }} />
                      </div>
                      <div className="flex justify-between text-[11px] mt-1">
                        <span className="text-green-400">Bạn: 80%</span>
                        <span className="text-[#A0A0B0]">MonetAI: 20%</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-4 h-4 text-[#FF6B00]" />
                    <h2 className="text-white font-semibold">Tài khoản nhận tiền</h2>
                  </div>
                  <p className="text-[#A0A0B0] text-xs mb-4">MonetAI chuyển 80% doanh thu về đây trong {PAYOUT_DAYS}.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Ngân hàng <span className="text-red-400">*</span></label>
                      <select value={form.bankName} onChange={(e) => set("bankName", e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Chọn ngân hàng...</option>
                        {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Số tài khoản <span className="text-red-400">*</span></label>
                      <input value={form.bankAccount} onChange={(e) => set("bankAccount", e.target.value.replace(/\D/g, ""))}
                        placeholder="VD: 0971234567"
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Tên chủ tài khoản <span className="text-red-400">*</span></label>
                      <input value={form.bankHolder} onChange={(e) => set("bankHolder", e.target.value.toUpperCase())}
                        placeholder="VD: NGUYEN VAN A"
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all font-mono tracking-wide"
                      />
                      <p className="text-[#5A5A7A] text-[11px] mt-1">Viết hoa, đúng tên trên thẻ ngân hàng</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 bg-[#FF6B00]/5 border border-[#FF6B00]/15 rounded-xl p-3">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <p className="text-[#A0A0B0] text-xs">Thông tin ngân hàng được mã hóa và bảo mật.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Review & Submit ───────────────────────────────── */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-[#FF6B00]" />
                    <h2 className="text-white font-semibold">Xem lại thông tin</h2>
                  </div>
                  <div className="space-y-0">
                    {[
                      ["Tên Agent",         form.agentName],
                      ["Danh mục",          form.category],
                      ["Giá bán",           `${fmt(priceNum)}₫/${form.priceType}`],
                      ["Bạn nhận (80%)",    `${fmt(sellerEarns)}₫/${form.priceType}`],
                      ["Phí MonetAI (20%)", `${fmt(monetaiCut)}₫/${form.priceType}`],
                      ["Ngân hàng",         form.bankName],
                      ["Số TK",             form.bankAccount],
                      ["Chủ TK",            form.bankHolder],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm py-2.5 border-b border-[#2A2A3A] last:border-0">
                        <span className="text-[#A0A0B0]">{label}</span>
                        <span className="text-white font-medium text-right max-w-[55%] break-words">{value || "—"}</span>
                      </div>
                    ))}
                  </div>

                  {/* Attachments summary */}
                  {form.attachments.filter((a) => a.status === "ready").length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#2A2A3A]">
                      <p className="text-[#A0A0B0] text-xs font-medium mb-2 flex items-center gap-1.5">
                        <Paperclip className="w-3 h-3" />
                        {form.attachments.filter((a) => a.status === "ready").length} tài liệu đính kèm
                      </p>
                      <div className="space-y-1.5">
                        {form.attachments.filter((a) => a.status === "ready").map((att) => (
                          <div key={att.id} className="flex items-center gap-2 bg-[#0A0A0F] rounded-lg px-3 py-2">
                            <FileTypeIcon ext={att.ext} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs truncate">{att.name}</p>
                              <p className="text-[#5A5A7A] text-[10px]">{fmtSize(att.size)} · {att.description || "Không có mô tả"}</p>
                            </div>
                            {att.isText && <span className="text-green-400 text-[10px]">✓ Đã đọc</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payout timeline */}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-4">Quy trình thanh toán</h3>
                  <div className="space-y-3">
                    {[
                      { e: "🛒", t: "Khách mua agent",          d: "Thanh toán VietQR → MonetAI nhận" },
                      { e: "✅", t: "Xác nhận trong 24h",       d: "MonetAI xác nhận giao dịch" },
                      { e: "💰", t: `Bạn nhận ${sellerEarns > 0 ? fmt(sellerEarns) + "₫" : "80%"}`, d: `Sau ${PAYOUT_DAYS}, chuyển về ${form.bankName || "tài khoản"} của bạn` },
                    ].map((r, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A] flex items-center justify-center text-base shrink-0">{r.e}</div>
                        <div>
                          <p className="text-white text-sm font-medium">{r.t}</p>
                          <p className="text-[#A0A0B0] text-xs">{r.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-3">Điều khoản bán hàng</h3>
                  <div className="bg-[#0A0A0F] rounded-xl p-4 text-xs text-[#A0A0B0] space-y-2 mb-4 max-h-36 overflow-y-auto leading-relaxed">
                    <p>1. Agent được MonetAI xét duyệt trong 1–3 ngày trước khi xuất hiện trên marketplace.</p>
                    <p>2. MonetAI giữ 20% phí platform. 80% thuộc về bạn.</p>
                    <p>3. Thanh toán sau {PAYOUT_DAYS} ngày làm việc kể từ ngày có giao dịch thành công.</p>
                    <p>4. Agent phải hoạt động đúng mô tả. MonetAI có quyền gỡ agent nếu nhận khiếu nại chính đáng.</p>
                    <p>5. Tài liệu đính kèm không được chứa nội dung vi phạm pháp luật Việt Nam.</p>
                    <p>6. Bạn chịu trách nhiệm về tính chính xác của tài liệu đính kèm.</p>
                    <p>7. Mọi tranh chấp do MonetAI làm trung gian và quyết định cuối cùng là của MonetAI.</p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => set("agreedToTerms", !form.agreedToTerms)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      form.agreedToTerms ? "bg-[#FF6B00] border-[#FF6B00]" : "border-[#2A2A3A] group-hover:border-[#FF6B00]/50"
                    }`}>
                      {form.agreedToTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <p className="text-sm text-[#A0A0B0] group-hover:text-white transition-colors select-none">
                      Tôi đã đọc và đồng ý với <span className="text-[#FF6B00]">Điều khoản bán hàng</span> của MonetAI.
                    </p>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-5">
              {step > 0
                ? <button type="button" onClick={prevStep}
                    className="flex items-center gap-2 border border-[#2A2A3A] text-[#A0A0B0] hover:text-white hover:border-[#FF6B00]/30 px-5 py-2.5 rounded-xl text-sm transition-all"
                  ><ArrowLeft className="w-4 h-4" /> Quay lại</button>
                : <div />
              }
              {step < STEPS.length - 1
                ? <motion.button type="button" onClick={nextStep} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                  >Tiếp theo <ArrowRight className="w-4 h-4" /></motion.button>
                : <motion.button type="button" onClick={handleSubmit}
                    disabled={loading || !form.agreedToTerms} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {loading ? "Đang gửi..." : "Đăng bán Agent"}
                  </motion.button>
              }
            </div>
          </div>

          {/* ── Right column ────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Right column tab switcher */}
            <div className="flex gap-1 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-1">
              {(["preview", "test"] as const).map((t) => (
                <button key={t} onClick={() => setRightTab(t)}
                  className={`flex-1 text-xs py-1.5 rounded-lg transition-all font-medium flex items-center justify-center gap-1.5 ${
                    rightTab === t ? "bg-[#FF6B00] text-white" : "text-[#A0A0B0] hover:text-white"
                  }`}
                >
                  {t === "preview"
                    ? <><Eye className="w-3 h-3" /> Xem trước</>
                    : <><MessageSquare className="w-3 h-3" /> Test Agent</>
                  }
                </button>
              ))}
            </div>

            {rightTab === "preview" && (
              <>
                <PreviewCard f={form} />
                {priceNum >= 10000 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-[#16161F] border border-green-500/20 rounded-2xl p-4"
                  >
                    <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" /> Dự tính thu nhập
                    </p>
                    <div className="space-y-2 text-xs">
                      {[5, 10, 20, 50].map((n) => (
                        <div key={n} className="flex justify-between">
                          <span className="text-[#A0A0B0]">{n} đơn/{form.priceType}</span>
                          <span className="text-green-400 font-semibold">+{fmt(sellerEarns * n)}₫</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4">
                  <p className="text-[#A0A0B0] text-xs font-medium mb-2">💡 Mẹo để bán tốt</p>
                  <ul className="space-y-1.5 text-xs text-[#5A5A7A]">
                    <li>• Tagline nêu rõ lợi ích chính, ngắn gọn</li>
                    <li>• Upload file knowledge base để agent trả lời chính xác hơn</li>
                    <li>• System prompt càng chi tiết, AI càng chuẩn</li>
                    <li>• Giá 99k–499k/tháng bán chạy nhất</li>
                    <li>• Test agent trước khi submit → tab "Test Agent"</li>
                  </ul>
                </div>
              </>
            )}

            {rightTab === "test" && (
              <>
                {form.attachments.filter((a) => a.status === "ready" && a.isText).length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2"
                  >
                    <Database className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-blue-400 text-xs">
                      <strong>{form.attachments.filter((a) => a.status === "ready" && a.isText).length} file</strong> đã được tích hợp vào knowledge base.
                      Agent sẽ tham khảo nội dung này khi trả lời.
                    </p>
                  </motion.div>
                )}
                <TestAgentChat form={form} />
                <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-3">
                  <p className="text-[#5A5A7A] text-[11px] leading-relaxed">
                    <strong className="text-[#A0A0B0]">Lưu ý:</strong> Chat test sử dụng system prompt + file đính kèm hiện tại.
                    Hội thoại này không được lưu.
                  </p>
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
