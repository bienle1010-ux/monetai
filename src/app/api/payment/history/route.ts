import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ payments: [] });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ payments: [] });

  const { data, error } = await supabase
    .from("payments")
    .select("id, amount, credits, description, status, paid_at, tid")
    .eq("email", email.toLowerCase())
    .eq("status", "confirmed")
    .order("paid_at", { ascending: false })
    .limit(20);

  if (error || !data) return NextResponse.json({ payments: [] });

  return NextResponse.json({ payments: data });
}
