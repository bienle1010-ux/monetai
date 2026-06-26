"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Copy, CheckCircle, AlertCircle, RefreshCw, Download } from "lucide-react";

export interface ToolField {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  rows?: number;
}

interface Props {
  toolId: string;
  title: string;
  description: string;
  icon: string;
  fields: ToolField[];
  submitLabel?: string;
  apiEndpoint?: string;
}

const BORDER = "#2A2A3A";
const CARD   = "#16161F";
const ORANGE = "#FF6B00";
const MUTED  = "#A0A0B0";
const TEXT   = "#FFFFFF";
const INPUT_BG = "#0D0D16";

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-2">$2</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-4 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-[#A0A0B0]">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[#1A1A2A] text-orange-400 px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="flex gap-2 text-[#A0A0B0] text-sm"><span class="text-[#FF6B00] mt-1">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex gap-2 text-[#A0A0B0] text-sm"><span class="text-[#FF6B00] font-bold min-w-[20px]">$1.</span><span>$2</span></li>')
    .replace(/\n\n/g, '</p><p class="text-[#A0A0B0] text-sm mb-3 leading-relaxed">')
    .replace(/^(?!<[hli])(.+)$/gm, (m) => m.trim() ? `<p class="text-[#A0A0B0] text-sm mb-3 leading-relaxed">${m}</p>` : "");
}

export default function ToolRunner({ toolId, title, description, icon, fields, submitLabel = "Tạo với AI", apiEndpoint = "/api/tools" }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult("");
    setError("");
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, inputs: values }),
      });
      const data = await res.json() as { result?: string; error?: string };
      if (data.error) { setError(data.error); setStatus("error"); return; }
      setResult(data.result ?? "");
      setStatus("done");
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${toolId}-output.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]`;
  const inputSty = { background: INPUT_BG, borderColor: BORDER, color: TEXT } as const;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{icon}</span>
          <h2 className="font-bold text-lg" style={{ color: TEXT }}>{title}</h2>
        </div>
        <p className="text-sm" style={{ color: MUTED }}>{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 flex-1 min-h-0">
        {/* Input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                {f.label}{f.required && <span style={{ color: ORANGE }}> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={values[f.name] ?? ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.rows ?? 4}
                  required={f.required}
                  className={`${inputCls} resize-none`}
                  style={inputSty}
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.name] ?? ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className={inputCls}
                  style={{ ...inputSty, cursor: "pointer" }}
                >
                  <option value="" style={{ background: "#16161F" }}>-- Chọn --</option>
                  {f.options?.map((o) => <option key={o} value={o} style={{ background: "#16161F" }}>{o}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[f.name] ?? ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  className={inputCls}
                  style={inputSty}
                />
              )}
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-60 mt-auto"
            style={{ background: ORANGE, color: "#fff" }}
          >
            {status === "loading" ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Đang tạo...</>
            ) : (
              <><Send className="w-4 h-4" /> {submitLabel}</>
            )}
          </motion.button>
        </form>

        {/* Output */}
        <div className="rounded-xl border flex flex-col min-h-[300px]" style={{ borderColor: BORDER, background: CARD }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Kết quả</span>
            {status === "done" && (
              <div className="flex items-center gap-2">
                <button onClick={download} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: MUTED }} title="Download">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button onClick={copy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-white/5" style={{ color: copied ? "#10B981" : ORANGE }}>
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Đã copy" : "Copy"}
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl block mb-3">✨</span>
                    <p className="text-sm" style={{ color: MUTED }}>Điền thông tin và nhấn "{submitLabel}"</p>
                  </div>
                </motion.div>
              )}
              {status === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" style={{ color: ORANGE }} />
                    <p className="text-sm" style={{ color: MUTED }}>AI đang tạo nội dung...</p>
                  </div>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "#FF000015", border: "1px solid #FF000030" }}>
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}
              {status === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose-output"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .prose-output ul { list-style: none; padding: 0; margin: 0.5rem 0; }
        .prose-output ol { list-style: none; padding: 0; margin: 0.5rem 0; }
        .prose-output h1, .prose-output h2, .prose-output h3 { margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .prose-output p { margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
