"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Mail, MessageCircle, ChevronRight, Menu, X } from "lucide-react";
import { posts, CATEGORIES, getFeaturedPosts, formatDate, type Category } from "@/data/blog-posts";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const BG      = "#0D0B07";
const BG2     = "#141209";
const GOLD    = "#C89A3C";
const GOLD2   = "#D4A840";
const BORDER  = "#2A2318";
const TEXT    = "#F5F0E8";
const MUTED   = "#7A6B55";

const ZALO_LINK = "https://zalo.me/0562557777";

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: BG, borderColor: BORDER }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/blog" className="flex items-center gap-0 font-bold text-xl" style={{ fontFamily: "var(--font-inter)" }}>
          <span style={{ color: TEXT }}>Monet</span>
          <span style={{ color: GOLD }}>AI</span>
          <span className="ml-1 text-xs font-normal" style={{ color: MUTED }}>Blog</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Chuyên mục", href: "#categories" },
            { label: "Bài viết",   href: "#posts" },
            { label: "MonetAI",    href: "/" },
          ].map((item) => (
            <Link
              key={item.label} href={item.href}
              className="text-sm transition-colors hover:opacity-100"
              style={{ color: MUTED, fontFamily: "var(--font-inter)" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: GOLD, color: "#0D0B07", fontFamily: "var(--font-inter)" }}
          >
            Dùng thử MonetAI
          </Link>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2" style={{ color: TEXT }}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
          className="md:hidden border-t px-4 py-4 space-y-3"
          style={{ borderColor: BORDER, background: BG2 }}
        >
          {[
            { label: "Chuyên mục", href: "#categories" },
            { label: "Bài viết",   href: "#posts" },
            { label: "MonetAI",    href: "/" },
          ].map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
              className="block text-sm py-2" style={{ color: MUTED }}>
              {item.label}
            </Link>
          ))}
          <Link href="/register" onClick={() => setOpen(false)}
            className="block text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
            style={{ background: GOLD, color: "#0D0B07" }}>
            Dùng thử MonetAI
          </Link>
        </motion.div>
      )}
    </nav>
  );
}

// ─── Article image placeholder ─────────────────────────────────────────────────
function ArticleImage({ category }: { category: string }) {
  const emojis: Record<string, string> = {
    "Hướng dẫn": "📚",
    "Case Study": "💰",
    "So sánh":   "⚖️",
    "Xu hướng":  "🚀",
  };
  return (
    <div
      className="w-full aspect-[16/9] rounded-xl flex items-end p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BG2} 0%, #1A1510 50%, #0F0C08 100%)`,
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="relative text-4xl">{emojis[category] ?? "✨"}</span>
    </div>
  );
}

// ─── Category badge ─────────────────────────────────────────────────────────────
function Badge({ cat }: { cat: string }) {
  return (
    <span
      className="inline-block text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded border"
      style={{ color: GOLD, borderColor: GOLD + "55", background: "transparent", fontFamily: "var(--font-inter)" }}
    >
      {cat}
    </span>
  );
}

// ─── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, size = "normal" }: { post: (typeof posts)[0]; size?: "large" | "normal" }) {
  const d = new Date(post.publishedAt);
  const day = d.getDate();
  const month = d.toLocaleDateString("vi-VN", { month: "short" });

  return (
    <motion.article
      whileHover={{ borderColor: GOLD + "66" }}
      transition={{ duration: 0.2 }}
      className="border rounded-xl overflow-hidden cursor-pointer transition-all"
      style={{ borderColor: BORDER, background: BG2 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <ArticleImage category={post.category} />

        {/* Body */}
        <div className="p-5">
          <Badge cat={post.category} />
          <h3
            className={`mt-3 font-bold leading-snug ${size === "large" ? "text-xl" : "text-base"}`}
            style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}
          >
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: MUTED }}>
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs" style={{ color: MUTED, fontFamily: "var(--font-inter)" }}>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} phút đọc
            </span>
            <span>{day} {month}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  return (
    <section className="py-20 px-4" style={{ background: BG2 }}>
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD, fontFamily: "var(--font-inter)" }}>
          Đừng bỏ lỡ
        </p>
        <h2 className="text-3xl font-bold mb-3" style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
          Nhận hướng dẫn mới mỗi tuần
        </h2>
        <p className="text-base mb-8" style={{ color: MUTED }}>
          Một email ngắn gọn, không spam — chỉ những gì thực sự đáng đọc.
        </p>

        {done ? (
          <div className="border rounded-xl p-6 text-center" style={{ borderColor: GOLD + "44", background: GOLD + "11" }}>
            <p className="font-bold" style={{ color: GOLD, fontFamily: "var(--font-playfair)" }}>Đã đăng ký thành công! ✓</p>
            <p className="text-sm mt-1" style={{ color: MUTED }}>Kiểm tra email để xác nhận.</p>
          </div>
        ) : (
          <form onSubmit={submit}
            className="border rounded-xl overflow-hidden"
            style={{ borderColor: BORDER }}
          >
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="w-full px-5 py-4 text-sm outline-none bg-transparent"
              style={{ color: TEXT, fontFamily: "var(--font-inter)" }}
            />
            <button
              type="submit"
              className="w-full py-3.5 font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
              style={{ background: GOLD, color: "#0D0B07", fontFamily: "var(--font-inter)" }}
            >
              Đăng ký
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-12 px-4" style={{ background: BG, borderColor: BORDER }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-0 font-bold text-xl mb-3" style={{ fontFamily: "var(--font-inter)" }}>
              <span style={{ color: TEXT }}>Monet</span>
              <span style={{ color: GOLD }}>AI</span>
              <span className="ml-1 text-xs font-normal" style={{ color: MUTED }}>Blog</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Kiếm tiền cùng AI — hướng dẫn thực chiến cho người Việt.
            </p>
            {/* Zalo CTA */}
            <a
              href={ZALO_LINK}
              target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#0068FF", color: "#fff", fontFamily: "var(--font-inter)" }}
            >
              <MessageCircle className="w-4 h-4" />
              Tham gia Group Zalo
            </a>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD, fontFamily: "var(--font-inter)" }}>
              Chuyên mục
            </p>
            <ul className="space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/blog?cat=${encodeURIComponent(c.id)}`}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: MUTED, fontFamily: "var(--font-inter)" }}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD, fontFamily: "var(--font-inter)" }}>
              Liên kết
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Về MonetAI",        href: "/" },
                { label: "Đăng ký dùng thử",  href: "/register" },
                { label: "Liên hệ",           href: "/contact" },
                { label: "Điều khoản",        href: "#" },
                { label: "Zalo Group",        href: ZALO_LINK, external: true },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: MUTED, fontFamily: "var(--font-inter)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3" style={{ borderColor: BORDER }}>
          <p className="text-xs" style={{ color: MUTED, fontFamily: "var(--font-inter)" }}>
            © 2026 MonetAI Blog. Bản quyền thuộc về MonetAI.
          </p>
          <p className="text-xs" style={{ color: MUTED, fontFamily: "var(--font-inter)" }}>
            Đối tác chính thức của{" "}
            <Link href="/" className="underline" style={{ color: GOLD }}>MonetAI</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCat, setActiveCat] = useState<Category | "Tất cả">("Tất cả");
  const featured = getFeaturedPosts();
  const filtered = activeCat === "Tất cả" ? posts : posts.filter((p) => p.category === activeCat);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "var(--font-inter)" }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-6 flex items-center gap-3"
            style={{ color: GOLD }}>
            <span className="w-8 h-px inline-block" style={{ background: GOLD }} />
            Kiếm tiền cùng AI
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
            style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
            AI không thay bạn{" "}
            <span className="block">kiếm tiền.</span>
            <em className="block not-italic" style={{ color: GOLD }}>
              Nó dạy bạn cách.
            </em>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-10" style={{ color: MUTED }}>
            Hướng dẫn thực chiến, case study thật, và đánh giá công cụ AI — để bạn biến
            công nghệ thành thu nhập, không phải thành nỗi sợ bị bỏ lại.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.a
              href="#posts"
              whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-xl text-sm"
              style={{ background: GOLD, color: "#0D0B07" }}
            >
              Đọc bài mới nhất <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="/"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-4 rounded-xl text-sm border transition-colors hover:bg-white/5"
              style={{ border: `1px solid ${BORDER}`, color: TEXT }}
            >
              Khám phá MonetAI
            </motion.a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mt-16 pt-10 border-t"
          style={{ borderColor: BORDER }}
        >
          {[
            { num: "120+",  label: "Hướng dẫn chi tiết" },
            { num: "35K",   label: "Người đọc mỗi tháng" },
            { num: "4.8/5", label: "Đánh giá từ độc giả" },
          ].map((s) => (
            <div key={s.num}>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: GOLD, fontFamily: "var(--font-playfair)" }}>
                {s.num}
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: MUTED }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section id="categories" className="py-16 px-4 border-t border-b" style={{ background: BG2, borderColor: BORDER }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD }}>Chuyên mục</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
            Bốn hướng đi, một mục tiêu
          </h2>
          <p className="text-sm mb-10" style={{ color: MUTED }}>
            Mỗi chuyên mục giải quyết một câu hỏi cụ thể trên hành trình dùng AI để tạo thu nhập.
          </p>

          <div className="space-y-px border rounded-xl overflow-hidden" style={{ borderColor: BORDER }}>
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => {
                  setActiveCat(cat.id);
                  document.getElementById("posts")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ backgroundColor: "#1A1510" }}
                transition={{ duration: 0.15 }}
                className="w-full flex items-start gap-6 p-5 text-left border-b last:border-b-0 transition-colors"
                style={{ borderColor: BORDER, background: "transparent" }}
              >
                <span className="text-xs font-semibold mt-1 flex-shrink-0" style={{ color: GOLD }}>
                  {cat.num}
                </span>
                <div className="border-l pl-4 flex-1" style={{ borderColor: BORDER }}>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                    {cat.id === "Hướng dẫn" ? "Hướng dẫn" :
                     cat.id === "Case Study" ? "Case Study" :
                     cat.id === "So sánh" ? "So sánh" : "Xu hướng"}
                  </p>
                  <p className="font-bold text-base" style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
                    {cat.label}
                  </p>
                  <p className="text-sm mt-1" style={{ color: MUTED }}>{cat.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: MUTED }} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Posts ─────────────────────────────────────────── */}
      <section id="posts" className="py-16 px-4" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD }}>Mới đăng</p>
          <h2 className="text-3xl font-bold mb-10" style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
            Bài viết nổi bật
          </h2>

          <div className="space-y-6">
            {featured.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <PostCard post={post} size={i === 0 ? "large" : "normal"} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MonetAI Promo ──────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t" style={{ background: BG2, borderColor: BORDER }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Card visual */}
            <div
              className="aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden border"
              style={{ background: BG, borderColor: GOLD + "44" }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <span className="relative text-7xl font-bold" style={{ color: GOLD, fontFamily: "var(--font-playfair)" }}>AI</span>
              <p className="relative text-xs tracking-widest uppercase text-center px-4" style={{ color: MUTED }}>
                Công cụ độc quyền của MonetAI Blog
              </p>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD }}>Giới thiệu</p>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4"
                style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
                MonetAI — công cụ chúng tôi tin dùng nhất
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: MUTED }}>
                Mọi hướng dẫn trên blog này đều được kiểm chứng thực tế. MonetAI là công cụ AI mà
                đội ngũ trực tiếp sử dụng và giới thiệu vì hiệu quả đã được chứng minh qua từng case study.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Thiết lập trong vài phút, không cần kỹ năng kỹ thuật",
                  "Tự động hoá các công việc tạo thu nhập lặp lại",
                  "Có cộng đồng người dùng Việt Nam hỗ trợ trực tiếp",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: MUTED }}>
                    <span className="flex-shrink-0" style={{ color: GOLD }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm"
                style={{ background: GOLD, color: "#0D0B07" }}
              >
                Dùng thử MonetAI miễn phí <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Posts by Category ──────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {(["Tất cả", ...CATEGORIES.map((c) => c.id)] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat as Category | "Tất cả")}
                className="text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-lg border transition-all"
                style={
                  activeCat === cat
                    ? { background: GOLD, borderColor: GOLD, color: "#0D0B07" }
                    : { borderColor: BORDER, color: MUTED, background: "transparent" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p style={{ color: MUTED }}>Chưa có bài viết trong chuyên mục này.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Zalo CTA ──────────────────────────────────────────────── */}
      <section className="py-14 px-4 border-t" style={{ background: BG2, borderColor: BORDER }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD }}>
            Cộng đồng
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
            Tham gia group Zalo — Kiếm tiền với AI
          </h2>
          <p className="text-sm mb-8" style={{ color: MUTED }}>
            Hơn 1.000 người Việt chia sẻ kinh nghiệm, case study và hỗ trợ nhau kiếm tiền với AI.
            Hoàn toàn miễn phí.
          </p>
          <motion.a
            href={ZALO_LINK}
            target="_blank" rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-xl text-sm"
            style={{ background: "#0068FF", color: "#fff" }}
          >
            <MessageCircle className="w-5 h-5" />
            Vào Group Zalo ngay — Miễn phí
          </motion.a>
          <p className="mt-4 text-xs" style={{ color: MUTED }}>
            Hotline hỗ trợ: <a href="tel:0562557777" style={{ color: GOLD }}>0562 55 7777</a>
          </p>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────────────── */}
      <Newsletter />

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
