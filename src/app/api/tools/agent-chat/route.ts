import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

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

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "AI API chưa được cấu hình." }, { status: 503 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `${systemPrompt}\n\nBạn là ${agentName} trên nền tảng MonetAI. Trả lời bằng tiếng Việt, thân thiện và hữu ích.`,
    });

    const chat = model.startChat({
      history: history ?? [],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Agent chat error:", err);
    return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
  }
}
