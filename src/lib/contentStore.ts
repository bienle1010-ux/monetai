// Full site content store — all editable by admin
// Persists within one server process; resets on cold start (acceptable for serverless CMS)

import { faqs as defaultFAQs }               from "@/data/faq";
import { testimonials as defaultTestimonials } from "@/data/testimonials";
import { plans as defaultPlans }               from "@/data/pricing";
import { services as defaultServices, features as defaultFeatures } from "@/data/services";

function uid() { return Math.random().toString(36).slice(2, 10); }

// ─── Types ────────────────────────────────────────────────────────────────────
export interface HeroData {
  badge: string;
  title: string;
  highlight: string[];          // words to colour orange
  subtitle: string;
  cta1: { text: string; href: string };
  cta2: { text: string; href: string };
  stats: Array<{ label: string; value: string }>;
  card: {
    revenue: string; revenueGrowth: string;
    commission: string; orders: string;
    contents: string;
  };
}
export interface Service {
  id: string; icon: string; title: string; description: string; href: string; color: string;
}
export interface Feature { id: string; icon: string; title: string }
export interface HowStep { id: string; step: string; icon: string; title: string; description: string }
export interface PlanFeature { text: string }
export interface Plan {
  id: string; name: string; price: number | null; period: string;
  description: string; badge: string | null; features: string[];
  cta: string; popular: boolean;
}
export interface Testimonial {
  id: string; name: string; role: string; avatar: string; rating: number; content: string;
}
export interface FAQItem { id: string; q: string; a: string }
export interface SiteConfig {
  siteTitle: string;
  announcement: { enabled: boolean; text: string; link: string };
  contact: { email: string; phone: string; address: string };
  social: { facebook: string; tiktok: string; youtube: string; linkedin: string; telegram: string; zalo: string };
  footer: { tagline: string };
  cta: { title: string; subtitle: string; btn1: string; btn2: string };
  trustedBy: string[];
  howItWorksTitle: string;
  servicesTitle: string;
  featuresTitle: string;
  pricingTitle: string;
  testimonialsTitle: string;
}

export interface SiteContent {
  hero: HeroData;
  services: Service[];
  features: Feature[];
  howItWorks: HowStep[];
  plans: Plan[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  config: SiteConfig;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultHero: HeroData = {
  badge: "Nền tảng AI Commerce #1 Việt Nam",
  title: "Earn More With AI",
  highlight: ["More", "AI"],
  subtitle: "MonetAI kết nối người tạo sản phẩm AI, người quảng bá và khách hàng trên cùng một nền tảng. Kiếm tiền từ AI không cần kỹ năng kỹ thuật.",
  cta1: { text: "Bắt đầu miễn phí", href: "/register" },
  cta2: { text: "Khám phá dịch vụ", href: "/#services" },
  stats: [
    { label: "AI Tools",  value: "200+" },
    { label: "AI Agents", value: "1.000+" },
    { label: "Đơn hàng",  value: "1M+" },
  ],
  card: {
    revenue: "12.500.000 ₫", revenueGrowth: "+47.3%",
    commission: "850.000 ₫", orders: "12 đơn hàng",
    contents: "2.847",
  },
};

const defaultServicesData: Service[] = defaultServices.map(s => ({
  id: s.id, icon: s.icon, title: s.title, description: s.description,
  href: s.href, color: s.color,
}));

const defaultFeaturesData: Feature[] = defaultFeatures.map(f => ({
  id: uid(), icon: f.icon, title: f.title,
}));

const defaultHowItWorks: HowStep[] = [
  { id: uid(), step: "01", icon: "👤", title: "Đăng ký tài khoản", description: "Tạo tài khoản MonetAI miễn phí trong 30 giây. Không cần thẻ tín dụng." },
  { id: uid(), step: "02", icon: "🔍", title: "Chọn sản phẩm AI", description: "Duyệt 200+ sản phẩm AI có chương trình Affiliate hoa hồng cao." },
  { id: uid(), step: "03", icon: "🔗", title: "Chia sẻ link Affiliate", description: "AI tự động tạo nội dung quảng bá cho Facebook, TikTok, Email." },
  { id: uid(), step: "04", icon: "💰", title: "Nhận hoa hồng", description: "Hoa hồng được ghi nhận tự động và thanh toán định kỳ 2 lần/tháng." },
];

const defaultPlansData: Plan[] = defaultPlans.map(p => ({
  id: p.id, name: p.name,
  price: p.price as number | null,
  period: p.period, description: p.description,
  badge: p.badge as string | null,
  features: [...p.features],
  cta: p.cta, popular: p.popular,
}));

const defaultTestimonialsData: Testimonial[] = defaultTestimonials.map(t => ({
  id: String(t.id), name: t.name, role: t.role,
  avatar: t.avatar, rating: t.rating, content: t.content,
}));

const defaultFAQsData: FAQItem[] = defaultFAQs.map(f => ({
  id: uid(), q: f.q, a: f.a,
}));

const defaultConfig: SiteConfig = {
  siteTitle: "MonetAI — Earn More With AI",
  announcement: { enabled: false, text: "", link: "" },
  contact: { email: "MonetAI.vn@gmail.com", phone: "0562557777", address: "25A Hàn Thuyên, Hai Bà Trưng, Hà Nội" },
  social: {
    facebook: "https://facebook.com/MonetAI.vn",
    tiktok: "https://tiktok.com/@MonetAI.vn",
    youtube: "https://youtube.com/@MonetAI",
    linkedin: "https://linkedin.com/company/monetai",
    telegram: "https://t.me/MonetAI",
    zalo: "MonetAI Official",
  },
  footer: { tagline: "Nền tảng AI Commerce toàn diện cho kỷ nguyên AI" },
  cta: { title: "Bắt đầu kiếm tiền với AI ngay hôm nay", subtitle: "Tham gia cùng hàng nghìn người dùng đang kiếm tiền từ AI mỗi ngày", btn1: "Đăng ký miễn phí", btn2: "Xem demo" },
  trustedBy: ["OpenAI", "Anthropic", "Google", "Microsoft", "Adobe", "AWS"],
  howItWorksTitle: "Kiếm tiền với MonetAI chỉ trong 4 bước",
  servicesTitle: "8 Dịch vụ AI của MonetAI",
  featuresTitle: "Tại sao chọn MonetAI?",
  pricingTitle: "Chọn gói phù hợp với bạn",
  testimonialsTitle: "Khách hàng nói về MonetAI",
};

// ─── Singleton store ──────────────────────────────────────────────────────────
function cloneDefaults(): SiteContent {
  return {
    hero:         JSON.parse(JSON.stringify(defaultHero)),
    services:     JSON.parse(JSON.stringify(defaultServicesData)),
    features:     JSON.parse(JSON.stringify(defaultFeaturesData)),
    howItWorks:   JSON.parse(JSON.stringify(defaultHowItWorks)),
    plans:        JSON.parse(JSON.stringify(defaultPlansData)),
    testimonials: JSON.parse(JSON.stringify(defaultTestimonialsData)),
    faqs:         JSON.parse(JSON.stringify(defaultFAQsData)),
    config:       JSON.parse(JSON.stringify(defaultConfig)),
  };
}

const store: SiteContent = cloneDefaults();

export const contentStore = {
  getAll(): SiteContent { return store; },
  get<K extends keyof SiteContent>(key: K): SiteContent[K] { return store[key]; },
  set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) { (store as unknown as Record<string, unknown>)[key] = value; },
  reset() { Object.assign(store, cloneDefaults()); },
  uid,
};
