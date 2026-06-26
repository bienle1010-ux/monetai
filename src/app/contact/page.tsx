"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Send, CheckCircle, AlertCircle,
  Facebook, Youtube, Linkedin, MessageCircle, ArrowRight,
  Navigation,
} from "lucide-react";

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.85a8.2 8.2 0 004.79 1.52V6.91a4.85 4.85 0 01-1.02-.22z"/>
    </svg>
  );
}

function ZaloIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.003 0C5.374 0 0 5.373 0 12c0 2.17.578 4.2 1.585 5.95L0 24l6.233-1.56A11.945 11.945 0 0012.003 24C18.63 24 24 18.627 24 12S18.63 0 12.003 0zm5.843 16.104c-.247.696-1.456 1.33-2.003 1.414-.511.076-1.158.108-1.868-.117-.43-.137-.982-.319-1.688-.624-2.962-1.277-4.893-4.271-5.04-4.471-.148-.201-1.205-1.605-1.205-3.063 0-1.457.764-2.174 1.034-2.47.27-.294.59-.368.787-.368l.566.01c.181.008.424-.069.663.505.247.594.838 2.05.912 2.2.074.15.124.327.025.527-.1.2-.15.325-.297.5-.148.176-.312.393-.445.528-.148.148-.302.308-.13.604.173.296.77 1.271 1.654 2.059 1.136 1.013 2.093 1.325 2.389 1.473.297.148.47.124.643-.074.173-.197.74-.864.937-1.161.197-.297.394-.247.664-.148.27.1 1.718.81 2.01.958.294.148.49.222.563.345.074.124.074.714-.172 1.413z"/>
    </svg>
  );
}
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const BG      = "#0A0A0F";
const CARD    = "#16161F";
const BORDER  = "#2A2A3A";
const ORANGE  = "#FF6B00";
const MUTED   = "#A0A0B0";
const TEXT    = "#FFFFFF";

const SUBJECTS = [
  "Tư vấn gói dịch vụ",
  "Hỗ trợ kỹ thuật",
  "Hợp tác & Đối tác",
  "Thanh toán & Hoa hồng",
  "Báo lỗi / Khiếu nại",
  "Khác",
] as const;

type Subject = (typeof SUBJECTS)[number];

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: Subject | "";
  message: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const SOCIAL_LINKS = [
  { icon: Facebook,     label: "Facebook",  href: "https://facebook.com/MonetAI.vn",        color: "#1877F2" },
  { icon: TikTokIcon,  label: "TikTok",    href: "https://tiktok.com/@MonetAI.vn",          color: "#F0F0F0" },
  { icon: Youtube,     label: "YouTube",   href: "https://youtube.com/@MonetAI",             color: "#FF0000" },
  { icon: Linkedin,    label: "LinkedIn",  href: "https://linkedin.com/company/monetai",     color: "#0A66C2" },
  { icon: Navigation,   label: "Telegram",  href: "https://t.me/MonetAI",                    color: "#2AABEE" },
  { icon: ZaloIcon,    label: "Zalo",      href: "https://zalo.me/0562557777",               color: "#0068FF" },
  { icon: MessageCircle, label: "Zalo OA", href: "https://zalo.me/0562557777",               color: "#0068FF" },
] as const;

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email",
    primary: "MonetAI.vn@gmail.com",
    secondary: "Phản hồi trong 24 giờ",
    href: "mailto:MonetAI.vn@gmail.com",
  },
  {
    icon: Phone,
    title: "Hotline",
    primary: "0562 557 777",
    secondary: "8:00 – 22:00 hàng ngày",
    href: "tel:0562557777",
  },
  {
    icon: MapPin,
    title: "Văn phòng",
    primary: "25A Hàn Thuyên",
    secondary: "Hai Bà Trưng, Hà Nội",
    href: "https://maps.google.com/?q=25A+Hàn+Thuyên,+Hai+Bà+Trưng,+Hà+Nội",
  },
] as const;

export default function ContactPage() {
  const [form, setForm]       = useState<FormState>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setErrMsg(data.error ?? "Có lỗi xảy ra.");
        setStatus("error");
      }
    } catch {
      setErrMsg("Không thể kết nối. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200
    focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]`
  ;
  const inputStyle = { background: "#0D0D16", borderColor: BORDER, color: TEXT };

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,107,0,0.12) 0%, transparent 70%)`,
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border mb-6"
              style={{ borderColor: ORANGE + "44", color: ORANGE, background: ORANGE + "10" }}
            >
              Liên hệ với chúng tôi
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              style={{ color: TEXT }}
            >
              Chúng tôi luôn{" "}
              <span
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] bg-clip-text text-transparent"
              >
                sẵn sàng
              </span>{" "}
              hỗ trợ
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg leading-relaxed" style={{ color: MUTED }}>
              Dù bạn cần tư vấn gói dịch vụ, hỗ trợ kỹ thuật, hay muốn trở thành đối tác —
              đội ngũ MonetAI sẽ phản hồi bạn nhanh nhất có thể.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CONTACT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.title}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(255,107,0,0.12)` }}
                className="block rounded-2xl p-6 border transition-all duration-300 group"
                style={{ background: CARD, borderColor: BORDER }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: ORANGE + "15" }}
                >
                  <Icon className="w-6 h-6" style={{ color: ORANGE }} />
                </div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: MUTED }}>
                  {card.title}
                </p>
                <p className="font-bold text-base mb-1 group-hover:text-[#FF6B00] transition-colors" style={{ color: TEXT }}>
                  {card.primary}
                </p>
                <p className="text-xs" style={{ color: MUTED }}>{card.secondary}</p>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* ── Main: Form + Social ── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 rounded-2xl border p-6 sm:p-8"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>Gửi tin nhắn</h2>
            <p className="text-sm mb-8" style={{ color: MUTED }}>Điền thông tin bên dưới, chúng tôi sẽ liên hệ trong 24 giờ.</p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center gap-4 py-16"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: ORANGE + "20" }}>
                  <CheckCircle className="w-8 h-8" style={{ color: ORANGE }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: TEXT }}>Đã nhận tin nhắn!</h3>
                <p className="text-sm max-w-xs" style={{ color: MUTED }}>
                  Cảm ơn bạn đã liên hệ. Đội ngũ MonetAI sẽ phản hồi trong vòng 24 giờ.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: ORANGE }}
                >
                  Gửi tin nhắn khác →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                      Họ và tên <span style={{ color: ORANGE }}>*</span>
                    </label>
                    <input
                      name="name" value={form.name} onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                      Email <span style={{ color: ORANGE }}>*</span>
                    </label>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                      Số điện thoại
                    </label>
                    <input
                      name="phone" value={form.phone} onChange={handleChange}
                      placeholder="0912 345 678"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                      Chủ đề
                    </label>
                    <select
                      name="subject" value={form.subject} onChange={handleChange}
                      className={inputClass}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="" style={{ background: "#16161F" }}>Chọn chủ đề...</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} style={{ background: "#16161F" }}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
                    Nội dung <span style={{ color: ORANGE }}>*</span>
                  </label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    rows={6}
                    required
                    className={inputClass + " resize-none"}
                    style={inputStyle}
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-3 rounded-lg text-sm"
                    style={{ background: "#FF000015", border: "1px solid #FF000044", color: "#FF6060" }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: ORANGE, color: "#fff" }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Gửi tin nhắn
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Social + Map — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Social */}
            <div className="rounded-2xl border p-6" style={{ background: CARD, borderColor: BORDER }}>
              <h3 className="font-bold text-base mb-1" style={{ color: TEXT }}>Mạng xã hội</h3>
              <p className="text-xs mb-5" style={{ color: MUTED }}>Theo dõi MonetAI trên các nền tảng</p>
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 hover:border-[#FF6B00]/40 group"
                    style={{ borderColor: BORDER, background: "#0D0D16" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: color + "20" }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-xs font-medium group-hover:text-white transition-colors" style={{ color: MUTED }}>
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Zalo CTA */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: `linear-gradient(135deg, #0068FF18 0%, ${CARD} 100%)`, borderColor: "#0068FF33" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#0068FF20" }}>
                <MessageCircle className="w-5 h-5" style={{ color: "#0068FF" }} />
              </div>
              <h4 className="font-bold mb-1.5" style={{ color: TEXT }}>Zalo hỗ trợ nhanh</h4>
              <p className="text-xs leading-relaxed mb-4" style={{ color: MUTED }}>
                Nhắn trực tiếp qua Zalo để được tư vấn trong vài phút. Đội ngũ hoạt động từ 8:00 – 22:00.
              </p>
              <a
                href="https://zalo.me/0562557777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                style={{ background: "#0068FF", color: "#fff" }}
              >
                Chat ngay <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: BORDER }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5!2d105.8536!3d21.0027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDAxJzA5LjciTiAxMDXCsDUxJzEzLjAiRQ!5e0!3m2!1svi!2svn!4v1!5m2!1svi!2svn"
                width="100%"
                height="160"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.6)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MonetAI Office Location"
              />
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: CARD }}>
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ORANGE }} />
                <span className="text-xs" style={{ color: MUTED }}>25A Hàn Thuyên, Hai Bà Trưng, Hà Nội</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ teaser ── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto rounded-2xl border p-8 sm:p-10 text-center"
          style={{ background: "#111118", borderColor: BORDER }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: ORANGE }}>FAQ</p>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: TEXT }}>
            Câu hỏi thường gặp
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: MUTED }}>
            Có thể bạn sẽ tìm được câu trả lời ngay trước khi cần liên hệ với chúng tôi.
          </p>
          <Link
            href="/#faq"
            className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border transition-colors hover:bg-[#FF6B00]/10"
            style={{ borderColor: ORANGE, color: ORANGE }}
          >
            Xem FAQ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
