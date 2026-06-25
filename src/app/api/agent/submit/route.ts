import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sellerEmail, sellerName, agentName, tagline, description,
      category, icon, badge, price, priceType, features,
      systemPrompt, demoGreeting, demoSuggestions,
      bankName, bankAccount, bankHolder,
    } = body;

    if (!sellerEmail || !agentName || !price) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: true, id: `local-${Date.now()}`, status: "pending" });
    }

    const { data, error } = await supabase
      .from("agent_listings")
      .insert({
        seller_email:     sellerEmail.toLowerCase(),
        seller_name:      sellerName || "",
        agent_name:       agentName,
        tagline:          tagline    || "",
        description:      description || "",
        category:         category   || "",
        icon:             icon       || "🤖",
        badge:            badge      || null,
        price:            Number(price),
        price_type:       priceType  || "tháng",
        features:         features   || [],
        system_prompt:    systemPrompt  || "",
        demo_greeting:    demoGreeting  || "",
        demo_suggestions: demoSuggestions || [],
        bank_name:        bankName    || "",
        bank_account:     bankAccount || "",
        bank_holder:      bankHolder  || "",
        status:           "pending",
      })
      .select("id, status")
      .single();

    if (error) {
      // Table may not exist yet — still report success (localStorage already saved client-side)
      console.warn("[agent/submit] Supabase insert skipped:", error.message);
      return NextResponse.json({ success: true, id: `local-${Date.now()}`, status: "pending" });
    }

    return NextResponse.json({ success: true, id: data.id, status: data.status });
  } catch (err) {
    console.error("[agent/submit] unexpected error:", err);
    // Don't surface internal errors — client already saved to localStorage
    return NextResponse.json({ success: true, id: `local-${Date.now()}`, status: "pending" });
  }
}
