import { NextRequest, NextResponse } from "next/server";
import { getTransporter, ADMIN_EMAIL } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc." }, { status: 400 });
    }

    const transporter = getTransporter();

    if (transporter) {
      await transporter.sendMail({
        from:    `"MonetAI Contact" <${process.env.GMAIL_USER}>`,
        to:      ADMIN_EMAIL,
        replyTo: email,
        subject: `[Liên hệ MonetAI] ${subject || "Không có tiêu đề"} — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0F;color:#F0F0F0;padding:32px;border-radius:12px">
            <h2 style="color:#FF6B00;margin:0 0 24px">Tin nhắn liên hệ mới từ MonetAI</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A3A;color:#A0A0B0;width:140px">Họ tên</td><td style="padding:10px 0;border-bottom:1px solid #2A2A3A">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A3A;color:#A0A0B0">Email</td><td style="padding:10px 0;border-bottom:1px solid #2A2A3A"><a href="mailto:${email}" style="color:#FF6B00">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #2A2A3A;color:#A0A0B0">Điện thoại</td><td style="padding:10px 0;border-bottom:1px solid #2A2A3A"><a href="tel:${phone}" style="color:#FF6B00">${phone}</a></td></tr>` : ""}
              ${subject ? `<tr><td style="padding:10px 0;border-bottom:1px solid #2A2A3A;color:#A0A0B0">Chủ đề</td><td style="padding:10px 0;border-bottom:1px solid #2A2A3A">${subject}</td></tr>` : ""}
            </table>
            <div style="margin-top:24px">
              <p style="color:#A0A0B0;margin:0 0 8px;font-size:13px">Nội dung:</p>
              <div style="background:#16161F;border:1px solid #2A2A3A;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.7">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            </div>
            <p style="color:#555;font-size:12px;margin-top:24px">Gửi lúc ${new Date().toLocaleString("vi-VN")} · monetai.vn</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
  }
}
