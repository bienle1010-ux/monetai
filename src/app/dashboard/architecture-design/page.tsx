"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Download, Copy, CheckCircle,
  AlertCircle, Sparkles, Maximize2, X, FileText, Image as ImageIcon, Video,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Mode = "both" | "text-only" | "image-only" | "video";
interface Field {
  name: string; label: string; type: "text" | "textarea" | "select";
  placeholder?: string; options?: string[]; required?: boolean; rows?: number;
}
interface Tool {
  id: string; label: string; icon: string; color: string; desc: string;
  mode: Mode; group: number; fields: Field[];
  outputLabel?: { image?: string; text?: string };
}

// ─── Groups ──────────────────────────────────────────────────────────────────
const GROUPS = [
  { label: "Lập kế hoạch & Thiết kế", id: 0 },
  { label: "Cải tạo & Hoàn thiện",    id: 1 },
  { label: "Trực quan hóa 3D",        id: 2, isNew: true },
];

// ─── Tools ───────────────────────────────────────────────────────────────────
const TOOLS: Tool[] = [
  /* ── GROUP 0 ─────────────────────────────────────────────────────────── */
  {
    id: "arch-floorplan", group: 0, mode: "text-only",
    label: "Lập mặt bằng công năng", icon: "📐", color: "#06B6D4",
    desc: "Bố cục phòng bám đúng kích thước khuôn đất",
    outputLabel: { text: "Mặt bằng công năng & Bảng diện tích" },
    fields: [
      { name: "buildingType", label: "Loại công trình", type: "select", required: true,
        options: ["Nhà phố / Nhà ống", "Biệt thự", "Nhà vườn", "Căn hộ chung cư", "Văn phòng", "Nhà xưởng"] },
      { name: "landWidth",  label: "Chiều ngang khuôn đất (m)", type: "text", placeholder: "VD: 5",  required: true },
      { name: "landDepth",  label: "Chiều dọc khuôn đất (m)",   type: "text", placeholder: "VD: 20", required: true },
      { name: "floors",     label: "Số tầng", type: "select", required: true,
        options: ["1 tầng", "2 tầng", "3 tầng", "4 tầng", "5 tầng trở lên"] },
      { name: "density",    label: "Mật độ xây dựng (%)", type: "text", placeholder: "VD: 90 (mặc định 90% nhà phố)" },
      { name: "users",      label: "Số người sử dụng / thành viên gia đình", type: "text", placeholder: "VD: 4 người (vợ chồng + 2 con)", required: true },
      { name: "rooms",      label: "Danh sách phòng cần có", type: "textarea", required: true, rows: 4,
        placeholder: "VD:\n- 1 phòng khách\n- 1 bếp + phòng ăn\n- 3 phòng ngủ\n- 2 WC\n- 1 phòng thờ\n- 1 sân để xe máy" },
      { name: "special",    label: "Yêu cầu đặc biệt", type: "textarea", rows: 2,
        placeholder: "Tầng 1 để kinh doanh, tầng mái thông thoáng, phòng thờ độc lập, sân trời..." },
    ],
  },
  {
    id: "arch-exterior", group: 0, mode: "both",
    label: "Thiết kế kiến trúc", icon: "🏛️", color: "#FF6B00",
    desc: "Nhà phố, biệt thự, căn hộ, shophouse",
    outputLabel: { image: "Phối cảnh kiến trúc HD", text: "Bản mô tả & Bố cục mặt bằng" },
    fields: [
      { name: "buildingType", label: "Loại công trình", type: "select", required: true,
        options: ["Nhà phố", "Biệt thự đơn lập", "Nhà vườn", "Shophouse", "Căn hộ chung cư", "Văn phòng"] },
      { name: "landArea",    label: "Diện tích đất (m²)", type: "text", placeholder: "VD: 80",  required: true },
      { name: "frontWidth",  label: "Mặt tiền rộng (m)",  type: "text", placeholder: "VD: 5",   required: true },
      { name: "floors",      label: "Số tầng", type: "select", required: true,
        options: ["1 tầng", "2 tầng", "3 tầng", "4 tầng", "5 tầng trở lên"] },
      { name: "style",       label: "Phong cách kiến trúc", type: "select", required: true,
        options: ["Hiện đại (Modern)", "Tân cổ điển (Neo-Classic)", "Minimalist", "Tropical nhiệt đới", "Indochine Đông Dương", "Địa Trung Hải", "Nhật Bản (Japanese)"] },
      { name: "facade",      label: "Vật liệu mặt ngoài", type: "text", placeholder: "VD: Gạch trần + kính cường lực + sắt uốn CNC" },
      { name: "budget",      label: "Ngân sách", type: "select",
        options: ["Dưới 500 triệu", "500tr – 1 tỷ", "1 – 2 tỷ", "2 – 5 tỷ", "Trên 5 tỷ"] },
      { name: "special",     label: "Yêu cầu đặc biệt", type: "textarea", rows: 2,
        placeholder: "Sân ô tô, hầm để xe, hồ bơi, ban công cây xanh, phòng thờ..." },
    ],
  },
  {
    id: "arch-interior", group: 0, mode: "both",
    label: "Thiết kế nội thất", icon: "🛋️", color: "#8B5CF6",
    desc: "Phòng khách, ngủ, bếp, tắm, văn phòng",
    outputLabel: { image: "Phối cảnh nội thất HD", text: "Kích thước đồ nội thất & Bảng màu" },
    fields: [
      { name: "roomType", label: "Loại phòng", type: "select", required: true,
        options: ["Phòng khách", "Phòng ngủ Master", "Phòng ngủ trẻ em", "Bếp + phòng ăn", "Phòng tắm & WC", "Văn phòng tại nhà", "Phòng thờ"] },
      { name: "width",   label: "Kích thước phòng (rộng × dài m)", type: "text", placeholder: "VD: 4 × 6",  required: true },
      { name: "ceiling", label: "Chiều cao trần (m)",               type: "text", placeholder: "VD: 3.2", required: true },
      { name: "style",   label: "Phong cách nội thất", type: "select", required: true,
        options: ["Scandinavian", "Japandi (Nhật + Bắc Âu)", "Industrial", "Luxury Classic", "Modern Minimalist", "Wabi-Sabi", "Bohemian", "Tropical Resort"] },
      { name: "color",   label: "Tone màu chủ đạo", type: "select", required: true,
        options: ["Trắng – Xám – Đen", "Beige – Kem – Nâu gỗ", "Xanh lá – Thiên nhiên", "Navy – Xanh dương", "Đất nâu – Terracotta", "Hồng nhạt – Pastel"] },
      { name: "lighting",label: "Ánh sáng", type: "select",
        options: ["Ánh sáng tự nhiên (cửa sổ lớn)", "Downlight hiện đại + ánh sáng ấm", "Đèn thả nghệ thuật", "Ánh sáng đa tầng"] },
      { name: "budget",  label: "Ngân sách nội thất", type: "select",
        options: ["Dưới 100 triệu", "100 – 300 triệu", "300 – 700 triệu", "Trên 700 triệu"] },
    ],
  },
  {
    id: "arch-landscape", group: 0, mode: "both",
    label: "Thiết kế cảnh quan", icon: "🌿", color: "#10B981",
    desc: "Sân vườn, hồ bơi, sân thượng, tiểu cảnh",
    outputLabel: { image: "Phối cảnh cảnh quan HD", text: "Phân khu + Danh sách cây + Chi phí" },
    fields: [
      { name: "spaceType", label: "Loại không gian", type: "select", required: true,
        options: ["Sân vườn trước nhà", "Sân vườn sau nhà", "Sân thượng / Rooftop", "Hồ bơi + tiểu cảnh", "Lối vào + tiền sảnh", "Sân BBQ & giải trí", "Vườn rau + cây ăn quả"] },
      { name: "area",     label: "Diện tích (m²)", type: "text", placeholder: "VD: 60", required: true },
      { name: "style",    label: "Phong cách cảnh quan", type: "select", required: true,
        options: ["Nhiệt đới tự nhiên (Tropical)", "Nhật Bản Zen", "Địa Trung Hải", "Hiện đại tối giản", "Bali Resort", "Nông thôn Pháp (Provence)"] },
      { name: "plants",   label: "Loại cây ưa thích", type: "text",
        placeholder: "VD: Cây xanh lá lớn, hoa nhiệt đới, bonsai..." },
      { name: "water",    label: "Yếu tố nước", type: "select",
        options: ["Không cần", "Hồ cá Koi nhỏ", "Thác nước tường đứng", "Hồ bơi gia đình", "Kênh nước chạy dọc", "Đài phun nước"] },
      { name: "material", label: "Vật liệu sàn ngoài trời", type: "select",
        options: ["Đá tự nhiên (granite, basalt)", "Gỗ ngoài trời (teak)", "Gạch bê tông", "Đá cuội + cát trắng", "Composite chịu nước"] },
      { name: "budget",   label: "Ngân sách", type: "select",
        options: ["Dưới 50 triệu", "50 – 150 triệu", "150 – 400 triệu", "Trên 400 triệu"] },
    ],
  },

  /* ── GROUP 1 ─────────────────────────────────────────────────────────── */
  {
    id: "arch-renovation", group: 1, mode: "both",
    label: "Phương án cải tạo", icon: "🔨", color: "#F59E0B",
    desc: "Tái thiết nhà cũ, nâng cấp không gian sống",
    outputLabel: { image: "Phối cảnh sau cải tạo", text: "Danh mục công việc & Chi phí" },
    fields: [
      { name: "spaceType",    label: "Không gian cần cải tạo", type: "select", required: true,
        options: ["Nhà phố cũ (toàn bộ)", "Căn hộ chung cư cũ", "Tầng trệt thương mại", "Phòng khách + bếp", "Phòng tắm & WC", "Mặt tiền nhà", "Sân thượng"] },
      { name: "area",         label: "Diện tích (m²)", type: "text", placeholder: "VD: 80", required: true },
      { name: "buildingAge",  label: "Tuổi công trình", type: "select",
        options: ["Dưới 5 năm", "5 – 10 năm", "10 – 20 năm", "20 – 30 năm", "Trên 30 năm"] },
      { name: "currentState", label: "Hiện trạng", type: "textarea", required: true, rows: 3,
        placeholder: "VD: Nhà 20 năm, trần thấp 2.6m, bếp tối, sàn gạch cũ bong tróc, điện nước xuống cấp..." },
      { name: "targetStyle",  label: "Mục tiêu cải tạo", type: "select", required: true,
        options: ["Hiện đại hóa toàn diện", "Mở rộng không gian (phá tường)", "Tăng ánh sáng tự nhiên", "Nâng cấp vật liệu cao cấp", "Thêm tầng / mở rộng", "Tiết kiệm năng lượng"] },
      { name: "keepItems",    label: "Giữ lại gì", type: "text",
        placeholder: "VD: Kết cấu cột dầm chính, cầu thang, tường bao..." },
      { name: "budget",       label: "Ngân sách", type: "select",
        options: ["Dưới 100 triệu", "100 – 300 triệu", "300 – 700 triệu", "Trên 700 triệu"] },
      { name: "timeline",     label: "Thời gian thi công", type: "select",
        options: ["1 – 2 tháng", "3 – 4 tháng", "5 – 6 tháng", "Linh hoạt"] },
    ],
  },
  {
    id: "arch-painting", group: 1, mode: "both",
    label: "Phối màu & hoàn thiện", icon: "🎨", color: "#EC4899",
    desc: "Bảng màu sơn, vật liệu hoàn thiện, ánh sáng",
    outputLabel: { image: "Phối cảnh màu sắc HD", text: "3 Phương án màu + Tên sơn thực tế" },
    fields: [
      { name: "spaceType",  label: "Không gian cần phối màu", type: "select", required: true,
        options: ["Toàn bộ căn nhà", "Phòng khách", "Phòng ngủ", "Nhà bếp", "Mặt tiền ngoài trời", "Hành lang + cầu thang", "Phòng tắm"] },
      { name: "totalArea",  label: "Diện tích tường (m²)", type: "text", placeholder: "VD: 150", required: true },
      { name: "currentColor",label: "Màu hiện tại", type: "text",
        placeholder: "VD: Vàng nhạt cũ, trắng đục..." },
      { name: "targetMood", label: "Cảm xúc mong muốn", type: "select", required: true,
        options: ["Ấm cúng, thư giãn", "Sang trọng, tinh tế", "Tươi sáng, năng động", "Yên tĩnh, Zen", "Mạnh mẽ, cá tính", "Gần gũi thiên nhiên"] },
      { name: "lighting",   label: "Ánh sáng phòng", type: "select",
        options: ["Nhiều ánh sáng tự nhiên (hướng Nam)", "Ít ánh sáng tự nhiên (hướng Bắc)", "Ánh đèn vàng chính", "Ánh đèn trắng chính"] },
      { name: "material",   label: "Vật liệu tường", type: "select",
        options: ["Sơn mịn cao cấp (matt)", "Sơn hiệu ứng vân đá/bê tông", "Gỗ ốp tường", "Gạch trang trí", "Wallpaper cao cấp", "Microcement / Bê tông lộ"] },
      { name: "accent",     label: "Điểm nhấn (tùy chọn)", type: "text",
        placeholder: "VD: 1 mảng tường xanh rêu, trần giả gỗ, vách 3D..." },
    ],
  },

  /* ── GROUP 2 ─────────────────────────────────────────────────────────── */
  {
    id: "arch-3d-image", group: 2, mode: "image-only",
    label: "Tạo ảnh 3D", icon: "🖼️", color: "#6366F1",
    desc: "Render 3D kiến trúc, nội thất, cảnh quan theo kích thước",
    outputLabel: { image: "Ảnh 3D Render HD (1792×1024)" },
    fields: [
      { name: "spaceType",   label: "Loại không gian", type: "select", required: true,
        options: ["Kiến trúc ngoại thất", "Nội thất phòng khách", "Nội thất phòng ngủ", "Bếp + phòng ăn", "Cảnh quan sân vườn", "Hồ bơi & ngoài trời", "Văn phòng & thương mại"] },
      { name: "dimW",        label: "Chiều ngang không gian (m)", type: "text", placeholder: "VD: 8",   required: true },
      { name: "dimD",        label: "Chiều dọc / sâu (m)",        type: "text", placeholder: "VD: 15",  required: true },
      { name: "dimH",        label: "Chiều cao (m)",               type: "text", placeholder: "VD: 3.5", required: true },
      { name: "style",       label: "Phong cách", type: "select", required: true,
        options: ["Hiện đại tối giản (Modern Minimalist)", "Tân cổ điển (Neo-Classic)", "Tropical nhiệt đới", "Indochine Đông Dương", "Japandi (Nhật + Bắc Âu)", "Industrial loft", "Luxury cao cấp", "Địa Trung Hải"] },
      { name: "materials",   label: "Vật liệu chủ đạo", type: "text", placeholder: "VD: Bê tông lộ + gỗ teak + kính + thép đen", required: true },
      { name: "camera",      label: "Góc nhìn camera", type: "select", required: true,
        options: ["Ngang tầm mắt (Eye-level perspective)", "Góc cao nhẹ (45° overhead)", "Góc rộng (Wide-angle interior)", "Góc nhìn từ ngoài vào (Exterior frontal)", "Phối cảnh chim bay (Aerial)", "Góc nhìn đặc biệt (Worm eye)"] },
      { name: "lighting",    label: "Ánh sáng & Thời điểm", type: "select", required: true,
        options: ["Ban ngày (10h sáng, ánh nắng vàng)", "Hoàng hôn (17-18h, ánh sáng vàng cam)", "Bầu trời흐u (Overcast, ánh sáng mềm đều)", "Buổi tối (đèn nội thất, night scene)", "Bình minh (6-7h, ánh sáng nhẹ hồng)"] },
      { name: "extra",       label: "Chi tiết đặc biệt", type: "textarea", rows: 2,
        placeholder: "Cây xanh trong phòng, hồ cá, tranh tường, nội thất đặc biệt, con người (để scale)..." },
    ],
  },
  {
    id: "arch-video-3d", group: 2, mode: "video",
    label: "Tạo video 3D", icon: "🎬", color: "#A855F7",
    desc: "Kịch bản video & prompt cho Sora / Runway / Kling",
    outputLabel: { image: "Frame preview (Still ảnh đại diện)", text: "Kịch bản video + Prompt AI video" },
    fields: [
      { name: "spaceType",  label: "Loại không gian", type: "select", required: true,
        options: ["Kiến trúc ngoại thất", "Nội thất toàn căn hộ", "Phòng khách", "Cảnh quan sân vườn", "Hồ bơi & nghỉ dưỡng", "Văn phòng thương mại", "Dự án bất động sản"] },
      { name: "dimW",       label: "Chiều ngang (m)", type: "text", placeholder: "VD: 10",  required: true },
      { name: "dimD",       label: "Chiều dọc (m)",   type: "text", placeholder: "VD: 20",  required: true },
      { name: "dimH",       label: "Chiều cao (m)",   type: "text", placeholder: "VD: 4",   required: true },
      { name: "style",      label: "Phong cách", type: "select", required: true,
        options: ["Hiện đại tối giản", "Tân cổ điển sang trọng", "Tropical Resort", "Indochine Đông Dương", "Japandi", "Industrial", "Địa Trung Hải", "Luxury cao cấp"] },
      { name: "materials",  label: "Vật liệu nổi bật", type: "text", placeholder: "VD: Bê tông + gỗ tự nhiên + kính cường lực" },
      { name: "cameraMove", label: "Chuyển động camera", type: "select", required: true,
        options: ["Walkthrough (đi bộ xuyên không gian)", "Flythrough (bay qua từ ngoài vào trong)", "Orbit / Quay quanh công trình", "Push in (tiến từ xa vào)", "Panoramic sweep (quét 180°)", "Drone flyover (máy bay không người lái)"] },
      { name: "duration",   label: "Thời lượng video", type: "select", required: true,
        options: ["15 giây (social media)", "30 giây (quảng cáo)", "60 giây (giới thiệu)", "2-3 phút (tour đầy đủ)"] },
      { name: "lighting",   label: "Lighting & Thời điểm", type: "select",
        options: ["Ban ngày ánh nắng vàng", "Hoàng hôn golden hour", "Buổi tối đèn lung linh", "Thay đổi từ ngày sang đêm (time-lapse)"] },
      { name: "mood",       label: "Cảm xúc / Mood video", type: "select",
        options: ["Sang trọng, đẳng cấp (Luxury)", "Ấm cúng, gia đình (Cozy & Family)", "Hiện đại, năng động (Urban Modern)", "Bình yên, thiên nhiên (Serene Nature)", "Ngoạn mục, mạnh mẽ (Dramatic)"] },
    ],
  },
];

type ToolId = (typeof TOOLS)[number]["id"];

// ─── Prompt builders ─────────────────────────────────────────────────────────
function buildImagePrompt(toolId: ToolId, v: Record<string, string>): string {
  const dims = (w: string, d: string, h: string) =>
    `exact proportions ${w}m wide × ${d}m deep × ${h}m tall`;

  switch (toolId) {
    case "arch-exterior":
      return `Professional architectural photography, photorealistic exterior, ${v.style ?? "modern"} ${v.buildingType ?? "house"} Vietnam, ${v.floors ?? "3"} stories, ${v.frontWidth ?? "5"}m facade, ${v.landArea ?? "80"}sqm plot, ${v.facade ?? "concrete glass"} materials, natural afternoon daylight blue sky tropical greenery, street eye-level Canon EOS R5 35mm f/8, ultra-sharp details, architectural magazine quality 8K photorealistic no AI artifacts`;
    case "arch-interior":
      return `Professional interior photography, photorealistic ${v.style ?? "modern"} ${v.roomType ?? "living room"}, room size ${v.width ?? "4×6"}m ceiling ${v.ceiling ?? "3.2"}m, ${v.color ?? "neutral"} palette, ${v.lighting ?? "natural light"}, premium furniture accurate proportions, Hasselblad 24mm f/5.6, Architectural Digest quality 8K photorealistic`;
    case "arch-landscape":
      return `Professional landscape photography, photorealistic ${v.style ?? "tropical"} ${v.spaceType ?? "garden"}, ${v.area ?? "50"}sqm, ${v.plants ?? "tropical plants"}, ${v.material ?? "stone"} paving, ${v.water && v.water !== "Không cần" ? v.water + " feature," : ""} golden hour 5PM, ultra-detailed textures, Nikon Z9 24mm f/8, travel magazine 8K photorealistic`;
    case "arch-renovation":
      return `Professional architectural photography, photorealistic beautifully renovated ${v.spaceType ?? "house"}, ${v.targetStyle ?? "modern"} style, ${v.area ?? "80"}sqm, abundant natural light, pristine new finishes, Canon 5D 17mm f/8, interior magazine 8K photorealistic no AI artifacts`;
    case "arch-painting":
      return `Professional interior photography, ${v.spaceType ?? "living room"} with ${v.material ?? "premium matt paint"} finish, ${v.targetMood ?? "warm cozy"} atmosphere, perfect paint sheen, ${v.lighting ?? "natural light"}, Sony A7R IV 24mm f/5.6, Architectural Digest 8K photorealistic`;
    case "arch-3d-image":
      return `Professional 3D architectural visualization, photorealistic CGI render, ${v.style ?? "modern"} ${v.spaceType ?? "architecture"}, ${dims(v.dimW ?? "8", v.dimD ?? "15", v.dimH ?? "3.5")}, materials: ${v.materials ?? "concrete glass wood"}, ${v.camera ?? "eye-level perspective"} camera angle, ${v.lighting ?? "natural daylight"}, ${v.extra ?? ""}, Unreal Engine 5 quality render, ultra-detailed material textures, perfect proportions, 8K architectural visualization, photorealistic not AI generated look, no people`;
    case "arch-video-3d":
      return `Cinematic architectural film still frame, photorealistic ${v.style ?? "modern"} ${v.spaceType ?? "space"}, ${dims(v.dimW ?? "10", v.dimD ?? "20", v.dimH ?? "4")}, materials: ${v.materials ?? "concrete wood glass"}, ${v.lighting ?? "golden hour"} cinematic lighting, ${v.mood ?? "luxury"} atmosphere, film still Arri Alexa 24mm anamorphic lens, Unreal Engine 5 quality, 8K photorealistic architectural cinema, no people no text`;
    default: return "";
  }
}

// ─── Markdown renderer ───────────────────────────────────────────────────────
function renderMd(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-sm font-bold text-white mt-5 mb-2 border-b border-[#2A2A3A] pb-1">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xs font-bold text-[#FF6B00] mt-3 mb-1">$1</h3>')
    .replace(/```[\s\S]*?```/g, (m) => {
      const code = m.replace(/```[a-z]*\n?/g, "").replace(/```$/g, "");
      return `<pre class="bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg p-3 text-xs text-[#A0A0B0] overflow-x-auto my-2 whitespace-pre-wrap">${code}</pre>`;
    })
    .replace(/^\| (.+) \|$/gm, (m) => {
      const cells = m.split("|").filter(Boolean).map(c => c.trim());
      if (cells.some(c => /^-+$/.test(c))) return "";
      return `<tr>${cells.map(c => `<td class="border border-[#2A2A3A] px-2 py-1.5 text-xs text-[#A0A0B0]">${c}</td>`).join("")}</tr>`;
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)+/g, (m) => `<table class="w-full border-collapse mb-3">${m}</table>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-[#1A1A2A] text-orange-400 px-1 rounded text-xs">$1</code>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex gap-2 items-start text-xs text-[#A0A0B0] mb-1"><span class="shrink-0 mt-0.5 w-3.5 h-3.5 border border-[#3A3A4A] rounded inline-block"></span><span>$1</span></li>')
    .replace(/^\- (.+)$/gm, '<li class="flex gap-2 text-xs text-[#A0A0B0] mb-1"><span class="text-[#FF6B00] shrink-0">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex gap-2 text-xs text-[#A0A0B0] mb-1"><span class="text-[#FF6B00] font-bold shrink-0 min-w-[14px]">$1.</span><span>$2</span></li>')
    .replace(/\n\n/g, "<br/>")
    .replace(/^(?!<[hltbpui])(.+)$/gm, (m) => m.trim() ? `<p class="text-xs text-[#A0A0B0] mb-1.5 leading-relaxed">${m}</p>` : "");
}

const C = { bg: "#0A0A0F", card: "#16161F", card2: "#111118", border: "#2A2A3A", orange: "#FF6B00", muted: "#A0A0B0", input: "#0D0D16" };

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ArchitectureDesignPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("arch-floorplan");
  const [values, setValues]     = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState("");
  const [specs, setSpecs]       = useState("");
  const [status, setStatus]     = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg]     = useState("");
  const [copied, setCopied]     = useState(false);
  const [zoom, setZoom]         = useState(false);
  const [retry, setRetry]       = useState(0);

  const tool = TOOLS.find((t) => t.id === activeTool)!;

  function switchTool(id: ToolId) {
    setActiveTool(id); setValues({}); setImageUrl(""); setSpecs("");
    setStatus("idle"); setErrMsg(""); setRetry(0);
  }

  function set(n: string, v: string) { setValues((p) => ({ ...p, [n]: v })); }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading"); setImageUrl(""); setSpecs(""); setErrMsg(""); setRetry(0);

    const needsImage = tool.mode !== "text-only";
    const needsText  = tool.mode !== "image-only";
    const imgPrompt  = needsImage ? buildImagePrompt(activeTool, values) : "";

    const DELAYS = [4000, 7000, 12000];
    for (let attempt = 0; attempt <= 3; attempt++) {
      try {
        const calls: Promise<Response>[] = [];
        if (needsImage) calls.push(fetch("/api/tools/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: imgPrompt, size: "1792x1024", quality: "hd" }) }));
        if (needsText)  calls.push(fetch("/api/tools",       { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toolId: activeTool, inputs: values }) }));

        const responses = await Promise.all(calls);
        const jsons = await Promise.all(responses.map(r => r.json())) as Array<Record<string, string | number>>;

        let imgIdx = 0, txtIdx = needsImage ? 1 : 0;
        const imgData = needsImage ? jsons[imgIdx] : null;
        const txtData = needsText  ? jsons[txtIdx] : null;

        const imgRL = imgData && responses[imgIdx]?.status === 429;
        const txtRL = txtData && responses[needsImage ? 1 : 0]?.status === 429;
        if ((imgRL || txtRL) && attempt < 3) { setRetry(attempt + 1); await new Promise(r => setTimeout(r, DELAYS[attempt])); continue; }

        if (imgData?.url)    setImageUrl(String(imgData.url));
        if (txtData?.result) setSpecs(String(txtData.result));

        const hasResult = (needsImage && imgData?.url) || (needsText && txtData?.result);
        if (!hasResult) { setErrMsg(String(imgData?.error ?? txtData?.error ?? "Có lỗi xảy ra.")); setStatus("error"); return; }
        setStatus("done"); return;
      } catch {
        if (attempt < 3) { setRetry(attempt + 1); await new Promise(r => setTimeout(r, DELAYS[attempt])); continue; }
        setErrMsg("Không thể kết nối. Vui lòng thử lại."); setStatus("error"); return;
      }
    }
    setErrMsg("Hệ thống AI đang quá tải. Vui lòng thử lại sau 1 phút."); setStatus("error");
  }

  async function copySpecs() { await navigator.clipboard.writeText(specs); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  function downloadImage() { const a = document.createElement("a"); a.href = imageUrl; a.download = `${activeTool}.png`; a.target = "_blank"; a.click(); }

  const inp = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]";
  const inpSty = { background: C.input, borderColor: C.border, color: "#fff" } as const;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b px-4 py-3 flex items-center gap-3" style={{ background: `${C.bg}f0`, borderColor: C.border, backdropFilter: "blur(10px)" }}>
        <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4" style={{ color: C.muted }} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏡</span>
          <div>
            <h1 className="text-white font-bold text-sm leading-none">AI Kiến trúc & Nội thất</h1>
            <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>8 công cụ · Photorealistic HD · Kích thước thực tế</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          {[
            { label: "📐 Mặt bằng", color: "#06B6D4" },
            { label: "🖼️ Ảnh 3D", color: "#6366F1" },
            { label: "🎬 Video 3D", color: "#A855F7" },
          ].map(b => (
            <span key={b.label} className="text-[10px] px-2 py-1 rounded-full font-semibold hidden sm:block"
              style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}30` }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r overflow-y-auto py-2" style={{ borderColor: C.border }}>
          {GROUPS.map((g) => (
            <div key={g.id} className="mb-1">
              <div className="px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>{g.label}</span>
                {g.isNew && <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: "#10B98120", color: "#10B981" }}>MỚI</span>}
              </div>
              {TOOLS.filter(t => t.group === g.id).map(t => (
                <button key={t.id} onClick={() => switchTool(t.id as ToolId)}
                  className="w-full flex items-start gap-2 px-3 py-2 mx-1 rounded-xl text-left transition-all group"
                  style={{ width: "calc(100% - 8px)", background: activeTool === t.id ? `${t.color}18` : "transparent", border: `1px solid ${activeTool === t.id ? `${t.color}40` : "transparent"}` }}>
                  <span className="text-base shrink-0 mt-0.5">{t.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-snug" style={{ color: activeTool === t.id ? t.color : "#fff" }}>{t.label}</p>
                    <p className="text-[10px] mt-0.5 leading-snug truncate" style={{ color: C.muted }}>{t.desc}</p>
                  </div>
                  {/* Mode badge */}
                  <div className="shrink-0 ml-auto mt-1">
                    {t.mode === "text-only"  && <FileText className="w-3 h-3" style={{ color: "#06B6D4" }} />}
                    {t.mode === "image-only" && <ImageIcon className="w-3 h-3" style={{ color: "#6366F1" }} />}
                    {t.mode === "video"      && <Video className="w-3 h-3" style={{ color: "#A855F7" }} />}
                  </div>
                </button>
              ))}
              {g.id < 2 && <div className="mx-3 my-2 border-t" style={{ borderColor: C.border }} />}
            </div>
          ))}

          <div className="mt-auto mx-2 mb-2 p-3 rounded-xl border" style={{ borderColor: C.border, background: "#FF6B0008" }}>
            <p className="text-[9px] font-bold mb-1" style={{ color: C.orange }}>💡 Workflow tối ưu</p>
            <p className="text-[9px] leading-relaxed" style={{ color: C.muted }}>
              1️⃣ Lập mặt bằng → 2️⃣ Thiết kế KT → 3️⃣ Nội thất → 4️⃣ Cảnh quan → 5️⃣ Ảnh 3D → 6️⃣ Video 3D
            </p>
          </div>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden absolute top-[56px] left-0 right-0 z-10 border-b overflow-x-auto flex gap-1 px-3 py-2"
          style={{ background: C.bg, borderColor: C.border }}>
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => switchTool(t.id as ToolId)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full whitespace-nowrap text-[11px] font-medium shrink-0 transition-all"
              style={{ background: activeTool === t.id ? `${t.color}20` : C.card, color: activeTool === t.id ? t.color : C.muted, border: `1px solid ${activeTool === t.id ? `${t.color}40` : C.border}` }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto md:pt-0 pt-12">
          <div className="p-4 md:p-5 max-w-6xl mx-auto">
            {/* Tool header */}
            <div className="mb-4 p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: `${tool.color}30`, background: `${tool.color}08` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${tool.color}20` }}>
                {tool.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-bold text-sm">{tool.label}</h2>
                <p className="text-xs" style={{ color: C.muted }}>{tool.desc}</p>
              </div>
              <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
                {tool.mode !== "text-only"  && <span className="text-[10px] px-2 py-1 rounded-full border" style={{ color: "#6366F1", borderColor: "#6366F130", background: "#6366F110" }}>Ảnh HD 1792×1024</span>}
                {tool.mode !== "image-only" && <span className="text-[10px] px-2 py-1 rounded-full border" style={{ color: "#10B981", borderColor: "#10B98130", background: "#10B98110" }}>Thông số kỹ thuật</span>}
                {tool.mode === "video"       && <span className="text-[10px] px-2 py-1 rounded-full border" style={{ color: "#A855F7", borderColor: "#A855F730", background: "#A855F710" }}>Prompt video AI</span>}
              </div>
            </div>

            <div className="grid lg:grid-cols-[360px_1fr] gap-5">
              {/* Form */}
              <form onSubmit={generate} className="flex flex-col gap-3">
                {tool.fields.map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>
                      {f.label}{f.required && <span style={{ color: C.orange }}> *</span>}
                    </label>
                    {f.type === "select" ? (
                      <select value={values[f.name] ?? ""} onChange={e => set(f.name, e.target.value)}
                        required={f.required} className={inp} style={{ ...inpSty, cursor: "pointer" }}>
                        <option value="" style={{ background: C.card }}>-- Chọn --</option>
                        {(f.options ?? []).map(o => <option key={o} value={o} style={{ background: C.card }}>{o}</option>)}
                      </select>
                    ) : f.type === "textarea" ? (
                      <textarea value={values[f.name] ?? ""} onChange={e => set(f.name, e.target.value)}
                        placeholder={f.placeholder} rows={f.rows ?? 3} required={f.required}
                        className={`${inp} resize-none`} style={inpSty} />
                    ) : (
                      <input type="text" value={values[f.name] ?? ""} onChange={e => set(f.name, e.target.value)}
                        placeholder={f.placeholder} required={f.required} className={inp} style={inpSty} />
                    )}
                  </div>
                ))}

                <motion.button type="submit" disabled={status === "loading"}
                  whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
                  className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color}bb)`, color: "#fff" }}>
                  {status === "loading" ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" />{retry > 0 ? `Thử lại ${retry}/3...` : "Đang xử lý..."}</>
                  ) : (
                    <><Sparkles className="w-4 h-4" />Tạo với AI</>
                  )}
                </motion.button>

                {status === "loading" && (
                  <div className="text-center space-y-0.5">
                    {tool.mode !== "text-only"  && <p className="text-[10px]" style={{ color: C.muted }}>🖼 Tạo ảnh HD 1792×1024 (DALL-E 3)</p>}
                    {tool.mode !== "image-only" && <p className="text-[10px]" style={{ color: C.muted }}>📐 Tạo thông số kỹ thuật chi tiết</p>}
                    {tool.mode === "video"       && <p className="text-[10px]" style={{ color: C.muted }}>🎬 Soạn kịch bản + prompt video AI</p>}
                  </div>
                )}
              </form>

              {/* Output */}
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {status === "idle" && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-2xl border flex flex-col items-center justify-center py-16 text-center"
                      style={{ borderColor: C.border, background: C.card }}>
                      <span className="text-5xl mb-3">{tool.icon}</span>
                      <p className="text-white font-semibold text-sm mb-2">{tool.label}</p>
                      <div className="flex gap-2 flex-wrap justify-center">
                        {tool.mode !== "text-only"  && <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#6366F115", color: "#6366F1" }}>🖼 {tool.outputLabel?.image}</span>}
                        {tool.mode !== "image-only" && <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#10B98115", color: "#10B981" }}>📐 {tool.outputLabel?.text}</span>}
                      </div>
                    </motion.div>
                  )}

                  {status === "loading" && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-2xl border flex flex-col items-center justify-center py-16"
                      style={{ borderColor: C.border, background: C.card }}>
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: `${tool.color}40`, borderTopColor: tool.color }} />
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">{tool.icon}</span>
                      </div>
                      <p className="text-white font-semibold text-sm">{retry > 0 ? `Đang thử lại (${retry}/3)...` : "AI đang xử lý..."}</p>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-2xl border p-5 flex items-start gap-3"
                      style={{ borderColor: "#FF000030", background: "#FF000010" }}>
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 text-sm font-semibold">Có lỗi xảy ra</p>
                        <p className="text-red-300 text-xs mt-1">{errMsg}</p>
                      </div>
                    </motion.div>
                  )}

                  {status === "done" && (
                    <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                      {/* Image output */}
                      {imageUrl && (
                        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.border }}>
                          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: C.border, background: C.card }}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{tool.mode === "video" ? "🎬" : "🖼️"}</span>
                              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>
                                {tool.outputLabel?.image ?? "Phối cảnh HD · 1792×1024"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setZoom(true)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: C.muted }}>
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={downloadImage} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg hover:bg-white/5" style={{ color: C.orange }}>
                                <Download className="w-3 h-3" /> Tải xuống
                              </button>
                            </div>
                          </div>
                          <div className="relative aspect-video bg-black cursor-pointer" onClick={() => setZoom(true)}>
                            <Image src={imageUrl} alt="AI architecture render" fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
                              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}>
                              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Click để xem toàn màn hình</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Text output */}
                      {specs && (
                        <div className="rounded-2xl border" style={{ borderColor: C.border, background: C.card }}>
                          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: C.border }}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{tool.mode === "video" ? "🎬" : "📐"}</span>
                              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>
                                {tool.outputLabel?.text ?? "Thông số kỹ thuật"}
                              </span>
                            </div>
                            <button onClick={copySpecs}
                              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg hover:bg-white/5"
                              style={{ color: copied ? "#10B981" : C.orange }}>
                              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copied ? "Đã copy" : "Copy"}
                            </button>
                          </div>
                          <div className="p-4 max-h-[600px] overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: renderMd(specs) }} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen zoom */}
      <AnimatePresence>
        {zoom && imageUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setZoom(false)}>
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20">
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-5xl aspect-video"
              onClick={e => e.stopPropagation()}>
              <Image src={imageUrl} alt="fullscreen" fill className="object-contain rounded-xl" unoptimized />
            </motion.div>
            <p className="absolute bottom-4 text-white/40 text-xs">Click bên ngoài để đóng</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
        table tr:first-child td { background: #1A1A2A; font-weight: 600; color: #e5e7eb; }
        ul, ol { padding: 0; margin: 4px 0 8px; list-style: none; }
        pre { tab-size: 2; }
      `}</style>
    </div>
  );
}
