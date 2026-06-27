import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { contentStore, SiteContent } from "@/lib/contentStore";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(contentStore.getAll());
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { type: keyof SiteContent | "reset"; data?: unknown };

  if (body.type === "reset") {
    contentStore.reset();
    return NextResponse.json({ ok: true, message: "Đã reset về mặc định" });
  }

  if (body.type && body.data !== undefined) {
    contentStore.set(body.type as keyof SiteContent, body.data as SiteContent[typeof body.type]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
