"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, ShoppingCart, Plus, Copy, Eye } from "lucide-react";

const prompts = [
  { id: 1, name: "Viral TikTok Hook Generator", description: "Tạo 20 hook câu mở đầu viral cho TikTok trong 1 lần chạy.", model: "ChatGPT-4", price: "49.000", rating: 4.9, sales: 1243, category: "Marketing", preview: "Tạo 20 câu hook viral cho video TikTok về [chủ đề]..." },
  { id: 2, name: "Facebook Ads Copy Pro", description: "Viết quảng cáo Facebook chuyển đổi cao với 5 biến thể A/B.", model: "Claude", price: "79.000", rating: 4.8, sales: 987, category: "Advertising", preview: "Viết 5 biến thể quảng cáo Facebook cho sản phẩm [tên]..." },
  { id: 3, name: "AI Product Photography", description: "Tạo ảnh sản phẩm chuyên nghiệp từ ảnh chụp điện thoại.", model: "Midjourney", price: "129.000", rating: 4.9, sales: 2341, category: "Design", preview: "Professional product photo of [description], white background..." },
  { id: 4, name: "SEO Article Generator", description: "Tạo bài viết SEO 2000+ từ với cấu trúc chuẩn Google.", model: "ChatGPT-4", price: "59.000", rating: 4.7, sales: 756, category: "SEO", preview: "Viết bài SEO đầy đủ về [từ khóa] với 2000+ từ..." },
  { id: 5, name: "Email Sequence Builder", description: "Chuỗi 7 email nurturing tự động cho phễu bán hàng.", model: "Claude", price: "99.000", rating: 4.8, sales: 534, category: "Email", preview: "Tạo chuỗi 7 email marketing cho [sản phẩm/dịch vụ]..." },
  { id: 6, name: "Business Plan Generator", description: "Kế hoạch kinh doanh chi tiết 20 trang cho startup.", model: "ChatGPT-4", price: "149.000", rating: 4.6, sales: 423, category: "Business", preview: "Tạo kế hoạch kinh doanh toàn diện cho [ý tưởng]..." },
];

const cats = ["Tất cả", "Marketing", "Advertising", "Design", "SEO", "Email", "Business"];
const modelFilter = ["Tất cả", "ChatGPT-4", "Claude", "Midjourney"];

export default function PromptMarketplacePage() {
  const [cat, setCat] = useState("Tất cả");
  const [model, setModel] = useState("Tất cả");
  const [preview, setPreview] = useState<number | null>(null);

  const filtered = prompts.filter((p) => {
    const matchCat = cat === "Tất cả" || p.category === cat;
    const matchModel = model === "Tất cả" || p.model === model;
    return matchCat && matchModel;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Prompt Marketplace</h1>
              <p className="text-[#A0A0B0] text-sm">Mua prompt chất lượng hoặc bán prompt của bạn</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Bán Prompt
          </button>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-3">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`text-sm px-3 py-2 rounded-xl transition-all ${cat === c ? "bg-pink-600 text-white" : "bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white"}`}>{c}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {modelFilter.map((m) => (
          <button key={m} onClick={() => setModel(m)} className={`text-xs px-3 py-1.5 rounded-lg transition-all ${model === m ? "bg-pink-500/20 border border-pink-500/40 text-pink-400" : "border border-[#2A2A3A] text-[#A0A0B0] hover:border-pink-500/20"}`}>{m}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden hover:border-pink-500/20 transition-all"
          >
            {preview === p.id && (
              <div className="bg-[#0A0A0F] border-b border-[#2A2A3A] p-4">
                <p className="text-[#A0A0B0] text-xs font-mono leading-relaxed">{p.preview}</p>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full">{p.model}</span>
                <span className="text-xs text-[#A0A0B0]">{p.sales} đã mua</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-[#A0A0B0] text-xs mb-3">{p.description}</p>

              <div className="flex items-center gap-1 mb-4">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm font-medium">{p.rating}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{p.price}₫</span>
                <div className="flex gap-2">
                  <button onClick={() => setPreview(preview === p.id ? null : p.id)} className="flex items-center gap-1 text-xs text-[#A0A0B0] hover:text-white border border-[#2A2A3A] px-2.5 py-1.5 rounded-lg transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button className="flex items-center gap-1 text-xs bg-pink-600 hover:bg-pink-700 text-white px-2.5 py-1.5 rounded-lg transition-colors font-medium">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Mua
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
