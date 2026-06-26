import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { agentName, systemPrompt, message, history } = (await req.json()) as {
      agentName: string;
      systemPrompt: string;
      message: string;
      history?: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập tin nhắn." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI API chưa được cấu hình." }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `${systemPrompt}\n\nBạn là ${agentName} trên nền tảng MonetAI. Trả lời bằng tiếng Việt, thân thiện và hữu ích.`,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.9 },
    });

    const chat = model.startChat({ history: history ?? [] });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Agent chat error:", message);
    return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
  }
}
