"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Sparkles, Copy, Clock, BarChart2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const platforms = [
  { id: "tiktok", label: "TikTok", duration: "15-60s" },
  { id: "reels", label: "Instagram Reels", duration: "15-90s" },
  { id: "shorts", label: "YouTube Shorts", duration: "< 60s" },
  { id: "story", label: "Storytelling Video", duration: "2-5 phút" },
];

const niches = ["AI & Công nghệ", "Kiếm tiền Online", "Marketing", "Giáo dục", "Sức khỏe", "Tài chính", "Thời trang", "Ẩm thực"];

const sampleScript = `📱 KỊCH BẢN TIKTOK - "Kiếm tiền từ AI"
Thời lượng: 30-45 giây | Platform: TikTok

━━━━━━━━━━━━━━━━━━━━━━
🎬 SCENE 1 - HOOK (0-3s)
━━━━━━━━━━━━━━━━━━━━━━
[HÌNH ẢNH]: Close-up khuôn mặt bạn, vẻ ngạc nhiên
[VOICE]: "Tôi vừa kiếm được 2 triệu trong 3 ngày chỉ nhờ điều này..."
[TEXT ON SCREEN]: "2.000.000₫ - 3 ngày - AI"

━━━━━━━━━━━━━━━━━━━━━━
🎬 SCENE 2 - VẤN ĐỀ (3-10s)
━━━━━━━━━━━━━━━━━━━━━━
[HÌNH ẢNH]: Screen recording điện thoại/laptop
[VOICE]: "Bạn có biết có hàng nghìn sản phẩm AI đang trả hoa hồng 20-40% không?"
[TEXT]: "20-40% hoa hồng 🤑"

━━━━━━━━━━━━━━━━━━━━━━
🎬 SCENE 3 - GIẢI PHÁP (10-25s)
━━━━━━━━━━━━━━━━━━━━━━
[HÌNH ẢNH]: Demo MonetAI dashboard
[VOICE]: "MonetAI cho phép bạn:
- Đăng ký miễn phí
- Chọn sản phẩm AI
- AI tự tạo nội dung
- Nhận hoa hồng tự động"
[TEXT]: "Bước 1 → Bước 2 → Bước 3 → 💰"

━━━━━━━━━━━━━━━━━━━━━━
🎬 SCENE 4 - CTA (25-35s)
━━━━━━━━━━━━━━━━━━━━━━
[HÌNH ẢNH]: Link trong bio, tay chỉ vào màn hình
[VOICE]: "Link đăng ký miễn phí ngay trong bio! Bình luận 'AI' để mình gửi hướng dẫn chi tiết!"
[TEXT]: "BIO LINK 👆 | COMMENT 'AI' 👇"

━━━━━━━━━━━━━━━━━━━━━━
📌 CAPTION GỢI Ý:
"Cách mình kiếm 2 triệu từ AI chỉ trong 3 ngày 🤖💰 Link đăng ký miễn phí trong bio!"

🔖 HASHTAGS:
#MonetAI #KiếmTiềnOnline #AIAffiliate #PassiveIncome #TikTokVietnam #AITool`;

export default function VideoScriptPage() {
  const { user, updateUser } = useAuth();
  const [platform, setPlatform] = useState("tiktok");
  const [niche, setNiche] = useState("AI & Công nghệ");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setOutput(sampleScript);
    if (user && user.credits > 0) updateUser({ credits: user.credits - 2 });
    setLoading(false);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Video Script Generator</h1>
            <p className="text-[#A0A0B0] text-sm">Tạo kịch bản video chuyên nghiệp cho TikTok, Reels, Shorts</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Platform */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5">
            <p className="text-white text-sm font-semibold mb-3">Nền tảng</p>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    platform === p.id ? "bg-purple-500/15 border border-purple-500/30" : "border border-[#2A2A3A] hover:border-purple-500/20"
                  }`}
                >
                  <p className={`text-sm font-medium ${platform === p.id ? "text-purple-400" : "text-white"}`}>{p.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-[#A0A0B0]" />
                    <span className="text-[#A0A0B0] text-xs">{p.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Chủ đề video *</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Cách kiếm tiền từ AI Affiliate"
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Lĩnh vực</label>
              <div className="flex flex-wrap gap-2">
                {niches.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                      niche === n ? "bg-purple-500 text-white" : "bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] hover:border-purple-500/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-[#A0A0B0]">Kịch bản được tối ưu cho tỷ lệ xem và tương tác cao</p>
            </div>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={loading || !topic}
            whileHover={{ scale: loading || !topic ? 1 : 1.01 }}
            whileTap={{ scale: loading || !topic ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Tạo kịch bản (2 credits)
              </>
            )}
          </motion.button>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden min-h-[500px]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A3A]">
              <p className="text-white text-sm font-semibold">Kịch bản được tạo</p>
              {output && (
                <button
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] px-3 py-1.5 rounded-lg transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Đã sao chép!" : "Sao chép"}
                </button>
              )}
            </div>
            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-[#A0A0B0] text-sm">AI đang viết kịch bản...</p>
                </div>
              ) : output ? (
                <pre className="text-[#A0A0B0] text-sm leading-relaxed whitespace-pre-wrap font-sans">{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-purple-500/50" />
                  </div>
                  <p className="text-[#A0A0B0] text-sm">
                    Nhập chủ đề video và nhấn<br />"Tạo kịch bản" để bắt đầu
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
