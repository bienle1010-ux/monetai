"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Star, ShoppingCart, Search, Plus } from "lucide-react";

const agents = [
  { id: 1, name: "Sales Bot Pro", description: "AI Agent tự động tư vấn bán hàng 24/7, tích hợp Facebook Messenger, Zalo, Website.", price: "299.000", priceType: "tháng", rating: 4.9, reviews: 234, category: "Sales", seller: "MonetAI Official" },
  { id: 2, name: "Content Writer AI", description: "Tự động tạo 50+ bài viết mỗi ngày với giọng văn nhất quán theo brand.", price: "499.000", priceType: "tháng", rating: 4.8, reviews: 187, category: "Content", seller: "AI Studio VN" },
  { id: 3, name: "Customer Care Agent", description: "Xử lý 1000+ yêu cầu khách hàng/ngày, tự động phân loại và escalate.", price: "699.000", priceType: "tháng", rating: 4.7, reviews: 156, category: "Support", seller: "TechAI Labs" },
  { id: 4, name: "Social Media Manager", description: "Lên lịch đăng bài, tạo nội dung và theo dõi tương tác cho 10+ tài khoản.", price: "399.000", priceType: "tháng", rating: 4.6, reviews: 203, category: "Marketing", seller: "SocAI Media" },
  { id: 5, name: "SEO Optimizer Bot", description: "Tự động nghiên cứu từ khóa, tối ưu meta tags và tạo internal link.", price: "549.000", priceType: "tháng", rating: 4.8, reviews: 142, category: "SEO", seller: "SEO AI Pro" },
  { id: 6, name: "E-commerce Assistant", description: "Quản lý đơn hàng, cập nhật tồn kho và gửi thông báo tự động.", price: "449.000", priceType: "tháng", rating: 4.5, reviews: 98, category: "E-commerce", seller: "Shop AI VN" },
];

const agentCats = ["Tất cả", "Sales", "Content", "Support", "Marketing", "SEO", "E-commerce"];

export default function AgentMarketplacePage() {
  const [cat, setCat] = useState("Tất cả");
  const [search, setSearch] = useState("");

  const filtered = agents.filter((a) => {
    const matchCat = cat === "Tất cả" || a.category === cat;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Agent Marketplace</h1>
              <p className="text-[#A0A0B0] text-sm">Mua, thuê AI Agent hoặc bán Agent bạn tạo</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Bán Agent của bạn
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm AI Agent..."
            className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {agentCats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-sm px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                cat === c ? "bg-green-600 text-white" : "bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            whileHover={{ y: -2, borderColor: "rgba(16,185,129,0.3)" }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{agent.category}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{agent.name}</h3>
            <p className="text-[#A0A0B0] text-xs leading-relaxed mb-3">{agent.description}</p>
            <p className="text-xs text-[#A0A0B0] mb-4">Bởi: <span className="text-green-400">{agent.seller}</span></p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm font-medium">{agent.rating}</span>
                <span className="text-[#A0A0B0] text-xs">({agent.reviews})</span>
              </div>
              <div className="text-right">
                <span className="text-white font-bold">{agent.price}</span>
                <span className="text-[#A0A0B0] text-xs">₫/{agent.priceType}</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
              <ShoppingCart className="w-4 h-4" />
              Mua / Thuê ngay
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
