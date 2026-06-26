"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ToolRunner from "@/components/tools/ToolRunner";
import ImageToolRunner from "@/components/tools/ImageToolRunner";
import { useAuth } from "@/contexts/AuthContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const CARD   = "#16161F";
const BORDER = "#2A2A3A";
const ORANGE = "#FF6B00";
const MUTED  = "#A0A0B0";
const TEXT   = "#FFFFFF";

// ─── Tool definitions ─────────────────────────────────────────────────────────
type ToolType = "text" | "image";

interface TextField {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  rows?: number;
}

interface TextTool {
  kind: "text";
  id: string;
  name: string;
  icon: string;
  desc: string;
  fields: TextField[];
  submitLabel?: string;
}

interface ImageTool {
  kind: "image";
  id: string;
  name: string;
  icon: string;
  desc: string;
  promptLabel: string;
  promptPlaceholder: string;
  defaultSize: "1024x1024" | "1792x1024" | "1024x1792";
  styleOptions?: string[];
}

type Tool = TextTool | ImageTool;

// ── Text tools ────────────────────────────────────────────────────────────────
const TEXT_TOOLS: TextTool[] = [
  {
    kind: "text",
    id: "facebook-writer",
    name: "Facebook Writer",
    icon: "📘",
    desc: "Viết bài Facebook viral, tăng tương tác, bán hàng hiệu quả",
    fields: [
      { name: "topic", label: "Chủ đề/Sản phẩm", placeholder: "Ví dụ: Khóa học AI Marketing 997k", type: "text", required: true },
      { name: "tone", label: "Tone giọng văn", placeholder: "", type: "select", options: ["Thân thiện", "Chuyên nghiệp", "Hài hước", "Cảm xúc", "Thuyết phục"] },
      { name: "goal", label: "Mục tiêu", placeholder: "", type: "select", options: ["Tăng tương tác", "Bán hàng", "Xây dựng thương hiệu", "Viral"] },
    ],
  },
  {
    kind: "text",
    id: "tiktok-script",
    name: "TikTok Script",
    icon: "🎵",
    desc: "Kịch bản TikTok có hook mạnh, storytelling cuốn hút",
    fields: [
      { name: "topic", label: "Chủ đề video", placeholder: "Ví dụ: Cách kiếm 10 triệu từ AI trong 30 ngày", type: "text", required: true },
      { name: "duration", label: "Thời lượng", placeholder: "", type: "select", options: ["15 giây", "30 giây", "60 giây", "3 phút"] },
      { name: "style", label: "Phong cách", placeholder: "", type: "select", options: ["Viral/Hài", "Giáo dục", "Bán hàng", "Storytelling", "Review"] },
    ],
  },
  {
    kind: "text",
    id: "youtube-script",
    name: "YouTube Script",
    icon: "▶️",
    desc: "Kịch bản YouTube chuyên nghiệp, giữ người xem đến cuối",
    fields: [
      { name: "topic", label: "Chủ đề video", placeholder: "Ví dụ: Top 10 AI Tool kiếm tiền tốt nhất 2024", type: "text", required: true },
      { name: "audience", label: "Đối tượng xem", placeholder: "Ví dụ: Người mới học AI", type: "text" },
      { name: "duration", label: "Độ dài", placeholder: "", type: "select", options: ["5 phút", "10 phút", "15 phút", "20+ phút"] },
    ],
  },
  {
    kind: "text",
    id: "seo-writer",
    name: "SEO Writer",
    icon: "🔍",
    desc: "Bài viết SEO chuẩn Google, tăng traffic organic",
    fields: [
      { name: "keyword", label: "Từ khóa chính", placeholder: "Ví dụ: cách kiếm tiền với AI", type: "text", required: true },
      { name: "topic", label: "Chủ đề bài viết", placeholder: "Ví dụ: Hướng dẫn kiếm tiền AI cho người mới bắt đầu", type: "text", required: true },
      { name: "intent", label: "Search intent", placeholder: "", type: "select", options: ["Informational", "Transactional", "Navigational", "Commercial"] },
    ],
  },
  {
    kind: "text",
    id: "blog-writer",
    name: "Blog Writer",
    icon: "✍️",
    desc: "Bài blog chất lượng cao, thu hút độc giả và build authority",
    fields: [
      { name: "topic", label: "Chủ đề bài viết", placeholder: "Ví dụ: AI Affiliate Marketing là gì và cách bắt đầu", type: "text", required: true },
      { name: "audience", label: "Đối tượng đọc", placeholder: "Ví dụ: Freelancer Việt Nam", type: "text" },
      { name: "length", label: "Độ dài", placeholder: "", type: "select", options: ["Ngắn (600-800 từ)", "Vừa (800-1200 từ)", "Dài (1200-1500 từ)"] },
    ],
  },
  {
    kind: "text",
    id: "email-writer",
    name: "Email Writer",
    icon: "📧",
    desc: "Email Marketing tỷ lệ mở cao, tăng chuyển đổi",
    fields: [
      { name: "purpose", label: "Mục đích email", placeholder: "", type: "select", required: true, options: ["Welcome email", "Promotional", "Newsletter", "Follow-up", "Win-back", "Nurture"] },
      { name: "product", label: "Sản phẩm/Dịch vụ", placeholder: "Ví dụ: Gói Pro MonetAI 499k/tháng", type: "text" },
      { name: "audience", label: "Đối tượng nhận", placeholder: "Ví dụ: Khách hàng đã mua", type: "text" },
    ],
  },
  {
    kind: "text",
    id: "prompt-generator",
    name: "Prompt Generator",
    icon: "💡",
    desc: "Tạo Prompt chuyên nghiệp cho ChatGPT, Claude, Midjourney...",
    fields: [
      { name: "ai_model", label: "AI Model", placeholder: "", type: "select", required: true, options: ["ChatGPT", "Claude", "Gemini", "Midjourney", "DALL-E", "Stable Diffusion", "Sora"] },
      { name: "use_case", label: "Mục đích sử dụng", placeholder: "Ví dụ: Viết content marketing cho sản phẩm SaaS", type: "text", required: true },
    ],
  },
  {
    kind: "text",
    id: "copywriting",
    name: "Copywriting AI",
    icon: "🖊️",
    desc: "Copy bán hàng theo framework AIDA, PAS, BAB... cực hiệu quả",
    fields: [
      { name: "product", label: "Sản phẩm/Dịch vụ", placeholder: "Ví dụ: Phần mềm quản lý bán hàng online", type: "text", required: true },
      { name: "audience", label: "Khách hàng mục tiêu", placeholder: "Ví dụ: Chủ shop online 25-40 tuổi", type: "text", required: true },
      { name: "format", label: "Format copy", placeholder: "", type: "select", options: ["Facebook Ad", "Landing Page Hero", "Product Description", "Sales Email", "TikTok Caption"] },
      { name: "framework", label: "Framework", placeholder: "", type: "select", options: ["AIDA", "PAS", "BAB", "4Ps", "StoryBrand"] },
    ],
  },
  {
    kind: "text",
    id: "content-planner",
    name: "Content Planner",
    icon: "📅",
    desc: "Lịch đăng nội dung theo tháng, nhất quán và hiệu quả",
    fields: [
      { name: "niche", label: "Niche/Ngành", placeholder: "Ví dụ: AI, Kiếm tiền online, Làm đẹp...", type: "text", required: true },
      { name: "channels", label: "Kênh đăng", placeholder: "", type: "select", options: ["Facebook + TikTok", "YouTube + Blog", "Đa kênh tất cả"] },
      { name: "goal", label: "Mục tiêu nội dung", placeholder: "", type: "select", options: ["Tăng follower", "Tăng doanh thu", "Xây dựng thương hiệu", "Kết hợp"] },
    ],
  },
  {
    kind: "text",
    id: "social-scheduler",
    name: "Social Scheduler",
    icon: "🗓️",
    desc: "Lịch đăng bài tối ưu giờ vàng, tăng reach tự nhiên",
    fields: [
      { name: "content_type", label: "Loại nội dung", placeholder: "Ví dụ: AI Tips, Motivational, Product Reviews", type: "text", required: true },
      { name: "platforms", label: "Nền tảng", placeholder: "", type: "select", options: ["Facebook", "TikTok", "YouTube", "Instagram", "Đa kênh"] },
      { name: "period", label: "Khoảng thời gian", placeholder: "", type: "select", options: ["1 tuần", "2 tuần", "1 tháng"] },
    ],
  },
  {
    kind: "text",
    id: "content-analyzer",
    name: "Content Analyzer",
    icon: "🔬",
    desc: "Phân tích chất lượng nội dung, gợi ý cải thiện tỷ lệ viral",
    fields: [
      { name: "content", label: "Nội dung cần phân tích", placeholder: "Paste nội dung bài viết/caption/script của bạn vào đây...", type: "textarea", required: true, rows: 6 },
    ],
  },
  {
    kind: "text",
    id: "content-repurpose",
    name: "Content Repurpose",
    icon: "♻️",
    desc: "Tái sử dụng 1 nội dung thành 10+ định dạng khác nhau",
    fields: [
      { name: "source_content", label: "Nội dung gốc", placeholder: "Paste nội dung gốc (blog post, video script, social post...)", type: "textarea", required: true, rows: 5 },
    ],
  },
  {
    kind: "text",
    id: "comment-reply",
    name: "Comment Reply",
    icon: "💬",
    desc: "Trả lời comment khách hàng nhanh, chuyên nghiệp, tăng chuyển đổi",
    fields: [
      { name: "comment", label: "Comment cần trả lời", placeholder: "Paste comment của khách hàng...", type: "textarea", required: true, rows: 3 },
      { name: "context", label: "Context sản phẩm/dịch vụ", placeholder: "Ví dụ: Khóa học AI Marketing 997k", type: "text" },
    ],
  },
  {
    kind: "text",
    id: "viral-trend",
    name: "Viral Trend",
    icon: "🔥",
    desc: "Phân tích xu hướng viral, gợi ý nội dung trending",
    fields: [
      { name: "niche", label: "Niche của bạn", placeholder: "Ví dụ: Kiếm tiền online, AI, Làm đẹp...", type: "text", required: true },
      { name: "platform", label: "Nền tảng", placeholder: "", type: "select", options: ["TikTok", "Facebook", "YouTube", "Tất cả"] },
    ],
  },
  {
    kind: "text",
    id: "translator",
    name: "AI Translator",
    icon: "🌐",
    desc: "Dịch nội dung chuyên nghiệp, giữ nguyên tone và ý nghĩa",
    fields: [
      { name: "text", label: "Nội dung cần dịch", placeholder: "Nhập nội dung cần dịch...", type: "textarea", required: true, rows: 4 },
      { name: "from_lang", label: "Ngôn ngữ gốc", placeholder: "", type: "select", options: ["Tiếng Việt", "English", "中文", "日本語", "한국어", "Français"] },
      { name: "to_lang", label: "Ngôn ngữ đích", placeholder: "", type: "select", options: ["English", "Tiếng Việt", "中文", "日本語", "한국어", "Français"] },
    ],
  },
  {
    kind: "text",
    id: "video-generator",
    name: "Video Script AI",
    icon: "🎬",
    desc: "Kịch bản video chuyên nghiệp, storytelling cuốn hút",
    fields: [
      { name: "topic", label: "Chủ đề video", placeholder: "Ví dụ: Review tool AI kiếm tiền tốt nhất 2024", type: "text", required: true },
      { name: "style", label: "Phong cách", placeholder: "", type: "select", options: ["Cinematic", "Explainer", "Testimonial", "Product Demo", "Social Ads", "Documentary"] },
      { name: "duration", label: "Thời lượng", placeholder: "", type: "select", options: ["15 giây", "30 giây", "1 phút", "2-3 phút"] },
    ],
  },
  {
    kind: "text",
    id: "reel-generator",
    name: "Reels Generator",
    icon: "📱",
    desc: "Kịch bản Reels/TikTok/Shorts tối ưu thuật toán",
    fields: [
      { name: "topic", label: "Chủ đề Reel", placeholder: "Ví dụ: 3 mẹo kiếm tiền với AI cực đơn giản", type: "text", required: true },
      { name: "platform", label: "Platform", placeholder: "", type: "select", options: ["Instagram Reels", "TikTok", "YouTube Shorts", "Cả 3"] },
      { name: "goal", label: "Mục tiêu", placeholder: "", type: "select", options: ["Viral", "Bán hàng", "Brand Awareness", "Giáo dục"] },
    ],
  },
  {
    kind: "text",
    id: "shorts-generator",
    name: "Shorts Generator",
    icon: "⚡",
    desc: "YouTube Shorts có hook mạnh, giữ view 100%",
    fields: [
      { name: "topic", label: "Chủ đề Shorts", placeholder: "Ví dụ: Sự thật về kiếm tiền với AI mà không ai nói cho bạn", type: "text", required: true },
      { name: "hook_type", label: "Kiểu hook", placeholder: "", type: "select", options: ["Câu hỏi gây tò mò", "Sự thật bất ngờ", "Mẹo hay", "Tranh luận", "How-to"] },
    ],
  },
  {
    kind: "text",
    id: "voice-generator",
    name: "Voice Script",
    icon: "🎙️",
    desc: "Script cho voiceover, podcast, audio content chuyên nghiệp",
    fields: [
      { name: "script_topic", label: "Chủ đề nội dung voice", placeholder: "Ví dụ: Giới thiệu khóa học AI Marketing", type: "text", required: true },
      { name: "duration", label: "Thời lượng", placeholder: "", type: "select", options: ["30 giây", "1 phút", "3 phút", "5 phút", "10 phút"] },
      { name: "voice_style", label: "Phong cách giọng đọc", placeholder: "", type: "select", options: ["Chuyên nghiệp", "Thân thiện", "Uy tín", "Năng động", "Cảm xúc"] },
    ],
  },
  {
    kind: "text",
    id: "podcast-generator",
    name: "Podcast Generator",
    icon: "🎧",
    desc: "Nội dung podcast hấp dẫn, giữ listener đến hết tập",
    fields: [
      { name: "topic", label: "Chủ đề podcast", placeholder: "Ví dụ: Hành trình kiếm 100 triệu với Affiliate Marketing", type: "text", required: true },
      { name: "duration", label: "Thời lượng tập", placeholder: "", type: "select", options: ["10-15 phút", "20-30 phút", "45-60 phút"] },
      { name: "format", label: "Format", placeholder: "", type: "select", options: ["Solo monologue", "Interview", "Panel discussion", "Storytelling", "Educational"] },
    ],
  },
  {
    kind: "text",
    id: "avatar-generator",
    name: "AI Avatar Script",
    icon: "🤖",
    desc: "Kịch bản cho AI Avatar video, nội dung tự động hóa 100%",
    fields: [
      { name: "brand", label: "Thương hiệu/Tên avatar", placeholder: "Ví dụ: MonetAI Assistant", type: "text", required: true },
      { name: "script_topic", label: "Nội dung video avatar", placeholder: "Ví dụ: Giới thiệu tính năng mới của MonetAI", type: "text", required: true },
      { name: "avatar_style", label: "Phong cách avatar", placeholder: "", type: "select", options: ["Business Professional", "Casual Friendly", "Influencer", "News Anchor", "Educator"] },
    ],
  },
  {
    kind: "text",
    id: "subtitle-generator",
    name: "Subtitle Generator",
    icon: "📝",
    desc: "Tạo phụ đề chính xác, định dạng SRT/VTT chuẩn",
    fields: [
      { name: "transcript", label: "Transcript/Script video", placeholder: "Paste nội dung nói trong video...", type: "textarea", required: true, rows: 6 },
      { name: "target_lang", label: "Ngôn ngữ phụ đề", placeholder: "", type: "select", options: ["Tiếng Việt", "English", "Song ngữ Việt-Anh"] },
    ],
  },
  {
    kind: "text",
    id: "chatbot-designer",
    name: "Chatbot Designer",
    icon: "💬",
    desc: "Thiết kế flow chatbot bán hàng tự động, tăng tỷ lệ chốt đơn",
    fields: [
      { name: "business_type", label: "Loại hình kinh doanh", placeholder: "Ví dụ: Shop thời trang, Khóa học online, Agency...", type: "text", required: true },
      { name: "main_goals", label: "Mục tiêu chatbot", placeholder: "", type: "select", options: ["Bán hàng tự động", "Chăm sóc khách hàng", "Thu thập lead", "Đặt lịch hẹn", "Trả lời FAQ"] },
      { name: "platform", label: "Nền tảng", placeholder: "", type: "select", options: ["Facebook Messenger", "Zalo", "Website", "Cả 3"] },
    ],
  },
];

// ── Image tools ───────────────────────────────────────────────────────────────
const IMAGE_TOOLS: ImageTool[] = [
  {
    kind: "image",
    id: "image-generator",
    name: "Image Generator",
    icon: "🖼️",
    desc: "Tạo hình ảnh AI chuyên nghiệp cho content marketing",
    promptLabel: "Mô tả hình ảnh",
    promptPlaceholder: "Ví dụ: Người phụ nữ Việt Nam trẻ trung đang sử dụng laptop, phong cách hiện đại, ánh sáng tự nhiên...",
    defaultSize: "1024x1024",
  },
  {
    kind: "image",
    id: "thumbnail-generator",
    name: "Thumbnail Generator",
    icon: "🎬",
    desc: "Thumbnail YouTube clickbait cực cao, tăng CTR vượt trội",
    promptLabel: "Mô tả thumbnail",
    promptPlaceholder: "Ví dụ: Thumbnail YouTube về chủ đề AI Marketing, màu cam và đen, text 'Kiếm 50 triệu với AI', mặt người ngạc nhiên...",
    defaultSize: "1792x1024",
    styleOptions: ["Eye-catching", "Bold Text", "Minimalist", "Gradient", "Professional", "YouTube Style"],
  },
  {
    kind: "image",
    id: "banner-generator",
    name: "Banner Generator",
    icon: "🎨",
    desc: "Banner quảng cáo Facebook, Google, YouTube chuẩn kích thước",
    promptLabel: "Mô tả banner",
    promptPlaceholder: "Ví dụ: Banner quảng cáo Facebook cho khóa học AI, kích thước 1200x628, màu cam chủ đạo, CTA 'Đăng ký ngay'...",
    defaultSize: "1792x1024",
    styleOptions: ["Facebook Ad", "Instagram", "Google Display", "YouTube Banner", "Website Hero", "Email Header"],
  },
  {
    kind: "image",
    id: "logo-generator",
    name: "Logo Generator",
    icon: "✨",
    desc: "Logo thương hiệu chuyên nghiệp, tối giản và memorable",
    promptLabel: "Mô tả logo",
    promptPlaceholder: "Ví dụ: Logo cho thương hiệu MonetAI, màu cam và đen, hiện đại, tối giản, biểu tượng kết hợp AI và tiền tệ...",
    defaultSize: "1024x1024",
    styleOptions: ["Minimalist", "Modern", "Bold", "Gradient", "Tech", "Vintage"],
  },
];

const ALL_TOOLS: Tool[] = [...TEXT_TOOLS, ...IMAGE_TOOLS];

// ─── Sidebar groups ───────────────────────────────────────────────────────────
const GROUPS = [
  {
    label: "✍️ Viết Content",
    tools: ["facebook-writer", "tiktok-script", "youtube-script", "seo-writer", "blog-writer", "email-writer", "prompt-generator", "copywriting"],
  },
  {
    label: "📅 Kế hoạch",
    tools: ["content-planner", "social-scheduler", "content-analyzer", "content-repurpose", "comment-reply", "viral-trend", "translator"],
  },
  {
    label: "🎬 Video & Voice",
    tools: ["video-generator", "reel-generator", "shorts-generator", "voice-generator", "podcast-generator", "avatar-generator", "subtitle-generator", "chatbot-designer"],
  },
  {
    label: "🖼️ Hình ảnh",
    tools: ["image-generator", "thumbnail-generator", "banner-generator", "logo-generator"],
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContentStudioPage() {
  useAuth(); // ensure auth context is consumed (redirect handled by layout)
  const [activeTool, setActiveTool] = useState<string>(ALL_TOOLS[0].id);

  const currentTool = ALL_TOOLS.find((t) => t.id === activeTool) ?? ALL_TOOLS[0];
  const totalCount = ALL_TOOLS.length;

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
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>Content Studio</h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ background: `${ORANGE}20`, color: ORANGE, border: `1px solid ${ORANGE}40` }}
            >
              {totalCount} Tools
            </span>
          </div>
          <p className="text-sm" style={{ color: MUTED }}>
            Tạo mọi loại nội dung với AI — từ bài viết, video, đến hình ảnh
          </p>
        </div>
      </motion.div>

      {/* Mobile: horizontal scrollable pill tabs */}
      <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ width: "max-content" }}>
          {GROUPS.map((g) => (
            <div key={g.label} className="flex gap-1.5">
              {g.tools.map((tid) => {
                const tool = ALL_TOOLS.find((t) => t.id === tid);
                if (!tool) return null;
                const isActive = activeTool === tid;
                return (
                  <button
                    key={tid}
                    onClick={() => setActiveTool(tid)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                    style={
                      isActive
                        ? { background: ORANGE, color: "#fff" }
                        : { background: CARD, color: MUTED, border: `1px solid ${BORDER}` }
                    }
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                  </button>
                );
              })}
            </div>
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
                      <p
                        className="text-xs font-semibold leading-tight truncate"
                        style={{ color: isActive ? ORANGE : TEXT }}
                      >
                        {tool.name}
                      </p>
                      <p
                        className="text-xs leading-snug mt-0.5 line-clamp-2"
                        style={{ color: isActive ? `${ORANGE}99` : MUTED }}
                      >
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
          {currentTool.kind === "text" && (
            <ToolRunner
              toolId={currentTool.id}
              title={currentTool.name}
              description={currentTool.desc}
              icon={currentTool.icon}
              fields={currentTool.fields}
              submitLabel={currentTool.submitLabel ?? "Tạo với AI"}
            />
          )}
          {currentTool.kind === "image" && (
            <ImageToolRunner
              toolId={currentTool.id}
              title={currentTool.name}
              description={currentTool.desc}
              icon={currentTool.icon}
              promptLabel={currentTool.promptLabel}
              promptPlaceholder={currentTool.promptPlaceholder}
              defaultSize={currentTool.defaultSize}
              styleOptions={currentTool.styleOptions}
            />
          )}
        </motion.div>
      </div>

      {/* Mobile: current tool info bar */}
      <div
        className="lg:hidden mt-3 px-3 py-2 rounded-xl border flex items-center gap-2"
        style={{ borderColor: BORDER, background: CARD }}
      >
        <span className="text-lg">{currentTool.icon}</span>
        <div>
          <p className="text-xs font-semibold" style={{ color: TEXT }}>{currentTool.name}</p>
          <p className="text-xs leading-snug" style={{ color: MUTED }}>{currentTool.desc}</p>
        </div>
      </div>
    </div>
  );
}
