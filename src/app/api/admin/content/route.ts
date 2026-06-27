import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { contentStore, SiteConfig, FAQItem, Testimonial } from "@/lib/contentStore";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    config:       contentStore.getConfig(),
    faqs:         contentStore.getFAQs(),
    testimonials: contentStore.getTestimonials(),
  });
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json() as {
    type: "config" | "faqs" | "testimonials" | "reset";
    data?: SiteConfig | FAQItem[] | Testimonial[];
  };

  if (body.type === "reset") {
    contentStore.reset();
    return NextResponse.json({ ok: true, message: "Đã reset về nội dung mặc định" });
  }

  if (body.type === "config" && body.data) {
    contentStore.setConfig(body.data as SiteConfig);
    return NextResponse.json({ ok: true });
  }
  if (body.type === "faqs" && body.data) {
    contentStore.setFAQs(body.data as FAQItem[]);
    return NextResponse.json({ ok: true });
  }
  if (body.type === "testimonials" && body.data) {
    contentStore.setTestimonials(body.data as Testimonial[]);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
