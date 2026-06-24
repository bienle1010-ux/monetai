import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("affiliate_products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  }

  const body = await req.json();
  const { name, brand, description, category, commission, price, affiliate_link, rating, is_hot, is_active, sort_order } = body;

  if (!name || !brand || !category || !commission || !affiliate_link) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("affiliate_products")
    .insert({ name, brand, description, category, commission, price, affiliate_link, rating: Number(rating) || 4.5, is_hot: !!is_hot, is_active: is_active !== false, sort_order: Number(sort_order) || 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
