"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, RefreshCw, Download } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  joined_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("monetai_admin_token");
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Lỗi tải dữ liệu"); return; }
      setUsers(data.users ?? []);
    } catch {
      setError("Không thể kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date().toLocaleDateString("vi-VN");
  const todayCount = users.filter(
    (u) => new Date(u.joined_at).toLocaleDateString("vi-VN") === today
  ).length;

  const exportCSV = () => {
    const header = "STT,Họ tên,Email,Gói,Ngày đăng ký\n";
    const rows = users.map((u, i) =>
      `${i + 1},"${u.name}","${u.email}","${u.plan}","${new Date(u.joined_at).toLocaleString("vi-VN")}"`
    );
    const blob = new Blob(["﻿" + header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MonetAI_Users_${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Người dùng đã đăng ký</h1>
          <p className="text-[#A0A0B0] text-sm mt-0.5">
            Tổng: <span className="text-white font-semibold">{users.length}</span> · Hôm nay: <span className="text-[#FF6B00] font-semibold">{todayCount}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 text-sm text-[#A0A0B0] hover:text-white bg-[#16161F] border border-[#2A2A3A] px-4 py-2 rounded-xl transition-all hover:border-[#FF6B00]/30"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 text-sm text-[#A0A0B0] hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email..."
          className="w-full bg-[#16161F] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-[#A0A0B0]/50 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 text-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-12 text-center">
          <Users className="w-10 h-10 text-[#A0A0B0] mx-auto mb-3" />
          <p className="text-[#A0A0B0]">{search ? "Không tìm thấy user nào." : "Chưa có user nào đăng ký."}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A3A]">
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3 w-10">#</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Họ và tên</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Email</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Gói</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} className="border-b border-[#2A2A3A]/50 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 text-[#A0A0B0]">{i + 1}</td>
                    <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-[#A0A0B0]">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-[#FF6B00]/15 text-[#FF6B00] px-2.5 py-1 rounded-full font-medium">
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#A0A0B0] whitespace-nowrap">
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
          <div className="px-5 py-3 border-t border-[#2A2A3A] text-[#A0A0B0] text-xs">
            Hiển thị {filtered.length} / {users.length} người dùng
          </div>
        </motion.div>
      )}
    </div>
  );
}
