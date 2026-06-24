import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "MonetAI — Earn More With AI",
  description: "Nền tảng AI Commerce hàng đầu giúp cá nhân và doanh nghiệp kiếm tiền từ AI thông qua AI Tools Marketplace, AI Agent Marketplace và Affiliate Network.",
  keywords: "AI affiliate, kiếm tiền AI, AI marketplace, MonetAI, AI commerce",
  openGraph: {
    title: "MonetAI — Earn More With AI",
    description: "Nền tảng AI Commerce #1 Việt Nam",
    url: "https://www.monetai.vn",
    siteName: "MonetAI",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
