"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Download, RefreshCw, AlertCircle } from "lucide-react";

interface Props {
  toolId: string;
  title: string;
  description: string;
  icon: string;
  promptLabel?: string;
  promptPlaceholder?: string;
  styleOptions?: string[];
  defaultSize?: "1024x1024" | "1792x1024" | "1024x1792";
}

const BORDER  = "#2A2A3A";
const CARD    = "#16161F";
const ORANGE  = "#FF6B00";
const MUTED   = "#A0A0B0";
const TEXT    = "#FFFFFF";
const INPUT_BG = "#0D0D16";

export default function ImageToolRunner({
  title, description, icon,
  promptLabel = "Mô tả hình ảnh",
  promptPlaceholder = "Mô tả chi tiết hình ảnh bạn muốn tạo...",
  styleOptions = ["Professional", "Minimalist", "Vibrant", "Dark", "Flat", "3D", "Illustrated", "Photo-realistic"],
  defaultSize = "1024x1024",
}: Props) {
  const [prompt, setPrompt]   = useState("");
  const [style, setStyle]     = useState(styleOptions[0]);
  const [size, setSize]       = useState(defaultSize);
  const [imageUrl, setUrl]    = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError]     = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setStatus("loading");
    setUrl("");
    setError("");
    try {
      const res = await fetch("/api/tools/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${prompt}. Style: ${style}`, size }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.error) { setError(data.error); setStatus("error"); return; }
      setUrl(data.url ?? "");
      setStatus("done");
    } catch {
      setError("Không thể tạo hình ảnh. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  async function download() {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `monetai-image-${Date.now()}.png`;
    a.target = "_blank";
    a.click();
  }

  const inputSty = { background: INPUT_BG, borderColor: BORDER, color: TEXT } as const;
  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]`;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{icon}</span>
          <h2 className="font-bold text-lg" style={{ color: TEXT }}>{title}</h2>
        </div>
        <p className="text-sm" style={{ color: MUTED }}>{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 flex-1">
        {/* Inputs */}
        <form onSubmit={generate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              {promptLabel} <span style={{ color: ORANGE }}>*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={promptPlaceholder}
              rows={5}
              required
              className={`${inputCls} resize-none`}
              style={inputSty}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputCls} style={{ ...inputSty, cursor: "pointer" }}>
                {styleOptions.map((s) => <option key={s} value={s} style={{ background: "#16161F" }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Kích thước</label>
              <select value={size} onChange={(e) => setSize(e.target.value as typeof size)} className={inputCls} style={{ ...inputSty, cursor: "pointer" }}>
                <option value="1024x1024" style={{ background: "#16161F" }}>1:1 Square</option>
                <option value="1792x1024" style={{ background: "#16161F" }}>16:9 Landscape</option>
                <option value="1024x1792" style={{ background: "#16161F" }}>9:16 Portrait</option>
              </select>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-60 mt-auto"
            style={{ background: ORANGE, color: "#fff" }}
          >
            {status === "loading" ? <><RefreshCw className="w-4 h-4 animate-spin" /> Đang tạo...</> : <><Send className="w-4 h-4" /> Tạo hình ảnh</>}
          </motion.button>
        </form>

        {/* Output */}
        <div className="rounded-xl border flex flex-col min-h-[300px]" style={{ borderColor: BORDER, background: CARD }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Kết quả</span>
            {status === "done" && (
              <button onClick={download} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-white/5 transition-colors" style={{ color: ORANGE }}>
                <Download className="w-3.5 h-3.5" /> Tải về
              </button>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <span className="text-5xl block mb-3">🎨</span>
                  <p className="text-sm" style={{ color: MUTED }}>Nhập mô tả để tạo hình ảnh bằng DALL-E 3</p>
                </motion.div>
              )}
              {status === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <RefreshCw className="w-10 h-10 mx-auto mb-3 animate-spin" style={{ color: ORANGE }} />
                  <p className="text-sm" style={{ color: MUTED }}>DALL-E 3 đang tạo hình ảnh...</p>
                  <p className="text-xs mt-1" style={{ color: MUTED }}>Khoảng 15-20 giây</p>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 p-3 rounded-lg w-full" style={{ background: "#FF000015", border: "1px solid #FF000030" }}>
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}
              {status === "done" && imageUrl && (
                <motion.img
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={imageUrl}
                  alt="AI Generated"
                  className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
