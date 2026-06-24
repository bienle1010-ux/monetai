"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Star, ShoppingCart, Search, Plus, X, Copy, CheckCircle2, QrCode } from "lucide-react";
import { useAuth, UNLIMITED_CREDITS } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "monetai.vn@gmail.com";
const MB_ACCOUNT  = "0971166299";
const MB_NAME     = "LE VAN BIEN";

const agents = [
  { id: 1, name: "Sales Bot Pro",        desc: "AI Agent tự động tư vấn bán hàng 24/7, tích hợp Facebook Messenger, Zalo, Website.", price: 299_000, priceLabel: "299.000", priceType: "tháng", rating: 4.9, reviews: 234, category: "Sales",      seller: "MonetAI Official" },
  { id: 2, name: "Content Writer AI",    desc: "Tự động tạo 50+ bài viết mỗi ngày với giọng văn nhất quán theo brand.",              price: 499_000, priceLabel: "499.000", priceType: "tháng", rating: 4.8, reviews: 187, category: "Content",    seller: "AI Studio VN" },
  { id: 3, name: "Customer Care Agent",  desc: "Xử lý 1000+ yêu cầu khách hàng/ngày, tự động phân loại và escalate.",               price: 699_000, priceLabel: "699.000", priceType: "tháng", rating: 4.7, reviews: 156, category: "Support",    seller: "TechAI Labs" },
  { id: 4, name: "Social Media Manager", desc: "Lên lịch đăng bài, tạo nội dung và theo dõi tương tác cho 10+ tài khoản.",           price: 399_000, priceLabel: "399.000", priceType: "tháng", rating: 4.6, reviews: 203, category: "Marketing", seller: "SocAI Media" },
  { id: 5, name: "SEO Optimizer Bot",    desc: "Tự động nghiên cứu từ khóa, tối ưu meta tags và tạo internal link.",                  price: 549_000, priceLabel: "549.000", priceType: "tháng", rating: 4.8, reviews: 142, category: "SEO",       seller: "SEO AI Pro" },
  { id: 6, name: "E-commerce Assistant", desc: "Quản lý đơn hàng, cập nhật tồn kho và gửi thông báo tự động.",                        price: 449_000, priceLabel: "449.000", priceType: "tháng", rating: 4.5, reviews: 98,  category: "E-commerce", seller: "Shop AI VN" },
];

const agentCats = ["Tất cả", "Sales", "Content", "Support", "Marketing", "SEO", "E-commerce"];

function vietqrUrl(amount: number, email: string, agentName: string) {
  const info = encodeURIComponent(`AGENT ${agentName} ${email}`);
  const name = encodeURIComponent(MB_NAME);
  return `https://img.vietqr.io/image/MB-${MB_ACCOUNT}-compact2.png?amount=${amount}&addInfo=${info}&accountName=${name}`;
}

export default function AgentMarketplacePage() {
  const { user } = useAuth();
  const [cat, setCat]         = useState("Tất cả");
  const [search, setSearch]   = useState("");
  const [buying, setBuying]   = useState<typeof agents[0] | null>(null);
  const [copied, setCopied]   = useState<string | null>(null);

  const isAdmin     = user?.email === ADMIN_EMAIL;
  const isUnlimited = isAdmin || user?.credits === UNLIMITED_CREDITS;

  const filtered = agents.filter((a) => {
    const matchCat    = cat === "Tất cả" || a.category === cat;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Agent Marketplace</h1>
              <p className="text-[#A0A0B0] text-sm">Mua, thuê AI Agent hoặc bán Agent bạn tạo</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
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
            className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {agentCats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-sm px-3 py-2 rounded-xl transition-all whitespace-nowrap ${cat === c ? "bg-[#FF6B00] text-white" : "bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white hover:border-[#FF6B00]/30"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((agent, i) => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}
            whileHover={{ y: -2, borderColor: "rgba(255,107,0,0.25)" }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-[#FF6B00]" />
              </div>
              <span className="text-xs bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-full">{agent.category}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{agent.name}</h3>
            <p className="text-[#A0A0B0] text-xs leading-relaxed mb-3">{agent.desc}</p>
            <p className="text-xs text-[#A0A0B0] mb-4">Bởi: <span className="text-[#FF6B00]">{agent.seller}</span></p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm font-medium">{agent.rating}</span>
                <span className="text-[#A0A0B0] text-xs">({agent.reviews})</span>
              </div>
              <div className="text-right">
                <span className="text-white font-bold">{agent.priceLabel}</span>
                <span className="text-[#A0A0B0] text-xs">₫/{agent.priceType}</span>
              </div>
            </div>

            <button
              onClick={() => setBuying(agent)}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Mua / Thuê ngay
            </button>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {buying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setBuying(null)} />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <button onClick={() => setBuying(null)} className="absolute top-4 right-4 text-[#A0A0B0] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <p className="text-white font-bold">{buying.name}</p>
                <p className="text-[#FF6B00] font-bold text-xl mt-1">{buying.priceLabel} ₫<span className="text-[#A0A0B0] text-sm font-normal">/{buying.priceType}</span></p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl p-3 mx-auto w-fit mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vietqrUrl(buying.price, user?.email ?? "", buying.name)}
                  alt="QR thanh toán"
                  width={210}
                  height={210}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 text-sm mb-4">
                {[
                  { label: "Ngân hàng", value: "MB Bank" },
                  { label: "Số TK", value: MB_ACCOUNT },
                  { label: "Chủ TK", value: MB_NAME },
                  { label: "Số tiền", value: `${buying.price.toLocaleString("vi-VN")} ₫` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-[#A0A0B0]">{r.label}:</span>
                    <span className="text-white font-medium">{r.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1 border-t border-[#2A2A3A]">
                  <span className="text-[#A0A0B0]">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-[#FF6B00] text-xs font-mono truncate max-w-[140px]">AGENT {buying.name.slice(0, 10)} {user?.email?.split("@")[0]}</code>
                    <button onClick={() => handleCopy(`AGENT ${buying.name} ${user?.email ?? ""}`, "agent-desc")} className="text-[#A0A0B0] hover:text-[#FF6B00] transition-colors shrink-0">
                      {copied === "agent-desc" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-3 text-xs text-center text-[#A0A0B0]">
                Sau khi thanh toán, liên hệ <strong className="text-white">0562 557 777</strong> hoặc email <strong className="text-white">monetai.vn@gmail.com</strong> để kích hoạt
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
