"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Sparkles, Copy, RotateCcw, Facebook, Mail, FileText, Smartphone, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const contentTypes = [
  { id: "facebook", label: "Bài Facebook", icon: Facebook, prompt: "Viết bài Facebook bán hàng" },
  { id: "tiktok", label: "Kịch bản TikTok", icon: Smartphone, prompt: "Viết kịch bản video TikTok" },
  { id: "caption", label: "Caption & Hashtag", icon: FileText, prompt: "Viết caption và hashtag" },
  { id: "email", label: "Email Marketing", icon: Mail, prompt: "Viết email marketing" },
  { id: "seo", label: "Bài SEO", icon: Globe, prompt: "Viết bài viết SEO" },
];

const tones = ["Chuyên nghiệp", "Thân thiện", "Hài hước", "Thuyết phục", "Cảm xúc"];

const sampleOutputs: Record<string, string> = {
  facebook: `🔥 BẠN ĐÃ BIẾT CÁCH KIẾM TIỀN TỪ AI CHƯA?

Mình vừa dùng MonetAI để tạo ra 2 triệu đồng chỉ trong 3 ngày đầu tiên!

Cách làm đơn giản:
✅ Đăng ký tài khoản MonetAI miễn phí
✅ Chọn sản phẩm AI muốn quảng bá
✅ AI tự tạo nội dung bán hàng
✅ Chia sẻ link và nhận hoa hồng

Không cần kinh nghiệm kỹ thuật, không cần vốn!

👉 Link đăng ký: [affiliate_link]
📞 Inbox mình nếu cần hỗ trợ!

#MonetAI #KiếmTiềnOnline #AIAffiliate #ThuNhậpThụĐộng`,

  tiktok: `[HOOK - 0-3 giây]
"Tôi kiếm 5 triệu từ AI chỉ trong 1 tuần - đây là cách..."

[NỘI DUNG CHÍNH - 3-25 giây]
Bước 1: Truy cập MonetAI.vn - đăng ký miễn phí
Bước 2: Chọn sản phẩm AI yêu thích từ hàng trăm lựa chọn
Bước 3: Nhận link affiliate cá nhân
Bước 4: Chia sẻ lên mạng xã hội

[CTA - 25-30 giây]
"Link đăng ký miễn phí trong bio! Bình luận 'AI' để mình gửi hướng dẫn chi tiết!"

#MonetAI #KiếmTiềnOnline #AIAffiliate`,

  caption: `💰 Bạn có muốn kiếm tiền từ AI không?

MonetAI - nền tảng AI Commerce #1 Việt Nam đang mở cơ hội cho tất cả mọi người!

🚀 Không cần kinh nghiệm
💻 Làm việc mọi lúc, mọi nơi
💵 Hoa hồng lên đến 40%

Đăng ký miễn phí tại link trong bio!

#MonetAI #AICommerce #KiếmTiềnOnline #PassiveIncome #AffiliateMarketing #AITool #ViệtNam`,

  email: `Chủ đề: [Cơ hội] Kiếm thu nhập thụ động từ AI - Hoàn toàn miễn phí

Xin chào [Tên],

Tôi muốn chia sẻ với bạn một cơ hội kiếm tiền online thực sự đang thay đổi cuộc sống của nhiều người tại Việt Nam.

MonetAI là nền tảng AI Commerce cho phép bạn:
• Kiếm hoa hồng 20-40% từ việc giới thiệu sản phẩm AI
• Tạo nội dung bán hàng tự động bằng AI
• Theo dõi doanh thu real-time trên dashboard

Điều tốt nhất? Bạn có thể bắt đầu MIỄN PHÍ ngay hôm nay.

>> Đăng ký tại đây: [affiliate_link]

Trân trọng,
[Tên của bạn]`,

  seo: `# Cách Kiếm Tiền Từ AI Affiliate Marketing - Hướng Dẫn Toàn Diện 2025

## AI Affiliate Marketing Là Gì?

AI Affiliate Marketing là hình thức kiếm tiền bằng cách giới thiệu các sản phẩm và dịch vụ AI cho người dùng. Khi có người mua hàng thông qua link của bạn, bạn nhận được hoa hồng.

## Tại Sao Nên Chọn MonetAI?

MonetAI cung cấp hệ sinh thái AI Commerce toàn diện với:
- **200+ AI Tools** từ các thương hiệu hàng đầu
- **Hoa hồng cạnh tranh** lên đến 40%
- **AI Content Generator** tự động tạo nội dung bán hàng
- **Dashboard real-time** theo dõi doanh thu

## Các Bước Bắt Đầu

1. Đăng ký tài khoản MonetAI miễn phí
2. Chọn sản phẩm AI phù hợp
3. Tạo nội dung với AI Content Generator
4. Chia sẻ và nhận hoa hồng

[Đăng ký ngay →](https://monetai.vn)`,
};

export default function ContentGeneratorPage() {
  const { user, updateUser } = useAuth();
  const [type, setType] = useState("facebook");
  const [tone, setTone] = useState("Thuyết phục");
  const [product, setProduct] = useState("");
  const [benefit, setBenefit] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!product) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOutput(sampleOutputs[type] || sampleOutputs.facebook);
    if (user && user.credits > 0) updateUser({ credits: user.credits - 1 });
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Content Generator</h1>
            <p className="text-[#A0A0B0] text-sm">Tạo nội dung bán hàng AI trong vài giây</p>
          </div>
        </div>
      </motion.div>

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
                  <ct.icon className="w-4 h-4 shrink-0" />
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Tên sản phẩm / dịch vụ *</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="VD: MonetAI Pro Plan"
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Lợi ích nổi bật</label>
              <textarea
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                placeholder="VD: Kiếm tiền từ AI, miễn phí đăng ký, hoa hồng 30%"
                rows={3}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none resize-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0B0] text-xs font-medium mb-2">Tone giọng văn</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tone === t ? "bg-[#FF6B00] text-white" : "bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] hover:border-[#FF6B00]/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={loading || !product}
            whileHover={{ scale: loading || !product ? 1 : 1.01 }}
            whileTap={{ scale: loading || !product ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Tạo nội dung ({user?.credits ?? 0} credits)
              </>
            )}
          </motion.button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden h-full min-h-[500px]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A3A]">
              <p className="text-white text-sm font-semibold">Nội dung được tạo</p>
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
                    onClick={() => setOutput("")}
                    className="flex items-center gap-1.5 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Làm mới
                  </button>
                </div>
              )}
            </div>
            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-10 h-10 border-2 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin" />
                  <p className="text-[#A0A0B0] text-sm">AI đang tạo nội dung...</p>
                </div>
              ) : output ? (
                <pre className="text-[#A0A0B0] text-sm leading-relaxed whitespace-pre-wrap font-sans">{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#FF6B00]/50" />
                  </div>
                  <p className="text-[#A0A0B0] text-sm">
                    Chọn loại nội dung, nhập sản phẩm<br />và nhấn "Tạo nội dung"
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
