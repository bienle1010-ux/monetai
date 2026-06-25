import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getTransporter, ADMIN_EMAIL } from "@/lib/mailer";

const MB_ACCOUNT      = "0971166299";
const CREDITS_PER_VND = 1000; // 1 credit = 1,000 VNĐ

// Casso sends the secure code as a top-level field AND optionally as a header.
function verifySecureCode(req: NextRequest, body: Record<string, unknown>): boolean {
  const secret = process.env.CASSO_SECURE_CODE;
  if (!secret) return true; // not configured → allow (dev/test)

  const fromHeader =
    req.headers.get("secure-code") ||
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const fromBody = typeof body.secure_code === "string" ? body.secure_code : undefined;

  return fromHeader === secret || fromBody === secret;
}

// Extract email from transfer description.
// Supports: "MN user@email.com", "MONETAI user@email.com", bare "user@email.com"
function extractEmail(description: string): string | null {
  const match = description.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  let rawBody: Record<string, unknown>;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!verifySecureCode(req, rawBody)) {
    console.warn("[Payment webhook] Unauthorized — secure code mismatch");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Casso format: { id, when, data: [...transactions] }  OR single transaction object
  const transactions: Record<string, unknown>[] = Array.isArray(rawBody.data)
    ? (rawBody.data as Record<string, unknown>[])
    : [rawBody];

  const supabase    = getSupabaseAdmin();
  const transporter = getTransporter();
  let processed     = 0;

  for (const tx of transactions) {
    // Skip outgoing transfers (type 2) and wrong bank account
    if (tx.type === 2) continue;
    const subAccId = ((tx.bank_sub_acc_id ?? tx.bankSubAccId ?? "") as string).trim();
    if (subAccId && subAccId !== MB_ACCOUNT) continue;

    const amount = Number(tx.amount ?? 0);
    if (amount < 5_000) continue; // ignore micro amounts

    const description = ((tx.description ?? tx.memo ?? tx.content ?? "") as string).trim();
    const email       = extractEmail(description);

    if (!email) {
      console.warn(`[Payment] No email found in: "${description}"`);
      continue;
    }

    const credits = Math.floor(amount / CREDITS_PER_VND);
    if (credits < 1) continue;

    const tid    = (tx.tid ?? tx.id)?.toString() ?? `gen-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const paidAt = tx.when ? new Date(tx.when as string).toISOString() : new Date().toISOString();

    // Persist — tid is UNIQUE so duplicate webhook calls are idempotent
    if (supabase) {
      const { error } = await supabase.from("payments").insert({
        email,
        amount,
        credits,
        tid,
        description,
        status: "confirmed",
        paid_at: paidAt,
      });

      if (error) {
        if (error.message.includes("duplicate") || error.code === "23505") {
          console.log(`[Payment] Duplicate tid ${tid} — skipped`);
          continue;
        }
        console.error("[Payment] Supabase error:", error.message);
        continue;
      }
    }

    processed++;
    console.log(`[Payment] +${credits} credits → ${email} (${amount.toLocaleString("vi-VN")} ₫, tid=${tid})`);

    // Send emails (non-blocking — fire and forget)
    if (transporter) {
      const userHtml = `
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
        <tr><td style="padding:8px 0;color:#666;">Mã GD:</td><td style="color:#999;font-size:12px;">${tid}</td></tr>
      </table>
      <div style="margin-top:20px;background:#FFF8F3;border-left:4px solid #FF6B00;border-radius:4px;padding:14px 16px;">
        <p style="margin:0;color:#FF6B00;font-weight:600;font-size:14px;">Credits đã được cộng tự động!</p>
        <p style="margin:6px 0 0;color:#666;font-size:13px;">Đăng nhập lại hoặc bấm "Đồng bộ credits" để thấy số dư mới. Chúc bạn kiếm tiền thành công!</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f8f9fa;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;color:#999;font-size:12px;"><span style="color:#FF6B00;font-weight:600;">MonetAI</span> — Earn More With AI</p>
    </div>
  </div>
</body></html>`;

      transporter.sendMail({
        from: `"MonetAI" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `[MonetAI] Cộng ${credits} credits thành công — ${amount.toLocaleString("vi-VN")} ₫`,
        html: userHtml,
      }).catch((err: Error) => console.error("[Payment email] user:", err.message));

      transporter.sendMail({
        from: `"MonetAI System" <${process.env.GMAIL_USER}>`,
        to: ADMIN_EMAIL,
        subject: `[MonetAI] Thanh toán: ${email} +${credits} credits (${amount.toLocaleString("vi-VN")} ₫)`,
        html: `<p><b>Email:</b> ${email}<br/><b>Số tiền:</b> ${amount.toLocaleString("vi-VN")} ₫<br/><b>Credits:</b> +${credits}<br/><b>Mô tả:</b> ${description}<br/><b>TID:</b> ${tid}<br/><b>Thời gian:</b> ${paidAt}</p>`,
      }).catch((err: Error) => console.error("[Payment email] admin:", err.message));
    }
  }

  return NextResponse.json({ success: true, processed });
}

// Casso pings GET to verify the webhook URL is reachable
export async function GET() {
  return NextResponse.json({ status: "ok", service: "MonetAI Payment Webhook" });
}
