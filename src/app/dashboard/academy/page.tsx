"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Play, Clock, Users, Star, Lock, CheckCircle,
  BookOpen, ChevronDown, ChevronUp, X, Sparkles, Trophy,
  Upload, ArrowRight, Copy, BarChart2, Zap, ChevronRight,
  Search, Filter, Layers,
} from "lucide-react";
import { courses, CATEGORIES, type CourseData } from "@/data/courses";
import {
  getEnrollments, isEnrolled, enroll, markLessonComplete,
  courseProgress, getSubmissions, submitCourse,
  courseVietQRUrl, type Enrollment,
} from "@/lib/course-registry";

// ─── Constants ─────────────────────────────────────────────────────────────────
const ACCENT = "#F59E0B";
const ADMIN_EMAIL = "monetai.vn@gmail.com";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    try {
      const s = localStorage.getItem("monetai_session");
      if (s) setEmail(JSON.parse(s).email ?? null);
    } catch { /* ignore */ }
  }, []);
  return email;
}

function fmtPrice(price: number) {
  return price === 0 ? "Miễn phí" : price.toLocaleString("vi-VN") + " ₫";
}

const levelColors: Record<string, string> = {
  "Cơ bản":    "text-green-400 bg-green-400/10 border-green-400/20",
  "Trung cấp": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Nâng cao":  "text-red-400 bg-red-400/10 border-red-400/20",
};

const categoryColors: Record<string, string> = {
  "AI Affiliate":  "text-orange-400",
  "AI Marketing":  "text-pink-400",
  "AI Business":   "text-blue-400",
  "AI Automation": "text-violet-400",
  "AI Agent":      "text-amber-400",
};

// ─── BuyModal ──────────────────────────────────────────────────────────────────
interface BuyModalProps {
  course: CourseData;
  onClose: () => void;
  onSuccess: () => void;
}

function BuyModal({ course, onClose, onSuccess }: BuyModalProps) {
  const [step, setStep] = useState<"qr" | "confirm" | "done">("qr");
  const [tx, setTx] = useState("");
  const [copied, setCopied] = useState(false);
  const qrUrl = courseVietQRUrl(course.id, course.price);
  const note  = `MONETAI ${course.id.slice(-8).toUpperCase()}`;

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const steps = ["qr", "confirm", "done"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#2A2A3A]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{course.emoji}</span>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{course.title}</p>
              <p className="text-amber-400 font-bold">{fmtPrice(course.price)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#A0A0B0] hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border
                  ${step === s ? "bg-amber-500 border-amber-500 text-white" :
                    steps.indexOf(step) > i ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                    "border-[#2A2A3A] text-[#A0A0B0]"}`}>
                  {steps.indexOf(step) > i ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < 2 && <div className={`h-px w-8 ${steps.indexOf(step) > i ? "bg-amber-500/50" : "bg-[#2A2A3A]"}`} />}
              </div>
            ))}
          </div>

          {step === "qr" && (
            <div className="space-y-4">
              <p className="text-[#A0A0B0] text-sm">Quét mã QR để thanh toán qua MB Bank:</p>
              <div className="bg-white rounded-xl p-3 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="VietQR" className="w-52 h-52 object-contain" />
              </div>
              <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-[#A0A0B0]">Ngân hàng</span><span className="text-white">MB Bank</span></div>
                <div className="flex justify-between"><span className="text-[#A0A0B0]">Số tài khoản</span><span className="text-white">0971166299</span></div>
                <div className="flex justify-between"><span className="text-[#A0A0B0]">Số tiền</span><span className="text-amber-400 font-bold">{fmtPrice(course.price)}</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0B0]">Nội dung CK</span>
                  <button onClick={() => copy(note)} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors">
                    <span className="font-mono">{note}</span>
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={() => setStep("confirm")}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
              >
                Tôi đã chuyển khoản →
              </motion.button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <p className="text-[#A0A0B0] text-sm">Nhập mã giao dịch hoặc 6 chữ số cuối từ SMS ngân hàng:</p>
              <input
                value={tx} onChange={(e) => setTx(e.target.value)}
                placeholder="VD: FT24123456789"
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-[#555] transition-all"
              />
              <motion.button
                whileTap={{ scale: 0.97 }} disabled={tx.trim().length < 4}
                onClick={() => setStep("done")}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
              >
                Xác nhận thanh toán
              </motion.button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Đăng ký thành công!</p>
                <p className="text-[#A0A0B0] text-sm mt-1">Bạn đã có thể bắt đầu học ngay.</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-left space-y-1 text-sm">
                <p className="text-amber-400 font-semibold">🎓 Khóa học đã mở khóa</p>
                <p className="text-[#A0A0B0]">Truy cập toàn bộ {course.totalLessons} bài học trong tab "Học của tôi"</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { onSuccess(); onClose(); }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
              >
                Bắt đầu học ngay
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── CourseDetailModal ─────────────────────────────────────────────────────────
interface CourseDetailProps {
  course: CourseData;
  email: string | null;
  onClose: () => void;
  onEnroll: () => void;
  enrolled: boolean;
  progress: number;
  completedLessons: string[];
  onLessonComplete: (lessonId: string) => void;
}

function CourseDetailModal({
  course, email, onClose, onEnroll, enrolled,
  progress, completedLessons, onLessonComplete,
}: CourseDetailProps) {
  const [tab, setTab] = useState<"overview" | "curriculum" | "instructor">("overview");
  const [expandedModule, setExpandedModule] = useState<string | null>(course.curriculum[0]?.id ?? null);
  const [showBuy, setShowBuy] = useState(false);
  const isAdmin    = email === ADMIN_EMAIL;
  const canAccess  = enrolled || isAdmin || course.price === 0;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-8 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
          className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-2xl shadow-2xl mb-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent border-b border-[#2A2A3A] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-5xl flex-shrink-0">{course.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${levelColors[course.level]}`}>{course.level}</span>
                    <span className={`text-xs font-medium ${categoryColors[course.category]}`}>{course.category}</span>
                    {course.badge && (
                      <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{course.badge}</span>
                    )}
                  </div>
                  <h2 className="text-white font-bold text-xl leading-snug">{course.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#A0A0B0]">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students.toLocaleString()} học viên</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.durationHours}h</span>
                    <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5" />{course.totalLessons} bài</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-[#A0A0B0] hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {canAccess && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#A0A0B0] mb-1.5">
                  <span>Tiến độ</span><span className="text-amber-400">{progress}%</span>
                </div>
                <div className="h-2 bg-[#2A2A3A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#2A2A3A]">
            {(["overview", "curriculum", "instructor"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium transition-colors
                  ${tab === t ? "text-amber-400 border-b-2 border-amber-400" : "text-[#A0A0B0] hover:text-white"}`}
              >
                {t === "overview" ? "Tổng quan" : t === "curriculum" ? "Chương trình" : "Giảng viên"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview */}
            {tab === "overview" && (
              <div className="space-y-6">
                <p className="text-[#A0A0B0] text-sm leading-relaxed">{course.longDescription}</p>
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />Bạn sẽ học được
                  </h3>
                  <div className="space-y-2">
                    {course.whatYouLearn.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-amber-400" />
                        </div>
                        <span className="text-[#A0A0B0]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {course.requirements.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />Yêu cầu
                    </h3>
                    <ul className="space-y-1.5">
                      {course.requirements.map((r, i) => (
                        <li key={i} className="text-sm text-[#A0A0B0] flex items-center gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[#0A0A0F] border border-[#2A2A3A] text-[#A0A0B0] px-2.5 py-1 rounded-lg">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            {tab === "curriculum" && (
              <div className="space-y-3">
                <p className="text-[#A0A0B0] text-xs mb-4">
                  {course.curriculum.reduce((a, m) => a + m.lessons.length, 0)} bài học ·{" "}
                  {course.curriculum.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.durationMin, 0), 0)} phút
                </p>
                {course.curriculum.map((mod) => (
                  <div key={mod.id} className="border border-[#2A2A3A] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div>
                        <p className="text-white font-medium text-sm">{mod.title}</p>
                        <p className="text-[#A0A0B0] text-xs mt-0.5">
                          {mod.lessons.length} bài · {mod.lessons.reduce((a, l) => a + l.durationMin, 0)} phút
                        </p>
                      </div>
                      {expandedModule === mod.id
                        ? <ChevronUp className="w-4 h-4 text-[#A0A0B0]" />
                        : <ChevronDown className="w-4 h-4 text-[#A0A0B0]" />}
                    </button>

                    <AnimatePresence>
                      {expandedModule === mod.id && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#2A2A3A] divide-y divide-[#2A2A3A]">
                            {mod.lessons.map((lesson) => {
                              const done       = completedLessons.includes(lesson.id);
                              const accessible = canAccess || lesson.free;
                              return (
                                <div key={lesson.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                                  <div className="flex items-center gap-3 min-w-0">
                                    {done ? (
                                      <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    ) : accessible ? (
                                      <Play className="w-4 h-4 text-[#A0A0B0] flex-shrink-0" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-[#A0A0B0] flex-shrink-0" />
                                    )}
                                    <span className={`text-sm truncate ${done ? "text-amber-400" : accessible ? "text-white" : "text-[#A0A0B0]"}`}>
                                      {lesson.title}
                                    </span>
                                    {lesson.free && !canAccess && (
                                      <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-1.5 py-0.5 rounded flex-shrink-0">Xem thử</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs text-[#A0A0B0]">{lesson.durationMin}p</span>
                                    {accessible && !done && (
                                      <button
                                        onClick={() => onLessonComplete(lesson.id)}
                                        className="text-xs text-amber-400 hover:text-amber-300 transition-colors underline"
                                      >
                                        Hoàn thành
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* Instructor */}
            {tab === "instructor" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
                    {course.instructorAvatar}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{course.instructor}</p>
                    <p className="text-[#A0A0B0] text-sm">{course.instructorTitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Users className="w-4 h-4" />, label: "Học viên", value: course.students.toLocaleString() },
                    { icon: <Star className="w-4 h-4" />, label: "Rating", value: course.rating + "/5" },
                    { icon: <BookOpen className="w-4 h-4" />, label: "Bài học", value: course.totalLessons.toString() },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-3 text-center">
                      <div className="text-amber-400 flex justify-center mb-1">{s.icon}</div>
                      <p className="text-white font-bold">{s.value}</p>
                      <p className="text-[#A0A0B0] text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#A0A0B0] text-sm leading-relaxed">
                  {course.instructor} là chuyên gia hàng đầu trong lĩnh vực {course.category}, với kinh nghiệm thực chiến và
                  đã đào tạo hàng nghìn học viên trên MonetAI Academy.
                </p>
              </div>
            )}
          </div>

          {/* CTA Footer */}
          <div className="p-5 border-t border-[#2A2A3A]">
            {canAccess ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm">
                  <p className="text-amber-400 font-semibold">✓ Đã đăng ký</p>
                  <p className="text-[#A0A0B0] text-xs mt-0.5">
                    Tiến độ: {progress}% · {completedLessons.length}/{course.totalLessons} bài hoàn thành
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab("curriculum")}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
                >
                  Tiếp tục học
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-bold text-xl">{fmtPrice(course.price)}</p>
                  {course.price > 0 && <p className="text-[#A0A0B0] text-xs">Truy cập trọn đời · Chứng chỉ hoàn thành</p>}
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={course.price === 0 ? onEnroll : () => setShowBuy(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
                >
                  {course.price === 0
                    ? <><Play className="w-4 h-4" />Học miễn phí</>
                    : <><Zap className="w-4 h-4" />Đăng ký ngay</>}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showBuy && (
          <BuyModal
            course={course}
            onClose={() => setShowBuy(false)}
            onSuccess={() => { onEnroll(); setShowBuy(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── CourseCard ────────────────────────────────────────────────────────────────
function CourseCard({ course, email, onClick }: { course: CourseData; email: string | null; onClick: () => void }) {
  const enrolled   = email ? isEnrolled(email, course.id) : false;
  const pct        = email ? courseProgress(email, course.id, course.totalLessons) : 0;
  const isAdmin    = email === ADMIN_EMAIL;
  const accessible = enrolled || isAdmin || course.price === 0;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: "rgba(245,158,11,0.35)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden cursor-pointer transition-all h-full"
    >
      <div className="bg-gradient-to-br from-[#1C1C28] to-[#16161F] p-5 border-b border-[#2A2A3A]">
        <div className="flex items-start justify-between">
          <span className="text-4xl">{course.emoji}</span>
          <div className="flex flex-col items-end gap-1.5">
            {course.badge && (
              <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{course.badge}</span>
            )}
            {course.price === 0 ? (
              <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Miễn phí</span>
            ) : accessible ? (
              <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Đã đăng ký</span>
            ) : null}
          </div>
        </div>
        <h3 className="text-white font-bold text-base leading-snug mt-3 line-clamp-2">{course.title}</h3>
        <p className={`text-xs font-medium mt-1 ${categoryColors[course.category]}`}>{course.category}</p>
      </div>

      <div className="p-4">
        <p className="text-[#A0A0B0] text-xs leading-relaxed mb-3 line-clamp-2">{course.description}</p>

        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#A0A0B0] mb-3">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{course.rating}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.durationHours}h</span>
          <span className={`px-2 py-0.5 rounded-full border text-xs ${levelColors[course.level]}`}>{course.level}</span>
        </div>

        {accessible && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#A0A0B0]">Tiến độ</span>
              <span className="text-amber-400">{pct}%</span>
            </div>
            <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold">{fmtPrice(course.price)}</span>
          <span className="text-[#A0A0B0] text-xs flex items-center gap-1">
            Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MyLearningTab ─────────────────────────────────────────────────────────────
function MyLearningTab({ email, onOpenCourse }: { email: string; onOpenCourse: (c: CourseData) => void }) {
  const enrollments   = getEnrollments(email);
  const enrolled      = enrollments.map((e) => courses.find((c) => c.id === e.courseId)).filter(Boolean) as CourseData[];
  const freeCourses   = courses.filter((c) => c.price === 0 && !enrollments.find((e) => e.courseId === c.id));

  const totalLessons     = enrolled.reduce((a, c) => a + c.totalLessons, 0);
  const completedLessons = enrollments.reduce((a, e) => a + e.completedLessons.length, 0);
  const overallPct       = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <BookOpen className="w-5 h-5 text-amber-400" />, label: "Khóa học", value: enrolled.length.toString() },
          { icon: <CheckCircle className="w-5 h-5 text-green-400" />, label: "Bài đã học", value: completedLessons.toString() },
          { icon: <Trophy className="w-5 h-5 text-amber-400" />, label: "Tiến độ chung", value: overallPct + "%" },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-[#A0A0B0] text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {enrolled.length === 0 ? (
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-8 text-center">
          <GraduationCap className="w-12 h-12 text-[#A0A0B0] mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">Chưa đăng ký khóa học nào</p>
          <p className="text-[#A0A0B0] text-sm">Khám phá các khóa học AI trong tab Khóa học</p>
        </div>
      ) : (
        <div>
          <h3 className="text-white font-semibold mb-3">Đang học ({enrolled.length})</h3>
          <div className="space-y-3">
            {enrolled.map((course) => {
              const e   = enrollments.find((x) => x.courseId === course.id)!;
              const pct = courseProgress(email, course.id, course.totalLessons);
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ borderColor: "rgba(245,158,11,0.35)" }}
                  onClick={() => onOpenCourse(course)}
                  className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-4"
                >
                  <span className="text-3xl flex-shrink-0">{course.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{course.title}</p>
                    <p className="text-[#A0A0B0] text-xs mb-2">
                      {e.completedLessons.length}/{course.totalLessons} bài ·
                      Đăng ký {new Date(e.enrolledAt).toLocaleDateString("vi-VN")}
                    </p>
                    <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-amber-400 font-bold">{pct}%</p>
                    {pct === 100 && (
                      <p className="text-green-400 text-xs flex items-center gap-1 justify-end">
                        <Trophy className="w-3 h-3" />Hoàn thành
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {freeCourses.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />Khóa học miễn phí chưa đăng ký
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {freeCourses.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ borderColor: "rgba(245,158,11,0.35)" }}
                onClick={() => onOpenCourse(c)}
                className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3"
              >
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{c.title}</p>
                  <p className="text-green-400 text-xs">Miễn phí · {c.totalLessons} bài</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A0A0B0] flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TeachTab ──────────────────────────────────────────────────────────────────
function TeachTab({ email }: { email: string }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", description: "", category: "AI Affiliate", level: "Cơ bản", price: "", outline: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submissions = getSubmissions(email);

  const setField = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    submitCourse(email, {
      title:       form.title,
      description: form.description,
      category:    form.category,
      price:       parseInt(form.price) || 0,
      level:       form.level,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-white font-bold text-xl">Đã gửi đề xuất khóa học!</p>
        <p className="text-[#A0A0B0] text-sm max-w-sm mx-auto">
          Đội ngũ MonetAI Academy sẽ review và liên hệ với bạn trong 2-3 ngày làm việc.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setForm({ title: "", description: "", category: "AI Affiliate", level: "Cơ bản", price: "", outline: "" });
          }}
          className="px-6 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-sm font-medium transition-colors"
        >
          Gửi đề xuất khác
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Benefits */}
      <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />Tại sao dạy trên MonetAI Academy?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "👥", label: "10,000+", sub: "Học viên tiềm năng" },
            { icon: "💰", label: "70%", sub: "Hoa hồng giảng viên" },
            { icon: "🚀", label: "Miễn phí", sub: "Đăng ký & phát hành" },
            { icon: "📊", label: "Dashboard", sub: "Theo dõi doanh thu" },
          ].map((b) => (
            <div key={b.label} className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{b.icon}</p>
              <p className="text-amber-400 font-bold text-sm">{b.label}</p>
              <p className="text-[#A0A0B0] text-xs">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-6">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border
                ${step === s ? "bg-amber-500 border-amber-500 text-white" :
                  step > s ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                  "border-[#2A2A3A] text-[#A0A0B0]"}`}>
                {step > s ? <CheckCircle className="w-3.5 h-3.5" /> : s}
              </div>
              <span className="text-xs text-[#A0A0B0] hidden sm:block">
                {s === 1 ? "Thông tin cơ bản" : s === 2 ? "Nội dung & Giá" : "Xem trước & Gửi"}
              </span>
              {s < 3 && <ArrowRight className="w-3.5 h-3.5 text-[#2A2A3A]" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#A0A0B0] mb-1.5 block">Tên khóa học *</label>
              <input
                value={form.title} onChange={(e) => setField("title", e.target.value)}
                placeholder="VD: AI Affiliate Từ Zero Đến Triệu Đô"
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-[#555] transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-[#A0A0B0] mb-1.5 block">Mô tả ngắn *</label>
              <textarea
                value={form.description} onChange={(e) => setField("description", e.target.value)}
                rows={3} placeholder="Mô tả ngắn gọn về khóa học, ai phù hợp và học được gì..."
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-[#555] transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#A0A0B0] mb-1.5 block">Danh mục</label>
                <select
                  value={form.category} onChange={(e) => setField("category", e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                    focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                >
                  {["AI Affiliate", "AI Marketing", "AI Business", "AI Automation", "AI Agent"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-[#A0A0B0] mb-1.5 block">Cấp độ</label>
                <select
                  value={form.level} onChange={(e) => setField("level", e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                    focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                >
                  {["Cơ bản", "Trung cấp", "Nâng cao"].map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }} disabled={!form.title || !form.description}
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              Tiếp theo →
            </motion.button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#A0A0B0] mb-1.5 block">Giá khóa học (VNĐ, để trống = miễn phí)</label>
              <input
                value={form.price} onChange={(e) => setField("price", e.target.value)}
                type="number" placeholder="VD: 299000"
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-[#555] transition-all"
              />
              {form.price && parseInt(form.price) > 0 && (
                <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm">
                  <p className="text-amber-400 font-semibold">Phân chia doanh thu:</p>
                  <div className="flex justify-between text-[#A0A0B0] mt-1">
                    <span>Bạn nhận (70%)</span>
                    <span className="text-white font-medium">
                      {Math.round(parseInt(form.price) * 0.7).toLocaleString("vi-VN")} ₫/đơn
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A0A0B0]">
                    <span>MonetAI (30%)</span>
                    <span>{Math.round(parseInt(form.price) * 0.3).toLocaleString("vi-VN")} ₫/đơn</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-[#A0A0B0] mb-1.5 block">Đề cương sơ bộ</label>
              <textarea
                value={form.outline} onChange={(e) => setField("outline", e.target.value)}
                rows={5} placeholder="Mô tả các chương/bài học chính của khóa học..."
                className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-[#555] transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-[#2A2A3A] text-[#A0A0B0] hover:bg-white/5 text-sm font-medium transition-colors"
              >
                ← Quay lại
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors">
                Xem trước →
              </motion.button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-[#0A0A0F] border border-amber-500/20 rounded-xl p-4 space-y-2.5">
              <p className="text-amber-400 font-semibold text-sm">Xem trước đề xuất:</p>
              {[
                { label: "Tên", value: form.title },
                { label: "Mô tả", value: form.description },
                { label: "Danh mục", value: form.category },
                { label: "Cấp độ", value: form.level },
                { label: "Giá", value: fmtPrice(parseInt(form.price) || 0) },
              ].map((row) => (
                <div key={row.label} className="flex gap-3 text-sm">
                  <span className="text-[#A0A0B0] w-24 flex-shrink-0">{row.label}:</span>
                  <span className={`text-white flex-1 ${row.label === "Giá" ? "text-amber-400" : ""}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-4 text-sm text-[#A0A0B0]">
              <p className="font-medium text-white mb-2">Quy trình tiếp theo:</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Đội ngũ Academy review đề xuất (2-3 ngày)</li>
                <li>Bạn nhận email hướng dẫn upload nội dung</li>
                <li>QA và phát hành khóa học trên MonetAI Academy</li>
                <li>Nhận 70% doanh thu mỗi tháng</li>
              </ol>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl border border-[#2A2A3A] text-[#A0A0B0] hover:bg-white/5 text-sm font-medium transition-colors"
              >
                ← Sửa lại
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={submit}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />Gửi đề xuất
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Submissions */}
      {submissions.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3">Đề xuất của tôi ({submissions.length})</h3>
          <div className="space-y-2">
            {submissions.map((s) => (
              <div key={s.id} className="bg-[#16161F] border border-[#2A2A3A] rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.title}</p>
                  <p className="text-[#A0A0B0] text-xs">{s.category} · {new Date(s.submittedAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${
                  s.status === "active"   ? "text-green-400 bg-green-400/10 border-green-400/20" :
                  s.status === "rejected" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                  "text-amber-400 bg-amber-400/10 border-amber-400/20"
                }`}>
                  {s.status === "active" ? "Hoạt động" : s.status === "rejected" ? "Từ chối" : "Đang review"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AcademyPage() {
  const email = useAuth();

  const [tab,      setTab]      = useState<"browse" | "learning" | "teach">("browse");
  const [category, setCategory] = useState<string>("Tất cả");
  const [level,    setLevel]    = useState<string>("Tất cả");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<CourseData | null>(null);
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const filtered = courses.filter((c) => {
    if (category !== "Tất cả" && c.category !== category) return false;
    if (level    !== "Tất cả" && c.level    !== level)    return false;
    if (search && !([c.title, c.description, ...c.tags].some((s) => s.toLowerCase().includes(search.toLowerCase())))) return false;
    return true;
  });

  const enrollments     = email ? getEnrollments(email) : [];
  const enrolledCount   = enrollments.length;
  const completedCount  = enrollments.reduce((a, e) => a + e.completedLessons.length, 0);
  const totalLessonsAll = enrollments.reduce((a, e) => {
    const c = courses.find((x) => x.id === e.courseId);
    return a + (c?.totalLessons ?? 0);
  }, 0);
  const overallPct = totalLessonsAll > 0 ? Math.round((completedCount / totalLessonsAll) * 100) : 0;

  function handleEnroll(course: CourseData) {
    if (!email || isEnrolled(email, course.id)) return;
    enroll(email, {
      courseId:         course.id,
      courseName:       course.title,
      enrolledAt:       new Date().toISOString(),
      price:            course.price,
      completedLessons: [],
    } satisfies Enrollment);
    refresh();
  }

  function handleLessonComplete(courseId: string, lessonId: string) {
    if (!email) return;
    markLessonComplete(email, courseId, lessonId);
    refresh();
  }

  const selectedEnrollment = selected && email ? getEnrollments(email).find((e) => e.courseId === selected.id) : undefined;
  const selectedProgress   = selected && email ? courseProgress(email, selected.id, selected.totalLessons) : 0;

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
            <GraduationCap className="w-5 h-5" style={{ color: ACCENT }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MonetAI Academy</h1>
            <p className="text-[#A0A0B0] text-sm">
              {courses.length} khóa học · {courses.reduce((a, c) => a + c.totalLessons, 0)}+ bài học từ chuyên gia
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress banner */}
      {email && enrolledCount > 0 && (
        <div className="border rounded-2xl p-5 mb-6" style={{ background: `${ACCENT}11`, borderColor: `${ACCENT}33` }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">Tiến độ học tập</p>
              <p className="text-[#A0A0B0] text-sm">{completedCount}/{totalLessonsAll} bài hoàn thành · {enrolledCount} khóa đang học</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl" style={{ color: ACCENT }}>{overallPct}%</p>
              <p className="text-[#A0A0B0] text-xs">hoàn thành</p>
            </div>
          </div>
          <div className="h-2 bg-[#2A2A3A] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${overallPct}%`, background: ACCENT }} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#16161F] border border-[#2A2A3A] rounded-xl p-1 mb-6">
        {([
          { id: "browse"   as const, label: "Khóa học",   icon: <BookOpen className="w-4 h-4" /> },
          { id: "learning" as const, label: "Học của tôi", icon: <BarChart2 className="w-4 h-4" /> },
          { id: "teach"    as const, label: "Dạy học",    icon: <Upload className="w-4 h-4" /> },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? "text-white" : "text-[#A0A0B0] hover:text-white"}`}
            style={tab === t.id ? { background: `${ACCENT}22`, color: ACCENT } : {}}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            {t.id === "learning" && enrolledCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${ACCENT}33`, color: ACCENT }}>
                {enrolledCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {tab === "browse" && (
        <div className="space-y-5">
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm khóa học AI..."
                className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-[#555] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#A0A0B0] flex-shrink-0" />
              <select
                value={level} onChange={(e) => setLevel(e.target.value)}
                className="bg-[#16161F] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-white text-sm
                  focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              >
                {["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all
                  ${category === cat ? "text-white border-transparent" : "text-[#A0A0B0] border-[#2A2A3A] hover:text-white"}`}
                style={category === cat ? { background: ACCENT, borderColor: ACCENT } : {}}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-70">
                  {cat === "Tất cả" ? courses.length : courses.filter((c) => c.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[#A0A0B0] text-sm">{filtered.length} khóa học</p>

          {filtered.length === 0 ? (
            <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-10 text-center">
              <Search className="w-10 h-10 text-[#A0A0B0] mx-auto mb-3" />
              <p className="text-white font-semibold">Không tìm thấy khóa học</p>
              <p className="text-[#A0A0B0] text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <CourseCard course={course} email={email} onClick={() => setSelected(course)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Learning Tab */}
      {tab === "learning" && (
        email ? (
          <MyLearningTab email={email} onOpenCourse={(c) => { setSelected(c); }} />
        ) : (
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-10 text-center">
            <Lock className="w-10 h-10 text-[#A0A0B0] mx-auto mb-3" />
            <p className="text-white font-semibold">Đăng nhập để xem khóa học của bạn</p>
          </div>
        )
      )}

      {/* Teach Tab */}
      {tab === "teach" && (
        email ? (
          <TeachTab email={email} />
        ) : (
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-10 text-center">
            <Lock className="w-10 h-10 text-[#A0A0B0] mx-auto mb-3" />
            <p className="text-white font-semibold">Đăng nhập để đăng ký làm giảng viên</p>
          </div>
        )
      )}

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selected && (
          <CourseDetailModal
            course={selected}
            email={email}
            onClose={() => setSelected(null)}
            enrolled={email ? isEnrolled(email, selected.id) : false}
            progress={selectedProgress}
            completedLessons={selectedEnrollment?.completedLessons ?? []}
            onLessonComplete={(lessonId) => handleLessonComplete(selected.id, lessonId)}
            onEnroll={() => {
              if (email) {
                handleEnroll(selected);
                setTab("learning");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
