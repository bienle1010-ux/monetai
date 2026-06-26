import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Blog — MonetAI", template: "%s | MonetAI Blog" },
  description: "Hướng dẫn thực chiến, case study thật, và đánh giá công cụ AI — để bạn biến công nghệ thành thu nhập.",
  openGraph: {
    siteName: "MonetAI Blog",
    locale: "vi_VN",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
