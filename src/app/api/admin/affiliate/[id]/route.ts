import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  }

  const body = await req.json();
  const { name, brand, description, category, commission, price, affiliate_link, rating, is_hot, is_active, sort_order } = body;

  const { data, error } = await supabase
    .from("affiliate_products")
    .update({ name, brand, description, category, commission, price, affiliate_link, rating: Number(rating), is_hot: !!is_hot, is_active: !!is_active, sort_order: Number(sort_order) })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  }

  const { error } = await supabase.from("affiliate_products").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
