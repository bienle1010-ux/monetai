"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, ShoppingCart, X, Plus, Copy, Check,
  Eye, EyeOff, FileText, Sparkles, Lock, LogIn,
  Upload, Trash2, ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  prompts as HARDCODED,
  PromptData,
  PromptVar,
  PROMPT_CATEGORIES,
  PROMPT_MODELS,
} from "@/data/prompts";
import {
  RegistryPrompt,
  getPromptRegistry,
  savePromptToRegistry,
  getRegistryPrompt,
  hasPurchasedPrompt,
  addPromptPurchase,
  getPurchasedPrompts,
  promptVietQRUrl,
  removePromptFromRegistry,
} from "@/lib/prompt-registry";

// ─── constants ────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "monetai.vn@gmail.com";
const PINK = "#EC4899";

type Tab = "browse" | "my" | "sell";
type CombinedPrompt = PromptData & Partial<RegistryPrompt>;

// ─── tiny hooks ───────────────────────────────────────────────────────────────
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

// ─── helpers ──────────────────────────────────────────────────────────────────
function fillVars(template: string, vals: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vals[k] ?? `{{${k}}}`);
}
function fmtVnd(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
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

// ─── ModelBadge ───────────────────────────────────────────────────────────────
function ModelBadge({ model }: { model: string }) {
  const map: Record<string, string> = {
    "ChatGPT-4":   "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    "ChatGPT-3.5": "bg-emerald-900/40 text-emerald-400 border-emerald-800",
    Claude:        "bg-violet-900/60  text-violet-300  border-violet-700",
    Midjourney:    "bg-blue-900/60    text-blue-300    border-blue-700",
    Gemini:        "bg-cyan-900/60    text-cyan-300    border-cyan-700",
  };
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[model] ?? "bg-[#2A2A3A] text-[#A0A0B0] border-[#3A3A4A]"}`}>
      {model}
    </span>
  );
}

// ─── BadgeChip ────────────────────────────────────────────────────────────────
function BadgeChip({ badge }: { badge?: string }) {
  if (!badge) return null;
  const colors: Record<string, string> = { HOT: "bg-red-500", MỚI: "bg-blue-500", "BÁN CHẠY": "bg-amber-500" };
  return (
    <span className={`absolute top-3 right-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${colors[badge] ?? "bg-pink-500"}`}>
      {badge}
    </span>
  );
}

// ─── PromptCard ───────────────────────────────────────────────────────────────
function PromptCard({
  p, owned, onBuy, onUse,
}: {
  p: CombinedPrompt;
  owned: boolean;
  onBuy: (p: CombinedPrompt) => void;
  onUse: (p: CombinedPrompt) => void;
}) {
  const [showPrev, setShowPrev] = useState(false);
  const canUse = owned || p.price === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 flex flex-col gap-3 hover:border-pink-500/40 transition-all duration-300"
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(236,72,153,0.1)" }}
    >
      <BadgeChip badge={p.badge} />

      {/* header */}
      <div className="flex items-start gap-3 pr-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600/30 to-purple-600/30 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-pink-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1">{p.name}</h3>
          <ModelBadge model={p.model} />
        </div>
      </div>

      {/* desc */}
      <p className="text-[#A0A0B0] text-xs leading-relaxed line-clamp-2">{p.description}</p>

      {/* tags */}
      <div className="flex flex-wrap gap-1">
        {p.tags?.slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] bg-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{t}</span>
        ))}
      </div>

      {/* preview */}
      {showPrev && (
        <div className="bg-[#0D0D14] rounded-lg p-3 text-[11px] text-[#A0A0B0] leading-relaxed font-mono border border-[#2A2A3A] line-clamp-6">
          {p.preview}
        </div>
      )}
      <button
        onClick={() => setShowPrev(!showPrev)}
        className="text-[11px] text-[#A0A0B0] hover:text-pink-400 transition-colors flex items-center gap-1 self-start"
      >
        {showPrev ? <EyeOff size={12} /> : <Eye size={12} />}
        {showPrev ? "Ẩn xem trước" : "Xem trước prompt"}
      </button>

      {/* footer */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#2A2A3A]">
        <div>
          <Stars rating={p.rating} />
          <p className="text-[10px] text-[#A0A0B0] mt-0.5">{p.sales?.toLocaleString()} lượt mua</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {p.price > 0
            ? <span className="text-pink-400 font-bold text-sm">{fmtVnd(p.price)}</span>
            : <span className="text-emerald-400 font-bold text-sm">Miễn phí</span>}
          {canUse ? (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onUse(p)}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white" style={{ background: PINK }}>
              Dùng ngay
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onBuy(p)}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-[#2A2A3A] text-white hover:bg-[#3A3A4A] flex items-center gap-1">
              <ShoppingCart size={12} /> Mua
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── BuyModal ─────────────────────────────────────────────────────────────────
function BuyModal({ prompt, userEmail, onClose, onSuccess }: {
  prompt: CombinedPrompt;
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"qr" | "confirm" | "done">("qr");
  const [code, setCode] = useState("");
  const [err,  setErr]  = useState("");
  const qrUrl  = promptVietQRUrl(prompt.id, prompt.price);
  const note   = `MONETAI ${prompt.id.slice(-8).toUpperCase()}`;

  function confirm() {
    if (!code.trim()) { setErr("Nhập mã giao dịch để xác nhận."); return; }
    addPromptPurchase(userEmail, prompt.id);
    setStep("done");
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white"><X size={18} /></button>

        {step === "qr" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Mua Prompt</h2>
            <p className="text-[#A0A0B0] text-sm line-clamp-2">{prompt.name}</p>
            <div className="text-center text-3xl font-bold text-pink-400">{fmtVnd(prompt.price)}</div>
            <div className="bg-[#0D0D14] rounded-xl p-4 flex flex-col items-center gap-3 border border-[#2A2A3A]">
              <Image src={qrUrl} alt="VietQR" width={200} height={200} className="rounded-lg" unoptimized />
              <div className="text-xs text-center text-[#A0A0B0] space-y-1">
                <p>MB Bank · 0971166299 · MONET AI</p>
                <p className="font-mono bg-[#2A2A3A] px-3 py-1 rounded text-white">{note}</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep("confirm")}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: PINK }}>
              Tôi đã chuyển khoản →
            </motion.button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Xác nhận thanh toán</h2>
            <p className="text-[#A0A0B0] text-sm">Nhập mã giao dịch (Transaction ID) hoặc 6 số cuối STK của bạn.</p>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: MB2506123456"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500" />
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <motion.button whileTap={{ scale: 0.95 }} onClick={confirm}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: PINK }}>
              Xác nhận kích hoạt
            </motion.button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Kích hoạt thành công!</h2>
            <p className="text-[#A0A0B0] text-sm">Bạn đã mua <strong className="text-white">{prompt.name}</strong>.</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onSuccess}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: PINK }}>
              Dùng prompt ngay →
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── UsePromptModal ───────────────────────────────────────────────────────────
function UsePromptModal({ prompt, onClose }: { prompt: CombinedPrompt; onClose: () => void }) {
  const vars = prompt.variables ?? [];
  const [vals,   setVals]   = useState<Record<string, string>>(() =>
    Object.fromEntries(vars.map((v) => [v.key, ""])));
  const [tab,    setTab]    = useState<"fill" | "preview">("fill");
  const [copied, setCopied] = useState(false);

  const filled       = fillVars(prompt.fullPrompt ?? "", vals);
  const allRequired  = vars.filter((v) => v.required).every((v) => vals[v.key]?.trim());
  const canPreview   = vars.length === 0 || allRequired;

  function doCopy() {
    navigator.clipboard.writeText(filled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2A2A3A]">
          <div>
            <h2 className="font-bold text-white text-base">{prompt.name}</h2>
            <ModelBadge model={prompt.model} />
          </div>
          <button onClick={onClose} className="text-[#A0A0B0] hover:text-white"><X size={18} /></button>
        </div>

        {/* tab bar */}
        <div className="flex border-b border-[#2A2A3A]">
          {(["fill", "preview"] as const).map((t) => (
            <button key={t} onClick={() => { if (t === "preview" && !canPreview) return; setTab(t); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t ? "text-pink-400 border-b-2 border-pink-500" :
                (t === "preview" && !canPreview) ? "text-[#4A4A5A] cursor-not-allowed" : "text-[#A0A0B0] hover:text-white"
              }`}>
              {t === "fill" ? "1. Điền biến" : "2. Xem & Copy"}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "fill" && (
            <>
              {vars.length === 0 ? (
                <div className="text-center py-10 text-[#A0A0B0]">
                  <Sparkles size={32} className="mx-auto mb-3 text-pink-400" />
                  <p>Prompt này không có biến cần điền.</p>
                  <button onClick={() => setTab("preview")}
                    className="mt-4 px-5 py-2 rounded-xl font-semibold text-white text-sm" style={{ background: PINK }}>
                    Xem & Copy ngay →
                  </button>
                </div>
              ) : (
                vars.map((v) => (
                  <div key={v.key} className="space-y-1.5">
                    <label className="text-sm text-white font-medium flex items-center gap-1">
                      {v.label}
                      {v.required && <span className="text-red-400 text-xs">*</span>}
                    </label>
                    {v.placeholder.length > 60 ? (
                      <textarea value={vals[v.key]} rows={3}
                        onChange={(e) => setVals({ ...vals, [v.key]: e.target.value })}
                        placeholder={v.placeholder}
                        className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 resize-none" />
                    ) : (
                      <input value={vals[v.key]}
                        onChange={(e) => setVals({ ...vals, [v.key]: e.target.value })}
                        placeholder={v.placeholder}
                        className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500" />
                    )}
                  </div>
                ))
              )}

              {prompt.instructions && (
                <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 text-xs text-blue-300 space-y-1">
                  <p className="font-semibold text-blue-200">💡 Hướng dẫn sử dụng:</p>
                  <p>{prompt.instructions}</p>
                </div>
              )}

              {vars.length > 0 && (
                <motion.button whileTap={{ scale: 0.95 }}
                  onClick={() => setTab("preview")} disabled={!canPreview}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: PINK }}>
                  Xem prompt hoàn chỉnh →
                </motion.button>
              )}
            </>
          )}

          {tab === "preview" && (
            <>
              <div className="bg-[#0D0D14] rounded-xl p-4 font-mono text-xs text-[#C0C0D0] leading-relaxed border border-[#2A2A3A] whitespace-pre-wrap max-h-80 overflow-y-auto">
                {filled}
              </div>

              {prompt.outputExample && (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-white">Ví dụ kết quả:</p>
                  <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4 text-xs text-emerald-300 whitespace-pre-wrap">
                    {prompt.outputExample}
                  </div>
                </div>
              )}

              <motion.button whileTap={{ scale: 0.95 }} onClick={doCopy}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: copied ? "#10B981" : PINK }}>
                {copied ? <><Check size={16} /> Đã copy!</> : <><Copy size={16} /> Copy Prompt</>}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── SellTab ──────────────────────────────────────────────────────────────────
const SELL_STEPS = ["Thông tin cơ bản", "Nội dung Prompt", "Giá & Xuất bản"];

interface SellForm {
  name: string; description: string; model: string; category: string;
  price: string; tags: string; fullPrompt: string; preview: string;
  variables: PromptVar[]; outputExample: string; instructions: string;
}

const BLANK_FORM: SellForm = {
  name: "", description: "", model: "ChatGPT-4", category: "Marketing",
  price: "49000", tags: "", fullPrompt: "", preview: "",
  variables: [], outputExample: "", instructions: "",
};

function SellTab({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SellForm>(BLANK_FORM);
  const [done, setDone] = useState(false);
  const [publishedName, setPublishedName] = useState("");

  function f(k: keyof SellForm, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  function addVar() {
    setForm((p) => ({ ...p, variables: [...p.variables, { key: "", label: "", placeholder: "", required: true }] }));
  }
  function removeVar(i: number) {
    setForm((p) => ({ ...p, variables: p.variables.filter((_, j) => j !== i) }));
  }
  function setVarField(i: number, field: keyof PromptVar, val: string | boolean) {
    setForm((p) => {
      const vars = [...p.variables];
      (vars[i] as unknown as Record<string, unknown>)[field] = val;
      return { ...p, variables: vars };
    });
  }

  function publish() {
    const id = "prompt-" + Date.now();
    const p: RegistryPrompt = {
      id, name: form.name, description: form.description,
      model: form.model, category: form.category,
      price: Math.max(0, parseInt(form.price) || 0),
      fullPrompt: form.fullPrompt,
      preview: form.preview || form.fullPrompt.slice(0, 180) + "...",
      variables: form.variables,
      sellerEmail: userEmail, sellerName: userName,
      status: "active", publishedAt: new Date().toISOString(),
      sales: 0, rating: 5,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      outputExample: form.outputExample, instructions: form.instructions,
    };
    savePromptToRegistry(p);
    setPublishedName(form.name);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center max-w-md mx-auto">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-white">Prompt đã được đăng!</h2>
        <p className="text-[#A0A0B0]">
          Prompt <strong className="text-white">{publishedName}</strong> đã xuất bản và có thể mua ngay trên Marketplace.
        </p>
        <button onClick={() => { setDone(false); setStep(0); setForm(BLANK_FORM); }}
          className="py-3 px-8 rounded-xl font-semibold text-white" style={{ background: PINK }}>
          Đăng prompt mới
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {SELL_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all ${
              i < step  ? "border-pink-500 bg-pink-500 text-white" :
              i === step ? "border-pink-500 text-pink-400" : "border-[#2A2A3A] text-[#A0A0B0]"}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-pink-400" : "text-[#A0A0B0]"}`}>{s}</span>
            {i < SELL_STEPS.length - 1 && <div className="h-px flex-1 bg-[#2A2A3A]" />}
          </div>
        ))}
      </div>

      {/* Step 0 — basic info */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white font-medium block mb-1">Tên Prompt <span className="text-red-400">*</span></label>
            <input value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="VD: Viral TikTok Hook Generator Pro"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500" />
          </div>
          <div>
            <label className="text-sm text-white font-medium block mb-1">Mô tả ngắn <span className="text-red-400">*</span></label>
            <textarea value={form.description} rows={3} onChange={(e) => f("description", e.target.value)}
              placeholder="Prompt này làm gì, dùng cho ai, kết quả như thế nào..."
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white font-medium block mb-1">AI Model <span className="text-red-400">*</span></label>
              <select value={form.model} onChange={(e) => f("model", e.target.value)}
                className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500">
                {["ChatGPT-4","ChatGPT-3.5","Claude","Midjourney","Gemini"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-white font-medium block mb-1">Danh mục <span className="text-red-400">*</span></label>
              <select value={form.category} onChange={(e) => f("category", e.target.value)}
                className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500">
                {PROMPT_CATEGORIES.filter((c) => c !== "Tất cả").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-white font-medium block mb-1">Tags (cách nhau dấu phẩy)</label>
            <input value={form.tags} onChange={(e) => f("tags", e.target.value)} placeholder="VD: TikTok, Viral, Hook, Marketing"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500" />
          </div>
          <button disabled={!form.name.trim() || !form.description.trim()} onClick={() => setStep(1)}
            className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40" style={{ background: PINK }}>
            Tiếp theo →
          </button>
        </div>
      )}

      {/* Step 1 — prompt content */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white font-medium block mb-1">
              Nội dung Prompt đầy đủ <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-[#A0A0B0] mb-2">Dùng {`{{tên_biến}}`} cho phần cần điền động</p>
            <textarea value={form.fullPrompt} rows={10} onChange={(e) => f("fullPrompt", e.target.value)}
              placeholder={"Bạn là chuyên gia về...\n\nNhiệm vụ: Tạo {{ten_nhiem_vu}} cho {{doi_tuong}}\n..."}
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 resize-none font-mono" />
          </div>

          {/* Variables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Biến trong prompt</span>
              <button onClick={addVar} className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1">
                <Plus size={12} /> Thêm biến
              </button>
            </div>
            {form.variables.length === 0 && (
              <p className="text-xs text-[#A0A0B0]">Nếu prompt có {"{{biến}}"}, thêm định nghĩa để người dùng biết cần điền gì.</p>
            )}
            {form.variables.map((v, i) => (
              <div key={i} className="bg-[#0D0D14] rounded-xl p-3 border border-[#2A2A3A] space-y-2">
                <div className="flex gap-2">
                  <input value={v.key} onChange={(e) => setVarField(i, "key", e.target.value)} placeholder="key (không dấu)"
                    className="flex-1 bg-[#16161F] border border-[#2A2A3A] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-pink-500" />
                  <input value={v.label} onChange={(e) => setVarField(i, "label", e.target.value)} placeholder="Nhãn hiển thị"
                    className="flex-1 bg-[#16161F] border border-[#2A2A3A] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-pink-500" />
                  <button onClick={() => removeVar(i)} className="text-red-400 hover:text-red-300 flex-shrink-0"><Trash2 size={14} /></button>
                </div>
                <input value={v.placeholder} onChange={(e) => setVarField(i, "placeholder", e.target.value)} placeholder="Placeholder / gợi ý cho người dùng"
                  className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-pink-500" />
                <label className="flex items-center gap-2 text-xs text-[#A0A0B0]">
                  <input type="checkbox" checked={v.required} onChange={(e) => setVarField(i, "required", e.target.checked)} className="accent-pink-500" />
                  Bắt buộc
                </label>
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm text-white font-medium block mb-1">Ví dụ kết quả (Output Example)</label>
            <textarea value={form.outputExample} rows={3} onChange={(e) => f("outputExample", e.target.value)}
              placeholder="Dán ví dụ output thực tế từ AI để người mua tin tưởng hơn..."
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 resize-none" />
          </div>
          <div>
            <label className="text-sm text-white font-medium block mb-1">Hướng dẫn sử dụng</label>
            <input value={form.instructions} onChange={(e) => f("instructions", e.target.value)}
              placeholder="VD: Copy → Paste vào ChatGPT-4 → Điền biến → Chạy"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl font-semibold text-[#A0A0B0] border border-[#2A2A3A]">← Quay lại</button>
            <button disabled={!form.fullPrompt.trim()} onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40" style={{ background: PINK }}>
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — price & publish */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white font-medium block mb-1">Giá bán (VNĐ) — nhập 0 để miễn phí</label>
            <input type="number" value={form.price} onChange={(e) => f("price", e.target.value)} placeholder="VD: 49000"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500" />
            <p className="text-xs text-[#A0A0B0] mt-1">MonetAI thu 20% phí nền tảng. Bạn nhận 80%.</p>
          </div>

          {/* Preview card */}
          <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A] space-y-2">
            <p className="text-xs text-[#A0A0B0] font-semibold uppercase tracking-wide">Xem trước card</p>
            <p className="text-white font-semibold">{form.name || "(Chưa có tên)"}</p>
            <p className="text-xs text-[#A0A0B0] line-clamp-2">{form.description || "(Chưa có mô tả)"}</p>
            <div className="flex items-center gap-2">
              <ModelBadge model={form.model} />
              <span className="text-xs bg-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{form.category}</span>
            </div>
            <p className="font-bold" style={{ color: PINK }}>
              {parseInt(form.price) > 0 ? fmtVnd(parseInt(form.price)) : "Miễn phí"}
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-semibold text-[#A0A0B0] border border-[#2A2A3A]">← Quay lại</button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={publish}
              className="flex-1 py-3 rounded-xl font-semibold text-white" style={{ background: PINK }}>
              Xuất bản ngay 🚀
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MyPromptsTab ─────────────────────────────────────────────────────────────
function MyPromptsTab({ userEmail, isAdmin, onUse }: {
  userEmail: string;
  isAdmin: boolean;
  onUse: (p: CombinedPrompt) => void;
}) {
  const [purchased, setPurchased] = useState<CombinedPrompt[]>([]);
  const [published, setPublished] = useState<RegistryPrompt[]>([]);

  function reload() {
    const ids  = getPurchasedPrompts(userEmail);
    const all: CombinedPrompt[] = [
      ...(HARDCODED as CombinedPrompt[]),
      ...Object.values(getPromptRegistry()) as CombinedPrompt[],
    ];
    setPurchased(all.filter((p) => ids.includes(p.id)));
    const reg  = getPromptRegistry();
    setPublished(Object.values(reg).filter((p) => isAdmin || p.sellerEmail === userEmail));
  }

  useEffect(() => { reload(); }, [userEmail, isAdmin]);

  function toggle(id: string) {
    const reg = getPromptRegistry();
    if (!reg[id]) return;
    reg[id].status = reg[id].status === "active" ? "inactive" : "active";
    localStorage.setItem("monetai_prompt_registry", JSON.stringify(reg));
    reload();
  }

  function del(id: string) {
    if (!confirm("Xóa prompt này?")) return;
    removePromptFromRegistry(id);
    reload();
  }

  return (
    <div className="space-y-8">
      {/* Purchased */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShoppingCart size={18} style={{ color: PINK }} /> Prompt đã mua ({purchased.length})
        </h3>
        {purchased.length === 0 ? (
          <p className="text-[#A0A0B0] text-sm">Chưa có prompt nào. Khám phá Marketplace để mua prompt!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchased.map((p) => (
              <div key={p.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(236,72,153,0.15)" }}>
                    <FileText size={14} style={{ color: PINK }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold line-clamp-1">{p.name}</p>
                    <ModelBadge model={p.model} />
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => onUse(p)}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-white" style={{ background: PINK }}>
                  Dùng ngay
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={18} style={{ color: PINK }} /> Prompt đã đăng bán ({published.length})
        </h3>
        {published.length === 0 ? (
          <p className="text-[#A0A0B0] text-sm">Chưa có prompt nào. Đăng bán prompt đầu tiên!</p>
        ) : (
          <div className="space-y-3">
            {published.map((p) => (
              <div key={p.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm line-clamp-1">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <ModelBadge model={p.model} />
                    <span className="text-xs text-[#A0A0B0]">{p.sales} lượt mua</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-emerald-900/40 text-emerald-400" : "bg-[#2A2A3A] text-[#A0A0B0]"}`}>
                      {p.status === "active" ? "Đang bán" : "Ẩn"}
                    </span>
                  </div>
                </div>
                <p className="font-bold text-sm flex-shrink-0" style={{ color: PINK }}>
                  {p.price > 0 ? fmtVnd(p.price) : "Miễn phí"}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => toggle(p.id)} className="text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] rounded-lg px-2.5 py-1.5">
                    {p.status === "active" ? "Ẩn" : "Hiện"}
                  </button>
                  <button onClick={() => del(p.id)} className="text-xs text-red-400 hover:text-red-300 border border-red-900/40 rounded-lg px-2.5 py-1.5">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PromptMarketplacePage() {
  const user    = useUser();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [tab,         setTab]         = useState<Tab>("browse");
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("Tất cả");
  const [modelFilter, setModelFilter] = useState("Tất cả");
  const [sortBy,      setSortBy]      = useState<"popular" | "newest" | "price_asc" | "price_desc">("popular");

  const [buyTarget,  setBuyTarget]  = useState<CombinedPrompt | null>(null);
  const [useTarget,  setUseTarget]  = useState<CombinedPrompt | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [allPrompts,   setAllPrompts]   = useState<CombinedPrompt[]>([]);

  const reload = useCallback(() => {
    const reg = Object.values(getPromptRegistry()) as CombinedPrompt[];
    const hc  = HARDCODED as CombinedPrompt[];
    const regIds = new Set(reg.map((r) => r.id));
    setAllPrompts([...hc.filter((h) => !regIds.has(h.id)), ...reg]);
    if (user?.email) setPurchasedIds(getPurchasedPrompts(user.email));
  }, [user?.email]);

  useEffect(() => { reload(); }, [reload]);

  function canAccess(p: CombinedPrompt) {
    if (isAdmin || p.price === 0) return true;
    return purchasedIds.includes(p.id);
  }

  function handleBuySuccess() {
    if (!buyTarget) return;
    const t = buyTarget;
    setBuyTarget(null);
    reload();
    setPurchasedIds((prev) => [...prev, t.id]);
    setUseTarget(t);
  }

  // filter + sort
  const visible = allPrompts
    .filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.tags?.some((t) => t.toLowerCase().includes(q))) return false;
      if (catFilter   !== "Tất cả" && p.category !== catFilter)   return false;
      if (modelFilter !== "Tất cả" && p.model    !== modelFilter)  return false;
      const reg = getRegistryPrompt(p.id);
      if (reg && reg.status !== "active") return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular")    return (b.sales ?? 0) - (a.sales ?? 0);
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

  const TABS: { key: Tab; label: string }[] = [
    { key: "browse", label: "🔍 Khám phá" },
    { key: "my",     label: "📁 Của tôi"  },
    { key: "sell",   label: "💰 Đăng bán" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* sticky header */}
      <div className="bg-[#111118] border-b border-[#2A2A3A] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: PINK }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Prompt Marketplace</h1>
            </div>
            <p className="text-xs text-[#A0A0B0] mt-0.5">{allPrompts.length}+ prompts AI chất lượng cao</p>
          </div>

          <div className="flex items-center gap-1 bg-[#16161F] rounded-xl p-1 border border-[#2A2A3A]">
            {TABS.map((t) => (
              <button key={t.key}
                onClick={() => { if (!user && t.key !== "browse") return; setTab(t.key); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t.key ? "text-white" : "text-[#A0A0B0] hover:text-white"}`}
                style={tab === t.key ? { background: PINK } : {}}>
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
            {/* search + sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm prompt theo tên, danh mục, AI model..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#16161F] border border-[#2A2A3A] rounded-xl text-white text-sm focus:outline-none focus:border-pink-500" />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-[#16161F] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500">
                <option value="popular">Phổ biến nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp → Cao</option>
                <option value="price_desc">Giá: Cao → Thấp</option>
              </select>
            </div>

            {/* category pills */}
            <div className="flex flex-wrap gap-2">
              {PROMPT_CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    catFilter === c ? "border-pink-500 text-pink-400 bg-pink-500/10" : "border-[#2A2A3A] text-[#A0A0B0] hover:border-pink-500/30"}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* model pills */}
            <div className="flex flex-wrap gap-2">
              {PROMPT_MODELS.map((m) => (
                <button key={m} onClick={() => setModelFilter(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    modelFilter === m ? "border-pink-500 text-pink-400 bg-pink-500/10" : "border-[#2A2A3A] text-[#A0A0B0] hover:border-pink-500/30"}`}>
                  {m}
                </button>
              ))}
            </div>

            <p className="text-sm text-[#A0A0B0]">
              Hiển thị <span className="text-white font-semibold">{visible.length}</span> prompts
              {catFilter   !== "Tất cả" && ` trong "${catFilter}"`}
              {modelFilter !== "Tất cả" && ` cho ${modelFilter}`}
            </p>

            {visible.length === 0 ? (
              <div className="text-center py-20 text-[#A0A0B0]">
                <Search size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-white">Không tìm thấy prompt nào</p>
                <p className="text-sm mt-1">Thử tìm kiếm khác hoặc xóa bộ lọc</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visible.map((p) => (
                  <PromptCard key={p.id} p={p} owned={canAccess(p)}
                    onBuy={(pt) => {
                      if (!user) { alert("Vui lòng đăng nhập để mua prompt."); return; }
                      setBuyTarget(pt);
                    }}
                    onUse={(pt) => {
                      if (!user) { alert("Vui lòng đăng nhập để sử dụng prompt."); return; }
                      setUseTarget(pt);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MY PROMPTS ── */}
        {tab === "my" && (
          user ? (
            <MyPromptsTab userEmail={user.email} isAdmin={isAdmin} onUse={setUseTarget} />
          ) : (
            <div className="text-center py-24 space-y-4">
              <Lock size={48} className="mx-auto" style={{ color: PINK }} />
              <h2 className="text-xl font-bold text-white">Đăng nhập để xem prompt của bạn</h2>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: PINK }}>
                <LogIn size={16} /> Đăng nhập
              </Link>
            </div>
          )
        )}

        {/* ── SELL ── */}
        {tab === "sell" && (
          user ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Đăng bán Prompt</h2>
                <p className="text-[#A0A0B0] text-sm mt-1">Chia sẻ prompt chất lượng và kiếm tiền thụ động trên MonetAI.</p>
              </div>
              <SellTab userEmail={user.email} userName={user.name} />
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <Lock size={48} className="mx-auto" style={{ color: PINK }} />
              <h2 className="text-xl font-bold text-white">Đăng nhập để đăng bán</h2>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: PINK }}>
                <LogIn size={16} /> Đăng nhập
              </Link>
            </div>
          )
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {buyTarget && user && (
          <BuyModal key="buy" prompt={buyTarget} userEmail={user.email} onClose={() => setBuyTarget(null)} onSuccess={handleBuySuccess} />
        )}
        {useTarget && (
          <UsePromptModal key="use" prompt={useTarget} onClose={() => setUseTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
