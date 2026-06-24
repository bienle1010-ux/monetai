import { NextRequest } from "next/server";

export function verifyAdminToken(req: NextRequest): boolean {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return token === secret;
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@monetai.vn",
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.ADMIN_SECRET,
  };
}
