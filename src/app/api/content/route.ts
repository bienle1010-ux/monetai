import { NextResponse } from "next/server";
import { contentStore } from "@/lib/contentStore";

// Public endpoint — no auth required
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(contentStore.getAll(), {
    headers: { "Cache-Control": "no-store" },
  });
}
