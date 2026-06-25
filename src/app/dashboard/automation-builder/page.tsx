"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow, Search, Zap, X, Check, ChevronRight, Play, Pause,
  Trash2, Plus, ArrowRight, Settings, BarChart2, Clock,
  Copy, Lock, LogIn, AlertCircle, RefreshCw,
} from "lucide-react";
import Image from "next/image";

import {
  automations as ALL_TEMPLATES,
  AutomationTemplate,
  FlowNode,
  AUTOMATION_CATEGORIES,
} from "@/data/automations";
import {
  SavedAutomation,
  getAutomations,
  saveAutomation,
  deleteAutomation,
  toggleAutomation,
  getPurchasedTemplates,
  addTemplatePurchase,
  autoVietQRUrl,
} from "@/lib/automation-registry";

// ─── constants ────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "monetai.vn@gmail.com";
const VIOLET = "#7C3AED";
const VIOLET_LIGHT = "#8B5CF6";

type Tab = "browse" | "my" | "build";
type Difficulty = "Tất cả" | "Dễ" | "Trung bình" | "Nâng cao";

// ─── hooks ────────────────────────────────────────────────────────────────────
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
function fmtVnd(n: number) { return n.toLocaleString("vi-VN") + "₫"; }

function DiffBadge({ diff }: { diff: string }) {
  const cls: Record<string, string> = {
    Dễ:        "bg-emerald-900/40 text-emerald-400 border-emerald-700",
    "Trung bình": "bg-amber-900/40  text-amber-400  border-amber-700",
    "Nâng cao": "bg-red-900/40    text-red-400    border-red-700",
  };
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls[diff] ?? "bg-[#2A2A3A] text-[#A0A0B0] border-[#3A3A4A]"}`}>
      {diff}
    </span>
  );
}

function HotBadge({ badge }: { badge?: string }) {
  if (!badge) return null;
  const c: Record<string, string> = { HOT: "bg-red-500", MỚI: "bg-blue-500", "PHỔ BIẾN": "bg-amber-500" };
  return <span className={`absolute top-3 right-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${c[badge] ?? "bg-violet-500"}`}>{badge}</span>;
}

// ─── FlowPreview ──────────────────────────────────────────────────────────────
function FlowPreview({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
      {nodes.map((n, i) => (
        <div key={n.id} className="flex items-center gap-1 flex-shrink-0">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base border"
              style={{ background: n.color + "20", borderColor: n.color + "40" }}>
              {n.icon}
            </div>
            <span className="text-[9px] text-[#A0A0B0] text-center leading-tight max-w-[64px] line-clamp-2">{n.label}</span>
          </div>
          {i < nodes.length - 1 && <ArrowRight size={10} className="text-[#3A3A4A] flex-shrink-0 -mt-4" />}
        </div>
      ))}
    </div>
  );
}

// ─── TemplateCard ─────────────────────────────────────────────────────────────
function TemplateCard({ t, owned, onBuy, onUse }: {
  t: AutomationTemplate;
  owned: boolean;
  onBuy: (t: AutomationTemplate) => void;
  onUse: (t: AutomationTemplate) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const canUse = owned || t.price === 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 flex flex-col gap-3 hover:border-violet-500/40 transition-all duration-300"
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(124,58,237,0.12)" }}>
      <HotBadge badge={t.badge} />

      {/* Header */}
      <div className="flex items-start gap-3 pr-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ background: VIOLET + "20" }}>
          {t.nodes[0]?.icon ?? "⚡"}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1 mb-1">{t.name}</h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <DiffBadge diff={t.difficulty} />
            <span className="text-[10px] text-[#A0A0B0]">{t.category}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#A0A0B0] text-xs leading-relaxed line-clamp-2">{t.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[11px] text-[#A0A0B0]">
        <span className="flex items-center gap-1"><Clock size={11} /> {t.estimatedSetupMinutes}' cài đặt</span>
        <span className="flex items-center gap-1"><Zap size={11} className="text-amber-400" /> Tiết kiệm {t.savesHoursPerWeek}h/tuần</span>
      </div>

      {/* Platforms */}
      <div className="flex flex-wrap gap-1">
        {t.platforms.slice(0, 4).map((p) => (
          <span key={p} className="text-[10px] bg-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{p}</span>
        ))}
      </div>

      {/* Flow preview toggle */}
      <button onClick={() => setExpanded(!expanded)}
        className="text-[11px] text-[#A0A0B0] hover:text-violet-400 transition-colors flex items-center gap-1 self-start">
        <Workflow size={11} /> {expanded ? "Ẩn flow" : "Xem flow preview"}
      </button>
      {expanded && <FlowPreview nodes={t.nodes} />}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#2A2A3A]">
        <div>
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            {"★".repeat(Math.round(t.rating))}
            <span className="text-[#A0A0B0] ml-1">{t.rating.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-[#A0A0B0]">{t.useCount.toLocaleString()} lượt dùng</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {t.price > 0
            ? <span className="font-bold text-sm" style={{ color: VIOLET_LIGHT }}>{fmtVnd(t.price)}</span>
            : <span className="text-emerald-400 font-bold text-sm">Miễn phí</span>}
          {canUse ? (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onUse(t)}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1"
              style={{ background: VIOLET }}>
              <Settings size={11} /> Cài đặt
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onBuy(t)}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-[#2A2A3A] text-white hover:bg-[#3A3A4A] flex items-center gap-1">
              <Zap size={11} /> Mua
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── BuyModal ─────────────────────────────────────────────────────────────────
function BuyModal({ t, userEmail, onClose, onSuccess }: {
  t: AutomationTemplate; userEmail: string;
  onClose: () => void; onSuccess: () => void;
}) {
  const [step, setStep] = useState<"qr" | "confirm" | "done">("qr");
  const [code, setCode] = useState("");
  const [err,  setErr]  = useState("");
  const qrUrl = autoVietQRUrl(t.id, t.price);
  const note  = `MONETAI ${t.id.slice(-8).toUpperCase()}`;

  function confirm() {
    if (!code.trim()) { setErr("Nhập mã giao dịch để xác nhận."); return; }
    addTemplatePurchase(userEmail, t.id);
    setStep("done");
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white"><X size={18} /></button>

        {step === "qr" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Mua Template</h2>
            <p className="text-[#A0A0B0] text-sm">{t.name}</p>
            <div className="text-center text-3xl font-bold" style={{ color: VIOLET_LIGHT }}>{fmtVnd(t.price)}</div>
            <div className="bg-[#0D0D14] rounded-xl p-4 flex flex-col items-center gap-3 border border-[#2A2A3A]">
              <Image src={qrUrl} alt="VietQR" width={200} height={200} className="rounded-lg" unoptimized />
              <div className="text-xs text-center text-[#A0A0B0] space-y-1">
                <p>MB Bank · 0971166299 · MONET AI</p>
                <p className="font-mono bg-[#2A2A3A] px-3 py-1 rounded text-white">{note}</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep("confirm")}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
              Tôi đã chuyển khoản →
            </motion.button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Xác nhận thanh toán</h2>
            <p className="text-[#A0A0B0] text-sm">Nhập mã giao dịch (Transaction ID) hoặc 6 số cuối STK.</p>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: MB2506123456"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500" />
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <motion.button whileTap={{ scale: 0.95 }} onClick={confirm}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
              Xác nhận kích hoạt
            </motion.button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Kích hoạt thành công!</h2>
            <p className="text-[#A0A0B0] text-sm">Bạn đã mua template <strong className="text-white">{t.name}</strong>.</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onSuccess}
              className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
              Cài đặt ngay →
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── ConfigModal ──────────────────────────────────────────────────────────────
function ConfigModal({ t, userEmail, onClose, onDeployed }: {
  t: AutomationTemplate; userEmail: string;
  onClose: () => void; onDeployed: () => void;
}) {
  const [vals,    setVals]    = useState<Record<string, string>>({});
  const [step,    setStep]    = useState<"config" | "preview" | "done">("config");
  const [copying, setCopying] = useState(false);

  function setVal(k: string, v: string) { setVals((p) => ({ ...p, [k]: v })); }

  const allRequired = t.configFields.filter((f) => f.required).every((f) => vals[f.key]?.trim());

  function deploy() {
    const a: SavedAutomation = {
      id:            "auto-" + Date.now(),
      templateId:    t.id,
      name:          vals["business_name"] || vals["company_name"] || vals["store_name"] || vals["brand_name"] || t.name,
      category:      t.category,
      config:        vals,
      status:        "active",
      createdAt:     new Date().toISOString(),
      ownerEmail:    userEmail,
      runsTotal:     0,
      runsToday:     0,
      savedHours:    0,
      savesHoursPerWeek: t.savesHoursPerWeek,
    };
    saveAutomation(a);
    setStep("done");
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2A2A3A]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                style={{ background: VIOLET + "30" }}>{t.nodes[0]?.icon}</div>
              <h2 className="font-bold text-white">{t.name}</h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <DiffBadge diff={t.difficulty} />
              <span className="text-xs text-[#A0A0B0]">~{t.estimatedSetupMinutes}' để cài đặt</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#A0A0B0] hover:text-white"><X size={18} /></button>
        </div>

        {/* Tab bar */}
        {step !== "done" && (
          <div className="flex border-b border-[#2A2A3A]">
            {(["config", "preview"] as const).map((s) => (
              <button key={s} onClick={() => { if (s === "preview" && !allRequired) return; setStep(s); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  step === s ? "border-b-2 border-violet-500 text-violet-400" :
                  (s === "preview" && !allRequired) ? "text-[#3A3A4A] cursor-not-allowed" : "text-[#A0A0B0]"}`}>
                {s === "config" ? "1. Cấu hình" : "2. Xem flow & Deploy"}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* CONFIG STEP */}
          {step === "config" && (
            <>
              <p className="text-[#A0A0B0] text-sm">{t.longDescription}</p>

              {t.configFields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-sm text-white font-medium flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-400 text-xs">*</span>}
                  </label>
                  {field.hint && <p className="text-xs text-[#A0A0B0]">💡 {field.hint}</p>}

                  {field.type === "textarea" && (
                    <textarea value={vals[field.key] ?? ""} rows={4}
                      onChange={(e) => setVal(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
                  )}
                  {field.type === "select" && (
                    <select value={vals[field.key] ?? ""} onChange={(e) => setVal(field.key, e.target.value)}
                      className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                      <option value="">-- Chọn --</option>
                      {field.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  )}
                  {field.type === "toggle" && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setVal(field.key, vals[field.key] === "true" ? "false" : "true")}
                        className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${vals[field.key] === "true" ? "bg-violet-600" : "bg-[#2A2A3A]"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${vals[field.key] === "true" ? "translate-x-5" : "translate-x-0"}`} />
                      </div>
                      <span className="text-sm text-[#A0A0B0]">{vals[field.key] === "true" ? "Bật" : "Tắt"}</span>
                    </label>
                  )}
                  {(field.type === "text" || field.type === "email" || field.type === "number") && (
                    <input type={field.type} value={vals[field.key] ?? ""}
                      onChange={(e) => setVal(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
                  )}
                </div>
              ))}

              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => setStep("preview")} disabled={!allRequired}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: VIOLET }}>
                Xem flow trước khi deploy →
              </motion.button>
            </>
          )}

          {/* PREVIEW STEP */}
          {step === "preview" && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Flow automation của bạn:</p>
                <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A]">
                  <div className="flex flex-col gap-3">
                    {t.nodes.map((n, i) => (
                      <div key={n.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base border"
                            style={{ background: n.color + "20", borderColor: n.color + "50" }}>
                            {n.icon}
                          </div>
                          {i < t.nodes.length - 1 && <div className="w-px h-4 bg-[#2A2A3A]" />}
                        </div>
                        <div className="min-w-0 pb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${
                            n.type === "trigger" ? "text-violet-400" :
                            n.type === "action"  ? "text-blue-400" :
                            n.type === "condition" ? "text-amber-400" :
                            n.type === "delay"   ? "text-gray-400" : "text-emerald-400"}`}>
                            {n.type === "trigger" ? "Trigger" : n.type === "condition" ? "Điều kiện" :
                             n.type === "delay" ? "Chờ" : n.type === "end" ? "Kết quả" : "Hành động"}
                          </span>
                          <p className="text-white text-sm font-medium">{n.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Config summary */}
              <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A] space-y-2">
                <p className="text-xs font-semibold text-[#A0A0B0] uppercase tracking-wide">Cấu hình của bạn:</p>
                {t.configFields.filter((f) => vals[f.key]).map((f) => (
                  <div key={f.key} className="flex gap-2 text-xs">
                    <span className="text-[#A0A0B0] flex-shrink-0">{f.label}:</span>
                    <span className="text-white line-clamp-1">{vals[f.key]}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-3 flex gap-2 text-xs text-amber-300">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>Automation sẽ được kích hoạt ngay sau khi deploy. Bạn có thể tạm dừng bất lúc nào trong tab "Của tôi".</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("config")}
                  className="flex-1 py-3 rounded-xl font-semibold text-[#A0A0B0] border border-[#2A2A3A]">
                  ← Chỉnh sửa
                </button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={deploy}
                  className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: VIOLET }}>
                  <Zap size={16} /> Deploy ngay!
                </motion.button>
              </div>
            </>
          )}

          {/* DONE STEP */}
          {step === "done" && (
            <div className="text-center space-y-5 py-6">
              <div className="text-6xl">🚀</div>
              <h2 className="text-2xl font-bold text-white">Automation đang chạy!</h2>
              <p className="text-[#A0A0B0]">
                <strong className="text-white">{t.name}</strong> đã được deploy thành công và đang hoạt động.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Tiết kiệm/tuần", value: `${t.savesHoursPerWeek}h` },
                  { label: "Cài đặt mất", value: `${t.estimatedSetupMinutes}'` },
                  { label: "Trạng thái", value: "🟢 Active" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0D0D14] rounded-xl p-3 border border-[#2A2A3A] text-center">
                    <p className="text-white font-bold text-lg">{s.value}</p>
                    <p className="text-[10px] text-[#A0A0B0] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={onDeployed}
                className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
                Xem tất cả automations →
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── MyAutomationsTab ─────────────────────────────────────────────────────────
function MyAutomationsTab({ email }: { email: string }) {
  const [list, setList] = useState<SavedAutomation[]>([]);
  const [tick, setTick] = useState(0);

  function reload() { setList(getAutomations(email)); }
  useEffect(() => { reload(); }, [email, tick]);

  function toggle(id: string) { toggleAutomation(id); reload(); }
  function del(id: string) { if (!confirm("Xóa automation này?")) return; deleteAutomation(id); reload(); }

  const totalHours = list.filter((a) => a.status === "active").reduce((s, a) => s + a.savesHoursPerWeek, 0);
  const active     = list.filter((a) => a.status === "active").length;

  if (list.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-5xl">⚡</div>
        <h3 className="text-xl font-bold text-white">Chưa có automation nào</h3>
        <p className="text-[#A0A0B0] text-sm">Chọn template trong tab "Khám phá" và deploy để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Flows đang chạy",    value: active },
          { label: "Tổng flows",          value: list.length },
          { label: "Tiết kiệm giờ/tuần", value: `${totalHours}h` },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 text-center">
            <p className="text-white font-bold text-2xl">{s.value}</p>
            <p className="text-[#A0A0B0] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.map((a) => {
          const tpl = ALL_TEMPLATES.find((t) => t.id === a.templateId);
          return (
            <div key={a.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: VIOLET + "20" }}>
                    {tpl?.nodes[0]?.icon ?? "⚡"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm line-clamp-1">{a.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-[#A0A0B0]">{a.category}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        a.status === "active" ? "bg-emerald-900/40 text-emerald-400" :
                        a.status === "error"  ? "bg-red-900/40 text-red-400" :
                        "bg-[#2A2A3A] text-[#A0A0B0]"}`}>
                        {a.status === "active" ? "🟢 Active" : a.status === "error" ? "🔴 Error" : "⏸ Paused"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center mr-2 hidden sm:block">
                    <p className="text-white font-bold text-sm">{a.savesHoursPerWeek}h</p>
                    <p className="text-[10px] text-[#A0A0B0]">saved/week</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggle(a.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#2A2A3A] text-[#A0A0B0] hover:text-white">
                    {a.status === "active" ? <><Pause size={12} /> Tạm dừng</> : <><Play size={12} /> Bật lại</>}
                  </motion.button>
                  <button onClick={() => del(a.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-900/20 border border-red-900/30">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Config summary */}
              <div className="mt-3 pt-3 border-t border-[#2A2A3A] flex flex-wrap gap-3">
                {Object.entries(a.config).slice(0, 3).map(([k, v]) => {
                  const field = tpl?.configFields.find((f) => f.key === k);
                  if (!field || !v) return null;
                  return (
                    <div key={k} className="text-xs">
                      <span className="text-[#A0A0B0]">{field.label}: </span>
                      <span className="text-white">{v.length > 30 ? v.slice(0, 30) + "…" : v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BuildTab — custom automation wizard ──────────────────────────────────────
const TRIGGERS = [
  { id: "message",  label: "Tin nhắn mới",       icon: "💬", desc: "Messenger, Zalo, Website chat" },
  { id: "form",     label: "Form được điền",      icon: "📋", desc: "Lead form, contact form, signup" },
  { id: "schedule", label: "Lịch cố định",        icon: "📅", desc: "Hàng ngày, hàng tuần, hàng tháng" },
  { id: "webhook",  label: "Webhook / API",       icon: "🔗", desc: "Khi hệ thống khác gọi API" },
  { id: "purchase", label: "Đơn hàng mới",        icon: "🛒", desc: "Shopify, WooCommerce, Haravan" },
  { id: "email",    label: "Email nhận được",     icon: "📧", desc: "Gmail, Outlook inbox trigger" },
];

const ACTIONS = [
  { id: "send_message",  label: "Gửi tin nhắn",     icon: "💬" },
  { id: "send_email",    label: "Gửi email",         icon: "📧" },
  { id: "add_crm",       label: "Thêm vào CRM",      icon: "👤" },
  { id: "notify_slack",  label: "Thông báo Slack",   icon: "🔔" },
  { id: "wait_delay",    label: "Chờ (delay)",       icon: "⏰" },
  { id: "ai_response",   label: "AI tạo nội dung",   icon: "🤖" },
  { id: "add_tag",       label: "Gắn tag khách hàng", icon: "🏷️" },
  { id: "http_request",  label: "Gọi HTTP request",  icon: "🌐" },
];

interface BuildState {
  name:     string;
  trigger:  string;
  actions:  string[];
  schedule: string;
}

function BuildTab({ userEmail, onDeployed }: { userEmail: string; onDeployed: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BuildState>({ name: "", trigger: "", actions: [], schedule: "daily" });
  const [done, setDone] = useState(false);

  function toggleAction(id: string) {
    setForm((p) => ({
      ...p,
      actions: p.actions.includes(id) ? p.actions.filter((a) => a !== id) : [...p.actions, id],
    }));
  }

  function deployCustom() {
    const trigger = TRIGGERS.find((t) => t.id === form.trigger);
    const actions = form.actions.map((id) => ACTIONS.find((a) => a.id === id)!);
    const a: SavedAutomation = {
      id:                "auto-custom-" + Date.now(),
      templateId:        "custom",
      name:              form.name || "Automation tùy chỉnh",
      category:          "Custom",
      config:            { trigger: form.trigger, actions: form.actions.join(","), schedule: form.schedule },
      status:            "active",
      createdAt:         new Date().toISOString(),
      ownerEmail:        userEmail,
      runsTotal:         0,
      runsToday:         0,
      savedHours:        0,
      savesHoursPerWeek: form.actions.length * 2,
    };
    saveAutomation(a);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center max-w-md mx-auto">
        <div className="text-6xl">🚀</div>
        <h2 className="text-2xl font-bold text-white">Automation đã chạy!</h2>
        <p className="text-[#A0A0B0]">
          <strong className="text-white">{form.name || "Automation tùy chỉnh"}</strong> đã được tạo và kích hoạt.
        </p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onDeployed}
          className="py-3 px-8 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
          Xem tất cả automations
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-white">Tự xây dựng Automation</h2>
        <p className="text-[#A0A0B0] text-sm mt-1">Không cần code — chọn trigger và action, deploy ngay.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {["Trigger", "Actions", "Deploy"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
              i < step ? "border-violet-500 bg-violet-500 text-white" :
              i === step ? "border-violet-500 text-violet-400" : "border-[#2A2A3A] text-[#A0A0B0]"}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-violet-400" : "text-[#A0A0B0]"}`}>{s}</span>
            {i < 2 && <div className="h-px flex-1 bg-[#2A2A3A]" />}
          </div>
        ))}
      </div>

      {/* Step 0 — Trigger */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white font-medium block mb-1">Tên automation</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="VD: Chatbot bán hàng shop ABC"
              className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
          <p className="text-sm text-white font-medium">Chọn Trigger (khi nào automation chạy?) <span className="text-red-400">*</span></p>
          <div className="grid grid-cols-2 gap-3">
            {TRIGGERS.map((tr) => (
              <button key={tr.id} onClick={() => setForm((p) => ({ ...p, trigger: tr.id }))}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  form.trigger === tr.id ? "border-violet-500 bg-violet-500/10" : "border-[#2A2A3A] hover:border-violet-500/40"}`}>
                <span className="text-2xl flex-shrink-0">{tr.icon}</span>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">{tr.label}</p>
                  <p className="text-[#A0A0B0] text-xs mt-0.5 line-clamp-2">{tr.desc}</p>
                </div>
                {form.trigger === tr.id && <Check size={14} className="text-violet-400 flex-shrink-0 ml-auto" />}
              </button>
            ))}
          </div>
          {form.trigger === "schedule" && (
            <div>
              <label className="text-sm text-white font-medium block mb-1">Tần suất</label>
              <select value={form.schedule} onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))}
                className="w-full bg-[#0D0D14] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                <option value="hourly">Mỗi giờ</option>
                <option value="daily">Mỗi ngày</option>
                <option value="weekly">Mỗi tuần</option>
                <option value="monthly">Mỗi tháng</option>
              </select>
            </div>
          )}
          <button disabled={!form.trigger} onClick={() => setStep(1)}
            className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40" style={{ background: VIOLET }}>
            Tiếp theo →
          </button>
        </div>
      )}

      {/* Step 1 — Actions */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-white font-medium">Chọn Actions (automation sẽ làm gì?) <span className="text-red-400">*</span></p>
          <p className="text-xs text-[#A0A0B0]">Chọn nhiều action — chúng sẽ chạy tuần tự.</p>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map((ac) => (
              <button key={ac.id} onClick={() => toggleAction(ac.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  form.actions.includes(ac.id) ? "border-violet-500 bg-violet-500/10" : "border-[#2A2A3A] hover:border-violet-500/40"}`}>
                <span className="text-xl">{ac.icon}</span>
                <span className="text-white text-sm font-medium">{ac.label}</span>
                {form.actions.includes(ac.id) && <Check size={13} className="text-violet-400 ml-auto" />}
              </button>
            ))}
          </div>

          {/* Flow preview */}
          {form.actions.length > 0 && (
            <div className="bg-[#0D0D14] rounded-xl p-4 border border-[#2A2A3A]">
              <p className="text-xs text-[#A0A0B0] mb-2 font-semibold">Flow preview:</p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs bg-violet-900/30 text-violet-300 px-2 py-1 rounded-lg border border-violet-700/30">
                  {TRIGGERS.find((t) => t.id === form.trigger)?.icon} {TRIGGERS.find((t) => t.id === form.trigger)?.label}
                </div>
                {form.actions.map((id) => {
                  const a = ACTIONS.find((a) => a.id === id);
                  return a ? (
                    <div key={id} className="flex items-center gap-1">
                      <ArrowRight size={12} className="text-[#3A3A4A]" />
                      <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded-lg border border-blue-700/30">
                        {a.icon} {a.label}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl font-semibold text-[#A0A0B0] border border-[#2A2A3A]">← Quay lại</button>
            <button disabled={form.actions.length === 0} onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40" style={{ background: VIOLET }}>
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Deploy */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-[#0D0D14] rounded-xl p-5 border border-[#2A2A3A] space-y-3">
            <p className="text-xs text-[#A0A0B0] font-semibold uppercase tracking-wide">Tóm tắt automation</p>
            <p className="text-white font-bold text-lg">{form.name || "Automation tùy chỉnh"}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-violet-900/30 text-violet-300 px-3 py-1 rounded-full border border-violet-700/30">
                Trigger: {TRIGGERS.find((t) => t.id === form.trigger)?.label}
              </span>
              <span className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full border border-blue-700/30">
                {form.actions.length} Actions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.actions.map((id) => {
                const a = ACTIONS.find((a) => a.id === id);
                return a ? (
                  <span key={id} className="text-xs bg-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">
                    {a.icon} {a.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-3 flex gap-2 text-xs text-amber-300">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>Automation custom sẽ active ngay. Bạn có thể tạm dừng hoặc xóa bất lúc nào.</span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-semibold text-[#A0A0B0] border border-[#2A2A3A]">← Quay lại</button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={deployCustom}
              className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{ background: VIOLET }}>
              <Zap size={16} /> Deploy ngay!
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AutomationBuilderPage() {
  const user    = useUser();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [tab,        setTab]        = useState<Tab>("browse");
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("Tất cả");
  const [diffFilter, setDiffFilter] = useState<Difficulty>("Tất cả");
  const [buyTarget,  setBuyTarget]  = useState<AutomationTemplate | null>(null);
  const [cfgTarget,  setCfgTarget]  = useState<AutomationTemplate | null>(null);
  const [purchased,  setPurchased]  = useState<string[]>([]);
  const [myCount,    setMyCount]    = useState(0);

  useEffect(() => {
    if (user?.email) {
      setPurchased(getPurchasedTemplates(user.email));
      setMyCount(getAutomations(user.email).length);
    }
  }, [user?.email]);

  function canAccess(t: AutomationTemplate) {
    return isAdmin || t.price === 0 || purchased.includes(t.id);
  }

  const visible = ALL_TEMPLATES.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase()) &&
        !t.tags.some((tg) => tg.toLowerCase().includes(search.toLowerCase()))) return false;
    if (catFilter  !== "Tất cả" && t.category   !== catFilter)  return false;
    if (diffFilter !== "Tất cả" && t.difficulty !== diffFilter) return false;
    return true;
  }).sort((a, b) => b.useCount - a.useCount);

  const TABS: { key: Tab; label: string }[] = [
    { key: "browse", label: "🔍 Template"   },
    { key: "my",     label: `⚡ Của tôi${myCount > 0 ? ` (${myCount})` : ""}` },
    { key: "build",  label: "🛠️ Tự xây"    },
  ];

  function handleDeployed() {
    if (user?.email) setMyCount(getAutomations(user.email).length);
    setCfgTarget(null);
    setTab("my");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Sticky header */}
      <div className="bg-[#111118] border-b border-[#2A2A3A] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: VIOLET }}>
                <Workflow size={14} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">AI Automation Builder</h1>
            </div>
            <p className="text-xs text-[#A0A0B0] mt-0.5">Tự động hóa không cần code — {ALL_TEMPLATES.length} template sẵn sàng</p>
          </div>

          <div className="flex items-center gap-1 bg-[#16161F] rounded-xl p-1 border border-[#2A2A3A]">
            {TABS.map((t) => (
              <button key={t.key}
                onClick={() => { if (!user && t.key !== "browse") return; setTab(t.key); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "text-white" : "text-[#A0A0B0] hover:text-white"}`}
                style={tab === t.key ? { background: VIOLET } : {}}>
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
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm automation theo tên, danh mục, platform..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#16161F] border border-[#2A2A3A] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {AUTOMATION_CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${catFilter === c ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-[#2A2A3A] text-[#A0A0B0] hover:border-violet-500/30"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["Tất cả","Dễ","Trung bình","Nâng cao"] as Difficulty[]).map((d) => (
                <button key={d} onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${diffFilter === d ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-[#2A2A3A] text-[#A0A0B0] hover:border-violet-500/30"}`}>
                  {d}
                </button>
              ))}
            </div>

            <p className="text-sm text-[#A0A0B0]">
              Hiển thị <span className="text-white font-semibold">{visible.length}</span> templates
            </p>

            {visible.length === 0 ? (
              <div className="text-center py-20 text-[#A0A0B0]">
                <Search size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-white">Không tìm thấy template nào</p>
                <p className="text-sm mt-1">Thử tìm kiếm khác hoặc dùng "Tự xây" để tạo từ đầu</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map((t) => (
                  <TemplateCard key={t.id} t={t} owned={canAccess(t)}
                    onBuy={(tpl) => { if (!user) { alert("Vui lòng đăng nhập."); return; } setBuyTarget(tpl); }}
                    onUse={(tpl) => { if (!user) { alert("Vui lòng đăng nhập."); return; } setCfgTarget(tpl); }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MY AUTOMATIONS ── */}
        {tab === "my" && (
          user
            ? <MyAutomationsTab email={user.email} />
            : (
              <div className="text-center py-24 space-y-4">
                <Lock size={48} className="mx-auto" style={{ color: VIOLET }} />
                <h2 className="text-xl font-bold text-white">Đăng nhập để xem automations</h2>
                <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
                  <LogIn size={16} /> Đăng nhập
                </a>
              </div>
            )
        )}

        {/* ── BUILD ── */}
        {tab === "build" && (
          user
            ? <BuildTab userEmail={user.email} onDeployed={handleDeployed} />
            : (
              <div className="text-center py-24 space-y-4">
                <Lock size={48} className="mx-auto" style={{ color: VIOLET }} />
                <h2 className="text-xl font-bold text-white">Đăng nhập để tạo automation</h2>
                <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: VIOLET }}>
                  <LogIn size={16} /> Đăng nhập
                </a>
              </div>
            )
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {buyTarget && user && (
          <BuyModal key="buy" t={buyTarget} userEmail={user.email} onClose={() => setBuyTarget(null)}
            onSuccess={() => { setPurchased((p) => [...p, buyTarget.id]); setBuyTarget(null); setCfgTarget(buyTarget); }} />
        )}
        {cfgTarget && user && (
          <ConfigModal key="cfg" t={cfgTarget} userEmail={user.email}
            onClose={() => setCfgTarget(null)} onDeployed={handleDeployed} />
        )}
      </AnimatePresence>
    </div>
  );
}
