"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Sparkles, Copy, RotateCcw, Facebook, Mail, FileText,
  Smartphone, Globe, Zap, AlertCircle, CheckCircle2, ChevronRight, Bot,
} from "lucide-react";
import Link from "next/link";
import { useAuth, UNLIMITED_CREDITS } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "monetai.vn@gmail.com";

const contentTypes = [
  { id: "facebook", label: "Bài Facebook", icon: Facebook, color: "#1877F2" },
  { id: "tiktok",   label: "Kịch bản TikTok", icon: Smartphone, color: "#FF0050" },
  { id: "caption",  label: "Caption & Hashtag", icon: FileText, color: "#E1306C" },
  { id: "email",    label: "Email Marketing", icon: Mail, color: "#EA4335" },
  { id: "seo",      label: "Bài viết SEO", icon: Globe, color: "#34A853" },
];

const tones = ["Thuyết phục", "Chuyên nghiệp", "Thân thiện", "Hài hước", "Cảm xúc"];

const AI_SOURCES = [
  { name: "ChatGPT (GPT-4o)", color: "#10B981", short: "GPT" },
  { name: "Google Gemini",    color: "#4285F4", short: "Gemini" },
  { name: "Claude (Haiku)",   color: "#FF6B00", short: "Claude" },
];

export default function ContentGeneratorPage() {
  const { user, updateUser } = useAuth();
  const [type, setType]       = useState("facebook");
  const [tone, setTone]       = useState("Thuyết phục");
  const [product, setProduct] = useState("");
  const [benefit, setBenefit] = useState("");
  const [output, setOutput]   = useState("");
  const [aiSource, setAiSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState("");

  const isAdmin      = user?.email === ADMIN_EMAIL;
  const credits      = user?.credits ?? 0;
  const isUnlimited  = isAdmin || credits === UNLIMITED_CREDITS;
  const hasCredits   = isUnlimited || credits > 0;
  const canGenerate  = hasCredits && !!product.trim() && !loading;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError("");
    setOutput("");
    setAiSource("");

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
        setError(data.error || "Lỗi tạo nội dung. Vui lòng thử lại.");
        return;
      }

      setOutput(data.content);
      setAiSource(data.source);

      // Deduct 1 credit (admin/unlimited exempt)
      if (!isUnlimited && user && user.credits > 0) {
        updateUser({ credits: user.credits - 1 });
      }
    } catch {
      setError("Lỗi kết nối. Kiểm tra lại kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <p className="text-[#A0A0B0] text-sm">Đa AI chọn lọc nội dung tối ưu nhất</p>
            </div>
          </div>

          {/* Credits badge */}
          <div className="flex items-center gap-3">
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl px-4 py-2 flex items-center gap-2">
              <Zap className={`w-4 h-4 ${creditColor}`} />
              <span className="text-[#A0A0B0] text-sm">Credits:</span>
              <span className={`font-bold text-sm ${creditColor}`}>{creditLabel}</span>
            </div>
            {!isUnlimited && credits <= 2 && (
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-1.5 text-xs bg-[#FF6B00] hover:bg-[#E55A00] text-white px-3.5 py-2 rounded-xl font-semibold transition-colors"
              >
                Nạp credits <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* AI sources indicator */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[#A0A0B0] text-xs">Đang sử dụng:</span>
          {AI_SOURCES.map((ai) => (
            <span key={ai.name} className="flex items-center gap-1.5 text-xs bg-[#16161F] border border-[#2A2A3A] px-2.5 py-1 rounded-full">
              <Bot className="w-3 h-3" style={{ color: ai.color }} />
              <span className="text-[#A0A0B0]">{ai.short}</span>
            </span>
          ))}
          <span className="text-[#A0A0B0] text-xs italic">· Chọn lọc câu trả lời tối ưu</span>
        </div>
      </motion.div>

      {/* No credits warning */}
      <AnimatePresence>
        {!hasCredits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-yellow-300 text-sm font-semibold">Hết credits</p>
                <p className="text-yellow-400/70 text-xs">Nạp thêm credits để tiếp tục tạo nội dung. Giá: 1.000 ₫/credit</p>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Nạp ngay
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Config */}
        <div className="lg:col-span-2 space-y-5">
          {/* Content type */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
            <p className="text-white text-sm font-semibold mb-3">Loại nội dung</p>
            <div className="grid grid-cols-1 gap-2">
              {contentTypes.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setType(ct.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm text-left transition-all ${
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
                placeholder="VD: ChatGPT Plus, Khóa học AI, Shop thời trang..."
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-1.5">
                Lợi ích nổi bật
              </label>
              <textarea
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                placeholder="VD: Hoa hồng 30%, không cần vốn, miễn phí đăng ký, kiếm tiền thụ động..."
                rows={3}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none resize-none transition-all"
              />
              <p className="text-[#5A5A7A] text-xs mt-1">Càng chi tiết, nội dung AI tạo ra càng chính xác</p>
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Tone giọng văn</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tone === t
                        ? "bg-[#FF6B00] text-white font-semibold"
                        : "bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] hover:border-[#FF6B00]/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Credits cost info */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-[#A0A0B0] text-xs">Chi phí mỗi lần tạo</span>
            </div>
            <span className={`text-sm font-bold ${isUnlimited ? "text-[#FF6B00]" : "text-white"}`}>
              {isUnlimited ? "Miễn phí (Admin)" : "1 credit = 1.000 ₫"}
            </span>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={!canGenerate}
            whileHover={{ scale: canGenerate ? 1.01 : 1 }}
            whileTap={{ scale: canGenerate ? 0.98 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đa AI đang tạo nội dung...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Tạo nội dung
                {!isUnlimited && <span className="opacity-70 text-sm">({credits} credits)</span>}
                {isUnlimited && <span className="opacity-70 text-sm">(∞)</span>}
              </>
            )}
          </motion.button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden h-full min-h-[540px] flex flex-col">
            {/* Output header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A3A] shrink-0">
              <div className="flex items-center gap-3">
                <p className="text-white text-sm font-semibold">Nội dung được tạo</p>
                {aiSource && (
                  <span className="flex items-center gap-1.5 text-xs bg-[#FF6B00]/15 border border-[#FF6B00]/20 text-[#FF6B00] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Tối ưu bởi {aiSource}
                  </span>
                )}
              </div>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Đã sao chép!" : "Sao chép"}
                  </button>
                  <button
                    onClick={() => { setOutput(""); setAiSource(""); }}
                    className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Làm mới
                  </button>
                </div>
              )}
            </div>

            {/* Output body */}
            <div className="flex-1 p-5 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <div className="relative">
                    <div className="w-14 h-14 border-2 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
                    <Bot className="w-6 h-6 text-[#FF6B00] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Đa AI đang xử lý...</p>
                    <p className="text-[#A0A0B0] text-sm">ChatGPT · Gemini · Claude đang tạo nội dung</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">Hệ thống chọn lọc câu trả lời tối ưu nhất</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold mb-1">Không thể tạo nội dung</p>
                    <p className="text-[#A0A0B0] text-sm max-w-xs">{error}</p>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="text-sm bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20 px-4 py-2 rounded-xl hover:bg-[#FF6B00]/25 transition-colors disabled:opacity-40"
                  >
                    Thử lại
                  </button>
                </div>
              ) : output ? (
                <pre className="text-[#D0D0E0] text-sm leading-relaxed whitespace-pre-wrap font-sans">{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#FF6B00]/50" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Sẵn sàng tạo nội dung</p>
                    <p className="text-[#A0A0B0] text-sm">
                      Nhập tên sản phẩm → Chọn loại nội dung<br />→ Nhấn &quot;Tạo nội dung&quot;
                    </p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 text-left bg-[#0A0A0F] rounded-xl p-4 max-w-sm">
                    <p className="text-[#A0A0B0] text-xs font-semibold uppercase tracking-wide">Hệ thống AI sẽ:</p>
                    {[
                      "Gọi đồng thời ChatGPT, Gemini & Claude",
                      "Tạo nội dung theo sản phẩm & lợi ích của bạn",
                      "Chọn lọc kết quả tối ưu nhất tự động",
                      "Tạo CTA để người đọc mua hàng / đăng ký",
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#FF6B00]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#FF6B00] text-[9px] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-[#A0A0B0] text-xs">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
