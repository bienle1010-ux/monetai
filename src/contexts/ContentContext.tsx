"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SiteContent } from "@/lib/contentStore";
import { faqs }         from "@/data/faq";
import { testimonials } from "@/data/testimonials";
import { plans }        from "@/data/pricing";
import { services, features } from "@/data/services";

// ─── Static fallback (used before fetch completes) ────────────────────────────
const FALLBACK: SiteContent = {
  hero: {
    badge: "Nền tảng AI Commerce #1 Việt Nam",
    title: "Earn More With AI",
    highlight: ["More", "AI"],
    subtitle: "MonetAI kết nối người tạo sản phẩm AI, người quảng bá và khách hàng trên cùng một nền tảng. Kiếm tiền từ AI không cần kỹ năng kỹ thuật.",
    cta1: { text: "Bắt đầu miễn phí", href: "/register" },
    cta2: { text: "Khám phá dịch vụ", href: "/#services" },
    stats: [{ label: "AI Tools", value: "200+" }, { label: "AI Agents", value: "1.000+" }, { label: "Đơn hàng", value: "1M+" }],
    card: { revenue: "12.500.000 ₫", revenueGrowth: "+47.3%", commission: "850.000 ₫", orders: "12 đơn hàng", contents: "2.847" },
  },
  services: services.map(s => ({ ...s })),
  features: features.map((f, i) => ({ id: String(i), ...f })),
  howItWorks: [
    { id: "1", step: "01", icon: "👤", title: "Đăng ký tài khoản",   description: "Tạo tài khoản MonetAI miễn phí trong 30 giây. Không cần thẻ tín dụng." },
    { id: "2", step: "02", icon: "🔍", title: "Chọn sản phẩm AI",    description: "Duyệt 200+ sản phẩm AI có chương trình Affiliate hoa hồng cao." },
    { id: "3", step: "03", icon: "🔗", title: "Chia sẻ link Affiliate", description: "AI tự động tạo nội dung quảng bá cho Facebook, TikTok, Email." },
    { id: "4", step: "04", icon: "💰", title: "Nhận hoa hồng",        description: "Hoa hồng được ghi nhận tự động và thanh toán định kỳ 2 lần/tháng." },
  ],
  plans: plans.map(p => ({ ...p, price: p.price as number | null, badge: p.badge as string | null, features: [...p.features] })),
  testimonials: testimonials.map(t => ({ ...t, id: String(t.id) })),
  faqs: faqs.map((f, i) => ({ id: String(i), ...f })),
  config: {
    siteTitle: "MonetAI — Earn More With AI",
    announcement: { enabled: false, text: "", link: "" },
    contact: { email: "MonetAI.vn@gmail.com", phone: "0562557777", address: "25A Hàn Thuyên, Hai Bà Trưng, Hà Nội" },
    social: { facebook: "https://facebook.com/MonetAI.vn", tiktok: "https://tiktok.com/@MonetAI.vn", youtube: "https://youtube.com/@MonetAI", linkedin: "https://linkedin.com/company/monetai", telegram: "https://t.me/MonetAI", zalo: "MonetAI Official" },
    footer: { tagline: "Nền tảng AI Commerce toàn diện cho kỷ nguyên AI" },
    cta: { title: "Bắt đầu kiếm tiền với AI ngay hôm nay", subtitle: "Tham gia cùng hàng nghìn người dùng đang kiếm tiền từ AI mỗi ngày", btn1: "Đăng ký miễn phí", btn2: "Xem demo" },
    trustedBy: ["OpenAI", "Anthropic", "Google", "Microsoft", "Adobe", "AWS"],
    howItWorksTitle: "Kiếm tiền với MonetAI chỉ trong 4 bước",
    servicesTitle: "8 Dịch vụ AI của MonetAI",
    featuresTitle: "Tại sao chọn MonetAI?",
    pricingTitle: "Chọn gói phù hợp với bạn",
    testimonialsTitle: "Khách hàng nói về MonetAI",
  },
};

const ContentContext = createContext<SiteContent>(FALLBACK);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(FALLBACK);

  useEffect(() => {
    fetch("/api/content")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setContent(d as SiteContent); })
      .catch(() => {});
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() { return useContext(ContentContext); }
