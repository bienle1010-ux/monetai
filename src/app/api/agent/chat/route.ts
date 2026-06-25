import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function callOpenAI(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("no key");
  const client = new OpenAI({ apiKey: key });
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    max_tokens: 800,
    temperature: 0.7,
  });
  const text = res.choices[0]?.message?.content ?? "";
  if (!text) throw new Error("empty");
  return text;
}

async function callGemini(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("no key");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  // Build Gemini history (all but last user message)
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const lastMsg = messages[messages.length - 1].content;

  const chat   = model.startChat({ history });
  const result = await chat.sendMessage(lastMsg);
  const text   = result.response.text();
  if (!text) throw new Error("empty");
  return text;
}

async function callClaude(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("no key");
  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  const block = res.content[0];
  const text  = block.type === "text" ? block.text : "";
  if (!text) throw new Error("empty");
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, messages } = (await req.json()) as {
      systemPrompt: string;
      messages: ChatMessage[];
    };

    if (!systemPrompt || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Try each AI in sequence — use first success
    const callers = [
      () => callOpenAI(systemPrompt, messages),
      () => callGemini(systemPrompt, messages),
      () => callClaude(systemPrompt, messages),
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
