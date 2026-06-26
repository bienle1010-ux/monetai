"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ToolRunner, { type ToolField } from "@/components/tools/ToolRunner";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG     = "#0A0A0F";
const CARD   = "#16161F";
const BORDER = "#2A2A3A";
const ORANGE = "#FF6B00";
const MUTED  = "#A0A0B0";
const TEXT   = "#FFFFFF";

// ─── Tool definition ──────────────────────────────────────────────────────────
interface AffiliateToolDef {
  id: string;
  name: string;
  icon: string;
  group: string;
  desc: string;
  fields: ToolField[];
}

const TOOLS: AffiliateToolDef[] = [
  // ── Management ──────────────────────────────────────────────────────────────
  {
    id: "advertiser-manager",
    name: "AI Advertiser Manager",
    icon: "🏢",
    group: "Quản lý",
    desc: "Quản lý & onboard Advertiser",
    fields: [
      {
        name: "situation",
        label: "Tình huống / Yêu cầu",
        type: "textarea",
        required: true,
        rows: 4,
        placeholder: "Ví dụ: Tôi cần tạo quy trình onboard advertiser mới cho nền tảng Affiliate...",
      },
    ],
  },
  {
    id: "publisher-manager",
    name: "AI Publisher Manager",
    icon: "📢",
    group: "Quản lý",
    desc: "Quản lý & phát triển Publisher",
    fields: [
      {
        name: "situation",
        label: "Tình huống / Yêu cầu",
        type: "textarea",
        required: true,
        rows: 4,
        placeholder: "Ví dụ: Tôi có 500 publisher và cần chiến lược giữ chân publisher VIP...",
      },
    ],
  },
  {
    id: "partner-manager",
    name: "AI Partner Manager",
    icon: "🤝",
    group: "Quản lý",
    desc: "Quản lý đối tác chiến lược",
    fields: [
      {
        name: "partner_type",
        label: "Loại đối tác",
        type: "select",
        placeholder: "Chọn loại đối tác",
        options: ["Brand/Advertiser", "Publisher/KOL", "Technology Partner", "Distribution Partner"],
      },
      {
        name: "situation",
        label: "Tình huống / Mục tiêu",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Mô tả tình huống hoặc mục tiêu quản lý đối tác...",
      },
    ],
  },
  {
    id: "affiliate-crm",
    name: "AI Affiliate CRM",
    icon: "💼",
    group: "Quản lý",
    desc: "CRM cho Affiliate Network",
    fields: [
      {
        name: "affiliate_profile",
        label: "Profile Affiliate",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Mô tả publisher/affiliate cần tư vấn CRM strategy...",
      },
      {
        name: "goal",
        label: "Mục tiêu CRM",
        type: "select",
        placeholder: "Chọn mục tiêu",
        options: ["Tăng activation", "Giữ chân VIP", "Re-engage inactive", "Upgrade tier", "Tất cả"],
      },
    ],
  },
  // ── Analytics ───────────────────────────────────────────────────────────────
  {
    id: "fraud-detection",
    name: "AI Fraud Detection",
    icon: "🛡️",
    group: "Phân tích",
    desc: "Phát hiện & ngăn chặn gian lận",
    fields: [
      {
        name: "fraud_type",
        label: "Loại fraud nghi ngờ",
        type: "select",
        placeholder: "Chọn loại fraud",
        options: ["Click Fraud", "Cookie Stuffing", "Fake Leads", "Account Fraud", "Tất cả loại"],
      },
      {
        name: "data_description",
        label: "Mô tả dữ liệu bất thường",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Ví dụ: CTR tăng 500% trong 2 giờ, IP tập trung từ 1 vùng...",
      },
    ],
  },
  {
    id: "click-tracking",
    name: "AI Click Tracking",
    icon: "🎯",
    group: "Phân tích",
    desc: "Tracking & phân tích click",
    fields: [
      {
        name: "campaign",
        label: "Chiến dịch cần setup tracking",
        type: "text",
        required: true,
        placeholder: "Tên campaign hoặc sản phẩm",
      },
      {
        name: "channels",
        label: "Kênh traffic",
        type: "select",
        placeholder: "Chọn kênh traffic",
        options: ["Facebook Ads", "TikTok Ads", "Google Ads", "Email", "Organic", "Đa kênh"],
      },
    ],
  },
  {
    id: "kpi-analyzer",
    name: "AI KPI Analyzer",
    icon: "📊",
    group: "Phân tích",
    desc: "Phân tích KPI & hiệu quả",
    fields: [
      {
        name: "metrics",
        label: "Các chỉ số hiện tại",
        type: "textarea",
        required: true,
        rows: 4,
        placeholder: "Ví dụ: CTR: 2.3%, CVR: 1.1%, EPC: 15.000 VNĐ, ROAS: 3.2...",
      },
      {
        name: "period",
        label: "Khoảng thời gian",
        type: "select",
        placeholder: "Chọn khoảng thời gian",
        options: ["7 ngày", "30 ngày", "90 ngày", "6 tháng", "1 năm"],
      },
    ],
  },
  {
    id: "ai-dashboard",
    name: "AI Dashboard Designer",
    icon: "🖥️",
    group: "Phân tích",
    desc: "Thiết kế dashboard báo cáo",
    fields: [
      {
        name: "role",
        label: "Vai trò sử dụng dashboard",
        type: "select",
        placeholder: "Chọn vai trò",
        options: ["Advertiser", "Publisher", "Network Manager", "C-level Executive"],
      },
      {
        name: "focus",
        label: "Focus metric chính",
        type: "text",
        placeholder: "Ví dụ: Revenue, ROI, Publisher performance...",
      },
    ],
  },
  // ── Optimization ─────────────────────────────────────────────────────────────
  {
    id: "commission-engine",
    name: "AI Commission Engine",
    icon: "💰",
    group: "Tối ưu",
    desc: "Thiết kế cơ cấu hoa hồng",
    fields: [
      {
        name: "business_type",
        label: "Loại hình kinh doanh",
        type: "select",
        placeholder: "Chọn loại hình",
        options: ["SaaS / Software", "E-commerce", "Education / Courses", "Finance / Insurance", "Health & Beauty"],
      },
      {
        name: "current_commission",
        label: "Hoa hồng hiện tại (%)",
        type: "text",
        placeholder: "Ví dụ: 30",
      },
      {
        name: "goal",
        label: "Mục tiêu tối ưu",
        type: "select",
        placeholder: "Chọn mục tiêu",
        options: ["Thu hút Publisher mới", "Tăng performance", "Giảm chi phí", "Scale nhanh"],
      },
    ],
  },
  {
    id: "smart-matching",
    name: "AI Smart Matching",
    icon: "🔗",
    group: "Tối ưu",
    desc: "Ghép đôi Advertiser-Publisher tối ưu",
    fields: [
      {
        name: "advertiser_profile",
        label: "Profile Advertiser",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Niche, target audience, sản phẩm, commission...",
      },
      {
        name: "publisher_profile",
        label: "Profile Publisher",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Traffic source, niche, audience size, platform...",
      },
    ],
  },
  {
    id: "offer-recommendation",
    name: "AI Offer Recommendation",
    icon: "⭐",
    group: "Tối ưu",
    desc: "Đề xuất offer phù hợp nhất",
    fields: [
      {
        name: "publisher_niche",
        label: "Niche của Publisher",
        type: "text",
        required: true,
        placeholder: "Ví dụ: AI Tools, Digital Marketing, E-commerce...",
      },
      {
        name: "traffic_source",
        label: "Nguồn traffic chính",
        type: "select",
        placeholder: "Chọn nguồn traffic",
        options: ["Facebook", "TikTok", "YouTube", "Email", "SEO Blog", "Zalo"],
      },
      {
        name: "monthly_reach",
        label: "Lượt tiếp cận/tháng",
        type: "text",
        placeholder: "Ví dụ: 50.000 người",
      },
    ],
  },
  {
    id: "smart-attribution",
    name: "AI Smart Attribution",
    icon: "📈",
    group: "Tối ưu",
    desc: "Mô hình phân bổ chuyển đổi thông minh",
    fields: [
      {
        name: "touchpoints",
        label: "Các điểm tiếp xúc trong hành trình",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Ví dụ: Facebook Ad → Blog review → Email → Direct purchase",
      },
      {
        name: "goal",
        label: "Mục tiêu attribution",
        type: "select",
        placeholder: "Chọn mục tiêu",
        options: ["Tối ưu ngân sách quảng cáo", "Đánh giá publisher công bằng", "Hiểu customer journey", "Tất cả"],
      },
    ],
  },
  // ── Payment ──────────────────────────────────────────────────────────────────
  {
    id: "payment-manager",
    name: "AI Payment Manager",
    icon: "💳",
    group: "Thanh toán",
    desc: "Quản lý & tối ưu thanh toán hoa hồng",
    fields: [
      {
        name: "payment_situation",
        label: "Tình huống thanh toán",
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: "Ví dụ: Cần thiết kế quy trình thanh toán cho 1000+ publishers...",
      },
    ],
  },
  {
    id: "referral-manager",
    name: "AI Referral Manager",
    icon: "🔀",
    group: "Thanh toán",
    desc: "Chương trình Referral & giới thiệu bạn bè",
    fields: [
      {
        name: "product",
        label: "Sản phẩm/Dịch vụ",
        type: "text",
        required: true,
        placeholder: "Sản phẩm áp dụng referral program",
      },
      {
        name: "reward_type",
        label: "Loại phần thưởng",
        type: "select",
        placeholder: "Chọn loại phần thưởng",
        options: ["Tiền mặt", "Tín dụng tài khoản", "Sản phẩm miễn phí", "Upgrade gói", "Kết hợp"],
      },
    ],
  },
  // ── Campaign ─────────────────────────────────────────────────────────────────
  {
    id: "campaign-manager-network",
    name: "AI Campaign Manager",
    icon: "📣",
    group: "Campaign",
    desc: "Quản lý chiến dịch Affiliate Network",
    fields: [
      {
        name: "campaign_type",
        label: "Loại chiến dịch",
        type: "select",
        placeholder: "Chọn loại chiến dịch",
        options: [
          "CPS (Cost per Sale)",
          "CPL (Cost per Lead)",
          "CPI (Cost per Install)",
          "CPA (Cost per Action)",
        ],
      },
      {
        name: "product",
        label: "Sản phẩm/Offer",
        type: "text",
        required: true,
        placeholder: "Tên sản phẩm hoặc offer",
      },
      {
        name: "target",
        label: "Mục tiêu chiến dịch",
        type: "text",
        placeholder: "Ví dụ: 1000 conversion trong 30 ngày",
      },
    ],
  },
];

// ─── Group ordering ───────────────────────────────────────────────────────────
const GROUP_ORDER = ["Quản lý", "Phân tích", "Tối ưu", "Thanh toán", "Campaign"];

const GROUP_ICONS: Record<string, string> = {
  "Quản lý":    "🏗️",
  "Phân tích":  "🔬",
  "Tối ưu":     "⚡",
  "Thanh toán": "💳",
  "Campaign":   "📣",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeTool,
  onSelect,
}: {
  activeTool: string;
  onSelect: (id: string) => void;
}) {
  const grouped = GROUP_ORDER.map(group => ({
    group,
    tools: TOOLS.filter(t => t.group === group),
  }));

  return (
    <nav className="h-full overflow-y-auto space-y-5 pr-1">
      {grouped.map(({ group, tools }) => (
        <div key={group}>
          <div className="flex items-center gap-2 px-2 mb-2">
            <span className="text-base">{GROUP_ICONS[group]}</span>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>
              {group}
            </span>
          </div>
          <ul className="space-y-0.5">
            {tools.map(tool => {
              const isActive = activeTool === tool.id;
              return (
                <li key={tool.id}>
                  <motion.button
                    onClick={() => onSelect(tool.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
                    style={
                      isActive
                        ? {
                            background: "rgba(255,107,0,0.12)",
                            border: `1px solid rgba(255,107,0,0.3)`,
                            color: ORANGE,
                          }
                        : {
                            background: "transparent",
                            border: "1px solid transparent",
                            color: MUTED,
                          }
                    }
                  >
                    <span className="text-base flex-shrink-0">{tool.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs leading-tight truncate"
                        style={{ color: isActive ? ORANGE : TEXT }}>
                        {tool.name}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: MUTED }}>
                        {tool.desc}
                      </p>
                    </div>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AffiliateNetworkPage() {
  useAuth(); // ensures auth context is available
  const [activeTool, setActiveTool]   = useState<string>(TOOLS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tool = TOOLS.find(t => t.id === activeTool) ?? TOOLS[0];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG, color: TEXT }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6 flex-shrink-0"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,107,0,0.15)" }}>
          <Network size={20} style={{ color: ORANGE }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold" style={{ color: TEXT }}>Affiliate Network Manager</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.2)", color: ORANGE }}>
              16 AI Tools
            </span>
          </div>
          <p className="text-sm" style={{ color: MUTED }}>
            Bộ công cụ AI toàn diện để quản lý & tối ưu mạng lưới Affiliate
          </p>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="ml-auto lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
          style={{ background: CARD, borderColor: BORDER, color: TEXT }}
          aria-label="Toggle tool list"
        >
          {sidebarOpen ? "Ẩn tools" : "Chọn tool"}
        </button>
      </motion.div>

      {/* Layout */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Sidebar — desktop always visible, mobile drawer */}
        <aside
          className={`flex-shrink-0 w-60 rounded-2xl border p-4 transition-all lg:block ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
          style={{ background: CARD, borderColor: BORDER }}
        >
          <div className="mb-3 pb-3 border-b" style={{ borderColor: BORDER }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
              Danh sách công cụ
            </p>
          </div>
          <Sidebar activeTool={activeTool} onSelect={id => { setActiveTool(id); setSidebarOpen(false); }} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 rounded-2xl border p-6"
          style={{ background: CARD, borderColor: BORDER }}>
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            <ToolRunner
              toolId={tool.id}
              title={tool.name}
              description={tool.desc}
              icon={tool.icon}
              fields={tool.fields}
              submitLabel="Phân tích với AI"
            />
          </motion.div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
