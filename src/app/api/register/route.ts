import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getTransporter, ADMIN_EMAIL } from "@/lib/mailer";
import { generateRegistrationExcel } from "@/lib/excel";
import type { RegistrationRecord } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, plan = "Creator" } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const joinedAt = new Date().toISOString();
    const newUser: RegistrationRecord = { name, email, plan, joined_at: joinedAt };

    // ── 1. Lưu vào Supabase (nếu được cấu hình) ──────────────────────────────
    let allUsers: RegistrationRecord[] = [newUser];
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error: insertErr } = await supabase
        .from("registrations")
        .insert({ name, email, plan, joined_at: joinedAt });

      if (insertErr) {
        console.error("Supabase insert error:", insertErr.message);
      }

      // Lấy toàn bộ danh sách
      const { data } = await supabase
        .from("registrations")
        .select("*")
        .order("joined_at", { ascending: true });

      if (data && data.length > 0) allUsers = data as RegistrationRecord[];
    }

    // ── 2. Tạo file Excel ─────────────────────────────────────────────────────
    const excelBuffer = generateRegistrationExcel(allUsers);
    const dateStr = new Date()
      .toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      .replace(/\//g, "-");
    const fileName = `MonetAI_DanhSach_${dateStr}_${allUsers.length}users.xlsx`;

    // ── 3. Gửi email ──────────────────────────────────────────────────────────
    const transporter = getTransporter();

    if (transporter) {
      const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8" /></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#FF6B00,#FF8C3A); padding:28px 32px;">
      <h1 style="margin:0; color:#fff; font-size:22px; font-weight:700;">
        🎉 MonetAI — Đăng ký mới!
      </h1>
      <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
        Tổng cộng <strong>${allUsers.length}</strong> tài khoản đã đăng ký
      </p>
    </div>

    <!-- New user highlight -->
    <div style="padding:24px 32px; background:#FFF8F3; border-left:4px solid #FF6B00;">
      <h2 style="margin:0 0 12px; color:#FF6B00; font-size:16px; font-weight:700;">
        👤 Khách hàng mới đăng ký
      </h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0; color:#666; font-size:14px; width:140px;">Họ và tên:</td>
          <td style="padding:6px 0; color:#1A1A2E; font-size:14px; font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#666; font-size:14px;">Email:</td>
          <td style="padding:6px 0; color:#1A1A2E; font-size:14px; font-weight:600;">${email}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#666; font-size:14px;">Gói đăng ký:</td>
          <td style="padding:6px 0;"><span style="background:#FF6B00; color:#fff; padding:2px 10px; border-radius:20px; font-size:13px; font-weight:600;">${plan}</span></td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#666; font-size:14px;">Thời gian:</td>
          <td style="padding:6px 0; color:#1A1A2E; font-size:14px;">${new Date(joinedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</td>
        </tr>
      </table>
    </div>

    <!-- Stats -->
    <div style="padding:24px 32px;">
      <h2 style="margin:0 0 16px; color:#1A1A2E; font-size:16px; font-weight:700;">
        📊 Thống kê tổng quan
      </h2>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <div style="flex:1; min-width:120px; background:#f8f9fa; border-radius:10px; padding:14px; text-align:center;">
          <div style="font-size:28px; font-weight:700; color:#FF6B00;">${allUsers.length}</div>
          <div style="font-size:12px; color:#666; margin-top:4px;">Tổng tài khoản</div>
        </div>
        <div style="flex:1; min-width:120px; background:#f8f9fa; border-radius:10px; padding:14px; text-align:center;">
          <div style="font-size:28px; font-weight:700; color:#10B981;">
            ${allUsers.filter(u => new Date(u.joined_at).toDateString() === new Date().toDateString()).length}
          </div>
          <div style="font-size:12px; color:#666; margin-top:4px;">Hôm nay</div>
        </div>
      </div>
    </div>

    <!-- Last 5 users -->
    ${allUsers.length > 1 ? `
    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 12px; color:#1A1A2E; font-size:16px; font-weight:700;">
        🕐 5 đăng ký gần nhất
      </h2>
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f8f9fa;">
            <th style="padding:8px 10px; text-align:left; color:#666; font-weight:600; border-bottom:1px solid #e5e7eb;">Họ và tên</th>
            <th style="padding:8px 10px; text-align:left; color:#666; font-weight:600; border-bottom:1px solid #e5e7eb;">Email</th>
            <th style="padding:8px 10px; text-align:left; color:#666; font-weight:600; border-bottom:1px solid #e5e7eb;">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          ${[...allUsers].reverse().slice(0, 5).map((u, i) => `
          <tr style="background:${i === 0 ? "#FFF8F3" : "transparent"};">
            <td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; font-weight:${i === 0 ? "600" : "400"}">${u.name}${i === 0 ? " 🆕" : ""}</td>
            <td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; color:#666;">${u.email}</td>
            <td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; color:#666; white-space:nowrap;">
              ${new Date(u.joined_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>` : ""}

    <!-- Footer -->
    <div style="padding:20px 32px; background:#f8f9fa; border-top:1px solid #e5e7eb; text-align:center;">
      <p style="margin:0; color:#999; font-size:12px;">
        📎 File Excel đính kèm chứa toàn bộ <strong>${allUsers.length}</strong> khách hàng đã đăng ký<br/>
        <span style="color:#FF6B00; font-weight:600;">MonetAI</span> — Earn More With AI
      </p>
    </div>

  </div>
</body>
</html>`;

      await transporter.sendMail({
        from: `"MonetAI System" <${process.env.GMAIL_USER}>`,
        to: ADMIN_EMAIL,
        subject: `[MonetAI] Đăng ký mới: ${name} — Tổng ${allUsers.length} tài khoản`,
        html,
        attachments: [
          {
            filename: fileName,
            content: excelBuffer,
            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      });
    } else {
      console.warn("Email chưa được cấu hình. Thêm GMAIL_USER và GMAIL_APP_PASSWORD vào .env");
    }

    return NextResponse.json({ success: true, totalUsers: allUsers.length });
  } catch (err) {
    console.error("Registration API error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
