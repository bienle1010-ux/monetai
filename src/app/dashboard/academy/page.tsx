"use client";

import { motion } from "framer-motion";
import { GraduationCap, Play, Clock, Users, Star, Lock, CheckCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "AI Affiliate Marketing Từ Zero",
    description: "Học cách kiếm tiền từ Affiliate Marketing với AI. Từ chọn sản phẩm đến tạo nội dung và nhận hoa hồng.",
    duration: "4 giờ 30 phút",
    lessons: 24,
    students: 3420,
    rating: 4.9,
    level: "Cơ bản",
    free: true,
    image: "📚",
    topics: ["Affiliate là gì", "Chọn sản phẩm AI", "Tạo content với AI", "Tối ưu chuyển đổi"],
  },
  {
    id: 2,
    title: "AI Content Marketing Master",
    description: "Nắm vững kỹ thuật tạo nội dung bán hàng với AI trên mọi nền tảng: Facebook, TikTok, YouTube.",
    duration: "6 giờ 15 phút",
    lessons: 38,
    students: 2187,
    rating: 4.8,
    level: "Trung cấp",
    free: false,
    image: "🎯",
    topics: ["Content Strategy", "AI Writing Tools", "Video Script", "SEO Content"],
  },
  {
    id: 3,
    title: "Xây Dựng AI Agent Business",
    description: "Phát triển và kinh doanh AI Agent. Tạo, đóng gói và bán AI Agent trên MonetAI Marketplace.",
    duration: "8 giờ",
    lessons: 45,
    students: 987,
    rating: 4.7,
    level: "Nâng cao",
    free: false,
    image: "🤖",
    topics: ["No-code AI Agent", "Prompt Engineering", "AI Business Model", "Marketing & Sales"],
  },
  {
    id: 4,
    title: "AI Business Automation",
    description: "Tự động hóa toàn bộ quy trình kinh doanh với AI. Chatbot, email, CRM và phễu bán hàng.",
    duration: "5 giờ 45 phút",
    lessons: 32,
    students: 1654,
    rating: 4.8,
    level: "Trung cấp",
    free: false,
    image: "⚡",
    topics: ["Chatbot Sales", "Email Automation", "CRM tự động", "Analytics"],
  },
];

const levelColors: Record<string, string> = {
  "Cơ bản": "text-green-400 bg-green-400/10",
  "Trung cấp": "text-yellow-400 bg-yellow-400/10",
  "Nâng cao": "text-red-400 bg-red-400/10",
};

export default function AcademyPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MonetAI Academy</h1>
            <p className="text-[#A0A0B0] text-sm">Học AI Commerce từ chuyên gia. Bắt đầu miễn phí.</p>
          </div>
        </div>
      </motion.div>

      {/* Progress banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold">Tiến độ học tập</p>
            <p className="text-[#A0A0B0] text-sm">0 / 4 khóa học hoàn thành</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-400 font-bold text-2xl">0%</p>
            <p className="text-[#A0A0B0] text-xs">hoàn thành</p>
          </div>
        </div>
        <div className="h-2 bg-[#2A2A3A] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: "0%" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -2, borderColor: "rgba(99,102,241,0.3)" }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden transition-all"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1C1C28] to-[#16161F] p-6 border-b border-[#2A2A3A]">
              <div className="flex items-start justify-between">
                <span className="text-4xl mb-3 block">{course.image}</span>
                <div className="flex gap-2">
                  {course.free ? (
                    <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Miễn phí</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#A0A0B0] border border-[#2A2A3A] px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>{course.level}</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg leading-snug">{course.title}</h3>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-[#A0A0B0] text-sm leading-relaxed mb-4">{course.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {course.topics.map((t) => (
                  <span key={t} className="text-xs bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2 py-0.5 rounded-lg">{t}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-[#A0A0B0] mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-3.5 h-3.5" />
                  {course.lessons} bài học
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {course.students.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>

              <button
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  course.free
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                }`}
              >
                {course.free ? (
                  <><Play className="w-4 h-4" /> Học ngay miễn phí</>
                ) : (
                  <><Lock className="w-4 h-4" /> Nâng cấp để học</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
