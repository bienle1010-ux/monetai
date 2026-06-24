"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin" />
          <p className="text-[#A0A0B0] text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-[#2A2A3A] bg-[#0A0A0F]/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#A0A0B0] hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder:text-[#5A5A7A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none w-60 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[#A0A0B0] hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B00] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
