"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Sparkles, Copy, RotateCcw, Facebook, Mail, FileText,
  Smartphone, Globe, Zap, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth, UNLIMITED_CREDITS } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "monetai.vn@gmail.com";

const contentTypes = [
  { id: "facebook", label: "Bài Facebook",      icon: Facebook,   color: "#1877F2", placeholder: "VD: Khóa học kiếm tiền online với AI" },
  { id: "tiktok",   label: "Kịch bản TikTok",   icon: Smartphone, color: "#FF0050", placeholder: "VD: Dịch vụ thiết kế website" },
  { id: "caption",  label: "Caption & Hashtag",  icon: FileText,   color: "#E1306C", placeholder: "VD: Sản phẩm làm đẹp tự nhiên" },
  { id: "email",    label: "Email Marketing",    icon: Mail,       color: "#EA4335", placeholder: "VD: Phần mềm quản lý bán hàng" },
  { id: "seo",      label: "Bài viết SEO",       icon: Globe,      color: "#34A853", placeholder: "VD: Dịch vụ affiliate marketing" },
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

🎯 MỤC TIÊU: Nội dung phải giúp người đăng bài KIẾM ĐƯỢC TIỀN — tạo ra đơn hàng, đăng ký, hoặc hoa hồng affiliate thực tế.

Viết trực tiếp nội dung hoàn chỉnh, KHÔNG giải thích hay hỏi thêm.`;
}

export default function ContentGeneratorPage() {
  const { user, updateUser } = useAuth();
  const [type, setType]       = useState("facebook");
  const [tone, setTone]       = useState("Thuyết phục");
  const [product, setProduct] = useState("");
  const [benefit, setBenefit] = useState("");
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const credits     = user?.credits ?? 0;
  const isUnlimited = isAdmin || credits === UNLIMITED_CREDITS;
  const hasCredits  = isUnlimited || credits > 0;
  const canGen      = !!product.trim() && !loading && hasCredits;

  const currentType = contentTypes.find((c) => c.id === type) ?? contentTypes[0];
  const creditLabel = isUnlimited ? "∞" : credits;
  const creditColor = isUnlimited ? "text-[#FF6B00]" : credits <= 1 ? "text-red-400" : "text-green-400";

  const handleGenerate = async () => {
    if (!canGen) return;
    setLoading(true);
    setOutput("");

    // 1. Try server API (OpenAI / Gemini / Claude)
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

      if (res.ok) {
        const data = await res.json();
        setOutput(data.content);
        if (!isUnlimited && user && user.credits > 0) {
          updateUser({ credits: user.credits - 1 });
        }
        setLoading(false);
        return;
      }
    } catch {
      // fall through to background method
    }

    // 2. Background fallback — silently open ChatGPT with prompt
    const prompt = buildPrompt(type, product.trim(), benefit.trim(), tone);
    try { await navigator.clipboard.writeText(prompt); } catch { /* ignore */ }
    window.open("https://chat.openai.com/", "_blank");

    // Show a placeholder while user pastes into ChatGPT
    setOutput("⏳ Đang xử lý...\n\nNội dung sẽ hiển thị tại đây sau khi AI hoàn thành.\nBạn có thể dán kết quả từ ChatGPT vào ô bên dưới.");
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Content Generator</h1>
              <p className="text-[#A0A0B0] text-sm">Tạo nội dung bán hàng tự động bằng AI</p>
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

      {/* No credits warning */}
      <AnimatePresence>
        {!hasCredits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
          >
            <p className="text-yellow-300 text-sm">Hết credits. Nạp thêm để tiếp tục tạo nội dung — <span className="font-semibold">1.000 ₫/credit</span></p>
            <Link href="/dashboard/billing" className="shrink-0 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              Nạp ngay
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Config */}
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

          {/* Generate button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!canGen}
            whileHover={{ scale: canGen ? 1.01 : 1 }}
            whileTap={{ scale: canGen ? 0.97 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {loading ? "Đang tạo nội dung..." : `Tạo nội dung${!isUnlimited ? ` (${credits} credits)` : ""}`}
          </motion.button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden min-h-[540px] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A3A] shrink-0">
              <p className="text-white text-sm font-semibold">Nội dung được tạo</p>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-[#FF6B00]/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Đã sao chép!" : "Sao chép"}
                  </button>
                  <button
                    onClick={() => setOutput("")}
                    className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Làm mới
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center"
                  >
                    <div className="w-14 h-14 border-2 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
                    <div>
                      <p className="text-white font-semibold">AI đang tạo nội dung...</p>
                      <p className="text-[#A0A0B0] text-sm mt-1">Vui lòng chờ trong giây lát</p>
                    </div>
                  </motion.div>
                )}

                {!loading && output && (
                  <motion.pre key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[#D0D0E0] text-sm leading-relaxed whitespace-pre-wrap font-sans"
                  >
                    {output}
                  </motion.pre>
                )}

                {!loading && !output && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-3 text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#FF6B00]/50" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Sẵn sàng tạo nội dung</p>
                      <p className="text-[#A0A0B0] text-sm">
                        Nhập tên sản phẩm → Chọn loại nội dung<br />→ Nhấn <span className="text-[#FF6B00] font-semibold">&quot;Tạo nội dung&quot;</span>
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
