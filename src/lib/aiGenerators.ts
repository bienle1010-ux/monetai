import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export interface GenerateParams {
  contentType: string;
  product: string;
  benefits: string;
  tone: string;
}

export interface AIResult {
  content: string;
  source: string;
  score: number;
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  facebook: "bài đăng Facebook bán hàng",
  tiktok: "kịch bản video TikTok (30-60 giây)",
  caption: "caption và hashtag cho mạng xã hội",
  email: "email marketing",
  seo: "bài viết SEO (1000-1500 từ, có H2/H3)",
};

function buildPrompt(p: GenerateParams): string {
  const label = TYPE_LABELS[p.contentType] ?? "nội dung marketing";
  return `Bạn là chuyên gia content marketing và affiliate marketing người Việt Nam, có kinh nghiệm giúp khách hàng kiếm tiền từ internet.

NHIỆM VỤ: Viết ${label} cho sản phẩm/dịch vụ sau.

📌 THÔNG TIN SẢN PHẨM:
- Tên sản phẩm/dịch vụ: ${p.product}
- Lợi ích nổi bật: ${p.benefits || "Tăng thu nhập, tiết kiệm thời gian, dễ sử dụng"}
- Tone giọng văn: ${p.tone}

🎯 YÊU CẦU BẮT BUỘC (phải có đầy đủ):
1. MỞ ĐẦU gây chú ý ngay — hook mạnh, câu hỏi hoặc con số gây tò mò
2. NỘI DUNG CHÍNH — làm nổi bật lợi ích cụ thể, dẫn chứng thực tế
3. XÂY DỰNG NIỀM TIN — bằng chứng xã hội, đảm bảo, con số
4. CTA RÕ RÀNG — hành động cụ thể để người đọc thực hiện ngay (mua/đăng ký/nhắn tin/click link)
5. MỤC TIÊU CUỐI CÙNG: nội dung phải giúp người đăng bài KIẾM ĐƯỢC TIỀN từ sản phẩm này

📝 QUY TẮC VIẾT:
- Viết hoàn toàn bằng tiếng Việt
- Dùng emoji phù hợp (không quá 8 emoji)
- Tránh từ ngữ sáo rỗng
- Nội dung phải thực tế, có thể triển khai ngay
- ${p.contentType === "facebook" ? "Có hashtag ở cuối (5-8 hashtag phù hợp)" : ""}
- ${p.contentType === "tiktok" ? "Chia rõ [HOOK], [NỘI DUNG], [CTA] với timestamp" : ""}
- ${p.contentType === "email" ? "Có tiêu đề email hấp dẫn ở đầu, định dạng chuyên nghiệp" : ""}
- ${p.contentType === "seo" ? "Có từ khóa tự nhiên, heading H2/H3, meta description ở cuối" : ""}

Viết trực tiếp nội dung, KHÔNG giải thích hay hỏi thêm.`;
}

// ── Scoring ────────────────────────────────────────────────────────────────────

function scoreContent(content: string, params: GenerateParams): number {
  let score = 0;
  const lower = content.toLowerCase();
  const productLower = params.product.toLowerCase();

  // Length (200-3000 optimal)
  const len = content.length;
  if (len >= 300 && len <= 3000) score += 25;
  else if (len >= 150) score += 10;

  // Product name mentioned
  const productWords = productLower.split(/\s+/).filter((w) => w.length > 2);
  productWords.forEach((w) => { if (lower.includes(w)) score += 8; });

  // Benefits mentioned
  const benefitWords = params.benefits.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 3);
  benefitWords.forEach((w) => { if (lower.includes(w)) score += 4; });

  // CTA indicators
  ["đăng ký", "mua ngay", "nhắn tin", "liên hệ", "click", "link", "inbox", "bình luận", ">>", "👇"].forEach((cta) => {
    if (lower.includes(cta)) score += 6;
  });

  // Marketing hooks / money keywords
  ["kiếm tiền", "thu nhập", "hoa hồng", "miễn phí", "tiết kiệm", "lợi nhuận", "%"].forEach((kw) => {
    if (lower.includes(kw)) score += 4;
  });

  // Emoji (sign of engagement)
  const emojiCount = (content.match(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g) || []).length;
  if (emojiCount >= 2 && emojiCount <= 10) score += 5;

  return score;
}

// ── AI callers ─────────────────────────────────────────────────────────────────

async function callOpenAI(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("No OPENAI_API_KEY");
  const client = new OpenAI({ apiKey: key });
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.8,
  });
  return res.choices[0]?.message?.content ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("No GOOGLE_AI_API_KEY");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callClaude(prompt: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("No ANTHROPIC_API_KEY");
  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });
  const block = res.content[0];
  return block.type === "text" ? block.text : "";
}

// ── Main export ────────────────────────────────────────────────────────────────

export async function generateOptimalContent(params: GenerateParams): Promise<AIResult> {
  const prompt = buildPrompt(params);

  const callers: Array<{ name: string; fn: () => Promise<string> }> = [
    { name: "ChatGPT (GPT-4o)", fn: () => callOpenAI(prompt) },
    { name: "Google Gemini",    fn: () => callGemini(prompt) },
    { name: "Claude (Haiku)",   fn: () => callClaude(prompt) },
  ];

  // Call all available AIs concurrently
  const results = await Promise.allSettled(callers.map(async (c) => ({
    source: c.name,
    content: await c.fn(),
  })));

  const successful: AIResult[] = results
    .filter((r): r is PromiseFulfilledResult<{ source: string; content: string }> =>
      r.status === "fulfilled" && r.value.content.length > 50
    )
    .map((r) => ({
      ...r.value,
      score: scoreContent(r.value.content, params),
    }));

  if (successful.length === 0) {
    throw new Error("Chưa cấu hình API key AI. Vui lòng thêm OPENAI_API_KEY, GOOGLE_AI_API_KEY hoặc ANTHROPIC_API_KEY vào biến môi trường.");
  }

  // Return highest scored result
  return successful.sort((a, b) => b.score - a.score)[0];
}
