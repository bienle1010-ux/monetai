import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getTransporter, ADMIN_EMAIL } from "@/lib/mailer";

const MB_ACCOUNT = "0971166299";
const CREDITS_PER_VND = 1000; // 1 credit = 1,000 VNĐ

// Extract email from bank transfer description
// Formats: "MN user@email.com", "MONETAI user@email.com", "NAP user@email.com"
function extractEmail(description: string): string | null {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const match = description.match(emailRegex);
  return match ? match[0].toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  try {
    // Verify Casso secure code (optional but recommended)
    const secureCode = process.env.CASSO_SECURE_CODE;
    if (secureCode) {
      const incomingCode =
        req.headers.get("x-api-key") ||
        req.headers.get("secure-code") ||
        req.headers.get("authorization")?.replace("Bearer ", "");
      if (incomingCode !== secureCode) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();

    // Casso webhook format: { id, when, data: [ { id, tid, description, amount, type, bank_sub_acc_id, ... } ] }
    const transactions = Array.isArray(body.data) ? body.data : [body];

    const supabase = getSupabaseAdmin();
    const transporter = getTransporter();
    const processed: string[] = [];

    for (const tx of transactions) {
      // Only process incoming transfers (type 1) to our account
      if (tx.type === 2) continue; // outgoing
      if (tx.bank_sub_acc_id && tx.bank_sub_acc_id !== MB_ACCOUNT) continue;

      const amount = Number(tx.amount ?? 0);
      if (amount < 10_000) continue; // ignore tiny amounts

      const description: string = tx.description ?? tx.memo ?? "";
      const email = extractEmail(description);

      if (!email) {
        console.warn(`[Payment] Cannot extract email from: "${description}"`);
        continue;
      }

      const credits = Math.floor(amount / CREDITS_PER_VND);
      const tid = tx.tid ?? tx.id?.toString() ?? `tx-${Date.now()}`;

      // Save to Supabase
      if (supabase) {
        const { error } = await supabase.from("payments").insert({
          email,
          amount,
          credits,
          tid,
          description,
          status: "confirmed",
          paid_at: tx.when ? new Date(tx.when).toISOString() : new Date().toISOString(),
        });

        if (error && !error.message.includes("duplicate")) {
          console.error("[Payment] Supabase insert error:", error.message);
          continue;
        }
      }

      processed.push(email);

      // Send confirmation email to user
      if (transporter) {
        const html = `
<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#FF6B00,#FF8C3A);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">✅ Thanh toán thành công!</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:14px;">MonetAI đã nhận được thanh toán của bạn</p>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#666;width:160px;">Email:</td><td style="color:#1A1A2E;font-weight:600;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Số tiền:</td><td style="color:#1A1A2E;font-weight:600;">${amount.toLocaleString("vi-VN")} ₫</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Credits nhận được:</td><td><span style="background:#FF6B00;color:#fff;padding:2px 10px;border-radius:20px;font-size:13px;font-weight:700;">+${credits} credits</span></td></tr>
        <tr><td style="padding:8px 0;color:#666;">Mã giao dịch:</td><td style="color:#666;font-size:12px;">${tid}</td></tr>
      </table>
      <div style="margin-top:20px;background:#FFF8F3;border-left:4px solid #FF6B00;border-radius:4px;padding:14px 16px;">
        <p style="margin:0;color:#FF6B00;font-weight:600;font-size:14px;">Credits đã được cộng vào tài khoản!</p>
        <p style="margin:6px 0 0;color:#666;font-size:13px;">Đăng nhập lại để credits được cập nhật. Chúc bạn kiếm tiền thành công với MonetAI!</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f8f9fa;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;color:#999;font-size:12px;"><span style="color:#FF6B00;font-weight:600;">MonetAI</span> — Earn More With AI</p>
    </div>
  </div>
</body></html>`;

        await transporter.sendMail({
          from: `"MonetAI" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: `[MonetAI] Cộng ${credits} credits thành công — ${amount.toLocaleString("vi-VN")} ₫`,
          html,
        }).catch(() => {});

        // Notify admin
        await transporter.sendMail({
          from: `"MonetAI System" <${process.env.GMAIL_USER}>`,
          to: ADMIN_EMAIL,
          subject: `[MonetAI] Thanh toán mới: ${email} — ${amount.toLocaleString("vi-VN")} ₫ (+${credits} credits)`,
          html: `<p><b>Email:</b> ${email}<br/><b>Số tiền:</b> ${amount.toLocaleString("vi-VN")} ₫<br/><b>Credits:</b> +${credits}<br/><b>Mô tả:</b> ${description}<br/><b>TID:</b> ${tid}</p>`,
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, processed: processed.length });
  } catch (err) {
    console.error("[Payment webhook] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Casso pings GET to verify webhook URL
export async function GET() {
  return NextResponse.json({ status: "ok", service: "MonetAI Payment Webhook" });
}
