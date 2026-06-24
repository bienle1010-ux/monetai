"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, TrendingUp, PenTool, Video, Bot,
  MessageSquare, Workflow, Store, GraduationCap, User,
  Settings, LogOut, X, CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "AI Affiliate", href: "/dashboard/affiliate", icon: TrendingUp },
  { label: "AI Content", href: "/dashboard/content-generator", icon: PenTool },
  { label: "AI Video Script", href: "/dashboard/video-script", icon: Video },
  { label: "AI Agents", href: "/dashboard/agent-marketplace", icon: Bot },
  { label: "AI Prompts", href: "/dashboard/prompt-marketplace", icon: MessageSquare },
  { label: "AI Automation", href: "/dashboard/automation-builder", icon: Workflow },
  { label: "AI SaaS", href: "/dashboard/saas-marketplace", icon: Store },
  { label: "Academy", href: "/dashboard/academy", icon: GraduationCap },
];

const bottom = [
  { label: "Hồ sơ", href: "/dashboard/profile", icon: User },
  { label: "Nâng cấp", href: "/dashboard/billing", icon: CreditCard },
  { label: "Cài đặt", href: "/dashboard/settings", icon: Settings },
];

interface Props {
  onClose?: () => void;
}

export default function DashboardSidebar({ onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 h-full flex flex-col bg-[#111118] border-r border-[#2A2A3A]">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-[#2A2A3A]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="font-bold text-base text-white">Monet<span className="text-[#FF6B00]">AI</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[#A0A0B0] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User info */}
      {user && (
        <div className="p-4 border-b border-[#2A2A3A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FF6B00] bg-[#FF6B00]/10 px-1.5 py-0.5 rounded capitalize">{user.plan}</span>
                <span className="text-xs text-[#A0A0B0]">{user.credits} credits</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {nav.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-[#FF6B00]/15 text-[#FF6B00]"
                  : "text-[#A0A0B0] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-[#FF6B00]" : "text-[#A0A0B0] group-hover:text-white")} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-0.5 h-6 bg-[#FF6B00] rounded-r"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#2A2A3A] space-y-0.5">
        {bottom.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all"
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
