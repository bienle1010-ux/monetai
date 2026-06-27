"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, RefreshCw, Plus, Trash2, CheckCircle,
  AlertCircle, Settings, MessageSquare, Star, ChevronDown, ChevronUp, GripVertical,
} from "lucide-react";

type Tab = "config" | "faq" | "testimonials";

interface HeroStats { tools: string; agents: string; orders: string }
interface SiteConfig {
  heroTitle: string; heroSub: string;
  stats: HeroStats;
  announcement: { enabled: boolean; text: string; link: string };
  contact: { email: string; phone: string; address: string };
}
interface FAQItem   { id: string; q: string; a: string }
interface Testimonial { id: string; name: string; role: string; avatar: string; rating: number; content: string }

const INP = "w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#A0A0B0]/50 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all";
const LABEL = "block text-xs font-semibold text-[#A0A0B0] mb-1.5 uppercase tracking-wide";
const CARD = "bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5";

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function AdminContentPage() {
  const [tab, setTab]         = useState<Tab>("config");
  const [config, setConfig]   = useState<SiteConfig | null>(null);
  const [faqs, setFaqs]       = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const headers = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("monetai_admin_token")}`,
  }), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/content", { headers: headers() });
      if (!res.ok) { showToast("err", "Không thể tải nội dung."); return; }
      const data = await res.json() as { config: SiteConfig; faqs: FAQItem[]; testimonials: Testimonial[] };
      setConfig(data.config);
      setFaqs(data.faqs);
      setTestimonials(data.testimonials);
    } finally { setLoading(false); }
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  async function save(type: "config" | "faqs" | "testimonials", data: unknown) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ type, data }),
      });
      if (res.ok) showToast("ok", "Đã lưu thành công!");
      else showToast("err", "Lưu thất bại.");
    } catch { showToast("err", "Lỗi kết nối."); }
    finally { setSaving(false); }
  }

  async function resetAll() {
    if (!confirm("Đặt lại toàn bộ nội dung về mặc định?")) return;
    await fetch("/api/admin/content", { method: "POST", headers: headers(), body: JSON.stringify({ type: "reset" }) });
    showToast("ok", "Đã reset về mặc định!"); await load();
  }

  // ── FAQ helpers ───────────────────────────────────────────────────────────
  function addFAQ() {
    setFaqs(prev => [...prev, { id: uid(), q: "Câu hỏi mới?", a: "Câu trả lời..." }]);
  }
  function deleteFAQ(id: string) { setFaqs(prev => prev.filter(f => f.id !== id)); }
  function updateFAQ(id: string, field: "q" | "a", val: string) {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  }
  function moveFAQ(id: string, dir: -1 | 1) {
    setFaqs(prev => {
      const idx = prev.findIndex(f => f.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  // ── Testimonial helpers ───────────────────────────────────────────────────
  function addTestimonial() {
    setTestimonials(prev => [...prev, {
      id: uid(), name: "Tên khách hàng", role: "Chức danh",
      avatar: "TK", rating: 5, content: "Nội dung đánh giá...",
    }]);
  }
  function deleteTestimonial(id: string) { setTestimonials(prev => prev.filter(t => t.id !== id)); }
  function updateTestimonial(id: string, field: keyof Testimonial, val: string | number) {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "config",       label: "Cấu hình trang",  icon: Settings },
    { id: "faq",          label: `FAQ (${faqs.length})`, icon: MessageSquare },
    { id: "testimonials", label: `Đánh giá (${testimonials.length})`, icon: Star },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý nội dung</h1>
          <p className="text-[#A0A0B0] text-sm mt-0.5">Chỉnh sửa nội dung hiển thị trên trang web</p>
        </div>
        <button onClick={resetAll} className="text-xs text-[#A0A0B0] hover:text-red-400 transition-colors flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Reset mặc định
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-2xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20" : "text-[#A0A0B0] hover:text-white"
            }`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Config ───────────────────────────────────────────────────── */}
      {tab === "config" && config && (
        <div className="space-y-5">
          {/* Hero */}
          <div className={CARD}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center text-xs">1</span>
              Hero Section
            </h3>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Tiêu đề chính (Hero Title)</label>
                <input className={INP} value={config.heroTitle}
                  onChange={e => setConfig({ ...config, heroTitle: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Mô tả dưới tiêu đề</label>
                <textarea className={`${INP} resize-none`} rows={3} value={config.heroSub}
                  onChange={e => setConfig({ ...config, heroSub: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(["tools", "agents", "orders"] as const).map((k, i) => (
                  <div key={k}>
                    <label className={LABEL}>{["AI Tools", "AI Agents", "Đơn hàng"][i]}</label>
                    <input className={INP} value={config.stats[k]}
                      onChange={e => setConfig({ ...config, stats: { ...config.stats, [k]: e.target.value } })} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcement */}
          <div className={CARD}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center text-xs">2</span>
              Banner thông báo
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${config.announcement.enabled ? "bg-[#FF6B00]" : "bg-[#2A2A3A]"}`}
                  onClick={() => setConfig({ ...config, announcement: { ...config.announcement, enabled: !config.announcement.enabled } })}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${config.announcement.enabled ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-[#A0A0B0]">{config.announcement.enabled ? "Đang hiện" : "Đang ẩn"}</span>
              </label>
              <div>
                <label className={LABEL}>Nội dung thông báo</label>
                <input className={INP} placeholder="VD: 🎉 Ra mắt tính năng mới — Tham gia ngay!" value={config.announcement.text}
                  onChange={e => setConfig({ ...config, announcement: { ...config.announcement, text: e.target.value } })} />
              </div>
              <div>
                <label className={LABEL}>Link (tùy chọn)</label>
                <input className={INP} placeholder="/pricing hoặc https://..." value={config.announcement.link}
                  onChange={e => setConfig({ ...config, announcement: { ...config.announcement, link: e.target.value } })} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className={CARD}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center text-xs">3</span>
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              {([["email", "Email liên hệ"], ["phone", "Số hotline"], ["address", "Địa chỉ"]] as const).map(([k, l]) => (
                <div key={k}>
                  <label className={LABEL}>{l}</label>
                  <input className={INP} value={config.contact[k]}
                    onChange={e => setConfig({ ...config, contact: { ...config.contact, [k]: e.target.value } })} />
                </div>
              ))}
            </div>
          </div>

          <motion.button onClick={() => save("config", config)} disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu cấu hình trang
          </motion.button>
        </div>
      )}

      {/* ── TAB: FAQ ──────────────────────────────────────────────────────── */}
      {tab === "faq" && (
        <div className="space-y-3">
          <AnimatePresence>
            {faqs.map((f, i) => (
              <motion.div key={f.id}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`${CARD} border-l-2`}
                style={{ borderLeftColor: expandedFAQ === f.id ? "#FF6B00" : "#2A2A3A" }}>
                {/* Header row */}
                <div className="flex items-center gap-3 mb-3">
                  <GripVertical className="w-4 h-4 text-[#3A3A4A] shrink-0" />
                  <span className="w-6 h-6 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <input value={f.q} onChange={e => updateFAQ(f.id, "q", e.target.value)}
                    className="flex-1 bg-transparent border-0 text-white text-sm font-medium outline-none placeholder-[#A0A0B0]/50"
                    placeholder="Câu hỏi..." />
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveFAQ(f.id, -1)} disabled={i === 0}
                      className="p-1 rounded hover:bg-white/5 text-[#A0A0B0] hover:text-white disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveFAQ(f.id, 1)} disabled={i === faqs.length - 1}
                      className="p-1 rounded hover:bg-white/5 text-[#A0A0B0] hover:text-white disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setExpandedFAQ(expandedFAQ === f.id ? null : f.id)}
                      className="p-1 rounded hover:bg-white/5 text-[#A0A0B0] hover:text-white">
                      {expandedFAQ === f.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteFAQ(f.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Answer (expanded) */}
                <AnimatePresence>
                  {expandedFAQ === f.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <label className={`${LABEL} mt-2`}>Câu trả lời</label>
                      <textarea value={f.a} onChange={e => updateFAQ(f.id, "a", e.target.value)}
                        className={`${INP} resize-none`} rows={4} placeholder="Câu trả lời chi tiết..." />
                    </motion.div>
                  )}
                </AnimatePresence>
                {expandedFAQ !== f.id && (
                  <p className="text-xs text-[#A0A0B0] ml-9 truncate">{f.a}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={addFAQ}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-[#FF6B00]/30 text-[#FF6B00] text-sm font-medium py-3 rounded-xl hover:bg-[#FF6B00]/5 transition-colors">
            <Plus className="w-4 h-4" /> Thêm câu hỏi mới
          </button>

          <motion.button onClick={() => save("faqs", faqs)} disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu {faqs.length} câu hỏi
          </motion.button>
        </div>
      )}

      {/* ── TAB: Testimonials ─────────────────────────────────────────────── */}
      {tab === "testimonials" && (
        <div className="space-y-4">
          <AnimatePresence>
            {testimonials.map((t) => (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className={CARD}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold flex items-center justify-center">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-[#A0A0B0] text-xs">{t.role}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteTestimonial(t.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={LABEL}>Họ tên</label>
                    <input className={INP} value={t.name} onChange={e => updateTestimonial(t.id, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className={LABEL}>Chức danh / Nghề nghiệp</label>
                    <input className={INP} value={t.role} onChange={e => updateTestimonial(t.id, "role", e.target.value)} />
                  </div>
                  <div>
                    <label className={LABEL}>Avatar (chữ viết tắt, max 3)</label>
                    <input className={INP} maxLength={3} value={t.avatar}
                      onChange={e => updateTestimonial(t.id, "avatar", e.target.value.toUpperCase())} />
                  </div>
                  <div>
                    <label className={LABEL}>Số sao (1-5)</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => updateTestimonial(t.id, "rating", star)}
                          className={`text-xl transition-colors ${star <= t.rating ? "text-yellow-400" : "text-[#3A3A4A]"}`}>★</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Nội dung đánh giá</label>
                  <textarea className={`${INP} resize-none`} rows={3} value={t.content}
                    onChange={e => updateTestimonial(t.id, "content", e.target.value)} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={addTestimonial}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-[#FF6B00]/30 text-[#FF6B00] text-sm font-medium py-3 rounded-xl hover:bg-[#FF6B00]/5 transition-colors">
            <Plus className="w-4 h-4" /> Thêm đánh giá mới
          </button>

          <motion.button onClick={() => save("testimonials", testimonials)} disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu {testimonials.length} đánh giá
          </motion.button>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold z-50"
            style={{ background: toast.type === "ok" ? "#10B981" : "#EF4444", color: "#fff" }}>
            {toast.type === "ok" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
