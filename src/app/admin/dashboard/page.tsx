"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Package, RefreshCw } from "lucide-react";

interface StatsData {
  totalUsers: number;
  todayUsers: number;
  totalProducts: number;
  activeProducts: number;
  recentUsers: Array<{ id: number; name: string; email: string; plan: string; joined_at: string }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("monetai_admin_token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [usersRes, productsRes] = await Promise.all([
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/affiliate", { headers }),
      ]);

      if (usersRes.status === 401 || productsRes.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      const usersData = usersRes.ok ? await usersRes.json() : { users: [], total: 0 };
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] };

      const users = usersData.users ?? [];
      const products = productsData.products ?? [];
      const today = new Date().toLocaleDateString("vi-VN");

      setStats({
        totalUsers: users.length,
        todayUsers: users.filter((u: { joined_at: string }) =>
          new Date(u.joined_at).toLocaleDateString("vi-VN") === today
        ).length,
        totalProducts: products.length,
        activeProducts: products.filter((p: { is_active: boolean }) => p.is_active).length,
        recentUsers: users.slice(0, 8),
      });
    } catch {
      setError("Không thể tải dữ liệu. Kiểm tra kết nối Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  const statCards = [
    { label: "Tổng users đăng ký", value: stats?.totalUsers ?? 0, icon: Users, color: "#FF6B00" },
    { label: "Đăng ký hôm nay", value: stats?.todayUsers ?? 0, icon: Users, color: "#10B981" },
    { label: "Sản phẩm Affiliate", value: stats?.totalProducts ?? 0, icon: Package, color: "#3B82F6" },
    { label: "Sản phẩm đang hoạt động", value: stats?.activeProducts ?? 0, icon: TrendingUp, color: "#8B5CF6" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Tổng quan</h1>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-[#A0A0B0] hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${s.color}20` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-[#A0A0B0] text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent users */}
      {stats && stats.recentUsers.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-4">Đăng ký gần đây</h2>
          <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2A2A3A]">
                    <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Họ tên</th>
                    <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Email</th>
                    <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Gói</th>
                    <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((u, i) => (
                    <tr key={u.id} className={`border-b border-[#2A2A3A]/50 ${i === 0 ? "bg-[#FF6B00]/5" : ""}`}>
                      <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-[#A0A0B0]">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-[#FF6B00]/15 text-[#FF6B00] px-2.5 py-1 rounded-full font-medium">
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#A0A0B0]">
                        {new Date(u.joined_at).toLocaleString("vi-VN", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
