"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, MousePointer, ShoppingCart, Copy, ExternalLink, Star, RefreshCw, Flame } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  commission: string;
  price: string;
  affiliate_link: string;
  rating: number;
  is_hot: boolean;
}

export default function AffiliatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Tất cả");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/affiliate/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Tất cả", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = cat === "Tất cả" ? products : products.filter((p) => p.category === cat);

  const copyLink = (id: number, link: string) => {
    const url = link && link !== "#" ? link : `https://monetai.vn/ref/${id}?aff=user`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Affiliate Marketplace</h1>
            <p className="text-[#A0A0B0] text-sm">Tìm sản phẩm, lấy link và bắt đầu kiếm hoa hồng</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng hoa hồng", value: "0 ₫", icon: DollarSign },
          { label: "Lượt click", value: "0", icon: MousePointer },
          { label: "Đơn hàng", value: "0", icon: ShoppingCart },
          { label: "Sản phẩm đang quảng bá", value: "0", icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-[#A0A0B0] text-xs">{s.label}</span>
            </div>
            <p className="text-white font-bold text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-sm px-4 py-2 rounded-xl transition-all ${
              cat === c ? "bg-[#FF6B00] text-white" : "bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white hover:border-[#FF6B00]/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
        </div>
      )}

      {/* Products grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5 hover:border-[#FF6B00]/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                    {product.is_hot && (
                      <span className="flex items-center gap-0.5 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                        <Flame className="w-2.5 h-2.5" />HOT
                      </span>
                    )}
                  </div>
                  <p className="text-[#A0A0B0] text-xs">{product.brand} · {product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#FF6B00] font-bold text-lg">{product.commission}</p>
                  <p className="text-[#A0A0B0] text-xs">hoa hồng</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[#A0A0B0] text-xs">{product.rating}</span>
                </div>
                <span className="text-[#A0A0B0] text-xs">{product.price}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(product.id, product.affiliate_link)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedId === product.id ? "Đã sao chép!" : "Lấy link"}
                </button>
                {product.affiliate_link && product.affiliate_link !== "#" ? (
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl hover:border-[#FF6B00]/40 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-[#A0A0B0]" />
                  </a>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl opacity-40">
                    <ExternalLink className="w-4 h-4 text-[#A0A0B0]" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
