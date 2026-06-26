import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = "1024x1024", quality = "standard" } = (await req.json()) as {
      prompt: string;
      size?: "1024x1024" | "1792x1024" | "1024x1792";
      quality?: "standard" | "hd";
    };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập mô tả hình ảnh." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API chưa được cấu hình." }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}. High quality, professional, suitable for business marketing.`,
      n: 1,
      size,
      quality,
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error("No image URL returned");

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: "Không thể tạo hình ảnh. Vui lòng thử lại." }, { status: 500 });
  }
}
