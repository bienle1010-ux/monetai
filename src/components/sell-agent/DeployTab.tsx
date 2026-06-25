"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileJson, Rocket, Globe, Copy, Check, ExternalLink, AlertCircle,
  Loader2, Trash2, FileUp, Bot, Tag, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight, Eye,
} from "lucide-react";
import Link from "next/link";
import {
  RegistryAgent, saveToRegistry, getRegistry, removeFromRegistry, REGISTRY_KEY,
} from "@/lib/agent-registry";

interface Props {
  userEmail: string;
  userName:  string;
}

const CATEGORIES = [
  "Bán hàng", "Nội dung", "CSKH", "Marketing", "SEO",
  "E-commerce", "Giáo dục", "HR & Tuyển dụng", "Tài chính", "Khác",
];
const ICON_OPTIONS = ["🤖","🤝","💬","📊","🎯","✍️","📱","🔍","🛒","💰","🚀","⚡","🧠","💡","🔧","📈"];

// Validate a raw parsed JSON object into a RegistryAgent shape
function parseAgentJson(raw: Record<string, unknown>): Partial<RegistryAgent> | string {
  const name = (raw.name ?? raw.agentName ?? "") as string;
  const systemPrompt = (raw.systemPrompt ?? raw.system_prompt ?? "") as string;
  if (!name.trim())         return "Thiếu trường 'name' (tên agent)";
  if (!systemPrompt.trim()) return "Thiếu trường 'systemPrompt'";
  return {
    name:            name.trim(),
    tagline:         ((raw.tagline ?? "") as string).trim(),
    description:     ((raw.description ?? "") as string).trim(),
    category:        (raw.category as string) || "Khác",
    icon:            (raw.icon as string)     || "🤖",
    badge:           (raw.badge as string)    || "",
    price:           Number(raw.price)        || 0,
    priceType:       ((raw.priceType ?? "tháng") as "tháng" | "lần"),
    features:        Array.isArray(raw.features) ? (raw.features as string[]) : [],
    systemPrompt,
    demoGreeting:    ((raw.demoGreeting ?? raw.demo_greeting ?? "") as string).trim(),
    demoSuggestions: Array.isArray(raw.demoSuggestions) ? (raw.demoSuggestions as string[]) : [],
    demoLimit:       Number(raw.demoLimit) || 3,
  };
}

function fmt(n: number): string { return n.toLocaleString("vi-VN"); }

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "https://monetai-iwu9.vercel.app";

export function DeployTab({ userEmail, userName }: Props) {
  const [mode,        setMode]        = useState<"upload" | "quick">("upload");
  const [dragOver,    setDragOver]    = useState(false);
  const [parsed,      setParsed]      = useState<Partial<RegistryAgent> | null>(null);
  const [parseError,  setParseError]  = useState("");
  const [deploying,   setDeploying]   = useState(false);
  const [deployed,    setDeployed]    = useState<RegistryAgent | null>(null);
  const [copied,      setCopied]      = useState(false);
  const [myDeployed,  setMyDeployed]  = useState<RegistryAgent[]>([]);
  const [expanded,    setExpanded]    = useState<string | null>(null);

  // Quick-form state
  const [qName,   setQName]   = useState("");
  const [qPrompt, setQPrompt] = useState("");
  const [qPrice,  setQPrice]  = useState("");
  const [qIcon,   setQIcon]   = useState("🤖");
  const [qCat,    setQCat]    = useState("");
  const [qLimit,  setQLimit]  = useState("3");

  const fileRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(() => {
    const reg = getRegistry();
    setMyDeployed(
      Object.values(reg)
        .filter((a) => a.sellerEmail === userEmail)
        .sort((a, b) => b.deployedAt.localeCompare(a.deployedAt))
    );
  }, [userEmail]);

  useEffect(() => { reload(); }, [reload]);

  // Listen for storage changes
  useEffect(() => {
    const handler = (e: StorageEvent) => { if (e.key === REGISTRY_KEY) reload(); };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [reload]);

  // Handle file
  const handleFile = (file: File) => {
    setParseError("");
    setParsed(null);
    if (!file.name.endsWith(".json")) { setParseError("Chỉ hỗ trợ file .json"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string) as Record<string, unknown>;
        const result = parseAgentJson(raw);
        if (typeof result === "string") { setParseError(result); return; }
        setParsed(result);
        setMode("upload");
      } catch {
        setParseError("File JSON không hợp lệ, kiểm tra lại cú pháp");
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Deploy action
  const deploy = async (partial: Partial<RegistryAgent>) => {
    setDeploying(true);
    await new Promise((r) => setTimeout(r, 900));

    const id = `agent-${Date.now()}`;
    const agent: RegistryAgent = {
      id,
      name:            partial.name            || qName     || "Agent",
      tagline:         partial.tagline         || "",
      description:     partial.description     || "",
      category:        partial.category        || qCat      || "Khác",
      icon:            partial.icon            || qIcon     || "🤖",
      badge:           partial.badge           || "",
      price:           partial.price           ?? (Number(qPrice) || 0),
      priceType:       partial.priceType       || "tháng",
      features:        partial.features        || [],
      systemPrompt:    partial.systemPrompt    || qPrompt,
      demoGreeting:    partial.demoGreeting    || `Xin chào! Tôi là ${partial.name || qName}. Tôi có thể giúp gì cho bạn?`,
      demoSuggestions: partial.demoSuggestions || [],
      attachments:     partial.attachments     || [],
      sellerEmail:     userEmail,
      sellerName:      userName,
      bankName:        partial.bankName        || "",
      bankAccount:     partial.bankAccount     || "",
      bankHolder:      partial.bankHolder      || "",
      status:          "active",
      deployedAt:      new Date().toISOString(),
      demoLimit:       partial.demoLimit       ?? (Number(qLimit) || 3),
      totalSales:      0,
      totalRevenue:    0,
    };

    saveToRegistry(agent);
    setDeployed(agent);
    setDeploying(false);
    reload();
  };

  const handleDeploy = () => {
    if (mode === "upload" && parsed) { deploy(parsed); return; }
    if (!qName.trim())   { setParseError("Nhập tên agent"); return; }
    if (!qPrompt.trim()) { setParseError("Nhập system prompt"); return; }
    setParseError("");
    deploy({});
  };

  const toggleStatus = (agent: RegistryAgent) => {
    const updated: RegistryAgent = {
      ...agent,
      status: agent.status === "active" ? "inactive" : "active",
    };
    saveToRegistry(updated);
    reload();
  };

  const deleteAgent = (id: string) => {
    if (!confirm("Xoá agent này khỏi hệ thống?")) return;
    removeFromRegistry(id);
    reload();
  };

  const copyURL = (url: string) => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const agentURL = (id: string) => `${ORIGIN}/agents/${id}`;

  // ── Success screen ─────────────────────────────────────────────────────────
  if (deployed) {
    const url = agentURL(deployed.id);
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center py-6"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4 text-3xl">
          {deployed.icon}
        </div>
        <h2 className="text-white text-xl font-bold mb-1">Triển khai thành công!</h2>
        <p className="text-[#A0A0B0] text-sm mb-5">Agent của bạn đang chạy trực tiếp trên web.</p>

        <div className="bg-[#16161F] border border-green-500/20 rounded-2xl p-5 mb-5 text-left">
          <p className="text-[#A0A0B0] text-xs font-medium mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-green-400" /> Link trực tiếp
          </p>
          <div className="flex items-center gap-2 bg-[#0A0A0F] rounded-xl px-3 py-2.5 mb-3">
            <code className="text-green-400 text-xs flex-1 truncate">{url}</code>
            <button onClick={() => copyURL(url)}
              className="shrink-0 text-[#5A5A7A] hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-[#0A0A0F] rounded-xl p-2.5 text-center">
              <p className="text-[#A0A0B0]">Demo miễn phí</p>
              <p className="text-white font-bold">{deployed.demoLimit} tin nhắn</p>
            </div>
            <div className="bg-[#0A0A0F] rounded-xl p-2.5 text-center">
              <p className="text-[#A0A0B0]">Giá mua</p>
              <p className="text-white font-bold">{deployed.price > 0 ? fmt(deployed.price) + "₫" : "Miễn phí"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={url}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              target="_blank"
            >
              <Eye className="w-4 h-4" /> Xem trực tiếp
            </Link>
            <button onClick={() => copyURL(url)}
              className="flex items-center gap-2 border border-[#2A2A3A] hover:border-[#FF6B00]/30 text-[#A0A0B0] hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              {copied ? <><Check className="w-4 h-4 text-green-400" /> Đã copy</> : <><Copy className="w-4 h-4" /> Copy link</>}
            </button>
          </div>
        </div>

        <button onClick={() => { setDeployed(null); setParsed(null); setParseError(""); setQName(""); setQPrompt(""); setQPrice(""); }}
          className="text-[#A0A0B0] hover:text-white text-sm transition-colors"
        >
          + Triển khai agent khác
        </button>
      </motion.div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* ── Left: deploy form ────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">

        {/* Mode switcher */}
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-4 h-4 text-[#FF6B00]" />
            <h2 className="text-white font-semibold">Tải lên & Triển khai Agent</h2>
          </div>

          <div className="flex gap-2 mb-5">
            {(["upload", "quick"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setParseError(""); }}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all font-medium ${
                  mode === m
                    ? "bg-[#FF6B00]/10 border-[#FF6B00]/40 text-[#FF6B00]"
                    : "border-[#2A2A3A] text-[#A0A0B0] hover:border-[#FF6B00]/20"
                }`}
              >
                {m === "upload" ? <><FileJson className="w-4 h-4" /> Tải file JSON</> : <><Bot className="w-4 h-4" /> Điền nhanh</>}
              </button>
            ))}
          </div>

          {/* Upload JSON mode */}
          {mode === "upload" && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-[#FF6B00] bg-[#FF6B00]/5 scale-[1.01]"
                    : parsed
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-[#2A2A3A] hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]/3"
                }`}
              >
                <input ref={fileRef} type="file" accept=".json" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />
                {parsed ? (
                  <>
                    <div className="text-3xl mb-2">{parsed.icon || "🤖"}</div>
                    <p className="text-green-400 font-semibold">{parsed.name}</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">{parsed.tagline}</p>
                    <p className="text-green-400 text-xs mt-2">✓ File đọc thành công — sẵn sàng triển khai</p>
                  </>
                ) : (
                  <>
                    <FileUp className="w-10 h-10 mx-auto mb-3 text-[#5A5A7A]" />
                    <p className="text-white font-medium">Kéo thả hoặc <span className="text-[#FF6B00]">chọn file</span></p>
                    <p className="text-[#5A5A7A] text-xs mt-1">File JSON chứa cấu hình AI Agent</p>
                  </>
                )}
              </div>

              {/* JSON format hint */}
              {!parsed && (
                <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-4">
                  <p className="text-[#A0A0B0] text-xs font-mono font-medium mb-2">Định dạng JSON hỗ trợ:</p>
                  <pre className="text-[#5A5A7A] text-[11px] font-mono leading-relaxed overflow-x-auto">{`{
  "name": "Tên Agent",
  "tagline": "Mô tả ngắn",
  "description": "Mô tả đầy đủ",
  "category": "Bán hàng",
  "icon": "🤖",
  "systemPrompt": "Bạn là...",
  "demoGreeting": "Xin chào!",
  "demoSuggestions": ["Q1?", "Q2?"],
  "features": ["Tính năng 1"],
  "price": 299000,
  "priceType": "tháng",
  "demoLimit": 3
}`}</pre>
                </div>
              )}
            </div>
          )}

          {/* Quick form mode */}
          {mode === "quick" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Tên Agent <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  <div className="relative group">
                    <button className="w-11 h-10 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-lg flex items-center justify-center">{qIcon}</button>
                    <div className="absolute left-0 top-11 z-20 bg-[#1A1A28] border border-[#2A2A3A] rounded-xl p-2 grid grid-cols-4 gap-1.5 opacity-0 pointer-events-none group-focus-within:opacity-100 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity shadow-2xl">
                      {ICON_OPTIONS.map((ic) => (
                        <button key={ic} type="button" onClick={() => setQIcon(ic)}
                          className={`w-9 h-9 rounded-lg text-lg hover:bg-[#2A2A3A] transition-colors ${qIcon === ic ? "bg-[#FF6B00]/20" : ""}`}
                        >{ic}</button>
                      ))}
                    </div>
                  </div>
                  <input value={qName} onChange={(e) => setQName(e.target.value)}
                    placeholder="VD: Sales AI Assistant" maxLength={60}
                    className="flex-1 bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">System Prompt <span className="text-red-400">*</span></label>
                <textarea value={qPrompt} onChange={(e) => setQPrompt(e.target.value)}
                  placeholder="Bạn là AI trợ lý chuyên về... Nhiệm vụ: ... Phong cách: thân thiện, chuyên nghiệp."
                  rows={5} maxLength={3000}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Giá (₫)</label>
                  <input type="number" value={qPrice} onChange={(e) => setQPrice(e.target.value)}
                    placeholder="0 = miễn phí" min={0} step={1000}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-white text-sm placeholder:text-[#5A5A7A] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Danh mục</label>
                  <select value={qCat} onChange={(e) => setQCat(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-white text-sm outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Chọn...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Demo (tin nhắn)</label>
                  <input type="number" value={qLimit} onChange={(e) => setQLimit(e.target.value)}
                    min={1} max={10}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-white text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {parseError && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-xs">{parseError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deploy button */}
          <motion.button
            type="button"
            onClick={handleDeploy}
            disabled={deploying || (mode === "upload" && !parsed)}
            whileTap={{ scale: 0.97 }}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {deploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            {deploying ? "Đang triển khai..." : "Tải lên & Triển khai ngay"}
          </motion.button>
        </div>
      </div>

      {/* ── Right: deployed agents list ──────────────────────────── */}
      <div className="space-y-4">
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4">
          <p className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FF6B00]" /> Agents đang chạy
          </p>
          <p className="text-[#5A5A7A] text-xs">{myDeployed.length} agent đã triển khai</p>
        </div>

        {myDeployed.length === 0 && (
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 text-center">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-[#2A2A3A]" />
            <p className="text-[#5A5A7A] text-xs">Chưa có agent nào được triển khai</p>
          </div>
        )}

        {myDeployed.map((agent) => {
          const url = agentURL(agent.id);
          const isExp = expanded === agent.id;
          return (
            <div key={agent.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(isExp ? null : agent.id)}
              >
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${agent.status === "active" ? "bg-green-400 animate-pulse" : "bg-[#5A5A7A]"}`} />
                <div className="text-xl shrink-0">{agent.icon}</div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{agent.name}</p>
                  <p className="text-[#5A5A7A] text-[10px]">{agent.status === "active" ? "Đang hoạt động" : "Tạm dừng"}</p>
                </div>
                {isExp ? <ChevronUp className="w-3.5 h-3.5 text-[#5A5A7A] shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-[#5A5A7A] shrink-0" />}
              </button>

              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 border-t border-[#2A2A3A] pt-2.5 space-y-2">
                      <div className="flex items-center gap-1.5 bg-[#0A0A0F] rounded-lg px-2.5 py-1.5">
                        <code className="text-green-400 text-[10px] flex-1 truncate">{url}</code>
                        <button onClick={() => copyURL(url)} className="text-[#5A5A7A] hover:text-white transition-colors shrink-0">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <Link href={url} target="_blank"
                          className="flex items-center justify-center gap-1.5 text-[11px] bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#FF6B00]/30 text-[#A0A0B0] hover:text-white py-1.5 rounded-lg transition-all"
                        >
                          <ExternalLink className="w-3 h-3" /> Mở
                        </Link>
                        <button onClick={() => toggleStatus(agent)}
                          className="flex items-center justify-center gap-1.5 text-[11px] bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#FF6B00]/30 text-[#A0A0B0] hover:text-white py-1.5 rounded-lg transition-all"
                        >
                          {agent.status === "active"
                            ? <><ToggleLeft className="w-3 h-3" /> Tắt</>
                            : <><ToggleRight className="w-3 h-3 text-green-400" /> Bật</>
                          }
                        </button>
                      </div>

                      <div className="flex justify-between text-[10px] text-[#5A5A7A]">
                        <span>Demo: {agent.demoLimit} tin nhắn</span>
                        <span>{agent.price > 0 ? `Giá: ${fmt(agent.price)}₫` : "Miễn phí"}</span>
                      </div>

                      <button onClick={() => deleteAgent(agent.id)}
                        className="w-full flex items-center justify-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 py-1.5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Xoá agent này
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
