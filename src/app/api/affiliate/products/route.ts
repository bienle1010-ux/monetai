import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "ChatGPT Plus", brand: "OpenAI", description: "AI chat mạnh nhất thế giới", category: "AI Chat", commission: "30%", price: "20 USD/tháng", affiliate_link: "#", rating: 4.9, is_hot: true, is_active: true, sort_order: 1 },
  { id: 2, name: "Claude Pro", brand: "Anthropic", description: "AI chat thông minh, an toàn", category: "AI Chat", commission: "25%", price: "20 USD/tháng", affiliate_link: "#", rating: 4.8, is_hot: true, is_active: true, sort_order: 2 },
  { id: 3, name: "Midjourney", brand: "Midjourney", description: "AI tạo hình ảnh đẹp nhất", category: "AI Image", commission: "20%", price: "10 USD/tháng", affiliate_link: "#", rating: 4.8, is_hot: true, is_active: true, sort_order: 3 },
  { id: 4, name: "Jasper AI", brand: "Jasper", description: "AI viết content cho Marketing", category: "AI Writing", commission: "40%", price: "49 USD/tháng", affiliate_link: "#", rating: 4.6, is_hot: false, is_active: true, sort_order: 4 },
  { id: 5, name: "Canva Pro", brand: "Canva", description: "Thiết kế chuyên nghiệp với AI", category: "AI Design", commission: "20%", price: "13 USD/tháng", affiliate_link: "#", rating: 4.7, is_hot: false, is_active: true, sort_order: 5 },
  { id: 6, name: "Copy.ai Pro", brand: "Copy.ai", description: "AI viết copy bán hàng", category: "AI Writing", commission: "35%", price: "49 USD/tháng", affiliate_link: "#", rating: 4.5, is_hot: false, is_active: true, sort_order: 6 },
  { id: 7, name: "Notion AI", brand: "Notion", description: "Workspace thông minh với AI", category: "Productivity", commission: "15%", price: "16 USD/tháng", affiliate_link: "#", rating: 4.7, is_hot: false, is_active: true, sort_order: 7 },
  { id: 8, name: "Runway ML", brand: "Runway", description: "AI tạo và chỉnh sửa video", category: "AI Video", commission: "25%", price: "15 USD/tháng", affiliate_link: "#", rating: 4.6, is_hot: true, is_active: true, sort_order: 8 },
];

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("affiliate_products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ products: data });
    }
  }

  return NextResponse.json({ products: DEFAULT_PRODUCTS });
}
