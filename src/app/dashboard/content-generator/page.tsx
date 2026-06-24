"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Sparkles, Copy, RotateCcw, Facebook, Mail, FileText,
  Smartphone, Globe, Zap, ExternalLink, CheckCircle2, ChevronRight, Bot,
} from "lucide-react";
import Link from "next/link";
import { useAuth, UNLIMITED_CREDITS } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "monetai.vn@gmail.com";

const contentTypes = [
  { id: "facebook", label: "Bài Facebook", icon: Facebook,   color: "#1877F2", placeholder: "VD: Khóa học kiếm tiền online với AI" },
  { id: "tiktok",   label: "Kịch bản TikTok", icon: Smartphone, color: "#FF0050", placeholder: "VD: Dịch vụ thiết kế website" },
  { id: "caption",  label: "Caption & Hashtag", icon: FileText,  color: "#E1306C", placeholder: "VD: Sản phẩm làm đẹp tự nhiên" },
  { id: "email",    label: "Email Marketing", icon: Mail,       color: "#EA4335", placeholder: "VD: Phần mềm quản lý bán hàng" },
  { id: "seo",      label: "Bài viết SEO",   icon: Globe,      color: "#34A853", placeholder: "VD: Dịch vụ affiliate marketing" },
];

const tones = ["Thuyết phục", "Chuyên nghiệp", "Thân thiện", "Hài hước", "Cảm xúc"];

const TYPE_LABELS: Record<string, string> = {
  facebook: "bài đăng Facebook bán hàng viral",
  tiktok:   "kịch bản TikTok 30-60 giây có hook mạnh",
  caption:  "caption + hashtag thu hút nhiều tương tác",
  email:    "email marketing có tỷ lệ mở cao",
  seo:      "bài viết SEO 1000-1500 từ chuẩn Google",
};

function buildPrompt(contentType: string, product: string, benefits: string, tone: string): string {
  const label = TYPE_LABELS[contentType] ?? "nội dung marketing";
  const benefitText = benefits.trim() || "tăng thu nhập, tiết kiệm thời gian, dễ sử dụng, không cần kinh nghiệm";

  return `Bạn là chuyên gia content marketing và affiliate marketing người Việt Nam.

NHIỆM VỤ: Viết ${label} cho sản phẩm/dịch vụ sau.

📌 SẢN PHẨM/DỊCH VỤ: ${product}
✨ LỢI ÍCH NỔI BẬT: ${benefitText}
🎭 TONE GIỌNG VĂN: ${tone}

YÊU CẦU BẮT BUỘC:
1. Hook mạnh ngay câu đầu — gây tò mò hoặc đặt câu hỏi
2. Làm rõ lợi ích cụ thể bằng con số/dữ liệu thực tế
3. Tạo FOMO (sợ bỏ lỡ) — khan hiếm, thời hạn, ưu đãi
4. CTA rõ ràng — hành động cụ thể để người đọc thực hiện ngay${contentType === "facebook" ? "\n5. Hashtag 5-8 tag phù hợp ở cuối" : ""}${contentType === "tiktok" ? "\n5. Chia rõ [HOOK 0-3s], [NỘI DUNG 3-25s], [CTA 25-30s]" : ""}${contentType === "email" ? "\n5. Dòng tiêu đề email hấp dẫn ở đầu tiên" : ""}${contentType === "seo" ? "\n5. H2/H3 chuẩn SEO, từ khóa tự nhiên, meta description ở cuối" : ""}

🎯 MỤC TIÊU QUAN TRỌNG NHẤT: Nội dung phải giúp người đăng bài KIẾM ĐƯỢC TIỀN — tạo ra đơn hàng, đăng ký, hoặc hoa hồng affiliate thực tế.

Viết trực tiếp nội dung hoàn chỉnh, KHÔNG giải thích hay hỏi thêm.`;
}

export default function ContentGeneratorPage() {
  const { user, updateUser } = useAuth();
  const [type, setType]       = useState("facebook");
  const [tone, setTone]       = useState("Thuyết phục");
  const [product, setProduct] = useState("");
  const [benefit, setBenefit] = useState("");
  const [prompt, setPrompt]   = useState("");
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const credits     = user?.credits ?? 0;
  const isUnlimited = isAdmin || credits === UNLIMITED_CREDITS;
  const hasCredits  = isUnlimited || credits > 0;
  const canGen      = !!product.trim() && !loading;

  const currentType = contentTypes.find((c) => c.id === type) ?? contentTypes[0];

  /* ── Tạo bằng ChatGPT (miễn phí) ── */
  const handleOpenChatGPT = () => {
    if (!product.trim()) return;
    const builtPrompt = buildPrompt(type, product, benefit, tone);
    setPrompt(builtPrompt);
    setOutput("");

    // Copy to clipboard
    navigator.clipboard.writeText(builtPrompt).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 3000);
    });

    // Open ChatGPT
    window.open("https://chat.openai.com/", "_blank");
    setChatOpened(true);
  };

  /* ── Tạo bằng API (tự động) ── */
  const handleGenerateAPI = async () => {
    if (!canGen || !hasCredits) return;
    setLoading(true);
    setPrompt("");
    setOutput("");
    setChatOpened(false);

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: type,
          product: product.trim(),
          benefits: benefit.trim(),
          tone,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API failed → fallback to ChatGPT method
        const builtPrompt = buildPrompt(type, product, benefit, tone);
        setPrompt(builtPrompt);
        return;
      }

      setOutput(data.content);

      // Deduct 1 credit
      if (!isUnlimited && user && user.credits > 0) {
        updateUser({ credits: user.credits - 1 });
      }
    } catch {
      const builtPrompt = buildPrompt(type, product, benefit, tone);
      setPrompt(builtPrompt);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const creditLabel = isUnlimited ? "∞" : credits;
  const creditColor = isUnlimited ? "text-[#FF6B00]" : credits <= 1 ? "text-red-400" : "text-green-400";

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Content Generator</h1>
              <p className="text-[#A0A0B0] text-sm">Tạo nội dung bán hàng với ChatGPT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl px-4 py-2 flex items-center gap-2">
              <Zap className={`w-4 h-4 ${creditColor}`} />
              <span className="text-[#A0A0B0] text-sm">Credits:</span>
              <span className={`font-bold text-sm ${creditColor}`}>{creditLabel}</span>
            </div>
            {!isUnlimited && credits <= 2 && (
              <Link href="/dashboard/billing" className="flex items-center gap-1 text-xs bg-[#FF6B00] hover:bg-[#E55A00] text-white px-3 py-2 rounded-xl font-semibold transition-colors">
                Nạp <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {/* Content type */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
            <p className="text-white text-sm font-semibold mb-3">Loại nội dung</p>
            <div className="space-y-1.5">
              {contentTypes.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setType(ct.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm text-left transition-all ${
                    type === ct.id
                      ? "bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00]"
                      : "text-[#A0A0B0] hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <ct.icon className="w-4 h-4 shrink-0" style={{ color: type === ct.id ? "#FF6B00" : ct.color }} />
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">
                Tên sản phẩm / dịch vụ <span className="text-[#FF6B00]">*</span>
              </label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder={currentType.placeholder}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">Lợi ích nổi bật</label>
              <textarea
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                placeholder="VD: Hoa hồng 30%, miễn phí đăng ký, kiếm tiền thụ động không cần vốn..."
                rows={3}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none resize-none transition-all"
              />
              <p className="text-[#5A5A7A] text-xs mt-1">Càng chi tiết → nội dung càng hay</p>
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Tone giọng văn</label>
              <div className="flex flex-wrap gap-1.5">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tone === t ? "bg-[#FF6B00] text-white font-semibold" : "bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] hover:border-[#FF6B00]/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary: ChatGPT button */}
          <motion.button
            onClick={handleOpenChatGPT}
            disabled={!product.trim()}
            whileHover={{ scale: product.trim() ? 1.01 : 1 }}
            whileTap={{ scale: product.trim() ? 0.98 : 1 }}
            className="w-full flex items-center justify-center gap-2 bg-[#10A37F] hover:bg-[#0d8a6a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            <Bot className="w-5 h-5" />
            Tạo nội dung với ChatGPT
            <ExternalLink className="w-4 h-4 opacity-70" />
          </motion.button>

          {/* Secondary: API auto-generate */}
          {hasCredits && (
            <motion.button
              onClick={handleGenerateAPI}
              disabled={!canGen}
              whileHover={{ scale: canGen ? 1.005 : 1 }}
              whileTap={{ scale: canGen ? 0.98 : 1 }}
              className="w-full flex items-center justify-center gap-2 bg-[#16161F] border border-[#2A2A3A] hover:border-[#FF6B00]/40 disabled:opacity-40 disabled:cursor-not-allowed text-[#A0A0B0] hover:text-white text-sm font-medium py-3 rounded-xl transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              )}
              {loading ? "Đang tạo tự động..." : `Tạo tự động (${isUnlimited ? "∞" : credits} credits)`}
            </motion.button>
          )}
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden min-h-[540px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A3A] shrink-0">
              <p className="text-white text-sm font-semibold">
                {output ? "Nội dung đã tạo (API)" : prompt ? "Prompt đã tạo — Dán vào ChatGPT" : "Kết quả"}
              </p>
              <div className="flex gap-2">
                {output && (
                  <>
                    <button onClick={handleCopyOutput} className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? "Đã copy!" : "Copy"}
                    </button>
                    <button onClick={() => { setOutput(""); setPrompt(""); }} className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Làm mới
                    </button>
                  </>
                )}
                {prompt && !output && (
                  <>
                    <button onClick={handleCopyPrompt} className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                      <Copy className="w-3.5 h-3.5" />
                      {copiedPrompt ? "Đã copy!" : "Copy prompt"}
                    </button>
                    <button onClick={() => setPrompt("")} className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Làm mới
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-5 overflow-y-auto">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 border-2 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
                      <Bot className="w-6 h-6 text-[#FF6B00] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">AI đang tạo nội dung...</p>
                      <p className="text-[#A0A0B0] text-sm mt-1">Đang xử lý với ChatGPT</p>
                    </div>
                  </motion.div>
                )}

                {/* Auto-generated output */}
                {!loading && output && (
                  <motion.pre key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[#D0D0E0] text-sm leading-relaxed whitespace-pre-wrap font-sans"
                  >
                    {output}
                  </motion.pre>
                )}

                {/* ChatGPT prompt mode */}
                {!loading && !output && prompt && (
                  <motion.div key="prompt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {/* Instructions */}
                    {chatOpened && (
                      <div className="bg-[#10A37F]/10 border border-[#10A37F]/30 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#10A37F] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[#10A37F] font-semibold text-sm">ChatGPT đã mở!</p>
                          <p className="text-[#A0A0B0] text-xs mt-0.5">
                            Prompt đã được copy. Vào ChatGPT → nhấn <kbd className="bg-[#2A2A3A] text-white px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+V</kbd> → Enter
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Steps */}
                    <div className="bg-[#0A0A0F] rounded-xl p-4">
                      <p className="text-white text-xs font-semibold mb-3 uppercase tracking-wide">Hướng dẫn 3 bước:</p>
                      <div className="space-y-2.5">
                        {[
                          { n: 1, text: 'ChatGPT đã mở trong tab mới', done: chatOpened },
                          { n: 2, text: 'Nhấn Ctrl+V để dán prompt → Enter', done: false },
                          { n: 3, text: 'Copy kết quả từ ChatGPT về đây dùng', done: false },
                        ].map((s) => (
                          <div key={s.n} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${s.done ? "bg-[#10A37F]" : "bg-[#2A2A3A]"}`}>
                              {s.done ? "✓" : s.n}
                            </div>
                            <span className={`text-sm ${s.done ? "text-[#10A37F]" : "text-[#A0A0B0]"}`}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prompt preview */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#A0A0B0] text-xs font-medium uppercase tracking-wide">Prompt đã tạo:</p>
                        <button
                          onClick={() => { window.open("https://chat.openai.com/", "_blank"); handleCopyPrompt(); }}
                          className="flex items-center gap-1.5 text-xs bg-[#10A37F] hover:bg-[#0d8a6a] text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Mở lại ChatGPT
                        </button>
                      </div>
                      <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-4 max-h-72 overflow-y-auto">
                        <pre className="text-[#A0A0B0] text-xs leading-relaxed whitespace-pre-wrap font-mono">{prompt}</pre>
                      </div>
                    </div>

                    {/* Paste result area */}
                    <div>
                      <p className="text-[#A0A0B0] text-xs font-medium mb-2">Dán kết quả từ ChatGPT vào đây:</p>
                      <textarea
                        placeholder="Sau khi ChatGPT trả lời, copy toàn bộ nội dung và dán vào đây..."
                        rows={6}
                        onChange={(e) => { if (e.target.value.trim()) setOutput(e.target.value); }}
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#10A37F] focus:ring-1 focus:ring-[#10A37F] outline-none resize-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Empty state */}
                {!loading && !output && !prompt && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#10A37F]/10 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-[#10A37F]/50" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Sẵn sàng tạo nội dung</p>
                      <p className="text-[#A0A0B0] text-sm">
                        Nhập tên sản phẩm → Chọn loại nội dung<br />
                        → Nhấn <span className="text-[#10A37F] font-semibold">&quot;Tạo nội dung với ChatGPT&quot;</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
