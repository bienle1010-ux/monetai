export interface Lesson {
  id: string;
  title: string;
  durationMin: number;
  free: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: "AI Affiliate" | "AI Marketing" | "AI Business" | "AI Automation" | "AI Agent";
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  emoji: string;
  price: number;               // 0 = free
  durationHours: number;
  totalLessons: number;
  students: number;
  rating: number;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  badge?: "MỚI" | "HOT" | "BÁN CHẠY";
  tags: string[];
  whatYouLearn: string[];
  requirements: string[];
  curriculum: CourseModule[];
}

export const CATEGORIES = ["Tất cả", "AI Affiliate", "AI Marketing", "AI Business", "AI Automation", "AI Agent"] as const;

export const courses: CourseData[] = [
  // ─── AI Affiliate ──────────────────────────────────────────────────────────
  {
    id: "aff-01",
    title: "AI Affiliate Marketing Từ Zero",
    description: "Học cách kiếm tiền từ Affiliate Marketing với AI — từ chọn sản phẩm đến tạo nội dung và nhận hoa hồng tự động.",
    longDescription: "Khóa học hoàn chỉnh dành cho người mới bắt đầu muốn kiếm tiền thụ động qua Affiliate Marketing kết hợp AI. Bạn sẽ học từ A-Z: cách tìm sản phẩm có hoa hồng cao, tạo nội dung thu hút với AI, xây dựng kênh phân phối và tự động hóa toàn bộ quy trình.",
    category: "AI Affiliate",
    instructor: "Nguyễn Minh Tuấn",
    instructorTitle: "Founder MonetAI Academy · 5 năm kinh nghiệm Affiliate",
    instructorAvatar: "👨‍💼",
    emoji: "📚",
    price: 0,
    durationHours: 4.5,
    totalLessons: 24,
    students: 3420,
    rating: 4.9,
    level: "Cơ bản",
    badge: "HOT",
    tags: ["Affiliate", "Beginner", "AI Content", "Hoa hồng"],
    whatYouLearn: [
      "Hiểu nguyên lý Affiliate Marketing trong hệ sinh thái AI",
      "Tìm và đánh giá sản phẩm AI có hoa hồng cao",
      "Dùng ChatGPT & Claude tạo nội dung bán hàng",
      "Xây dựng kênh phân phối trên Facebook, TikTok",
      "Theo dõi và tối ưu hoa hồng hàng tháng",
    ],
    requirements: ["Không cần kỹ năng kỹ thuật", "Có smartphone hoặc laptop", "Tài khoản ChatGPT (free)"],
    curriculum: [
      {
        id: "aff-01-m1",
        title: "Tổng quan Affiliate Marketing với AI",
        lessons: [
          { id: "l1", title: "Affiliate Marketing là gì và tại sao AI thay đổi cuộc chơi", durationMin: 12, free: true },
          { id: "l2", title: "Hệ sinh thái MonetAI: Marketplace, Publisher, Hoa hồng", durationMin: 15, free: true },
          { id: "l3", title: "Các mô hình kiếm tiền: CPA, CPS, CPL, Rev-share", durationMin: 10, free: true },
          { id: "l4", title: "Case study: 50 triệu/tháng từ AI Affiliate", durationMin: 18, free: false },
        ],
      },
      {
        id: "aff-01-m2",
        title: "Chọn sản phẩm AI để quảng bá",
        lessons: [
          { id: "l5", title: "Framework 5 tiêu chí chọn sản phẩm AI tốt", durationMin: 14, free: false },
          { id: "l6", title: "Top 20 AI Tool hoa hồng cao nhất trên MonetAI", durationMin: 20, free: false },
          { id: "l7", title: "Cách lấy link Affiliate và track chuyển đổi", durationMin: 12, free: false },
          { id: "l8", title: "Bài tập: Chọn 3 sản phẩm AI phù hợp với kênh của bạn", durationMin: 8, free: false },
        ],
      },
      {
        id: "aff-01-m3",
        title: "Tạo nội dung bán hàng với AI",
        lessons: [
          { id: "l9", title: "Prompt Engineering cơ bản cho Affiliate Content", durationMin: 16, free: false },
          { id: "l10", title: "Tạo 10 bài Facebook chỉ trong 20 phút với ChatGPT", durationMin: 22, free: false },
          { id: "l11", title: "Kịch bản TikTok: Hook → Problem → Solution → CTA", durationMin: 18, free: false },
          { id: "l12", title: "Email sequence: nurture → convert với AI", durationMin: 14, free: false },
          { id: "l13", title: "Tối ưu CTA và landing page bằng AI", durationMin: 10, free: false },
        ],
      },
      {
        id: "aff-01-m4",
        title: "Scale và tự động hóa",
        lessons: [
          { id: "l14", title: "Lịch đăng bài tự động: Buffer, Meta Business Suite", durationMin: 12, free: false },
          { id: "l15", title: "Dashboard theo dõi hoa hồng và tối ưu ROI", durationMin: 15, free: false },
          { id: "l16", title: "A/B test nội dung để tăng conversion rate", durationMin: 10, free: false },
          { id: "l17", title: "Tổng kết: Lộ trình 30 ngày đầu tiên", durationMin: 8, free: false },
        ],
      },
    ],
  },

  {
    id: "aff-02",
    title: "Tối Ưu Affiliate Với ChatGPT & Claude",
    description: "Khai thác tối đa 2 AI mạnh nhất để tạo nội dung Affiliate vượt trội, tăng gấp 3 lần tỷ lệ chuyển đổi.",
    longDescription: "Khóa học chuyên sâu về cách kết hợp ChatGPT và Claude để tạo ra nội dung Affiliate có tỷ lệ chuyển đổi cao nhất. Học các prompt template độc quyền, kỹ thuật A/B testing với AI và chiến lược scale từ 0 đến 100 triệu/tháng.",
    category: "AI Affiliate",
    instructor: "Trần Thị Bích Ngọc",
    instructorTitle: "AI Marketing Expert · 300% conversion rate increase",
    instructorAvatar: "👩‍💻",
    emoji: "🚀",
    price: 299000,
    durationHours: 6,
    totalLessons: 32,
    students: 1870,
    rating: 4.8,
    level: "Trung cấp",
    badge: "BÁN CHẠY",
    tags: ["ChatGPT", "Claude", "Conversion", "Prompt"],
    whatYouLearn: [
      "Prompt framework độc quyền cho Affiliate Content",
      "So sánh và kết hợp ChatGPT vs Claude hiệu quả",
      "Tăng CTR Facebook Ads lên 300% với AI copywriting",
      "Xây dựng Swipe File nội dung Affiliate bằng AI",
      "Tự động hóa quy trình tạo nội dung hàng loạt",
    ],
    requirements: ["Đã có tài khoản ChatGPT và Claude", "Biết cơ bản về Affiliate Marketing", "Đã chạy ít nhất 1 chiến dịch Affiliate"],
    curriculum: [
      {
        id: "aff-02-m1",
        title: "ChatGPT cho Affiliate Content",
        lessons: [
          { id: "l1", title: "ChatGPT-4 vs GPT-3.5: Khi nào dùng cái nào", durationMin: 15, free: true },
          { id: "l2", title: "100 Prompt Template cho Affiliate Marketing", durationMin: 25, free: false },
          { id: "l3", title: "Custom Instructions: Biến ChatGPT thành copywriter của bạn", durationMin: 18, free: false },
          { id: "l4", title: "GPT Actions: Tích hợp data thực từ MonetAI vào ChatGPT", durationMin: 20, free: false },
        ],
      },
      {
        id: "aff-02-m2",
        title: "Claude cho Research & Analysis",
        lessons: [
          { id: "l5", title: "Claude Artifacts: Tạo landing page bằng AI trong 5 phút", durationMin: 22, free: false },
          { id: "l6", title: "Research competitor với Claude trong 10 phút", durationMin: 16, free: false },
          { id: "l7", title: "Phân tích sản phẩm AI để viết review sâu", durationMin: 18, free: false },
        ],
      },
      {
        id: "aff-02-m3",
        title: "Tối ưu Conversion Rate",
        lessons: [
          { id: "l8", title: "Công thức AIDA và PAS với AI", durationMin: 14, free: false },
          { id: "l9", title: "A/B test headline và CTA bằng AI", durationMin: 20, free: false },
          { id: "l10", title: "Social proof automation: review, testimonial với AI", durationMin: 15, free: false },
          { id: "l11", title: "Email sequence 7 ngày tự động tạo bằng AI", durationMin: 18, free: false },
        ],
      },
    ],
  },

  {
    id: "aff-03",
    title: "TikTok Affiliate AI Master",
    description: "Bí quyết tạo video TikTok bán hàng AI viral với kịch bản tự động, tiếp cận hàng triệu người xem.",
    longDescription: "TikTok là kênh Affiliate hiệu quả nhất 2024-2025. Khóa học này dạy bạn cách dùng AI để tạo kịch bản viral, tối ưu hashtag, lên lịch đăng và theo dõi performance — tất cả tự động hóa với AI.",
    category: "AI Affiliate",
    instructor: "Lê Văn Khoa",
    instructorTitle: "TikTok Creator 500K followers · Affiliate Top 10 MonetAI",
    instructorAvatar: "🎬",
    emoji: "🎵",
    price: 199000,
    durationHours: 3.5,
    totalLessons: 20,
    students: 2341,
    rating: 4.7,
    level: "Cơ bản",
    badge: "MỚI",
    tags: ["TikTok", "Video", "Viral", "Kịch bản AI"],
    whatYouLearn: [
      "Công thức video TikTok bán hàng 15-60 giây",
      "Tạo kịch bản viral với AI trong 2 phút",
      "Tối ưu hashtag và SEO TikTok bằng AI",
      "Lên lịch đăng và theo dõi analytics tự động",
      "Chuyển hóa view thành đơn hàng Affiliate",
    ],
    requirements: ["Tài khoản TikTok", "Smartphone có camera", "Tài khoản ChatGPT"],
    curriculum: [
      {
        id: "aff-03-m1",
        title: "Cơ bản TikTok Affiliate",
        lessons: [
          { id: "l1", title: "TikTok Shop Affiliate vs Standard Affiliate: So sánh", durationMin: 12, free: true },
          { id: "l2", title: "Phân tích tài khoản TikTok Affiliate top 10 VN", durationMin: 18, free: false },
          { id: "l3", title: "Setup tài khoản TikTok Business cho Affiliate", durationMin: 10, free: false },
        ],
      },
      {
        id: "aff-03-m2",
        title: "Tạo kịch bản video với AI",
        lessons: [
          { id: "l4", title: "Công thức Hook 3 giây thu hút 90% người xem dừng lại", durationMin: 15, free: false },
          { id: "l5", title: "Prompt tạo kịch bản TikTok bán hàng AI", durationMin: 20, free: false },
          { id: "l6", title: "AI Voice & Subtitle: Tạo video không cần lộ mặt", durationMin: 14, free: false },
          { id: "l7", title: "10 format video Affiliate ăn khách nhất", durationMin: 16, free: false },
        ],
      },
      {
        id: "aff-03-m3",
        title: "Tối ưu và Scale",
        lessons: [
          { id: "l8", title: "Hashtag strategy cho AI Affiliate content", durationMin: 12, free: false },
          { id: "l9", title: "Lịch đăng 30 video/tháng tự động với AI", durationMin: 15, free: false },
          { id: "l10", title: "Phân tích video viral: tại sao và cách copy", durationMin: 14, free: false },
        ],
      },
    ],
  },

  // ─── AI Marketing ──────────────────────────────────────────────────────────
  {
    id: "mkt-01",
    title: "AI Content Marketing Master",
    description: "Nắm vững kỹ thuật tạo nội dung bán hàng với AI trên mọi nền tảng: Facebook, TikTok, YouTube, Email.",
    longDescription: "Khóa học toàn diện về AI Content Marketing cho người muốn làm chủ game content trong kỷ nguyên AI. Từ strategy đến execution, từ text đến video, từ organic đến paid — bạn sẽ biết cách dùng AI để tạo ra nội dung vượt trội với 1/10 thời gian thông thường.",
    category: "AI Marketing",
    instructor: "Phạm Thị Lan Anh",
    instructorTitle: "Head of Content MonetAI · Ex-VCCorp Content Lead",
    instructorAvatar: "👩‍🎨",
    emoji: "🎯",
    price: 299000,
    durationHours: 6.5,
    totalLessons: 38,
    students: 2187,
    rating: 4.8,
    level: "Trung cấp",
    badge: "HOT",
    tags: ["Content", "Facebook", "TikTok", "YouTube", "Email"],
    whatYouLearn: [
      "Xây dựng Content Strategy với AI",
      "Tạo 100 bài viết/tháng với AI trong 10 giờ",
      "Video script automation cho TikTok và YouTube",
      "Email Marketing sequence tự động với AI",
      "SEO content tối ưu thuật toán Google",
    ],
    requirements: ["Biết dùng Facebook và TikTok", "Hiểu cơ bản về marketing", "Tài khoản ChatGPT hoặc Claude"],
    curriculum: [
      {
        id: "mkt-01-m1",
        title: "AI Content Strategy",
        lessons: [
          { id: "l1", title: "Content Marketing trong kỷ nguyên AI: Xu hướng 2025", durationMin: 18, free: true },
          { id: "l2", title: "Research đối thủ và thị trường với AI", durationMin: 22, free: false },
          { id: "l3", title: "Buyer Persona và Content Matrix bằng AI", durationMin: 16, free: false },
          { id: "l4", title: "Content Calendar 30 ngày tự động với AI", durationMin: 14, free: false },
        ],
      },
      {
        id: "mkt-01-m2",
        title: "Facebook Content với AI",
        lessons: [
          { id: "l5", title: "10 loại bài viết Facebook bán hàng hiệu quả nhất", durationMin: 20, free: false },
          { id: "l6", title: "AI tạo storytelling post 3 phút", durationMin: 18, free: false },
          { id: "l7", title: "Facebook Ads copy: Headline, Description, CTA với AI", durationMin: 22, free: false },
          { id: "l8", title: "Carousel và Collection Ads content tự động", durationMin: 15, free: false },
        ],
      },
      {
        id: "mkt-01-m3",
        title: "Video Content với AI",
        lessons: [
          { id: "l9", title: "TikTok script framework: Hook → Body → CTA", durationMin: 16, free: false },
          { id: "l10", title: "YouTube Shorts vs Long-form: Strategy và AI automation", durationMin: 20, free: false },
          { id: "l11", title: "Reels và Stories: Các định dạng và script", durationMin: 14, free: false },
        ],
      },
      {
        id: "mkt-01-m4",
        title: "Email & SEO với AI",
        lessons: [
          { id: "l12", title: "Email Marketing sequence 7 ngày tự tạo bằng AI", durationMin: 18, free: false },
          { id: "l13", title: "Subject line A/B test với AI prediction", durationMin: 12, free: false },
          { id: "l14", title: "SEO article: Research → Outline → Write với AI", durationMin: 25, free: false },
          { id: "l15", title: "Internal linking strategy tự động với AI", durationMin: 10, free: false },
        ],
      },
    ],
  },

  {
    id: "mkt-02",
    title: "AI SEO & Google Ads Mastery",
    description: "Làm chủ SEO và Google Ads với sức mạnh AI — tăng organic traffic 10 lần và giảm CPA 50%.",
    longDescription: "Khóa học chuyên sâu kết hợp SEO kỹ thuật với AI và Google Ads optimization thông minh. Từ keyword research đến on-page optimization, từ bidding strategy đến ad copy — tất cả được tự động hóa và tối ưu với AI.",
    category: "AI Marketing",
    instructor: "Hoàng Đức Anh",
    instructorTitle: "SEO Lead MonetAI · 10 năm SEO & Google Ads",
    instructorAvatar: "🔍",
    emoji: "📈",
    price: 399000,
    durationHours: 7,
    totalLessons: 40,
    students: 1243,
    rating: 4.7,
    level: "Trung cấp",
    tags: ["SEO", "Google Ads", "Keyword Research", "CPA"],
    whatYouLearn: [
      "Keyword research scale với AI tools",
      "On-page SEO tối ưu hàng loạt với AI",
      "Chiến lược backlink thông minh với AI",
      "Google Ads Smart Bidding và AI optimization",
      "Phân tích cạnh tranh và cơ hội với AI",
    ],
    requirements: ["Đã có website hoặc blog", "Hiểu cơ bản về SEO", "Google Ads account (optional)"],
    curriculum: [
      {
        id: "mkt-02-m1",
        title: "AI Keyword Research",
        lessons: [
          { id: "l1", title: "Keyword Research với ChatGPT + SEMrush + Ahrefs", durationMin: 25, free: true },
          { id: "l2", title: "Tìm topic cluster và content gaps với AI", durationMin: 20, free: false },
          { id: "l3", title: "Phân tích search intent bằng AI", durationMin: 15, free: false },
        ],
      },
      {
        id: "mkt-02-m2",
        title: "On-Page SEO với AI",
        lessons: [
          { id: "l4", title: "Tối ưu title, meta, H1-H6 hàng loạt với AI", durationMin: 18, free: false },
          { id: "l5", title: "Schema markup tự động với AI", durationMin: 14, free: false },
          { id: "l6", title: "Internal linking map với AI", durationMin: 12, free: false },
          { id: "l7", title: "Core Web Vitals: Phân tích và fix với AI assistant", durationMin: 16, free: false },
        ],
      },
      {
        id: "mkt-02-m3",
        title: "Google Ads với AI",
        lessons: [
          { id: "l8", title: "Performance Max campaigns: AI bidding strategies", durationMin: 22, free: false },
          { id: "l9", title: "Responsive Search Ads: AI asset optimization", durationMin: 18, free: false },
          { id: "l10", title: "Audience targeting với Google AI", durationMin: 15, free: false },
          { id: "l11", title: "Phân tích campaign với AI và tối ưu ROAS", durationMin: 20, free: false },
        ],
      },
    ],
  },

  {
    id: "mkt-03",
    title: "Facebook & Meta Ads với AI",
    description: "Tạo và tối ưu chiến dịch Facebook Ads với AI — từ creative đến targeting đến scale ngân sách.",
    longDescription: "Hướng dẫn toàn diện về Facebook & Meta Ads sử dụng sức mạnh AI. Học cách tạo creative bằng AI, tối ưu audience targeting thông minh, phân tích performance và scale chiến dịch một cách an toàn.",
    category: "AI Marketing",
    instructor: "Vũ Thị Mai",
    instructorTitle: "Meta Ads Specialist · 50+ triệu/tháng ROAS",
    instructorAvatar: "📱",
    emoji: "💙",
    price: 349000,
    durationHours: 5.5,
    totalLessons: 30,
    students: 1876,
    rating: 4.6,
    level: "Trung cấp",
    badge: "MỚI",
    tags: ["Facebook Ads", "Meta", "Creative", "Targeting"],
    whatYouLearn: [
      "Tạo ad creative với AI (text + image)",
      "Audience research và targeting với AI",
      "Campaign structure tối ưu 2025",
      "Scale ngân sách an toàn với AI insights",
      "Phân tích và tối ưu ROAS với AI dashboard",
    ],
    requirements: ["Tài khoản Facebook Business Manager", "Ngân sách chạy ads tối thiểu 500k/ngày", "Có sản phẩm/dịch vụ để quảng bá"],
    curriculum: [
      {
        id: "mkt-03-m1",
        title: "Meta Ads Foundation",
        lessons: [
          { id: "l1", title: "Cấu trúc Campaign → Ad Set → Ad tối ưu 2025", durationMin: 20, free: true },
          { id: "l2", title: "Pixel setup và Conversion API với AI troubleshoot", durationMin: 18, free: false },
          { id: "l3", title: "Advantage+ Shopping vs Manual Targeting", durationMin: 15, free: false },
        ],
      },
      {
        id: "mkt-03-m2",
        title: "AI Creative Production",
        lessons: [
          { id: "l4", title: "Tạo Ad Copy với ChatGPT: Hook, Description, CTA", durationMin: 22, free: false },
          { id: "l5", title: "Image creative với Midjourney và Canva AI", durationMin: 20, free: false },
          { id: "l6", title: "Video creative script và production với AI", durationMin: 18, free: false },
          { id: "l7", title: "A/B testing creative với AI prediction", durationMin: 14, free: false },
        ],
      },
      {
        id: "mkt-03-m3",
        title: "Optimization & Scale",
        lessons: [
          { id: "l8", title: "Đọc hiểu Meta Ads Manager với AI insight", durationMin: 16, free: false },
          { id: "l9", title: "Quy trình scale ngân sách an toàn x2, x3, x5", durationMin: 20, free: false },
          { id: "l10", title: "Retargeting và remarketing thông minh với AI", durationMin: 15, free: false },
        ],
      },
    ],
  },

  // ─── AI Business ───────────────────────────────────────────────────────────
  {
    id: "biz-01",
    title: "Khởi Nghiệp AI Commerce",
    description: "Xây dựng doanh nghiệp AI từ ý tưởng đến doanh thu đầu tiên trong 90 ngày với MonetAI ecosystem.",
    longDescription: "Khóa học thực chiến cho người muốn khởi nghiệp trong lĩnh vực AI Commerce. Bạn sẽ học cách xác định cơ hội, xây dựng MVP bằng no-code AI tools, tìm khách hàng đầu tiên và scale doanh thu với hệ sinh thái MonetAI.",
    category: "AI Business",
    instructor: "Đinh Anh Tuấn",
    instructorTitle: "Co-founder MonetAI · Serial Entrepreneur",
    instructorAvatar: "💼",
    emoji: "🚀",
    price: 499000,
    durationHours: 8,
    totalLessons: 42,
    students: 987,
    rating: 4.9,
    level: "Nâng cao",
    badge: "HOT",
    tags: ["Startup", "AI Business", "MVP", "90 ngày"],
    whatYouLearn: [
      "Phân tích cơ hội kinh doanh AI với framework độc quyền",
      "Xây dựng MVP với no-code AI tools trong 2 tuần",
      "Tìm và thu hút 100 khách hàng đầu tiên",
      "Pricing strategy cho AI products và services",
      "Scale từ 0 đến 100 triệu doanh thu/tháng",
    ],
    requirements: ["Có ý tưởng kinh doanh hoặc muốn tìm ý tưởng", "Sẵn sàng đầu tư 10-20 giờ/tuần", "Có vốn khởi nghiệp tối thiểu 5 triệu"],
    curriculum: [
      {
        id: "biz-01-m1",
        title: "Cơ hội trong AI Commerce",
        lessons: [
          { id: "l1", title: "Thị trường AI 2025: 200 tỷ USD và cơ hội cho bạn", durationMin: 20, free: true },
          { id: "l2", title: "5 mô hình kinh doanh AI thành công nhất VN", durationMin: 25, free: false },
          { id: "l3", title: "Phân tích cơ hội với AI Market Research Tool", durationMin: 18, free: false },
          { id: "l4", title: "Chọn niche AI phù hợp với bạn", durationMin: 14, free: false },
        ],
      },
      {
        id: "biz-01-m2",
        title: "Xây dựng MVP",
        lessons: [
          { id: "l5", title: "No-code AI tools: Bubble, Webflow, Zapier, Make", durationMin: 22, free: false },
          { id: "l6", title: "Build AI Chatbot kinh doanh trong 1 buổi", durationMin: 30, free: false },
          { id: "l7", title: "Landing page bằng AI: từ ý tưởng đến live trong 2 giờ", durationMin: 20, free: false },
          { id: "l8", title: "Validate MVP với 50 người dùng đầu tiên", durationMin: 16, free: false },
        ],
      },
      {
        id: "biz-01-m3",
        title: "Kinh doanh và Scale",
        lessons: [
          { id: "l9", title: "Pricing psychology cho AI products", durationMin: 18, free: false },
          { id: "l10", title: "Sales funnel tự động với AI", durationMin: 22, free: false },
          { id: "l11", title: "Affiliate và Partnership: Grow với MonetAI Network", durationMin: 15, free: false },
          { id: "l12", title: "90-Day Roadmap: 0 → 100 triệu doanh thu", durationMin: 20, free: false },
        ],
      },
    ],
  },

  {
    id: "biz-02",
    title: "AI Business Model Canvas",
    description: "Thiết kế mô hình kinh doanh AI hoàn chỉnh từ Value Proposition đến Revenue Streams.",
    longDescription: "Áp dụng Business Model Canvas vào lĩnh vực AI. Khóa học miễn phí giúp bạn tư duy rõ về sản phẩm AI, khách hàng mục tiêu, kênh phân phối và cách tạo ra doanh thu bền vững.",
    category: "AI Business",
    instructor: "Nguyễn Thị Hoa",
    instructorTitle: "Business Strategy Advisor · MBA Đại học Kinh tế",
    instructorAvatar: "📊",
    emoji: "💡",
    price: 0,
    durationHours: 2,
    totalLessons: 12,
    students: 4521,
    rating: 4.6,
    level: "Cơ bản",
    tags: ["Business Model", "Strategy", "Canvas", "Miễn phí"],
    whatYouLearn: [
      "9 khối Business Model Canvas áp dụng cho AI",
      "Xác định Value Proposition độc đáo cho AI product",
      "Phân tích Customer Segments trong thị trường AI",
      "Thiết kế Revenue Streams đa dạng",
      "Phân tích điểm mạnh và rủi ro mô hình AI",
    ],
    requirements: ["Không cần kiến thức nền", "Có ý tưởng về sản phẩm hoặc dịch vụ AI"],
    curriculum: [
      {
        id: "biz-02-m1",
        title: "Business Model Canvas Cơ Bản",
        lessons: [
          { id: "l1", title: "Business Model Canvas là gì và tại sao quan trọng", durationMin: 12, free: true },
          { id: "l2", title: "Value Proposition cho AI products", durationMin: 15, free: true },
          { id: "l3", title: "Customer Segments trong thị trường AI Việt Nam", durationMin: 12, free: true },
          { id: "l4", title: "Channels và Customer Relationships với AI", durationMin: 10, free: true },
        ],
      },
      {
        id: "biz-02-m2",
        title: "Revenue và Kinh Doanh",
        lessons: [
          { id: "l5", title: "Revenue Streams: Subscription, One-time, Freemium, Affiliate", durationMin: 14, free: true },
          { id: "l6", title: "Key Resources và Key Activities của AI Business", durationMin: 12, free: true },
          { id: "l7", title: "Cost Structure và Unit Economics", durationMin: 10, free: true },
          { id: "l8", title: "Case Study: MonetAI Business Model", durationMin: 18, free: true },
        ],
      },
    ],
  },

  // ─── AI Automation ─────────────────────────────────────────────────────────
  {
    id: "auto-01",
    title: "AI Business Automation Toàn Diện",
    description: "Tự động hóa toàn bộ quy trình kinh doanh với AI — Chatbot, Email, CRM và phễu bán hàng tự động.",
    longDescription: "Khóa học thực chiến về Business Automation với AI. Từ chatbot bán hàng đến email marketing tự động, từ CRM management đến analytics — bạn sẽ xây dựng hệ thống chạy 24/7 không cần con người can thiệp.",
    category: "AI Automation",
    instructor: "Bùi Thanh Tùng",
    instructorTitle: "Automation Expert · Đã tự động hóa 200+ doanh nghiệp",
    instructorAvatar: "⚡",
    emoji: "🤖",
    price: 399000,
    durationHours: 5.5,
    totalLessons: 32,
    students: 1654,
    rating: 4.8,
    level: "Trung cấp",
    badge: "BÁN CHẠY",
    tags: ["Chatbot", "Email Automation", "CRM", "Zapier", "Make"],
    whatYouLearn: [
      "Xây dựng chatbot bán hàng 24/7 bằng AI",
      "Email automation sequence tự động",
      "CRM tự động: Lead scoring, nurture, close",
      "Kết nối 1000+ apps với Zapier và Make",
      "Analytics dashboard tự động theo dõi KPI",
    ],
    requirements: ["Có website hoặc fanpage kinh doanh", "Tài khoản email marketing (Mailchimp/ActiveCampaign)", "Budget tool 200-500k/tháng"],
    curriculum: [
      {
        id: "auto-01-m1",
        title: "Nền Tảng AI Automation",
        lessons: [
          { id: "l1", title: "Automation landscape: Zapier, Make, n8n, MonetAI Builder", durationMin: 18, free: true },
          { id: "l2", title: "Mapping quy trình kinh doanh để tự động hóa", durationMin: 15, free: false },
          { id: "l3", title: "ROI calculation cho automation", durationMin: 10, free: false },
        ],
      },
      {
        id: "auto-01-m2",
        title: "Chatbot Bán Hàng",
        lessons: [
          { id: "l4", title: "Build chatbot Facebook Messenger với AI trong 1 giờ", durationMin: 30, free: false },
          { id: "l5", title: "WhatsApp Business chatbot tự động", durationMin: 25, free: false },
          { id: "l6", title: "Zalo OA chatbot cho thị trường VN", durationMin: 22, free: false },
          { id: "l7", title: "Chatbot FAQ và escalation đến nhân viên", durationMin: 16, free: false },
        ],
      },
      {
        id: "auto-01-m3",
        title: "Email & CRM Automation",
        lessons: [
          { id: "l8", title: "Lead capture và welcome sequence tự động", durationMin: 20, free: false },
          { id: "l9", title: "Lead scoring: Phân loại khách hàng với AI", durationMin: 18, free: false },
          { id: "l10", title: "CRM workflow: Từ lead đến deal closed", durationMin: 22, free: false },
          { id: "l11", title: "Re-engagement campaign cho cold leads", durationMin: 14, free: false },
        ],
      },
    ],
  },

  {
    id: "auto-02",
    title: "No-Code AI Workflow Builder",
    description: "Xây dựng workflow tự động mạnh mẽ không cần code — Make, Zapier, n8n và MonetAI Builder.",
    longDescription: "Khóa học thực hành về no-code automation với AI. Bạn sẽ tự tay xây dựng 20+ workflow thực tế từ kết nối API đến xử lý dữ liệu, từ trigger sự kiện đến hành động tự động.",
    category: "AI Automation",
    instructor: "Trần Quang Minh",
    instructorTitle: "No-Code Specialist · Make & Zapier Expert",
    instructorAvatar: "🔧",
    emoji: "⚙️",
    price: 299000,
    durationHours: 4,
    totalLessons: 24,
    students: 1120,
    rating: 4.7,
    level: "Cơ bản",
    tags: ["No-Code", "Make", "Zapier", "n8n", "Workflow"],
    whatYouLearn: [
      "Xây dựng 20+ workflow tự động từ đầu",
      "Kết nối Google Sheets, Gmail, Slack, Notion tự động",
      "Xử lý data và transform với AI trong workflow",
      "Error handling và monitoring workflow",
      "Deploy và maintain workflow chi phí thấp",
    ],
    requirements: ["Không cần biết code", "Tài khoản Make hoặc Zapier (free tier đủ để học)", "Google account"],
    curriculum: [
      {
        id: "auto-02-m1",
        title: "Make (Integromat) Cơ Bản",
        lessons: [
          { id: "l1", title: "Make UI, modules và connections", durationMin: 20, free: true },
          { id: "l2", title: "Trigger: Webhook, Schedule, Watch", durationMin: 15, free: false },
          { id: "l3", title: "Filters, Routers và Error handlers", durationMin: 18, free: false },
          { id: "l4", title: "Build: Form → Sheet → Email notification tự động", durationMin: 25, free: false },
        ],
      },
      {
        id: "auto-02-m2",
        title: "AI trong Workflow",
        lessons: [
          { id: "l5", title: "OpenAI module: Tích hợp ChatGPT vào workflow", durationMin: 22, free: false },
          { id: "l6", title: "AI content moderation và classification", durationMin: 16, free: false },
          { id: "l7", title: "Sentiment analysis tự động cho review và feedback", durationMin: 14, free: false },
        ],
      },
      {
        id: "auto-02-m3",
        title: "20 Workflow Thực Chiến",
        lessons: [
          { id: "l8", title: "Workflow 1-5: Social media automation", durationMin: 30, free: false },
          { id: "l9", title: "Workflow 6-10: E-commerce và order management", durationMin: 28, free: false },
          { id: "l10", title: "Workflow 11-20: Marketing và CRM automation", durationMin: 35, free: false },
        ],
      },
    ],
  },

  // ─── AI Agent ──────────────────────────────────────────────────────────────
  {
    id: "agent-01",
    title: "Xây Dựng AI Agent Business",
    description: "Phát triển và kinh doanh AI Agent — Tạo, đóng gói và bán AI Agent trên MonetAI Marketplace.",
    longDescription: "Khóa học cao cấp dành cho ai muốn xây dựng kinh doanh từ AI Agent. Từ thiết kế agent đến training, từ packaging đến marketing và bán hàng trên MonetAI Marketplace với hệ thống doanh thu thụ động.",
    category: "AI Agent",
    instructor: "Lê Hoàng Nam",
    instructorTitle: "AI Agent Developer · Top Seller MonetAI Marketplace",
    instructorAvatar: "🤖",
    emoji: "🤖",
    price: 799000,
    durationHours: 8,
    totalLessons: 45,
    students: 432,
    rating: 4.9,
    level: "Nâng cao",
    badge: "HOT",
    tags: ["AI Agent", "Business", "Marketplace", "Doanh thu thụ động"],
    whatYouLearn: [
      "Thiết kế AI Agent từ requirement đến architecture",
      "Prompt engineering nâng cao cho AI Agent",
      "Đóng gói và định giá AI Agent",
      "Marketing AI Agent trên MonetAI Marketplace",
      "Hệ thống doanh thu thụ động từ AI Agent",
    ],
    requirements: ["Đã biết prompt engineering cơ bản", "Có tài khoản Claude hoặc ChatGPT API", "Có ý tưởng về AI Agent muốn xây dựng"],
    curriculum: [
      {
        id: "agent-01-m1",
        title: "Thiết Kế AI Agent",
        lessons: [
          { id: "l1", title: "AI Agent là gì: Anatomy, Tools, Memory, Planning", durationMin: 25, free: true },
          { id: "l2", title: "Phân loại Agent: Task, Role, Workflow, Multi-agent", durationMin: 20, free: false },
          { id: "l3", title: "Use case analysis: 50 AI Agent thành công trên MonetAI", durationMin: 22, free: false },
          { id: "l4", title: "Design Document cho AI Agent", durationMin: 18, free: false },
        ],
      },
      {
        id: "agent-01-m2",
        title: "Xây Dựng Agent",
        lessons: [
          { id: "l5", title: "System prompt engineering cho AI Agent chuyên nghiệp", durationMin: 30, free: false },
          { id: "l6", title: "Tool integration: Search, Calculator, Database", durationMin: 25, free: false },
          { id: "l7", title: "Memory và context management", durationMin: 20, free: false },
          { id: "l8", title: "Testing và evaluation AI Agent quality", durationMin: 18, free: false },
          { id: "l9", title: "Iterative improvement dựa trên user feedback", durationMin: 15, free: false },
        ],
      },
      {
        id: "agent-01-m3",
        title: "Kinh Doanh AI Agent",
        lessons: [
          { id: "l10", title: "Packaging: Giao diện, tài liệu, demo video", durationMin: 22, free: false },
          { id: "l11", title: "Pricing strategy: One-time, Subscription, Usage-based", durationMin: 18, free: false },
          { id: "l12", title: "Listing trên MonetAI Marketplace: SEO cho Agent", durationMin: 16, free: false },
          { id: "l13", title: "Marketing Agent: Review, demo, case study", durationMin: 20, free: false },
          { id: "l14", title: "Scale: Multiple Agents và passive income system", durationMin: 22, free: false },
        ],
      },
    ],
  },

  {
    id: "agent-02",
    title: "Prompt Engineering Professional",
    description: "Làm chủ nghệ thuật viết Prompt cho ChatGPT, Claude, Gemini — từ cơ bản đến nâng cao.",
    longDescription: "Kỹ năng prompt engineering là nền tảng của mọi AI ứng dụng. Khóa học này đưa bạn từ người dùng AI bình thường trở thành Prompt Engineer chuyên nghiệp, có thể khai thác 100% tiềm năng của các AI model.",
    category: "AI Agent",
    instructor: "Đặng Thị Phương",
    instructorTitle: "Prompt Engineering Lead · AI Researcher",
    instructorAvatar: "✍️",
    emoji: "✍️",
    price: 299000,
    durationHours: 5,
    totalLessons: 28,
    students: 2890,
    rating: 4.8,
    level: "Trung cấp",
    badge: "BÁN CHẠY",
    tags: ["Prompt Engineering", "ChatGPT", "Claude", "Gemini"],
    whatYouLearn: [
      "10 kỹ thuật prompt nâng cao: CoT, Few-shot, ReAct",
      "Prompt cho từng AI: ChatGPT vs Claude vs Gemini",
      "System prompts cho AI Agent và chatbot",
      "Prompt optimization và iterative improvement",
      "Xây dựng Prompt Library kinh doanh",
    ],
    requirements: ["Đã dùng ChatGPT hoặc Claude cơ bản", "Biết tiếng Anh đọc hiểu", "Tài khoản ChatGPT hoặc Claude (free)"],
    curriculum: [
      {
        id: "agent-02-m1",
        title: "Nền Tảng Prompt Engineering",
        lessons: [
          { id: "l1", title: "Anatomy của một prompt tốt: Role, Context, Task, Format", durationMin: 18, free: true },
          { id: "l2", title: "Zero-shot vs Few-shot vs Chain-of-thought", durationMin: 20, free: false },
          { id: "l3", title: "Hallucination: Nguyên nhân và cách ngăn chặn", durationMin: 15, free: false },
          { id: "l4", title: "Temperature, Top-p và các parameter quan trọng", durationMin: 12, free: false },
        ],
      },
      {
        id: "agent-02-m2",
        title: "Kỹ Thuật Nâng Cao",
        lessons: [
          { id: "l5", title: "ReAct prompting: Reason + Act", durationMin: 22, free: false },
          { id: "l6", title: "Tree of Thoughts: Giải quyết vấn đề phức tạp", durationMin: 20, free: false },
          { id: "l7", title: "Prompt chaining: Chuỗi prompt cho task phức tạp", durationMin: 18, free: false },
          { id: "l8", title: "Constitutional AI và self-critique", durationMin: 15, free: false },
        ],
      },
      {
        id: "agent-02-m3",
        title: "Ứng Dụng Thực Chiến",
        lessons: [
          { id: "l9", title: "50 prompt templates cho Marketing & Business", durationMin: 25, free: false },
          { id: "l10", title: "System prompt cho AI customer service agent", durationMin: 20, free: false },
          { id: "l11", title: "Prompt security: Jailbreak protection", durationMin: 15, free: false },
          { id: "l12", title: "Xây dựng và bán Prompt Library trên MonetAI", durationMin: 18, free: false },
        ],
      },
    ],
  },

  {
    id: "agent-03",
    title: "Multi-Agent AI Systems",
    description: "Xây dựng hệ thống đa AI Agent — CrewAI, AutoGen và MonetAI Agent Orchestrator.",
    longDescription: "Khóa học tiên tiến về Multi-Agent AI Systems. Học cách thiết kế, xây dựng và deploy hệ thống nhiều AI Agent phối hợp để giải quyết các task phức tạp mà single agent không làm được.",
    category: "AI Agent",
    instructor: "Nguyễn Công Thành",
    instructorTitle: "AI Systems Architect · PhD Computer Science",
    instructorAvatar: "🧠",
    emoji: "🧠",
    price: 999000,
    durationHours: 10,
    totalLessons: 52,
    students: 287,
    rating: 4.9,
    level: "Nâng cao",
    badge: "MỚI",
    tags: ["Multi-Agent", "CrewAI", "AutoGen", "Orchestration"],
    whatYouLearn: [
      "Architecture của Multi-Agent Systems",
      "CrewAI: Build agent teams cho business tasks",
      "AutoGen: Microsoft framework cho agent automation",
      "Agent communication và task delegation",
      "Production deployment và monitoring",
    ],
    requirements: ["Biết Python cơ bản", "Hiểu về AI Agent và prompt engineering", "API key OpenAI hoặc Anthropic"],
    curriculum: [
      {
        id: "agent-03-m1",
        title: "Multi-Agent Foundations",
        lessons: [
          { id: "l1", title: "Multi-agent architecture: Why and When", durationMin: 25, free: true },
          { id: "l2", title: "Agent roles: Planner, Executor, Critic, Specialist", durationMin: 20, free: false },
          { id: "l3", title: "Communication protocols giữa các agent", durationMin: 18, free: false },
          { id: "l4", title: "Task decomposition và routing", durationMin: 22, free: false },
        ],
      },
      {
        id: "agent-03-m2",
        title: "CrewAI Framework",
        lessons: [
          { id: "l5", title: "CrewAI setup và first crew", durationMin: 25, free: false },
          { id: "l6", title: "Defining agents: Role, Goal, Backstory, Tools", durationMin: 20, free: false },
          { id: "l7", title: "Task dependency và sequential/parallel execution", durationMin: 22, free: false },
          { id: "l8", title: "Case: Research + Write + Publish crew", durationMin: 30, free: false },
          { id: "l9", title: "Case: Sales automation crew", durationMin: 28, free: false },
        ],
      },
      {
        id: "agent-03-m3",
        title: "Production & Business",
        lessons: [
          { id: "l10", title: "Error handling và agent fallbacks", durationMin: 18, free: false },
          { id: "l11", title: "Cost optimization cho multi-agent systems", durationMin: 16, free: false },
          { id: "l12", title: "Monitoring và observability", durationMin: 20, free: false },
          { id: "l13", title: "Packaging multi-agent system thành SaaS", durationMin: 25, free: false },
        ],
      },
    ],
  },
];
