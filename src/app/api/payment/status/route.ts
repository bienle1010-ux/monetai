import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ credits: 0 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ credits: 0 });

  const { data, error } = await supabase
    .from("payments")
    .select("credits")
    .eq("email", email.toLowerCase())
    .eq("status", "confirmed");

  if (error || !data) return NextResponse.json({ credits: 0 });

  const totalCredits = data.reduce((sum, p) => sum + (p.credits ?? 0), 0);
  return NextResponse.json({ credits: totalCredits, payments: data.length });
}
