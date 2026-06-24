import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Youtube, Linkedin } from "lucide-react";

const footerLinks = {
  "Dịch vụ": [
    { label: "AI Affiliate", href: "/#services" },
    { label: "AI Content", href: "/#services" },
    { label: "AI Video Script", href: "/#services" },
    { label: "AI Agent", href: "/#services" },
    { label: "AI Prompt", href: "/#services" },
    { label: "AI SaaS", href: "/#services" },
  ],
  "Công ty": [
    { label: "Về chúng tôi", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Liên hệ", href: "/contact" },
    { label: "Tuyển dụng", href: "/careers" },
  ],
  "Tài nguyên": [
    { label: "MonetAI Academy", href: "/dashboard/academy" },
    { label: "Bảng giá", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Hỗ trợ", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F] border-t border-[#2A2A3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-xl text-white">
                Monet<span className="text-[#FF6B00]">AI</span>
              </span>
            </Link>
            <p className="text-[#A0A0B0] text-sm leading-relaxed mb-6 max-w-xs">
              Nền tảng AI Commerce hàng đầu giúp cá nhân và doanh nghiệp kiếm tiền từ AI thông qua Affiliate, Marketplace và AI Agents.
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://facebook.com/MonetAI.vn", icon: Facebook, label: "Facebook" },
                { href: "https://youtube.com/@MonetAI", icon: Youtube, label: "YouTube" },
                { href: "https://linkedin.com/company/monetai", icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#16161F] border border-[#2A2A3A] flex items-center justify-center text-[#A0A0B0] hover:text-[#FF6B00] hover:border-[#FF6B00]/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[#A0A0B0] hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#2A2A3A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-[#A0A0B0]">
            <a href="mailto:MonetAI.vn@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              MonetAI.vn@gmail.com
            </a>
            <a href="tel:0562557777" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              0562 557 777
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              25A Hàn Thuyên, Hai Bà Trưng, Hà Nội
            </span>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            © {new Date().getFullYear()} MonetAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
