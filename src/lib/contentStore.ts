// In-memory content store — initializes from defaults, persists within process lifetime
// On new deployment, content resets to defaults below

import { faqs } from "@/data/faq";
import { testimonials } from "@/data/testimonials";

export interface HeroStats { tools: string; agents: string; orders: string }
export interface FAQItem   { id: string; q: string; a: string }
export interface Testimonial { id: string; name: string; role: string; avatar: string; rating: number; content: string }
export interface SiteConfig {
  heroTitle: string; heroSub: string;
  stats: HeroStats;
  announcement: { enabled: boolean; text: string; link: string };
  contact: { email: string; phone: string; address: string };
}

function uid() { return Math.random().toString(36).slice(2, 10); }

// Default data initialized once
const defaultFAQs: FAQItem[] = faqs.map((f) => ({ id: uid(), q: f.q, a: f.a }));
const defaultTestimonials: Testimonial[] = testimonials.map((t) => ({
  id: String(t.id), name: t.name, role: t.role, avatar: t.avatar,
  rating: t.rating, content: t.content,
}));
const defaultConfig: SiteConfig = {
  heroTitle: "Earn More With AI",
  heroSub: "Nền tảng AI Commerce hàng đầu giúp cá nhân và doanh nghiệp kiếm tiền từ AI thông qua hệ sinh thái AI Tools, AI Agent Marketplace, Affiliate Network và AI Commerce Infrastructure.",
  stats: { tools: "200+", agents: "1,000+", orders: "1M+" },
  announcement: { enabled: false, text: "", link: "" },
  contact: { email: "MonetAI.vn@gmail.com", phone: "0562557777", address: "25A Hàn Thuyên, Hai Bà Trưng, Hà Nội" },
};

// Mutable store (global singleton per server process)
const store = {
  config: { ...defaultConfig, stats: { ...defaultConfig.stats } } as SiteConfig,
  faqs: [...defaultFAQs] as FAQItem[],
  testimonials: [...defaultTestimonials] as Testimonial[],
};

export const contentStore = {
  getConfig:        () => store.config,
  getFAQs:          () => store.faqs,
  getTestimonials:  () => store.testimonials,

  setConfig(c: SiteConfig)         { store.config = c; },
  setFAQs(items: FAQItem[])        { store.faqs = items; },
  setTestimonials(items: Testimonial[]) { store.testimonials = items; },

  reset() {
    store.config = { ...defaultConfig, stats: { ...defaultConfig.stats } };
    store.faqs = [...defaultFAQs];
    store.testimonials = [...defaultTestimonials];
  },
};
