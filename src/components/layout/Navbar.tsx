"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Dịch vụ", href: "/#services" },
  { label: "Bảng giá", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
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
            {navLinks.map((l) => (
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
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
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
