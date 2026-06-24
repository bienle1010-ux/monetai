import { NextRequest, NextResponse } from "next/server";
import { getAdminCredentials } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const { email: adminEmail, password: adminPassword, secret } = getAdminCredentials();

  if (!adminPassword || !secret) {
    return NextResponse.json(
      { error: "Admin chưa được cấu hình. Thêm ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SECRET vào biến môi trường." },
      { status: 503 }
    );
  }

  if (email === adminEmail && password === adminPassword) {
    return NextResponse.json({ token: secret });
  }

  return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
}
