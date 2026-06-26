"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ToolMenuItem {
  id: string; label: string; href: string; icon: string;
  desc: string; color: string; isNew?: boolean;
}

const TOOLS_MENU: ToolMenuItem[] = [
  {
    id: "ai-affiliate",
    label: "AI Affiliate",
    href: "/dashboard/ai-affiliate",
    icon: "🎯",
    desc: "10 tools kiếm tiền Affiliate",
    color: "#FF6B00",
  },
  {
    id: "content-studio",
    label: "AI Content Studio",
    href: "/dashboard/content-studio",
    icon: "✍️",
    desc: "27 tools tạo nội dung & hình ảnh",
    color: "#8B5CF6",
  },
  {
    id: "ai-marketplace",
    label: "AI Marketplace",
    href: "/dashboard/ai-marketplace",
    icon: "🛍️",
    desc: "Mua bán Prompt, Template, Workflow",
    color: "#10B981",
  },
  {
    id: "affiliate-network",
    label: "Affiliate Network",
    href: "/dashboard/affiliate-network",
    icon: "🔗",
    desc: "16 tools quản lý Affiliate chuyên nghiệp",
    color: "#3B82F6",
  },
  {
    id: "ai-agent-marketplace",
    label: "AI Agent Marketplace",
    href: "/dashboard/ai-agent-marketplace",
    icon: "🤖",
    desc: "50+ AI Agents mua bán & chat trực tiếp",
    color: "#EC4899",
  },
  {
    id: "commerce-platform",
    label: "AI Commerce Platform",
    href: "/dashboard/commerce-platform",
    icon: "🏗️",
    desc: "Hệ điều hành doanh nghiệp AI toàn diện",
    color: "#F59E0B",
  },
  {
    id: "architecture-design",
    label: "AI Kiến trúc & Nội thất",
    href: "/dashboard/architecture-design",
    icon: "🏡",
    desc: "Thiết kế KT, nội thất, cảnh quan, cải tạo",
    color: "#06B6D4",
    isNew: true,
  },
];

const navLinks = [
  { label: "Trang chủ", href: "/" },
  // "Công cụ" is handled separately as a dropdown
  { label: "Dịch vụ", href: "/#services" },
  { label: "Bảng giá", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsMobileOpen, setToolsMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close tools dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    router.push("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-[#2A2A3A]" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-bold text-lg text-white">
              Monet<span className="text-[#FF6B00]">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Trang chủ */}
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                pathname === "/" ? "text-[#FF6B00]" : "text-[#A0A0B0] hover:text-white"
              )}
            >
              Trang chủ
            </Link>

            {/* Công cụ dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors duration-200",
                  toolsOpen || pathname.startsWith("/dashboard")
                    ? "text-[#FF6B00]"
                    : "text-[#A0A0B0] hover:text-white"
                )}
              >
                Công cụ
                <ChevronDown
                  className={cn("w-3.5 h-3.5 transition-transform duration-200", toolsOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[560px] bg-[#111118] border border-[#2A2A3A] rounded-2xl shadow-2xl overflow-hidden"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-[#2A2A3A] flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm">🚀 Nền tảng AI Commerce</p>
                        <p className="text-[#A0A0B0] text-xs mt-0.5">6 hệ thống · 100+ tools AI sẵn sàng sử dụng</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-1 text-xs text-[#FF6B00] hover:underline font-medium"
                      >
                        Xem tất cả <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Grid tools */}
                    <div className="grid grid-cols-2 gap-0.5 p-3">
                      {TOOLS_MENU.map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5"
                            style={{ background: `${tool.color}18` }}
                          >
                            {tool.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-white text-xs font-semibold group-hover:text-[#FF6B00] transition-colors leading-snug">
                                {tool.label}
                              </p>
                              {tool.isNew && (
                                <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] leading-none">MỚI</span>
                              )}
                            </div>
                            <p className="text-[#6B6B7B] text-[11px] mt-0.5 leading-snug">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="px-5 py-3 border-t border-[#2A2A3A] bg-[#FF6B00]/5 flex items-center justify-between">
                      <p className="text-[#A0A0B0] text-xs">Cần đăng nhập để sử dụng đầy đủ tính năng</p>
                      <Link
                        href="/register"
                        onClick={() => setToolsOpen(false)}
                        className="text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E55A00] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Dùng miễn phí
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining links */}
            {navLinks.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  pathname === l.href ? "text-[#FF6B00]" : "text-[#A0A0B0] hover:text-white"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 text-sm text-white hover:text-[#FF6B00] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#16161F] border border-[#2A2A3A] rounded-xl overflow-hidden shadow-2xl"
                    >
                      <div className="p-3 border-b border-[#2A2A3A]">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-[#A0A0B0] text-xs truncate">{user.email}</p>
                        <span className="mt-1 inline-block text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full capitalize">{user.plan}</span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#A0A0B0] hover:text-white transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-[#FF6B00] hover:bg-[#E55A00] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Đăng ký →
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0F] border-b border-[#2A2A3A]"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="py-2 text-[#A0A0B0] hover:text-white text-sm font-medium transition-colors"
              >
                Trang chủ
              </Link>

              {/* Công cụ mobile accordion */}
              <div>
                <button
                  onClick={() => setToolsMobileOpen(!toolsMobileOpen)}
                  className="w-full flex items-center justify-between py-2 text-[#A0A0B0] hover:text-white text-sm font-medium transition-colors"
                >
                  <span>Công cụ</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", toolsMobileOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {toolsMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 pb-2 flex flex-col gap-0.5 border-l border-[#2A2A3A] ml-2 mt-1">
                        {TOOLS_MENU.map((tool) => (
                          <Link
                            key={tool.id}
                            href={tool.href}
                            onClick={() => { setOpen(false); setToolsMobileOpen(false); }}
                            className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <span className="text-base">{tool.icon}</span>
                            <div>
                              <p className="text-white text-xs font-medium">{tool.label}</p>
                              <p className="text-[#6B6B7B] text-[10px]">{tool.desc}</p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/dashboard"
                          onClick={() => { setOpen(false); setToolsMobileOpen(false); }}
                          className="mt-1 flex items-center gap-1 py-2 px-2 text-xs text-[#FF6B00] font-semibold"
                        >
                          Xem tất cả tools <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(1).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-[#A0A0B0] hover:text-white text-sm font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-3 mt-1 border-t border-[#2A2A3A] flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="py-2 text-sm text-white font-medium">
                      Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setOpen(false); }} className="py-2 text-sm text-red-400 text-left">
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="py-2 text-center text-sm border border-[#2A2A3A] text-white rounded-lg"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="py-2 text-center text-sm bg-[#FF6B00] text-white rounded-lg font-semibold"
                    >
                      Đăng ký miễn phí
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
