import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export const maxDuration = 60;

type ChatMessage = { role: "user" | "model"; parts: Array<{ text: string }> };

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRateLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("quota") ||
    msg.includes("rate") ||
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("Too Many Requests") ||
    msg.includes("overloaded") ||
    msg.includes("capacity")
  );
}

async function tryGeminiChat(
  fullSystemPrompt: string,
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("NO_GEMINI_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);

  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODELS[i],
        systemInstruction: fullSystemPrompt,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.9 },
      });
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      if (isRateLimit(err) && i < GEMINI_MODELS.length - 1) {
        await sleep(1000);
        continue;
      }
      throw err;
    }
  }
  throw new Error("ALL_GEMINI_RATE_LIMITED");
}

async function tryOpenAIChat(
  fullSystemPrompt: string,
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("NO_OPENAI_KEY");
  const openai = new OpenAI({ apiKey });

  const openaiHistory: OpenAI.Chat.ChatCompletionMessageParam[] = history.map((h) => ({
    role: h.role === "model" ? "assistant" : "user",
    content: h.parts.map((p) => p.text).join(""),
  }));

  const models = ["gpt-4o-mini", "gpt-3.5-turbo"];
  for (let i = 0; i < models.length; i++) {
    try {
      const completion = await openai.chat.completions.create({
        model: models[i],
        messages: [
          { role: "system", content: fullSystemPrompt },
          ...openaiHistory,
          { role: "user", content: message },
        ],
        max_tokens: 1024,
        temperature: 0.9,
      });
      return completion.choices[0]?.message?.content ?? "";
    } catch (err) {
      if (isRateLimit(err) && i < models.length - 1) {
        await sleep(1000);
        continue;
      }
      throw err;
    }
  }
  throw new Error("ALL_OPENAI_RATE_LIMITED");
}

export async function POST(req: NextRequest) {
  try {
    const { agentName, systemPrompt, message, history } = (await req.json()) as {
      agentName: string;
      systemPrompt: string;
      message: string;
      history?: ChatMessage[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập tin nhắn." }, { status: 400 });
    }

    const fullSystemPrompt = `${systemPrompt}\n\nBạn là ${agentName} trên nền tảng MonetAI. Trả lời bằng tiếng Việt, thân thiện và hữu ích.`;
    const safeHistory = history ?? [];

    // 1. Try all Gemini models
    try {
      const reply = await tryGeminiChat(fullSystemPrompt, message, safeHistory);
      return NextResponse.json({ reply });
    } catch (geminiErr) {
      if (!isRateLimit(geminiErr) && !String(geminiErr).includes("ALL_GEMINI")) throw geminiErr;
    }

    // 2. OpenAI fallback
    try {
      const reply = await tryOpenAIChat(fullSystemPrompt, message, safeHistory);
      return NextResponse.json({ reply });
    } catch (openaiErr) {
      if (!isRateLimit(openaiErr) && !String(openaiErr).includes("ALL_OPENAI")) throw openaiErr;
    }

    // 3. Wait 5s and retry
    await sleep(5000);
    try {
      const reply = await tryGeminiChat(fullSystemPrompt, message, safeHistory);
      return NextResponse.json({ reply });
    } catch {
      try {
        const reply = await tryOpenAIChat(fullSystemPrompt, message, safeHistory);
        return NextResponse.json({ reply });
      } catch {
        return NextResponse.json(
          { error: "Hệ thống AI đang quá tải. Vui lòng thử lại sau 1 phút." },
          { status: 429 }
        );
      }
    }
  } catch (err) {
    console.error("Agent chat error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
  }
}
