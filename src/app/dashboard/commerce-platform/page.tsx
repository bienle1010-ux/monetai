"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, BarChart3, Users, Zap, Settings, Brain,
  Target, Plug, Search, Shield, BookOpen, ChevronRight,
  Layers, LineChart, Cpu, Database,
} from "lucide-react";
import ToolRunner from "@/components/tools/ToolRunner";
import type { ToolField } from "@/components/tools/ToolRunner";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG      = "#0A0A0F";
const CARD    = "#16161F";
const BORDER  = "#2A2A3A";
const ORANGE  = "#FF6B00";
const MUTED   = "#A0A0B0";
const TEXT    = "#FFFFFF";

// ── Tool definition ────────────────────────────────────────────────────────────
interface CommerceTool {
  id: string;
  name: string;
  icon: string;
  group: string;
  desc: string;
  fields: ToolField[];
}

const TOOLS: CommerceTool[] = [
  // ── Business OS ──────────────────────────────────────────────────────────────
  {
    id: "business-operating-system",
    name: "AI Business OS",
    icon: "🏗️",
    group: "Business OS",
    desc: "Thiết kế hệ điều hành doanh nghiệp AI",
    fields: [
      { name: "company_type", label: "Loại hình doanh nghiệp", type: "select", options: ["Startup AI", "SME", "Agency", "E-commerce", "SaaS Company"], required: true, placeholder: "" },
      { name: "size", label: "Quy mô công ty", type: "select", options: ["1-5 người", "6-20 người", "21-50 người", "50+ người"], placeholder: "" },
      { name: "challenge", label: "Thách thức lớn nhất", type: "textarea", rows: 3, placeholder: "Mô tả vấn đề kinh doanh bạn đang gặp phải..." },
    ],
  },
  {
    id: "revenue-dashboard",
    name: "AI Revenue Dashboard",
    icon: "💹",
    group: "Business OS",
    desc: "Thiết kế dashboard doanh thu thông minh",
    fields: [
      { name: "business_model", label: "Mô hình kinh doanh", type: "select", options: ["SaaS / Subscription", "E-commerce", "Affiliate Network", "Agency", "Marketplace"], required: true, placeholder: "" },
      { name: "current_metrics", label: "Chỉ số hiện tại (nếu có)", type: "textarea", rows: 3, placeholder: "Ví dụ: MRR: 50tr, Churn: 5%, CAC: 500k..." },
    ],
  },
  // ── CRM & Khách hàng ─────────────────────────────────────────────────────────
  {
    id: "crm-assistant",
    name: "AI CRM",
    icon: "🤝",
    group: "CRM & Khách hàng",
    desc: "Chiến lược CRM thông minh với AI",
    fields: [
      { name: "customer_count", label: "Số lượng khách hàng", type: "select", options: ["<100", "100-500", "500-2000", "2000+"], placeholder: "" },
      { name: "crm_challenge", label: "Thách thức CRM", type: "textarea", rows: 3, placeholder: "Ví dụ: Khách hàng churn cao, không có hệ thống theo dõi...", required: true },
    ],
  },
  {
    id: "marketing-automation-platform",
    name: "AI Marketing Automation",
    icon: "⚡",
    group: "CRM & Khách hàng",
    desc: "Tự động hóa marketing 360 độ",
    fields: [
      { name: "automation_type", label: "Loại automation", type: "select", options: ["Email Marketing", "Lead Nurturing", "Cart Recovery", "Post-purchase", "Re-engagement"], required: true, placeholder: "" },
      { name: "platform", label: "Platform sử dụng", type: "select", options: ["Mailchimp", "ActiveCampaign", "HubSpot", "Klaviyo", "Custom build", "Chưa có"], placeholder: "" },
    ],
  },
  {
    id: "recommendation-engine",
    name: "AI Recommendation Engine",
    icon: "🎯",
    group: "CRM & Khách hàng",
    desc: "Engine gợi ý sản phẩm/nội dung cá nhân hóa",
    fields: [
      { name: "rec_type", label: "Loại recommendation", type: "select", options: ["Product recommendation", "Content recommendation", "Offer recommendation", "Cross-sell/Upsell"], placeholder: "" },
      { name: "data_available", label: "Dữ liệu hiện có", type: "textarea", rows: 2, placeholder: "Ví dụ: purchase history, browse history, demographics..." },
    ],
  },
  // ── Vận hành ─────────────────────────────────────────────────────────────────
  {
    id: "erp-consultant",
    name: "AI ERP",
    icon: "🔧",
    group: "Vận hành",
    desc: "Tư vấn ERP & tối ưu quy trình",
    fields: [
      { name: "department", label: "Bộ phận cần tối ưu", type: "select", options: ["Sales", "Marketing", "Operations", "Finance", "HR", "Toàn công ty"], placeholder: "" },
      { name: "pain_point", label: "Pain point chính", type: "textarea", rows: 3, placeholder: "Mô tả vấn đề vận hành đang gặp phải...", required: true },
    ],
  },
  {
    id: "workflow-automation",
    name: "AI Workflow Automation",
    icon: "🔄",
    group: "Vận hành",
    desc: "Thiết kế workflow tự động hóa quy trình",
    fields: [
      { name: "process", label: "Quy trình cần tự động hóa", type: "textarea", rows: 3, placeholder: "Mô tả quy trình thủ công đang làm...", required: true },
      { name: "tools_used", label: "Tools đang dùng", type: "text", placeholder: "Ví dụ: Google Sheets, Zalo, Email, Shopee..." },
    ],
  },
  {
    id: "hrm-assistant",
    name: "AI HRM",
    icon: "👥",
    group: "Vận hành",
    desc: "Quản lý nhân sự thông minh",
    fields: [
      { name: "hr_need", label: "Nhu cầu HR", type: "select", options: ["Tuyển dụng", "Onboarding", "Performance review", "Training", "Culture building"], required: true, placeholder: "" },
      { name: "company_size", label: "Quy mô công ty", type: "select", options: ["1-10 người", "11-50 người", "51-200 người", "200+ người"], placeholder: "" },
    ],
  },
  // ── Phân tích ─────────────────────────────────────────────────────────────────
  {
    id: "analytics-platform",
    name: "AI Analytics",
    icon: "📊",
    group: "Phân tích",
    desc: "Phân tích dữ liệu kinh doanh chuyên sâu",
    fields: [
      { name: "data_source", label: "Nguồn dữ liệu", type: "textarea", rows: 2, placeholder: "Ví dụ: GA4, Facebook Ads, Shopee, CRM...", required: true },
      { name: "insight_need", label: "Insight cần tìm", type: "text", required: true, placeholder: "Ví dụ: Tại sao conversion rate giảm 30% trong tháng 6?" },
    ],
  },
  {
    id: "business-intelligence",
    name: "AI Business Intelligence",
    icon: "🧠",
    group: "Phân tích",
    desc: "Business Intelligence & BI strategy",
    fields: [
      { name: "business_question", label: "Câu hỏi kinh doanh", type: "textarea", rows: 3, placeholder: "Ví dụ: Segment khách hàng nào có LTV cao nhất và cần chiến lược gì?", required: true },
      { name: "data_available", label: "Dữ liệu hiện có", type: "text", placeholder: "Ví dụ: 1 năm dữ liệu bán hàng, 5000 khách hàng..." },
    ],
  },
  {
    id: "kpi-analyzer",
    name: "AI KPI Analyzer",
    icon: "🎯",
    group: "Phân tích",
    desc: "Phân tích & tối ưu KPI doanh nghiệp",
    fields: [
      { name: "current_kpis", label: "KPI hiện tại", type: "textarea", rows: 4, placeholder: "Dán các chỉ số KPI hiện tại của bạn...", required: true },
      { name: "period", label: "Kỳ báo cáo", type: "select", options: ["Tuần", "Tháng", "Quý", "Năm"], placeholder: "" },
    ],
  },
  // ── Công nghệ ─────────────────────────────────────────────────────────────────
  {
    id: "api-hub",
    name: "AI API Hub",
    icon: "🔌",
    group: "Công nghệ",
    desc: "Thiết kế & tích hợp API Hub",
    fields: [
      { name: "use_case", label: "Use case tích hợp", type: "textarea", rows: 3, placeholder: "Ví dụ: Kết nối Shopee, TikTok Shop, và CRM để tự động sync đơn hàng...", required: true },
    ],
  },
  {
    id: "ai-search-engine",
    name: "AI Search Engine",
    icon: "🔍",
    group: "Công nghệ",
    desc: "Thiết kế AI-powered search cho platform",
    fields: [
      { name: "platform_type", label: "Loại platform", type: "select", options: ["E-commerce", "Marketplace", "Content platform", "Knowledge base", "SaaS"], placeholder: "" },
      { name: "requirements", label: "Yêu cầu search", type: "textarea", rows: 3, placeholder: "Ví dụ: Search theo sản phẩm, tác giả, giá... Cần hỗ trợ tiếng Việt không dấu..." },
    ],
  },
  {
    id: "agent-orchestrator",
    name: "AI Agent Orchestrator",
    icon: "🤖",
    group: "Công nghệ",
    desc: "Thiết kế hệ thống multi-agent",
    fields: [
      { name: "use_case", label: "Use case", type: "textarea", rows: 3, placeholder: "Mô tả bài toán cần nhiều AI agents phối hợp...", required: true },
      { name: "complexity", label: "Mức độ phức tạp", type: "select", options: ["Đơn giản (2-3 agents)", "Trung bình (4-6 agents)", "Phức tạp (7+ agents)"], placeholder: "" },
    ],
  },
  {
    id: "security-consultant",
    name: "AI Security",
    icon: "🛡️",
    group: "Công nghệ",
    desc: "Bảo mật hệ thống AI Commerce",
    fields: [
      { name: "system_type", label: "Loại hệ thống", type: "select", options: ["Web application", "Mobile app", "API backend", "E-commerce platform", "Marketplace"], placeholder: "" },
      { name: "current_security", label: "Biện pháp bảo mật hiện tại", type: "textarea", rows: 2, placeholder: "Mô tả các biện pháp bảo mật đang có..." },
    ],
  },
  // ── Kiến thức ─────────────────────────────────────────────────────────────────
  {
    id: "knowledge-base",
    name: "AI Knowledge Base",
    icon: "📖",
    group: "Kiến thức",
    desc: "Xây dựng Knowledge Base thông minh",
    fields: [
      { name: "kb_topic", label: "Chủ đề cần xây dựng KB", type: "text", required: true, placeholder: "Ví dụ: Hướng dẫn sử dụng MonetAI Platform" },
      { name: "audience", label: "Đối tượng sử dụng", type: "select", options: ["Khách hàng", "Nhân viên", "Đối tác", "Developer"], placeholder: "" },
    ],
  },
];

// ── Group config ──────────────────────────────────────────────────────────────
interface GroupConfig {
  icon: React.ReactNode;
  color: string;
}

const GROUP_CONFIG: Record<string, GroupConfig> = {
  "Business OS":      { icon: <Building2 className="w-4 h-4" />,  color: "#FF6B00" },
  "CRM & Khách hàng": { icon: <Users className="w-4 h-4" />,      color: "#3B82F6" },
  "Vận hành":         { icon: <Settings className="w-4 h-4" />,   color: "#8B5CF6" },
  "Phân tích":        { icon: <BarChart3 className="w-4 h-4" />,  color: "#10B981" },
  "Công nghệ":        { icon: <Cpu className="w-4 h-4" />,        color: "#F59E0B" },
  "Kiến thức":        { icon: <BookOpen className="w-4 h-4" />,   color: "#EC4899" },
};

const GROUPS = Object.keys(GROUP_CONFIG);

// ── Stat cards for hero ───────────────────────────────────────────────────────
const HERO_STATS = [
  { icon: <Layers className="w-4 h-4" />,     label: "Tools",        value: String(TOOLS.length) },
  { icon: <Database className="w-4 h-4" />,   label: "Danh mục",    value: String(GROUPS.length) },
  { icon: <LineChart className="w-4 h-4" />,  label: "Doanh nghiệp", value: "500+" },
  { icon: <Brain className="w-4 h-4" />,      label: "AI Models",   value: "3" },
];

// ── Sidebar item ──────────────────────────────────────────────────────────────
function SidebarItem({
  tool,
  active,
  onClick,
}: {
  tool: CommerceTool;
  active: boolean;
  onClick: () => void;
}) {
  const groupCfg = GROUP_CONFIG[tool.group];
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
      style={{
        background: active ? `${ORANGE}18` : "transparent",
        borderLeft: active ? `2px solid ${ORANGE}` : "2px solid transparent",
      }}
    >
      <span className="text-base flex-shrink-0">{tool.icon}</span>
      <div className="min-w-0 flex-1">
        <p
          className="text-xs font-medium leading-tight truncate"
          style={{ color: active ? TEXT : MUTED }}
        >
          {tool.name}
        </p>
      </div>
      {active && <ChevronRight className="w-3 h-3 shrink-0" style={{ color: ORANGE }} />}
    </motion.button>
  );
}

// ── Group header ──────────────────────────────────────────────────────────────
function GroupHeader({ name }: { name: string }) {
  const cfg = GROUP_CONFIG[name];
  return (
    <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
      <div className="flex items-center justify-center" style={{ color: cfg?.color ?? ORANGE }}>
        {cfg?.icon}
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: cfg?.color ?? ORANGE }}
      >
        {name}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CommercePlatformPage() {
  const [activeTool, setActiveTool] = useState<CommerceTool>(TOOLS[0]);
  const [search, setSearch]         = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("All");

  const filteredTools = TOOLS.filter((t) => {
    const matchGroup = groupFilter === "All" || t.group === groupFilter;
    const q          = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.group.toLowerCase().includes(q);
    return matchGroup && matchSearch;
  });

  const groupedTools = GROUPS.map((g) => ({
    group: g,
    tools: filteredTools.filter((t) => t.group === g),
  })).filter((g) => g.tools.length > 0);

  return (
    <div className="flex flex-col gap-0 -m-4 md:-m-6 lg:-m-8 min-h-screen" style={{ background: BG }}>
      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative border-b overflow-hidden px-4 md:px-6 lg:px-8 py-6"
        style={{ borderColor: BORDER, background: "linear-gradient(135deg, #111118 0%, #16161F 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse at 70% 50%, ${ORANGE} 0%, transparent 60%)` }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 rounded-full text-xs font-bold border" style={{ background: `${ORANGE}20`, borderColor: `${ORANGE}50`, color: ORANGE }}>
                All-in-one Business OS
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: TEXT }}>
              AI Commerce Platform
            </h1>
            <p className="text-sm max-w-xl" style={{ color: MUTED }}>
              Hệ điều hành kinh doanh AI toàn diện — CRM, Analytics, Operations, Tech, Knowledge trong một nơi.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${ORANGE}20`, color: ORANGE }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="font-bold leading-none" style={{ color: TEXT }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: MUTED }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group filter pills */}
        <div className="relative flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setGroupFilter("All")}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={groupFilter === "All"
              ? { background: ORANGE, borderColor: ORANGE, color: TEXT }
              : { borderColor: BORDER, color: MUTED }}
          >
            Tất cả
          </button>
          {GROUPS.map((g) => {
            const cfg = GROUP_CONFIG[g];
            return (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5"
                style={groupFilter === g
                  ? { background: cfg.color, borderColor: cfg.color, color: TEXT }
                  : { borderColor: BORDER, color: MUTED }}
              >
                <span style={{ color: groupFilter === g ? TEXT : cfg.color }}>{cfg.icon}</span>
                {g}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Main layout (sidebar + content) ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="hidden md:flex flex-col w-56 lg:w-64 border-r flex-shrink-0 overflow-y-auto"
          style={{ borderColor: BORDER, background: "#0D0D14" }}
        >
          {/* Search */}
          <div className="p-3 border-b sticky top-0 z-10" style={{ borderColor: BORDER, background: "#0D0D14" }}>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: MUTED }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tool..."
                className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none border transition-colors"
                style={{ background: BG, borderColor: BORDER, color: TEXT }}
                onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
                onBlur={(e) => { e.target.style.borderColor = BORDER; }}
              />
            </div>
          </div>

          {/* Tool list */}
          <div className="flex-1 overflow-y-auto p-2 pb-8">
            {groupedTools.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: MUTED }}>Không tìm thấy tool</p>
            ) : (
              groupedTools.map(({ group, tools }) => (
                <div key={group}>
                  <GroupHeader name={group} />
                  {tools.map((t) => (
                    <SidebarItem
                      key={t.id}
                      tool={t}
                      active={activeTool.id === t.id}
                      onClick={() => setActiveTool(t)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Quick stats footer */}
          <div className="p-3 border-t shrink-0" style={{ borderColor: BORDER }}>
            <div className="rounded-xl p-3 border" style={{ background: `${ORANGE}10`, borderColor: `${ORANGE}25` }}>
              <p className="text-xs font-semibold mb-1" style={{ color: ORANGE }}>MonetAI Business OS</p>
              <p className="text-[10px] leading-relaxed" style={{ color: MUTED }}>
                {TOOLS.length} tools · {GROUPS.length} modules · AI-powered
              </p>
            </div>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Mobile: tool selector dropdown */}
          <div className="md:hidden mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Chọn Tool</label>
            <select
              value={activeTool.id}
              onChange={(e) => {
                const found = TOOLS.find((t) => t.id === e.target.value);
                if (found) setActiveTool(found);
              }}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors"
              style={{ background: CARD, borderColor: BORDER, color: TEXT, cursor: "pointer" }}
            >
              {GROUPS.map((g) => (
                <optgroup key={g} label={g} style={{ background: CARD }}>
                  {TOOLS.filter((t) => t.group === g).map((t) => (
                    <option key={t.id} value={t.id} style={{ background: CARD }}>
                      {t.icon} {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs" style={{ color: MUTED }}>AI Commerce Platform</span>
            <ChevronRight className="w-3 h-3" style={{ color: MUTED }} />
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: GROUP_CONFIG[activeTool.group]?.color ?? ORANGE, borderColor: `${GROUP_CONFIG[activeTool.group]?.color ?? ORANGE}40`, background: `${GROUP_CONFIG[activeTool.group]?.color ?? ORANGE}15` }}
            >
              {activeTool.group}
            </span>
            <ChevronRight className="w-3 h-3" style={{ color: MUTED }} />
            <span className="text-xs font-semibold" style={{ color: TEXT }}>{activeTool.name}</span>
          </div>

          {/* Tool runner with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <ToolRunner
                toolId={activeTool.id}
                title={activeTool.name}
                description={activeTool.desc}
                icon={activeTool.icon}
                fields={activeTool.fields}
              />
            </motion.div>
          </AnimatePresence>

          {/* Related tools */}
          {(() => {
            const related = TOOLS.filter((t) => t.group === activeTool.group && t.id !== activeTool.id).slice(0, 3);
            if (related.length === 0) return null;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-6 border-t"
                style={{ borderColor: BORDER }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>
                  Tools liên quan trong {activeTool.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {related.map((t) => (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTool(t)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all hover:border-[#FF6B00]/40"
                      style={{ background: CARD, borderColor: BORDER, color: MUTED }}
                    >
                      <span>{t.icon}</span>
                      {t.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })()}

          {/* Platform overview cards (shown when scrolled past tools) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              { icon: <Building2 className="w-5 h-5" />,  title: "Business OS",      desc: "Thiết kế toàn bộ hệ điều hành doanh nghiệp với AI", color: "#FF6B00", group: "Business OS" },
              { icon: <Users className="w-5 h-5" />,       title: "CRM thông minh",   desc: "Quản lý khách hàng và tự động hóa marketing", color: "#3B82F6", group: "CRM & Khách hàng" },
              { icon: <Zap className="w-5 h-5" />,         title: "Vận hành tối ưu",  desc: "ERP, workflow, HR — toàn bộ operations AI-driven", color: "#8B5CF6", group: "Vận hành" },
              { icon: <BarChart3 className="w-5 h-5" />,   title: "Analytics & BI",   desc: "Phân tích dữ liệu chuyên sâu và business intelligence", color: "#10B981", group: "Phân tích" },
              { icon: <Plug className="w-5 h-5" />,        title: "Tech & API",       desc: "API Hub, Search Engine, Multi-Agent Orchestration", color: "#F59E0B", group: "Công nghệ" },
              { icon: <Shield className="w-5 h-5" />,      title: "Security & KB",    desc: "Bảo mật hệ thống và knowledge base thông minh", color: "#EC4899", group: "Kiến thức" },
            ].map((card) => (
              <motion.button
                key={card.title}
                whileHover={{ y: -3, boxShadow: `0 12px 30px ${card.color}20` }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  const firstTool = TOOLS.find((t) => t.group === card.group);
                  if (firstTool) setActiveTool(firstTool);
                }}
                className="rounded-2xl border p-4 text-left transition-all hover:border-opacity-50"
                style={{ background: CARD, borderColor: BORDER }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${card.color}20`, color: card.color }}
                >
                  {card.icon}
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: TEXT }}>{card.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{card.desc}</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: `${ORANGE}10`, borderColor: `${ORANGE}30` }}
          >
            <div>
              <p className="font-semibold mb-0.5" style={{ color: TEXT }}>Cần tư vấn triển khai?</p>
              <p className="text-sm" style={{ color: MUTED }}>Đội ngũ MonetAI sẵn sàng hỗ trợ doanh nghiệp của bạn.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="tel:0562557777"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: ORANGE, color: TEXT }}
              >
                0562 557 777
              </a>
              <a
                href="mailto:monetai.vn@gmail.com"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
                style={{ borderColor: `${ORANGE}50`, color: ORANGE }}
              >
                Email
              </a>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
