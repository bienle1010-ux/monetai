import { NextRequest, NextResponse } from "next/server";
import { generateOptimalContent } from "@/lib/aiGenerators";

const ADMIN_EMAIL = "monetai.vn@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { contentType, product, benefits, tone, userEmail } = await req.json();

    if (!product?.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập tên sản phẩm/dịch vụ." }, { status: 400 });
    }

    // Admin has unlimited credits — no check needed
    const isAdmin = userEmail === ADMIN_EMAIL;

    const result = await generateOptimalContent({
      contentType: contentType || "facebook",
      product: product.trim(),
      benefits: benefits?.trim() || "",
      tone: tone || "Thuyết phục",
    });

    return NextResponse.json({
      content: result.content,
      source: result.source,
      isAdmin,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Lỗi hệ thống";
    console.error("generate-content error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
