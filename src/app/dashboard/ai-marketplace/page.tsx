"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShoppingBag, Star, Search, X, Check, Plus,
  Upload, Package, TrendingUp, ChevronDown,
  Download, Store,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG      = "#0A0A0F";
const CARD    = "#16161F";
const BORDER  = "#2A2A3A";
const ORANGE  = "#FF6B00";
const MUTED   = "#A0A0B0";
const TEXT    = "#FFFFFF";
const INPUT_BG = "#0D0D16";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  author: string;
  rating: number;
  sales: number;
  icon: string;
  tags: string[];
  preview?: string;
}

interface ListingForm {
  title: string;
  category: string;
  description: string;
  price: string;
  fileNote: string;
}

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",        label: "Tất cả",                    icon: "🛍️" },
  { id: "prompt",     label: "Prompt Marketplace",         icon: "💬" },
  { id: "workflow",   label: "Workflow Marketplace",       icon: "⚙️" },
  { id: "agent",      label: "AI Agent Marketplace",       icon: "🤖" },
  { id: "template",   label: "Template Marketplace",       icon: "📋" },
  { id: "automation", label: "Automation Marketplace",     icon: "🔄" },
  { id: "gpt",        label: "GPT Marketplace",            icon: "🧠" },
  { id: "claude",     label: "Claude Prompt Store",        icon: "🔮" },
  { id: "midjourney", label: "Midjourney Prompt Store",    icon: "🎨" },
  { id: "canva",      label: "Canva Template Store",       icon: "✏️" },
  { id: "capcut",     label: "CapCut Template Store",      icon: "🎬" },
  { id: "excel",      label: "Excel Automation Store",     icon: "📊" },
  { id: "notion",     label: "Notion Template Store",      icon: "📝" },
  { id: "website",    label: "Website Template Store",     icon: "🌐" },
  { id: "landing",    label: "Landing Page Store",         icon: "📄" },
  { id: "funnel",     label: "Sales Funnel Store",         icon: "🔽" },
  { id: "marketing",  label: "Marketing Kit",              icon: "📢" },
  { id: "digital",    label: "Digital Product Store",      icon: "💾" },
  { id: "plugin",     label: "AI Plugin Store",            icon: "🔌" },
];

// ─── Sample products ──────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "prod-001", category: "prompt", icon: "💬",
    title: "Mega Prompt Bundle ChatGPT — 200+ Prompt Marketing",
    description: "Bộ 200+ prompt ChatGPT chuyên dụng cho marketing, bán hàng, content, email, SEO. Đã qua kiểm tra thực tế.",
    price: 299000, author: "MonetAI Store", rating: 4.9, sales: 1250,
    tags: ["ChatGPT", "Marketing", "Content"], preview: "Act as an expert marketer. Write a viral Facebook post for {{product}} targeting {{audience}}...",
  },
  {
    id: "prod-002", category: "workflow", icon: "⚙️",
    title: "n8n Affiliate Automation Workflow — Full Pipeline",
    description: "Workflow n8n tự động hóa toàn bộ quy trình affiliate: tracking click, ghi nhận hoa hồng, gửi email báo cáo.",
    price: 499000, author: "AutoFlow.vn", rating: 4.8, sales: 342,
    tags: ["n8n", "Automation", "Affiliate"], preview: "Trigger: Webhook → Filter valid clicks → Update Google Sheet → Send Telegram notification...",
  },
  {
    id: "prod-003", category: "agent", icon: "🤖",
    title: "AI Sales Agent — Claude Opus Powered",
    description: "AI Agent tư vấn bán hàng 24/7 tích hợp Claude Opus. Tự động trả lời, chốt đơn, follow-up khách hàng.",
    price: 899000, author: "AgentPro", rating: 5.0, sales: 87,
    tags: ["Claude", "Sales", "Agent"], preview: "Chào bạn! Tôi là trợ lý bán hàng AI. Bạn đang tìm kiếm sản phẩm gì?",
  },
  {
    id: "prod-004", category: "canva", icon: "✏️",
    title: "Canva Social Media Pack — 200+ Templates",
    description: "200+ template Canva cho Facebook, Instagram, TikTok. Đã edit-ready, phù hợp mọi ngành hàng.",
    price: 199000, author: "DesignHub", rating: 4.7, sales: 2100,
    tags: ["Canva", "Social Media", "Design"], preview: "Bộ template bao gồm: 80 post Facebook, 60 Story/Reels, 40 TikTok thumbnail, 20 Banner quảng cáo.",
  },
  {
    id: "prod-005", category: "capcut", icon: "🎬",
    title: "CapCut TikTok Template Bundle — 50 Templates Viral",
    description: "50 template CapCut cho video TikTok viral. Bao gồm transition, text animation, effect HOT nhất 2025.",
    price: 149000, author: "VideoCreator", rating: 4.8, sales: 3400,
    tags: ["CapCut", "TikTok", "Video"], preview: "50 templates: Lifestyle vlog, Product review, Before/After, Trending sounds pre-synced.",
  },
  {
    id: "prod-006", category: "gpt", icon: "🧠",
    title: "GPT-4 Business Advisor — Custom GPT",
    description: "Custom GPT chuyên tư vấn kinh doanh, lập kế hoạch marketing, phân tích đối thủ và dự báo doanh thu.",
    price: 399000, author: "BizAI", rating: 4.9, sales: 156,
    tags: ["GPT-4", "Business", "Strategy"], preview: "I am your AI business advisor. Provide me with your business details and I will help you create a comprehensive growth strategy.",
  },
  {
    id: "prod-007", category: "claude", icon: "🔮",
    title: "Claude Mega Prompt Pack — Content & Copywriting",
    description: "100+ prompt Claude tối ưu cho content writing, copywriting, email marketing. Kết quả vượt trội so với ChatGPT.",
    price: 249000, author: "ClaudeExpert", rating: 4.9, sales: 423,
    tags: ["Claude", "Copywriting", "Content"], preview: "You are an expert copywriter specializing in Vietnamese marketing. Create compelling {{content_type}} for {{brand}}...",
  },
  {
    id: "prod-008", category: "midjourney", icon: "🎨",
    title: "Midjourney Prompt Collection — 500 Art Prompts",
    description: "500 prompt Midjourney chuyên nghiệp: product photography, logo concept, social media visual, NFT art.",
    price: 179000, author: "ArtPrompt.ai", rating: 4.6, sales: 892,
    tags: ["Midjourney", "Art", "Design"], preview: "Ultra-realistic product photography, {{product}}, white background, studio lighting, 8K resolution, commercial quality --ar 1:1 --v 6",
  },
  {
    id: "prod-009", category: "notion", icon: "📝",
    title: "Notion AI Business OS — Hệ thống quản lý toàn diện",
    description: "Hệ thống Notion tích hợp AI: CRM, project management, content calendar, finance tracker, OKR dashboard.",
    price: 299000, author: "NotionPro", rating: 4.8, sales: 671,
    tags: ["Notion", "Productivity", "Business"], preview: "Dashboard: CRM với 15 trường dữ liệu → Project Board → Content Calendar liên kết → Finance Tracker tự động.",
  },
  {
    id: "prod-010", category: "excel", icon: "📊",
    title: "Excel AI Automation — Macro & Formula Bundle",
    description: "Bộ macro VBA + công thức Excel nâng cao tích hợp AI API. Tự động hóa báo cáo, phân tích data, tạo chart.",
    price: 349000, author: "ExcelMaster", rating: 4.7, sales: 234,
    tags: ["Excel", "VBA", "Automation"], preview: "Module tự động: Import data → Clean & normalize → Phân tích bằng AI → Generate báo cáo PDF trong 1 click.",
  },
  {
    id: "prod-011", category: "automation", icon: "🔄",
    title: "Make.com eCommerce Automation — Shopify + Zalo + FB",
    description: "Kịch bản automation Make.com kết nối Shopify, Zalo OA, Facebook Lead Ads. Tự động chăm sóc khách hàng.",
    price: 599000, author: "MakeExpert", rating: 4.9, sales: 118,
    tags: ["Make.com", "eCommerce", "Zalo"], preview: "Trigger: New Shopify order → Send Zalo OA confirmation → Update CRM → Schedule follow-up after 3 days.",
  },
  {
    id: "prod-012", category: "landing", icon: "📄",
    title: "Landing Page Templates — 30 High-Converting Pages",
    description: "30 template landing page tỷ lệ chuyển đổi cao: webinar, product launch, lead gen, affiliate, event.",
    price: 449000, author: "LandingPro", rating: 4.8, sales: 389,
    tags: ["Landing Page", "Conversion", "HTML"], preview: "30 templates: Webinar registration (CVR ~35%), Product launch (CVR ~12%), Lead magnet (CVR ~28%).",
  },
  {
    id: "prod-013", category: "funnel", icon: "🔽",
    title: "Sales Funnel Blueprint — Affiliate + Digital Product",
    description: "Bản thiết kế funnel bán hàng hoàn chỉnh: opt-in → tripwire → core offer → upsell → downsell + email sequence.",
    price: 699000, author: "FunnelAI", rating: 5.0, sales: 67,
    tags: ["Funnel", "Sales", "Email"], preview: "Full funnel: Opt-in page → Thank you → Tripwire $7 → Core offer $97 → Upsell $197 + 7-email automation sequence.",
  },
  {
    id: "prod-014", category: "marketing", icon: "📢",
    title: "AI Marketing Kit — Complete Campaign Package",
    description: "Bộ công cụ marketing toàn diện: ad copy, email templates, social content, influencer brief, KPI dashboard.",
    price: 399000, author: "MarketingAI", rating: 4.7, sales: 201,
    tags: ["Marketing", "Ads", "Campaign"], preview: "Package: 50 Facebook ad copies + 30 email templates + Social media calendar 30 days + KPI tracker.",
  },
  {
    id: "prod-015", category: "template", icon: "📋",
    title: "AI Proposal & Contract Templates — 25 Business Docs",
    description: "25 mẫu hợp đồng và đề xuất kinh doanh chuyên nghiệp cho agency, freelancer, dịch vụ AI.",
    price: 189000, author: "DocPro", rating: 4.6, sales: 445,
    tags: ["Template", "Business", "Contract"], preview: "Bao gồm: Service Agreement, NDA, Affiliate Contract, SaaS Terms, Influencer Brief, Project Proposal.",
  },
  {
    id: "prod-016", category: "plugin", icon: "🔌",
    title: "Chrome AI Extension Pack — 5 Productivity Tools",
    description: "5 extension Chrome tích hợp AI: auto-summarize, translate, rewrite, SEO checker, affiliate link tracker.",
    price: 159000, author: "ExtensionLab", rating: 4.5, sales: 778,
    tags: ["Chrome", "Extension", "AI"], preview: "5 tools: AI Summarizer, Smart Translator, Rewriter Pro, SEO Analyzer, Affiliate Tracker v2.",
  },
  {
    id: "prod-017", category: "digital", icon: "💾",
    title: "AI Digital Product Blueprint — Xây dựng & Bán sản phẩm số",
    description: "Hướng dẫn đầy đủ xây dựng và bán digital product: ebook, course, SaaS, template. Kèm template và checklist.",
    price: 279000, author: "DigitalCoach", rating: 4.8, sales: 334,
    tags: ["Digital Product", "Business", "Guide"], preview: "Roadmap: Validate idea → Create product → Build sales page → Launch → Scale with automation.",
  },
  {
    id: "prod-018", category: "website", icon: "🌐",
    title: "Next.js AI SaaS Starter Kit — Template Pro",
    description: "Boilerplate Next.js 14 đầy đủ: auth, payments, AI integration, dashboard, analytics. Deploy trong 1 giờ.",
    price: 799000, author: "DevStarter", rating: 4.9, sales: 89,
    tags: ["Next.js", "SaaS", "Template"], preview: "Stack: Next.js 14 + Tailwind + Clerk Auth + Stripe + OpenAI + Vercel Analytics. Fully typed TypeScript.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtVnd(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} fill={i < Math.round(rating) ? "currentColor" : "none"} />
      ))}
      <span className="ml-1" style={{ color: MUTED }}>{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, onBuy }: { product: Product; onBuy: (p: Product) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(255,107,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300"
      style={{ background: CARD, border: `1px solid ${BORDER}` }}
    >
      {/* Icon + category */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "rgba(255,107,0,0.12)" }}>
          {product.icon}
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,107,0,0.15)", color: ORANGE }}>
          {CATEGORIES.find(c => c.id === product.category)?.label.split(" ")[0] ?? product.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: TEXT }}>
        {product.title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: MUTED }}>
        {product.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {product.tags.slice(0, 3).map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "#1A1A28", color: MUTED }}>
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: BORDER }}>
        <div>
          <Stars rating={product.rating} />
          <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>
            {product.sales.toLocaleString()} lượt mua
          </p>
          <p className="text-[10px]" style={{ color: MUTED }}>by {product.author}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-bold text-sm" style={{ color: ORANGE }}>{fmtVnd(product.price)}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => onBuy(product)}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{ background: ORANGE, color: TEXT }}
          >
            Mua ngay
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── BuyModal ─────────────────────────────────────────────────────────────────
function BuyModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [step, setStep] = useState<"detail" | "payment" | "success">("detail");
  const qrUrl = `https://api.vietqr.io/image/MB-0971166299-compact2.png?amount=${product.price}&addInfo=MONETAI+${product.id.slice(-6).toUpperCase()}&accountName=MONET%20AI`;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 transition-colors hover:opacity-70" style={{ color: MUTED }}>
          <X size={18} />
        </button>

        {/* Detail step */}
        {step === "detail" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,107,0,0.12)" }}>
                {product.icon}
              </div>
              <div>
                <h2 className="font-bold text-base leading-snug" style={{ color: TEXT }}>{product.title}</h2>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>by {product.author}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{product.description}</p>

            {product.preview && (
              <div className="rounded-xl p-3 text-xs leading-relaxed font-mono border"
                style={{ background: INPUT_BG, borderColor: BORDER, color: "#C0C0D0" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>Preview</p>
                {product.preview}
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-t border-b" style={{ borderColor: BORDER }}>
              <Stars rating={product.rating} />
              <span className="text-xs" style={{ color: MUTED }}>{product.sales.toLocaleString()} lượt mua</span>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: ORANGE }}>{fmtVnd(product.price)}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("payment")}
              className="w-full py-3 rounded-xl font-semibold"
              style={{ background: ORANGE, color: TEXT }}
            >
              Tiến hành thanh toán →
            </motion.button>
          </div>
        )}

        {/* Payment step */}
        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: TEXT }}>Thanh toán VietQR</h2>
            <p className="text-sm line-clamp-1" style={{ color: MUTED }}>{product.title}</p>
            <div className="text-center text-3xl font-bold" style={{ color: ORANGE }}>{fmtVnd(product.price)}</div>

            <div className="rounded-xl p-4 flex flex-col items-center gap-3 border"
              style={{ background: INPUT_BG, borderColor: BORDER }}>
              <div className="bg-white rounded-xl p-2">
                <Image
                  src={qrUrl}
                  alt="VietQR thanh toán"
                  width={200}
                  height={200}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div className="text-xs text-center space-y-1" style={{ color: MUTED }}>
                <p>MB Bank · 0971166299 · MONET AI</p>
                <p className="font-mono px-3 py-1 rounded" style={{ background: BORDER, color: TEXT }}>
                  MONETAI {product.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="text-xs p-3 rounded-xl" style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)", color: MUTED }}>
              Sau khi chuyển khoản, sản phẩm sẽ được gửi qua email trong 30 phút. Liên hệ{" "}
              <span style={{ color: ORANGE }}>0562 557 777</span> nếu cần hỗ trợ.
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("success")}
              className="w-full py-3 rounded-xl font-semibold"
              style={{ background: ORANGE, color: TEXT }}
            >
              Tôi đã chuyển khoản thành công →
            </motion.button>

            <button onClick={() => setStep("detail")} className="w-full text-sm py-2 transition-opacity hover:opacity-70" style={{ color: MUTED }}>
              ← Quay lại
            </button>
          </div>
        )}

        {/* Success step */}
        {step === "success" && (
          <div className="text-center space-y-4 py-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-xl font-bold" style={{ color: TEXT }}>Mua hàng thành công!</h2>
            <p className="text-sm" style={{ color: MUTED }}>
              Sản phẩm <strong style={{ color: TEXT }}>{product.title}</strong> sẽ được gửi qua email trong vòng 30 phút.
            </p>
            <div className="rounded-xl p-3 text-xs text-left space-y-1 border" style={{ background: INPUT_BG, borderColor: BORDER }}>
              <p style={{ color: MUTED }}>Liên hệ hỗ trợ:</p>
              <p style={{ color: ORANGE }}>Email: monetai.vn@gmail.com</p>
              <p style={{ color: ORANGE }}>Hotline: 0562 557 777</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ background: ORANGE, color: TEXT }}
            >
              <Download size={16} />
              Hoàn thành & Đóng
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── SellTab ──────────────────────────────────────────────────────────────────
const SELL_CATEGORY_OPTIONS = CATEGORIES.filter(c => c.id !== "all").map(c => c.label);

const BLANK_FORM: ListingForm = {
  title: "", category: "", description: "", price: "", fileNote: "",
};

function SellTab({ userEmail }: { userEmail: string }) {
  const [form, setForm] = useState<ListingForm>(BLANK_FORM);
  const [done, setDone] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState("");

  function f(k: keyof ListingForm, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const key = `monetai_marketplace_listings_${userEmail}`;
    const existing: ListingForm[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    existing.push({ ...form });
    localStorage.setItem(key, JSON.stringify(existing));
    setSubmittedTitle(form.title);
    setDone(true);
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]";
  const inputSty = { background: INPUT_BG, borderColor: BORDER, color: TEXT } as React.CSSProperties;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center max-w-md mx-auto">
        <div className="text-6xl">🚀</div>
        <h2 className="text-2xl font-bold" style={{ color: TEXT }}>Đã gửi đăng bán!</h2>
        <p style={{ color: MUTED }}>
          Sản phẩm <strong style={{ color: TEXT }}>{submittedTitle}</strong> đang chờ duyệt.
          Chúng tôi sẽ liên hệ qua email trong 24h.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setDone(false); setForm(BLANK_FORM); }}
          className="py-3 px-8 rounded-xl font-semibold"
          style={{ background: ORANGE, color: TEXT }}
        >
          Đăng sản phẩm mới
        </motion.button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      <div className="rounded-2xl p-6 space-y-4 border" style={{ background: CARD, borderColor: BORDER }}>
        <h2 className="text-lg font-bold" style={{ color: TEXT }}>Đăng bán sản phẩm AI</h2>
        <p className="text-sm" style={{ color: MUTED }}>
          MonetAI kết nối bạn với hàng nghìn khách hàng tiềm năng. Chúng tôi thu 20% phí nền tảng.
        </p>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Tên sản phẩm <span style={{ color: ORANGE }}>*</span>
          </label>
          <input
            value={form.title}
            onChange={e => f("title", e.target.value)}
            placeholder="VD: Mega Prompt Bundle cho Marketing 2025"
            required
            className={inputCls}
            style={inputSty}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Danh mục <span style={{ color: ORANGE }}>*</span>
          </label>
          <div className="relative">
            <select
              value={form.category}
              onChange={e => f("category", e.target.value)}
              required
              className={`${inputCls} appearance-none pr-8`}
              style={{ ...inputSty, cursor: "pointer" }}
            >
              <option value="" style={{ background: CARD }}>-- Chọn danh mục --</option>
              {SELL_CATEGORY_OPTIONS.map(o => (
                <option key={o} value={o} style={{ background: CARD }}>{o}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: MUTED }} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Mô tả sản phẩm <span style={{ color: ORANGE }}>*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => f("description", e.target.value)}
            placeholder="Sản phẩm này làm gì, dành cho ai, kết quả mang lại như thế nào..."
            rows={4}
            required
            className={`${inputCls} resize-none`}
            style={inputSty}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Giá bán (VNĐ) <span style={{ color: ORANGE }}>*</span>
          </label>
          <input
            type="number"
            value={form.price}
            onChange={e => f("price", e.target.value)}
            placeholder="VD: 299000"
            min="0"
            required
            className={inputCls}
            style={inputSty}
          />
          <p className="text-xs mt-1" style={{ color: MUTED }}>Bạn nhận 80% sau khi MonetAI thu 20% phí nền tảng.</p>
        </div>

        {/* File Note */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Thông tin file / link giao hàng
          </label>
          <input
            value={form.fileNote}
            onChange={e => f("fileNote", e.target.value)}
            placeholder="VD: Google Drive link, Notion link, file PDF..."
            className={inputCls}
            style={inputSty}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!form.title || !form.category || !form.description || !form.price}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: ORANGE, color: TEXT }}
      >
        <Upload size={16} />
        Gửi đăng bán
      </motion.button>
    </form>
  );
}

// ─── MyListingsTab ────────────────────────────────────────────────────────────
function MyListingsTab({ userEmail }: { userEmail: string }) {
  const [listings, setListings] = useState<ListingForm[]>([]);

  useEffect(() => {
    try {
      const key = `monetai_marketplace_listings_${userEmail}`;
      const stored: ListingForm[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      setListings(stored);
    } catch {
      setListings([]);
    }
  }, [userEmail]);

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-5xl">📦</div>
        <h3 className="text-lg font-semibold" style={{ color: TEXT }}>Chưa có sản phẩm nào</h3>
        <p style={{ color: MUTED }}>Bạn chưa đăng bán sản phẩm nào. Hãy bắt đầu bán ngay!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: TEXT }}>
        Sản phẩm của tôi ({listings.length})
      </h3>
      {listings.map((item, i) => (
        <div key={i} className="rounded-2xl p-4 border flex items-center gap-4 flex-wrap"
          style={{ background: CARD, borderColor: BORDER }}>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm line-clamp-1" style={{ color: TEXT }}>{item.title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.15)", color: ORANGE }}>
                {item.category}
              </span>
              <span className="text-xs font-bold" style={{ color: ORANGE }}>
                {item.price ? fmtVnd(parseInt(item.price)) : "—"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,165,0,0.15)", color: "#FFA500" }}>
                Chờ duyệt
              </span>
            </div>
          </div>
          <p className="text-xs line-clamp-2 max-w-xs" style={{ color: MUTED }}>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Tab = "browse" | "sell" | "mine";

export default function AIMarketplacePage() {
  const { user } = useAuth();
  const [tab, setTab]               = useState<Tab>("browse");
  const [search, setSearch]         = useState("");
  const [activeCategory, setCategory] = useState("all");
  const [buyTarget, setBuyTarget]   = useState<Product | null>(null);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const TABS: { key: Tab; label: string }[] = [
    { key: "browse", label: "🔍 Mua sản phẩm" },
    { key: "sell",   label: "💰 Bán sản phẩm"  },
    { key: "mine",   label: "📦 Sản phẩm của tôi" },
  ];

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 border-b" style={{ background: "#111118", borderColor: BORDER }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,107,0,0.15)" }}>
                <Store size={18} style={{ color: ORANGE }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold" style={{ color: TEXT }}>AI Marketplace</h1>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.2)", color: ORANGE }}>
                    {PRODUCTS.length}+ sản phẩm
                  </span>
                </div>
                <p className="text-xs" style={{ color: MUTED }}>Chợ mua bán sản phẩm AI lớn nhất Việt Nam</p>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 rounded-xl p-1 border" style={{ background: CARD, borderColor: BORDER }}>
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                  style={tab === t.key
                    ? { background: ORANGE, color: TEXT }
                    : { color: MUTED }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── BROWSE TAB ── */}
        {tab === "browse" && (
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Package size={16} style={{ color: ORANGE }} />, label: "Sản phẩm", value: `${PRODUCTS.length}+` },
                { icon: <TrendingUp size={16} style={{ color: ORANGE }} />, label: "Đã bán", value: "12.400+" },
                { icon: <Star size={16} style={{ color: ORANGE }} />, label: "Đánh giá TB", value: "4.8/5" },
                { icon: <ShoppingBag size={16} style={{ color: ORANGE }} />, label: "Danh mục", value: "18" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3 border flex items-center gap-3"
                  style={{ background: CARD, borderColor: BORDER }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,107,0,0.12)" }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-bold text-base leading-none" style={{ color: TEXT }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm AI, prompt, workflow, template..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                style={{ background: CARD, borderColor: BORDER, color: TEXT }}
              />
            </div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0"
                  style={activeCategory === cat.id
                    ? { background: "rgba(255,107,0,0.15)", borderColor: ORANGE, color: ORANGE }
                    : { background: "transparent", borderColor: BORDER, color: MUTED }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-sm" style={{ color: MUTED }}>
              Hiển thị <span style={{ color: TEXT, fontWeight: 600 }}>{filtered.length}</span> sản phẩm
              {activeCategory !== "all" && ` trong "${CATEGORIES.find(c => c.id === activeCategory)?.label}"`}
              {search && ` · tìm kiếm "${search}"`}
            </p>

            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Search size={40} className="mx-auto opacity-20" style={{ color: MUTED }} />
                <p className="font-semibold" style={{ color: TEXT }}>Không tìm thấy sản phẩm nào</p>
                <p className="text-sm" style={{ color: MUTED }}>Thử tìm kiếm khác hoặc xóa bộ lọc danh mục</p>
                <button onClick={() => { setSearch(""); setCategory("all"); }}
                  className="text-sm hover:underline" style={{ color: ORANGE }}>
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onBuy={product => {
                      if (!user) { alert("Vui lòng đăng nhập để mua sản phẩm."); return; }
                      setBuyTarget(product);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SELL TAB ── */}
        {tab === "sell" && (
          user ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: TEXT }}>Đăng bán sản phẩm AI</h2>
                <p className="text-sm mt-1" style={{ color: MUTED }}>
                  Kiếm tiền thụ động bằng cách bán prompt, workflow, template, agent của bạn.
                </p>
              </div>
              <SellTab userEmail={user.email} />
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <div className="text-5xl">🔐</div>
              <h2 className="text-xl font-bold" style={{ color: TEXT }}>Đăng nhập để bán sản phẩm</h2>
              <p style={{ color: MUTED }}>Bạn cần đăng nhập để đăng bán sản phẩm AI trên MonetAI.</p>
            </div>
          )
        )}

        {/* ── MY LISTINGS TAB ── */}
        {tab === "mine" && (
          user ? (
            <MyListingsTab userEmail={user.email} />
          ) : (
            <div className="text-center py-24 space-y-4">
              <div className="text-5xl">🔐</div>
              <h2 className="text-xl font-bold" style={{ color: TEXT }}>Đăng nhập để xem sản phẩm của bạn</h2>
              <p style={{ color: MUTED }}>Bạn cần đăng nhập để quản lý sản phẩm đã đăng bán.</p>
            </div>
          )
        )}
      </div>

      {/* Buy Modal */}
      <AnimatePresence>
        {buyTarget && (
          <BuyModal key="buy-modal" product={buyTarget} onClose={() => setBuyTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
