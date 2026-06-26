"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Star, Search, X, Copy, CheckCircle2, QrCode,
  Send, Sparkles, Users, ShoppingBag, Plus, MessageSquare,
  Tag, DollarSign, TrendingUp, ChevronRight,
} from "lucide-react";
import { useAuth, ADMIN_EMAIL } from "@/contexts/AuthContext";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG      = "#0A0A0F";
const CARD    = "#16161F";
const BORDER  = "#2A2A3A";
const ORANGE  = "#FF6B00";
const MUTED   = "#A0A0B0";
const TEXT    = "#FFFFFF";
const INPUT_BG = "#0D0D16";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AIAgent {
  id: string;
  name: string;
  category: "Sales" | "Marketing" | "Content" | "Business" | "E-commerce" | "Finance" | "Education" | "Personal";
  icon: string;
  description: string;
  capabilities: string[];
  price: number;
  priceMonthly?: number;
  rating: number;
  users: number;
  badge?: "HOT" | "NEW" | "PRO" | "FREE";
  systemPrompt: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Agent data ─────────────────────────────────────────────────────────────────
const AGENTS: AIAgent[] = [
  // Sales
  { id: "ai-sales-agent", name: "AI Sales Agent", category: "Sales", icon: "💰", description: "Agent bán hàng tự động, tư vấn và chốt đơn 24/7", capabilities: ["Tư vấn sản phẩm thông minh", "Xử lý objection", "Chốt đơn tự động", "Follow-up khách hàng"], price: 0, priceMonthly: 499000, rating: 4.9, users: 2847, badge: "HOT", systemPrompt: "Bạn là AI Sales Agent chuyên nghiệp. Bạn tư vấn sản phẩm, xử lý objection, và chốt đơn hàng. Hãy hỏi về nhu cầu của khách hàng và đưa ra giải pháp phù hợp nhất. Friendly, persuasive, helpful." },
  { id: "ai-sales-closer", name: "AI Sales Closer", category: "Sales", icon: "🎯", description: "Chuyên gia chốt sale với kỹ thuật đỉnh cao", capabilities: ["Kỹ thuật chốt đơn cao cấp", "Xử lý từ chối chuyên nghiệp", "Tạo urgency & scarcity", "Upsell & Cross-sell"], price: 299000, priceMonthly: 299000, rating: 4.8, users: 1563, badge: "PRO", systemPrompt: "Bạn là AI Sales Closer hàng đầu, chuyên chốt đơn trong các tình huống khó. Sử dụng kỹ thuật SPIN Selling, Solution Selling và các phương pháp chốt đơn hiện đại. Hãy giúp user chốt đơn cho sản phẩm/dịch vụ cụ thể." },
  { id: "ai-telesales", name: "AI TeleSales", category: "Sales", icon: "📞", description: "Script và hỗ trợ telesales chuyên nghiệp", capabilities: ["Script gọi điện thoại", "Xử lý cúp máy", "Booking lịch hẹn", "Follow-up sau gọi"], price: 0, priceMonthly: 349000, rating: 4.7, users: 921, badge: "NEW", systemPrompt: "Bạn là AI TeleSales Coach. Bạn tạo script gọi điện thoại, training cách xử lý phản đối qua điện thoại, và giúp đặt lịch hẹn. Cung cấp script chi tiết và roleplay scenarios." },
  { id: "ai-crm-agent", name: "AI CRM Agent", category: "Sales", icon: "📋", description: "Quản lý quan hệ khách hàng tự động với AI", capabilities: ["Phân loại khách hàng", "Nhắc nhở follow-up", "Pipeline management", "Báo cáo sales"], price: 199000, priceMonthly: 199000, rating: 4.6, users: 734, systemPrompt: "Bạn là AI CRM Agent, giúp quản lý quan hệ khách hàng. Phân tích customer data, đề xuất action items, lập kế hoạch follow-up, và tối ưu sales pipeline. Cụ thể và actionable." },
  // Marketing
  { id: "ai-marketing-agent", name: "AI Marketing Agent", category: "Marketing", icon: "📊", description: "Lập chiến lược marketing toàn diện với AI", capabilities: ["Marketing strategy", "Campaign planning", "Budget optimization", "ROI analysis"], price: 0, priceMonthly: 599000, rating: 4.9, users: 3241, badge: "HOT", systemPrompt: "Bạn là AI Marketing Agent với chuyên môn về digital marketing. Lập chiến lược marketing, phân tích campaign, tối ưu budget, và đo lường hiệu quả. Data-driven và strategic thinking." },
  { id: "ai-facebook-ads", name: "AI Facebook Ads", category: "Marketing", icon: "📘", description: "Tối ưu Facebook Ads với AI", capabilities: ["Tạo ad copy", "Targeting strategy", "Bid optimization", "A/B testing"], price: 149000, priceMonthly: 149000, rating: 4.7, users: 2108, badge: "HOT", systemPrompt: "Bạn là Facebook Ads Specialist AI. Tạo ad copy, thiết lập targeting, tối ưu bid strategy, và phân tích performance. Bao gồm cả Facebook và Instagram ads." },
  { id: "ai-google-ads", name: "AI Google Ads", category: "Marketing", icon: "🔍", description: "Tối ưu Google Ads, Search & Display", capabilities: ["Keyword research", "Ad copy optimization", "Quality Score", "Shopping Ads"], price: 149000, priceMonthly: 149000, rating: 4.6, users: 1456, systemPrompt: "Bạn là Google Ads Specialist AI. Tư vấn keyword strategy, viết ad copy chuẩn, tối ưu Quality Score, và manage Google Shopping. Bao gồm Search, Display, và YouTube ads." },
  { id: "ai-tiktok-ads", name: "AI TikTok Ads", category: "Marketing", icon: "🎵", description: "Chinh phục TikTok Ads với AI", capabilities: ["Creative strategy", "Spark Ads", "TikTok Shop Ads", "Audience targeting"], price: 129000, priceMonthly: 129000, rating: 4.8, users: 1893, badge: "HOT", systemPrompt: "Bạn là TikTok Ads Expert AI. Chuyên về TikTok advertising: creative briefs, Spark Ads setup, audience targeting, TikTok Shop integration và optimization." },
  { id: "ai-seo-agent", name: "AI SEO Agent", category: "Marketing", icon: "🔎", description: "Tối ưu SEO tổng thể với AI", capabilities: ["Technical SEO audit", "Keyword strategy", "Content optimization", "Link building"], price: 0, priceMonthly: 449000, rating: 4.7, users: 2567, badge: "NEW", systemPrompt: "Bạn là AI SEO Agent toàn diện. Thực hiện technical SEO audit, research từ khóa, tối ưu on-page SEO, và xây dựng link building strategy. Cập nhật theo Google algorithm mới nhất." },
  // Content
  { id: "ai-copywriter", name: "AI Copywriter", category: "Content", icon: "✍️", description: "Viết copy bán hàng chuyển đổi cao", capabilities: ["Sales copy", "Ad copy", "Email sequences", "Landing pages"], price: 0, priceMonthly: 349000, rating: 4.9, users: 4102, badge: "HOT", systemPrompt: "Bạn là AI Copywriter đẳng cấp. Chuyên viết copy bán hàng theo AIDA, PAS, StoryBrand frameworks. Tạo headlines viral, body copy thuyết phục, và CTA chuyển đổi cao." },
  { id: "ai-designer", name: "AI Designer", category: "Content", icon: "🎨", description: "Hỗ trợ thiết kế và tạo visual content", capabilities: ["Design briefs", "Canva prompts", "Color palette", "Brand guidelines"], price: 99000, priceMonthly: 99000, rating: 4.6, users: 1234, systemPrompt: "Bạn là AI Design Consultant. Tạo design briefs, Canva prompts, gợi ý color palette, và brand guidelines. Hỗ trợ thiết kế social media, logo, banner, và marketing materials." },
  { id: "ai-video-editor", name: "AI Video Editor", category: "Content", icon: "🎬", description: "Script và hướng dẫn edit video chuyên nghiệp", capabilities: ["Video structure", "Edit points", "Transitions", "Caption scripts"], price: 149000, priceMonthly: 149000, rating: 4.7, users: 876, badge: "NEW", systemPrompt: "Bạn là AI Video Production Consultant. Tạo video scripts, edit guidelines, transition suggestions, và caption text. Tối ưu cho YouTube, TikTok, Reels và social media." },
  { id: "ai-social-manager", name: "AI Social Manager", category: "Content", icon: "📱", description: "Quản lý toàn bộ social media với AI", capabilities: ["Content calendar", "Caption writing", "Community management", "Analytics insights"], price: 0, priceMonthly: 399000, rating: 4.8, users: 2341, badge: "HOT", systemPrompt: "Bạn là AI Social Media Manager. Lập content calendar, viết caption, quản lý community, trả lời comment, và phân tích performance metrics. Đa nền tảng: Facebook, TikTok, Instagram, YouTube." },
  // Business
  { id: "ai-ceo", name: "AI CEO", category: "Business", icon: "👔", description: "Tư vấn chiến lược kinh doanh cấp CEO", capabilities: ["Business strategy", "Market analysis", "Growth planning", "Decision making"], price: 499000, priceMonthly: 499000, rating: 4.9, users: 567, badge: "PRO", systemPrompt: "Bạn là AI CEO Advisor với tư duy chiến lược cấp C-suite. Tư vấn business strategy, market analysis, growth planning, M&A considerations, và leadership decisions. Thinking like a Fortune 500 CEO." },
  { id: "ai-coo", name: "AI COO", category: "Business", icon: "⚙️", description: "Tối ưu vận hành doanh nghiệp", capabilities: ["Operations optimization", "Process mapping", "OKR framework", "Team structure"], price: 399000, priceMonthly: 399000, rating: 4.7, users: 423, badge: "PRO", systemPrompt: "Bạn là AI COO Advisor. Tối ưu operations, thiết kế processes, implement OKR framework, và cải thiện team efficiency. Operational excellence và lean thinking." },
  { id: "ai-cfo", name: "AI CFO", category: "Business", icon: "💹", description: "Phân tích tài chính và chiến lược đầu tư", capabilities: ["Financial modeling", "Cash flow analysis", "Investment decisions", "Budget planning"], price: 399000, priceMonthly: 399000, rating: 4.8, users: 389, badge: "PRO", systemPrompt: "Bạn là AI CFO Advisor. Phân tích financial statements, xây dựng financial models, tư vấn investment decisions, và quản lý cash flow. Financial intelligence và risk management." },
  { id: "ai-legal", name: "AI Legal", category: "Business", icon: "⚖️", description: "Tư vấn pháp lý doanh nghiệp cơ bản", capabilities: ["Contract review", "Legal compliance", "Terms & Conditions", "Privacy Policy"], price: 299000, priceMonthly: 299000, rating: 4.5, users: 678, systemPrompt: "Bạn là AI Legal Assistant. Tư vấn các vấn đề pháp lý kinh doanh cơ bản: review contracts, đảm bảo compliance, tạo Terms & Conditions, Privacy Policy. Lưu ý: đây là tư vấn sơ bộ, không thay thế luật sư." },
  { id: "ai-hr", name: "AI HR", category: "Business", icon: "👥", description: "Quản lý nhân sự thông minh với AI", capabilities: ["Job descriptions", "Interview questions", "Onboarding", "Performance review"], price: 0, priceMonthly: 299000, rating: 4.7, users: 1102, badge: "NEW", systemPrompt: "Bạn là AI HR Manager. Tạo job descriptions, interview questions, onboarding checklists, performance review templates, và HR policies. Employee-first và data-driven HR approach." },
  { id: "ai-customer-support", name: "AI Customer Support", category: "Business", icon: "🎧", description: "Hỗ trợ khách hàng 24/7 không giới hạn", capabilities: ["FAQ handling", "Issue resolution", "Escalation", "CSAT optimization"], price: 0, priceMonthly: 399000, rating: 4.9, users: 3456, badge: "HOT", systemPrompt: "Bạn là AI Customer Support Agent. Xử lý câu hỏi thường gặp, giải quyết vấn đề khách hàng, tạo escalation paths, và optimize CSAT score. Empathetic, helpful, solution-focused." },
  // E-commerce
  { id: "ai-shopee-agent", name: "AI Shopee Agent", category: "E-commerce", icon: "🛍️", description: "Tối ưu shop Shopee với AI", capabilities: ["Product listing", "SEO Shopee", "Flashsale strategy", "Reviews management"], price: 199000, priceMonthly: 199000, rating: 4.8, users: 2890, badge: "HOT", systemPrompt: "Bạn là Shopee Expert AI. Tối ưu product listing, SEO keyword cho Shopee, chiến lược flashsale, quản lý reviews, và tăng conversion rate. Cập nhật theo thuật toán Shopee mới nhất." },
  { id: "ai-tiktok-shop", name: "AI TikTok Shop Agent", category: "E-commerce", icon: "🎁", description: "Bùng nổ doanh thu TikTok Shop", capabilities: ["Product showcase", "Live selling script", "Affiliate linkage", "TikTok Shop SEO"], price: 199000, priceMonthly: 199000, rating: 4.9, users: 3201, badge: "HOT", systemPrompt: "Bạn là TikTok Shop Specialist AI. Tối ưu product page, tạo live selling scripts, chiến lược TikTok Shop Affiliate, và SEO sản phẩm trên TikTok Shop." },
  { id: "ai-pricing-agent", name: "AI Pricing Agent", category: "E-commerce", icon: "💲", description: "Chiến lược định giá tối ưu doanh thu", capabilities: ["Competitive pricing", "Dynamic pricing", "Bundle pricing", "Psychological pricing"], price: 149000, priceMonthly: 149000, rating: 4.6, users: 567, systemPrompt: "Bạn là AI Pricing Strategist. Phân tích competitive landscape, đề xuất optimal pricing, dynamic pricing strategy, bundle deals, và psychological pricing techniques để maximize revenue." },
  // Finance
  { id: "ai-accountant", name: "AI Accountant", category: "Finance", icon: "📒", description: "Hỗ trợ kế toán và quản lý tài chính", capabilities: ["Bookkeeping advice", "Tax planning", "Financial reports", "Expense tracking"], price: 249000, priceMonthly: 249000, rating: 4.7, users: 1234, badge: "NEW", systemPrompt: "Bạn là AI Accounting Assistant. Tư vấn bookkeeping, tax planning, tạo financial report templates, và advice về expense management. Phù hợp cho SME và freelancer Việt Nam." },
  { id: "ai-investment-advisor", name: "AI Investment Advisor", category: "Finance", icon: "📈", description: "Tư vấn đầu tư và quản lý danh mục", capabilities: ["Portfolio analysis", "Risk assessment", "Market insights", "Investment strategy"], price: 349000, priceMonthly: 349000, rating: 4.6, users: 789, badge: "PRO", systemPrompt: "Bạn là AI Investment Advisor. Phân tích portfolio, đánh giá risk, cung cấp market insights, và tư vấn investment strategy cho thị trường Việt Nam và quốc tế. Không phải lời khuyên tài chính chính thức." },
  // Education
  { id: "ai-teacher", name: "AI Teacher", category: "Education", icon: "📚", description: "Dạy học cá nhân hóa với AI", capabilities: ["Custom lessons", "Quiz creation", "Explanation", "Study plans"], price: 0, priceMonthly: 199000, rating: 4.9, users: 4567, badge: "HOT", systemPrompt: "Bạn là AI Teacher thông minh, dạy học cá nhân hóa. Giải thích concepts rõ ràng, tạo bài tập, quiz, và study plans phù hợp với learning pace của từng học viên. Patient, encouraging, adaptive." },
  { id: "ai-ielts-coach", name: "AI IELTS Coach", category: "Education", icon: "🎓", description: "Luyện thi IELTS đạt band 7+ với AI", capabilities: ["Writing correction", "Speaking practice", "Reading strategies", "Listening tips"], price: 0, priceMonthly: 299000, rating: 4.8, users: 2345, badge: "HOT", systemPrompt: "Bạn là AI IELTS Coach chuyên nghiệp. Sửa writing, practice speaking, teaching reading strategies, và IELTS tips để đạt band 7+. Phân tích lỗi sai và đưa ra feedback chi tiết." },
  // Personal
  { id: "ai-travel-planner", name: "AI Travel Planner", category: "Personal", icon: "✈️", description: "Lên kế hoạch du lịch hoàn hảo với AI", capabilities: ["Itinerary planning", "Budget estimation", "Hotel suggestions", "Local tips"], price: 0, rating: 4.8, users: 5678, badge: "FREE", systemPrompt: "Bạn là AI Travel Planner. Lập itinerary chi tiết, ước tính budget, gợi ý khách sạn/nhà hàng, và local tips cho mọi điểm đến. Tối ưu cho người Việt Nam." },
  { id: "ai-fitness-coach", name: "AI Fitness Coach", category: "Personal", icon: "💪", description: "Huấn luyện thể hình cá nhân hóa", capabilities: ["Workout plans", "Nutrition advice", "Progress tracking", "Motivation"], price: 0, priceMonthly: 199000, rating: 4.7, users: 3456, badge: "HOT", systemPrompt: "Bạn là AI Fitness Coach. Tạo workout plans, nutrition advice, và motivation strategies cá nhân hóa. Hỏi về fitness goals, current level, và constraints để đưa ra plan phù hợp." },
];

const CATEGORIES: AIAgent["category"][] = [
  "Sales", "Marketing", "Content", "Business", "E-commerce", "Finance", "Education", "Personal",
];

const BADGE_COLORS: Record<string, string> = {
  HOT:  "bg-red-500 text-white",
  NEW:  "bg-blue-500 text-white",
  PRO:  "bg-purple-600 text-white",
  FREE: "bg-emerald-600 text-white",
};

const OWNED_STORAGE_KEY = (email: string) => `monetai_owned_agents_${email}`;
const DEMO_LIMIT = 3;

// ── VietQR helper ─────────────────────────────────────────────────────────────
function vietqrUrl(agentId: string, price: number): string {
  const info = encodeURIComponent(`AGENT ${agentId.slice(-6).toUpperCase()}`);
  return `https://api.vietqr.io/image/MB-0971166299-compact2.png?amount=${price}&addInfo=${info}&accountName=MONET%20AI`;
}

// ── Agent card ────────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  owned,
  onTry,
  onBuy,
}: {
  agent: AIAgent;
  owned: boolean;
  onTry: (a: AIAgent) => void;
  onBuy: (a: AIAgent) => void;
}) {
  const isFree = agent.price === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: `0 20px 40px rgba(255,107,0,0.12)` }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border flex flex-col transition-colors hover:border-[#FF6B00]/30"
      style={{ background: CARD, borderColor: BORDER }}
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${ORANGE}18` }}
          >
            {agent.icon}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {agent.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_COLORS[agent.badge]}`}>
                {agent.badge}
              </span>
            )}
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
              style={{ background: BG, borderColor: BORDER, color: MUTED }}
            >
              {agent.category}
            </span>
            {owned && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/40">
                Đã sở hữu
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-sm mb-1" style={{ color: TEXT }}>{agent.name}</h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>{agent.description}</p>

        {/* Capabilities */}
        <ul className="space-y-1.5 mb-4">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <li key={cap} className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
              <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: ORANGE }} />
              {cap}
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold" style={{ color: TEXT }}>{agent.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
            <Users className="w-3 h-3" />
            {agent.users.toLocaleString("vi-VN")} người dùng
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          {isFree ? (
            <span className="text-lg font-bold text-emerald-400">Miễn phí</span>
          ) : (
            <>
              <span className="text-lg font-bold" style={{ color: TEXT }}>
                {agent.price.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-xs" style={{ color: MUTED }}>/lần</span>
            </>
          )}
          {agent.priceMonthly && (
            <span className="text-xs ml-2" style={{ color: MUTED }}>
              hoặc {agent.priceMonthly.toLocaleString("vi-VN")}₫/tháng
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 mt-auto grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onTry(agent)}
          className="flex items-center justify-center gap-1.5 border text-xs font-semibold py-2.5 rounded-xl transition-colors"
          style={{ borderColor: `${ORANGE}50`, color: ORANGE }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Dùng thử
        </motion.button>
        {owned || isFree ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onTry(agent)}
            className="flex items-center justify-center gap-1.5 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
            style={{ background: ORANGE }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat ngay
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onBuy(agent)}
            className="flex items-center justify-center gap-1.5 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
            style={{ background: ORANGE }}
          >
            <QrCode className="w-3.5 h-3.5" />
            Mua ngay
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ── Chat modal ────────────────────────────────────────────────────────────────
function ChatModal({
  agent,
  isUnlimited,
  onClose,
  onBuy,
}: {
  agent: AIAgent;
  isUnlimited: boolean;
  onClose: () => void;
  onBuy: (a: AIAgent) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: `Xin chào! Tôi là ${agent.name}. ${agent.description} Tôi có thể giúp gì cho bạn?` },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const userCount  = messages.filter((m) => m.role === "user").length;
  const remaining  = DEMO_LIMIT - userCount;
  const exhausted  = !isUnlimited && remaining <= 0;

  async function sendMessage(text: string) {
    if (!text.trim() || loading || exhausted) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: agent.systemPrompt, messages: updated }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? data.error ?? "Xin lỗi, có lỗi xảy ra." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Không kết nối được AI. Vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function copyConversation() {
    const text = messages.map((m) => `${m.role === "user" ? "Bạn" : agent.name}: ${m.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="relative rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg border flex flex-col shadow-2xl"
        style={{ background: CARD, borderColor: BORDER, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: `${ORANGE}18` }}>
              {agent.icon}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: TEXT }}>{agent.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs">Đang hoạt động</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyConversation}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: copied ? "#10B981" : MUTED }}
              title="Sao chép hội thoại"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="transition-colors hover:text-white" style={{ color: MUTED }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo counter */}
        <div className="px-4 py-2 border-b shrink-0" style={{ background: BG, borderColor: BORDER }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: MUTED }}>{isUnlimited ? "Chế độ Admin" : "Demo miễn phí"}</span>
            {isUnlimited ? (
              <span className="text-xs font-bold" style={{ color: ORANGE }}>∞ Không giới hạn</span>
            ) : (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: DEMO_LIMIT }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ background: i < userCount ? ORANGE : BORDER }}
                  />
                ))}
                <span className="text-xs ml-1" style={{ color: MUTED }}>{Math.max(0, remaining)} còn lại</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5" style={{ background: `${ORANGE}18` }}>
                  {agent.icon}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm border"
                }`}
                style={
                  msg.role === "user"
                    ? { background: ORANGE }
                    : { background: "#1A1A28", borderColor: BORDER, color: "#E0E0F0" }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: `${ORANGE}18` }}>
                {agent.icon}
              </div>
              <div className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 border" style={{ background: "#1A1A28", borderColor: BORDER }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A0A0B0] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {exhausted && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 text-center border"
              style={{ background: `${ORANGE}12`, borderColor: `${ORANGE}30` }}
            >
              <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: ORANGE }} />
              <p className="font-semibold text-sm mb-1" style={{ color: TEXT }}>Hết lượt demo miễn phí</p>
              <p className="text-xs mb-3" style={{ color: MUTED }}>
                Mua {agent.name} để chat không giới hạn với đầy đủ tính năng
              </p>
              <button
                onClick={() => { onClose(); onBuy(agent); }}
                className="text-sm font-bold px-4 py-2 rounded-xl text-white"
                style={{ background: ORANGE }}
              >
                Mua ngay {agent.price > 0 ? `${agent.price.toLocaleString("vi-VN")}₫` : ""}
              </button>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t shrink-0" style={{ borderColor: BORDER }}>
          {exhausted ? (
            <button
              onClick={() => { onClose(); onBuy(agent); }}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-colors"
              style={{ background: ORANGE }}
            >
              <QrCode className="w-4 h-4" />
              Mua {agent.name} ngay
            </button>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading || exhausted}
                placeholder={loading ? "Đang xử lý..." : "Nhập tin nhắn..."}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors disabled:opacity-50"
                style={{
                  background: BG,
                  borderColor: BORDER,
                  color: TEXT,
                }}
                onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
                onBlur={(e) => { e.target.style.borderColor = BORDER; }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || exhausted}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                style={{ background: ORANGE }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
          <p className="text-[10px] text-center mt-2" style={{ color: "#5A5A7A" }}>
            Powered by MonetAI · GPT-4o / Gemini / Claude
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Buy modal ─────────────────────────────────────────────────────────────────
function BuyModal({
  agent,
  userEmail,
  onClose,
  onPurchased,
}: {
  agent: AIAgent;
  userEmail: string;
  onClose: () => void;
  onPurchased: (agentId: string) => void;
}) {
  const [step, setStep]     = useState<"qr" | "confirm" | "done">("qr");
  const [txCode, setTxCode] = useState("");
  const [err, setErr]       = useState("");
  const [copied, setCopied] = useState(false);

  const desc = `AGENT ${agent.id.slice(-6).toUpperCase()} ${userEmail}`;

  function copyDesc() {
    navigator.clipboard.writeText(desc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function confirmPayment() {
    if (!txCode.trim()) { setErr("Vui lòng nhập mã giao dịch."); return; }
    // Store ownership in localStorage
    const key = OWNED_STORAGE_KEY(userEmail);
    const existing: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!existing.includes(agent.id)) {
      localStorage.setItem(key, JSON.stringify([...existing, agent.id]));
    }
    onPurchased(agent.id);
    setStep("done");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative rounded-2xl border p-6 w-full max-w-sm shadow-2xl overflow-y-auto"
        style={{ background: CARD, borderColor: BORDER, maxHeight: "90vh" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 transition-colors hover:text-white" style={{ color: MUTED }}>
          <X className="w-5 h-5" />
        </button>

        {step !== "done" && (
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl" style={{ background: `${ORANGE}18` }}>
              {agent.icon}
            </div>
            <p className="font-bold text-lg" style={{ color: TEXT }}>{agent.name}</p>
            <p className="font-bold text-2xl mt-1" style={{ color: ORANGE }}>
              {agent.price > 0 ? `${agent.price.toLocaleString("vi-VN")} ₫` : "Miễn phí Demo"}
              {agent.priceMonthly && (
                <span className="text-sm font-normal ml-1" style={{ color: MUTED }}>
                  / hoặc {agent.priceMonthly.toLocaleString("vi-VN")}₫/tháng
                </span>
              )}
            </p>
          </div>
        )}

        {step === "qr" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {(["Quét QR", "Xác nhận", "Kích hoạt"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${ORANGE}30`, border: `1px solid ${ORANGE}50`, color: ORANGE }}>
                    {i + 1}
                  </div>
                  <span className="text-[10px] whitespace-nowrap" style={{ color: MUTED }}>{s}</span>
                  {i < 2 && <div className="w-3 h-px mx-0.5" style={{ background: BORDER }} />}
                </div>
              ))}
            </div>

            {agent.price > 0 ? (
              <>
                <div className="bg-white rounded-2xl p-3 w-fit mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vietqrUrl(agent.id, agent.price)}
                    alt="QR thanh toán"
                    width={200}
                    height={200}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Ngân hàng", value: "MB Bank" },
                    { label: "Số TK",     value: "0971166299" },
                    { label: "Chủ TK",    value: "MONET AI" },
                    { label: "Số tiền",   value: `${agent.price.toLocaleString("vi-VN")} ₫` },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between">
                      <span style={{ color: MUTED }}>{r.label}:</span>
                      <span className="font-medium" style={{ color: TEXT }}>{r.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-1 border-t" style={{ borderColor: BORDER }}>
                    <span className="shrink-0" style={{ color: MUTED }}>Nội dung CK:</span>
                    <div className="flex items-center gap-2 ml-2 min-w-0">
                      <code className="text-xs font-mono truncate" style={{ color: ORANGE }}>{desc}</code>
                      <button onClick={copyDesc} className="transition-colors shrink-0" style={{ color: copied ? "#10B981" : MUTED }}>
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep("confirm")}
                  className="w-full py-3 rounded-xl font-semibold text-white"
                  style={{ background: ORANGE }}
                >
                  Tôi đã chuyển khoản →
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => confirmPayment()}
                className="w-full py-3 rounded-xl font-semibold text-white"
                style={{ background: ORANGE }}
              >
                Kích hoạt miễn phí →
              </motion.button>
            )}
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg" style={{ color: TEXT }}>Xác nhận thanh toán</h2>
            <p className="text-sm" style={{ color: MUTED }}>Nhập mã giao dịch (Transaction ID) hoặc 6 số cuối STK của bạn.</p>
            <input
              value={txCode}
              onChange={(e) => setTxCode(e.target.value)}
              placeholder="VD: MB2506123456"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-colors"
              style={{ background: INPUT_BG, borderColor: BORDER, color: TEXT }}
              onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
              onBlur={(e) => { e.target.style.borderColor = BORDER; }}
            />
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={confirmPayment}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: ORANGE }}
            >
              Xác nhận kích hoạt
            </motion.button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-5 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold" style={{ color: TEXT }}>Kích hoạt thành công!</h2>
            <p className="text-sm" style={{ color: MUTED }}>
              Bạn đã sở hữu <strong style={{ color: TEXT }}>{agent.name}</strong> và có thể chat không giới hạn.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: ORANGE }}
            >
              Bắt đầu chat ngay →
            </motion.button>
          </div>
        )}

        {step !== "done" && (
          <div
            className="mt-4 rounded-xl p-3 text-xs text-center border"
            style={{ background: `${ORANGE}12`, borderColor: `${ORANGE}25`, color: MUTED }}
          >
            Sau khi thanh toán, liên hệ{" "}
            <strong style={{ color: TEXT }}>0562 557 777</strong> hoặc{" "}
            <strong style={{ color: TEXT }}>monetai.vn@gmail.com</strong>{" "}
            để kích hoạt trong 30 phút
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Sell Agent form ───────────────────────────────────────────────────────────
function SellAgentTab() {
  const [form, setForm] = useState({ name: "", category: "", description: "", price: "", capabilities: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <div className="text-5xl">🚀</div>
        <h2 className="text-2xl font-bold" style={{ color: TEXT }}>Đã nhận thông tin!</h2>
        <p style={{ color: MUTED }}>
          Đội ngũ MonetAI sẽ liên hệ với bạn trong vòng 24h để xem xét và đăng bán agent.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 rounded-xl font-semibold text-white"
          style={{ background: ORANGE }}
        >
          Đăng agent khác
        </button>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors";
  const inputStyle = { background: INPUT_BG, borderColor: BORDER, color: TEXT };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border p-6" style={{ background: CARD, borderColor: BORDER }}>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1" style={{ color: TEXT }}>Đăng bán AI Agent của bạn</h2>
          <p className="text-sm" style={{ color: MUTED }}>
            Hàng nghìn người dùng MonetAI đang tìm kiếm AI Agent. Đăng bán và nhận hoa hồng lên đến 70%.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: <TrendingUp className="w-5 h-5" style={{ color: ORANGE }} />, label: "Hoa hồng", value: "Đến 70%" },
            { icon: <Users className="w-5 h-5" style={{ color: ORANGE }} />, label: "Người dùng", value: "10,000+" },
            { icon: <DollarSign className="w-5 h-5" style={{ color: ORANGE }} />, label: "Thanh toán", value: "Hàng tuần" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 text-center border" style={{ background: BG, borderColor: BORDER }}>
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <p className="font-bold text-sm" style={{ color: TEXT }}>{stat.value}</p>
              <p className="text-xs" style={{ color: MUTED }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Tên AI Agent <span style={{ color: ORANGE }}>*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              placeholder="VD: AI Customer Support cho E-commerce"
              className={inputCls}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
              onBlur={(e) => { e.target.style.borderColor = BORDER; }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                Danh mục <span style={{ color: ORANGE }}>*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                required
                className={inputCls}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="" style={{ background: CARD }}>-- Chọn --</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: CARD }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                Giá bán (VNĐ) <span style={{ color: ORANGE }}>*</span>
              </label>
              <input
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                required
                type="number"
                placeholder="VD: 299000"
                className={inputCls}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
                onBlur={(e) => { e.target.style.borderColor = BORDER; }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Mô tả Agent <span style={{ color: ORANGE }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              required
              rows={3}
              placeholder="Mô tả agent của bạn làm được gì, giúp ích cho ai..."
              className={`${inputCls} resize-none`}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
              onBlur={(e) => { e.target.style.borderColor = BORDER; }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Tính năng nổi bật (mỗi dòng 1 tính năng)
            </label>
            <textarea
              value={form.capabilities}
              onChange={(e) => setField("capabilities", e.target.value)}
              rows={3}
              placeholder={"Tự động trả lời câu hỏi\nXử lý đơn hàng\nBáo cáo hàng ngày"}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
              onBlur={(e) => { e.target.style.borderColor = BORDER; }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Email / SĐT liên hệ <span style={{ color: ORANGE }}>*</span>
            </label>
            <input
              value={form.contact}
              onChange={(e) => setField("contact", e.target.value)}
              required
              placeholder="email@example.com hoặc 09xxxxxxxx"
              className={inputCls}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
              onBlur={(e) => { e.target.style.borderColor = BORDER; }}
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: ORANGE }}
          >
            <Plus className="w-4 h-4" />
            Gửi yêu cầu đăng bán
          </motion.button>
        </form>
      </div>
    </div>
  );
}

// ── My Agents tab ────────────────────────────────────────────────────────────
function MyAgentsTab({
  ownedIds,
  onTry,
  onBuy,
}: {
  ownedIds: string[];
  onTry: (a: AIAgent) => void;
  onBuy: (a: AIAgent) => void;
}) {
  const ownedAgents = AGENTS.filter((a) => ownedIds.includes(a.id) || a.price === 0);

  if (ownedAgents.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <Bot className="w-14 h-14 mx-auto opacity-20" style={{ color: MUTED }} />
        <h3 className="text-xl font-bold" style={{ color: TEXT }}>Chưa có agent nào</h3>
        <p className="text-sm" style={{ color: MUTED }}>Mua AI Agent trong tab Browse để bắt đầu sử dụng không giới hạn.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-lg" style={{ color: TEXT }}>Agent của tôi</h2>
          <p className="text-sm" style={{ color: MUTED }}>{ownedAgents.length} agent sẵn sàng sử dụng</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ownedAgents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
          >
            <AgentCard agent={agent} owned onTry={onTry} onBuy={onBuy} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
type Tab = "browse" | "my" | "sell";

export default function AIAgentMarketplacePage() {
  const { user } = useAuth();
  const isAdmin  = user?.email === ADMIN_EMAIL;

  const [tab,        setTab]        = useState<Tab>("browse");
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState<AIAgent["category"] | "All">("All");
  const [chatAgent,  setChatAgent]  = useState<AIAgent | null>(null);
  const [buyAgent,   setBuyAgent]   = useState<AIAgent | null>(null);
  const [ownedIds,   setOwnedIds]   = useState<string[]>([]);

  // Load owned agents from localStorage
  useEffect(() => {
    if (!user?.email) return;
    const key = OWNED_STORAGE_KEY(user.email);
    const stored: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    setOwnedIds(stored);
  }, [user?.email]);

  function handlePurchased(agentId: string) {
    setOwnedIds((prev) => prev.includes(agentId) ? prev : [...prev, agentId]);
  }

  const filtered = AGENTS.filter((a) => {
    const matchCat    = catFilter === "All" || a.category === catFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const totalUsers  = AGENTS.reduce((s, a) => s + a.users, 0);
  const hotAgents   = AGENTS.filter((a) => a.badge === "HOT").slice(0, 6);

  return (
    <div>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border p-6 mb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111118 0%, #16161F 100%)", borderColor: BORDER }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse at 80% 50%, ${ORANGE} 0%, transparent 60%)` }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5" style={{ color: ORANGE }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
                AI Agent Marketplace
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: TEXT }}>
              Thuê AI làm việc thay bạn 24/7
            </h1>
            <p className="text-sm max-w-md" style={{ color: MUTED }}>
              {AGENTS.length} AI Agent chuyên biệt — bán hàng, marketing, nội dung, hỗ trợ khách hàng. Demo miễn phí ngay.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 items-center">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${ORANGE}20` }}>
                <Bot className="w-4 h-4" style={{ color: ORANGE }} />
              </div>
              <div>
                <p className="font-bold text-lg leading-none" style={{ color: TEXT }}>{AGENTS.length}</p>
                <p className="text-xs" style={{ color: MUTED }}>AI Agents</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${ORANGE}20` }}>
                <Users className="w-4 h-4" style={{ color: ORANGE }} />
              </div>
              <div>
                <p className="font-bold text-lg leading-none" style={{ color: TEXT }}>{totalUsers.toLocaleString("vi-VN")}+</p>
                <p className="text-xs" style={{ color: MUTED }}>Người dùng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${ORANGE}20` }}>
                <Tag className="w-4 h-4" style={{ color: ORANGE }} />
              </div>
              <div>
                <p className="font-bold text-lg leading-none" style={{ color: TEXT }}>{CATEGORIES.length}</p>
                <p className="text-xs" style={{ color: MUTED }}>Danh mục</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab("sell")}
              className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ borderColor: ORANGE, color: ORANGE }}
            >
              <Plus className="w-4 h-4" />
              Đăng bán Agent
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 rounded-xl p-1 border w-fit" style={{ background: CARD, borderColor: BORDER }}>
        {([
          { key: "browse", label: "🔍 Khám phá" },
          { key: "my",     label: `⚡ Của tôi${ownedIds.length > 0 ? ` (${ownedIds.length})` : ""}` },
          { key: "sell",   label: "💰 Bán Agent" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t.key ? { background: ORANGE, color: TEXT } : { color: MUTED }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Browse tab ───────────────────────────────────────────────────── */}
      {tab === "browse" && (
        <div className="space-y-5">
          {/* Featured HOT agents */}
          {hotAgents.length > 0 && !search && catFilter === "All" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🔥</span>
                <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Nổi bật & Bán chạy</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {hotAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex-shrink-0 w-56 rounded-2xl border p-4"
                    style={{ background: "linear-gradient(135deg, #1A1A28 0%, #16161F 100%)", borderColor: `${ORANGE}30` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{agent.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${agent.badge ? BADGE_COLORS[agent.badge] : ""}`}>
                        {agent.badge}
                      </span>
                    </div>
                    <p className="font-semibold text-sm mb-1" style={{ color: TEXT }}>{agent.name}</p>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: MUTED }}>{agent.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: ORANGE }}>
                        {agent.price === 0 ? "Free" : `${agent.price.toLocaleString("vi-VN")}₫`}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setChatAgent(agent)}
                          className="text-[10px] border px-2 py-1 rounded-lg font-medium transition-colors"
                          style={{ borderColor: `${ORANGE}40`, color: ORANGE }}
                        >
                          Thử
                        </button>
                        {agent.price > 0 && (
                          <button
                            onClick={() => setBuyAgent(agent)}
                            className="text-[10px] px-2 py-1 rounded-lg font-medium text-white transition-colors"
                            style={{ background: ORANGE }}
                          >
                            Mua
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search + category filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm AI Agent..."
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none border transition-colors"
                style={{ background: CARD, borderColor: BORDER, color: TEXT }}
                onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
                onBlur={(e) => { e.target.style.borderColor = BORDER; }}
              />
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCatFilter("All")}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={catFilter === "All"
                ? { background: ORANGE, borderColor: ORANGE, color: TEXT }
                : { borderColor: BORDER, color: MUTED }}
            >
              Tất cả ({AGENTS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = AGENTS.filter((a) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={catFilter === cat
                    ? { background: ORANGE, borderColor: ORANGE, color: TEXT }
                    : { borderColor: BORDER, color: MUTED }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Count */}
          <p className="text-sm" style={{ color: MUTED }}>
            <span className="font-semibold" style={{ color: TEXT }}>{filtered.length}</span> agent
            {search && <> · Kết quả cho "<span style={{ color: ORANGE }}>{search}</span>"</>}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.25) }}
                >
                  <AgentCard
                    agent={agent}
                    owned={ownedIds.includes(agent.id)}
                    onTry={setChatAgent}
                    onBuy={setBuyAgent}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: MUTED }} />
              <p className="font-medium mb-1" style={{ color: TEXT }}>Không tìm thấy agent nào</p>
              <p className="text-sm mb-4" style={{ color: MUTED }}>Thử tìm kiếm với từ khóa khác</p>
              <button
                onClick={() => { setSearch(""); setCatFilter("All"); }}
                className="text-sm hover:underline"
                style={{ color: ORANGE }}
              >
                Xem tất cả agent
              </button>
            </div>
          )}

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-6 rounded-2xl border p-6"
            style={{ background: "#111118", borderColor: BORDER }}
          >
            <h2 className="font-semibold mb-5 text-center flex items-center justify-center gap-2" style={{ color: TEXT }}>
              <MessageSquare className="w-4 h-4" style={{ color: ORANGE }} />
              Cách sử dụng AI Agent Marketplace
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { step: "1", icon: "🔍", title: "Dùng thử miễn phí", desc: `Nhấn "Dùng thử" để chat trực tiếp. ${DEMO_LIMIT} tin nhắn demo hoàn toàn miễn phí.` },
                { step: "2", icon: "💳", title: "Thanh toán QR",     desc: "Chọn agent phù hợp, quét mã QR MB Bank để thanh toán nhanh chóng." },
                { step: "3", icon: "⚡", title: "Kích hoạt 30 phút", desc: "Liên hệ MonetAI sau thanh toán. Agent kích hoạt trong vòng 30 phút." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border"
                    style={{ background: `${ORANGE}18`, borderColor: `${ORANGE}40`, color: ORANGE }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p className="text-lg mb-1">{item.icon}</p>
                    <p className="font-semibold text-sm mb-1" style={{ color: TEXT }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: BORDER }}>
              <p className="text-sm" style={{ color: MUTED }}>
                Cần tư vấn?{" "}
                <a href="tel:0562557777" className="hover:underline font-medium" style={{ color: ORANGE }}>0562 557 777</a>
                {" · "}
                <a href="mailto:monetai.vn@gmail.com" className="hover:underline font-medium" style={{ color: ORANGE }}>monetai.vn@gmail.com</a>
              </p>
              <div className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
                <ChevronRight className="w-3 h-3" style={{ color: ORANGE }} />
                Cam kết kích hoạt trong 30 phút hoặc hoàn tiền 100%
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── My Agents tab ────────────────────────────────────────────────── */}
      {tab === "my" && (
        <MyAgentsTab ownedIds={ownedIds} onTry={setChatAgent} onBuy={setBuyAgent} />
      )}

      {/* ── Sell tab ─────────────────────────────────────────────────────── */}
      {tab === "sell" && <SellAgentTab />}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {chatAgent && (
          <ChatModal
            key="chat"
            agent={chatAgent}
            isUnlimited={isAdmin || ownedIds.includes(chatAgent.id)}
            onClose={() => setChatAgent(null)}
            onBuy={(a) => { setChatAgent(null); setBuyAgent(a); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {buyAgent && user && (
          <BuyModal
            key="buy"
            agent={buyAgent}
            userEmail={user.email}
            onClose={() => setBuyAgent(null)}
            onPurchased={handlePurchased}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
