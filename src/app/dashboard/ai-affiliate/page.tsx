"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, QrCode, Plus, Trash2, CheckCircle, TrendingUp } from "lucide-react";
import ToolRunner from "@/components/tools/ToolRunner";
import { useAuth } from "@/contexts/AuthContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG      = "#0A0A0F";
const CARD    = "#16161F";
const BORDER  = "#2A2A3A";
const ORANGE  = "#FF6B00";
const MUTED   = "#A0A0B0";
const TEXT    = "#FFFFFF";
const INPUT_BG = "#0D0D16";

// ─── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "product-finder",
    name: "AI Product Finder",
    icon: "🔍",
    desc: "Tìm sản phẩm hot, phân tích hoa hồng, dự đoán xu hướng",
    fields: [
      { name: "niche", label: "Thị trường ngách", placeholder: "Ví dụ: sức khỏe, làm đẹp, công nghệ...", type: "text" as const, required: true },
      { name: "platform", label: "Nền tảng quảng bá", placeholder: "", type: "select" as const, options: ["Facebook", "TikTok", "YouTube", "Blog/SEO", "Email", "Tất cả"] },
      { name: "budget", label: "Ngân sách/tháng (VNĐ)", placeholder: "Ví dụ: 5.000.000", type: "text" as const },
    ],
  },
  {
    id: "affiliate-advisor",
    name: "AI Affiliate Advisor",
    icon: "🎯",
    desc: "Đề xuất sản phẩm phù hợp, gợi ý thị trường ngách, lập kế hoạch bán hàng",
    fields: [
      { name: "experience", label: "Kinh nghiệm", placeholder: "", type: "select" as const, options: ["Mới bắt đầu", "1-6 tháng", "6-12 tháng", "Trên 1 năm"] },
      { name: "niche", label: "Niche quan tâm", placeholder: "Niche bạn muốn làm hoặc đang làm", type: "text" as const, required: true },
      { name: "goal", label: "Mục tiêu thu nhập/tháng", placeholder: "Ví dụ: 10.000.000 VNĐ", type: "text" as const },
    ],
  },
  {
    id: "landing-page-builder",
    name: "AI Landing Page Builder",
    icon: "📄",
    desc: "Tạo Landing Page tối ưu chuyển đổi, responsive",
    fields: [
      { name: "product", label: "Tên sản phẩm/dịch vụ", placeholder: "Ví dụ: Khóa học AI Marketing", type: "text" as const, required: true },
      { name: "audience", label: "Khách hàng mục tiêu", placeholder: "Ví dụ: Người làm kinh doanh 25-45 tuổi", type: "text" as const, required: true },
      { name: "benefits", label: "3 lợi ích chính", placeholder: "Lợi ích 1, Lợi ích 2, Lợi ích 3", type: "textarea" as const, rows: 3 },
      { name: "price", label: "Giá sản phẩm", placeholder: "Ví dụ: 997.000 VNĐ", type: "text" as const },
    ],
  },
  {
    id: "traffic-planner",
    name: "AI Traffic Planner",
    icon: "📊",
    desc: "Đề xuất nguồn traffic: Facebook, TikTok, SEO, YouTube",
    fields: [
      { name: "product", label: "Sản phẩm affiliate", placeholder: "Sản phẩm bạn muốn quảng bá", type: "text" as const, required: true },
      { name: "budget", label: "Ngân sách quảng cáo", placeholder: "Ví dụ: 3.000.000 VNĐ/tháng hoặc 0 (free traffic)", type: "text" as const },
      { name: "channels", label: "Kênh ưu tiên", placeholder: "", type: "select" as const, options: ["Facebook", "TikTok", "YouTube", "SEO/Blog", "Email", "Kết hợp tất cả"] },
    ],
  },
  {
    id: "audience-finder",
    name: "AI Audience Finder",
    icon: "👥",
    desc: "Phân tích khách hàng, tạo Persona, khai thác Insight",
    fields: [
      { name: "product", label: "Sản phẩm/niche", placeholder: "Sản phẩm hoặc thị trường ngách", type: "text" as const, required: true },
      { name: "price_range", label: "Khoảng giá sản phẩm", placeholder: "Ví dụ: 200k-500k VNĐ", type: "text" as const },
      { name: "competitors", label: "Đối thủ cạnh tranh (nếu biết)", placeholder: "Ví dụ: Tiki, Shopee, ...", type: "text" as const },
    ],
  },
  {
    id: "campaign-planner",
    name: "AI Campaign Planner",
    icon: "📅",
    desc: "Lập kế hoạch Affiliate 30 ngày chi tiết",
    fields: [
      { name: "product", label: "Sản phẩm Affiliate", placeholder: "Tên sản phẩm cần quảng bá", type: "text" as const, required: true },
      { name: "budget", label: "Ngân sách 30 ngày", placeholder: "Ví dụ: 10.000.000 VNĐ", type: "text" as const },
      { name: "channels", label: "Kênh sử dụng", placeholder: "Facebook, TikTok, Email...", type: "text" as const },
      { name: "target", label: "Mục tiêu doanh thu", placeholder: "Ví dụ: 30.000.000 VNĐ", type: "text" as const },
    ],
  },
  {
    id: "conversion-optimizer",
    name: "AI Conversion Optimizer",
    icon: "⚡",
    desc: "Tăng tỷ lệ chuyển đổi cho chiến dịch Affiliate",
    fields: [
      { name: "current_approach", label: "Cách tiếp cận hiện tại", placeholder: "Mô tả bạn đang làm gì để bán hàng...", type: "textarea" as const, required: true, rows: 3 },
      { name: "conversion_rate", label: "Tỷ lệ chuyển đổi hiện tại (%)", placeholder: "Ví dụ: 1.5 (để trống nếu chưa biết)", type: "text" as const },
      { name: "product_type", label: "Loại sản phẩm", placeholder: "", type: "select" as const, options: ["Khóa học online", "Phần mềm/SaaS", "Sản phẩm vật lý", "Dịch vụ", "Khác"] },
    ],
  },
  {
    id: "affiliate-coach",
    name: "AI Affiliate Coach",
    icon: "🏆",
    desc: "Huấn luyện Affiliate từ 0 đến có thu nhập",
    fields: [
      { name: "question", label: "Câu hỏi / Tình huống của bạn", placeholder: "Hỏi bất cứ điều gì về Affiliate Marketing...", type: "textarea" as const, required: true, rows: 4 },
      { name: "level", label: "Cấp độ hiện tại", placeholder: "", type: "select" as const, options: ["Hoàn toàn mới", "Đã có kiến thức cơ bản", "Đang làm nhưng chưa có kết quả", "Đang có thu nhập, muốn scale"] },
    ],
  },
];

// Special tool IDs (client-side only)
const LINK_MANAGER_ID    = "link-manager";
const COMMISSION_TRACKER_ID = "commission-tracker";

const SPECIAL_TOOLS = [
  { id: LINK_MANAGER_ID,       name: "AI Link Manager",       icon: "🔗", desc: "Rút gọn link, tạo QR Code, quản lý link Affiliate" },
  { id: COMMISSION_TRACKER_ID, name: "AI Commission Tracker", icon: "💰", desc: "Theo dõi hoa hồng, thống kê doanh thu Affiliate" },
];

const ALL_TOOLS = [...TOOLS, ...SPECIAL_TOOLS];

// Sidebar groups
const GROUPS = [
  {
    label: "Tìm & Phân tích",
    tools: ["product-finder", "affiliate-advisor", "audience-finder"],
  },
  {
    label: "Kế hoạch & Chiến dịch",
    tools: ["campaign-planner", "traffic-planner", "conversion-optimizer"],
  },
  {
    label: "Xây dựng & Bán hàng",
    tools: ["landing-page-builder", "affiliate-coach"],
  },
  {
    label: "Quản lý",
    tools: [LINK_MANAGER_ID, COMMISSION_TRACKER_ID],
  },
];

// ─── Link Manager Component ───────────────────────────────────────────────────
function LinkManager() {
  const [url, setUrl]       = useState("");
  const [short, setShort]   = useState("");
  const [qrSrc, setQrSrc]   = useState("");
  const [copied, setCopied] = useState(false);

  function handleShorten() {
    if (!url.trim()) return;
    const slug = Math.random().toString(36).slice(2, 8).toUpperCase();
    const shortened = `https://mnt.ai/${slug}`;
    setShort(shortened);
    const encoded = encodeURIComponent(shortened);
    setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`);
    setCopied(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(short);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]`;
  const inputSty = { background: INPUT_BG, borderColor: BORDER, color: TEXT } as React.CSSProperties;

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">🔗</span>
        <h2 className="font-bold text-lg" style={{ color: TEXT }}>AI Link Manager</h2>
      </div>
      <p className="text-sm mb-6" style={{ color: MUTED }}>Rút gọn link Affiliate, tạo QR Code chia sẻ dễ dàng</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Link Affiliate gốc <span style={{ color: ORANGE }}>*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-affiliate-link?ref=abc123"
              className={inputCls}
              style={inputSty}
            />
          </div>
          <motion.button
            onClick={handleShorten}
            disabled={!url.trim()}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-40"
            style={{ background: ORANGE, color: "#fff" }}
          >
            <Link2 className="w-4 h-4" />
            Rút gọn &amp; Tạo QR
          </motion.button>
        </div>

        {/* Output */}
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: BORDER, background: CARD }}>
          {!short ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <QrCode className="w-10 h-10 mb-3" style={{ color: MUTED }} />
              <p className="text-sm" style={{ color: MUTED }}>Dán link và nhấn rút gọn để tạo link ngắn + QR</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Link rút gọn</p>
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border"
                    style={{ borderColor: BORDER, background: INPUT_BG }}
                  >
                    <span className="flex-1 text-sm font-mono" style={{ color: ORANGE }}>{short}</span>
                    <button
                      onClick={copy}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-white/5"
                      style={{ color: copied ? "#10B981" : ORANGE }}
                    >
                      {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                      {copied ? "Đã copy" : "Copy"}
                    </button>
                  </div>
                </div>
                {qrSrc && (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xs font-semibold self-start" style={{ color: MUTED }}>QR Code</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrSrc} alt="QR Code" className="w-40 h-40 rounded-xl" />
                    <a
                      href={qrSrc}
                      download="monetai-qr.png"
                      className="text-xs px-4 py-2 rounded-lg font-semibold transition-colors"
                      style={{ background: `${ORANGE}20`, color: ORANGE }}
                    >
                      Tải QR về máy
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Commission Tracker Component ─────────────────────────────────────────────
interface Commission {
  id: string;
  date: string;
  product: string;
  amount: number;
  status: "Pending" | "Paid";
}

const STORAGE_KEY = "monetai_commissions";

function CommissionTracker() {
  const [entries, setEntries] = useState<Commission[]>([]);
  const [form, setForm]       = useState({ date: "", product: "", amount: "", status: "Pending" as Commission["status"] });
  const [adding, setAdding]   = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as Commission[]);
    } catch { /* ignore */ }
  }, []);

  function save(next: Commission[]) {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addEntry() {
    if (!form.date || !form.product || !form.amount) return;
    const entry: Commission = {
      id: Date.now().toString(),
      date: form.date,
      product: form.product,
      amount: parseFloat(form.amount.replace(/[^0-9.]/g, "")),
      status: form.status,
    };
    save([entry, ...entries]);
    setForm({ date: "", product: "", amount: "", status: "Pending" });
    setAdding(false);
  }

  function remove(id: string) {
    save(entries.filter((e) => e.id !== id));
  }

  function toggleStatus(id: string) {
    save(entries.map((e) => e.id === id ? { ...e, status: e.status === "Pending" ? "Paid" : "Pending" } : e));
  }

  const total  = entries.reduce((s, e) => s + e.amount, 0);
  const paid   = entries.filter((e) => e.status === "Paid").reduce((s, e) => s + e.amount, 0);
  const pending = total - paid;

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00]`;
  const inputSty = { background: INPUT_BG, borderColor: BORDER, color: TEXT } as React.CSSProperties;

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">💰</span>
        <h2 className="font-bold text-lg" style={{ color: TEXT }}>AI Commission Tracker</h2>
      </div>
      <p className="text-sm mb-5" style={{ color: MUTED }}>Theo dõi hoa hồng, quản lý doanh thu Affiliate của bạn</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Tổng hoa hồng", value: total,   color: ORANGE },
          { label: "Đã thanh toán",  value: paid,    color: "#10B981" },
          { label: "Chờ duyệt",      value: pending, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: CARD }}>
            <p className="text-xs mb-1" style={{ color: MUTED }}>{s.label}</p>
            <p className="font-bold text-sm" style={{ color: s.color }}>
              {s.value.toLocaleString("vi-VN")} ₫
            </p>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold" style={{ color: TEXT }}>Lịch sử hoa hồng ({entries.length})</p>
        <motion.button
          onClick={() => setAdding(!adding)}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-semibold"
          style={{ background: `${ORANGE}20`, color: ORANGE }}
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm hoa hồng
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 rounded-xl border p-4"
            style={{ borderColor: `${ORANGE}40`, background: `${ORANGE}08` }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: MUTED }}>Ngày</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} style={inputSty} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: MUTED }}>Sản phẩm *</label>
                <input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="Tên sản phẩm" className={inputCls} style={inputSty} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: MUTED }}>Hoa hồng (VNĐ) *</label>
                <input type="text" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Ví dụ: 500000" className={inputCls} style={inputSty} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: MUTED }}>Trạng thái</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Commission["status"] })} className={inputCls} style={{ ...inputSty, cursor: "pointer" }}>
                  <option value="Pending" style={{ background: "#16161F" }}>Chờ duyệt</option>
                  <option value="Paid" style={{ background: "#16161F" }}>Đã thanh toán</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setAdding(false)} className="text-xs px-4 py-2 rounded-lg border transition-colors hover:bg-white/5" style={{ borderColor: BORDER, color: MUTED }}>Hủy</button>
              <motion.button onClick={addEntry} whileTap={{ scale: 0.96 }} className="text-xs px-4 py-2 rounded-lg font-semibold" style={{ background: ORANGE, color: "#fff" }}>
                Lưu
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {entries.length === 0 ? (
        <div className="rounded-xl border py-12 flex flex-col items-center gap-3" style={{ borderColor: BORDER, background: CARD }}>
          <TrendingUp className="w-8 h-8" style={{ color: MUTED }} />
          <p className="text-sm" style={{ color: MUTED }}>Chưa có dữ liệu. Nhấn &quot;Thêm hoa hồng&quot; để bắt đầu.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
                  {["Ngày", "Sản phẩm", "Hoa hồng", "Trạng thái", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: `1px solid ${BORDER}20`, background: i % 2 === 0 ? "transparent" : `${CARD}80` }}
                  >
                    <td className="px-4 py-3" style={{ color: MUTED }}>{e.date}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: TEXT }}>{e.product}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: ORANGE }}>{e.amount.toLocaleString("vi-VN")} ₫</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(e.id)}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          background: e.status === "Paid" ? "#10B98120" : "#F59E0B20",
                          color: e.status === "Paid" ? "#10B981" : "#F59E0B",
                        }}
                      >
                        {e.status === "Paid" ? "Đã thanh toán" : "Chờ duyệt"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => remove(e.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        style={{ color: MUTED }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AiAffiliatePage() {
  useAuth(); // ensure auth context is consumed (redirect handled by layout)
  const [activeTool, setActiveTool] = useState(TOOLS[0].id);

  const currentTool = ALL_TOOLS.find((t) => t.id === activeTool) ?? ALL_TOOLS[0];
  const aiTool      = TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-5 flex flex-wrap items-center gap-3"
      >
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>AI Affiliate</h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ background: `${ORANGE}20`, color: ORANGE, border: `1px solid ${ORANGE}40` }}
            >
              10 Tools
            </span>
          </div>
          <p className="text-sm" style={{ color: MUTED }}>Bộ công cụ AI toàn diện để tối ưu hóa thu nhập Affiliate</p>
        </div>
      </motion.div>

      {/* Mobile: horizontal scrollable pill tabs */}
      <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ width: "max-content" }}>
          {ALL_TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={
                activeTool === t.id
                  ? { background: ORANGE, color: "#fff" }
                  : { background: CARD, color: MUTED, border: `1px solid ${BORDER}` }
              }
            >
              <span>{t.icon}</span>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Body: sidebar + main */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Desktop sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="hidden lg:flex flex-col w-60 shrink-0 rounded-2xl border overflow-y-auto"
          style={{ background: CARD, borderColor: BORDER }}
        >
          {GROUPS.map((g) => (
            <div key={g.label} className="py-3">
              <p
                className="px-4 pb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: MUTED }}
              >
                {g.label}
              </p>
              {g.tools.map((tid) => {
                const tool = ALL_TOOLS.find((t) => t.id === tid);
                if (!tool) return null;
                const isActive = activeTool === tid;
                return (
                  <button
                    key={tid}
                    onClick={() => setActiveTool(tid)}
                    className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 transition-all"
                    style={
                      isActive
                        ? { borderLeft: `3px solid ${ORANGE}`, background: `${ORANGE}12`, color: ORANGE }
                        : { borderLeft: "3px solid transparent", color: MUTED }
                    }
                  >
                    <span className="text-base leading-tight mt-0.5">{tool.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight truncate" style={{ color: isActive ? ORANGE : TEXT }}>
                        {tool.name}
                      </p>
                      <p className="text-xs leading-snug mt-0.5 line-clamp-2" style={{ color: isActive ? `${ORANGE}99` : MUTED }}>
                        {tool.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </motion.aside>

        {/* Main content area */}
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 min-w-0 rounded-2xl border p-5 md:p-6 overflow-y-auto"
          style={{ background: CARD, borderColor: BORDER }}
        >
          {activeTool === LINK_MANAGER_ID && <LinkManager />}
          {activeTool === COMMISSION_TRACKER_ID && <CommissionTracker />}
          {aiTool && (
            <ToolRunner
              toolId={aiTool.id}
              title={aiTool.name}
              description={aiTool.desc}
              icon={aiTool.icon}
              fields={aiTool.fields}
              submitLabel="Phân tích với AI"
            />
          )}
        </motion.div>
      </div>

      {/* Mobile: current tool info bar */}
      <div className="lg:hidden mt-3 px-3 py-2 rounded-xl border flex items-center gap-2" style={{ borderColor: BORDER, background: CARD }}>
        <span className="text-lg">{currentTool.icon}</span>
        <div>
          <p className="text-xs font-semibold" style={{ color: TEXT }}>{currentTool.name}</p>
          <p className="text-xs leading-snug" style={{ color: MUTED }}>{currentTool.desc}</p>
        </div>
      </div>
    </div>
  );
}
