"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";
import { getPost, posts, formatDate, type Category } from "@/data/blog-posts";

// ─── Design tokens (same as blog index) ───────────────────────────────────────
const BG     = "#0D0B07";
const BG2    = "#141209";
const GOLD   = "#C89A3C";
const BORDER = "#2A2318";
const TEXT   = "#F5F0E8";
const MUTED  = "#7A6B55";
const ZALO_LINK = "https://zalo.me/0562557777";

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

function ArticleImage({ category }: { category: Category }) {
  const emojis: Record<Category, string> = {
    "Hướng dẫn": "📚", "Case Study": "💰", "So sánh": "⚖️", "Xu hướng": "🚀",
  };
  return (
    <div
      className="w-full aspect-[21/9] rounded-2xl flex items-end p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BG2} 0%, #1A1510 50%, #0F0C08 100%)`,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <span className="relative text-6xl">{emojis[category] ?? "✨"}</span>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug);
  const related = posts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 2);

  if (!post) {
    return (
      <div style={{ background: BG, minHeight: "100vh", fontFamily: "var(--font-inter)" }}
        className="flex flex-col items-center justify-center gap-6">
        <p className="text-xl" style={{ color: TEXT }}>Không tìm thấy bài viết</p>
        <Link href="/blog" className="flex items-center gap-2 text-sm" style={{ color: GOLD }}>
          <ArrowLeft className="w-4 h-4" /> Về trang Blog
        </Link>
      </div>
    );
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: post!.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "var(--font-inter)" }}>
      {/* Minimal nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: BG, borderColor: BORDER }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: MUTED }}>
            <ArrowLeft className="w-4 h-4" />
            Blog
          </Link>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold mr-2" style={{ color: TEXT, fontFamily: "var(--font-inter)" }}>
              Monet<span style={{ color: GOLD }}>AI</span>
            </span>
            <button onClick={share}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: MUTED }}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge cat={post.category} />
            <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
              <Clock className="w-3.5 h-3.5" />{post.readTime} phút đọc
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
              <Calendar className="w-3.5 h-3.5" />{formatDate(post.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
            style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg leading-relaxed mb-10 pb-10 border-b"
            style={{ color: MUTED, borderColor: BORDER }}>
            {post.excerpt}
          </p>

          {/* Hero image */}
          <div className="mb-10">
            <ArticleImage category={post.category} />
          </div>

          {/* Content */}
          <div
            className="prose-article"
            style={{ color: MUTED }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t" style={{ borderColor: BORDER }}>
            {post.tags.map((tag) => (
              <span key={tag}
                className="text-xs px-3 py-1.5 rounded-lg border"
                style={{ borderColor: BORDER, color: MUTED, fontFamily: "var(--font-inter)" }}>
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── CTA Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 border rounded-2xl p-6 sm:p-8"
          style={{ background: BG2, borderColor: GOLD + "44" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>
            Áp dụng ngay
          </p>
          <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
            Bắt đầu kiếm tiền với MonetAI ngay hôm nay
          </h3>
          <p className="text-sm mb-6" style={{ color: MUTED }}>
            Tất cả những gì được nhắc đến trong bài viết này đều có thể thực hiện ngay với MonetAI —
            Affiliate Marketplace, AI Content Generator, và hơn 1.000 AI Agents sẵn sàng.
          </p>
          <ul className="space-y-2.5 mb-6">
            {[
              "Miễn phí tạo tài khoản, không cần thẻ tín dụng",
              "Lấy link Affiliate ngay lập tức",
              "AI tạo nội dung bán hàng trong 30 giây",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: MUTED }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ background: GOLD, color: "#0D0B07" }}
          >
            Dùng thử miễn phí <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── Zalo ── */}
        <div className="mt-6 border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: BG2, borderColor: BORDER }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: TEXT }}>Tham gia Group Zalo — Kiếm tiền với AI</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>1.000+ người Việt chia sẻ kinh nghiệm thực tế. Miễn phí.</p>
          </div>
          <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm"
            style={{ background: "#0068FF", color: "#fff" }}>
            <MessageCircle className="w-4 h-4" />
            Vào Group
          </a>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div className="mt-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: GOLD }}>
              Bài viết liên quan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="block border rounded-xl p-5 transition-colors hover:border-amber-500/40"
                  style={{ borderColor: BORDER, background: BG2 }}>
                  <Badge cat={r.category} />
                  <h4 className="font-bold text-sm mt-3 leading-snug" style={{ color: TEXT, fontFamily: "var(--font-playfair)" }}>
                    {r.title}
                  </h4>
                  <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: MUTED }}>
                    <Clock className="w-3 h-3" />{r.readTime} phút
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer minimal */}
      <footer className="border-t py-8 px-4 text-center" style={{ borderColor: BORDER }}>
        <Link href="/blog" className="text-sm" style={{ color: MUTED }}>
          ← Về trang Blog
        </Link>
        <p className="text-xs mt-3" style={{ color: MUTED + "88" }}>
          © 2026 MonetAI Blog · Đối tác chính thức của{" "}
          <Link href="/" style={{ color: GOLD }}>MonetAI</Link>
        </p>
      </footer>

      <style>{`
        .prose-article h2 {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          font-weight: 700;
          color: ${TEXT};
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .prose-article h3 {
          font-family: var(--font-playfair);
          font-size: 1.15rem;
          font-weight: 700;
          color: ${TEXT};
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .prose-article p {
          font-size: 0.9375rem;
          line-height: 1.8;
          margin-bottom: 1.25rem;
          color: ${MUTED};
        }
        .prose-article ul, .prose-article ol {
          margin-left: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .prose-article li {
          font-size: 0.9375rem;
          line-height: 1.8;
          margin-bottom: 0.4rem;
          color: ${MUTED};
        }
        .prose-article strong {
          color: ${TEXT};
          font-weight: 600;
        }
        .prose-article pre {
          background: #1A1510;
          border: 1px solid ${BORDER};
          border-radius: 12px;
          padding: 1rem 1.25rem;
          font-size: 0.82rem;
          line-height: 1.7;
          overflow-x: auto;
          color: ${TEXT};
          margin-bottom: 1.25rem;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
