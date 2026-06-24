import * as XLSX from "xlsx";
import type { RegistrationRecord } from "./supabase";

export function generateRegistrationExcel(users: RegistrationRecord[]): Buffer {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Danh sách đăng ký
  const rows = users.map((u, i) => ({
    STT: i + 1,
    "Họ và tên": u.name,
    Email: u.email,
    "Gói đăng ký": u.plan,
    "Ngày đăng ký": new Date(u.joined_at).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 6 },   // STT
    { wch: 28 },  // Họ và tên
    { wch: 34 },  // Email
    { wch: 16 },  // Gói
    { wch: 22 },  // Ngày đăng ký
  ];

  // Style header row
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "FF6B00" } },
    alignment: { horizontal: "center" },
  };
  ["A1", "B1", "C1", "D1", "E1"].forEach((cell) => {
    if (ws[cell]) ws[cell].s = headerStyle;
  });

  XLSX.utils.book_append_sheet(wb, ws, "Danh sách đăng ký");

  // Sheet 2: Thống kê
  const today = new Date();
  const todayStr = today.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const totalToday = users.filter((u) => {
    const d = new Date(u.joined_at);
    return d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) === todayStr;
  }).length;

  const planCounts: Record<string, number> = {};
  users.forEach((u) => {
    planCounts[u.plan] = (planCounts[u.plan] ?? 0) + 1;
  });

  const statsRows = [
    { "Chỉ số": "Tổng số tài khoản", "Giá trị": users.length },
    { "Chỉ số": "Đăng ký hôm nay", "Giá trị": totalToday },
    { "Chỉ số": "Ngày xuất báo cáo", "Giá trị": new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) },
    { "Chỉ số": "", "Giá trị": "" },
    { "Chỉ số": "=== Phân loại theo Gói ===", "Giá trị": "" },
    ...Object.entries(planCounts).map(([plan, count]) => ({ "Chỉ số": `Gói ${plan}`, "Giá trị": count })),
  ];

  const ws2 = XLSX.utils.json_to_sheet(statsRows);
  ws2["!cols"] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Thống kê");

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}
