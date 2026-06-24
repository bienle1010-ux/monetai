"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Users, LogOut, Menu, X, Shield } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Affiliate Products", href: "/admin/affiliate", icon: TrendingUp },
  { label: "Người dùng", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip auth check for the login page itself
  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    if (isLoginPage) return;
    const token = localStorage.getItem("monetai_admin_token");
    if (!token) {
      router.push("/admin");
    }
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("monetai_admin_token");
    router.push("/admin");
  };

  if (isLoginPage) return <>{children}</>;

  const Sidebar = () => (
    <aside className="w-64 bg-[#111118] border-r border-[#2A2A3A] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A3A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <span className="text-white font-bold">
            Monet<span className="text-[#FF6B00]">AI</span>
            <span className="text-[#A0A0B0] font-normal text-sm ml-1">Admin</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20"
                  : "text-[#A0A0B0] hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#2A2A3A]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#A0A0B0] hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
        <p className="text-[#A0A0B0] text-xs mt-3 px-3">
          <a href="/" className="hover:text-white transition-colors">← Về trang web</a>
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="relative h-full"
          >
            <Sidebar />
          </motion.div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#111118]/80 backdrop-blur-md border-b border-[#2A2A3A] px-6 py-4 flex items-center gap-4">
          <button
            className="md:hidden text-[#A0A0B0] hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-white font-semibold text-sm">
            {navItems.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </h2>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
