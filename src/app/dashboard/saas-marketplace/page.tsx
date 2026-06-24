"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Star, ExternalLink, Search, ShoppingCart } from "lucide-react";

const tools = [
  { id: 1, name: "ChatGPT Plus", brand: "OpenAI", price: "469.000", priceUSD: "$20", description: "Mô hình GPT-4 với web browsing, image generation và plugins.", category: "AI Chat", rating: 4.9, users: "100M+", badge: "Bán chạy nhất" },
  { id: 2, name: "Claude Pro", brand: "Anthropic", price: "469.000", priceUSD: "$20", description: "AI an toàn nhất, tốt nhất cho coding và phân tích dữ liệu.", category: "AI Chat", rating: 4.8, users: "5M+", badge: null },
  { id: 3, name: "Canva Pro", brand: "Canva", price: "305.000", priceUSD: "$13", description: "Thiết kế đồ họa AI với 1 triệu+ templates.", category: "Design", rating: 4.7, users: "150M+", badge: "Hot" },
  { id: 4, name: "Jasper AI", brand: "Jasper", price: "1.150.000", priceUSD: "$49", description: "Công cụ content marketing AI cho doanh nghiệp.", category: "Writing", rating: 4.6, users: "1M+", badge: null },
  { id: 5, name: "Midjourney v6", brand: "Midjourney", price: "234.000", priceUSD: "$10", description: "Tạo ảnh nghệ thuật AI chất lượng cao từ text.", category: "Image AI", rating: 4.9, users: "10M+", badge: "Mới" },
  { id: 6, name: "Notion AI", brand: "Notion", price: "375.000", priceUSD: "$16", description: "Workspace thông minh với AI tích hợp viết và tóm tắt.", category: "Productivity", rating: 4.7, users: "30M+", badge: null },
  { id: 7, name: "Copy.ai Pro", brand: "Copy.ai", price: "1.150.000", priceUSD: "$49", description: "AI copywriting cho mọi nhu cầu marketing.", category: "Writing", rating: 4.5, users: "3M+", badge: null },
  { id: 8, name: "Runway Gen-3", brand: "Runway", price: "352.000", priceUSD: "$15", description: "Tạo và chỉnh sửa video bằng AI tiên tiến nhất.", category: "Video AI", rating: 4.8, users: "2M+", badge: "Mới" },
];

const toolCats = ["Tất cả", "AI Chat", "Design", "Writing", "Image AI", "Productivity", "Video AI"];

export default function SaaSMarketplacePage() {
  const [cat, setCat] = useState("Tất cả");
  const [search, setSearch] = useState("");

  const filtered = tools.filter((t) => {
    const matchCat = cat === "Tất cả" || t.category === cat;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Store className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI SaaS Marketplace</h1>
            <p className="text-[#A0A0B0] text-sm">200+ AI Tools hàng đầu thế giới với giá tốt nhất VN</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm AI Tool..."
            className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-cyan-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {toolCats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`text-sm px-3 py-2 rounded-xl transition-all whitespace-nowrap ${cat === c ? "bg-cyan-600 text-white" : "bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white"}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -2, borderColor: "rgba(6,182,212,0.3)" }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">{tool.name.slice(0, 2).toUpperCase()}</span>
              </div>
              {tool.badge && (
                <span className="text-xs bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">{tool.badge}</span>
              )}
            </div>
            <h3 className="text-white font-semibold mb-0.5">{tool.name}</h3>
            <p className="text-[#A0A0B0] text-xs mb-1">{tool.brand} · {tool.users} người dùng</p>
            <p className="text-[#A0A0B0] text-xs leading-relaxed mb-3">{tool.description}</p>
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-sm font-medium">{tool.rating}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-bold">{tool.price}₫/tháng</p>
                <p className="text-[#A0A0B0] text-xs">{tool.priceUSD}/month</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
                <ShoppingCart className="w-3.5 h-3.5" />
                Mua ngay
              </button>
              <a href="#" className="flex items-center justify-center w-10 h-10 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl hover:border-cyan-500/40 transition-all">
                <ExternalLink className="w-4 h-4 text-[#A0A0B0]" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
