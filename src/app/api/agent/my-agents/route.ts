import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ agents: [] });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ agents: [] });

  const { data, error } = await supabase
    .from("agent_listings")
    .select(
      "id, agent_name, tagline, category, icon, badge, price, price_type, status, rejection_reason, created_at, total_sales, total_revenue, pending_payout, total_payout"
    )
    .eq("seller_email", email.toLowerCase())
    .order("created_at", { ascending: false });

  if (error || !data) return NextResponse.json({ agents: [] });

  return NextResponse.json({ agents: data });
}
