import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FileContext {
  name: string;
  content: string;   // text content (already decoded on client)
}

// Inject file content into system prompt
function buildPrompt(systemPrompt: string, files?: FileContext[]): string {
  if (!files || files.length === 0) return systemPrompt;
  const sections = files
    .filter((f) => f.content && f.content.trim())
    .map((f) => `--- ${f.name} ---\n${f.content.slice(0, 12_000)}`)
    .join("\n\n");
  if (!sections) return systemPrompt;
  return `${systemPrompt}\n\n=== TÀI LIỆU THAM KHẢO ===\n${sections}\n=== HẾT TÀI LIỆU ===\n\nLưu ý: Ưu tiên trả lời dựa trên tài liệu tham khảo trên. Nếu câu hỏi không có trong tài liệu, hãy trả lời theo kiến thức chung.`;
}

async function callOpenAI(prompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("no key");
  const client = new OpenAI({ apiKey: key });
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });
  const text = res.choices[0]?.message?.content ?? "";
  if (!text) throw new Error("empty");
  return text;
}

async function callGemini(prompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("no key");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: prompt,
  });
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const lastMsg = messages[messages.length - 1].content;
  const chat    = model.startChat({ history });
  const result  = await chat.sendMessage(lastMsg);
  const text    = result.response.text();
  if (!text) throw new Error("empty");
  return text;
}

async function callClaude(prompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("no key");
  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    system: prompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  const block = res.content[0];
  const text  = block.type === "text" ? block.text : "";
  if (!text) throw new Error("empty");
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { systemPrompt, messages, fileContents } = body as {
      systemPrompt: string;
      messages: ChatMessage[];
      fileContents?: FileContext[];
    };

    if (!systemPrompt || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const prompt = buildPrompt(systemPrompt, fileContents);

    const callers = [
      () => callOpenAI(prompt, messages),
      () => callGemini(prompt, messages),
      () => callClaude(prompt, messages),
    ];

    let lastError = "";
    for (const caller of callers) {
      try {
        const reply = await caller();
        return NextResponse.json({ reply });
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    return NextResponse.json(
      { error: `AI không khả dụng lúc này. (${lastError})` },
      { status: 503 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
